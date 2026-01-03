// src/data/projectsDummy.js

export const projectsDummy = [
  {
    id: "p1",
    projectNumber: "P-2024-001",
    shortName: "Downtown Plaza",
    name: "Downtown City Plaza Renovation",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop",
    client: {
      name: "City Council",
      contact: "Elena Fisher",
      email: "e.fisher@cityhall.gov",
      phone: "+1 (555) 010-9988"
    },
    budget: "$2.4M",
    site: "1200 Main St, Metro City",
    startDate: "2024-01-15",
    endDate: "2024-11-30",
    persons: [
      { id: "u1", name: "Alice Johnson", avatar: "https://i.pravatar.cc/150?u=a" },
      { id: "u2", name: "Bob Smith", avatar: "https://i.pravatar.cc/150?u=b" },
      { id: "u3", name: "Charlie Davis", avatar: "https://i.pravatar.cc/150?u=c" },
    ],
    phases: [
      {
        id: "ph1",
        name: "Design & Planning",
        start: "2024-01-15",
        end: "2024-03-01",
        color: "#4ea1ff",
        timeBudget: 120, // hours
        hourEntries: [
          { person: { id: "u1", name: "Alice Johnson", avatar: "https://i.pravatar.cc/150?u=a" }, description: "Initial site survey", hour: 4.5 },
          { person: { id: "u1", name: "Alice Johnson", avatar: "https://i.pravatar.cc/150?u=a" }, description: "Drafting blueprints", hour: 2.0 },
          { person: { id: "u2", name: "Bob Smith", avatar: "https://i.pravatar.cc/150?u=b" }, description: "Client meeting", hour: 1.5 },
        ],
      },
      {
        id: "ph2",
        name: "Excavation",
        start: "2024-03-02",
        end: "2024-05-15",
        color: "#ffca4e", // yellow
        timeBudget: 300,
        hourEntries: [
          { person: { id: "u3", name: "Charlie Davis", avatar: "https://i.pravatar.cc/150?u=c" }, description: "Site clearing", hour: 8.0 },
          { person: { id: "u3", name: "Charlie Davis", avatar: "https://i.pravatar.cc/150?u=c" }, description: "Heavy machinery operation", hour: 6.5 },
        ],
      },
      {
        id: "ph3",
        name: "Construction",
        start: "2024-05-16",
        end: "2024-10-01",
        color: "#ff6b6b", // red
        timeBudget: 800,
        hourEntries: [],
      },
    ],
    milestones: [
      { id: "m1", date: "2024-02-28", label: "Blueprints Approved", lane: 0, type: "Approval" },
      { id: "m2", date: "2024-05-15", label: "Foundation Complete", lane: 1, type: "Construction" },
    ]
  },
  {
    id: "p2",
    projectNumber: "P-2024-005",
    shortName: "Green Valley",
    name: "Green Valley Eco-Park",
    image: "https://images.unsplash.com/photo-1542601906990-24ccd08d7455?q=80&w=2528&auto=format&fit=crop",
    client: {
      name: "Green Earth NGO",
      contact: "Marcus Thorne",
      email: "m.thorne@ge.org",
      phone: "+1 (555) 234-5678"
    },
    budget: "$850k",
    site: "4500 Valley Rd, Eco District",
    startDate: "2024-04-01",
    endDate: "2024-09-15",
    persons: [
      { id: "u2", name: "Bob Smith", avatar: "https://i.pravatar.cc/150?u=b" },
      { id: "u4", name: "Diana Prince", avatar: "https://i.pravatar.cc/150?u=d" },
    ],
    phases: [
      {
        id: "ph2-1",
        name: "Concept",
        start: "2024-04-01",
        end: "2024-04-30",
        color: "#66d9e8",
        timeBudget: 80,
        hourEntries: [
          { person: { id: "u4", name: "Diana Prince", avatar: "https://i.pravatar.cc/150?u=d" }, description: "Landscape sketches", hour: 5 },
        ]
      }
    ],
    milestones: []
  },
  {
    id: "p3",
    projectNumber: "P-2024-008",
    shortName: "Tech Hub",
    name: "Tech Innovation Hub HQ",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop",
    client: {
      name: "Innovate Corp",
      contact: "Sarah Connor",
      email: "sarah@techhub.io",
      phone: "+1 (555) 999-0000"
    },
    budget: "$5.2M",
    site: "88 Innovation Dr, Silicon Bay",
    startDate: "2024-02-01",
    endDate: "2024-12-20",
    persons: [
      { id: "u1", name: "Alice Johnson", avatar: "https://i.pravatar.cc/150?u=a" },
      { id: "u3", name: "Charlie Davis", avatar: "https://i.pravatar.cc/150?u=c" },
      { id: "u4", name: "Diana Prince", avatar: "https://i.pravatar.cc/150?u=d" },
    ],
    phases: [],
    milestones: []
  },
];
