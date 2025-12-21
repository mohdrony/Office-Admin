import "./calendar.scss";

import Sidebar from "../../components/sidebar/Sidebar.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";

import { projectsDummy } from "../../data/projectsDummy.js";

const Calendar = () => {
    return (
        <div className="calendar">
            <Sidebar/>
            <div className="calendarContainer">
                <Navbar />
                <div className="calendarContent">
                    <span>Calendar Loading</span>
                </div>
            </div>
        </div>
    )
}

export default Calendar;