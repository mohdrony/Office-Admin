import avatarImage from "../assets/avatar.jpg";

export const projectsDummy = [
  {
    id: "p1",
    projectNumber: "202501",
    shortName: "ABCD",
    name: "Sample Project",
    persons: [
      { id: "u1", name: "Person 1", avatar: avatarImage },
      { id: "u2", name: "Person 2", avatar: avatarImage },
    ],

    startDate: "2025-01-06",
    endDate: "2025-10-31",

    phases: [
      { id: "ph1", name: "Concept", start: "2025-01-06", end: "2025-02-28", color: "#D9E8FF" },
      { id: "ph2", name: "Design", start: "2025-03-01", end: "2025-05-31", color: "#DFF7E3" },
      { id: "ph3", name: "Approval", start: "2025-06-01", end: "2025-07-15", color: "#FFF1D6" },
      { id: "ph4", name: "Execution", start: "2025-07-16", end: "2025-10-31", color: "#F2D9FF" },
      { id: "ph5", name: "Concept", start: "2025-01-06", end: "2025-02-28", color: "#D9E8FF" },
      { id: "ph6", name: "Design", start: "2025-03-01", end: "2025-05-31", color: "#DFF7E3" },
      { id: "ph7", name: "Approval", start: "2025-06-01", end: "2025-07-15", color: "#FFF1D6" },
      { id: "ph8", name: "Execution", start: "2025-07-16", end: "2025-10-31", color: "#F2D9FF" },
      { id: "ph9", name: "Concept", start: "2025-01-06", end: "2025-02-28", color: "#D9E8FF" },
      { id: "ph10", name: "Design", start: "2025-03-01", end: "2025-05-31", color: "#DFF7E3" },
      { id: "ph11", name: "Approval", start: "2025-06-01", end: "2025-07-15", color: "#FFF1D6" },
      { id: "ph12", name: "Execution", start: "2025-07-16", end: "2025-10-31", color: "#F2D9FF" }, ,
    ],

    milestones: [
      { id: "m1", date: "2025-01-10", label: "Kickoff", lane: 0, type: "meeting" },
      { id: "m2", date: "2025-02-20", label: "Submission", lane: 1, type: "submission" },
      { id: "m3", date: "2025-08-15", label: "Approval", lane: 2, type: "approval" },
      { id: "m4", date: "2025-09-22", label: "Deadline", lane: 3, typle: "deadline" }
    ],

  },

  {
    id: "p2",
    projectNumber: "202502",
    shortName: "CMPT01",
    name: "Competition City Center Köln",
    persons: [{ id: "u1", name: "Person 1", avatar: avatarImage }],

    startDate: "2024-11-01",
    endDate: "2025-04-30",

    phases: [
      { id: "ph1", name: "Study", start: "2025-01-02", end: "2025-02-28", color: "#D9E8FF" },
      { id: "ph2", name: "Draft", start: "2025-02-05", end: "2025-03-13", color: "#FFF1D6" },
      { id: "ph3", name: "Final", start: "2025-03-05", end: "2025-04-30", color: "#F2D9FF" },
    ],
    milestones: [
      { id: "m1", date: "2025-01-05", label: "Kickoff", lane: 0, type: "meeting" },
      { id: "m2", date: "2025-05-03", label: "Submission", lane: 1, type: "submission" },
      { id: "m3", date: "2025-07-15", label: "Approval", lane: 2, type: "approval" },
    ],

  },

  {
    id: "p3",
    projectNumber: "202503",
    shortName: "IJKL",
    name: "Third Project",
    persons: [
      { id: "u2", name: "Person 2", avatar: avatarImage },
      { id: "u3", name: "Person 3", avatar: avatarImage },
      { id: "u4", name: "Person 4", avatar: avatarImage },
    ],
    startDate: "2025-06-01",
    endDate: "2026-03-31",

    phases: [
      { id: "ph1", name: "Kickoff", start: "2025-06-01", end: "2025-06-30", color: "#FFF1D6" },
      { id: "ph2", name: "Planning", start: "2025-07-01", end: "2025-12-09", color: "#DFF7E3" },
      { id: "ph3", name: "Build", start: "2026-03-30", end: "2026-11-31", color: "#F2D9FF" },
    ],

    milestones: [
      { id: "m1", date: "2025-06-01", label: "Kickoff", lane: 0, type: "meeting" },
      { id: "m2", date: "2025-12-23", label: "Submission", lane: 1, type: "submission" },
      { id: "m3", date: "2026-03-10", label: "Approval", lane: 2, type: "approval" },
    ],
  },
];
