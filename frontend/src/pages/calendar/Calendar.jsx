// src/pages/calendar/Calendar.jsx
import "./calendar.scss";
import "./calendarOverrides.css";

import { useCallback, useMemo, useState } from "react";
import useCalendarEvents from "./hooks/useCalendarEvents";
import CalendarCanvas from "./components/CalendarCanvas";
import CalendarToolbar from "./components/CalendarToolbar";
import EventEditor from "./components/EventEditor";
import { TZ_DEFAULT } from "./types";

function toJSDate(anyTemporalOrString) {
  if (!anyTemporalOrString) return null;

  // If Schedule-X gives us YYYY-MM-DD
  if (typeof anyTemporalOrString === "string") {
    return new Date(anyTemporalOrString + "T00:00:00");
  }

  // Temporal.PlainDate
  if (anyTemporalOrString?.getISOFields && anyTemporalOrString?.calendarId) {
    // PlainDate has year/month/day directly
    if (
      typeof anyTemporalOrString.year === "number" &&
      typeof anyTemporalOrString.month === "number" &&
      typeof anyTemporalOrString.day === "number"
    ) {
      const { year, month, day } = anyTemporalOrString;
      return new Date(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00`);
    }
  }

  // Temporal.ZonedDateTime
  if (anyTemporalOrString?.toPlainDate) {
    const d = anyTemporalOrString.toPlainDate();
    const { year, month, day } = d;
    return new Date(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00`);
  }

  return null;
}

function formatTitleFromRange(range, view) {
  if (!range?.start || !range?.end) return "Calendar";

  const startJs = toJSDate(range.start);
  const endJs = toJSDate(range.end);

  if (!startJs || !endJs) return "Calendar";

  if (view === "month-grid") {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(startJs);
  }

  const fmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });

  return `${fmt.format(startJs)} – ${fmt.format(endJs)}`;
}


function todayPlainDate() {
  // Temporal is global because we imported temporal-polyfill/global in CalendarCanvas
  return Temporal.Now.plainDateISO(TZ_DEFAULT);
}



export default function Calendar() {
  const { isLoading, scheduleXEvents, createEvent } = useCalendarEvents();

  const [controls, setControls] = useState(null);

  // our UI state (source of truth for navigation)
  const [activeView, setActiveView] = useState("week"); // "day" | "week" | "month-grid"
  const [cursorDate, setCursorDate] = useState(() => todayPlainDate());
  const [range, setRange] = useState(null);

  const [editorOpen, setEditorOpen] = useState(false);
  const [draftStart, setDraftStart] = useState(null);
  const [draftEnd, setDraftEnd] = useState(null);

  const openCreateAt = useCallback((zdt) => {
    // Round to nearest half hour
    // zdt is Temporal.ZonedDateTime or has similar API
    const minute = zdt.minute;
    let newMinute = 0;

    if (minute >= 15 && minute < 45) {
      newMinute = 30;
    } else if (minute >= 45) {
      newMinute = 0;
      // Increment hour if rounding up, but simplest is usually floor/ceil.
      // User asked: "if click between 7-8 default 7" -> Suggests floor logic or nearest slot logic?
      // "click somewhere between 7-8 default start time would say 7 and end 8"
      // Actually user said "half hour would be nice".
      // Let's implement rounding to nearest 30 mins (00 or 30).

      // Actually, if minute >= 45, we should go to next hour? 
      // User example "between 7-8 default 7" suggests flooring?
      // "if user clicks somewhere between 7 - 8 the default start time would say 7"
      // BUT "i don't want exactly minute accurate but half hour would be nice"
      // Let's stick to standard nearest half-hour snapping:
      // 0-14 -> 00, 15-44 -> 30, 45-59 -> next hour 00
      zdt = zdt.add({ hours: 1 });
    }

    const start = zdt.with({ minute: newMinute, second: 0, millisecond: 0 });
    setDraftStart(start);
    setDraftEnd(start.add({ hours: 1 }));
    setEditorOpen(true);
  }, []);

  const openCreateAllDay = useCallback((plainDate) => {
    // month grid clicks give Temporal.PlainDate
    const start = plainDate.toZonedDateTime({ timeZone: TZ_DEFAULT, plainTime: "09:00" });
    setDraftStart(start);
    setDraftEnd(start.add({ hours: 1 }));
    setEditorOpen(true);
  }, []);


  const title = useMemo(
    () => formatTitleFromRange(range, activeView),
    [range, activeView]
  );

  const applyDate = useCallback(
    (d) => {
      setCursorDate(d);
      controls?.setDate?.(d); // official API
    },
    [controls]
  );

  const onToday = useCallback(() => applyDate(todayPlainDate()), [applyDate]);

  const onPrev = useCallback(() => {
    const step =
      activeView === "day"
        ? { days: 1 }
        : activeView === "week"
          ? { days: 7 }
          : { months: 1 };

    applyDate(cursorDate.subtract(step));
  }, [activeView, cursorDate, applyDate]);

  const onNext = useCallback(() => {
    const step =
      activeView === "day"
        ? { days: 1 }
        : activeView === "week"
          ? { days: 7 }
          : { months: 1 };

    applyDate(cursorDate.add(step));
  }, [activeView, cursorDate, applyDate]);

  const onSetView = useCallback(
    (viewName) => {
      setActiveView(viewName);
      controls?.setView?.(viewName); // official API
      // keep date stable across view changes
      controls?.setDate?.(cursorDate);
    },
    [controls, cursorDate]
  );

  // Calendar Visibility State
  const CALENDARS = useMemo(() => [
    { id: 'office', label: 'Office', color: '#4ea1ff' },
    { id: 'projects', label: 'Projects', color: '#5ee38b' },
    { id: 'vacation', label: 'Vacation', color: '#ff4e4e' },
  ], []);

  const [visibleCalendars, setVisibleCalendars] = useState(() => new Set(['office', 'projects', 'vacation']));

  const toggleCalendar = useCallback((id) => {
    setVisibleCalendars(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Filter events based on visibility
  const filteredEvents = useMemo(() => {
    return scheduleXEvents.filter(e => visibleCalendars.has(e.calendarId));
  }, [scheduleXEvents, visibleCalendars]);

  return (
    <div className="calendarPage">
      <div className="calendarSurface">
        <CalendarToolbar
          title={title}
          activeView={activeView}
          onPrev={onPrev}
          onNext={onNext}
          onToday={onToday}
          onSetView={onSetView}
          calendars={CALENDARS}
          visibleCalendars={visibleCalendars}
          onToggleCalendar={toggleCalendar}
          onOpenCreate={() => {
            // Default to now rounded
            const now = Temporal.Now.zonedDateTimeISO(TZ_DEFAULT);
            openCreateAt(now);
          }}
        />

        {isLoading ? <div className="calLoading">Loading…</div> : null}

        <CalendarCanvas
          events={filteredEvents}
          onReady={({ controls, range }) => {
            if (controls) setControls(controls);
            if (range) setRange(range);
          }}
          onClickDateTime={openCreateAt}
          onClickDate={openCreateAllDay}
        />

        <EventEditor
          open={editorOpen}
          mode="create"
          initialStart={draftStart}
          initialEnd={draftEnd}
          onClose={() => setEditorOpen(false)}
          calendars={CALENDARS} // Pass calendars for selector
          onSave={({ title, start, end, allDay, calendarId }) => {
            // convert Temporal -> your DTO shape (ISO strings with offset)
            const id = crypto.randomUUID();

            createEvent({
              id,
              title,
              allDay,
              startAt: start.toString(), // includes [Europe/Berlin]
              endAt: end.toString(),
              timezone: TZ_DEFAULT,
              calendarId,
            });

            setEditorOpen(false);
          }}
        />

      </div>
    </div>
  );
}
