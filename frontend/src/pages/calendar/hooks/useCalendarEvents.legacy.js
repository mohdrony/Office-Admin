import { useCallback, useEffect, useMemo, useState } from "react";
import { projectsDummy } from "../../../data/projectsDummy";
import { mapAllProjectsToEvents } from "../utils/projectMapper";
import { listEvents, createEvent as createStoreEvent, deleteEvent as deleteStoreEvent } from "../store/eventStoreDummy";
import { fetchHolidays } from "../../../api/holidays";
import { TZ_DEFAULT } from "../types";


/**
 * Internal-first event hook.
 * - source of truth: projectsDummy
 * - derived: scheduleXEvents for the calendar renderer
 */
export default function useCalendarEvents() {
  const [events, setEvents] = useState([]); // Schedule-X ready events
  const [isLoading, setIsLoading] = useState(true);
  console.log("events count:", scheduleXEvents?.length, scheduleXEvents?.[0]);


  // Initial load
  useEffect(() => {
    let mounted = true;

    (async () => {
      setIsLoading(true);

      // 1. Get Project Events (via mapper)
      const projects = mapAllProjectsToEvents(projectsDummy);

      // 2. Get Internal/Calendar Events (via store)
      const internal = listEvents();

      // 3. Get Holidays
      let holidays = [];
      try {
        const holidayData = await fetchHolidays();
        holidays = holidayData.map(h => {
          // Use full-day ZonedDateTimes so day/week views don't crash on PlainDate-only events
          const holidayDate = Temporal.PlainDate.from(h.date);
          const start = holidayData.toZonedDateTime({ timeZone: TZ_DEFAULT, plainTime: "00:00" });
          const end = holidayDate.toZonedDateTime({ timeZone: TZ_DEFAULT, plainTime: "23:59" });
          return {
            id: `holiday-${h.id}`,
            title: h.name,
            calendarId: 'holidays',
            start,
            end,
            allDay: true,
            isHoliday: true,
            holidayType: h.type
          };
        });
      } catch (e) {
        console.error("Failed to fetch holidays", e);
      }

      if (mounted) {
        setEvents([...projects, ...internal, ...holidays]);
        setIsLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  const scheduleXEvents = useMemo(() => events, [events]);

  const createEvent = useCallback((draft) => {
    // 1. Convert DTO to Temporal-ready event via store
    const simpleEvent = {
      title: draft.title,
      calendarId: draft.calendarId || 'office',
      description: 'New Event',
      // Schema: Temporal.ZonedDateTime for timed events
      start: Temporal.ZonedDateTime.from(draft.startAt),
      end: Temporal.ZonedDateTime.from(draft.endAt),
    };

    const savedEvent = createStoreEvent(simpleEvent);

    setEvents(prev => [...prev, savedEvent]);
  }, []);

  const updateEvent = useCallback((id, draft) => {
    // We only update what IS passed.
    const patch = {};
    if (draft.title !== undefined) patch.title = draft.title;
    if (draft.calendarId !== undefined) patch.calendarId = draft.calendarId;
    if (draft.startAt) patch.start = Temporal.ZonedDateTime.from(draft.startAt);
    if (draft.endAt) patch.end = Temporal.ZonedDateTime.from(draft.endAt);

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
    deleteEvent: (id) => {
      deleteStoreEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
    },
  };
}
