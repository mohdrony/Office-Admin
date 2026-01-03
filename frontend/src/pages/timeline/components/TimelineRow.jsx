import "./timelineRow.scss";

import { usePerson } from "../../../context/PersonContext";
import ProjectTag from "../../../components/ProjectTag/ProjectTag";

const TimelineRow = ({ project }) => {
  const { openPersonDetail } = usePerson();

  return (
    <div className="timelineRow">
      <div className="meta">
        <div className="topLine">
          <ProjectTag projectId={project.id} label={project.projectNumber} />
          <span className="dot">·</span>
          <span className="sn">{project.shortName}</span>
        </div>

        <div className="name">{project.name}</div>

        <div className="avatars">
          {project.persons?.slice(0, 3).map((p) => (
            <img
              key={p.id}
              className="avatar"
              src={p.avatar}
              alt={p.name}
              title={p.name}
              onClick={(e) => {
                e.stopPropagation();
                openPersonDetail(p.id);
              }}
              style={{ cursor: "pointer" }}
            />
          ))}
          {project.persons?.length > 3 ? (
            <span className="more">+{project.persons.length - 3}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TimelineRow;
