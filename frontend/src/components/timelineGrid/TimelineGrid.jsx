import { useRef } from "react";
import "./timelineGrid.scss";

const TimelineGrid = ({ timeline }) => {
  const { view, setView, cols, colWidth, title, goPrev, goNext } = timeline;

  // scroll syncing refs
  const headerScrollRef = useRef(null);
  const bodyScrollRef = useRef(null);
  const syncingRef = useRef(false);

  const syncScroll = (source) => {
    if (syncingRef.current) return;
    syncingRef.current = true;

    const headerEl = headerScrollRef.current;
    const bodyEl = bodyScrollRef.current;

    if (!headerEl || !bodyEl) {
      syncingRef.current = false;
      return;
    }

    const left = source === "header" ? headerEl.scrollLeft : bodyEl.scrollLeft;

    if (source === "header") bodyEl.scrollLeft = left;
    else headerEl.scrollLeft = left;

    requestAnimationFrame(() => {
      syncingRef.current = false;
    });
  };

  return (
    <div
      className="timelineGrid"
      data-view={view}
      style={{
        "--cols": cols.length,
        "--col-width": `${colWidth}px`
      }}
    >
      <div className="timelineHeader">
        <div className="headerTop">
          <div className="leftSpacer" />

          <div className="titleArea">
            <div className="rangeTitle">{title}</div>
          </div>

          <div className="controls">
            <button type="button" onClick={goPrev}>
              ‹
            </button>

            <div className="viewSwitch">
              <button
                type="button"
                className={view === "year" ? "active" : ""}
                onClick={() => setView("year")}
              >
                Year
              </button>

              <button
                type="button"
                className={view === "month" ? "active" : ""}
                onClick={() => setView("month")}
              >
                Month
              </button>

              <button
                type="button"
                className={view === "week" ? "active" : ""}
                onClick={() => setView("week")}
              >
                Week
              </button>
            </div>

            <button type="button" onClick={goNext}>
              ›
            </button>
          </div>
        </div>

        <div className="headerBottom">
          <div className="leftSpacer" />

          <div
            className="weeksWrap"
            ref={headerScrollRef}
            onScroll={() => syncScroll("header")}
          >
            <div className="weeks">
              {cols.map((c) => (
                <div key={c} className="weekLabel">
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="timelineBody">
        <div className="leftSpacer" />

        <div
          className="weekLinesWrap"
          ref={bodyScrollRef}
          onScroll={() => syncScroll("body")}
        >
          <div className="weekLines">
            {cols.map((c) => (
              <div key={c} className="weekLine" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineGrid;
