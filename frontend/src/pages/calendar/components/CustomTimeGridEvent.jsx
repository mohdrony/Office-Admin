// src/pages/calendar/components/CustomTimeGridEvent.jsx
import React from "react";

/**
 * Custom Time Grid Event Component
 * Uses Schedule-X calendar colors (no hardcoded blue)
 */
export default function CustomTimeGridEvent({ calendarEvent }) {
  // Schedule-X injects colors on the wrapper; keep our inner div transparent
  const isHoliday =
    calendarEvent?.calendarId === "holidays" || calendarEvent?.isHoliday;

  // Time Formatting (HH:MM - HH:MM)
  let timeStr = "";
  try {
    const start = calendarEvent?.start;
    const end = calendarEvent?.end;

    // Timed events are ZonedDateTime; all-day are PlainDate (no time)
    if (
      start &&
      end &&
      typeof start.hour === "number" &&
      typeof end.hour === "number"
    ) {
      const pad = (n) => String(n).padStart(2, "0");
      timeStr = `${pad(start.hour)}:${pad(start.minute)} - ${pad(
        end.hour
      )}:${pad(end.minute)}`;
    }
  } catch {
    // keep empty
  }

  return (
    <div
      className={`custom-time-event ${isHoliday ? "is-holiday" : ""}`}
      style={{
        height: "100%",
        width: "100%",
        background: "transparent", // IMPORTANT: don't override Schedule-X colors
        color: "inherit",
        borderRadius: 8,
        padding: "4px 6px",
        fontSize: "0.75rem",
        overflow: "hidden",
        userSelect: "none",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontWeight: 650, lineHeight: 1.15 }}>
        {calendarEvent?.title}
      </div>
      {timeStr ? <div style={{ opacity: 0.85 }}>{timeStr}</div> : null}
    </div>
  );
}
