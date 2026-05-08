import { LOCALE_TAG, type Lang } from "./index";

const cap = (s: string) => (s ? s[0].toLocaleUpperCase() + s.slice(1) : s);

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function getCurrentMonthLong(lang: Lang, date = new Date()): string {
  return cap(new Intl.DateTimeFormat(LOCALE_TAG[lang], { month: "long" }).format(date));
}

export function getCurrentMonthShort(lang: Lang, date = new Date()): string {
  return cap(new Intl.DateTimeFormat(LOCALE_TAG[lang], { month: "short" }).format(date));
}

export function getCurrentMonthNum(date = new Date()): string {
  return String(date.getMonth() + 1).padStart(2, "0");
}

export function formatDate(lang: Lang, date: Date): string {
  return new Intl.DateTimeFormat(LOCALE_TAG[lang], {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function shortMonthYear(lang: Lang, date: Date): string {
  const month = cap(
    new Intl.DateTimeFormat(LOCALE_TAG[lang], { month: "short" }).format(date)
  );
  const year = String(date.getFullYear()).slice(2);
  return `${month} ’${year}`;
}

export function shortMonth(lang: Lang, date: Date): string {
  return cap(new Intl.DateTimeFormat(LOCALE_TAG[lang], { month: "short" }).format(date));
}

const TERRAIN_AXIS_MONTHS_AGO = [12, 9, 6, 3, 0] as const;

export function getTerrainAxis(lang: Lang): string[] {
  const now = new Date();
  return TERRAIN_AXIS_MONTHS_AGO.map((monthsAgo, i, arr) => {
    const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
    const isEdge = i === 0 || i === arr.length - 1;
    return isEdge ? shortMonthYear(lang, date) : shortMonth(lang, date);
  });
}

export function getTerrainStartDate(cellsCount: number): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(today.getDate() - (cellsCount - 1));
  return start;
}

export function toLocalDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
