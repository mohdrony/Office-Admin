import { useCallback, useEffect, useMemo, useState } from "react";
import { projectsDummy } from "../../../data/projectsDummy";
import { mapAllProjectsToEvents } from "../utils/projectMapper";
import { listEvents, createEvent as createStoreEvent } from "../store/eventStoreDummy";
import { TZ_DEFAULT } from "../types";

/**
 * Internal-first event hook.
 * - source of truth: projectsDummy
 * - derived: scheduleXEvents for the calendar renderer
 */
export default function useCalendarEvents() {
  const [events, setEvents] = useState([]); // Schedule-X ready events
  const [isLoading, setIsLoading] = useState(true);

  // Initial load
  useEffect(() => {
    setIsLoading(true);

    // 1. Get Project Events (via mapper)
    const projectEvents = mapAllProjectsToEvents(projectsDummy);

    // 2. Get Internal/Calendar Events (via store)
    const calendarEvents = listEvents();

    // 3. Merge
    setEvents([...projectEvents, ...calendarEvents]);

    setIsLoading(false);
  }, []);

  const scheduleXEvents = useMemo(() => events, [events]);

  const createEvent = useCallback((draft) => {
    // 1. Convert DTO to Temporal-ready event via store
    // The store's createEvent expects just { title ... }, returns { id... start: Temporal... }
    // But our store currently expects raw temporal in this simplified version:

    // We need to adhere to what EventEditor sends:
    // { id, title, allDay, startAt (ISO string), endAt (ISO string), calendarId }

    // We'll adapt it to match the store's "simple" expectation which we defined in step 168
    // { title, start: Temporal..., end: Temporal..., calendarId, description }

    const simpleEvent = {
      title: draft.title,
      calendarId: draft.calendarId || 'office',
      description: 'New Event',
      // Use ZonedDateTime to preserve time info for grid placement
      start: Temporal.Instant.from(draft.startAt).toZonedDateTimeISO(TZ_DEFAULT),
      end: Temporal.Instant.from(draft.endAt).toZonedDateTimeISO(TZ_DEFAULT),
    };

    const savedEvent = createStoreEvent(simpleEvent);

    setEvents(prev => [...prev, savedEvent]);
  }, []);

  const updateEvent = useCallback((id, draft) => {
    // 1. Convert DTO to Temporal
    // draft: { title, startAt, endAt, calendarId, ... }

    // We only update what IS passed.
    const patch = {};
    if (draft.title !== undefined) patch.title = draft.title;
    if (draft.calendarId !== undefined) patch.calendarId = draft.calendarId;
    if (draft.startAt) patch.start = Temporal.Instant.from(draft.startAt).toZonedDateTimeISO(TZ_DEFAULT);
    if (draft.endAt) patch.end = Temporal.Instant.from(draft.endAt).toZonedDateTimeISO(TZ_DEFAULT);

    setEvents(prev => prev.map(e => {
      if (e.id === id) {
        return { ...e, ...patch };
      }
      return e;
    }));
  }, []);

  return {
    isLoading,
    scheduleXEvents, // mapped list for Schedule-X
    createEvent,
    updateEvent,
  };
}
