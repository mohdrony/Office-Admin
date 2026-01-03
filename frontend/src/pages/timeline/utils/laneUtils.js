// src/pages/timeline/utils/laneUtils.js

const toTime = (dateStr) => new Date(`${dateStr}T00:00:00`).getTime();

function isValidPhase(ph) {
  if (!ph) return false; // handles undefined holes from ", ,"
  if (!ph.start || !ph.end) return false;
  const a = toTime(ph.start);
  const b = toTime(ph.end);
  return Number.isFinite(a) && Number.isFinite(b);
}

function overlaps(a, b) {
  // inclusive overlap (same day counts as overlap)
  return a.startT <= b.endT && b.startT <= a.endT;
}

/**
 * Assign phases into lanes so overlapping phases don't sit on top of each other.
 * Returns: { items: [{...ph, startT,endT,lane}], laneCount }
 */
export function assignPhaseLanes(phases = []) {
  // IMPORTANT: remove holes / invalid phases FIRST
  const cleaned = phases.filter(isValidPhase);

  const items = cleaned
    .map((ph) => ({
      ...ph,
      startT: toTime(ph.start),
      startT: toTime(ph.start),
      // make end inclusive (covers the full end-day) so adjacent days (End May 31 vs Start Jun 1)
      // count as overlapping/touching -> forces a new lane.
      endT: toTime(ph.end) + (24 * 60 * 60 * 1000),
    }))
    .sort((a, b) => a.startT - b.startT);

  const lanes = []; // each lane holds last placed item
  const out = [];

  for (const ph of items) {
    let placed = false;

    for (let i = 0; i < lanes.length; i++) {
      const last = lanes[i];
      if (!last || !overlaps(last, ph)) {
        lanes[i] = ph;
        out.push({ ...ph, lane: i });
        placed = true;
        break;
      }
    }

    if (!placed) {
      lanes.push(ph);
      out.push({ ...ph, lane: lanes.length - 1 });
    }
  }

  return { items: out, laneCount: lanes.length || 1 };
}
