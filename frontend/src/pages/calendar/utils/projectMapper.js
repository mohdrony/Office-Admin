// src/pages/calendar/utils/projectMapper.js

import { TZ_DEFAULT } from "../types";

/**
 * Maps a single project's phases and milestones to Schedule-X events.
 */
export function mapProjectToEvents(project) {
    const events = [];

    // Map Phases
    if (project.phases) {
        project.phases.forEach((phase) => {
            events.push({
                id: phase.id,
                title: `${project.shortName}: ${phase.name}`,
                start: Temporal.PlainDate.from(phase.start),
                end: Temporal.PlainDate.from(phase.end),
                calendarId: "projects",
                description: `Time Budget: ${phase.timeBudget}h`,
            });
        });
    }

    // Map Milestones
    if (project.milestones) {
        project.milestones.forEach((ms) => {
            events.push({
                id: ms.id,
                title: `★ ${ms.label} (${project.shortName})`,
                start: Temporal.PlainDate.from(ms.date),
                end: Temporal.PlainDate.from(ms.date),
                calendarId: "projects",
                description: `Type: ${ms.type}`,
            });
        });
    }

    return events;
}

/**
 * Maps an array of projects to a flat list of Schedule-X events.
 */
export function mapAllProjectsToEvents(projects) {
    return projects.flatMap(mapProjectToEvents);
}
