// src/pages/calendar/components/EventEditor.jsx
import "./eventEditor.scss";
import { useEffect, useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
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
  onClose,
  onSave,
}) {
  const defaultTitle = mode === "create" ? "New event" : "Edit event";

  const [title, setTitle] = useState(defaultTitle);
  const [startVal, setStartVal] = useState("");
  const [endVal, setEndVal] = useState("");

  useEffect(() => {
    if (!open) return;

    setTitle(defaultTitle);
    setStartVal(initialStart ? toLocalInputValue(initialStart) : "");
    setEndVal(initialEnd ? toLocalInputValue(initialEnd) : "");
  }, [open, initialStart, initialEnd, defaultTitle]);

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
    allDay: false,
    start,
    end,
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
