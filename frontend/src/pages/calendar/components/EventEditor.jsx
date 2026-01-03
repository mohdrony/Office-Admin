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
  // zdt is Temporal.ZonedDateTime
  const y = zdt.year;
  const m = pad(zdt.month);
  const d = pad(zdt.day);
  const hh = pad(zdt.hour);
  const mm = pad(zdt.minute);
  return `${y}-${m}-${d}T${hh}:${mm}`;
}

export default function EventEditor({
  open,
  mode = "create", // "create" | "edit"
  initialStart, // Temporal.ZonedDateTime
  initialEnd, // Temporal.ZonedDateTime
  initialTitle = "",
  initialCalendarId = "office",
  onClose,
  onSave,
  onDelete,
  calendars = []
}) {
  const defaultTitle = mode === "create" ? "New event" : "Edit event";

  const [title, setTitle] = useState(defaultTitle);
  const [startVal, setStartVal] = useState("");
  const [endVal, setEndVal] = useState("");
  const [calendarId, setCalendarId] = useState("office");
  const [allDay, setAllDay] = useState(false);
  const [duration, setDuration] = useState(1); // in hours

  useEffect(() => {
    if (!open) return;

    setTitle(mode === "create" ? defaultTitle : initialTitle);
    setStartVal(initialStart ? toLocalInputValue(initialStart) : "");
    setEndVal(initialEnd ? toLocalInputValue(initialEnd) : "");
    setCalendarId(mode === "create" ? "office" : initialCalendarId);
    setAllDay(false);
    setDuration(1);
  }, [open, initialStart, initialEnd, defaultTitle, mode, initialTitle, initialCalendarId]);

  // Update end time when duration changes
  const updateEndFromDuration = (newDuration, startValue) => {
    if (!startValue) return;
    try {
      const start = Temporal.PlainDateTime.from(startValue);
      // Add duration in minutes (fractional hours supported)
      const end = start.add({ minutes: newDuration * 60 });
      setEndVal(toLocalInputValue(end));
    } catch (e) {
      // ignore invalid start
    }
  };

  const handleDurationChange = (delta) => {
    const newDur = Math.max(0.5, duration + delta);
    setDuration(newDur);
    updateEndFromDuration(newDur, startVal);
  };

  const canSave = useMemo(() => {
    return title.trim().length > 0 && startVal && endVal;
  }, [title, startVal, endVal]);

  if (!open) return null;

  const handleSave = () => {
    const startPlain = Temporal.PlainDateTime.from(startVal);
    const endPlain = Temporal.PlainDateTime.from(endVal);

    const start = startPlain.toZonedDateTime(TZ_DEFAULT);
    const end = endPlain.toZonedDateTime(TZ_DEFAULT);

    onSave?.({
      title: title.trim(),
      allDay,
      start,
      end,
      calendarId
    });
  };


  return (
    <div className="eeScrim" role="dialog" aria-modal="true">
      <div className="eeModal">
        <div className="eeHeader">
          <div className="eeTitle">{mode === "create" ? "Create event" : "Edit event"}</div>
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
              onChange={e => setCalendarId(e.target.value)}
            >
              {calendars.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </label>

          <label className="eeField" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={allDay}
              onChange={e => setAllDay(e.target.checked)}
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
                onChange={(e) => setStartVal(e.target.value)}
              />
            </label>


            <div className="eeField">
              <div className="eeLabel">Duration</div>
              <div className="eeDurationCtrl">
                <button type="button" onClick={() => handleDurationChange(-0.5)}>-</button>
                <span>{duration}h</span>
                <button type="button" onClick={() => handleDurationChange(0.5)}>+</button>
              </div>
            </div>

            <label className="eeField">
              <div className="eeLabel">End</div>
              <input
                className="eeInput"
                type="datetime-local"
                value={endVal}
                onChange={(e) => setEndVal(e.target.value)}
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
          <button className="eeBtn primary" type="button" disabled={!canSave} onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
