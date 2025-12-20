import "./project.scss";

import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

const MIN_H = 200;
const TOP_PAD = 12;
const ROW_H = 24;   // must match laneTop spacing
const BOT_PAD = 12;

const toUTCDate = (s) => new Date(`${s}T00:00:00Z`);
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const Project = ({ project, visibleStart, visibleEnd, colWidth, colCount }) => {
  const maxPhaseLane = project.phases?.length ? project.phases.length - 1 : 0;
  const maxMilestoneLane = project.milestones?.reduce((m, x) => Math.max(m, x.lane ?? 0), 0) ?? 0;
  const maxLane = Math.max(maxPhaseLane, maxMilestoneLane);

  const neededHeight = TOP_PAD + (maxLane + 1) * ROW_H + BOT_PAD;
  const rowHeight = Math.max(MIN_H, neededHeight);

  // ✅ fixed visible range for now (Year 2025)
  const start = new Date(visibleStart); start.setHours(0, 0, 0, 0);
  const end = new Date(visibleEnd); end.setHours(23, 59, 59, 999);

  const totalMs = end - start;

  const xCol = (dateStr) => {
    const d = toUTCDate(dateStr);
    return ((d - start) / totalMs) * colCount;
  };

  const laneTop = (i) => 12 + i * 24; // spacing between phase bars

  const milestoneIcon = (type) => {
    switch (type) {
      case "meeting":
        return <HandshakeOutlinedIcon fontSize="inherit" />;
      case "submission":
        return <UploadFileOutlinedIcon fontSize="inherit" />;
      case "approval":
        return <TaskAltOutlinedIcon fontSize="inherit" />;
      case "deadline":
        return <WarningAmberOutlinedIcon fontSize="inherit" />;
      default:
        return <FlagOutlinedIcon fontSize="inherit" />;
    }
  };


  return (
    <div className="project" style={{ minHeight: `${rowHeight}px` }}>
      <div className="projectDetailArea">
        <h2>{project.projectNumber}</h2>
        <h3>{project.shortName}</h3>
        <h4>{project.name}</h4>

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

      <div className="timelineArea">
        <div className="phaseCanvas">

          {project.phases.map((ph, i) => {
            const leftCol = xCol(ph.start);
            const rightCol = xCol(ph.end);

            const clLeft = clamp(leftCol, 0, colCount);
            const clRight = clamp(rightCol, 0, colCount);
            const wCols = Math.max(0, clRight - clLeft);

            if (wCols <= 0) return null;

            return (
              <div
                key={ph.id}
                className="phaseBar"
                style={{
                  backgroundColor: ph.color || "#e9e9e9",
                  left: `${clLeft * colWidth}px`,
                  width: `${wCols * colWidth}px`,
                  top: `${laneTop(i)}px`,
                }}
              >
                <span className="phaseLabel">{ph.name}</span>
              </div>
            );
          })}
          {project.milestones?.map((m) => {
            const col = xCol(m.date);
            if (col < 0 || col > colCount) return null;
            return (
              <div
                key={m.id}
                className="milestoneIcon"
                style={{
                  left: `${col * colWidth}px`,
                  top: `${laneTop(m.lane ?? 0) - 1}px`,
                }}
              >
                {milestoneIcon(m.type)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Project;
