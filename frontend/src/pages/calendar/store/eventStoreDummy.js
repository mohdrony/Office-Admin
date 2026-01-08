// src/pages/calendar/store/eventStoreDummy.js
import "temporal-polyfill/global";
import { TZ_DEFAULT } from "../types";

function getRelativeDate(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function toOffsetIso(dateStr, timeStr) {
  // dateStr: YYYY-MM-DD, timeStr: HH:mm
  const pdt = Temporal.PlainDateTime.from(`${dateStr}T${timeStr}`);
  return pdt.toZonedDateTime(TZ_DEFAULT).toString(); // includes +01:00[Europe/Berlin]
}

let EVENTS = [
  {
    id: "e1",
    title: "Jour fixe — Ville-Quartier",
    calendarId: "office",
    allDay: false,
    startAt: toOffsetIso(getRelativeDate(0), "10:00"),
    endAt: toOffsetIso(getRelativeDate(0), "11:30"),
  },
  {
    id: "e2",
    title: "Team Lunch",
    calendarId: "office",
    allDay: false,
    startAt: toOffsetIso(getRelativeDate(1), "12:00"),
    endAt: toOffsetIso(getRelativeDate(1), "13:30"),
  },
];

export function listEvents() {
  return [...EVENTS];
}

export function createEvent(event) {
  const newEv = { ...event, id: crypto.randomUUID() };
  EVENTS = [newEv, ...EVENTS];
  return newEv;
}

export function updateEvent(id, patch) {
  EVENTS = EVENTS.map((e) => (e.id === id ? { ...e, ...patch } : e));
  return EVENTS.find((e) => e.id === id) || null;
}

export function deleteEvent(id) {
  EVENTS = EVENTS.filter((e) => e.id !== id);
  return true;
}
