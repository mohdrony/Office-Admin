// src/pages/calendar/Calendar.jsx
import "./calendar.scss";

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
  // zdt is Temporal.ZonedDateTime (from Schedule-X)
  setDraftStart(zdt);
  setDraftEnd(zdt.add({ hours: 1 }));
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
        />

        {isLoading ? <div className="calLoading">Loading…</div> : null}

        <CalendarCanvas
          events={scheduleXEvents}
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
  onSave={({ title, start, end }) => {
    // convert Temporal -> your DTO shape (ISO strings with offset)
    const id = crypto.randomUUID();

    createEvent({
      id,
      title,
      allDay: false,
      startAt: start.toString(), // includes [Europe/Berlin]
      endAt: end.toString(),
      timezone: TZ_DEFAULT,
      calendarId: "office",
    });

    setEditorOpen(false);
  }}
/>

      </div>
    </div>
  );
}
