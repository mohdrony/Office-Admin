import "./sidebar.scss";
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import {Link} from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="top">
                <Link to="/" style={{textDecoration: "none"}}>
                <span className="logo">urbanegestalt</span>
                </Link>
            </div>
            <hr />
            <div className="center">
                <ul>
                    <p className="title">MAIN</p>
                    <li>
                        <DashboardCustomizeIcon className="icon"/>
                        <span>Dashboard</span>
                    </li>
                    <p className="title">BACKOFFICE</p>
                    <Link to="/projects" style={{textDecoration: "none"}}>
                        <li>
                            <ViewTimelineIcon className="icon"/>
                            <span>Projects</span>
                        </li>
                    </Link>
                    <li>
                        <CalendarMonthIcon className="icon"/>
                        <span>Calendar</span>
                    </li>
                    <p className="title">MANAGE</p>
                    <li>
                        <GroupIcon className="icon"/>
                        <span>Dashboard</span>
                    </li>
                    <li>
                        <DisplaySettingsIcon className="icon"/>
                        <span>Settings</span>
                    </li>
                </ul>
            </div>
            <div className="bottom">
                <div className="colorOption"></div>
                <div className="colorOption"></div>
            </div>
        </div>
    );
}

export default Sidebar;