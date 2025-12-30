// src/components/sidebar/Sidebar.jsx
import "./sidebar.scss";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../theme/ThemeProvider.jsx";

import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import GroupIcon from "@mui/icons-material/Group";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";

const navClass = ({ isActive }) => (isActive ? "navLink active" : "navLink");

const ACCENTS = [
  { key: "yellow", label: "Yellow" },
  { key: "blue", label: "Blue" },
  { key: "green", label: "Green" },
  { key: "purple", label: "Purple" },
  { key: "orange", label: "Orange" },
];

export default function Sidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) {
  const { themeMode, setThemeMode, accent, setAccent } = useTheme();

  const handleNavClick = () => {
    if (isMobileOpen) onCloseMobile();
  };

  const cycleTheme = () => {
    // system -> dark -> light -> system
    const next =
      themeMode === "system"
        ? "dark"
        : themeMode === "dark"
        ? "light"
        : "system";
    setThemeMode(next);
  };

  return (
    <aside className="sidebar">
      <div className="sidebarHeader">
        <NavLink to="/" className="brand" onClick={handleNavClick}>
          <span className="brandText">urbanegestalt</span>
        </NavLink>

        <div className="headerActions">
          {/* Desktop collapse toggle */}
          <button
            type="button"
            className="iconBtn collapseBtn"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>

          {/* Mobile close button */}
          <button
            type="button"
            className="iconBtn mobileCloseBtn"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
            title="Close"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <nav className="nav">
        <div className="navSection">
          <div className="sectionTitle">MAIN</div>

          <NavLink to="/" end className={navClass} onClick={handleNavClick}>
            <span className="iconWrap">
              <DashboardCustomizeIcon className="icon" />
            </span>
            <span className="label">Dashboard</span>
          </NavLink>
        </div>

        <div className="navSection">
          <div className="sectionTitle">BACKOFFICE</div>

          <NavLink to="/timeline" className={navClass} onClick={handleNavClick}>
            <span className="iconWrap">
              <ViewTimelineIcon className="icon" />
            </span>
            <span className="label">Timeline</span>
          </NavLink>

          <NavLink to="/calendar" className={navClass} onClick={handleNavClick}>
            <span className="iconWrap">
              <CalendarMonthIcon className="icon" />
            </span>
            <span className="label">Calendar</span>
          </NavLink>

          <NavLink to="/projects" className={navClass} onClick={handleNavClick}>
            <span className="iconWrap">
              <AccountTreeIcon className="icon" />
            </span>
            <span className="label">Projects</span>
          </NavLink>
        </div>

        <div className="navSection">
          <div className="sectionTitle">MANAGE</div>

          <NavLink to="/team" className={navClass} onClick={handleNavClick}>
            <span className="iconWrap">
              <GroupIcon className="icon" />
            </span>
            <span className="label">Team</span>
          </NavLink>

          <NavLink to="/settings" className={navClass} onClick={handleNavClick}>
            <span className="iconWrap">
              <DisplaySettingsIcon className="icon" />
            </span>
            <span className="label">Settings</span>
          </NavLink>
        </div>
      </nav>

      <div className="sidebarFooter">
        {/* Theme mode */}
        <button
          type="button"
          className="footerChip"
          onClick={cycleTheme}
          title={`Theme: ${themeMode} (click to cycle)`}
        >
          <span className="dot dotTheme" />
          <span className="chipLabel">
            Theme:{" "}
            {themeMode === "system"
              ? "System"
              : themeMode === "dark"
              ? "Dark"
              : "Light"}
          </span>
        </button>

        {/* Accent picker */}
        <div className="accentPicker" title="Accent color">
          {ACCENTS.map((a) => (
            <button
              key={a.key}
              type="button"
              className={`accentDot ${a.key} ${
                accent === a.key ? "active" : ""
              }`}
              onClick={() => setAccent(a.key)}
              aria-label={`Accent: ${a.label}`}
              title={a.label}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
