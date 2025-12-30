// src/pages/timeline/utils/dateUtils.js
// Pure date helpers for Timeline scale engine.
// All functions return NEW Date instances (no mutation leaks).

export const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export function addDays(d, days) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

export function addMonths(d, months) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + months);
  return x;
}

export function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function endOfMonth(d) {
  return endOfDay(new Date(d.getFullYear(), d.getMonth() + 1, 0));
}

export function startOfYear(d) {
  return new Date(d.getFullYear(), 0, 1);
}

export function endOfYear(d) {
  return endOfDay(new Date(d.getFullYear(), 11, 31));
}

// ISO week starts Monday.
export function startOfISOWeek(d) {
  const x = startOfDay(d);
  const day = x.getDay(); // 0 Sun..6 Sat
  const diff = (day === 0 ? -6 : 1) - day; // move to Monday
  return addDays(x, diff);
}

export function endOfISOWeek(d) {
  return endOfDay(addDays(startOfISOWeek(d), 6));
}

// ISO week number (1..52/53)
export function getISOWeekNumber(date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7; // 1..7, Monday=1
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / MS_PER_DAY + 1) / 7);
  return weekNo;
}

export function formatMonthShort(d) {
  return d.toLocaleString(undefined, { month: "short" });
}

export function pad2(n) {
  return String(n).padStart(2, "0");
}

// Inclusive day count between two dates (start..end), normalized to startOfDay.
export function daysBetweenInclusive(start, end) {
  const a = startOfDay(start).getTime();
  const b = startOfDay(end).getTime();
  const diff = Math.round((b - a) / MS_PER_DAY);
  return diff + 1;
}

// Clamp date inside [min,max]
export function clampDate(d, min, max) {
  const t = d.getTime();
  if (t < min.getTime()) return new Date(min);
  if (t > max.getTime()) return new Date(max);
  return new Date(d);
}
