// src/components/navbar/Navbar.jsx
import "./navbar.scss";

import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";

import avatarImage from "../../assets/avatar.jpg";
import { useTheme } from "../../theme/ThemeProvider.jsx";

export default function Navbar({ onOpenMobileSidebar }) {
  const { themeMode, setThemeMode } = useTheme();

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

  const ThemeIcon =
    themeMode === "system"
      ? SettingsBrightnessIcon
      : themeMode === "dark"
      ? DarkModeIcon
      : LightModeIcon;

  const themeTitle =
    themeMode === "system"
      ? "Theme: System (click to switch)"
      : themeMode === "dark"
      ? "Theme: Dark (click to switch)"
      : "Theme: Light (click to switch)";

  return (
    <header className="navbar">
      <div className="wrapper">
        <button
          type="button"
          className="mobileMenuBtn"
          onClick={onOpenMobileSidebar}
          aria-label="Open sidebar"
          title="Menu"
        >
          <MenuIcon />
        </button>

        <div className="search">
          <SearchIcon className="searchIcon" />
          <input type="text" placeholder="Search" />
        </div>

        <div className="items">
          <button className="itemBtn" type="button" title="Language">
            <LanguageIcon className="icon" />
          </button>

          <button
            className="itemBtn"
            type="button"
            onClick={cycleTheme}
            title={themeTitle}
          >
            <ThemeIcon className="icon" />
          </button>

          <button className="itemBtn" type="button" title="Notifications">
            <NotificationsIcon className="icon" />
            <span className="counter">3</span>
          </button>

          <div className="avatarWrap" title="Profile">
            <img src={avatarImage} alt="" className="avatar" />
          </div>
        </div>
      </div>
    </header>
  );
}
