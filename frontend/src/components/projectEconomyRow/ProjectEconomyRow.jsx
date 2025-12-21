// ProjectEconomyRow.jsx
import { useState } from "react";
import "./projectEconomyRow.scss";

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const ProjectEconomyRow = ({ project }) => {
  const [openPhase, setOpenPhase] = useState(null);

  const togglePhase = (index) => {
    setOpenPhase((prev) => (prev === index ? null : index));
  };

  return (
    <div className="projectEconomyRow">
      <div className="projectHead">
        <div className="projectDescription">
          <h2>{project.projectNumber}</h2>
          <h2>{project.shortName}</h2>
          <h2>{project.name}</h2>
        </div>

        <div className="projectDetails">
          <h2>{project.startDate}</h2>
          <h2>{project.endDate}</h2>
        </div>
      </div>

      <div className="serviceList">
        {project.phases.map((ph, phaseIndex) => {
          const isOpen = openPhase === phaseIndex;

          return (
            <ul className="phase" key={ph.id ?? ph.name ?? phaseIndex}>
              {/* PHASE HEADER (always visible) */}
              <li
                className={`timeBudgetHead ${isOpen ? "open" : ""}`}
                onClick={() => togglePhase(phaseIndex)}
                style={{ background: ph.color }} // optional: uses your ph.color
              >
                <span className="left">{ph.name}</span>
                <span className="right">{ph.timeBudget}</span>
              </li>

              {/* ENTRIES (only visible when open) */}
              {isOpen &&
                ph.hourEntries.map((hourEntry, entryIndex) => {
                  const person = hourEntry.person;
                  const avatar = person?.avatar;
                  const personName = person?.name ?? "Unknown";

                  return (
                    <li
                      className="timeEntryRow"
                      key={`${ph.id ?? phaseIndex}-${entryIndex}`}
                    >
                      <div className="entryLeft">
                        <div
                          className="avatar"
                          title={personName}
                          aria-label={personName}
                        >
                          {avatar ? (
                            <img src={avatar} alt={personName} />
                          ) : (
                            <span className="initials">
                              {getInitials(personName)}
                            </span>
                          )}
                        </div>

                        <span className="description">
                          {hourEntry.description}
                        </span>
                      </div>

                      <span className="right">{hourEntry.hour}</span>
                    </li>
                  );
                })}
            </ul>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectEconomyRow;
