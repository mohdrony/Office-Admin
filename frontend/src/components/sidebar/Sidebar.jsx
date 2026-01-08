// src/components/sidebar/Sidebar.jsx
import "./sidebar.scss";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../theme/ThemeProvider.jsx";

import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import ViewTimelineRoundedIcon from "@mui/icons-material/ViewTimelineRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import TopicRoundedIcon from "@mui/icons-material/TopicRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import PermIdentityRoundedIcon from "@mui/icons-material/PermIdentityRounded";
import PhotoLibraryRoundedIcon from '@mui/icons-material/PhotoLibraryRounded';
import FolderSpecialRoundedIcon from '@mui/icons-material/FolderSpecialRounded';
import PermContactCalendarRoundedIcon from '@mui/icons-material/PermContactCalendarRounded';

import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

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
            {isCollapsed ? <ChevronRightRoundedIcon /> : <ChevronLeftRoundedIcon />}
          </button>

          {/* Mobile close button */}
          <button
            type="button"
            className="iconBtn mobileCloseBtn"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
            title="Close"
          >
            <CloseRoundedIcon />
          </button>
        </div>
      </div>

      <nav className="nav">
        <div className="navSection">
          <div className="sectionTitle">MAIN</div>

          <NavLink to="/" end className={navClass} onClick={handleNavClick}>
            <span className="iconWrap">
              <SpaceDashboardRoundedIcon className="icon" />
            </span>
            <span className="label">Dashboard</span>
          </NavLink>
        </div>

        <div className="navSection">
          <div className="sectionTitle">BACKOFFICE</div>

          <NavLink to="/timeline" className={navClass} onClick={handleNavClick}>
            <span className="iconWrap">
              <ViewTimelineRoundedIcon className="icon" />
            </span>
            <span className="label">Timeline</span>
          </NavLink>

          <NavLink to="/calendar" className={navClass} onClick={handleNavClick}>
            <span className="iconWrap">
              <CalendarMonthRoundedIcon className="icon" />
            </span>
            <span className="label">Calendar</span>
          </NavLink>

          <NavLink to="/projects" className={navClass} onClick={handleNavClick}>
            <span className="iconWrap">
              <TopicRoundedIcon className="icon" />
            </span>
            <span className="label">Projects</span>
          </NavLink>

          <NavLink to="/my-page" className={navClass} onClick={handleNavClick}>
            <span className="iconWrap">
              <PermIdentityRoundedIcon className="icon" />
            </span>
            <span className="label">My Page</span>
          </NavLink>
        </div>

        <div className="navSection">
          <div className="sectionTitle">MANAGE</div>

          <NavLink to="/team" className={navClass} onClick={handleNavClick}>
            <span className="iconWrap">
              <PeopleAltRoundedIcon className="icon" />
            </span>
            <span className="label">Team</span>
          </NavLink>

          <NavLink to="/secretariat" className={navClass} onClick={handleNavClick}>
            <span className="iconWrap">
              <FolderSpecialRoundedIcon className="icon" />
            </span>
            <span className="label">Sekretariat</span>
          </NavLink>

          <NavLink to="/addressbook" className={navClass} onClick={handleNavClick}>
            <span className="iconWrap">
              <PermContactCalendarRoundedIcon className="icon" />
            </span>
            <span className="label">Addressbook</span>
          </NavLink>

          <NavLink to="/settings" className={navClass} onClick={handleNavClick}>
            <span className="iconWrap">
              <SettingsRoundedIcon className="icon" />
            </span>
            <span className="label">Settings</span>
          </NavLink>

          <NavLink to="/photos" className={navClass} onClick={handleNavClick}>
            <span className="iconWrap">
              <PhotoLibraryRoundedIcon className="icon" />
            </span>
            <span className="label">Photos</span>
          </NavLink>
        </div>
      </nav>

      <div className="sidebarFooter">
        {/* Metadata Footer */}
        <div className="sidebarMeta">
          <div className="metaRow">
            <div className="statusDot"></div>
            <span className="metaLabel">Online</span>
          </div>
          <div className="metaInfo">
            <span>Main</span> • <span>#2026.01</span>
          </div>
          <div className="metaCopyright">© 2026 Robiul Alam</div>
        </div>
      </div>
    </aside>
  );
}
