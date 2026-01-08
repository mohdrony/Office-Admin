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
  // Office Events
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
  {
    id: "e3",
    title: "Client Call: Smith Corp",
    calendarId: "office",
    allDay: false,
    startAt: toOffsetIso(getRelativeDate(2), "14:00"),
    endAt: toOffsetIso(getRelativeDate(2), "15:00"),
  },

  // Project Events
  {
    id: "p1",
    title: "Site Visit: Tower A",
    calendarId: "projects",
    allDay: false,
    startAt: toOffsetIso(getRelativeDate(3), "09:00"),
    endAt: toOffsetIso(getRelativeDate(3), "12:00"),
  },
  {
    id: "p2",
    title: "Design Review: Phase 2",
    calendarId: "projects",
    allDay: false,
    startAt: toOffsetIso(getRelativeDate(4), "15:00"),
    endAt: toOffsetIso(getRelativeDate(4), "17:00"),
  },
  {
    id: "p3",
    title: "Material Delivery",
    calendarId: "projects",
    allDay: true,
    startDate: getRelativeDate(5),
    endDate: getRelativeDate(6),
  },

  // Vacation
  {
    id: "v1",
    title: "Alice Vacation",
    calendarId: "vacation",
    allDay: true,
    startDate: getRelativeDate(7),
    endDate: getRelativeDate(9),
  },

  // Holidays
  {
    id: "h1",
    title: "Public Holiday",
    calendarId: "holidays",
    allDay: true,
    startDate: getRelativeDate(10),
    endDate: getRelativeDate(11),
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
