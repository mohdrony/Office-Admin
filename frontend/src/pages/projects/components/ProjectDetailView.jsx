// src/pages/projects/components/ProjectDetailView.jsx
import React from 'react';
import { Chip } from '@mui/material'; // Using MUI for quick nice UI elements if available, otherwise pure css
import "./ProjectDetailView.scss"; // Specific styles if needed, or use parent

export default function ProjectDetailView({ project }) {
    if (!project) return <div className="detailEmpty">Select a project</div>;

    return (
        <div className="projectDetailView">
            <div className="pdHeader">
                <div className="pdTitle">
                    <h2>{project.name}</h2>
                    <span className="pdNumber">{project.projectNumber} • {project.shortName}</span>
                </div>
                <div className="pdDates">
                    {project.startDate} — {project.endDate}
                </div>
            </div>

            <div className="pdSection">
                <h4 className="subTitle">Team</h4>
                <div className="pdTeamGrid">
                    {project.persons.map((p, idx) => (
                        <div key={idx} className="pdTeamMember">
                            <div className="pdAvatar" style={{ backgroundImage: `url(${p.avatar})` }} />
                            <span>{p.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pdSection">
                <h4 className="subTitle">Phases</h4>
                <div className="pdPhaseList">
                    {project.phases?.map(phase => (
                        <div key={phase.id} className="pdPhaseRow">
                            <div className="pdPhaseColor" style={{ backgroundColor: phase.color }} />
                            <div className="pdPhaseInfo">
                                <div className="pdPhaseName">{phase.name}</div>
                                <div className="pdPhaseDate">{phase.start} - {phase.end}</div>
                            </div>
                            <div className="pdPhaseBudget">{phase.timeBudget}h</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pdSection">
                <h4 className="subTitle">Milestones</h4>
                <div className="pdMilestoneList">
                    {project.milestones?.map(ms => (
                        <div key={ms.id} className="pdMilestoneItem">
                            <span className="pdMsDate">{ms.date}</span>
                            <span className="pdMsLabel">{ms.label}</span>
                            <Chip label={ms.type} size="small" variant="outlined" style={{ height: 20, fontSize: '0.7rem' }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
