// src/pages/calendar/store/eventStoreDummy.js

import { TZ_DEFAULT } from "../types";

let EVENTS = (() => {
  // simple “today” in Berlin-ish (good enough for dummy)
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const base = `${yyyy}-${mm}-${dd}`;

  return [
    {
      id: "e1",
      title: "Jour fixe — Ville-Quartier",
      description: "Internal coordination",
      allDay: false,
      startAt: `${base}T09:00:00+01:00`,
      endAt: `${base}T10:00:00+01:00`,
      timezone: TZ_DEFAULT,
      calendarId: "office",
      links: { projectId: "p_ville", personId: "u_rony" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "e2",
      title: "Deadline: Concept Phase",
      allDay: true,
      startDate: base,
      endDate: base, // (exclusive handled in mapper; we’ll improve later)
      timezone: TZ_DEFAULT,
      calendarId: "projects",
      links: { projectId: "p_sample", phaseId: "ph_concept" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
})();


function nowIsoLocalOffset() {
  // good enough for dummy; backend will own this later
  const d = new Date();
  const tzOffsetMin = d.getTimezoneOffset(); // minutes, negative in CET? actually CET is -60? JS returns positive for behind UTC
  // We'll just use ISO Z; not critical for dummy auditing
  return new Date().toISOString();
}

export function listEvents() {
  return structuredClone(EVENTS);
}

export function createEvent(dto) {
  const t = nowIsoLocalOffset();
  const ev = { ...dto, createdAt: t, updatedAt: t };
  EVENTS = [ev, ...EVENTS];
  return structuredClone(ev);
}

export function updateEvent(id, patch) {
  const t = nowIsoLocalOffset();
  EVENTS = EVENTS.map((e) => (e.id === id ? { ...e, ...patch, updatedAt: t } : e));
  return structuredClone(EVENTS.find((e) => e.id === id));
}

export function deleteEvent(id) {
  EVENTS = EVENTS.filter((e) => e.id !== id);
  return true;
}
