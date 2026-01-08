// src/pages/calendar/components/EventEditor.jsx
import "./eventEditor.scss";
import { useEffect, useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { TZ_DEFAULT } from "../types";

function pad(n) {
  return String(n).padStart(2, "0");
}

function toLocalInputValue(zdt) {
  return `${zdt.year}-${pad(zdt.month)}-${pad(zdt.day)}T${pad(zdt.hour)}:${pad(
    zdt.minute
  )}`;
}

function toLocalInputValueFromPlain(pdt) {
  return `${pdt.year}-${pad(pdt.month)}-${pad(pdt.day)}T${pad(pdt.hour)}:${pad(
    pdt.minute
  )}`;
}

function parseLocalToZdt(val) {
  if (!val) return null;
  try {
    const pdt = Temporal.PlainDateTime.from(val);
    return pdt.toZonedDateTime(TZ_DEFAULT);
  } catch {
    return null;
  }
}

export default function EventEditor({
  open,
  mode = "create", // "create" | "edit"
  initialStart, // Temporal.ZonedDateTime
  initialEnd, // Temporal.ZonedDateTime
  initialTitle = "",
  initialCalendarId = "office",
  initialAllDay = false,
  onClose,
  onSave,
  onDelete,
  calendars = [],
}) {
  const defaultTitle = mode === "create" ? "New event" : "Edit event";

  const [title, setTitle] = useState(defaultTitle);

  // UI values (datetime-local strings)
  const [startVal, setStartVal] = useState("");
  const [endVal, setEndVal] = useState("");

  // Real source of truth (ZonedDateTime)
  const [startZdt, setStartZdt] = useState(null);
  const [endZdt, setEndZdt] = useState(null);

  const [calendarId, setCalendarId] = useState("office");
  const [allDay, setAllDay] = useState(false);
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    if (!open) return;

    setTitle(mode === "create" ? defaultTitle : initialTitle);

    setStartZdt(initialStart ?? null);
    setEndZdt(initialEnd ?? null);

    setStartVal(initialStart ? toLocalInputValue(initialStart) : "");
    setEndVal(initialEnd ? toLocalInputValue(initialEnd) : "");

    setCalendarId(initialCalendarId || "office");
    setAllDay(initialAllDay);
    setDuration(1);
    console.log("[EE] TZ_DEFAULT =", TZ_DEFAULT);

  }, [open, mode, defaultTitle, initialTitle, initialStart, initialEnd, initialCalendarId, initialAllDay]);

  const canSave = useMemo(() => {
    return title.trim().length > 0 && (startZdt || startVal) && (endZdt || endVal);
  }, [title, startZdt, endZdt]);

  if (!open) return null;

  const handleStartChange = (val) => {
    setStartVal(val);
    console.log("[EE] start input changed:", val);
    try {
      const pdt = Temporal.PlainDateTime.from(val);
      console.log("[EE] start parsed PDT:", pdt.toString());
      console.log("[EE] toZonedDateTime typeof TZ_DEFAULT:", typeof TZ_DEFAULT, TZ_DEFAULT);
console.log("[EE] toZonedDateTime fn:", Temporal.PlainDateTime.prototype.toZonedDateTime.toString().slice(0, 200));
console.log("[EE] calling toZonedDateTime with:", TZ_DEFAULT);

      const zdt = pdt.toZonedDateTime(TZ_DEFAULT);
      console.log("[EE] start computed ZDT:", zdt.toString());
      setStartZdt(zdt);

      // keep end consistent with duration (optional but nice)
      const endPdt = pdt.add({ minutes: duration * 60 });
      console.log("[EE] end computed from duration:", endPdt.toString());
      setEndVal(toLocalInputValueFromPlain(endPdt));
      setEndZdt(endPdt.toZonedDateTime(TZ_DEFAULT));
    } catch (e) {
      // ignore invalid input while typing
      console.log("[EE] start parse failed for:", val, e);
    }
  };

  const handleEndChange = (val) => {
    setEndVal(val);
    console.log("[EE] end input changed:", val);
    try {
      const pdt = Temporal.PlainDateTime.from(val);
      console.log("[EE] end parsed PDT:", pdt.toString());
      setEndZdt(pdt.toZonedDateTime(TZ_DEFAULT));
      console.log("[EE] end computed ZDT:", pdt.toZonedDateTime(TZ_DEFAULT).toString());
    } catch (e) {
      // ignore
      console.log("[EE] end parse failed for:", val, e);
    }
  };

  const handleDurationChange = (delta) => {
    const newDur = Math.max(0.5, duration + delta);
    setDuration(newDur);

    if (!startVal) return;
    try {
      const pdt = Temporal.PlainDateTime.from(startVal);
      const endPdt = pdt.add({ minutes: newDur * 60 });
      setEndVal(toLocalInputValueFromPlain(endPdt));
      setEndZdt(endPdt.toZonedDateTime(TZ_DEFAULT));
    } catch {
      // ignore
    }
  };

  const handleSave = () => {
    const startFinal = startZdt ?? parseLocalToZdt(startVal);
    const endFinal = endZdt ?? parseLocalToZdt(endVal);

    console.log("[EE] SAVE click", {
      title,
      allDay,
      calendarId,
      startVal,
      endVal,
      startZdt: startZdt?.toString?.() ?? startZdt,
      endZdt: endZdt?.toString?.() ?? endZdt,
    });

    onSave?.({
      title: title.trim(),
      allDay,
      start: startFinal,
      end: endFinal,
      calendarId,
    });
  };

  return (
    <div className="eeScrim" role="dialog" aria-modal="true">
      <div className="eeModal">
        <div className="eeHeader">
          <div className="eeTitle">
            {mode === "create" ? "Create event" : "Edit event"}
          </div>
          <button className="eeIconBtn" type="button" onClick={onClose} title="Close">
            <CloseIcon />
          </button>
        </div>

        <div className="eeBody">
          <label className="eeField">
            <div className="eeLabel">Title</div>
            <input
              className="eeInput"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Site visit, Jour fixe…"
              autoFocus
            />
          </label>

          <label className="eeField">
            <div className="eeLabel">Calendar</div>
            <select
              className="eeInput"
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
            >
              {calendars.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <label
            className="eeField"
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          >
            <input
              type="checkbox"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
            />
            <span>All Day Event</span>
          </label>

          <div className="eeGrid2">
            <label className="eeField">
              <div className="eeLabel">Start</div>
              <input
                className="eeInput"
                type="datetime-local"
                value={startVal}
                onChange={(e) => handleStartChange(e.target.value)}
              />
            </label>

            <div className="eeField">
              <div className="eeLabel">Duration</div>
              <div className="eeDurationCtrl">
                <button type="button" onClick={() => handleDurationChange(-0.5)}>
                  -
                </button>
                <span>{duration}h</span>
                <button type="button" onClick={() => handleDurationChange(0.5)}>
                  +
                </button>
              </div>
            </div>

            <label className="eeField">
              <div className="eeLabel">End</div>
              <input
                className="eeInput"
                type="datetime-local"
                value={endVal}
                onChange={(e) => handleEndChange(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="eeFooter">
          {mode === "edit" && (
            <button
              className="eeBtn ghost danger"
              type="button"
              onClick={() => {
                if (window.confirm("Delete this event?")) onDelete?.();
              }}
              style={{ marginRight: "auto" }}
            >
              <DeleteOutlineIcon fontSize="small" style={{ marginRight: 4 }} />
              Delete
            </button>
          )}

          <button className="eeBtn ghost" type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="eeBtn primary"
            type="button"
            disabled={!canSave}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
