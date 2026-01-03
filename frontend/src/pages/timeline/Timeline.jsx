import { useEffect, useMemo, useRef, useState } from "react";
import "./timeline.scss";

import TimelineRow from "./components/TimelineRow";
import CreateProjectModal from "./components/CreateProjectModal";
import { projectsDummy } from "../../data/projectsDummy";

import useTimelineScale, { TL_MODE } from "./hooks/useTimelineScale";
import { assignPhaseLanes } from "./utils/laneUtils";

// ===== MUI Icons (toolbar + milestones) =====
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded"; // meeting
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded"; // submission
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded"; // approval
import FlagRoundedIcon from "@mui/icons-material/FlagRounded"; // deadline
import HandymanRoundedIcon from "@mui/icons-material/HandymanRounded"; // construction
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded"; // delivery

// ---------- Milestone icon mapping ----------
function milestoneIconByType(type) {
  const lower = (type || "").toLowerCase();
  switch (lower) {
    case "meeting":
    case "review":
      return <GroupsRoundedIcon fontSize="inherit" />;
    case "submission":
      return <UploadFileRoundedIcon fontSize="inherit" />;
    case "approval":
      return <TaskAltRoundedIcon fontSize="inherit" />;
    case "construction":
    case "baubeginn":
      return <HandymanRoundedIcon fontSize="inherit" />;
    case "deadline":
    case "delivery":
    case "abgabe":
      return <LocalShippingRoundedIcon fontSize="inherit" />;
    default:
      return <FlagRoundedIcon fontSize="inherit" />;
  }
}

// ---------- Milestone Color Mapping ----------
const MILESTONE_COLORS = {
  meeting: "#ae3ec9",     // Grape
  review: "#ae3ec9",
  submission: "#f76707",  // Orange
  approval: "#0ca678",    // Green
  construction: "#f59f00",// Yellow/Amber
  baubeginn: "#f59f00",
  deadline: "#e03131",    // Red
  delivery: "#e03131",
  abgabe: "#e03131",
  default: "#1c7ed6"      // Blue (accent)
};

function getMilestoneColor(type) {
  const lower = (type || "").toLowerCase();
  return MILESTONE_COLORS[lower] || MILESTONE_COLORS.default;
}

// ---------- Date parsing helpers ----------
const toDate = (s) => new Date(`${s}T00:00:00`);
const formatDate = (d) =>
  d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });


function clamp(num, a, b) {
  return Math.max(a, Math.min(b, num));
}

// ---------- Visible range check (prevents week/month pile-up) ----------
function inVisibleRangeSpan(scale, startStr, endStr) {
  const s = toDate(startStr);
  const e = toDate(endStr);
  const rs = scale.rangeStart.getTime();
  const re = scale.rangeEnd.getTime();
  return e.getTime() >= rs && s.getTime() <= re;
}

function inVisibleRangePoint(scale, dateStr) {
  const d = toDate(dateStr);
  const rs = scale.rangeStart.getTime();
  const re = scale.rangeEnd.getTime();
  return d.getTime() >= rs && d.getTime() <= re;
}

/**
 * Label stacking (collision-based) — keeps labels from overlapping each other.
 * Icon Y placement uses `milestone.lane` (your data) — so icons can be at different vertical levels again.
 */
function assignMilestoneLabelLanesLocal(milestones, scale) {
  const items = (milestones || [])
    .map((m) => {
      const x = scale.dateToX(toDate(m.date));
      const w = clamp(56 + String(m.label || "").length * 7, 90, 260);
      return { ...m, x, _w: w };
    })
    .sort((a, b) => a.x - b.x);

  const lanes = []; // stores right-edge of each label lane
  const out = [];

  for (const m of items) {
    // label sits to the right of icon
    const left = m.x + 12;
    const right = left + m._w;

    let placedLane = -1;
    for (let i = 0; i < lanes.length; i++) {
      if (left >= lanes[i] + 10) {
        placedLane = i;
        lanes[i] = right;
        break;
      }
    }

    if (placedLane === -1) {
      placedLane = lanes.length;
      lanes.push(right);
    }

    out.push({ ...m, labelLane: placedLane });
  }

  return { items: out, laneCount: Math.max(1, lanes.length) };
}

const Timeline = () => {
  const [mode, setMode] = useState(TL_MODE.YEAR);
  const [cursorDate, setCursorDate] = useState(() => new Date());
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const canvasRef = useRef(null);
  const [availableWidthPx, setAvailableWidthPx] = useState(0);

  // expanded rows (per project)
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  const isExpanded = (pid) => expandedIds.has(pid);
  const toggleExpanded = (pid) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(pid)) next.delete(pid);
      else next.add(pid);
      return next;
    });
  };

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => setAvailableWidthPx(el.clientWidth));
    ro.observe(el);
    setAvailableWidthPx(el.clientWidth);

    return () => ro.disconnect();
  }, []);

  const scale = useTimelineScale({
    mode,
    cursorDate,
    availableWidthPx,
    minColWidthPx:
      mode === TL_MODE.WEEK ? 120 : mode === TL_MODE.MONTH ? 28 : 56,
  });

  const goPrev = () => {
    setCursorDate((d) => {
      const x = new Date(d);
      if (mode === TL_MODE.YEAR || mode === TL_MODE.CALENDAR_WEEKS) {
        x.setFullYear(x.getFullYear() - 1);
        return x;
      }
      if (mode === TL_MODE.MONTH) {
        x.setMonth(x.getMonth() - 1);
        return x;
      }
      if (mode === TL_MODE.WEEK) {
        x.setDate(x.getDate() - 7);
        return x;
      }
      return x;
    });
  };

  const goNext = () => {
    setCursorDate((d) => {
      const x = new Date(d);
      if (mode === TL_MODE.YEAR || mode === TL_MODE.CALENDAR_WEEKS) {
        x.setFullYear(x.getFullYear() + 1);
        return x;
      }
      if (mode === TL_MODE.MONTH) {
        x.setMonth(x.getMonth() + 1);
        return x;
      }
      if (mode === TL_MODE.WEEK) {
        x.setDate(x.getDate() + 7);
        return x;
      }
      return x;
    });
  };

  const goToday = () => setCursorDate(new Date());

  /**
   * Build a single “rows model” so:
   * - left Project rows get the SAME height as right timeline rows
   * - we compute lanes/milestones once (stable UI)
   */
  const rows = useMemo(() => {
    return projectsDummy.map((p) => {
      const expanded = isExpanded(p.id);

      const visiblePhases = (p.phases || []).filter((ph) =>
        inVisibleRangeSpan(scale, ph.start, ph.end)
      );
      const { items: phaseItems, laneCount: phaseLaneCount } =
        assignPhaseLanes(visiblePhases);

      const msVisible = (p.milestones || []).filter((m) =>
        inVisibleRangePoint(scale, m.date)
      );
      const { items: msItems, laneCount: msLabelLaneCount } =
        assignMilestoneLabelLanesLocal(msVisible, scale);

      // bar sizing
      const barH = expanded ? 14 : 12;
      const gap = expanded ? 6 : 5;

      // milestone band: distinct height for icons. Labels are now overlay (hover), so we don't reserve space for them.
      const iconLaneMax =
        msVisible.length > 0
          ? Math.max(...msVisible.map((m) => Number(m.lane || 0)))
          : 0;

      const msLaneStep = 24; // Increased to match new icon size/spacing
      const msBase = 30;

      // usage in render...
      const labelReserve = expanded ? 20 : 0;
      const msBandH = msBase + labelReserve + (iconLaneMax * msLaneStep);

      // row height = ms band + phase lanes + bottom pad
      const padBottom = 24;
      const lanes = Math.max(1, phaseLaneCount);
      const calculatedH = msBandH + lanes * barH + (lanes - 1) * gap + padBottom;
      const rowH = Math.max(110, calculatedH);

      return {
        project: p,
        expanded,
        rowH,
        msBandH,
        labelReserve, // Pass this to be used in render
        barH,
        gap,
        phaseItems,
        msItems,
      };
    });
  }, [scale, expandedIds]);

  return (
    <div className="timelinePage">
      <div className="timelineSurface">
        {/* Toolbar */}
        <div className="tlToolbar">
          <div className="left">
            <span className="title">Timeline</span>
            <button
              type="button"
              className="ghostBtn"
              onClick={() => setCreateModalOpen(true)}
            >
              <AddRoundedIcon fontSize="small" style={{ color: "var(--accent)" }} />
              <span>Create Project</span>
            </button>
          </div>

          <div className="center">
            <button type="button" className="iconBtn" onClick={goPrev}>
              <ChevronLeftRoundedIcon fontSize="small" />
            </button>

            <div className="segmented">
              <button
                type="button"
                className={mode === TL_MODE.YEAR ? "active" : ""}
                onClick={() => setMode(TL_MODE.YEAR)}
              >
                Year
              </button>
              <button
                type="button"
                className={mode === TL_MODE.MONTH ? "active" : ""}
                onClick={() => setMode(TL_MODE.MONTH)}
              >
                Month
              </button>
              <button
                type="button"
                className={mode === TL_MODE.WEEK ? "active" : ""}
                onClick={() => setMode(TL_MODE.WEEK)}
              >
                Week
              </button>
              <button
                type="button"
                className={mode === TL_MODE.CALENDAR_WEEKS ? "active" : ""}
                onClick={() => setMode(TL_MODE.CALENDAR_WEEKS)}
              >
                KW
              </button>
              <button
                type="button"
                className={mode === TL_MODE.WHOLE ? "active" : ""}
                onClick={() => setMode(TL_MODE.WHOLE)}
              >
                Whole
              </button>
            </div>

            <button type="button" className="iconBtn" onClick={goNext}>
              <ChevronRightRoundedIcon fontSize="small" />
            </button>

            <button type="button" className="ghostBtn" onClick={goToday}>
              <TodayRoundedIcon fontSize="small" />
              <span>Today</span>
            </button>
          </div>

          <div className="right">
            <span className="muted">
              {scale.columns.length} cols ·{" "}
              {scale.needsScroll ? "scroll" : "fits"}
            </span>
          </div>
        </div>

        {/* Board */}
        <div className="tlBoard">
          {/* Left project column */}
          <div className="projectCol">
            <div className="projectColHeader">Project</div>

            <div className="projectRows">
              {rows.map((r) => (
                <div
                  key={r.project.id}
                  className={`projectRowShell ${r.expanded ? "isExpanded" : ""
                    }`}
                  style={{ height: `${r.rowH}px` }}
                  onClick={() => toggleExpanded(r.project.id)}
                >
                  <TimelineRow project={r.project} />
                </div>
              ))}
            </div>
          </div>

          {/* Right timeline */}
          <div className="timelineCol" ref={canvasRef}>
            <div
              className="tlScroll"
              style={{ width: `${scale.contentWidthPx}px` }}
            >
              {/* Scale header */}
              <div className="tlScaleHeader">
                {scale.columns.map((c) => (
                  <div
                    key={c.key}
                    className={`tlColHeader ${c.isWeekend ? "isWeekend" : ""}`}
                    style={{ width: `${scale.colWidthPx}px` }}
                  >
                    <div className="top">{c.labelTop}</div>
                    {c.labelBottom ? (
                      <div className="bottom">{c.labelBottom}</div>
                    ) : null}
                  </div>
                ))}
              </div>

              {/* Today marker (Moved outside header to span full height) */}
              {scale.markers
                .filter((m) => m.type === "today")
                .map((m) => (
                  <div
                    key={`today-${m.date.toISOString()}`}
                    className="todayLine"
                    style={{ left: `${scale.dateToX(m.date)}px` }}
                    title="Today"
                  />
                ))}

              {/* Rows */}
              <div className="tlGridPreview">
                {rows.map((r) => {
                  const p = r.project;

                  return (
                    <div
                      key={p.id}
                      className={`tlTimeRow ${r.expanded ? "isExpanded" : ""}`}
                      style={{
                        height: `${r.rowH}px`,
                        "--ms-band-h": `${r.msBandH}px`,
                        "--bar-h": `${r.barH}px`,
                        "--gap": `${r.gap}px`,
                      }}
                      onClick={() => toggleExpanded(p.id)}
                    >
                      {/* grid cells */}
                      {scale.columns.map((c) => (
                        <div
                          key={`${p.id}-${c.key}`}
                          className={`gridCol ${c.isWeekend ? "isWeekend" : ""
                            }`}
                          style={{ width: `${scale.colWidthPx}px` }}
                        />
                      ))}

                      {/* phases */}
                      <div className="phaseBarsLayer">
                        {r.phaseItems.map((ph) => {
                          const start = toDate(ph.start);
                          const end = toDate(ph.end);
                          const { x, w } = scale.spanToXW(start, end);

                          const durationDays = Math.round(
                            (end - start) / (1000 * 60 * 60 * 24)
                          );

                          return (
                            <div
                              key={ph.id}
                              className={`phaseBar ${r.expanded ? "expanded" : "collapsed"
                                }`}
                              style={{
                                left: `${x}px`,
                                width: `${w}px`,
                                background: ph.color || "var(--accent)",
                                "--lane": ph.lane,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!r.expanded) toggleExpanded(p.id);
                              }}
                            >
                              <span className="phaseText">{ph.name}</span>

                              <div className="phaseTooltip">
                                <div className="ttTitle">{ph.name}</div>
                                <div className="ttDate">
                                  {formatDate(start)} – {formatDate(end)}
                                </div>
                                <div className="ttDur">{durationDays} days</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* milestones: icon uses m.lane (varied Y), label stacks above icon */}
                      <div className="milestonesLayer">
                        {r.msItems.map((m) => {
                          const iconLane = Number(m.lane || 0);

                          return (
                            <div
                              key={m.id}
                              className="milestone"
                              style={{
                                left: `${m.x}px`,
                                "--ilane": iconLane,
                                "--label-offset": `${r.labelReserve}px`,
                                "--ms-color": getMilestoneColor(m.type),
                              }}
                              title={m.label}
                            >
                              <div className="milestoneIcon">
                                {milestoneIconByType(m.type)}
                              </div>

                              <div
                                className="milestoneLabel"
                                style={{ "--mlane": m.labelLane }}
                              >
                                {m.label}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <p className="helperText">
          Milestones: icon pinned (lane-based Y), labels appear ABOVE and stack.
          Left project column now matches dynamic row heights again.
        </p>

        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSave={(data) => console.log("New Project Data:", data)}
        />
      </div>
    </div>
  );
};

export default Timeline;
