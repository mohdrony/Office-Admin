import "./timeline.scss";

import useTimelineVM from "../../viewmodels/useTimelineVM.js";
import TimelineRow from "../../components/timelineRow/TimelineRow.jsx";
import TimelineGrid from "../../components/timelineGrid/TimelineGrid.jsx";
import { projectsDummy } from "../../data/projectsDummy.js";

const Timeline = () => {
  const timeline = useTimelineVM();

  return (
    <div className="timelinePage">
      <div className="timelineContent">
        <TimelineGrid timeline={timeline} />

        <div className="timelineRows">
          {projectsDummy.map((p) => (
            <TimelineRow
              key={p.id}
              project={p}
              visibleStart={timeline.visibleStart}
              visibleEnd={timeline.visibleEnd}
              colWidth={timeline.colWidth}
              colCount={timeline.cols.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
