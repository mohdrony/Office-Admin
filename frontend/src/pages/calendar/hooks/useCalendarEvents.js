import { useEffect, useState } from "react";
import { listEvents } from "../store/eventStoreDummy";

/**
 * Minimal Schedule-X–compatible event hook
 * Source of truth: dummy store
 */
export default function useCalendarEvents() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // sync once on mount
    const data = listEvents();
    setEvents(data);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    scheduleXEvents: events,
  };
}
