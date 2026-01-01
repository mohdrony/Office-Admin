# Calendar Implementation Analysis

## Current Status
- **Framework**: Schedule-X (React adapter) v1.
- **Components**:
    - `Calendar.jsx` (Container/Controller)
    - `CalendarCanvas.jsx` (Schedule-X wrapper)
    - `CalendarToolbar.jsx` (Custom navigation)
- **Data Source**: `frontend/src/pages/calendar/store/eventStoreDummy.js`
    - Contains 2 hardcoded events (internal dummy data).
    - **NOT connected** to `frontend/src/data/projectsDummy.js` (the main project data).

## Critical Issues
### 1. Broken Data Flow
The `CalendarCanvas` component receives `events` as a prop from `Calendar.jsx`, but **ignores it**.
- In `CalendarCanvas.jsx`, line 62 initializes the calendar with `events: []`.
- There is no `useEffect` or logic to update the calendar events when the `events` prop changes.
- **Result**: The calendar is likely rendering empty, even though `eventStoreDummy` has data.

### 2. Disconnected Dummy Data
- The main application seems to use `projectsDummy.js` (complex project/phase structure).
- The calendar uses `eventStoreDummy.js` (simple event structure).
- These two data sources are completely separate. To show project phases/milestones on the calendar, a mapper is needed to convert `projectsDummy` data into Schedule-X events.

## Suggestions

### A. Fix Event Rendering
Modify `CalendarCanvas.jsx` to sync the `events` prop with the Schedule-X `eventsService`.
```javascript
// Suggested change in CalendarCanvas.jsx
useEffect(() => {
  if (eventsService && events) {
    // This is pseudo-code; Schedule-X eventsService usually has methods like .set() or .add()
    // You might need to clear and add, or update.
    // Documentation check needed for exact method to replacing all events.
    // frequent approach: eventsService.set(events)
  }
}, [eventsService, events]);
```

### B. Integrate Real Dummy Data
Create a new store or mapper that consumes `projectsDummy.js` instead of the isolated `eventStoreDummy.js`.
- Map `phases` to timeline events.
- Map `milestones` to single-day or point events.
- Assign colors based on the project/phase colors defined in `projectsDummy.js`.

### C. Verify Schedule-X Configuration
- The simple `useCalendarApp` usage might need review to ensure all plugins (resize, drag & drop) are configured if needed later.
- Current config has `office` and `projects` calendars defined with custom colors, which is good.

## Next Steps
1.  **Fix the bug**: Implement the missing event sync in `CalendarCanvas`.
2.  **Unify Data**: Replace `eventStoreDummy` logic to read from `projectsDummy`.
