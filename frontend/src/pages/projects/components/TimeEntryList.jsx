// src/pages/projects/components/TimeEntryList.jsx
import React, { useMemo } from 'react';
import { IconButton, Button } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import "./TimeEntryList.scss";

export default function TimeEntryList({ project, onEdit, onAdd }) {
    if (!project) return null;

    // Flatten all entries
    const entries = useMemo(() => {
        const all = [];
        project.phases?.forEach(phase => {
            phase.hourEntries?.forEach(entry => {
                all.push({
                    ...entry, // note: entry object reference is needed for editing
                    phaseName: phase.name,
                    phaseColor: phase.color
                });
            });
        });
        return all;
    }, [project]);

    return (
        <div className="timeEntryList">
            <div className="telHeaderRow">
                <h3 className="cardTitle">Time Entries</h3>
                <Button
                    startIcon={<AddRoundedIcon />}
                    size="small"
                    variant="outlined"
                    onClick={onAdd}
                >
                    Log Time
                </Button>
            </div>

            <div className="telTableContainer">
                {entries.length === 0 ? (
                    <div className="telEmpty">No time entries recorded.</div>
                ) : (
                    <table className="telTable">
                        <thead>
                            <tr>
                                <th>Phase</th>
                                <th>Person</th>
                                <th>Description</th>
                                <th className="right">Hours</th>
                                <th className="center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((e, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <span className="telPhaseBadge" style={{ background: e.phaseColor }}>
                                            {e.phaseName}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="telUser">
                                            <div className="telAvatar" style={{ backgroundImage: `url(${e.person.avatar})`, borderRadius: '50%' }} />
                                            <span>{e.person.name}</span>
                                        </div>
                                    </td>
                                    <td className="telDesc">{e.description}</td>
                                    <td className="right telHours">{e.hour}h</td>
                                    <td className="center">
                                        <IconButton size="small" onClick={() => onEdit(e)}>
                                            <EditRoundedIcon fontSize="small" />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
