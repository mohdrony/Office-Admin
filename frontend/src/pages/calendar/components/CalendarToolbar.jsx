// src/pages/calendar/components/CalendarToolbar.jsx
import "./calendarToolbar.scss";
import { useState } from "react";

import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

export default function CalendarToolbar({
  title = "Calendar",
  activeView,
  onPrev,
  onNext,
  onToday,
  onSetView,
  calendars = [],
  visibleCalendars = new Set(),
  onToggleCalendar,
  onOpenCreate
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="calToolbar">
      <div className="left">
        <span className="title">{title}</span>
        <button
          type="button"
          className="ghostBtn"
          onClick={onOpenCreate}
          style={{ color: 'var(--text)' }} // explicit text color if needed, but ghostBtn usually handles it; marginLeft removed, now handled by .left gap
        >
          <AddRoundedIcon fontSize="small" style={{ color: 'var(--accent)' }} />
          <span>Create Event</span>
        </button>
      </div>

      <div className="center">
        <button type="button" className="iconBtn" onClick={onPrev} title="Previous">
          <ChevronLeftRoundedIcon fontSize="small" />
        </button>

        <div className="segmented">
          <button
            type="button"
            className={activeView === "day" ? "active" : ""}
            onClick={() => onSetView("day")}
          >
            Day
          </button>
          <button
            type="button"
            className={activeView === "week" ? "active" : ""}
            onClick={() => onSetView("week")}
          >
            Week
          </button>
          <button
            type="button"
            className={activeView === "month-grid" ? "active" : ""}
            onClick={() => onSetView("month-grid")}
          >
            Month
          </button>
        </div>

        <button type="button" className="iconBtn" onClick={onNext} title="Next">
          <ChevronRightRoundedIcon fontSize="small" />
        </button>

        <button type="button" className="ghostBtn" onClick={onToday} title="Today">
          <TodayRoundedIcon fontSize="small" />
          <span>Today</span>
        </button>
      </div>

      <div className="right">
        {/* Calendar Filter Toggle */}
        <div className="calFilterRoot">
          <button
            type="button"
            className="ghostBtn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span>Calendars</span>
            <ExpandMoreRoundedIcon fontSize="small" style={{ marginLeft: 4 }} />
          </button>

          {menuOpen && (
            <>
              <div
                className="calFilterBackdrop"
                onClick={() => setMenuOpen(false)}
              />
              <div className="calFilterMenu">
                {calendars.map(cal => (
                  <label key={cal.id} className="calFilterItem">
                    <input
                      type="checkbox"
                      checked={visibleCalendars.has(cal.id)}
                      onChange={() => onToggleCalendar(cal.id)}
                    />
                    <span
                      className="calDot"
                      style={{ backgroundColor: cal.color }}
                    />
                    <span>{cal.label}</span>
                  </label>
                ))}
                <div className="calFilterDivider" />
                <button type="button" className="calFilterAction" disabled>
                  Import Calendar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
