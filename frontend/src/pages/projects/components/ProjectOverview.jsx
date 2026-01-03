// src/pages/projects/components/ProjectOverview.jsx
import React, { useMemo } from 'react';
import { Chip, CircularProgress, Box, Typography } from '@mui/material';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import "./ProjectOverview.scss";

function CircularProgressWithLabel(props) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} size={80} thickness={4} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

export default function ProjectOverview({ project }) {
    if (!project) return <div className="overviewEmpty">Select a project</div>;

    const stats = useMemo(() => {
        let totalPlanned = 0;
        let totalWorked = 0;
        project.phases?.forEach(phase => {
            totalPlanned += phase.timeBudget;
            totalWorked += phase.hourEntries?.reduce((sum, entry) => sum + entry.hour, 0) || 0;
        });
        const percent = totalPlanned > 0 ? (totalWorked / totalPlanned) * 100 : 0;
        return { totalPlanned, totalWorked, percent };
    }, [project]);

    return (
        <div className="projectOverview">
            {/* Header / Identity with Image Banner */}
            <div className="poHeader">
                <div className="poIdentity">
                    {project.image && (
                        <div
                            className="poBanner"
                            style={{ backgroundImage: `url(${project.image})` }}
                        />
                    )}
                    <div className="poTitleBlock">
                        <h1 className="poTitle">{project.name}</h1>
                        <div className="poMetaRow">
                            <span className="poBadge">{project.projectNumber}</span>
                            <span className="poSite">{project.site}</span>
                        </div>
                    </div>
                </div>

                {/* Visual Progress Ring */}
                <div className="poProgress">
                    <div className="poRingLabel">Completion</div>
                    <CircularProgressWithLabel value={Math.min(100, stats.percent)} color={stats.percent > 100 ? "error" : "primary"} />
                </div>
            </div>

            <div className="poDivider" />

            {/* Content Grid */}
            <div className="poGrid">
                {/* Left: Client & Budget */}
                <div className="poColumn">
                    <h4 className="poSubTitle">Client Info</h4>
                    <div className="poClientInfo">
                        <div className="name">{project.client?.name || "N/A"}</div>
                        <div className="detail">{project.client?.contact}</div>
                        <div className="detail link">{project.client?.email}</div>
                    </div>

                    {/* Team Section */}
                    {project.persons && project.persons.length > 0 && (
                        <div className="poTeamRow">
                            <h4 className="poSubTitle" style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>Team</h4>
                            <div style={{ display: 'flex', gap: '-8px' }}>
                                {project.persons.map(user => (
                                    <div
                                        key={user.id}
                                        style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            backgroundSize: 'cover',
                                            backgroundImage: `url(${user.avatar})`,
                                            border: '2px solid var(--panel)',
                                            marginLeft: '-8px',
                                            position: 'relative',
                                            firstOfType: { marginLeft: 0 }
                                        }}
                                        title={user.name}
                                    />
                                ))}
                                {/* Hacky correction for the first item margin since we are inline styles */}
                                <style>{`
                                    .poTeamRow > div > div:first-of-type { margin-left: 0 !important; }
                                `}</style>
                            </div>
                        </div>
                    )}

                    <div className="poStatBlock">
                        <div className="poStatItem">
                            <span className="label">Budget</span>
                            <span className="value money">{project.budget || "—"}</span>
                        </div>
                        <div className="poStatSeparator" />
                        <div className="poStatItem">
                            <span className="label">Planned</span>
                            <span className="value">{stats.totalPlanned}h</span>
                        </div>
                        <div className="poStatSeparator" />
                        <div className="poStatItem">
                            <span className="label">Worked</span>
                            <span className="value">{stats.totalWorked}h</span>
                        </div>
                    </div>
                </div>

                {/* Right: Active Phases */}
                <div className="poColumn flow">
                    <h4 className="poSubTitle">Active Phases</h4>
                    <div className="poPhaseTags">
                        {project.phases?.slice(0, 3).map(ph => (
                            <div key={ph.id} className="poPhaseTag" style={{ background: ph.color + '40' }}>
                                <span className="dot" style={{ background: ph.color }} />
                                {ph.name}
                            </div>
                        ))}
                        {project.phases?.length > 3 && <span className="poMore">+{project.phases.length - 3} more</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}
