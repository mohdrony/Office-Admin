import React from "react";
import "./Settings.scss";
import { useTheme } from "../../theme/ThemeProvider";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import SettingsSystemDaydreamRoundedIcon from "@mui/icons-material/SettingsSystemDaydreamRounded";
import ColorLensRoundedIcon from "@mui/icons-material/ColorLensRounded";
import ContrastRoundedIcon from "@mui/icons-material/ContrastRounded";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useEffect, useState } from "react";
import { fetchHolidays, createHoliday, deleteHoliday } from "../../api/holidays";

const ACCENTS = [
    { key: "yellow", label: "Yellow" },
    { key: "blue", label: "Blue" },
    { key: "green", label: "Green" },
    { key: "purple", label: "Purple" },
    { key: "orange", label: "Orange" },
];

export default function Settings() {
    const { themeMode, setThemeMode, accent, setAccent } = useTheme();

    const [holidays, setHolidays] = useState([]);
    const [newHolidayDate, setNewHolidayDate] = useState("");
    const [newHolidayName, setNewHolidayName] = useState("");
    const [newHolidayType, setNewHolidayType] = useState("FULL_DAY");

    useEffect(() => {
        loadHolidays();
    }, []);

    async function loadHolidays() {
        try {
            const data = await fetchHolidays();
            setHolidays(data);
        } catch (e) {
            console.error(e);
        }
    }

    async function handleAddHoliday(e) {
        e.preventDefault();
        if (!newHolidayDate || !newHolidayName) return;
        try {
            await createHoliday({
                date: newHolidayDate,
                name: newHolidayName,
                type: newHolidayType
            });
            setNewHolidayDate("");
            setNewHolidayName("");
            setNewHolidayType("FULL_DAY");
            loadHolidays();
        } catch (e) {
            alert("Failed to add holiday");
        }
    }

    async function handleDeleteHoliday(id) {
        if (!confirm("Delete this holiday?")) return;
        try {
            await deleteHoliday(id);
            loadHolidays();
        } catch (e) {
            alert("Failed to delete");
        }
    }

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

                    {/* --- Public Holidays Section --- */}
                    <div className="settingSection">
                        <h3>
                            <DateRangeRoundedIcon className="icon" fontSize="small" />
                            Public Holidays
                        </h3>
                        <p className="description">Define public holidays for the company.</p>

                        <div className="holidaysContainer" style={{ width: '100%', marginTop: '1rem' }}>
                            <form onSubmit={handleAddHoliday} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '1rem', flexWrap: 'wrap' }}>
                                <label style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 120 }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Date</span>
                                    <input
                                        type="date"
                                        value={newHolidayDate}
                                        onChange={e => setNewHolidayDate(e.target.value)}
                                        style={{ padding: '8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                                        required
                                    />
                                </label>
                                <label style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 2, minWidth: 150 }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Name</span>
                                    <input
                                        type="text"
                                        value={newHolidayName}
                                        onChange={e => setNewHolidayName(e.target.value)}
                                        placeholder="e.g. New Year"
                                        style={{ padding: '8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                                        required
                                    />
                                </label>
                                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Type</span>
                                    <select
                                        value={newHolidayType}
                                        onChange={e => setNewHolidayType(e.target.value)}
                                        style={{ padding: '8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                                    >
                                        <option value="FULL_DAY">Full Day</option>
                                        <option value="HALF_DAY">Half Day</option>
                                    </select>
                                </label>
                                <button type="submit" className="eeBtn primary" style={{ height: 36, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <AddRoundedIcon fontSize="small" /> Add
                                </button>
                            </form>

                            <div className="holidaysList" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {holidays.map(h => (
                                    <div key={h.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--hover)', borderRadius: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <span style={{ fontFamily: 'monospace', fontWeight: 500 }}>{h.date}</span>
                                            <span>{h.name}</span>
                                            {h.type === 'HALF_DAY' && <span style={{ fontSize: '0.7rem', background: 'var(--accent)', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>Half</span>}
                                        </div>
                                        <button onClick={() => handleDeleteHoliday(h.id)} style={{ padding: 4, borderRadius: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--muted)', display: 'flex' }}>
                                            <DeleteRoundedIcon fontSize="small" />
                                        </button>
                                    </div>
                                ))}
                                {holidays.length === 0 && <div style={{ color: 'var(--muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>No holidays defined.</div>}
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
