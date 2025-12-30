import avatarImage from "../assets/avatar.jpg";

const u = (id, name) => ({ id, name, avatar: avatarImage });

const entry = (person, description, hour) => ({
  person,
  description,
  hour,
});

export const projectsDummy = [
  // =========================================================
  // P1 — heavy overlap test (many phases stacked + milestones)
  // =========================================================
  {
    id: "p1",
    projectNumber: "202501",
    shortName: "ABCD",
    name: "Sample Project — Brühl Zentrum",
    persons: [u("u1", "Person 1"), u("u2", "Person 2"), u("u3", "Person 3")],

    startDate: "2025-01-06",
    endDate: "2025-10-31",

    phases: [
      // Base linear phases
      {
        id: "p1-ph1",
        name: "Concept",
        start: "2025-01-06",
        end: "2025-02-28",
        timeBudget: 120,
        hourEntries: [
          entry(u("u2", "Person 2"), "Entwerfen", 6),
          entry(u("u1", "Person 1"), "Skizzen", 3),
        ],
        color: "#D9E8FF",
      },
      {
        id: "p1-ph2",
        name: "Vorentwurf",
        start: "2025-03-01",
        end: "2025-05-31",
        timeBudget: 240,
        hourEntries: [
          entry(u("u2", "Person 2"), "Entwerfen", 8),
          entry(u("u3", "Person 3"), "Teams-Meeting", 2),
        ],
        color: "#DFF7E3",
      },
      {
        id: "p1-ph3",
        name: "Entwurf",
        start: "2025-06-01",
        end: "2025-07-15",
        timeBudget: 300,
        hourEntries: [
          entry(u("u1", "Person 1"), "Planupdate", 4),
          entry(u("u2", "Person 2"), "Entwerfen", 6),
        ],
        color: "#FFF1D6",
      },
      {
        id: "p1-ph4",
        name: "Genehmigung",
        start: "2025-07-16",
        end: "2025-10-31",
        timeBudget: 80,
        hourEntries: [
          entry(u("u3", "Person 3"), "Abstimmung Stadt", 2),
          entry(u("u2", "Person 2"), "Unterlagen", 3),
        ],
        color: "#F2D9FF",
      },

      // ---- Overlap group to force stacking lanes (same time window) ----
      {
        id: "p1-ph5",
        name: "LV",
        start: "2025-04-01",
        end: "2025-06-10",
        timeBudget: 120,
        hourEntries: [entry(u("u2", "Person 2"), "LV schreiben", 5)],
        color: "#A8E6FF",
      },
      {
        id: "p1-ph6",
        name: "Überflutungsnachweis",
        start: "2025-04-20",
        end: "2025-06-25",
        timeBudget: 60,
        hourEntries: [entry(u("u1", "Person 1"), "Nachweis", 6)],
        color: "#FFD0A8",
      },
      {
        id: "p1-ph7",
        name: "Sonderleistung",
        start: "2025-05-05",
        end: "2025-07-01",
        timeBudget: 90,
        hourEntries: [entry(u("u3", "Person 3"), "Workshops", 4)],
        color: "#C7B8FF",
      },
      {
        id: "p1-ph8",
        name: "Infografik",
        start: "2025-05-15",
        end: "2025-06-15",
        timeBudget: 30,
        hourEntries: [entry(u("u3", "Person 3"), "Visuals", 3)],
        color: "#BFF7D0",
      },

      // Short micro tasks in same period (more overlap)
      {
        id: "p1-ph9",
        name: "Baumkataster",
        start: "2025-05-20",
        end: "2025-06-05",
        timeBudget: 15,
        hourEntries: [entry(u("u1", "Person 1"), "Baumbestand", 2)],
        color: "#FFB7D5",
      },
      {
        id: "p1-ph10",
        name: "Bauzeitenplan",
        start: "2025-05-22",
        end: "2025-06-12",
        timeBudget: 12,
        hourEntries: [entry(u("u2", "Person 2"), "Plan", 2)],
        color: "#FFE38F",
      },
    ],

    milestones: [
      {
        id: "p1-m1",
        date: "2025-01-10",
        label: "Kickoff",
        lane: 0,
        type: "meeting",
      },
      {
        id: "p1-m2",
        date: "2025-02-05",
        label: "Zwischenstand",
        lane: 1,
        type: "meeting",
      },
      {
        id: "p1-m3",
        date: "2025-03-20",
        label: "Vorabgabe",
        lane: 0,
        type: "submission",
      },
      {
        id: "p1-m4",
        date: "2025-05-12",
        label: "LV Draft fertig",
        lane: 2,
        type: "submission",
      },
      {
        id: "p1-m5",
        date: "2025-06-03",
        label: "Hydraulik Review",
        lane: 3,
        type: "meeting",
      },
      {
        id: "p1-m6",
        date: "2025-07-14",
        label: "Entwurf final",
        lane: 1,
        type: "submission",
      },
      {
        id: "p1-m7",
        date: "2025-08-15",
        label: "Approval",
        lane: 2,
        type: "approval",
      },
      {
        id: "p1-m8",
        date: "2025-09-22",
        label: "Deadline",
        lane: 3,
        type: "deadline",
      },
      {
        id: "p1-m9",
        date: "2025-10-10",
        label: "Nachreichung",
        lane: 0,
        type: "submission",
      },
    ],
  },

  // =========================================================
  // P2 — shorter project, overlapping + milestones tight
  // =========================================================
  {
    id: "p2",
    projectNumber: "202502",
    shortName: "CMPT01",
    name: "Competition City Center Köln",
    persons: [u("u4", "Person 4"), u("u1", "Person 1")],

    startDate: "2024-11-01",
    endDate: "2025-04-30",

    phases: [
      {
        id: "p2-ph1",
        name: "Study",
        start: "2024-11-01",
        end: "2024-12-20",
        timeBudget: 60,
        hourEntries: [entry(u("u4", "Person 4"), "Analyse", 6)],
        color: "#D9E8FF",
      },
      {
        id: "p2-ph2",
        name: "Draft",
        start: "2025-01-05",
        end: "2025-03-13",
        timeBudget: 140,
        hourEntries: [
          entry(u("u1", "Person 1"), "Entwerfen", 8),
          entry(u("u4", "Person 4"), "Pläne", 4),
        ],
        color: "#FFF1D6",
      },
      {
        id: "p2-ph3",
        name: "Final",
        start: "2025-03-01",
        end: "2025-04-30",
        timeBudget: 90,
        hourEntries: [entry(u("u1", "Person 1"), "Finalisierung", 6)],
        color: "#F2D9FF",
      },

      // overlap inside the draft window
      {
        id: "p2-ph4",
        name: "Renderings",
        start: "2025-02-10",
        end: "2025-03-08",
        timeBudget: 35,
        hourEntries: [entry(u("u4", "Person 4"), "Visuals", 4)],
        color: "#BFF7D0",
      },
      {
        id: "p2-ph5",
        name: "Text & Story",
        start: "2025-02-15",
        end: "2025-03-20",
        timeBudget: 20,
        hourEntries: [entry(u("u1", "Person 1"), "Text", 3)],
        color: "#FFB7D5",
      },
    ],

    milestones: [
      {
        id: "p2-m1",
        date: "2024-11-04",
        label: "Kickoff",
        lane: 0,
        type: "meeting",
      },
      {
        id: "p2-m2",
        date: "2025-01-18",
        label: "Zwischenkritik",
        lane: 1,
        type: "meeting",
      },
      {
        id: "p2-m3",
        date: "2025-03-13",
        label: "Draft Abgabe",
        lane: 2,
        type: "submission",
      },
      {
        id: "p2-m4",
        date: "2025-04-28",
        label: "Final Upload",
        lane: 0,
        type: "submission",
      },
      {
        id: "p2-m5",
        date: "2025-04-30",
        label: "Deadline",
        lane: 3,
        type: "deadline",
      },
    ],
  },

  // =========================================================
  // P3 — crosses into 2026, large phase gaps, long range test
  // =========================================================
  {
    id: "p3",
    projectNumber: "202503",
    shortName: "IJKL",
    name: "Third Project — Quartier Entwicklung",
    persons: [
      u("u2", "Person 2"),
      u("u3", "Person 3"),
      u("u5", "Person 5"),
      u("u6", "Person 6"),
    ],

    startDate: "2025-06-01",
    endDate: "2026-03-31",

    phases: [
      {
        id: "p3-ph1",
        name: "Kickoff",
        start: "2025-06-01",
        end: "2025-06-20",
        timeBudget: 30,
        hourEntries: [entry(u("u2", "Person 2"), "Kickoff", 2)],
        color: "#FFE38F",
      },
      {
        id: "p3-ph2",
        name: "Planning",
        start: "2025-07-01",
        end: "2025-12-09",
        timeBudget: 240,
        hourEntries: [entry(u("u3", "Person 3"), "Planung", 10)],
        color: "#DFF7E3",
      },
      {
        id: "p3-ph3",
        name: "Workshop Series",
        start: "2025-08-05",
        end: "2025-10-15",
        timeBudget: 80,
        hourEntries: [entry(u("u6", "Person 6"), "Workshops", 6)],
        color: "#C7B8FF",
      },
      {
        id: "p3-ph4",
        name: "Cost Estimation",
        start: "2025-10-01",
        end: "2025-11-10",
        timeBudget: 55,
        hourEntries: [entry(u("u5", "Person 5"), "Kostenschätzung", 5)],
        color: "#A8E6FF",
      },
      {
        id: "p3-ph5",
        name: "Approval Prep",
        start: "2025-12-01",
        end: "2026-02-10",
        timeBudget: 70,
        hourEntries: [entry(u("u2", "Person 2"), "Unterlagen", 4)],
        color: "#FFD0A8",
      },
    ],

    milestones: [
      {
        id: "p3-m1",
        date: "2025-06-01",
        label: "Kickoff",
        lane: 0,
        type: "meeting",
      },
      {
        id: "p3-m2",
        date: "2025-09-02",
        label: "Zwischenreview",
        lane: 1,
        type: "meeting",
      },
      {
        id: "p3-m3",
        date: "2025-12-23",
        label: "Submission",
        lane: 2,
        type: "submission",
      },
      {
        id: "p3-m4",
        date: "2026-02-10",
        label: "Unterlagen fertig",
        lane: 0,
        type: "submission",
      },
      {
        id: "p3-m5",
        date: "2026-03-10",
        label: "Approval",
        lane: 2,
        type: "approval",
      },
      {
        id: "p3-m6",
        date: "2026-03-31",
        label: "Deadline",
        lane: 3,
        type: "deadline",
      },
    ],
  },

  // =========================================================
  // P4 — super dense overlaps to stress lane algorithm hard
  // =========================================================
  {
    id: "p4",
    projectNumber: "202504",
    shortName: "DENSE",
    name: "Dense Overlap Stress Test",
    persons: [u("u7", "Person 7"), u("u8", "Person 8"), u("u2", "Person 2")],
    startDate: "2025-02-01",
    endDate: "2025-08-31",

    phases: [
      {
        id: "p4-a",
        name: "A",
        start: "2025-02-01",
        end: "2025-05-30",
        timeBudget: 60,
        hourEntries: [],
        color: "#D9E8FF",
      },
      {
        id: "p4-b",
        name: "B",
        start: "2025-02-10",
        end: "2025-05-10",
        timeBudget: 40,
        hourEntries: [],
        color: "#DFF7E3",
      },
      {
        id: "p4-c",
        name: "C",
        start: "2025-03-01",
        end: "2025-06-01",
        timeBudget: 55,
        hourEntries: [],
        color: "#FFF1D6",
      },
      {
        id: "p4-d",
        name: "D",
        start: "2025-03-15",
        end: "2025-06-20",
        timeBudget: 35,
        hourEntries: [],
        color: "#F2D9FF",
      },
      {
        id: "p4-e",
        name: "E",
        start: "2025-04-01",
        end: "2025-07-01",
        timeBudget: 20,
        hourEntries: [],
        color: "#FFB7D5",
      },
      {
        id: "p4-f",
        name: "F",
        start: "2025-04-12",
        end: "2025-06-15",
        timeBudget: 20,
        hourEntries: [],
        color: "#A8E6FF",
      },
      {
        id: "p4-g",
        name: "G",
        start: "2025-05-01",
        end: "2025-07-20",
        timeBudget: 20,
        hourEntries: [],
        color: "#FFD0A8",
      },
      {
        id: "p4-h",
        name: "H",
        start: "2025-05-10",
        end: "2025-08-31",
        timeBudget: 20,
        hourEntries: [],
        color: "#C7B8FF",
      },
    ],

    milestones: [
      {
        id: "p4-m1",
        date: "2025-02-05",
        label: "Kickoff",
        lane: 0,
        type: "meeting",
      },
      {
        id: "p4-m2",
        date: "2025-03-01",
        label: "Gate 1",
        lane: 1,
        type: "submission",
      },
      {
        id: "p4-m3",
        date: "2025-04-01",
        label: "Gate 2",
        lane: 2,
        type: "meeting",
      },
      {
        id: "p4-m4",
        date: "2025-05-01",
        label: "Gate 3",
        lane: 3,
        type: "approval",
      },
      {
        id: "p4-m5",
        date: "2025-06-01",
        label: "Gate 4",
        lane: 0,
        type: "submission",
      },
      {
        id: "p4-m6",
        date: "2025-07-01",
        label: "Gate 5",
        lane: 1,
        type: "meeting",
      },
      {
        id: "p4-m7",
        date: "2025-08-31",
        label: "Deadline",
        lane: 2,
        type: "deadline",
      },
    ],
  },
];
