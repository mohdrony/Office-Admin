import React, { useState } from "react";
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import "./projects.scss";
import { projectsDummy } from "../../data/projectsDummy.js";
import ProjectOverview from "./components/ProjectOverview";
import TimeEntryList from "./components/TimeEntryList";
import TimeEntryModal from "./components/TimeEntryModal";

const Projects = () => {
  // Master state: selected project
  const [selectedId, setSelectedId] = useState(projectsDummy[0]?.id || null);
  const selectedProject = projectsDummy.find(p => p.id === selectedId);

  // View Mode: 'detail' (Overview) vs 'list' (Time Entries)
  const [viewMode, setViewMode] = useState('detail');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const handleOpenAdd = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (entry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleSaveEntry = (data) => {
    // In a real app, we would update state/backend here.
    // For now, we just log it as the dummy data is static imports
    console.log("Saved Entry:", data);
    alert(`Entry Saved!\n\n${JSON.stringify(data, null, 2)} `);
  };

  return (
    <div className="projectsPage">
      <div className="projectsSplitView">

        {/* LEFT PANEL: Project List */}
        <div className="projectLeftPanel">
          <h2 className="cardTitle">Projects</h2>
          <div className="projectSelector">
            {projectsDummy.map(p => (
              <div
                key={p.id}
                className={`projectCard ${selectedId === p.id ? 'active' : ''} `}
                onClick={() => setSelectedId(p.id)}
              >
                <div className="pMeta">
                  <span className="pNumber">{p.projectNumber}</span>
                  <span>{p.shortName}</span>
                </div>
                <h3>{p.name}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL: Toggle View (Single Card) */}
        <div className="projectRightPanel">
          <div className="mainCard">
            {/* Toggle Controls (Top Right) */}
            <div className="cardHeaderAction">
              <div className="segmented">
                <button
                  className={viewMode === 'detail' ? 'active' : ''}
                  onClick={() => setViewMode('detail')}
                >
                  <DashboardRoundedIcon sx={{ fontSize: 16 }} />
                  Overview
                </button>
                <button
                  className={viewMode === 'list' ? 'active' : ''}
                  onClick={() => setViewMode('list')}
                >
                  <ViewListRoundedIcon sx={{ fontSize: 16 }} />
                  Entries
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="cardContentScroll">
              {viewMode === 'detail' ? (
                <ProjectOverview project={selectedProject} />
              ) : (
                <TimeEntryList
                  project={selectedProject}
                  onAdd={handleOpenAdd}
                  onEdit={handleOpenEdit}
                />
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Modal Layer */}
      {selectedProject && (
        <TimeEntryModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEntry}
          project={selectedProject}
          entryToEdit={editingEntry}
        />
      )}
    </div>
  );
};

export default Projects;
