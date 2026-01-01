// src/pages/calendar/store/eventStoreDummy.js

import { TZ_DEFAULT } from "../types";

// Helper for "today" to make dummy data visible
function getRelativeDate(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

let EVENTS = [
  {
    id: "e1",
    title: "Jour fixe — Ville-Quartier",
    // Use Temporal.ZonedDateTime for time-grid placement
    start: Temporal.PlainDate.from(getRelativeDate(0))
      .toZonedDateTime({ timeZone: TZ_DEFAULT, plainTime: "10:00" }),
    end: Temporal.PlainDate.from(getRelativeDate(0))
      .toZonedDateTime({ timeZone: TZ_DEFAULT, plainTime: "11:30" }),
    calendarId: "office",
    description: "Internal coordination",
  },
  {
    id: "e2",
    title: "Team Lunch",
    // 12:00 - 13:30 tomorrow
    start: Temporal.PlainDate.from(getRelativeDate(1))
      .toZonedDateTime({ timeZone: TZ_DEFAULT, plainTime: "12:00" }),
    end: Temporal.PlainDate.from(getRelativeDate(1))
      .toZonedDateTime({ timeZone: TZ_DEFAULT, plainTime: "13:30" }),
    calendarId: "office",
    description: "Team bonding",
  },
  {
    id: "e3",
    title: "Quarterly Review",
    // All day event: stays in header as Temporal.PlainDate
    start: Temporal.PlainDate.from(getRelativeDate(4)),
    end: Temporal.PlainDate.from(getRelativeDate(4)),
    calendarId: "office",
    description: "Planning Q2",
  }
];

export function listEvents() {
  // Return a clone to avoid direct mutation
  // Note: Temporal objects are primitives/immutable-ish, but array needs cloning
  return [...EVENTS];
}

export function createEvent(event) {
  // Mock creation
  // Input expected to be partial, we might need to cast to Temporal if not already
  const newEv = {
    ...event,
    id: crypto.randomUUID(),
  };
  EVENTS = [newEv, ...EVENTS];
  return newEv;
}

export function updateEvent(id, patch) {
  EVENTS = EVENTS.map((e) => (e.id === id ? { ...e, ...patch } : e));
  return EVENTS.find((e) => e.id === id);
}

export function deleteEvent(id) {
  EVENTS = EVENTS.filter((e) => e.id !== id);
  return true;
}
