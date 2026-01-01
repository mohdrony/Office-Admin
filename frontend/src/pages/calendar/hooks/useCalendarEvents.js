// src/pages/calendar/hooks/useCalendarEvents.js

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  listEvents,
  createEvent as createEventStore,
  updateEvent as updateEventStore,
  deleteEvent as deleteEventStore,
} from "../store/eventStoreDummy";
import { toScheduleXEvents } from "../utils/eventMapper";
import { TZ_DEFAULT } from "../types";

/**
 * Internal-first event hook.
 * - source of truth: our store (dummy now, API later)
 * - derived: scheduleXEvents for the calendar renderer
 */
export default function useCalendarEvents() {
  const [events, setEvents] = useState([]); // CalendarEventDTO[]
  const [isLoading, setIsLoading] = useState(true);

  // Initial load
  useEffect(() => {
    setIsLoading(true);
    const data = listEvents();
    setEvents(data);
    setIsLoading(false);
  }, []);

  const scheduleXEvents = useMemo(() => toScheduleXEvents(events), [events]);

  const createEvent = useCallback((draft) => {
    // minimal normalization so UI doesn't have to worry
    const dto = {
      timezone: TZ_DEFAULT,
      calendarId: "office",
      ...draft,
    };
    const created = createEventStore(dto);
    setEvents((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateEvent = useCallback((id, patch) => {
    const updated = updateEventStore(id, patch);
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  }, []);

  const deleteEvent = useCallback((id) => {
    deleteEventStore(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    return true;
  }, []);

  return {
    isLoading,
    events, // canonical DTO list (API-ready)
    scheduleXEvents, // mapped list for Schedule-X
    createEvent,
    updateEvent,
    deleteEvent,
    setEvents, // keep for later (bulk replace from API)
  };
}
