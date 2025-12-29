import "./sidebar.scss";
import { NavLink } from "react-router-dom";

import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import GroupIcon from "@mui/icons-material/Group";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";

const navClass = ({ isActive }) => (isActive ? "navLink active" : "navLink");

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="top">
        <NavLink to="/" className="logoLink">
          <span className="logo">urbanegestalt</span>
        </NavLink>
      </div>

      <hr />

      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <li>
            <NavLink to="/" className={navClass} end>
              <DashboardCustomizeIcon className="icon" />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <p className="title">BACKOFFICE</p>
          <li>
            <NavLink to="/timeline" className={navClass}>
              <ViewTimelineIcon className="icon" />
              <span>Timeline</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/calendar" className={navClass}>
              <CalendarMonthIcon className="icon" />
              <span>Calendar</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/projects" className={navClass}>
              <AccountTreeIcon className="icon" />
              <span>Projects</span>
            </NavLink>
          </li>

          <p className="title">MANAGE</p>
          <li>
            <NavLink to="/team" className={navClass}>
              <GroupIcon className="icon" />
              <span>Team</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={navClass}>
              <DisplaySettingsIcon className="icon" />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="bottom">
        <div className="colorOption" />
        <div className="colorOption" />
      </div>
    </div>
  );
};

export default Sidebar;
