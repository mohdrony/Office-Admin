// src/components/navbar/Navbar.jsx
import "./navbar.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { teamDummy } from "../../data/teamDummy";

import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";

// MUI for Dropdown
import { Menu, MenuItem, ListItemIcon, ListItemText, Avatar, Divider } from "@mui/material";
import SettingsIcon from '@mui/icons-material/SettingsRounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import PersonIcon from '@mui/icons-material/PersonRounded';


import { useTheme } from "../../theme/ThemeProvider.jsx";

export default function Navbar({ onOpenMobileSidebar }) {
  const { themeMode, setThemeMode } = useTheme();
  const navigate = useNavigate();

  // Simulated User (Julia Weber - u1)
  const user = teamDummy.find(p => p.id === "u1") || teamDummy[0];

  // Dropdown State
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleSettings = () => {
    handleMenuClose();
    navigate('/settings');
  };

  const handleLogout = () => {
    handleMenuClose();
    alert("Logging out (Simulated)");
    navigate('/login'); // Assuming login route exists
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

          {/* User Avatar Dropdown Trigger */}
          <div
            className="avatarWrap"
            title="Profile"
            onClick={handleMenuClick}
            aria-controls={openMenu ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? 'true' : undefined}
            style={{ cursor: 'pointer' }}
          >
            <img src={user.avatar} alt={user.name} className="avatar" />
          </div>

          {/* User Dropdown Menu */}
          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
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
                minWidth: 220,
                '& .MuiMenuItem-root': {
                  fontSize: '0.9rem',
                  gap: '12px',
                  padding: '10px 16px',
                  '&:hover': {
                    backgroundColor: 'var(--hover)',
                  },
                  '& .MuiListItemIcon-root': {
                    minWidth: 'auto',
                    color: 'var(--muted)',
                  }
                },
                '& .MuiDivider-root': {
                  borderColor: 'var(--border)',
                  margin: '8px 0'
                }
              },
            }}
          >
            {/* Header / Info Section within Menu (Simulated item) */}
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', outline: 'none' }}>
              <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{user.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>julia.weber@urbanegestalt.com</span>
              </div>
            </div>

            <Divider />

            <MenuItem onClick={handleSettings}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Account Settings</ListItemText>
            </MenuItem>

            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" style={{ color: '#ef4444' }} />
              </ListItemIcon>
              <ListItemText sx={{ color: '#ef4444' }}>Logout</ListItemText>
            </MenuItem>
          </Menu>

        </div>
      </div>
    </header>
  );
}
