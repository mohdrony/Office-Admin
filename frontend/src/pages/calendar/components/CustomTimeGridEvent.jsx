import React from 'react';

/**
 * Custom Time Grid Event Component
 * 
 * Simply renders the event content.
 * Drag and drop / resize is handled by the @schedule-x/drag-and-drop plugin
 * on the wrapping container managed by the library.
 */
export default function CustomTimeGridEvent({ calendarEvent }) {
    // --- Styling ---
    // Get color from event or default
    // We can use a default color if needed.

    const style = {
        height: '100%',
        width: '100%',
        background: '#4ea1ff', // Default blue
        color: 'white',
        borderRadius: '4px',
        padding: '2px 4px',
        fontSize: '0.75rem',
        overflow: 'hidden',
        userSelect: 'none',
        boxSizing: 'border-box',
        // Cursor handled by parent if draggable
    };

    // Time Formatting
    let timeStr = "";
    try {
        if (calendarEvent.start && calendarEvent.end) {
            const startPart = calendarEvent.start.includes(' ') ? calendarEvent.start.split(' ')[1] : calendarEvent.start.split('T')[1];
            const endPart = calendarEvent.end.includes(' ') ? calendarEvent.end.split(' ')[1] : calendarEvent.end.split('T')[1];
            if (startPart && endPart) {
                timeStr = `${startPart} - ${endPart}`;
            }
        }
    } catch (e) {
        console.warn("CustomTimeGridEvent: failed to format time", calendarEvent);
    }

    return (
        <div
            className="custom-time-event"
            style={style}
        >
            <div style={{ fontWeight: 600 }}>{calendarEvent.title}</div>
            <div style={{ opacity: 0.9 }}>{timeStr}</div>
        </div>
    );
}
