// src/pages/calendar/components/EventDetailModal.jsx
import "./eventDetailModal.scss";
import "temporal-polyfill/global";
import { TZ_DEFAULT } from "../types";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

function toZdt(x) {
  if (!x) return null;

  try {
    // Temporal objects
    if (typeof Temporal !== "undefined") {
      if (x instanceof Temporal.ZonedDateTime) return x;

      // Note: with your polyfill build, PlainDateTime expects a string timeZone arg
      if (x instanceof Temporal.PlainDateTime) return x.toZonedDateTime(TZ_DEFAULT);

      if (x instanceof Temporal.PlainDate) {
        // PlainDate.toZonedDateTime expects object with timeZone + plainTime
        return x.toZonedDateTime({ timeZone: TZ_DEFAULT, plainTime: "00:00" });
      }
    }

    // Strings from Schedule-X / store
    if (typeof x === "string") {
      const s = x.includes(" ") ? x.replace(" ", "T") : x;

      // If it has an offset or Z, treat as an instant, then view in Europe/Berlin
      if (s.endsWith("Z") || /[+-]\d\d:\d\d$/.test(s)) {
        const inst = Temporal.Instant.from(s);
        return inst.toZonedDateTimeISO(TZ_DEFAULT);
      }

      // Otherwise treat as local datetime in TZ_DEFAULT
      return Temporal.PlainDateTime.from(s).toZonedDateTime(TZ_DEFAULT);
    }

    // JS Date fallback
    if (x instanceof Date) {
      const inst = Temporal.Instant.fromEpochMilliseconds(x.getTime());
      return inst.toZonedDateTimeISO(TZ_DEFAULT);
    }
  } catch {
    return null;
  }

  return null;
}

function isAllDayEvent(ev) {
  if (!ev) return false;

  if (typeof Temporal !== "undefined") {
    if (ev.start instanceof Temporal.PlainDate || ev.end instanceof Temporal.PlainDate) {
      return true;
    }
  }

  // String fallback: midnight-to-midnight
  if (typeof ev.start === "string" && typeof ev.end === "string") {
    const s = ev.start.includes(" ") ? ev.start.replace(" ", "T") : ev.start;
    const e = ev.end.includes(" ") ? ev.end.replace(" ", "T") : ev.end;
    return s.endsWith("00:00") && e.endsWith("00:00");
  }

  return false;
}

function formatDate(x) {
  const zdt = toZdt(x);
  if (!zdt) return x ? String(x) : "";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: TZ_DEFAULT,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(zdt.toInstant().epochMilliseconds));
}

function formatTime(x) {
  const zdt = toZdt(x);
  if (!zdt) return "";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: TZ_DEFAULT,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(zdt.toInstant().epochMilliseconds));
}

export default function EventDetailModal({
  event,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  calendars = [],
}) {
  if (!isOpen || !event) return null;

  const calendar = calendars.find((c) => c.id === event.calendarId) || {};
  const allDay = isAllDayEvent(event);

  return (
    <div className="edScrim" onClick={onClose} role="dialog" aria-modal="true">
      <div className="edModal" onClick={(e) => e.stopPropagation()}>
        <div className="edHeader">
          <div className="edActions">
            <button className="edIconBtn" onClick={onEdit} title="Edit Event" type="button">
              <EditRoundedIcon fontSize="small" />
            </button>

            <button className="edIconBtn" type="button" onClick={onDelete} title="Delete Event">
              <DeleteRoundedIcon fontSize="small" />
            </button>

            <button className="edIconBtn" onClick={onClose} title="Close" type="button">
              <CloseRoundedIcon fontSize="small" />
            </button>
          </div>
        </div>

        <div className="edBody">
          <div className="edTitleLine">
            <div className="edCalDot" style={{ background: calendar.color || "var(--accent)" }} />
            <h2 className="edTitle">{event.title}</h2>
          </div>

          <div className="edMeta">
            <div className="edMetaRow">
              <CalendarTodayRoundedIcon fontSize="inherit" className="edIcon" />
              <span>{formatDate(event.start)}</span>
            </div>

            <div className="edMetaRow">
              <AccessTimeRoundedIcon fontSize="inherit" className="edIcon" />
              <span>{allDay ? "All Day" : `${formatTime(event.start)} – ${formatTime(event.end)}`}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
