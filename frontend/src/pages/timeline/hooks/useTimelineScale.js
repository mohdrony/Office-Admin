// src/pages/timeline/hooks/useTimelineScale.js
import { useMemo } from "react";
import {
  addDays,
  addMonths,
  clampDate,
  daysBetweenInclusive,
  endOfDay,
  endOfISOWeek,
  endOfMonth,
  endOfYear,
  formatMonthShort,
  getISOWeekNumber,
  pad2,
  startOfDay,
  startOfISOWeek,
  startOfMonth,
  startOfYear,
} from "../utils/dateUtils";

// Modes we support
export const TL_MODE = {
  YEAR: "year", // months + KW ticks
  MONTH: "month", // days + week marks + weekend
  WEEK: "week", // 7 days
  CALENDAR_WEEKS: "calendarWeeks", // KW columns + month marks
  WHOLE: "whole", // adaptive window (months)
};

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * Scale engine output contract:
 * - rangeStart/rangeEnd define the visible time range.
 * - columns define discrete time slots (month/day/week).
 * - markers define strong separators and labels (month/week/today).
 * - dateToX maps a date -> x px inside the scroll content.
 */
export default function useTimelineScale({
  mode,
  cursorDate,
  wholeWindow, // { start: Date, end: Date } only used for WHOLE
  availableWidthPx, // width of timeline canvas area (not including project column)
  minColWidthPx = 46, // min readable column width for "fit" modes
}) {
  return useMemo(() => {
    const today = startOfDay(new Date());

    // 1) Compute rangeStart/rangeEnd
    let rangeStart;
    let rangeEnd;

    if (mode === TL_MODE.YEAR) {
      rangeStart = startOfYear(cursorDate);
      rangeEnd = endOfYear(cursorDate);
    } else if (mode === TL_MODE.MONTH) {
      rangeStart = startOfMonth(cursorDate);
      rangeEnd = endOfMonth(cursorDate);
    } else if (mode === TL_MODE.WEEK) {
      rangeStart = startOfISOWeek(cursorDate);
      rangeEnd = endOfISOWeek(cursorDate);
    } else if (mode === TL_MODE.CALENDAR_WEEKS) {
      // Calendar weeks view: show all ISO weeks in the year of cursorDate.
      // We approximate using Jan 1..Dec 31 then mark KW columns.
      rangeStart = startOfYear(cursorDate);
      rangeEnd = endOfYear(cursorDate);
    } else {
      // WHOLE
      const ws = wholeWindow?.start
        ? startOfDay(wholeWindow.start)
        : addMonths(today, -6);
      const we = wholeWindow?.end
        ? endOfDay(wholeWindow.end)
        : endOfDay(addMonths(today, 18));
      rangeStart = ws;
      rangeEnd = we;
    }

    // 2) Build columns based on mode
    let columns = [];

    if (mode === TL_MODE.YEAR || mode === TL_MODE.WHOLE) {
      // Months as columns
      const start = startOfMonth(rangeStart);
      const end = startOfMonth(rangeEnd);

      let cur = start;
      while (cur.getTime() <= end.getTime()) {
        const colStart = cur;
        const colEnd = endOfMonth(cur);
        columns.push({
          key: `${colStart.getFullYear()}-${pad2(colStart.getMonth() + 1)}`,
          start: colStart,
          end: colEnd,
          labelTop: `${formatMonthShort(colStart)} ${colStart.getFullYear()}`,
          labelBottom: "",
          isWeekend: false,
          isMonthStart: true,
          isWeekStart: false,
        });
        cur = addMonths(cur, 1);
      }
    } else if (mode === TL_MODE.MONTH) {
      // Days as columns
      const totalDays = daysBetweenInclusive(rangeStart, rangeEnd);
      for (let i = 0; i < totalDays; i++) {
        const d = addDays(rangeStart, i);
        const dow = d.getDay(); // 0 Sun..6 Sat
        const isWeekend = dow === 0 || dow === 6;
        const isWeekStart =
          startOfISOWeek(d).getTime() === startOfDay(d).getTime(); // Monday
        const weekNo = getISOWeekNumber(d);

        columns.push({
          key: d.toISOString().slice(0, 10),
          start: startOfDay(d),
          end: endOfDay(d),
          labelTop: String(d.getDate()),
          labelBottom: isWeekStart ? `KW${pad2(weekNo)}` : "",
          isWeekend,
          isMonthStart: d.getDate() === 1,
          isWeekStart,
        });
      }
    } else if (mode === TL_MODE.WEEK) {
      // 7 days as columns
      for (let i = 0; i < 7; i++) {
        const d = addDays(rangeStart, i);
        const dow = d.getDay();
        const isWeekend = dow === 0 || dow === 6;

        columns.push({
          key: d.toISOString().slice(0, 10),
          start: startOfDay(d),
          end: endOfDay(d),
          labelTop: `${DAY_NAMES[i]} ${d.getDate()}`,
          labelBottom: "",
          isWeekend,
          isMonthStart: d.getDate() === 1,
          isWeekStart: i === 0,
        });
      }
    } else if (mode === TL_MODE.CALENDAR_WEEKS) {
      // ISO weeks as columns (KW01..KW52/53).
      // Build weeks starting from the ISO week that contains Jan 4th (ISO definition anchor).
      const y = cursorDate.getFullYear();
      const jan4 = new Date(y, 0, 4);
      let curWeekStart = startOfISOWeek(jan4);

      // We will generate weeks while the weekStart is in year y OR week overlaps year y.
      // Cap at 54 to be safe.
      for (let i = 0; i < 54; i++) {
        const ws = curWeekStart;
        const we = endOfISOWeek(ws);

        // stop when week start is beyond Dec 31 and week doesn't overlap year
        const dec31 = new Date(y, 11, 31);
        if (ws.getFullYear() > y && ws.getTime() > endOfDay(dec31).getTime())
          break;

        const weekNo = getISOWeekNumber(ws);

        // month mark: if the Monday is within first 7 days of a month boundary
        const isMonthStartWeek = ws.getDate() <= 7;

        columns.push({
          key: `KW${pad2(weekNo)}-${y}-${i}`,
          start: ws,
          end: we,
          labelTop: `KW${pad2(weekNo)}`,
          labelBottom: isMonthStartWeek ? formatMonthShort(ws) : "",
          isWeekend: false,
          isMonthStart: isMonthStartWeek,
          isWeekStart: true,
        });

        curWeekStart = addDays(curWeekStart, 7);
      }

      // adjust rangeStart/rangeEnd to match the generated weeks exactly
      if (columns.length) {
        rangeStart = columns[0].start;
        rangeEnd = columns[columns.length - 1].end;
      }
    }

    const colCount = columns.length || 1;

    // 3) Compute whether we fit or need scroll
    // Content width depends on column model.
    // If content would be narrower than available, we stretch to fill width.
    let colWidthPx = minColWidthPx;
    let contentWidthPx = colCount * colWidthPx;

    if (availableWidthPx && contentWidthPx < availableWidthPx) {
      colWidthPx = Math.floor(availableWidthPx / colCount);
      contentWidthPx = colCount * colWidthPx;
    }

    const needsScroll = !!availableWidthPx && contentWidthPx > availableWidthPx;

    // 4) Build markers (strong lines)
    // We'll emit markers per column boundaries (month/week) + today marker if in range.
    const markers = [];

    for (let i = 0; i < colCount; i++) {
      const c = columns[i];
      if (c.isMonthStart) {
        markers.push({
          type: "month",
          date: c.start,
          label:
            mode === TL_MODE.YEAR || mode === TL_MODE.WHOLE
              ? ""
              : formatMonthShort(c.start),
        });
      }
      if (c.isWeekStart && mode === TL_MODE.MONTH) {
        markers.push({
          type: "week",
          date: c.start,
          label: `KW${pad2(getISOWeekNumber(c.start))}`,
        });
      }
    }

    // Today marker
    if (
      today.getTime() >= startOfDay(rangeStart).getTime() &&
      today.getTime() <= startOfDay(rangeEnd).getTime()
    ) {
      markers.push({ type: "today", date: today, label: "Today" });
    }

    // 5) Mapping helpers
    const dateToX = (d) => {
      const t = clampDate(startOfDay(d), rangeStart, rangeEnd).getTime();
      const startT = rangeStart.getTime();

      if (mode === TL_MODE.MONTH || mode === TL_MODE.WEEK) {
        // day-based: map by days
        const dayIndex = Math.round((t - startT) / (24 * 60 * 60 * 1000));
        return dayIndex * colWidthPx;
      }

      // column-based: find the column that contains this date
      for (let i = 0; i < columns.length; i++) {
        const c = columns[i];
        if (t >= c.start.getTime() && t <= c.end.getTime())
          return i * colWidthPx;
      }
      // fallback
      return 0;
    };

    const spanToXW = (start, end) => {
      const x1 = dateToX(start);
      const x2 = dateToX(end);
      const w = Math.max(colWidthPx, x2 - x1 + colWidthPx);
      return { x: x1, w };
    };

    return {
      rangeStart,
      rangeEnd,
      columns,
      markers,
      colWidthPx,
      contentWidthPx,
      needsScroll,
      dateToX,
      spanToXW,
      today,
    };
  }, [mode, cursorDate, wholeWindow, availableWidthPx, minColWidthPx]);
}
