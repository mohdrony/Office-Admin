// src/pages/calendar/Calendar.jsx
import "./calendar.scss";
import "temporal-polyfill/global";
import "@schedule-x/theme-default/dist/index.css";

import { useEffect, useMemo } from "react";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewDay, createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { createCalendarControlsPlugin } from "@schedule-x/calendar-controls";

import { TZ_DEFAULT } from "./types";

import useCalendarEvents from "./hooks/useCalendarEvents";

export default function Calendar() {
    const eventsService = useMemo(() => createEventsServicePlugin(), []);
    const controls = useMemo(() => createCalendarControlsPlugin(), []);
    const dnd = useMemo(() => createDragAndDropPlugin(), []);

    const { isLoading, scheduleXEvents } = useCalendarEvents();

    const calendarApp = useCalendarApp({
        views: [createViewDay(), createViewWeek(), createViewMonthGrid()],
        plugins: [eventsService, controls, dnd],
        calendars: {
            office: {
                label: "Office",
                lightColors: { main: "#4ea1ff", container: "#eaf2ff", onContainer: "#0b1a33" },
                darkColors: { main: "#4ea1ff", container: "#142033", onContainer: "#eaf2ff" },
            },
            projects: {
                label: "Projects",
                lightColors: { main: "#5ee38b", container: "#e9fff1", onContainer: "#062112" },
                darkColors: { main: "#5ee38b", container: "#11261a", onContainer: "#e9fff1" },
            },
        },
        events: scheduleXEvents,
    });

    useEffect(() => {
  if (!calendarApp) return;
  eventsService?.set?.(scheduleXEvents ?? []);
}, [calendarApp, eventsService, scheduleXEvents]);


    return (
        <div className="calendarPage">
            <div className="calendarSurface">
                <div className="calCanvas">
                    {isLoading ? <div className="calLoading">Loading…</div> : null}
                    <ScheduleXCalendar calendarApp={calendarApp} />
                </div>
            </div>
        </div>
    );
}
