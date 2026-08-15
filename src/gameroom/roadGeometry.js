/* ==========================================================================
   Code City Explorer — Road Geometry & Constraint Engine
   Defines curvy Bézier roads, straight avenues, and destination driveways/gates
   Provides point-to-road distance checking & car position clamping
   ========================================================================== */

export const ROAD_RADIUS = 36; // half of 72px road width

// ── Master Road Network (Curvy + Straight + Driveways) ───────────────────
export const ROAD_PATHS = [
  // 1. Main Curved Highway (S-curve from top-left to bottom-right)
  {
    id: 'highway_1',
    type: 'bezier',
    p0: { x: 200, y: 250 },
    p1: { x: 800, y: 150 },
    p2: { x: 600, y: 750 },
    p3: { x: 1300, y: 900 },
    width: 72,
  },
  {
    id: 'highway_2',
    type: 'bezier',
    p0: { x: 1300, y: 900 },
    p1: { x: 1800, y: 1000 },
    p2: { x: 1400, y: 1600 },
    p3: { x: 400, y: 1600 },
    width: 72,
  },

  // 2. Straight Connecting Avenues
  {
    id: 'ave_top',
    type: 'line',
    p0: { x: 200, y: 250 },
    p1: { x: 1650, y: 250 },
    width: 64,
  },
  {
    id: 'ave_left',
    type: 'line',
    p0: { x: 200, y: 250 },
    p1: { x: 200, y: 1600 },
    width: 64,
  },
  {
    id: 'ave_mid',
    type: 'line',
    p0: { x: 900, y: 250 },
    p1: { x: 900, y: 1600 },
    width: 64,
  },
  {
    id: 'ave_right',
    type: 'line',
    p0: { x: 1650, y: 250 },
    p1: { x: 1650, y: 1600 },
    width: 64,
  },
  {
    id: 'ave_cross_mid',
    type: 'line',
    p0: { x: 200, y: 900 },
    p1: { x: 1650, y: 900 },
    width: 64,
  },

  // 3. Destination Driveways / Entrance Gates (branches off main roads)
  // Mission 1 destinations
  { id: 'gate_q1_var', type: 'line', p0: { x: 200, y: 350 }, p1: { x: 350, y: 350 }, width: 50, isGate: true, destId: 'q1_var' },
  { id: 'gate_q1_gst', type: 'line', p0: { x: 900, y: 350 }, p1: { x: 1050, y: 350 }, width: 50, isGate: true, destId: 'q1_gst' },
  { id: 'gate_q1_total', type: 'line', p0: { x: 1300, y: 550 }, p1: { x: 1450, y: 550 }, width: 50, isGate: true, destId: 'q1_total' },
  { id: 'gate_q1_print', type: 'line', p0: { x: 900, y: 1100 }, p1: { x: 1150, y: 1100 }, width: 50, isGate: true, destId: 'q1_print' },
  { id: 'gate_q1_wrong_gst', type: 'line', p0: { x: 550, y: 900 }, p1: { x: 550, y: 850 }, width: 50, isGate: true, destId: 'q1_wrong_gst' },
  { id: 'gate_q1_wrong_total', type: 'line', p0: { x: 1650, y: 950 }, p1: { x: 1550, y: 950 }, width: 50, isGate: true, destId: 'q1_wrong_total' },
  { id: 'gate_q1_wrong_import', type: 'line', p0: { x: 200, y: 1350 }, p1: { x: 400, y: 1350 }, width: 50, isGate: true, destId: 'q1_wrong_import' },

  // Mission 2 destinations
  { id: 'gate_q2_amt', type: 'line', p0: { x: 200, y: 400 }, p1: { x: 300, y: 400 }, width: 50, isGate: true, destId: 'q2_amt' },
  { id: 'gate_q2_if', type: 'line', p0: { x: 900, y: 400 }, p1: { x: 800, y: 400 }, width: 50, isGate: true, destId: 'q2_if' },
  { id: 'gate_q2_disc', type: 'line', p0: { x: 1650, y: 400 }, p1: { x: 1400, y: 400 }, width: 50, isGate: true, destId: 'q2_disc' },
  { id: 'gate_q2_else', type: 'line', p0: { x: 1650, y: 900 }, p1: { x: 1400, y: 900 }, width: 50, isGate: true, destId: 'q2_else' },
  { id: 'gate_q2_nodisc', type: 'line', p0: { x: 900, y: 900 }, p1: { x: 800, y: 900 }, width: 50, isGate: true, destId: 'q2_nodisc' },
  { id: 'gate_q2_print', type: 'line', p0: { x: 200, y: 900 }, p1: { x: 300, y: 900 }, width: 50, isGate: true, destId: 'q2_print' },
  { id: 'gate_q2_wrong_if', type: 'line', p0: { x: 1650, y: 650 }, p1: { x: 1550, y: 650 }, width: 50, isGate: true, destId: 'q2_wrong_if' },
  { id: 'gate_q2_wrong_disc', type: 'line', p0: { x: 900, y: 1400 }, p1: { x: 800, y: 1400 }, width: 50, isGate: true, destId: 'q2_wrong_disc' },

  // Mission 3 destinations
  { id: 'gate_q3_loop', type: 'line', p0: { x: 200, y: 500 }, p1: { x: 400, y: 500 }, width: 50, isGate: true, destId: 'q3_loop' },
  { id: 'gate_q3_if', type: 'line', p0: { x: 900, y: 500 }, p1: { x: 1000, y: 500 }, width: 50, isGate: true, destId: 'q3_if' },
  { id: 'gate_q3_print', type: 'line', p0: { x: 1650, y: 500 }, p1: { x: 1500, y: 500 }, width: 50, isGate: true, destId: 'q3_print' },
  { id: 'gate_q3_wrong_range', type: 'line', p0: { x: 900, y: 1100 }, p1: { x: 750, y: 1100 }, width: 50, isGate: true, destId: 'q3_wrong_range' },
  { id: 'gate_q3_wrong_mod', type: 'line', p0: { x: 1650, y: 1100 }, p1: { x: 1400, y: 1100 }, width: 50, isGate: true, destId: 'q3_wrong_mod' },
];

// ── Point to Line Segment Distance ──────────────────────────────────────
function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;

  if (lenSq === 0) {
    const rx = px - ax, ry = py - ay;
    return { distance: Math.hypot(rx, ry), closestX: ax, closestY: ay };
  }

  let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));

  const closestX = ax + t * dx;
  const closestY = ay + t * dy;
  const distance = Math.hypot(px - closestX, py - closestY);

  return { distance, closestX, closestY };
}

// ── Sample Bézier Curve to Line Segments for Fast Distance Check ─────────
function sampleBezier(p0, p1, p2, p3, steps = 16) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const mt = 1 - t;
    const x = mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x;
    const y = mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y;
    points.push({ x, y });
  }
  return points;
}

// Pre-sample all Bezier paths for fast physics collision checks
const PRE_SAMPLED_PATHS = ROAD_PATHS.map((path) => {
  if (path.type === 'line') {
    return { ...path, segments: [{ a: path.p0, b: path.p1 }] };
  } else if (path.type === 'bezier') {
    const pts = sampleBezier(path.p0, path.p1, path.p2, path.p3, 20);
    const segments = [];
    for (let i = 0; i < pts.length - 1; i++) {
      segments.push({ a: pts[i], b: pts[i + 1] });
    }
    return { ...path, segments };
  }
  return path;
});

// ── Master Physics Check: Clamp Point to Nearest Road Surface ────────────
export function clampToRoad(px, py) {
  let minDistance = Infinity;
  let bestClosestX = px;
  let bestClosestY = py;

  for (const path of PRE_SAMPLED_PATHS) {
    const maxRadius = path.width / 2;

    for (const seg of path.segments) {
      const res = distToSegment(px, py, seg.a.x, seg.a.y, seg.b.x, seg.b.y);
      if (res.distance < minDistance) {
        minDistance = res.distance;
        bestClosestX = res.closestX;
        bestClosestY = res.closestY;
      }
    }
  }

  // If car is inside any road/driveway radius (36px), position is valid
  // Find which path we are closest to for radius threshold
  let allowedRadius = ROAD_RADIUS;
  if (minDistance <= allowedRadius) {
    return { x: px, y: py, isOnRoad: true, distance: minDistance };
  }

  // Otherwise, clamp car position to nearest road edge
  const angle = Math.atan2(py - bestClosestY, px - bestClosestX);
  const clampedX = bestClosestX + Math.cos(angle) * (allowedRadius - 2);
  const clampedY = bestClosestY + Math.sin(angle) * (allowedRadius - 2);

  return { x: clampedX, y: clampedY, isOnRoad: false, distance: minDistance };
}
