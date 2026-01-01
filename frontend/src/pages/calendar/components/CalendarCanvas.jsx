// src/pages/calendar/components/CalendarCanvas.jsx

import "@schedule-x/theme-default/dist/index.css";

import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import {
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
} from "@schedule-x/calendar";

import { createEventsServicePlugin } from "@schedule-x/events-service";
import { createCalendarControlsPlugin } from "@schedule-x/calendar-controls";

import { useEffect, useMemo } from "react";

export default function CalendarCanvas({
  events,
  onReady,
  onClickDateTime: handleClickDateTime,
  onClickDate: handleClickDate,
}) {
  const eventsService = useMemo(() => createEventsServicePlugin(), []);
  const controls = useMemo(() => createCalendarControlsPlugin(), []);

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
    events: [],
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
    },
  });


  useEffect(() => {
    onReady?.({ calendarApp, controls });
  }, [calendarApp, controls, onReady]);

  // Sync events prop with Schedule-X
  // Sync events prop with Schedule-X
  useEffect(() => {
    if (!events) return;

    try {
      // Check if the plugin has a bulk set method (some versions do)
      if (eventsService && typeof eventsService.set === 'function') {
        eventsService.set(events);
      } else if (eventsService) {
        // Fallback: clear and add
        const current = eventsService.getAll?.();
        if (Array.isArray(current)) {
          current.forEach(e => eventsService.remove?.(e.id));
        }

        events.forEach(e => {
          // Ensure mandatory fields
          if (e.id && e.start && e.end) {
            eventsService.add?.(e);
          } else {
            console.warn("Skipping invalid event", e);
          }
        });
      }
    } catch (err) {
      console.error("Failed to update calendar events:", err);
    }
  }, [events, eventsService]);

  return (
    <div className="calCanvas">
      <ScheduleXCalendar calendarApp={calendarApp} />
    </div>
  );
}
