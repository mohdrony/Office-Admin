import "./timelineRow.scss";

// TimelineRow.jsx
import "./timelineRow.scss";
import { usePerson } from "../../../context/PersonContext";
import ProjectTag from "../../ProjectTag/ProjectTag";

// Removed unused icon imports




const TimelineRow = ({ project }) => {
  const { openPersonDetail } = usePerson();

  return (
    <div className="timelineRow">
      <div className="projectDetailArea">
        <h4><ProjectTag projectId={project.id} label={project.projectNumber} /></h4>
        <h5>{project.shortName}</h5>
        <p>{project.name}</p>

        <div className="persons">
          {project.persons.map((person) => (
            <img
              key={person.id}
              src={person.avatar}
              alt={person.name}
              className="avatar"
              onClick={(e) => {
                e.stopPropagation(); // prevent expanding row
                openPersonDetail(person.id);
              }}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
      </div>
      {/* timelineArea removed - rendered by main Timeline grid now */}
    </div>
  );
};

export default TimelineRow;
