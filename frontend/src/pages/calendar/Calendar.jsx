// src/pages/calendar/Calendar.jsx
import "./calendar.scss";
import "./calendarOverrides.css";

import { useCallback, useMemo, useState } from "react";
import useCalendarEvents from "./hooks/useCalendarEvents";
import CalendarCanvas from "./components/CalendarCanvas";
import CalendarToolbar from "./components/CalendarToolbar";
import EventEditor from "./components/EventEditor";
import EventDetailModal from "./components/EventDetailModal";
import { TZ_DEFAULT } from "./types";

function toJSDate(anyTemporalOrString) {
  if (!anyTemporalOrString) return null;

  // If Schedule-X gives us YYYY-MM-DD or YYYY-MM-DD HH:mm
  if (typeof anyTemporalOrString === "string") {
    // If it looks like it has time (length > 10), treat as ISO-ish
    if (anyTemporalOrString.length > 10) {
      return new Date(anyTemporalOrString.replace(" ", "T"));
    }
    // Otherwise assume Date-only
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
  const { isLoading, scheduleXEvents, createEvent, updateEvent, deleteEvent } = useCalendarEvents();

  const [controls, setControls] = useState(null);

  // our UI state (source of truth for navigation)
  const [activeView, setActiveView] = useState("week"); // "day" | "week" | "month-grid"
  const [cursorDate, setCursorDate] = useState(() => todayPlainDate());
  const [range, setRange] = useState(null);

  const [editorOpen, setEditorOpen] = useState(false);
  const [draftStart, setDraftStart] = useState(null);
  const [draftEnd, setDraftEnd] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftCalendarId, setDraftCalendarId] = useState("office");
  const [draftId, setDraftId] = useState(null); // ID of event being edited
  const [editMode, setEditMode] = useState("create"); // "create" | "edit"

  const [selectedEvent, setSelectedEvent] = useState(null); // For detail modal

  const openCreateAt = useCallback((zdtOrString) => {
    // Defensive check
    if (!zdtOrString) return;

    // Schedule-X might return a string (YYYY-MM-DD HH:mm)
    let zdt;
    try {
      if (typeof zdtOrString === 'string') {
        zdt = Temporal.PlainDateTime.from(zdtOrString.replace(' ', 'T')).toZonedDateTime(TZ_DEFAULT);
      } else {
        zdt = zdtOrString;
      }
    } catch (e) {
      console.error("Invalid date passed to openCreateAt", zdtOrString, e);
      return;
    }

    if (!zdt || !zdt.minute) {
      console.warn("openCreateAt: zdt is not a Temporal object", zdt);
      return;
    }

    // Round to nearest half hour
    // zdt is Temporal.ZonedDateTime or has similar API
    const minute = zdt.minute;
    let newMinute = 0;

    if (minute >= 15 && minute < 45) {
      newMinute = 30;
    } else if (minute >= 45) {
      newMinute = 0;
      zdt = zdt.add({ hours: 1 });
    }

    const start = zdt.with({ minute: newMinute, second: 0, millisecond: 0 });
    setDraftStart(start);
    setDraftEnd(start.add({ hours: 1 }));
    setDraftTitle("");
    setDraftCalendarId("office");
    setEditorOpen(true);
    setEditMode("create");
  }, []);

  const openCreateAllDay = useCallback((plainDateOrString) => {
    if (!plainDateOrString) return;

    let plainDate;
    try {
      if (typeof plainDateOrString === 'string') {
        plainDate = Temporal.PlainDate.from(plainDateOrString);
      } else {
        plainDate = plainDateOrString;
      }
    } catch (e) {
      console.error("Invalid date passed to openCreateAllDay", plainDateOrString, e);
      return;
    }

    if (!plainDate) return;

    // month grid clicks give Temporal.PlainDate
    const start = plainDate.toZonedDateTime({ timeZone: TZ_DEFAULT, plainTime: "09:00" });
    setDraftStart(start);
    setDraftEnd(start.add({ hours: 1 }));
    setDraftTitle("");
    setDraftCalendarId("office");
    setEditorOpen(true);
    setEditMode("create");
  }, []);

  const handleEventClick = useCallback((calendarEvent) => {
    setSelectedEvent(calendarEvent);
  }, []);

  const handleEditFromDetail = useCallback(() => {
    if (!selectedEvent) return;

    // selectedEvent has { id, title, start, end, calendarId } (strings)
    // We need to parse strings back to Temporal/Date for the Editor
    // Our Editor expects Temporal.ZonedDateTime for initialStart/End
    // But let's check what format the event strings are in. Likely YYYY-MM-DD HH:mm

    // Simplest is to pass ISO strings if Editor supports it, or parse here.
    // EventEditor uses `toLocalInputValue` which expects ZonedDateTime.
    // Let's create ZDT from the strings.

    try {
      const safeStart = selectedEvent.start.replace(' ', 'T');
      const safeEnd = selectedEvent.end.replace(' ', 'T');
      const start = Temporal.PlainDateTime.from(safeStart).toZonedDateTime(TZ_DEFAULT);
      const end = Temporal.PlainDateTime.from(safeEnd).toZonedDateTime(TZ_DEFAULT);

      setDraftStart(start);
      setDraftEnd(end);
      setDraftTitle(selectedEvent.title);
      setDraftCalendarId(selectedEvent.calendarId);
      setDraftId(selectedEvent.id);
      setEditMode("edit"); // We need to update Editor to support this or pass it properly
      // For now, let's just re-use the create flow but pre-fill data effectively
      // or we can add an "edit" mode to Editor if we want to support updates (requires ID).

      // We'll set the title manually via props or state? 
      // EventEditor takes `initialStart/End`. Title is internal state.
      // We might need to refactor EventEditor slightly to accept `initialValues` prop object.
      // FOR NOW: Let's just open it and see. The user said "like a detail view... with edit button".
      // We actually need to pass the *existing* event ID to the update function.

      setEditorOpen(true);
      setSelectedEvent(null); // close detail
    } catch (e) {
      console.error("Failed to parse event for editing", e);
    }
  }, [selectedEvent]);

  const handleDelete = useCallback((id) => {
    deleteEvent(id);
    setEditorOpen(false);
    setSelectedEvent(null);
  }, [deleteEvent]);


  const title = useMemo(
    () => formatTitleFromRange(range, activeView),
    [range, activeView]
  );

  const applyDate = useCallback(
    (d) => {
      setCursorDate(d);
      // specific fix: Schedule-X expects a string (YYYY-MM-DD)
      controls?.setDate?.(d.toString());
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
      controls?.setDate?.(cursorDate.toString());
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
          onEventClick={handleEventClick}
        />

        <EventDetailModal
          isOpen={!!selectedEvent}
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={handleEditFromDetail}
          onDelete={() => handleDelete(selectedEvent.id)}
          calendars={CALENDARS}
        />

        <EventEditor
          open={editorOpen}
          mode={editMode}
          initialStart={draftStart}
          initialEnd={draftEnd}
          initialTitle={draftTitle}
          initialCalendarId={draftCalendarId}
          onClose={() => setEditorOpen(false)}
          calendars={CALENDARS} // Pass calendars for selector
          onSave={({ title, start, end, allDay, calendarId }) => {
            // convert Temporal -> your DTO shape (ISO strings with offset)
            const dto = {
              title,
              allDay,
              startAt: start.toString(),
              endAt: end.toString(),
              timezone: TZ_DEFAULT,
              calendarId,
            };

            if (editMode === "edit" && draftId) {
              updateEvent(draftId, dto);
            } else {
              createEvent({ ...dto, id: crypto.randomUUID() });
            }

            setEditorOpen(false);
          }}
          onDelete={() => {
            if (editMode === "edit" && draftId) {
              handleDelete(draftId);
            }
          }}
        />

      </div>
    </div>
  );
}
