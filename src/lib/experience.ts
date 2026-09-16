import { resumeData } from "@/data/resume";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const PRESENT = "present";

function toMonthIndex(year: number, month: number) {
  return year * 12 + month;
}

function parseMonth(value: string): number | null {
  const match = value.trim().match(/^([A-Za-z]{3})\s+(\d{4})$/);
  if (!match) return null;

  const month = MONTHS.findIndex(
    (name) => name.toLowerCase() === match[1].toLowerCase(),
  );
  if (month === -1) return null;

  return toMonthIndex(Number(match[2]), month);
}

function parsePeriod(value: string): [number, number | typeof PRESENT] | null {
  const [startRaw, endRaw] = value.split("-").map((part) => part.trim());
  if (!startRaw || !endRaw) return null;

  const start = parseMonth(startRaw);
  if (start === null) return null;

  if (endRaw.toLowerCase() === PRESENT) {
    return [start, PRESENT];
  }

  const end = parseMonth(endRaw);
  if (end === null) return null;

  return [start, end];
}

function monthIndex(now: Date) {
  return toMonthIndex(now.getFullYear(), now.getMonth());
}

function monthsInclusive(start: number, end: number) {
  return Math.max(0, end - start + 1);
}

function collectPeriods(now: Date): Array<[number, number]> {
  const intervals: Array<[number, number]> = [];
  const present = monthIndex(now);

  for (const job of resumeData.experience) {
    const dates = [job.date, ...job.promotions.map((promotion) => promotion.date)];

    for (const date of dates) {
      const period = parsePeriod(date);
      if (!period) continue;
      const [start, end] = period;
      intervals.push([start, end === PRESENT ? present : end]);
    }
  }

  return intervals.sort((a, b) => a[0] - b[0]);
}

function mergeIntervals(intervals: Array<[number, number]>): Array<[number, number]> {
  const merged: Array<[number, number]> = [];

  for (const [start, end] of intervals) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1] + 1) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }

  return merged;
}

function formatMonth(index: number) {
  const year = Math.floor(index / 12);
  const month = MONTHS[index % 12];
  return `${month} ${year}`;
}

export function formatDuration(months: number) {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];

  if (years > 0) parts.push(`${years} yr${years === 1 ? "" : "s"}`);
  if (rest > 0) parts.push(`${rest} mo${rest === 1 ? "" : "s"}`);

  return parts.length > 0 ? parts.join(" ") : "1 mo";
}

export function roleDuration(date: string, now: Date = new Date()) {
  const period = parsePeriod(date);
  if (!period) return null;

  const [start, end] = period;
  return formatDuration(monthsInclusive(start, end === PRESENT ? monthIndex(now) : end));
}

export function totalExperience(now: Date = new Date()) {
  const merged = mergeIntervals(collectPeriods(now));
  const months = merged.reduce(
    (sum, [start, end]) => sum + monthsInclusive(start, end),
    0,
  );
  const start = merged.length > 0 ? merged[0][0] : monthIndex(now);

  return {
    months,
    label: `${Math.floor(months / 12)}+ years`,
    sinceLabel: formatMonth(start),
  };
}
