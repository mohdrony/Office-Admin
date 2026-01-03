import React, { useEffect, useState } from "react";
import { Modal, Box } from "@mui/material";
import { usePerson } from "../../context/PersonContext";
import { useProject } from "../../context/ProjectContext";
import { projectsDummy } from "../../data/projectsDummy";
import ProjectTag from "../ProjectTag/ProjectTag";
import "./PersonDetailModal.scss";


import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded"; // If needed

const MODAL_STYLE = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    maxWidth: "500px",
    bgcolor: "var(--panel)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    boxShadow: 24,
    p: 0,
    outline: "none",
};

export default function PersonDetailModal() {
    const {
        activePerson, // The actual data object
        selectedPersonId,
        isEditMode,
        setIsEditMode,
        closePersonDetail,
    } = usePerson();

    const { openProjectDetail } = useProject();

    // Local form state
    const [formData, setFormData] = useState({});

    // Sync activePerson to form data when it changes
    useEffect(() => {
        if (activePerson) {
            setFormData({ ...activePerson });
        }
    }, [activePerson]);

    if (!selectedPersonId || !activePerson) return null;

    const handleCreate = () => {
        // In a real app, save to backend
        console.log("Saving person:", formData);
        setIsEditMode(false);
        // Ideally, update the global context/data list here too (omitted for dummy data)
    }

    const handleChange = (field, val) => {
        setFormData((prev) => ({ ...prev, [field]: val }));
    };

    return (
        <Modal open={!!selectedPersonId} onClose={closePersonDetail}>
            <Box sx={MODAL_STYLE}>
                <div className="personModal">
                    {/* Header Image / Background could go here if we had one, for now just clean header */}
                    <button className="closeBtn" onClick={closePersonDetail}>
                        <CloseRoundedIcon />
                    </button>

                    {/* Edit/View Toggle */}
                    <button
                        className="actionBtn topAction"
                        onClick={() => (isEditMode ? handleCreate() : setIsEditMode(true))}
                    >
                        {isEditMode ? <SaveRoundedIcon /> : <EditRoundedIcon />}
                        <span>{isEditMode ? "Save" : "Edit"}</span>
                    </button>

                    <div className="pmContent">
                        {/* Avatar Section */}
                        <div className="pmHeader">
                            <img
                                src={isEditMode ? formData.avatar : activePerson.avatar}
                                alt={activePerson.name}
                                className="pmAvatar"
                            />
                            {isEditMode ? (
                                <div className="editFields flow">
                                    <input
                                        className="editInput title"
                                        value={formData.name || ""}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                        placeholder="Full Name"
                                    />
                                    <input
                                        className="editInput subtitle"
                                        value={formData.role || ""}
                                        onChange={(e) => handleChange("role", e.target.value)}
                                        placeholder="Role"
                                    />
                                </div>
                            ) : (
                                <div className="viewFields">
                                    <h2>{activePerson.name}</h2>
                                    <div className="roleBadge">{activePerson.role}</div>
                                </div>
                            )}
                        </div>

                        <div className="pmBody">
                            {/* Contact Info */}
                            <div className="pmSection">
                                <h4 className="label">Contact</h4>
                                <div className="contactRow">
                                    <EmailRoundedIcon />
                                    {isEditMode ? (
                                        <input
                                            className="editInput"
                                            value={formData.email || ""}
                                            onChange={(e) => handleChange("email", e.target.value)}
                                        />
                                    ) : (
                                        <a href={`mailto:${activePerson.email}`}>{activePerson.email}</a>
                                    )}
                                </div>
                                <div className="contactRow">
                                    <PhoneRoundedIcon />
                                    {isEditMode ? (
                                        <input
                                            className="editInput"
                                            value={formData.phone || ""}
                                            onChange={(e) => handleChange("phone", e.target.value)}
                                        />
                                    ) : (
                                        <span>{activePerson.phone}</span>
                                    )}
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="pmSection">
                                <h4 className="label">Skills</h4>
                                {isEditMode ? (
                                    <textarea
                                        className="editInput area"
                                        value={(formData.skills || []).join(", ")}
                                        onChange={e => handleChange("skills", e.target.value.split(",").map(s => s.trim()))}
                                        placeholder="Comma separated skills"
                                    />
                                ) : (
                                    <div className="skillsWrap">
                                        {(activePerson.skills || []).map((s) => (
                                            <span key={s} className="pmSkill">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Projects (View Only for now) */}
                            {!isEditMode && (
                                <div className="pmSection">
                                    <h4 className="label">Active Projects</h4>
                                    <div className="projectsList">
                                        {(activePerson.projects || []).length === 0 ? <span className="muted">No active projects</span> : null}
                                        {(activePerson.projects || []).map(pNumber => {
                                            // Lookup the project ID from its display number (e.g. "L-2026-035")
                                            // In real app, person.projects would likely be objects { id, number }
                                            const found = projectsDummy.find(pd => pd.projectNumber === pNumber || pd.id === pNumber);

                                            return (
                                                <ProjectTag
                                                    key={pNumber}
                                                    projectId={found ? found.id : null}
                                                    label={pNumber}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Footer Status */}
                        <div className="pmFooter">
                            <span className={`statusIndicator ${activePerson.status}`}>
                                {activePerson.status}
                            </span>
                        </div>

                    </div>
                </div>
            </Box>
        </Modal>
    );
}
