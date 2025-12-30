import "./timelineRow.scss";

const TimelineRow = ({ project, rowHeight = 54 }) => {
  return (
    <div className="tlProjectRow" style={{ height: `${rowHeight}px` }}>
      <div className="meta">
        <div className="topLine">
          <span className="nr">{project.projectNumber}</span>
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
