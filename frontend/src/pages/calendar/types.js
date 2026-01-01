// src/pages/calendar/types.js

export const TZ_DEFAULT = "Europe/Berlin";

// We’ll treat all-day endDate as EXCLUSIVE (clean + common convention).
export const ALLDAY_END_EXCLUSIVE = true;

/**
 * Canonical, API-ready event object.
 * This is what your backend will return later.
 *
 * timed event:
 *  - allDay=false
 *  - startAt/endAt = ISO 8601 with offset (e.g. 2026-01-02T10:00:00+01:00)
 *
 * all-day event:
 *  - allDay=true
 *  - startDate/endDate = YYYY-MM-DD
 */
