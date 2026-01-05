import React, { useState, useMemo } from "react";
import "./MyPage.scss";
import { myPageData } from "../../data/myPageDummy";
import { projectsDummy } from "../../data/projectsDummy";
import { teamDummy } from "../../data/teamDummy";
import { Temporal } from "temporal-polyfill";
import EventEditor from "../calendar/components/EventEditor";
import TimeEntryModal from "../projects/components/TimeEntryModal";
import ProjectTag from "../../components/ProjectTag/ProjectTag";
import { TZ_DEFAULT } from "../calendar/types";
import { fetchHolidays } from "../../api/holidays";

// MUI Components
import { Menu, MenuItem, ListItemIcon, ListItemText, Avatar, Chip } from "@mui/material";

// MUI Icons
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import BeachAccessRoundedIcon from "@mui/icons-material/BeachAccessRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import SickRoundedIcon from "@mui/icons-material/SickRounded";
import EuroRoundedIcon from "@mui/icons-material/EuroRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

const VIEW_MODES = {
    WEEK: "week",
    MONTH: "month",
    YEAR: "year",
};

export default function MyPage() {
    const [viewMode, setViewMode] = useState(VIEW_MODES.WEEK);
    const [cursorDate, setCursorDate] = useState(() => Temporal.Now.plainDateISO());

    // Data - User from TeamDummy (Simulating logged in user ID u1)
    const user = teamDummy.find(p => p.id === "u1") || teamDummy[0];

    // Time entries still from local dummy for now
    const { timeEntries } = myPageData;

    const [holidays, setHolidays] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchHolidays();
                setHolidays(data);
            } catch (e) {
                console.error("Failed to load holidays in MyPage", e);
            }
        })();
    }, []);

    const holidayMap = useMemo(() => {
        const map = {};
        holidays.forEach(h => {
            map[h.date] = h;
        });
        return map;
    }, [holidays]);

    // --- Modal State ---
    const [isEventEditorOpen, setIsEventEditorOpen] = useState(false);
    const [editorProps, setEditorProps] = useState({});

    const [isTimeEntryModalOpen, setIsTimeEntryModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(projectsDummy[0]);

    // --- Dropdown State ---
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    // --- Navigation Logic ---
    const goNext = () => {
        if (viewMode === VIEW_MODES.WEEK) setCursorDate(d => d.add({ days: 7 }));
        else if (viewMode === VIEW_MODES.MONTH) setCursorDate(d => d.add({ months: 1 }));
        else if (viewMode === VIEW_MODES.YEAR) setCursorDate(d => d.add({ years: 1 }));
    };

    const goPrev = () => {
        if (viewMode === VIEW_MODES.WEEK) setCursorDate(d => d.subtract({ days: 7 }));
        else if (viewMode === VIEW_MODES.MONTH) setCursorDate(d => d.subtract({ months: 1 }));
        else if (viewMode === VIEW_MODES.YEAR) setCursorDate(d => d.subtract({ years: 1 }));
    };

    const goToday = () => {
        setCursorDate(Temporal.Now.plainDateISO());
    };

    // --- Title Helper ---
    const dateTitle = useMemo(() => {
        if (viewMode === VIEW_MODES.YEAR) return cursorDate.year.toString();
        if (viewMode === VIEW_MODES.MONTH) return cursorDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

        // Week Title
        const dayOfWeek = cursorDate.dayOfWeek;
        const startOfWeek = cursorDate.subtract({ days: dayOfWeek - 1 });
        const endOfWeek = startOfWeek.add({ days: 6 });
        return `${startOfWeek.toLocaleString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }, [cursorDate, viewMode]);


    // --- Vacation Stats ---
    // Note: user from teamDummy doesn't have vacationEntitlement, so for now retrieving form myPageData.user
    // In a real scenario, this would come from the user object or a separate query.
    const vacationStats = useMemo(() => {
        const vacationHours = timeEntries
            .filter((e) => e.isVacation)
            .reduce((acc, curr) => acc + curr.hours, 0);

        const takenDays = vacationHours / 8;
        const existingEntitlement = myPageData.user.vacationEntitlement; // Fallback to dummy data
        const remaining = existingEntitlement - takenDays;

        return { takenDays, existingEntitlement, remaining };
    }, [timeEntries]);


    // --- View Data Calculations (Week/Month/Year) ---
    const weekData = useMemo(() => {
        if (viewMode !== VIEW_MODES.WEEK) return null;
        const dayOfWeek = cursorDate.dayOfWeek;
        const startOfWeek = cursorDate.subtract({ days: dayOfWeek - 1 });
        const days = [];
        let totalWeekHours = 0;
        let expectedHours = 0;

        for (let i = 0; i < 7; i++) {
            const date = startOfWeek.add({ days: i });
            const dateStr = date.toString();
            const daysEntries = timeEntries.filter((e) => e.date === dateStr);
            const hours = daysEntries.reduce((acc, curr) => acc + curr.hours, 0);
            totalWeekHours += hours;

            const dayName = date.toLocaleString('en-US', { weekday: 'short' });
            let status = "normal";
            const isWeekend = date.dayOfWeek > 5;
            const holiday = holidayMap[dateStr];

            if (holiday) {
                status = "holiday";
                // If it's a holiday, we don't expect work hours (unless they worked)
            } else if (!isWeekend) {
                expectedHours += 8;
            }

            if (!holiday) {
                if (hours > 8) status = "overtime";
                else if (hours < 8 && hours > 0 && date.dayOfWeek <= 5) status = "undertime";
            }

            // Adjust holiday status priority? 
            // If they worked on holiday, maybe show both? 
            // For now, if holiday, show holiday.

            days.push({ date: dateStr, dayName, hours, status, isWeekend, holidayName: holiday?.name });
        }
        return { days, totalWeekHours, expectedHours };
    }, [timeEntries, cursorDate, viewMode, holidayMap]);

    const monthData = useMemo(() => {
        if (viewMode !== VIEW_MODES.MONTH) return null;
        const year = cursorDate.year;
        const month = cursorDate.month;
        const daysInMonth = cursorDate.daysInMonth;
        const firstDayOfMonth = Temporal.PlainDate.from({ year, month, day: 1 });
        const startPadding = firstDayOfMonth.dayOfWeek - 1;
        const days = [];
        let totalMonthHours = 0;
        for (let i = 0; i < startPadding; i++) days.push({ type: 'padding' });
        for (let i = 1; i <= daysInMonth; i++) {
            const date = Temporal.PlainDate.from({ year, month, day: i });
            const dateStr = date.toString();
            const daysEntries = timeEntries.filter(e => e.date === dateStr);
            const hours = daysEntries.reduce((acc, curr) => acc + curr.hours, 0);
            totalMonthHours += hours;
            let status = "normal";
            const holiday = holidayMap[dateStr];

            if (hours > 8) status = "overtime";
            else if (hours < 8 && hours > 0 && date.dayOfWeek <= 5) status = "undertime";
            if (date.dayOfWeek > 5) status = "weekend";

            if (holiday) {
                status = "holiday";
            }

            days.push({ type: 'day', date: dateStr, dayNum: i, hours, status, holidayName: holiday?.name });
        }
        return { days, totalMonthHours };
    }, [timeEntries, cursorDate, viewMode, holidayMap]);

    const yearData = useMemo(() => {
        if (viewMode !== VIEW_MODES.YEAR) return null;
        const year = cursorDate.year;
        const months = [];
        let totalYearHours = 0;
        for (let m = 1; m <= 12; m++) {
            const monthStr = `${year}-${String(m).padStart(2, '0')}`;
            const monthEntries = timeEntries.filter(e => e.date.startsWith(monthStr));
            const hours = monthEntries.reduce((acc, curr) => acc + curr.hours, 0);
            totalYearHours += hours;
            months.push({ name: new Date(year, m - 1).toLocaleString('en-US', { month: 'short' }), hours: hours, intensity: hours > 160 ? 'high' : hours > 80 ? 'medium' : hours > 0 ? 'low' : 'none' });
        }
        return { months, totalYearHours };
    }, [timeEntries, cursorDate, viewMode]);


    // --- Action Handlers ---
    const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleOpenEntry = (type) => {
        handleMenuClose();
        const now = Temporal.Now.zonedDateTimeISO(TZ_DEFAULT);

        switch (type) {
            case 'hours':
                setSelectedProject(projectsDummy[0]);
                setIsTimeEntryModalOpen(true);
                break;
            case 'vacation':
                setEditorProps({
                    mode: "create",
                    initialCalendarId: "vacation",
                    initialAllDay: true,
                    initialStart: now,
                    initialEnd: now.add({ hours: 1 }),
                    initialTitle: "Vacation",
                });
                setIsEventEditorOpen(true);
                break;
            case 'sick':
                setEditorProps({
                    mode: "create",
                    initialCalendarId: "sick", // Assuming backend handles this or mapped to ID
                    initialAllDay: true,
                    initialStart: now,
                    initialEnd: now.add({ hours: 1 }),
                    initialTitle: "Sick Leave",
                });
                setIsEventEditorOpen(true);
                break;
            case 'cost':
                alert("Cost Entry Modal Placeholder");
                break;
        }
    };


    return (
        <div className="myPage">
            <div className="myPageSurface">
                {/* === Global Toolbar === */}
                <div className="mpToolbar">
                    <span className="title">My Page</span>
                    <div className="spacer" style={{ flex: 1 }}></div>
                    <div className="action-block">
                        <button
                            className="ghostBtn"
                            onClick={handleMenuClick}
                            aria-controls={openMenu ? 'add-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={openMenu ? 'true' : undefined}
                        >
                            <AddRoundedIcon fontSize="small" style={{ color: 'var(--accent)' }} />
                            <span>Add New</span>
                            <KeyboardArrowDownRoundedIcon fontSize="small" style={{ opacity: 0.5, marginLeft: 2 }} />
                        </button>
                        <Menu
                            id="add-menu"
                            anchorEl={anchorEl}
                            open={openMenu}
                            onClose={handleMenuClose}
                            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                                    mt: 1.5,
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    bgcolor: 'var(--panel)',
                                    color: 'var(--text)',
                                    '& .MuiMenuItem-root': {
                                        fontSize: '0.9rem',
                                        gap: '8px',
                                        padding: '10px 16px',
                                        '&:hover': {
                                            backgroundColor: 'var(--hover)',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            minWidth: 'auto',
                                            color: 'var(--muted)',
                                        }
                                    },
                                },
                            }}
                        >
                            <MenuItem onClick={() => handleOpenEntry('hours')}>
                                <ListItemIcon><AccessTimeRoundedIcon fontSize="small" /></ListItemIcon>
                                <ListItemText>Hour Entry</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => handleOpenEntry('vacation')}>
                                <ListItemIcon><BeachAccessRoundedIcon fontSize="small" /></ListItemIcon>
                                <ListItemText>Vacation Entry</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => handleOpenEntry('sick')}>
                                <ListItemIcon><SickRoundedIcon fontSize="small" /></ListItemIcon>
                                <ListItemText>Sick Day</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => handleOpenEntry('cost')}>
                                <ListItemIcon><EuroRoundedIcon fontSize="small" /></ListItemIcon>
                                <ListItemText>Cost Entry</ListItemText>
                            </MenuItem>
                        </Menu>
                    </div>
                </div>

                <div className="mpContentScroll">
                    <div className="stacked-content">

                        {/* === 1. User Info & Stats Card === */}
                        <div className="card user-info-card">
                            <div className="user-profile">
                                <Avatar
                                    src={user.avatar}
                                    alt={user.name}
                                    sx={{ width: 64, height: 64, border: '2px solid var(--border)' }}
                                />
                                <div className="user-details">
                                    <div className="user-name">{user.name}</div>
                                    <div className="user-role">{user.role}</div>
                                </div>
                            </div>

                            <div className="divider-v"></div>

                            <div className="stats-block">
                                <div className="stats-label">Vacation</div>
                                <div className="stats-row">
                                    <div className="stat-item">
                                        <span className="val">{vacationStats.existingEntitlement}</span>
                                        <span className="lbl">Entitled</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="val">{vacationStats.takenDays}</span>
                                        <span className="lbl">Taken</span>
                                    </div>
                                    <div className="stat-item highlight">
                                        <span className="val">{vacationStats.remaining}</span>
                                        <span className="lbl">Remaining</span>
                                    </div>
                                </div>
                            </div>

                            <div className="divider-v"></div>

                            <div className="projects-block">
                                <div className="stats-label">Active Projects</div>
                                <div className="project-chips">
                                    {projectsDummy.slice(0, 3).map(p => (
                                        <ProjectTag
                                            key={p.id}
                                            projectId={p.id}
                                            label={p.shortName}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>


                        {/* === 2. Hours Overview Section === */}
                        <div className="card hours-section">
                            <div className="section-header">
                                <div className="header-left">
                                    <h2>Hours Overview</h2>
                                    <span className="current-date-range">{dateTitle}</span>
                                </div>

                                <div className="controls">
                                    <button type="button" className="iconBtn" onClick={goPrev}>
                                        <ChevronLeftRoundedIcon fontSize="small" />
                                    </button>

                                    <div className="segmented">
                                        <button
                                            className={viewMode === VIEW_MODES.YEAR ? "active" : ""}
                                            onClick={() => setViewMode(VIEW_MODES.YEAR)}
                                        >
                                            Year
                                        </button>
                                        <button
                                            className={viewMode === VIEW_MODES.MONTH ? "active" : ""}
                                            onClick={() => setViewMode(VIEW_MODES.MONTH)}
                                        >
                                            Month
                                        </button>
                                        <button
                                            className={viewMode === VIEW_MODES.WEEK ? "active" : ""}
                                            onClick={() => setViewMode(VIEW_MODES.WEEK)}
                                        >
                                            Week
                                        </button>
                                    </div>

                                    <button type="button" className="iconBtn" onClick={goNext}>
                                        <ChevronRightRoundedIcon fontSize="small" />
                                    </button>

                                    <button type="button" className="ghostBtn" onClick={goToday}>
                                        <TodayRoundedIcon fontSize="small" />
                                        <span>Today</span>
                                    </button>
                                </div>
                            </div>

                            {/* --- Views Content (Week/Month/Year) --- */}
                            <div className="view-content">
                                {viewMode === VIEW_MODES.WEEK && weekData && (
                                    <div className="week-view">
                                        <div className="days-grid">
                                            {weekData.days.map((day) => (
                                                <div key={day.date} className="day-col">
                                                    <span className="hours-val">{day.hours > 0 ? day.hours : "-"}</span>
                                                    <div className="bar-container">
                                                        <div
                                                            className={`bar ${day.status}`}
                                                            style={{ height: `${Math.min((day.hours / 12) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="day-name">{day.dayName}</span>
                                                    {day.holidayName && <div style={{ fontSize: '0.7rem', color: '#888', marginTop: -4 }}>{day.holidayName}</div>}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="week-summary">
                                            <div className="stat">
                                                <span className="label">Total Hours</span>
                                                <span className="value">{weekData.totalWeekHours} / {weekData.expectedHours}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {viewMode === VIEW_MODES.MONTH && monthData && (
                                    <div className="month-view">
                                        <div className="month-grid-header">
                                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                        </div>
                                        <div className="month-grid">
                                            {monthData.days.map((d, i) => (
                                                <div key={i} className={`month-day ${d.type} ${d.status || ''}`}>
                                                    {d.type === 'day' && (
                                                        <>
                                                            <span className="day-num">{d.dayNum}</span>
                                                            {d.hours > 0 && <span className="day-hours">{d.hours}h</span>}
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="week-summary" style={{ marginTop: '1rem' }}>
                                            <div className="stat">
                                                <span className="label">Total Hours</span>
                                                <span className="value">{monthData.totalMonthHours}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {viewMode === VIEW_MODES.YEAR && yearData && (
                                    <div className="year-view">
                                        <div className="year-grid">
                                            {yearData.months.map((m) => (
                                                <div key={m.name} className={`year-month-card intensity-${m.intensity}`}>
                                                    <span className="month-name">{m.name}</span>
                                                    <span className="month-hours">{m.hours}h</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="week-summary" style={{ marginTop: '1rem' }}>
                                            <div className="stat">
                                                <span className="label">Total Year</span>
                                                <span className="value">{yearData.totalYearHours}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* --- Global Modals --- */}
            <EventEditor
                open={isEventEditorOpen}
                onClose={() => setIsEventEditorOpen(false)}
                onSave={(data) => {
                    console.log("Saved Event:", data);
                    alert("Saved!");
                    setIsEventEditorOpen(false);
                }}
                calendars={[
                    { id: 'office', label: 'Office' },
                    { id: 'projects', label: 'Projects' },
                    { id: 'vacation', label: 'Vacation' },
                    { id: 'sick', label: 'Sick Leave' },
                ]}
                {...editorProps}
            />

            {
                selectedProject && (
                    <TimeEntryModal
                        open={isTimeEntryModalOpen}
                        onClose={() => setIsTimeEntryModalOpen(false)}
                        onSave={() => setIsTimeEntryModalOpen(false)}
                        project={selectedProject}
                    />
                )
            }
        </div >
    );
}
