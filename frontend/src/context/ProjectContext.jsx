import React, { createContext, useContext, useState, useMemo } from "react";
import { projectsDummy } from "../data/projectsDummy";

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    const activeProject = useMemo(() => {
        if (!selectedProjectId) return null;
        return projectsDummy.find((p) => p.id === selectedProjectId) || null;
    }, [selectedProjectId]);

    const openProjectDetail = (id) => {
        setSelectedProjectId(id);
    };

    const closeProjectDetail = () => {
        setSelectedProjectId(null);
    };

    const value = useMemo(
        () => ({
            selectedProjectId,
            activeProject,
            openProjectDetail,
            closeProjectDetail,
        }),
        [selectedProjectId, activeProject]
    );

    return (
        <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
    );
}

export function useProject() {
    const ctx = useContext(ProjectContext);
    if (!ctx) throw new Error("useProject must be used within ProjectProvider");
    return ctx;
}
