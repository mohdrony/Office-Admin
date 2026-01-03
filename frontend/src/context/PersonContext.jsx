import React, { createContext, useContext, useState, useMemo } from "react";
import { teamDummy } from "../data/teamDummy";

const PersonContext = createContext(null);

export function PersonProvider({ children }) {
    const [selectedPersonId, setSelectedPersonId] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // In a real app, you might fetch this data. For now, we look it up from dummy.
    const activePerson = useMemo(() => {
        if (!selectedPersonId) return null;
        return teamDummy.find((p) => p.id === selectedPersonId) || null;
    }, [selectedPersonId]);

    const openPersonDetail = (id) => {
        setSelectedPersonId(id);
        setIsEditMode(false);
    };

    const openPersonEdit = (id) => {
        setSelectedPersonId(id);
        setIsEditMode(true);
    };

    const closePersonDetail = () => {
        setSelectedPersonId(null);
        setIsEditMode(false);
    };

    const value = useMemo(
        () => ({
            selectedPersonId,
            activePerson,
            isEditMode,
            setIsEditMode, // allow toggling edit mode from within modal
            openPersonDetail,
            openPersonEdit,
            closePersonDetail,
        }),
        [selectedPersonId, activePerson, isEditMode]
    );

    return (
        <PersonContext.Provider value={value}>{children}</PersonContext.Provider>
    );
}

export function usePerson() {
    const ctx = useContext(PersonContext);
    if (!ctx) throw new Error("usePerson must be used within PersonProvider");
    return ctx;
}
