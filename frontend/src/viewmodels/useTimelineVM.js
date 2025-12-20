import { useMemo, useState } from "react";

const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const dayNames = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const startOfYear = (d) => new Date(d.getFullYear(), 0, 1);
const endOfYear = (d) => new Date(d.getFullYear(), 11, 31);

const startOfISOWeek = (d) => {
  const date = new Date(d);
  const day = date.getDay(); // 0 Sun..6 Sat
  const diff = (day === 0 ? -6 : 1) - day; // to Monday
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
};
const endOfISOWeek = (d) => addDays(startOfISOWeek(d), 6);

// title helper
const getISOWeek = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

export default function useTimelineVM() {
  const [view, setView] = useState("year"); // "year" | "month" | "week"
  const [cursorDate, setCursorDate] = useState(new Date());

  const range = useMemo(() => {
    if (view === "year") return { start: startOfYear(cursorDate), end: endOfYear(cursorDate) };
    if (view === "month") return { start: startOfMonth(cursorDate), end: endOfMonth(cursorDate) };
    return { start: startOfISOWeek(cursorDate), end: endOfISOWeek(cursorDate) };
  }, [view, cursorDate]);

  const title = useMemo(() => {
    const y = cursorDate.getFullYear();
    if (view === "year") return `Year ${y}`;
    if (view === "month") return `Month ${monthNames[cursorDate.getMonth()]} ${y}`;
    return `Calendar Week ${String(getISOWeek(cursorDate)).padStart(2, "0")} · ${y}`;
  }, [view, cursorDate]);

  const cols = useMemo(() => {
    if (view === "year") {
      return Array.from({ length: 52 }, (_, i) => `KW${String(i + 1).padStart(2, "0")}`);
    }
    if (view === "month") {
      const daysInMonth = new Date(range.start.getFullYear(), range.start.getMonth() + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
    }
    return dayNames.map((dn, i) => {
      const d = addDays(range.start, i);
      return `${dn} ${d.getDate()}`;
    });
  }, [view, range.start]);

  const colWidth = useMemo(() => {
    if (view === "year") return 28;
    if (view === "month") return 24;
    return 90;
  }, [view]);

  const goPrev = () => {
    setCursorDate((d) => {
      if (view === "year") return new Date(d.getFullYear() - 1, d.getMonth(), d.getDate());
      if (view === "month") return new Date(d.getFullYear(), d.getMonth() - 1, d.getDate());
      return addDays(d, -7);
    });
  };

  const goNext = () => {
    setCursorDate((d) => {
      if (view === "year") return new Date(d.getFullYear() + 1, d.getMonth(), d.getDate());
      if (view === "month") return new Date(d.getFullYear(), d.getMonth() + 1, d.getDate());
      return addDays(d, 7);
    });
  };

  return {
    view,
    setView,
    cursorDate,
    setCursorDate,
    visibleStart: range.start,
    visibleEnd: range.end,
    cols,
    colWidth,
    title,
    goPrev,
    goNext,
  };
}
