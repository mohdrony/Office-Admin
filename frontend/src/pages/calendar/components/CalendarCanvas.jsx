// src/pages/calendar/components/CalendarCanvas.jsx

import "temporal-polyfill/global";
import "@schedule-x/theme-default/dist/index.css";

import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import {
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
} from "@schedule-x/calendar";

import { createEventsServicePlugin } from "@schedule-x/events-service";
import { createCalendarControlsPlugin } from "@schedule-x/calendar-controls";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";

import { useEffect, useMemo } from "react";
import CustomTimeGridEvent from "./CustomTimeGridEvent";

export default function CalendarCanvas({
  events,
  onReady,
  onClickDateTime: handleClickDateTime,
  onClickDate: handleClickDate,
  onEventUpdate,
  onEventClick,
}) {
  const eventsService = useMemo(() => createEventsServicePlugin(), []);
  const controls = useMemo(() => createCalendarControlsPlugin(), []);
  const dragAndDrop = useMemo(() => createDragAndDropPlugin(), []);

  // IMPORTANT: React wrapper expects config object (doc style), not createCalendar(...)
  const calendarApp = useCalendarApp({
    calendars: {
      office: {
        label: "Office",
        colorName: "office",
        isVisible: true,
        lightColors: {
          main: "#4ea1ff",
          container: "#eaf2ff",
          onContainer: "#0b1a33",
        },
        darkColors: {
          main: "#4ea1ff",
          container: "#142033",
          onContainer: "#eaf2ff",
        },
      },
      projects: {
        label: "Projects",
        colorName: "projects",
        isVisible: true,
        lightColors: {
          main: "#5ee38b",
          container: "#e9fff1",
          onContainer: "#062112",
        },
        darkColors: {
          main: "#5ee38b",
          container: "#11261a",
          onContainer: "#e9fff1",
        },
      },
      vacation: {
        label: "Vacation",
        colorName: "vacation",
        isVisible: true,
        lightColors: {
          main: "#ff4e4e",
          container: "#ffecec",
          onContainer: "#3a0000",
        },
        darkColors: {
          main: "#ff4e4e",
          container: "#2a1111",
          onContainer: "#ffecec",
        },
      },
      holidays: {
        label: "Holidays",
        colorName: "holidays",
        isVisible: true,
        lightColors: {
          main: "#aaaaaa",
          container: "#f1f1f1",
          onContainer: "#222222",
        },
        darkColors: {
          main: "#aaaaaa",
          container: "#1e1e1e",
          onContainer: "#f1f1f1",
        },
      },
    },

    views: [createViewDay(), createViewWeek(), createViewMonthGrid()],
    events: [], // pushed via eventsService.set(...)
    plugins: [eventsService, controls, dragAndDrop],

    callbacks: {
      onRangeUpdate(range) {
        onReady?.({ controls, range });
      },
      onClickDateTime(dateTime) {
        handleClickDateTime?.(dateTime);
      },
      onClickDate(date) {
        handleClickDate?.(date);
      },
      onEventClick(calendarEvent) {
        onEventClick?.(calendarEvent);
      },
      onEventUpdate(updatedEvent) {
        onEventUpdate?.(updatedEvent.id, {
          start: updatedEvent.start,
          end: updatedEvent.end,
          calendarId: updatedEvent.calendarId,
          title: updatedEvent.title,
        });
      },
    },
  });

  // Sync events prop with Schedule-X
  useEffect(() => {
    if (!events) return;
    eventsService.set(events);
  }, [events, eventsService]);

  return (
    <div className="calCanvas">
      <ScheduleXCalendar
        calendarApp={calendarApp}
        customComponents={{
          timeGridEvent: CustomTimeGridEvent,
        }}
      />
    </div>
  );
}
