// Sentence timeline. Times are in seconds.
// PLACEHOLDER timings until the narration is recorded and analyzed.
export const FPS = 30;

export type Line = {
  text: string;
  start: number;
  end: number;
  // Caption chunks. When omitted, the text is split automatically.
  chunks?: string[];
};

export const LINES: Line[] = [
  {text: 'לפני שנה הנחתי כוס קפה אחת על השולחן.', start: 0.4, end: 3.6},
  {
    text: 'עשיתי חוזה עם הקב״ה: פעם בחודש, שעתיים איתי, במתנה. בלי למכור. רק לתת.',
    start: 3.9,
    end: 10.2,
    chunks: ['עשיתי חוזה עם הקב״ה:', 'פעם בחודש, שעתיים איתי, במתנה.', 'בלי למכור. רק לתת.'],
  },
  {text: 'חשבתי שיירשמו שבעים נשים.', start: 10.5, end: 12.6},
  {text: 'נרשמו שלוש מאות וחמישים.', start: 12.9, end: 15.4},
  {
    text: 'ואז הבנתי. יש כל כך הרבה נשים עם אור שמבקש לצאת לאור.',
    start: 15.9,
    end: 20.6,
    chunks: ['ואז הבנתי.', 'יש כל כך הרבה נשים', 'עם אור שמבקש לצאת לאור.'],
  },
  {text: 'ואני אחת.', start: 20.9, end: 22.3},
  {text: 'ככה נולד הבוט של יוצאת לאור.', start: 22.7, end: 25.2},
  {
    text: 'שליחות של אחד על אחד הפכה לנר לאחד, נר למאה.',
    start: 25.6,
    end: 29.8,
    chunks: ['שליחות של אחד על אחד', 'הפכה לנר לאחד, נר למאה.'],
  },
  {
    text: 'מאז, שתים עשרה נשים זכו לשבת איתי ליד השולחן.',
    start: 30.2,
    end: 34.2,
    chunks: ['מאז, שתים עשרה נשים', 'זכו לשבת איתי ליד השולחן.'],
  },
  {
    text: 'והשבוע אחת הנשים שיתפה מה הבוט פתח אצלה. וחזרתי שנה אחורה, לרגע שבו לא ידעתי לאן זה יוביל.',
    start: 34.6,
    end: 42.4,
    chunks: [
      'והשבוע אחת הנשים שיתפה',
      'מה הבוט פתח אצלה.',
      'וחזרתי שנה אחורה,',
      'לרגע שבו לא ידעתי לאן זה יוביל.',
    ],
  },
  {text: 'במוצאי שבת בראשית, מתחילים מחדש.', start: 42.9, end: 45.8},
  {
    text: 'אני סקרנית מי תשב איתי הפעם, ולאן הקב״ה יוביל אותי מכאן.',
    start: 46.2,
    end: 51.2,
    chunks: ['אני סקרנית מי תשב איתי הפעם,', 'ולאן הקב״ה יוביל אותי מכאן.'],
  },
  {text: 'אולי זו את?', start: 51.8, end: 53.6},
];

// End card after the last line.
export const END_CARD_START = 54.2;
export const TOTAL_SECONDS = 60;

export const sec = (s: number) => Math.round(s * FPS);

// Narration file in /public. Set to the file name once recorded, e.g. 'narration.m4a'.
export const NARRATION_FILE: string | null = null;
export const MUSIC_FILE: string | null = 'music.wav';
