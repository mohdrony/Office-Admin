// src/pages/calendar/store/eventStoreDummy.js
import "temporal-polyfill/global";
import { TZ_DEFAULT } from "../types";

let EVENTS = [
  {
    id: "e1",
    title: "Jour fixe — Ville-Quartier",
    calendarId: "office",
    start: Temporal.PlainDate
      .from(Temporal.Now.plainDateISO(TZ_DEFAULT))
      .toZonedDateTime({ timeZone: TZ_DEFAULT, plainTime: "10:00" }),
    end: Temporal.PlainDate
      .from(Temporal.Now.plainDateISO(TZ_DEFAULT))
      .toZonedDateTime({ timeZone: TZ_DEFAULT, plainTime: "11:00" }),
  },
  {
    id: "e2",
    title: "All-day test",
    calendarId: "projects",
    start: Temporal.Now.plainDateISO(TZ_DEFAULT),
    end: Temporal.Now.plainDateISO(TZ_DEFAULT).add({ days: 1 }), // end-exclusive
  },
];

export function listEvents() {
  return [...EVENTS];
}
