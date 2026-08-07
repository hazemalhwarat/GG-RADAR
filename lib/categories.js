const CATEGORIES = [
  {
    id: 'fps',
    label: 'شوتر تكتيكي',
    hint: 'CS2 (Counter-Strike 2), Valorant, and Rainbow Six Siege esports: tournament results, roster/transfer moves, official team announcements, major events.'
  },
  {
    id: 'moba',
    label: 'موبا',
    hint: 'Dota 2, League of Legends, and Honor of Kings esports: tournament results, roster/transfer moves, official announcements, major events.'
  },
  {
    id: 'mobile',
    label: 'ألعاب الموبايل',
    hint: 'PUBG Mobile, Mobile Legends: Bang Bang, and Free Fire esports: tournament results, roster/transfer moves, official announcements.'
  },
  {
    id: 'sports',
    label: 'رياضية وقتالية',
    hint: 'EA Sports FC, Street Fighter 6, Teamfight Tactics, and Rocket League esports: tournament results, roster moves, official announcements.'
  },
  {
    id: 'arab',
    label: 'المشهد العربي',
    hint: 'Arab and MENA esports scene specifically: Team Falcons, Twisted Minds, Nigma Galaxy, Geekay Esports, FATE Esports, Jordan/Saudi/UAE/Egypt esports news, and EWC 2026 (Esports World Cup, Paris) storylines involving Arab teams or organizers.'
  },
  {
    id: 'business',
    label: 'أعمال الصناعة',
    hint: 'Global esports industry and business news: acquisitions, mergers, sponsorships, organization sales, league/tournament announcements, major partnership deals.'
  }
];

const NEWS_TYPES = [
  'TRANSFER', 'ROSTER MOVE', 'TOURNAMENT', 'MATCH RESULT', 'INTERVIEW',
  'ESPORTS BUSINESS', 'OFFICIAL', 'ARAB SCENE', 'STATS', 'ANTI-CHEAT', 'EVENT'
];

function systemPromptFor(cat) {
  return `You are an esports news intelligence scanner for GGNewsAR, an Arabic-language esports media outlet based in Jordan covering the global scene with special focus on Arab teams (Team Falcons, Twisted Minds, Nigma Galaxy, Geekay Esports, FATE Esports) and events like EWC 2026 (Esports World Cup, Paris, running through Aug 23 2026).

Search the web for genuine, recent esports news (published within roughly the last 48 hours) in this category: ${cat.hint}

Do at most 2 web searches, then immediately output your findings. Do not explain your search process, do not add any preamble.

Return ONLY a raw JSON array, no markdown code fences, no commentary before or after. Up to 5 items. Each item is an object with exactly these fields:
- title_en: string, original headline in English, concise
- title_ar: string, natural Arabic translation of the headline (not literal)
- summary_ar: string, 1-2 sentence Arabic summary of the actual news, in your own words, no marketing fluff
- game: string, one of [CS2, Valorant, Dota 2, League of Legends, Overwatch 2, PUBG Mobile, Mobile Legends, EA Sports FC, Street Fighter 6, TFT, Rocket League, Rainbow Six Siege, Honor of Kings, Call of Duty, Fortnite, أخرى]
- team: string, main team/org/player involved, or "-" if general
- region: string, short Arabic label for the most relevant country/region (e.g. "الأردن", "السعودية", "كوريا الجنوبية", "أوروبا", "دولي")
- news_type: string, exactly one of [${NEWS_TYPES.join(', ')}]
- arab_relevance: boolean, true only if this directly involves an Arab team/player/organizer/region
- source_name: string, name of the publication or official source
- source_url: string, the article URL
- published: string, short relative Arabic label like "اليوم" أو "أمس" أو تاريخ قصير

If you find no genuinely recent, verifiable news for this category, return [].`;
}

function extractJsonArray(text) {
  let t = (text || '').trim().replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = t.indexOf('[');
  const end = t.lastIndexOf(']');
  if (start === -1 || end === -1) return '[]';
  return t.slice(start, end + 1);
}

module.exports = { CATEGORIES, NEWS_TYPES, systemPromptFor, extractJsonArray };
