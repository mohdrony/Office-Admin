import React, { useState } from "react";
import "./team.scss";
import { teamDummy } from "../../data/teamDummy";
import { usePerson } from "../../context/PersonContext";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";

const Team = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { openPersonDetail } = usePerson();

    // Filter logic
    const filteredMembers = teamDummy.filter((m) => {
        const s = searchTerm.toLowerCase();
        return (
            m.name.toLowerCase().includes(s) ||
            m.role.toLowerCase().includes(s) ||
            m.skills.some((sk) => sk.toLowerCase().includes(s))
        );
    });

    return (
        <div className="teamPage">
            <div className="teamSurface">
                {/* Toolbar */}
                <div className="teamToolbar">
                    <div className="left">
                        <span className="title">Team Members</span>
                        <button type="button" className="ghostBtn">
                            <AddRoundedIcon fontSize="small" style={{ color: "var(--accent)" }} />
                            <span>Add Member</span>
                        </button>
                    </div>

                    <div className="center">
                        <div className="teamSearchBar">
                            <SearchRoundedIcon fontSize="small" />
                            <input
                                type="text"
                                placeholder="Search by name, role, or skill..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="right">
                        <span className="muted">
                            {filteredMembers.length} active members
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="teamContent">
                    <div className="teamGrid">
                        {filteredMembers.map((member) => (
                            <div
                                key={member.id}
                                className="memberCard"
                                onClick={() => openPersonDetail(member.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <span className={`statusBadge ${member.status}`}>
                                    {member.status}
                                </span>

                                <div className="cardHeader">
                                    <img src={member.avatar} alt={member.name} className="avatar" />
                                    <div className="info">
                                        <h3>{member.name}</h3>
                                        <div className="role">{member.role}</div>
                                    </div>
                                </div>

                                <div className="cardBody">
                                    <div className="contactRow">
                                        <EmailRoundedIcon fontSize="inherit" />
                                        <a href={`mailto:${member.email}`}>{member.email}</a>
                                    </div>
                                    <div className="contactRow">
                                        <PhoneRoundedIcon fontSize="inherit" />
                                        <span>{member.phone}</span>
                                    </div>
                                </div>

                                <div className="cardFooter">
                                    <div className="sectionLabel">Skills</div>
                                    <div className="skills">
                                        {member.skills.slice(0, 4).map((skill) => (
                                            <span key={skill} className="skillChip">
                                                {skill}
                                            </span>
                                        ))}
                                        {member.skills.length > 4 && (
                                            <span className="skillChip">+{member.skills.length - 4}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;
