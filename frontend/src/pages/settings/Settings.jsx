import React from "react";
import "./Settings.scss";
import { useTheme } from "../../theme/ThemeProvider";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import SettingsSystemDaydreamRoundedIcon from "@mui/icons-material/SettingsSystemDaydreamRounded";
import ColorLensRoundedIcon from "@mui/icons-material/ColorLensRounded";
import ContrastRoundedIcon from "@mui/icons-material/ContrastRounded";

const ACCENTS = [
    { key: "yellow", label: "Yellow" },
    { key: "blue", label: "Blue" },
    { key: "green", label: "Green" },
    { key: "purple", label: "Purple" },
    { key: "orange", label: "Orange" },
];

export default function Settings() {
    const { themeMode, setThemeMode, accent, setAccent } = useTheme();

    return (
        <div className="settingsPage">
            <div className="settingsSurface">
                <div className="settingsToolbar">
                    <span className="title">Settings</span>
                </div>

                <div className="settingsContent">

                    {/* --- Theme Section --- */}
                    <div className="settingSection">
                        <h3>
                            <ContrastRoundedIcon className="icon" fontSize="small" />
                            Appearance
                        </h3>
                        <p className="description">Choose how the application looks to you.</p>

                        <div className="controls">
                            <button
                                className={`themeOption ${themeMode === 'light' ? 'active' : ''}`}
                                onClick={() => setThemeMode('light')}
                            >
                                <LightModeRoundedIcon className="icon" />
                                <span className="label">Light</span>
                            </button>

                            <button
                                className={`themeOption ${themeMode === 'dark' ? 'active' : ''}`}
                                onClick={() => setThemeMode('dark')}
                            >
                                <DarkModeRoundedIcon className="icon" />
                                <span className="label">Dark</span>
                            </button>

                            <button
                                className={`themeOption ${themeMode === 'system' ? 'active' : ''}`}
                                onClick={() => setThemeMode('system')}
                            >
                                <SettingsSystemDaydreamRoundedIcon className="icon" />
                                <span className="label">System</span>
                            </button>
                        </div>
                    </div>

                    {/* --- Accent Section --- */}
                    <div className="settingSection">
                        <h3>
                            <ColorLensRoundedIcon className="icon" fontSize="small" />
                            Accent Color
                        </h3>
                        <p className="description">Select a primary color for buttons and highlights.</p>

                        <div className="controls">
                            {ACCENTS.map((a) => (
                                <button
                                    key={a.key}
                                    className={`accentOption ${a.key} ${accent === a.key ? "active" : ""}`}
                                    onClick={() => setAccent(a.key)}
                                    title={a.label}
                                    aria-label={`Select ${a.label} accent`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* --- Dummy Account Section --- */}
                    <div className="settingSection">
                        <h3>Account</h3>
                        <div className="profileRow">
                            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--bg)' }}>
                                JW
                            </div>
                            <div className="profileInfo">
                                <span className="name">Julia Weber</span>
                                <span className="email">julia.weber@urbanegestalt.com</span>
                            </div>
                            <button className="editBtn">Edit Profile</button>
                        </div>
                    </div>

                    {/* --- Dummy Notifications Section --- */}
                    <div className="settingSection">
                        <h3>Notifications</h3>
                        <p className="description">Manage how you receive updates.</p>
                        <div className="controls" style={{ flexDirection: 'column', gap: 0, width: '100%' }}>
                            <div className="toggleRow">
                                <span className="label">Email Notifications</span>
                                <div className="toggleSwitch checked" />
                            </div>
                            <div className="toggleRow">
                                <span className="label">Push Notifications</span>
                                <div className="toggleSwitch" />
                            </div>
                            <div className="toggleRow">
                                <span className="label">Weekly Digest</span>
                                <div className="toggleSwitch checked" />
                            </div>
                        </div>
                    </div>

                    {/* --- Metadata Section (Duplicated from sidebar idea for completeness, optional) --- */}
                    <div className="settingSection">
                        <h3>About</h3>
                        <p className="description">Office Admin Application</p>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text)', opacity: 0.8 }}>
                            Version 1.0.0 (Dev) <br />
                            Developed by Robiul Alam
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
