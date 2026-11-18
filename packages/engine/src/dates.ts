/**
 * Calendar helpers on YYYY-MM-DD strings. All arithmetic is done in UTC so a plan never shifts
 * by a day because of the server's or browser's time zone.
 */
export type IsoDate = string;

const DAY_MS = 86_400_000;

export function parseIso(d: IsoDate): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
  if (!m) throw new Error(`Invalid date '${d}', expected YYYY-MM-DD`);
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

export function toIso(ms: number): IsoDate {
  return new Date(ms).toISOString().slice(0, 10);
}

export function addDays(d: IsoDate, days: number): IsoDate {
  return toIso(parseIso(d) + days * DAY_MS);
}

/** Monday = 0 .. Sunday = 6, like Python's date.weekday(). */
export function weekday(d: IsoDate): number {
  return (new Date(parseIso(d)).getUTCDay() + 6) % 7;
}

export function mondayOf(d: IsoDate): IsoDate {
  return addDays(d, -weekday(d));
}

/** Whole days from a to b (b - a). */
export function daysBetween(a: IsoDate, b: IsoDate): number {
  return Math.round((parseIso(b) - parseIso(a)) / DAY_MS);
}

/** ISO week number, for labels such as W47. */
export function isoWeekNo(d: IsoDate): number {
  const thursday = addDays(d, 3 - weekday(d));
  const jan1 = `${thursday.slice(0, 4)}-01-01`;
  return Math.floor(daysBetween(jan1, thursday) / 7) + 1;
}

/** Friday to Sunday plan the coming week; Monday to Thursday the current one. */
export function defaultProductionWeek(today: IsoDate): IsoDate {
  return addDays(mondayOf(today), weekday(today) >= 4 ? 7 : 0);
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SHIFT_NAMES = ['A', 'B'];

export function shiftLabel(idx: number): string {
  return `${DAY_NAMES[Math.floor(idx / SHIFT_NAMES.length)]} ${SHIFT_NAMES[idx % SHIFT_NAMES.length]}`;
}
