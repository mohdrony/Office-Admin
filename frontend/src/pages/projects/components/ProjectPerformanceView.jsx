// src/pages/projects/components/ProjectPerformanceView.jsx
import React, { useMemo } from 'react';
import { LinearProgress } from '@mui/material';
import "./ProjectPerformanceView.scss";

export default function ProjectPerformanceView({ project }) {
    if (!project) return <div className="perfEmpty">Metrics require selection</div>;

    const stats = useMemo(() => {
        let totalPlanned = 0;
        let totalWorked = 0;
        const phaseStats = [];

        project.phases?.forEach(phase => {
            const worked = phase.hourEntries?.reduce((sum, entry) => sum + entry.hour, 0) || 0;
            totalPlanned += phase.timeBudget;
            totalWorked += worked;

            phaseStats.push({
                id: phase.id,
                name: phase.name,
                budget: phase.timeBudget,
                worked: worked,
                percent: Math.min(100, Math.round((worked / phase.timeBudget) * 100))
            });
        });

        const totalPercent = totalPlanned > 0 ? Math.round((totalWorked / totalPlanned) * 100) : 0;
        const remaining = totalPlanned - totalWorked;

        return { totalPlanned, totalWorked, totalPercent, remaining, phaseStats };
    }, [project]);

    return (
        <div className="projectPerformanceView">
            <h3 className="cardTitle">Performance</h3>

            {/* Top Cards */}
            <div className="ppGrid">
                <div className="ppCard">
                    <div className="ppValue">{stats.totalPlanned}h</div>
                    <div className="ppLabel">Planned</div>
                </div>
                <div className="ppCard">
                    <div className="ppValue">{stats.totalWorked}h</div>
                    <div className="ppLabel">Worked</div>
                </div>
                <div className="ppCard">
                    <div className="ppValue" style={{ color: stats.remaining < 0 ? '#ff4e4e' : '#5ee38b' }}>
                        {stats.remaining > 0 ? stats.remaining : stats.remaining}h
                    </div>
                    <div className="ppLabel">Remaining</div>
                </div>
            </div>

            {/* Total Progress */}
            <div className="ppMainProgress">
                <div className="ppProgressHeader">
                    <span>Total Progress</span>
                    <span>{stats.totalPercent}%</span>
                </div>
                <LinearProgress
                    variant="determinate"
                    value={Math.min(100, stats.totalPercent)}
                    sx={{ height: 10, borderRadius: 5, backgroundColor: '#f0f0f0', '& .MuiLinearProgress-bar': { backgroundColor: '#4ea1ff' } }}
                />
            </div>

            {/* Phase Breakdown */}
            <h4 className="subTitle">Phase Breakdown</h4>
            <div className="ppPhaseList">
                {stats.phaseStats.map(p => (
                    <div key={p.id} className="ppPhaseItem">
                        <div className="ppPhaseHeader">
                            <span className="ppPhaseName">{p.name}</span>
                            <span className="ppPhaseVal">{p.worked} / {p.budget}h</span>
                        </div>
                        <LinearProgress
                            variant="determinate"
                            value={p.percent}
                            sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: '#f5f5f5',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: p.percent > 100 ? '#ff4e4e' : (p.percent > 80 ? '#ffa000' : '#5ee38b')
                                }
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
