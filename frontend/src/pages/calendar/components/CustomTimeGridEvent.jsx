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
            // Ensure strings
            const startStr = typeof calendarEvent.start === 'string' ? calendarEvent.start : calendarEvent.start.toString();
            const endStr = typeof calendarEvent.end === 'string' ? calendarEvent.end : calendarEvent.end.toString();

            // Extract time part if available
            const startPart = startStr.includes(' ') ? startStr.split(' ')[1] : (startStr.includes('T') ? startStr.split('T')[1] : null);
            const endPart = endStr.includes(' ') ? endStr.split(' ')[1] : (endStr.includes('T') ? endStr.split('T')[1] : null);

            if (startPart && endPart) {
                // Simplified HH:MM
                timeStr = `${startPart.substring(0, 5)} - ${endPart.substring(0, 5)}`;
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
