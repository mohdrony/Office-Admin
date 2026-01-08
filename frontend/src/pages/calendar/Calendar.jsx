// src/pages/calendar/Calendar.jsx
import "./calendar.scss";
import "temporal-polyfill/global";
import "@schedule-x/theme-default/dist/index.css";
import CalendarToolbar from "./components/CalendarToolbar";

import { useEffect, useMemo, useRef, useState } from "react";

import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewDay, createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { createCalendarControlsPlugin } from "@schedule-x/calendar-controls";

import EventDetailModal from "./components/EventDetailModal";
import EventEditor from "./components/EventEditor";
import useCalendarEvents from "./hooks/useCalendarEvents";
import { TZ_DEFAULT } from "./types";

function toZdt(x) {
  if (!x) return null;

  // Strings from Schedule-X or store
  if (typeof x === "string") {
    const s = x.includes(" ") ? x.replace(" ", "T") : x;

    // offset/Z -> Instant -> view in TZ_DEFAULT
    if (s.endsWith("Z") || /[+-]\d\d:\d\d$/.test(s)) {
      return Temporal.Instant.from(s).toZonedDateTimeISO(TZ_DEFAULT);
    }

    // local datetime -> interpret in TZ_DEFAULT (polyfill wants string tz arg)
    return Temporal.PlainDateTime.from(s).toZonedDateTime(TZ_DEFAULT);
  }

  // Temporal.PlainDate -> pick 09:00
  if (typeof Temporal !== "undefined" && x instanceof Temporal.PlainDate) {
    return x.toZonedDateTime({ timeZone: TZ_DEFAULT, plainTime: "09:00" });
  }

  // Already ZonedDateTime
  if (typeof Temporal !== "undefined" && x instanceof Temporal.ZonedDateTime) {
    return x;
  }

  // PlainDateTime -> make ZonedDateTime in TZ_DEFAULT
  if (typeof Temporal !== "undefined" && x instanceof Temporal.PlainDateTime) {
    return x.toZonedDateTime(TZ_DEFAULT);
  }

  return x;
}

export default function Calendar() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState("create");
  const [editingId, setEditingId] = useState(null);

  const [draftTitle, setDraftTitle] = useState("");
  const [draftAllDay, setDraftAllDay] = useState(false);

  const [draftStart, setDraftStart] = useState(null);
  const [draftEnd, setDraftEnd] = useState(null);
  const [draftCalendarId, setDraftCalendarId] = useState("office");

  const idRef = useRef(1000);
  const nextId = () => String(idRef.current++);

  const eventsService = useMemo(() => createEventsServicePlugin(), []);
  const controls = useMemo(() => createCalendarControlsPlugin(), []);
  const dnd = useMemo(() => createDragAndDropPlugin(), []);

  const { isLoading, scheduleXEvents, createEvent, updateEvent, deleteEvent } =
    useCalendarEvents();

  const calendarApp = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid()],
    plugins: [eventsService, controls, dnd],
    calendars: {
      office: {
        colorName: "office",
        label: "Office",
        lightColors: { main: "#4ea1ff", container: "#eaf2ff", onContainer: "#0b1a33" },
        darkColors: { main: "#4ea1ff", container: "#142033", onContainer: "#eaf2ff" },
      },
      projects: {
        colorName: "projects",
        label: "Projects",
        lightColors: { main: "#5ee38b", container: "#e9fff1", onContainer: "#062112" },
        darkColors: { main: "#5ee38b", container: "#11261a", onContainer: "#e9fff1" },
      },
      vacation: {
        colorName: "vacation",
        label: "Vacation",
        lightColors: { main: "#ff4e4e", container: "#ffecec", onContainer: "#3a0000" },
        darkColors: { main: "#ff4e4e", container: "#2a1111", onContainer: "#ffecec" },
      },
      holidays: {
        colorName: "holidays",
        label: "Holidays",
        lightColors: { main: "#aaaaaa", container: "#f1f1f1", onContainer: "#222222" },
        darkColors: { main: "#aaaaaa", container: "#1e1e1e", onContainer: "#f1f1f1" },
      },
    },
    events: scheduleXEvents,
    callbacks: {
      onEventClick(ev) {
        setSelectedEvent(ev);
      },
      onClickDateTime(zdt) {
        const start = zdt.with({ second: 0, millisecond: 0 });

        setEditorMode("create");
        setEditingId(null);
        setDraftTitle("");
        setDraftAllDay(false);

        setDraftStart(start);
        setDraftEnd(start.add({ hours: 1 }));
        setDraftCalendarId("office");
        setEditorOpen(true);
      },
      onClickDate(date) {
        const start = date.toZonedDateTime({ timeZone: TZ_DEFAULT, plainTime: "09:00" });

        setEditorMode("create");
        setEditingId(null);
        setDraftTitle("");
        setDraftAllDay(true);

        setDraftStart(start);
        setDraftEnd(start.add({ hours: 1 }));
        setDraftCalendarId("office");
        setEditorOpen(true);
      },
    },
  });

  useEffect(() => {
    if (!calendarApp) return;
    console.log("Calendar.jsx: scheduleXEvents", scheduleXEvents);
    eventsService?.set?.(scheduleXEvents ?? []);
  }, [calendarApp, eventsService, scheduleXEvents]);

  const openEditForEvent = (ev) => {
    if (!ev) return;

    const isAllDay =
      typeof Temporal !== "undefined" &&
      (ev.start instanceof Temporal.PlainDate || ev.end instanceof Temporal.PlainDate);

    const startZ = toZdt(ev.start);
    const endZ = isAllDay ? startZ.add({ hours: 1 }) : toZdt(ev.end);

    setEditorMode("edit");
    setEditingId(ev.id);

    setDraftTitle(ev.title ?? "");
    setDraftAllDay(!!isAllDay);
    setDraftStart(startZ);
    setDraftEnd(endZ);
    setDraftCalendarId(ev.calendarId || "office");

    setSelectedEvent(null);
    setEditorOpen(true);
  };

  return (
    <div className="calendarPage">
      <div className="calendarSurface">
        <div className="calCanvas">
          {isLoading ? <div className="calLoading">Loading…</div> : null}
          <CalendarToolbar
            title="Calendar"
            activeView="week"
            onPrev={() => { }}
            onNext={() => { }}
            onToday={() => { }}
            onSetView={() => { }}
            calendars={[
              { id: "office", label: "Office", color: "#4ea1ff" },
              { id: "projects", label: "Projects", color: "#5ee38b" },
              { id: "vacation", label: "Vacation", color: "#ff4e4e" },
              { id: "holidays", label: "Holidays", color: "#aaaaaa" },
            ]}
            visibleCalendars={new Set(["office", "projects", "vacation", "holidays"])}
            onToggleCalendar={() => { }}
            onOpenCreate={() => { }}
          />


          <ScheduleXCalendar calendarApp={calendarApp} />

          <EventDetailModal
            isOpen={!!selectedEvent}
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onEdit={() => openEditForEvent(selectedEvent)}
            onDelete={() => {
              if (!selectedEvent?.id) return;
              if (window.confirm("Are you sure you want to delete this event?")) {
                deleteEvent(selectedEvent.id);
                eventsService.remove(selectedEvent.id);
                setSelectedEvent(null);
              }
            }}
            calendars={[
              { id: "office", label: "Office", color: "#4ea1ff" },
              { id: "projects", label: "Projects", color: "#5ee38b" },
              { id: "vacation", label: "Vacation", color: "#ff4e4e" },
              { id: "holidays", label: "Holidays", color: "#aaaaaa" },
            ]}
          />

          <EventEditor
            open={editorOpen}
            mode={editorMode}
            initialTitle={draftTitle}
            initialAllDay={draftAllDay}
            initialStart={draftStart}
            initialEnd={draftEnd}
            initialCalendarId={draftCalendarId}
            onClose={() => setEditorOpen(false)}
            onSave={({ title, start, end, allDay, calendarId }) => {
              if (editorMode === "create") {
                const ev = {
                  id: nextId(),
                  title,
                  calendarId,
                  start: allDay ? start.toPlainDate() : start,
                  end: allDay ? end.toPlainDate().add({ days: 1 }) : end, // end-exclusive
                };

                createEvent(ev);
                eventsService.add(ev);
                setEditorOpen(false);
                return;
              }

              const updated = {
                id: editingId,
                title,
                calendarId,
                start: allDay ? start.toPlainDate() : start,
                end: allDay ? end.toPlainDate().add({ days: 1 }) : end,
              };

              updateEvent(editingId, updated);

              // force Schedule-X repaint (fixes time shifts after edit)
              eventsService.remove(editingId);
              eventsService.add(updated);

              setEditorOpen(false);
            }}
            onDelete={() => {
              if (!editingId) return;
              if (window.confirm("Delete this event?")) {
                deleteEvent(editingId);
                eventsService.remove(editingId);
                setEditorOpen(false);
              }
            }}
            calendars={[
              { id: "office", label: "Office", color: "#4ea1ff" },
              { id: "projects", label: "Projects", color: "#5ee38b" },
              { id: "vacation", label: "Vacation", color: "#ff4e4e" },
              { id: "holidays", label: "Holidays", color: "#aaaaaa" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
