// src/pages/calendar/utils/eventMapper.js

import { TZ_DEFAULT, ALLDAY_END_EXCLUSIVE } from "../types";

// helper: ensure ZonedDateTime string includes [Europe/Berlin]
function toZonedDateTime(isoWithOffset, tz) {
  const zone = tz || TZ_DEFAULT;
  const hasBracketZone = /\[.+\]$/.test(isoWithOffset);
  const s = hasBracketZone ? isoWithOffset : `${isoWithOffset}[${zone}]`;
  return Temporal.ZonedDateTime.from(s);
}

// your app stores endDate as EXCLUSIVE for all-day.
// Schedule-X PlainDate end is effectively INCLUSIVE in practice,
// so we convert by subtracting 1 day.
function toPlainDateEnd(endDate) {
  const d = Temporal.PlainDate.from(endDate);
  return ALLDAY_END_EXCLUSIVE ? d.subtract({ days: 1 }) : d;
}

export function toScheduleXEvent(dto) {
  const base = {
    id: dto.id,
    title: dto.title ?? "(Untitled)",
    calendarId: dto.calendarId || "office",
    meta: dto, // keep full DTO for your editor later
  };

  if (dto.allDay) {
    if (!dto.startDate || !dto.endDate) {
      throw new Error(`All-day event ${dto.id} needs startDate + endDate`);
    }
    return {
      ...base,
      start: Temporal.PlainDate.from(dto.startDate),
      end: toPlainDateEnd(dto.endDate),
    };
  }

  if (!dto.startAt || !dto.endAt) {
    throw new Error(`Timed event ${dto.id} needs startAt + endAt`);
  }

  const tz = dto.timezone || TZ_DEFAULT;

  return {
    ...base,
    start: toZonedDateTime(dto.startAt, tz),
    end: toZonedDateTime(dto.endAt, tz),
  };
}

export function toScheduleXEvents(dtos) {
  return (dtos || []).map(toScheduleXEvent);
}
