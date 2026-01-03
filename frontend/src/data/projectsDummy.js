export const projectsDummy = [
  {
    id: "p1",
    projectNumber: "L-2026-035",
    shortName: "Rheinufer",
    name: "Neugestaltung Rheinuferpromenade",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2670&auto=format&fit=crop",
    client: {
      name: "Stadt Köln - Grünflächenamt",
      contact: "Dr. Thomas Müller",
      email: "t.mueller@stadt-koeln.de",
      phone: "+49 221 123-4567"
    },
    budget: "€4.2M",
    site: "Rheinuferstr. 1, 50668 Köln",
    startDate: "2026-02-01",
    endDate: "2027-08-31",
    persons: [
      { id: "u1", name: "Julia Weber", avatar: "https://i.pravatar.cc/150?u=a" }, // PL
      { id: "u2", name: "Lukas Schmidt", avatar: "https://i.pravatar.cc/150?u=b" }, // Bauleiter
      { id: "u3", name: "Sarah Klein", avatar: "https://i.pravatar.cc/150?u=c" },   // Werkstudentin
    ],
    phases: [
      {
        id: "lph3",
        name: "LPH 3: Entwurfsplanung",
        start: "2026-02-01",
        end: "2026-04-15",
        color: "#4ea1ff", // Blue
        timeBudget: 180,
        hourEntries: [
          {
            id: "he1",
            date: "2026-03-10",
            person: { id: "u1", name: "Julia Weber", avatar: "https://i.pravatar.cc/150?u=a" },
            description: "Detaillierung Pflanzplanung Staudenbeete",
            hour: 4.5
          },
          {
            id: "he2",
            date: "2026-03-12",
            person: { id: "u3", name: "Sarah Klein", avatar: "https://i.pravatar.cc/150?u=c" },
            description: "Massermittlung für Kostenberechnung",
            hour: 6.0
          },
        ],
      },
      {
        id: "lph5",
        name: "LPH 5: Ausführungsplanung",
        start: "2026-04-16",
        end: "2026-07-30",
        color: "#ffca4e", // Yellow
        timeBudget: 320,
        hourEntries: [
          {
            id: "he3",
            date: "2026-05-02",
            person: { id: "u1", name: "Julia Weber", avatar: "https://i.pravatar.cc/150?u=a" },
            description: "Werkplan Natursteinbelag Promenade",
            hour: 5.5
          },
          {
            id: "he4",
            date: "2026-05-15",
            person: { id: "u1", name: "Julia Weber", avatar: "https://i.pravatar.cc/150?u=a" },
            description: "Abstimmung mit Lichtplaner",
            hour: 2.0
          },
        ],
      },
      {
        id: "lph8",
        name: "LPH 8: Objektüberwachung",
        start: "2026-09-01",
        end: "2027-06-30",
        color: "#ff6b6b", // Red
        timeBudget: 600,
        hourEntries: [
          {
            id: "he5",
            date: "2026-09-05",
            person: { id: "u2", name: "Lukas Schmidt", avatar: "https://i.pravatar.cc/150?u=b" },
            description: "Baustelleneinrichtung prüfen & Protokoll",
            hour: 3.0
          },
        ],
      },
    ],
    milestones: [
      { id: "m1", date: "2026-04-15", label: "Abgabe Entwurf", lane: 0, type: "Approval" },
      { id: "m2", date: "2026-08-15", label: "Baubeginn", lane: 1, type: "Construction" },
    ]
  },
  {
    id: "p2",
    projectNumber: "WB-2026-08",
    shortName: "BUGA 2029",
    name: "Einladungswettbewerb BUGA 2029",
    image: "https://images.unsplash.com/photo-1580974511812-4b71978d501b?q=80&w=2670&auto=format&fit=crop",
    client: {
      name: "BUGA GmbH",
      contact: "Wettbewerbsbüro",
      email: "wb@buga2029.de",
      phone: "+49 30 987-6543"
    },
    budget: "Wettbewerb",
    site: "Mittelrheintal, Loreley",
    startDate: "2026-05-01",
    endDate: "2026-07-15",
    persons: [
      { id: "u4", name: "Marc Wagner", avatar: "https://i.pravatar.cc/150?u=d" }, // Design Lead
      { id: "u5", name: "Hanna Fischer", avatar: "https://i.pravatar.cc/150?u=5" }, // Visualization
    ],
    phases: [
      {
        id: "wb1",
        name: "Konzeptphase",
        start: "2026-05-01",
        end: "2026-05-31",
        color: "#a5d8ff", // Light Blue
        timeBudget: 100,
        hourEntries: [
          {
            id: "he6",
            date: "2026-05-05",
            person: { id: "u4", name: "Marc Wagner", avatar: "https://i.pravatar.cc/150?u=d" },
            description: "Brainstorming & Skizzen Gesamtidee",
            hour: 8.0
          },
        ]
      },
      {
        id: "wb2",
        name: "Ausarbeitung",
        start: "2026-06-01",
        end: "2026-07-10",
        color: "#748ffc", // Indigo
        timeBudget: 250,
        hourEntries: [
          {
            id: "he7",
            date: "2026-06-20",
            person: { id: "u5", name: "Hanna Fischer", avatar: "https://i.pravatar.cc/150?u=5" },
            description: "Rendering Perspektiven Uferbereich",
            hour: 7.5
          },
          {
            id: "he8",
            date: "2026-07-05",
            person: { id: "u4", name: "Marc Wagner", avatar: "https://i.pravatar.cc/150?u=d" },
            description: "Endlayout Präsentationspläne",
            hour: 10.0
          },
        ]
      }
    ],
    milestones: [
      { id: "m3", date: "2026-05-20", label: "Schulterblick", lane: 0, type: "Review" },
      { id: "m4", date: "2026-07-15", label: "Abgabe Plansatz", lane: 0, type: "Submission" },
    ]
  },
  {
    id: "p3",
    projectNumber: "S-2026-12",
    shortName: "Isarauen",
    name: "Gutachten Renaturierung Isarauen",
    image: "https://images.unsplash.com/photo-1504543285918-62a26c483252?q=80&w=2670&auto=format&fit=crop",
    client: {
      name: "Wasserwirtschaftsamt München",
      contact: "Hr. Bergmann",
      email: "poststelle@wwa-m.bayern.de",
      phone: "+49 89 214-3333"
    },
    budget: "€45k",
    site: "Isar-km 12-15, München Süd",
    startDate: "2026-03-01",
    endDate: "2026-06-30",
    persons: [
      { id: "u1", name: "Julia Weber", avatar: "https://i.pravatar.cc/150?u=a" },
      { id: "u6", name: "Dr. Peter Lang", avatar: "https://i.pravatar.cc/150?u=6" }, // Biologist/External
    ],
    phases: [
      {
        id: "sl1",
        name: "Bestandsaufnahme",
        start: "2026-03-01",
        end: "2026-04-15",
        color: "#63e6be", // Teal
        timeBudget: 60,
        hourEntries: [
          {
            id: "he9",
            date: "2026-03-15",
            person: { id: "u6", name: "Dr. Peter Lang", avatar: "https://i.pravatar.cc/150?u=6" },
            description: "Kartierung Flora & Fauna Abschnitt A",
            hour: 5.0
          },
        ]
      },
      {
        id: "sl2",
        name: "Gutachten / Maßnahmen",
        start: "2026-04-16",
        end: "2026-06-15",
        color: "#20c997", // Green
        timeBudget: 90,
        hourEntries: [
          {
            id: "he10",
            date: "2026-05-10",
            person: { id: "u1", name: "Julia Weber", avatar: "https://i.pravatar.cc/150?u=a" },
            description: "Entwicklung Pflegekonzept",
            hour: 4.0
          },
        ]
      }
    ],
    milestones: [
      { id: "m5", date: "2026-04-15", label: "Kartierung Abschluss", lane: 1, type: "Milestone" },
      { id: "m6", date: "2026-06-30", label: "Endbericht", lane: 0, type: "Delivery" },
    ]
  },
];
