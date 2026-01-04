export const myPageData = {
  user: {
    id: 1,
    firstName: "Robiul",
    lastName: "Alam",
    vacationEntitlement: 28, // days
  },
  // Time entries for the current week (assuming current week is Jan 4-10, 2026 for context, or generic)
  // We'll use ISO date strings.
  timeEntries: [
    {
      id: 101,
      date: "2026-01-05", // Monday
      hours: 8.0,
      description: "Project work",
      isVacation: false,
    },
    {
      id: 102,
      date: "2026-01-06", // Tuesday
      hours: 9.5, // Overtime
      description: "Deep work session",
      isVacation: false,
    },
    {
      id: 103,
      date: "2026-01-07", // Wednesday
      hours: 8.0,
      description: "Client meeting",
      isVacation: false,
    },
    {
      id: 104,
      date: "2026-01-08", // Thursday
      hours: 4.0, // Undertime (half day?)
      description: "Half day",
      isVacation: false,
    },
    {
      id: 105,
      date: "2026-01-08", // Thursday - Vacation remainder?
      hours: 4.0,
      description: "Vacation",
      isVacation: true,
    },
    {
      id: 106,
      date: "2026-01-09", // Friday
      hours: 8.0,
      description: "Vacation",
      isVacation: true,
    },
    // Previous vacation example
    {
      id: 99,
      date: "2025-12-24",
      hours: 8.0,
      description: "Christmas Eve",
      isVacation: true,
    },
  ],
};
