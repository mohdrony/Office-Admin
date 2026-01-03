import React, { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import { useProject } from "../../context/ProjectContext";
import { usePerson } from "../../context/PersonContext"; // To open person details from list
import "./ProjectDetailModal.scss";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";

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

export default function ProjectDetailModal() {
    const { activeProject, closeProjectDetail } = useProject();
    const { openPersonDetail } = usePerson();

    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (activeProject) {
            setFormData({ ...activeProject });
        }
    }, [activeProject]);

    if (!activeProject) return null;

    const handleSave = () => {
        console.log("Saving project:", formData);
        setIsEditMode(false);
    };

    const handleChange = (field, val) => {
        setFormData((prev) => ({ ...prev, [field]: val }));
    };

    return (
        <Modal open={!!activeProject} onClose={closeProjectDetail}>
            <Box sx={MODAL_STYLE}>
                <div className="projectModal">
                    <button className="closeBtn" onClick={closeProjectDetail}>
                        <CloseRoundedIcon />
                    </button>

                    <button
                        className="actionBtn"
                        onClick={() => (isEditMode ? handleSave() : setIsEditMode(true))}
                    >
                        {isEditMode ? <SaveRoundedIcon /> : <EditRoundedIcon />}
                        <span>{isEditMode ? "Save" : "Edit"}</span>
                    </button>

                    <div className="pmContent">
                        {/* Header */}
                        <div className="pmHeader">
                            {/* Reuse circular avatar style but with project image/placeholder */}
                            <img
                                src={
                                    formData.image ||
                                    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2669&auto=format&fit=crop"
                                }
                                alt={formData.name}
                                className="pmAvatar"
                            />

                            {isEditMode ? (
                                <div className="editFields flow">
                                    <input
                                        className="editInput title"
                                        value={formData.name || ""}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                        placeholder="Project Name"
                                    />
                                    <input
                                        className="editInput subtitle"
                                        value={formData.projectNumber || ""}
                                        onChange={(e) => handleChange("projectNumber", e.target.value)}
                                        placeholder="Project Number"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h2>{activeProject.name}</h2>
                                    <div className="metaBadge">{activeProject.projectNumber}</div>
                                </>
                            )}
                        </div>

                        <div className="pmBody">
                            {/* Client Info */}
                            <div className="pmSection">
                                <h4 className="label">Client</h4>
                                <div className="detailRow">
                                    <BusinessRoundedIcon />
                                    {isEditMode ? (
                                        <input
                                            className="editInput"
                                            value={formData.client?.name || ""}
                                            onChange={(e) =>
                                                handleChange("client", { ...formData.client, name: e.target.value })
                                            }
                                            placeholder="Client Name"
                                        />
                                    ) : (
                                        <span>{activeProject.client?.name}</span>
                                    )}
                                </div>
                            </div>

                            {/* Budget */}
                            <div className="pmSection">
                                <h4 className="label">Budget</h4>
                                <div className="detailRow">
                                    <AttachMoneyRoundedIcon />
                                    {isEditMode ? (
                                        <input
                                            className="editInput"
                                            value={formData.budget || ""}
                                            onChange={(e) => handleChange("budget", e.target.value)}
                                            placeholder="Budget"
                                        />
                                    ) : (
                                        <span>{activeProject.budget}</span>
                                    )}
                                </div>
                            </div>

                            {/* Team */}
                            <div className="pmSection">
                                <h4 className="label">Team</h4>
                                <div className="teamList">
                                    {(activeProject.persons || []).map(p => (
                                        <img
                                            key={p.id}
                                            src={p.avatar}
                                            className="teamAvatar"
                                            title={p.name}
                                            onClick={() => {
                                                // If allowed to navigate to person from project modal? 
                                                // Yes, stacking modals is fine or swapping.
                                                openPersonDetail(p.id);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Phases */}
                            <div className="pmSection">
                                <h4 className="label">Phases</h4>
                                <div className="phaseList">
                                    {(activeProject.phases || []).map(ph => (
                                        <div key={ph.id} className="phasePill" style={{ borderLeft: `3px solid ${ph.color}` }}>
                                            {ph.name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </Box>
        </Modal>
    );
}
