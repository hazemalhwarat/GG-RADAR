const { GoogleGenAI } = require('@google/genai');
const { CATEGORIES, systemPromptFor, extractJsonArray } = require('../lib/categories');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({ error: 'GEMINI_API_KEY غير مضبوط على السيرفر. أضفه من إعدادات المشروع في Vercel.' });
    return;
  }

  const { categoryId } = req.body || {};
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) {
    res.status(400).json({ error: 'تصنيف غير معروف' });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const interaction = await ai.interactions.create({
      model: 'gemini-2.5-flash',
      system_instruction: systemPromptFor(cat),
      input: 'ابحث الآن وأعد النتائج بصيغة JSON فقط كما هو موضح أعلاه.',
      tools: [{ type: 'google_search' }]
    });

    const text = interaction.output_text || '';
    const items = JSON.parse(extractJsonArray(text));

    res.status(200).json({ items });
  } catch (err) {
    console.error('scan error for category', categoryId, err);
    res.status(500).json({ error: (err && err.message) || 'حدث خطأ أثناء الاتصال بـ Gemini' });
  }
};
