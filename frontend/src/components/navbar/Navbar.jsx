import "./navbar.scss";
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NotificationsIcon from '@mui/icons-material/Notifications';

import avatarImage from "../../assets/avatar.jpg";


const Navbar = () => {
    return (
        <div className="navbar">
            
            <div className="wrapper">
                <div className="search">
                    <input type="text" placeholder="Search" />
                    <SearchIcon/>
                </div>
                <div className="items">
                    <div className="item">
                        <LanguageIcon className="icon"/>
                    </div>
                    <div className="item">
                        <DarkModeIcon className="icon"/>
                    </div>
                    <div className="item">
                        <NotificationsIcon className="icon"/>
                        <div className="counter">3</div>
                    </div>
                    <div className="item">
                        <img 
                        src={avatarImage} 
                        alt=""
                        className="avatar" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar