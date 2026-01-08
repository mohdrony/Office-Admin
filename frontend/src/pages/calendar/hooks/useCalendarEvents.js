// src/pages/calendar/hooks/useCalendarEvents.js
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  listEvents,
  createEvent as createStoreEvent,
  updateEvent as updateStoreEvent,
  deleteEvent as deleteStoreEvent,
} from "../store/eventStoreDummy";
import "temporal-polyfill/global";
import { TZ_DEFAULT } from "../types";

function storeToScheduleX(ev) {
  // Store format: { allDay, startAt/endAt OR startDate/endDate }
  if (!ev) return ev;

  if (ev.allDay) {
    return {
      id: ev.id,
      title: ev.title,
      calendarId: ev.calendarId,
      start: Temporal.PlainDate.from(ev.startDate),
      end: Temporal.PlainDate.from(ev.endDate), // end-exclusive already in store
    };
  }

  // Timed: startAt/endAt are ISO with offset or with [Europe/Berlin]
  const start = Temporal.ZonedDateTime.from(ev.startAt).withTimeZone(TZ_DEFAULT);
  const end = Temporal.ZonedDateTime.from(ev.endAt).withTimeZone(TZ_DEFAULT);

  return {
    id: ev.id,
    title: ev.title,
    calendarId: ev.calendarId,
    start,
    end,
  };
}

function scheduleXToStore(ev) {
  // Schedule-X format: { start/end as ZonedDateTime OR PlainDate for all-day }
  const isAllDay =
    typeof Temporal !== "undefined" &&
    (ev.start instanceof Temporal.PlainDate || ev.end instanceof Temporal.PlainDate);

  if (isAllDay) {
    const startDate = ev.start.toString(); // YYYY-MM-DD
    const endDate = ev.end.toString();     // YYYY-MM-DD (end-exclusive)
    return {
      id: ev.id,
      title: ev.title,
      calendarId: ev.calendarId,
      allDay: true,
      startDate,
      endDate,
    };
  }

  const startAt = ev.start.withTimeZone(TZ_DEFAULT).toString();
  const endAt = ev.end.withTimeZone(TZ_DEFAULT).toString();

  return {
    id: ev.id,
    title: ev.title,
    calendarId: ev.calendarId,
    allDay: false,
    startAt,
    endAt,
  };
}


export default function useCalendarEvents() {
  // Synchronous load for testing
  const [events, setEvents] = useState(() => listEvents().map(storeToScheduleX));
  const [isLoading, setIsLoading] = useState(false);

  /*
  useEffect(() => {
    setEvents(listEvents().map(storeToScheduleX));
    setIsLoading(false);
  }, []);
  */

  const scheduleXEvents = useMemo(() => events, [events]);

  const createEvent = useCallback((draft) => {
    const savedStore = createStoreEvent(scheduleXToStore(draft));
    const saved = storeToScheduleX(savedStore);
    setEvents((prev) => [saved, ...prev]);
    return saved;

  }, []);

  const updateEvent = useCallback((id, patch) => {
    const savedStore = updateStoreEvent(id, scheduleXToStore({ ...patch, id }));
    if (!savedStore) return;
    const saved = storeToScheduleX(savedStore);
    setEvents((prev) => prev.map((e) => (e.id === id ? saved : e)));
    return saved;

  }, []);

  const deleteEvent = useCallback((id) => {
    deleteStoreEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    return true;
  }, []);

  return { isLoading, scheduleXEvents, createEvent, updateEvent, deleteEvent };
}
