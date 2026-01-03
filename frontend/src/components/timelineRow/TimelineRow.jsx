import "./timelineRow.scss";

// TimelineRow.jsx
import "./timelineRow.scss";
// Removed unused icon imports



const TimelineRow = ({ project }) => { // removed unused props
  return (
    <div className="timelineRow">
      <div className="projectDetailArea">
        <h4>{project.projectNumber}</h4>
        <h5>{project.shortName}</h5>
        <p>{project.name}</p>

        <div className="persons">
          {project.persons.map((person) => (
            <img
              key={person.id}
              src={person.avatar}
              alt={person.name}
              className="avatar"
            />
          ))}
        </div>
      </div>
      {/* timelineArea removed - rendered by main Timeline grid now */}
    </div>
  );
};

export default TimelineRow;
