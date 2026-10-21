// Lyric timing measured from the real recording (vocal stem onsets + per-phrase
// transcription). Times in seconds from the start of the audio file.
// t0 = first sung syllable, t1 = end of the phrase. `focus` marks words that
// become graphic accents, with the time the word is sung.
const LINES = [
  { id: 'v1a', t0: 17.00, t1: 19.75, text: 'קול ברמה נשמע' },
  { id: 'v1b', t0: 21.38, t1: 24.88, text: 'נהי בכי תמרורים' },
  { id: 'v1c', t0: 26.37, t1: 29.30, text: 'אמא, אני לא רוצה' },
  { id: 'v1d', t0: 30.78, t1: 34.32, text: 'לא רוצה את הלחם הזה' },
  { id: 'p1a', t0: 36.20, t1: 43.65, text: 'מאנה להיכנע על רצונה כי איננו' },
  { id: 'p1b', t0: 44.71, t1: 51.81, text: 'מאנה להיכנע על רצונה כי איננו' },
  { id: 'c1a', t0: 52.44, t1: 55.45, text: 'מנעי קולך מבכי' },
  { id: 'c1b', t0: 55.99, t1: 58.68, text: 'ועינייך מדמעה' },
  { id: 'c1c', t0: 59.10, t1: 61.93, text: 'כי יש בחירה כאן בביתי', focus: { 'בחירה': 59.62 } },
  { id: 'c1d', t0: 62.26, t1: 65.60, text: 'ולא כל לא! זו מלחמה', focus: { 'לא!': 63.14, 'זו': 63.72, 'מלחמה': 63.91 } },
];

const T = Object.fromEntries(LINES.map(l => [l.id, l]));

if (typeof module !== 'undefined') module.exports = { LINES, T };
