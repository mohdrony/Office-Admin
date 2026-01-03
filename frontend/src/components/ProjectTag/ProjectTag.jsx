import React from "react";
import { useProject } from "../../context/ProjectContext";
import "./ProjectTag.scss";

/**
 * Renders a standardized, clickable project number tag.
 * @param {string} projectId - The ID of the project to open.
 * @param {string} label - The text to display (e.g. "L-2026-035").
 * @param {string} className - Optional extra classes.
 */
export default function ProjectTag({ projectId, label, className = "" }) {
    const { openProjectDetail } = useProject();

    const handleClick = (e) => {
        e.stopPropagation();
        if (projectId) {
            openProjectDetail(projectId);
        }
    };

    return (
        <span
            className={`stdProjectTag ${projectId ? "clickable" : ""} ${className}`}
            onClick={handleClick}
            title={projectId ? "Click to view project details" : ""}
        >
            {label}
        </span>
    );
}
