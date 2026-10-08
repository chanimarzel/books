// Sentence timeline synced to public/narration.mp3.
// Chunk times come from ffmpeg silencedetect (noise=-35dB, d=0.25), in seconds
// relative to the narration file. NARRATION_OFFSET shifts everything in the video.
export const FPS = 30;
export const NARRATION_OFFSET = 0.6;

export type Chunk = {text: string; start: number; end: number};
export type Line = {chunks: Chunk[]; start: number; end: number};

const c = (text: string, start: number, end: number): Chunk => ({
  text,
  start: start + NARRATION_OFFSET,
  end: end + NARRATION_OFFSET,
});

// One spoken segment that holds several caption chunks: split its time by text length.
const split = (texts: string[], start: number, end: number): Chunk[] => {
  const total = texts.reduce((a, t) => a + t.length, 0);
  let t = start;
  return texts.map((text) => {
    const d = ((end - start) * text.length) / total;
    const ch = c(text, t, t + d);
    t += d;
    return ch;
  });
};

const line = (...chunks: (Chunk | Chunk[])[]): Line => {
  const flat = chunks.flat();
  return {chunks: flat, start: flat[0].start, end: flat[flat.length - 1].end};
};

export const LINES: Line[] = [
  line(c('לפני שנה הנחתי כוס קפה אחת על השולחן.', 0.0, 2.86)),
  line(
    c('עשיתי חוזה שת״פ עם הקב״ה:', 3.42, 5.61),
    c('פעם בחודש, שעתיים איתי,', 6.27, 8.09),
    c('במתנה.', 8.46, 8.97),
    c('בלי למכור.', 9.39, 9.98),
    c('רק לתת.', 10.37, 10.86),
  ),
  line(c('חשבתי שיירשמו שבעים נשים.', 11.75, 13.47)),
  line(c('נרשמו שלוש מאות וחמישים.', 13.94, 15.75)),
  line(c('ואז הבנתי.', 16.43, 17.19), split(['יש כל כך הרבה נשים', 'עם אור שמבקש לצאת לאור.'], 17.81, 21.19)),
  line(c('ואני אחת.', 21.68, 22.26)),
  line(c('ככה נולד הבוט של יוצאת לאור.', 23.15, 24.97)),
  line(c('שליחות של אחד על אחד', 25.5, 26.84), c('הפכה לנר לאחד, נר למאה.', 27.12, 29.41)),
  line(c('מאז,', 30.1, 30.55), split(['שתים עשרה נשים', 'זכו לשבת איתי ליד השולחן.'], 30.85, 33.37)),
  line(
    c('והשבוע', 33.89, 34.53),
    split(['אחת הנשים שיתפה', 'מה הבוט פתח אצלה.'], 34.84, 37.18),
    c('וחזרתי שנה אחורה,', 37.73, 38.96),
    c('לרגע שבו לא ידעתי לאן זה יוביל.', 39.38, 41.28),
  ),
  line(c('במוצאי שבת בראשית,', 41.99, 43.19), c('מתחילים מחדש.', 43.54, 44.5)),
  line(c('אני סקרנית מי תשב איתי הפעם,', 45.05, 46.78), c('ולאן הקב״ה יוביל אותי מכאן.', 47.11, 49.16)),
  line(c('אולי זו את?', 49.79, 50.32)),
];

// End card after the last line.
export const END_CARD_START = 52.0;
export const TOTAL_SECONDS = 57;

export const sec = (s: number) => Math.round(s * FPS);

export const ALL_CHUNKS = LINES.flatMap((l) => l.chunks);
export const chunkAt = (prefix: string) => {
  const ch = ALL_CHUNKS.find((x) => x.text.startsWith(prefix));
  if (!ch) throw new Error(`No chunk starting with ${prefix}`);
  return ch;
};

export const NARRATION_FILE: string | null = 'narration.mp3';
export const MUSIC_FILE: string | null = 'music.wav';
