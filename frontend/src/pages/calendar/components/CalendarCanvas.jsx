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
  onEventClick, // We can use this directly now
}) {
  const eventsService = useMemo(() => createEventsServicePlugin(), []);
  const controls = useMemo(() => createCalendarControlsPlugin(), []);
  const dragAndDrop = useMemo(() => createDragAndDropPlugin(), []);

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
    },

    views: [createViewDay(), createViewWeek(), createViewMonthGrid()],
    events: [], // Initial events will be set via effect
    plugins: [eventsService, controls],
    callbacks: {
      onRangeUpdate(range) {
        onReady?.({ calendarApp, controls, range });
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
        // Schedule-X handles the UI update internally for the drag.
        // We just need to persist it up.
        // updatedEvent contains the new start/end times.
        if (onEventUpdate) {
          onEventUpdate(updatedEvent.id, {
            start: updatedEvent.start,
            end: updatedEvent.end,
            calendarId: updatedEvent.calendarId,
            title: updatedEvent.title
          });
        }
      },
    },
  });


  useEffect(() => {
    onReady?.({ calendarApp, controls });
  }, [calendarApp, controls, onReady]);

  // Sync events prop with Schedule-X
  useEffect(() => {
    if (!events) return;
    if (eventsService) {
      // Schedule-X requires Temporal objects for start/end
      eventsService.set(events);
    }
  }, [events, eventsService]);

  return (
    <div className="calCanvas">
      <ScheduleXCalendar
        calendarApp={calendarApp}
        customComponents={{
          timeGridEvent: CustomTimeGridEvent,
          // Removed eventModal custom component as we use native click handler
        }}
      />
    </div>
  );
}
