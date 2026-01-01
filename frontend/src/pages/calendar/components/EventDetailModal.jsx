import "./eventDetailModal.scss";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";

function formatDate(date) {
    if (!date) return "";
    // Accept ISO string, Date, or Temporal objects
    let jsDate;
    if (typeof date === "string" || date instanceof Date) {
        jsDate = new Date(date);
    } else if (typeof Temporal !== "undefined" && (date instanceof Temporal.ZonedDateTime || date instanceof Temporal.PlainDate || date instanceof Temporal.PlainDateTime)) {
        // Convert Temporal to JavaScript Date via Instant
        jsDate = new Date(date.toInstant().epochMilliseconds);
    } else {
        // Fallback
        jsDate = new Date(date);
    }
    return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(jsDate);
}

function formatTime(date) {
    if (!date) return "";
    let jsDate;
    if (typeof date === "string" || date instanceof Date) {
        jsDate = new Date(date);
    } else if (typeof Temporal !== "undefined" && (date instanceof Temporal.ZonedDateTime || date instanceof Temporal.PlainDateTime)) {
        jsDate = new Date(date.toInstant().epochMilliseconds);
    } else {
        jsDate = new Date(date);
    }
    return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(jsDate);
}

export default function EventDetailModal({
    event,
    isOpen,
    onClose,
    onEdit,
    calendars = [],
}) {
    if (!isOpen || !event) return null;

    const calendar = calendars.find((c) => c.id === event.calendarId) || {};
    // Determine all‑day: Temporal.PlainDate (no time) or ISO strings at midnight
    const isAllDay = (
        (typeof Temporal !== "undefined" && (event.start instanceof Temporal.PlainDate || event.end instanceof Temporal.PlainDate)) ||
        (typeof event.start === "string" && event.start.endsWith("00:00") && typeof event.end === "string" && event.end.endsWith("00:00"))
    );

    return (
        <div className="edScrim" onClick={onClose}>
            <div className="edModal" onClick={(e) => e.stopPropagation()}>
                <div className="edHeader">
                    <div className="edActions">
                        <button className="edIconBtn" onClick={onEdit} title="Edit Event">
                            <EditRoundedIcon fontSize="small" />
                        </button>
                        <button className="edIconBtn" onClick={onClose} title="Close">
                            <CloseRoundedIcon fontSize="small" />
                        </button>
                    </div>
                </div>

                <div className="edBody">
                    <div className="edTitleLine">
                        <div
                            className="edCalDot"
                            style={{ background: calendar.color || "var(--accent)" }}
                        />
                        <h2 className="edTitle">{event.title}</h2>
                    </div>

                    <div className="edMeta">
                        <div className="edMetaRow">
                            <CalendarTodayRoundedIcon fontSize="inherit" className="edIcon" />
                            <span>{formatDate(event.start)}</span>
                        </div>
                        <div className="edMetaRow">
                            <AccessTimeRoundedIcon fontSize="inherit" className="edIcon" />
                            <span>
                                {isAllDay
                                    ? "All Day"
                                    : `${formatTime(event.start)} – ${formatTime(event.end)}`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
