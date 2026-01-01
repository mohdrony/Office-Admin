// src/pages/calendar/components/CalendarToolbar.jsx
import "./calendarToolbar.scss";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TodayIcon from "@mui/icons-material/Today";

export default function CalendarToolbar({
  title = "Calendar",
  subtitle = "Plan • Create • Track",
  activeView,
  onPrev,
  onNext,
  onToday,
  onSetView,
}) {
  return (
    <div className="calToolbar">
      <div className="left">
        <div className="title">{title}</div>
        <div className="muted">{subtitle}</div>
      </div>

      <div className="center">
        <button type="button" className="tlBtn" onClick={onPrev} title="Previous">
          <ChevronLeftIcon />
        </button>

        <button type="button" className="tlBtn" onClick={onToday} title="Today">
          <TodayIcon />
        </button>

        <button type="button" className="tlBtn" onClick={onNext} title="Next">
          <ChevronRightIcon />
        </button>
      </div>

      <div className="right">
        <div className="segmented">
          <button
            type="button"
            className={`segBtn ${activeView === "day" ? "active" : ""}`}
            onClick={() => onSetView("day")}
          >
            Day
          </button>
          <button
            type="button"
            className={`segBtn ${activeView === "week" ? "active" : ""}`}
            onClick={() => onSetView("week")}
          >
            Week
          </button>
          <button
            type="button"
            className={`segBtn ${activeView === "month-grid" ? "active" : ""}`}
            onClick={() => onSetView("month-grid")}
          >
            Month
          </button>
        </div>
      </div>
    </div>
  );
}
