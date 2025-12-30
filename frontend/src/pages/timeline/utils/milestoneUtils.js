// src/pages/timeline/utils/milestoneUtils.js

/**
 * Assign label lanes for milestones so labels don't overlap.
 * Icon stays fixed at x; only label gets stacked.
 *
 * We do a simple 1D interval packing using an estimated label width.
 */
export function assignMilestoneLabelLanes(milestones = [], scale) {
  const items = (milestones || [])
    .map((m) => {
      const x = scale.dateToX(new Date(`${m.date}T00:00:00`));
      const label = m.label || "";
      // rough but effective: 7px per char + padding + icon space
      const w = Math.max(80, Math.min(220, label.length * 7 + 38));
      return { ...m, x, estW: w };
    })
    .sort((a, b) => a.x - b.x);

  const lanes = []; // each lane keeps last occupied right edge
  const out = [];

  for (const m of items) {
    let lane = 0;
    let placed = false;

    for (let i = 0; i < lanes.length; i++) {
      const lastRight = lanes[i];
      // minimum spacing between labels
      const minGap = 10;
      if (m.x >= lastRight + minGap) {
        lane = i;
        lanes[i] = m.x + m.estW;
        placed = true;
        break;
      }
    }

    if (!placed) {
      lane = lanes.length;
      lanes.push(m.x + m.estW);
    }

    out.push({ ...m, labelLane: lane });
  }

  return { items: out, laneCount: Math.max(1, lanes.length) };
}
