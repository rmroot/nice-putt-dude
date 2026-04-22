import { Firestore } from 'firebase-admin/firestore';

function buildHolesWithOffsets(
  pars: number[],
  offsets: number[],
): Record<string, { par: number; strokes: number }> {
  return Object.fromEntries(
    pars.map((par, i) => [
      `hole${i + 1}`,
      { par, strokes: Math.max(1, par + offsets[i]) },
    ]),
  );
}

// ─── Score profiles: 18 per-hole offsets from par ────────────────────────────
// eagle   ~-14  (tour-level birdie machine)
const EAGLE   = [-1, -1, -2, -1,  0, -1, -1, -2,  0, -1, -1,  0, -1, -2,  0, -1, -1,  0];
// birdie  ~-9   (strong amateur)
const BIRDIE  = [-1,  0, -1,  0, -1,  0, -1,  0, -1,  0, -1,  0, -1,  0, -1,  0, -1,  0];
// solid   ~-3   (single-digit handicap)
const SOLID   = [ 0, -1,  0,  0,  1, -1,  0,  0,  0, -1,  0,  1, -1,  0,  0,  0, -1,  0];
// par     E     (plays it straight)
const PAR     = [ 0,  0,  1,  0,  0, -1,  0,  1,  0,  0, -1,  0,  0,  1,  0,  0, -1,  0];
// bogey   ~+13  (weekend warrior)
const BOGEY   = [ 1,  1,  0,  1,  1,  0,  1,  2,  0,  1,  1,  0,  1,  2,  0,  1,  1,  0];
// hacker  ~+37  (needs more range time)
const HACKER  = [ 2,  2,  3,  1,  2,  3,  2,  1,  3,  2,  2,  3,  1,  2,  3,  2,  1,  2];
// streaky ~+16  (hot holes, then cold)
const STREAKY = [-1,  2, -1,  3, -1,  2,  0,  3, -1,  2, -1,  3,  0,  2, -1,  3,  0,  2];
// steady  ~+9   (reliable bogey-to-par)
const STEADY  = [ 1,  0,  1,  0,  1,  0,  1,  0,  1,  0,  1,  0,  1,  0,  1,  0,  1,  0];

// ─── Par layouts per course ───────────────────────────────────────────────────
const MIXED_PARS          = [4, 5, 3, 4, 4, 3, 5, 4, 4, 3, 4, 5, 4, 3, 4, 5, 4, 4]; // Pebble Beach
const PAR3_PARS           = Array<number>(18).fill(3);                                 // Sunset Par 3
const EAGLE_RIDGE_PARS    = [4, 4, 3, 5, 4, 3, 4, 5, 4, 3, 4, 5, 4, 3, 4, 5, 3, 4];
const BIRDIE_BAY_PARS     = [4, 4, 4, 4, 3, 4, 4, 5, 4, 4, 4, 3, 5, 4, 4, 4, 3, 4];
const DOGLEG_LEFT_PARS    = [5, 3, 4, 4, 5, 4, 3, 4, 5, 4, 3, 5, 4, 4, 3, 5, 4, 4];
const DIVOT_VALLEY_PARS   = [4, 3, 5, 4, 4, 3, 5, 4, 3, 4, 5, 4, 3, 4, 5, 3, 4, 4];
const SAND_TRAP_PARS      = [4, 5, 3, 4, 4, 5, 3, 4, 4, 3, 5, 4, 4, 3, 5, 4, 4, 3];
const WATER_HAZARD_PARS   = Array<number>(18).fill(4);
const MULLIGAN_MANOR_PARS = [4, 4, 5, 3, 4, 4, 3, 5, 4, 4, 3, 4, 5, 4, 3, 4, 4, 5];
const NINETEENTH_HOLE_PARS = [3, 4, 5, 4, 3, 4, 4, 5, 4, 3, 4, 4, 5, 3, 4, 4, 5, 3];

/** Legacy builder kept for existing scorecards (uses cycling offset pattern) */
function buildHoles(pars: number[]): Record<string, { par: number; strokes: number }> {
  const offsets = [-1, 0, 0, 1, 2];
  return Object.fromEntries(
    pars.map((par, i) => {
      const strokes = Math.max(1, par + offsets[i % offsets.length]);
      return [`hole${i + 1}`, { par, strokes }];
    }),
  );
}

export const SCORECARDS = [
  // ─── match-001 · Pebble Beach · Alice / Bob ──────────────────────────────────
  {
    id: 'scorecard-001',
    userId: 'user-alice-001',
    courseId: 'course-pebble-001',
    matchId: 'match-001',
    date: new Date('2026-04-10T10:00:00Z'),
    holes: buildHoles(MIXED_PARS),
  },
  {
    id: 'scorecard-002',
    userId: 'user-bob-002',
    courseId: 'course-pebble-001',
    matchId: 'match-001',
    date: new Date('2026-04-10T10:00:00Z'),
    holes: buildHoles([...MIXED_PARS].reverse()),
  },
  // ─── match-002 · Sunset Par 3 · Bob / Carol ──────────────────────────────────
  {
    id: 'scorecard-003',
    userId: 'user-bob-002',
    courseId: 'course-par3-002',
    matchId: 'match-002',
    date: new Date('2026-04-12T14:00:00Z'),
    holes: buildHoles(PAR3_PARS),
  },
  {
    id: 'scorecard-004',
    userId: 'user-carol-003',
    courseId: 'course-par3-002',
    matchId: 'match-002',
    date: new Date('2026-04-12T14:00:00Z'),
    holes: buildHolesWithOffsets(PAR3_PARS, BOGEY),
  },
  // ─── match-003 · Eagle Ridge · Eddie / Birdie / Bogey ────────────────────────
  { id: 'scorecard-005', userId: 'user-eagle-004',   courseId: 'course-eagle-ridge-003',    matchId: 'match-003', date: new Date('2026-04-13T09:00:00Z'), holes: buildHolesWithOffsets(EAGLE_RIDGE_PARS,    EAGLE)   },
  { id: 'scorecard-006', userId: 'user-birdie-005',  courseId: 'course-eagle-ridge-003',    matchId: 'match-003', date: new Date('2026-04-13T09:00:00Z'), holes: buildHolesWithOffsets(EAGLE_RIDGE_PARS,    BIRDIE)  },
  { id: 'scorecard-007', userId: 'user-bogey-006',   courseId: 'course-eagle-ridge-003',    matchId: 'match-003', date: new Date('2026-04-13T09:00:00Z'), holes: buildHolesWithOffsets(EAGLE_RIDGE_PARS,    HACKER)  },
  // ─── match-004 · Birdie Bay · Chip / Sandy ───────────────────────────────────
  { id: 'scorecard-008', userId: 'user-chip-007',    courseId: 'course-birdie-bay-004',     matchId: 'match-004', date: new Date('2026-04-14T08:30:00Z'), holes: buildHolesWithOffsets(BIRDIE_BAY_PARS,     SOLID)   },
  { id: 'scorecard-009', userId: 'user-sandy-008',   courseId: 'course-birdie-bay-004',     matchId: 'match-004', date: new Date('2026-04-14T08:30:00Z'), holes: buildHolesWithOffsets(BIRDIE_BAY_PARS,     STREAKY) },
  // ─── match-005 · Dogleg Left · Drake / Patty / Fred ──────────────────────────
  { id: 'scorecard-010', userId: 'user-driver-009',  courseId: 'course-dogleg-005',         matchId: 'match-005', date: new Date('2026-04-15T10:00:00Z'), holes: buildHolesWithOffsets(DOGLEG_LEFT_PARS,    PAR)     },
  { id: 'scorecard-011', userId: 'user-putt-010',    courseId: 'course-dogleg-005',         matchId: 'match-005', date: new Date('2026-04-15T10:00:00Z'), holes: buildHolesWithOffsets(DOGLEG_LEFT_PARS,    BIRDIE)  },
  { id: 'scorecard-012', userId: 'user-fairway-011', courseId: 'course-dogleg-005',         matchId: 'match-005', date: new Date('2026-04-15T10:00:00Z'), holes: buildHolesWithOffsets(DOGLEG_LEFT_PARS,    HACKER)  },
  // ─── match-006 · Divot Valley · Irene / Ace ──────────────────────────────────
  { id: 'scorecard-013', userId: 'user-iron-012',    courseId: 'course-divot-valley-006',   matchId: 'match-006', date: new Date('2026-04-16T07:00:00Z'), holes: buildHolesWithOffsets(DIVOT_VALLEY_PARS,   STEADY)  },
  { id: 'scorecard-014', userId: 'user-ace-013',     courseId: 'course-divot-valley-006',   matchId: 'match-006', date: new Date('2026-04-16T07:00:00Z'), holes: buildHolesWithOffsets(DIVOT_VALLEY_PARS,   EAGLE)   },
  // ─── match-007 · Sand Trap Shores · Alice / Eddie / Drake / Sandy ─────────────
  { id: 'scorecard-015', userId: 'user-alice-001',   courseId: 'course-sand-trap-008',      matchId: 'match-007', date: new Date('2026-04-17T09:30:00Z'), holes: buildHolesWithOffsets(SAND_TRAP_PARS,      BIRDIE)  },
  { id: 'scorecard-016', userId: 'user-eagle-004',   courseId: 'course-sand-trap-008',      matchId: 'match-007', date: new Date('2026-04-17T09:30:00Z'), holes: buildHolesWithOffsets(SAND_TRAP_PARS,      EAGLE)   },
  { id: 'scorecard-017', userId: 'user-driver-009',  courseId: 'course-sand-trap-008',      matchId: 'match-007', date: new Date('2026-04-17T09:30:00Z'), holes: buildHolesWithOffsets(SAND_TRAP_PARS,      SOLID)   },
  { id: 'scorecard-018', userId: 'user-sandy-008',   courseId: 'course-sand-trap-008',      matchId: 'match-007', date: new Date('2026-04-17T09:30:00Z'), holes: buildHolesWithOffsets(SAND_TRAP_PARS,      BOGEY)   },
  // ─── match-008 · Windmill Par 3 · Bob / Carol / Birdie / Chip / Patty ─────────
  { id: 'scorecard-019', userId: 'user-bob-002',     courseId: 'course-windmill-007',       matchId: 'match-008', date: new Date('2026-04-18T11:00:00Z'), holes: buildHolesWithOffsets(PAR3_PARS,           BOGEY)   },
  { id: 'scorecard-020', userId: 'user-carol-003',   courseId: 'course-windmill-007',       matchId: 'match-008', date: new Date('2026-04-18T11:00:00Z'), holes: buildHolesWithOffsets(PAR3_PARS,           SOLID)   },
  { id: 'scorecard-021', userId: 'user-birdie-005',  courseId: 'course-windmill-007',       matchId: 'match-008', date: new Date('2026-04-18T11:00:00Z'), holes: buildHolesWithOffsets(PAR3_PARS,           BIRDIE)  },
  { id: 'scorecard-022', userId: 'user-chip-007',    courseId: 'course-windmill-007',       matchId: 'match-008', date: new Date('2026-04-18T11:00:00Z'), holes: buildHolesWithOffsets(PAR3_PARS,           PAR)     },
  { id: 'scorecard-023', userId: 'user-putt-010',    courseId: 'course-windmill-007',       matchId: 'match-008', date: new Date('2026-04-18T11:00:00Z'), holes: buildHolesWithOffsets(PAR3_PARS,           BIRDIE)  },
  // ─── match-009 · Water Hazard Heights · Fred / Irene / Bogey / Ace ───────────
  { id: 'scorecard-024', userId: 'user-fairway-011', courseId: 'course-water-hazard-009',   matchId: 'match-009', date: new Date('2026-04-19T08:00:00Z'), holes: buildHolesWithOffsets(WATER_HAZARD_PARS,   HACKER)  },
  { id: 'scorecard-025', userId: 'user-iron-012',    courseId: 'course-water-hazard-009',   matchId: 'match-009', date: new Date('2026-04-19T08:00:00Z'), holes: buildHolesWithOffsets(WATER_HAZARD_PARS,   STEADY)  },
  { id: 'scorecard-026', userId: 'user-bogey-006',   courseId: 'course-water-hazard-009',   matchId: 'match-009', date: new Date('2026-04-19T08:00:00Z'), holes: buildHolesWithOffsets(WATER_HAZARD_PARS,   STREAKY) },
  { id: 'scorecard-027', userId: 'user-ace-013',     courseId: 'course-water-hazard-009',   matchId: 'match-009', date: new Date('2026-04-19T08:00:00Z'), holes: buildHolesWithOffsets(WATER_HAZARD_PARS,   EAGLE)   },
  // ─── match-010 · Mulligan Manor · Sandy / Drake ──────────────────────────────
  { id: 'scorecard-028', userId: 'user-sandy-008',   courseId: 'course-mulligan-manor-010', matchId: 'match-010', date: new Date('2026-04-20T07:30:00Z'), holes: buildHolesWithOffsets(MULLIGAN_MANOR_PARS, SOLID)   },
  { id: 'scorecard-029', userId: 'user-driver-009',  courseId: 'course-mulligan-manor-010', matchId: 'match-010', date: new Date('2026-04-20T07:30:00Z'), holes: buildHolesWithOffsets(MULLIGAN_MANOR_PARS, BIRDIE)  },
  // ─── match-011 · Grand Slam Open · Eagle Ridge · ALL 13 ──────────────────────
  { id: 'scorecard-030', userId: 'user-alice-001',   courseId: 'course-eagle-ridge-003',    matchId: 'match-011', date: new Date('2026-04-21T07:00:00Z'), holes: buildHolesWithOffsets(EAGLE_RIDGE_PARS,    BIRDIE)  },
  { id: 'scorecard-031', userId: 'user-bob-002',     courseId: 'course-eagle-ridge-003',    matchId: 'match-011', date: new Date('2026-04-21T07:00:00Z'), holes: buildHolesWithOffsets(EAGLE_RIDGE_PARS,    BOGEY)   },
  { id: 'scorecard-032', userId: 'user-carol-003',   courseId: 'course-eagle-ridge-003',    matchId: 'match-011', date: new Date('2026-04-21T07:00:00Z'), holes: buildHolesWithOffsets(EAGLE_RIDGE_PARS,    SOLID)   },
  { id: 'scorecard-033', userId: 'user-eagle-004',   courseId: 'course-eagle-ridge-003',    matchId: 'match-011', date: new Date('2026-04-21T07:00:00Z'), holes: buildHolesWithOffsets(EAGLE_RIDGE_PARS,    EAGLE)   },
  { id: 'scorecard-034', userId: 'user-birdie-005',  courseId: 'course-eagle-ridge-003',    matchId: 'match-011', date: new Date('2026-04-21T07:00:00Z'), holes: buildHolesWithOffsets(EAGLE_RIDGE_PARS,    BIRDIE)  },
  { id: 'scorecard-035', userId: 'user-bogey-006',   courseId: 'course-eagle-ridge-003',    matchId: 'match-011', date: new Date('2026-04-21T07:00:00Z'), holes: buildHolesWithOffsets(EAGLE_RIDGE_PARS,    HACKER)  },
  { id: 'scorecard-036', userId: 'user-chip-007',    courseId: 'course-eagle-ridge-003',    matchId: 'match-011', date: new Date('2026-04-21T07:00:00Z'), holes: buildHolesWithOffsets(EAGLE_RIDGE_PARS,    PAR)     },
  { id: 'scorecard-037', userId: 'user-sandy-008',   courseId: 'course-eagle-ridge-003',    matchId: 'match-011', date: new Date('2026-04-21T07:00:00Z'), holes: buildHolesWithOffsets(EAGLE_RIDGE_PARS,    STREAKY) },
  { id: 'scorecard-038', userId: 'user-driver-009',  courseId: 'course-eagle-ridge-003',    matchId: 'match-011', date: new Date('2026-04-21T07:00:00Z'), holes: buildHolesWithOffsets(EAGLE_RIDGE_PARS,    SOLID)   },
  { id: 'scorecard-039', userId: 'user-putt-010',    courseId: 'course-eagle-ridge-003',    matchId: 'match-011', date: new Date('2026-04-21T07:00:00Z'), holes: buildHolesWithOffsets(EAGLE_RIDGE_PARS,    BIRDIE)  },
  { id: 'scorecard-040', userId: 'user-fairway-011', courseId: 'course-eagle-ridge-003',    matchId: 'match-011', date: new Date('2026-04-21T07:00:00Z'), holes: buildHolesWithOffsets(EAGLE_RIDGE_PARS,    HACKER)  },
  { id: 'scorecard-041', userId: 'user-iron-012',    courseId: 'course-eagle-ridge-003',    matchId: 'match-011', date: new Date('2026-04-21T07:00:00Z'), holes: buildHolesWithOffsets(EAGLE_RIDGE_PARS,    STEADY)  },
  { id: 'scorecard-042', userId: 'user-ace-013',     courseId: 'course-eagle-ridge-003',    matchId: 'match-011', date: new Date('2026-04-21T07:00:00Z'), holes: buildHolesWithOffsets(EAGLE_RIDGE_PARS,    EAGLE)   },
  // ─── match-012 · Club Championship · 19th Hole · ALL 13 ──────────────────────
  { id: 'scorecard-043', userId: 'user-alice-001',   courseId: 'course-19th-hole-011',      matchId: 'match-012', date: new Date('2026-04-22T08:00:00Z'), holes: buildHolesWithOffsets(NINETEENTH_HOLE_PARS, SOLID)   },
  { id: 'scorecard-044', userId: 'user-bob-002',     courseId: 'course-19th-hole-011',      matchId: 'match-012', date: new Date('2026-04-22T08:00:00Z'), holes: buildHolesWithOffsets(NINETEENTH_HOLE_PARS, PAR)     },
  { id: 'scorecard-045', userId: 'user-carol-003',   courseId: 'course-19th-hole-011',      matchId: 'match-012', date: new Date('2026-04-22T08:00:00Z'), holes: buildHolesWithOffsets(NINETEENTH_HOLE_PARS, BIRDIE)  },
  { id: 'scorecard-046', userId: 'user-eagle-004',   courseId: 'course-19th-hole-011',      matchId: 'match-012', date: new Date('2026-04-22T08:00:00Z'), holes: buildHolesWithOffsets(NINETEENTH_HOLE_PARS, EAGLE)   },
  { id: 'scorecard-047', userId: 'user-birdie-005',  courseId: 'course-19th-hole-011',      matchId: 'match-012', date: new Date('2026-04-22T08:00:00Z'), holes: buildHolesWithOffsets(NINETEENTH_HOLE_PARS, BIRDIE)  },
  { id: 'scorecard-048', userId: 'user-bogey-006',   courseId: 'course-19th-hole-011',      matchId: 'match-012', date: new Date('2026-04-22T08:00:00Z'), holes: buildHolesWithOffsets(NINETEENTH_HOLE_PARS, BOGEY)   },
  { id: 'scorecard-049', userId: 'user-chip-007',    courseId: 'course-19th-hole-011',      matchId: 'match-012', date: new Date('2026-04-22T08:00:00Z'), holes: buildHolesWithOffsets(NINETEENTH_HOLE_PARS, SOLID)   },
  { id: 'scorecard-050', userId: 'user-sandy-008',   courseId: 'course-19th-hole-011',      matchId: 'match-012', date: new Date('2026-04-22T08:00:00Z'), holes: buildHolesWithOffsets(NINETEENTH_HOLE_PARS, STREAKY) },
  { id: 'scorecard-051', userId: 'user-driver-009',  courseId: 'course-19th-hole-011',      matchId: 'match-012', date: new Date('2026-04-22T08:00:00Z'), holes: buildHolesWithOffsets(NINETEENTH_HOLE_PARS, PAR)     },
  { id: 'scorecard-052', userId: 'user-putt-010',    courseId: 'course-19th-hole-011',      matchId: 'match-012', date: new Date('2026-04-22T08:00:00Z'), holes: buildHolesWithOffsets(NINETEENTH_HOLE_PARS, SOLID)   },
  { id: 'scorecard-053', userId: 'user-fairway-011', courseId: 'course-19th-hole-011',      matchId: 'match-012', date: new Date('2026-04-22T08:00:00Z'), holes: buildHolesWithOffsets(NINETEENTH_HOLE_PARS, BOGEY)   },
  { id: 'scorecard-054', userId: 'user-iron-012',    courseId: 'course-19th-hole-011',      matchId: 'match-012', date: new Date('2026-04-22T08:00:00Z'), holes: buildHolesWithOffsets(NINETEENTH_HOLE_PARS, STEADY)  },
  { id: 'scorecard-055', userId: 'user-ace-013',     courseId: 'course-19th-hole-011',      matchId: 'match-012', date: new Date('2026-04-22T08:00:00Z'), holes: buildHolesWithOffsets(NINETEENTH_HOLE_PARS, BIRDIE)  },
];

export async function seedScorecards(db: Firestore) {
  console.log('Seeding scorecards collection...');
  const batch = db.batch();
  for (const scorecard of SCORECARDS) {
    const { id, ...data } = scorecard;
    batch.set(db.collection('scorecards').doc(id), data);
  }
  await batch.commit();
  console.log(`  Written ${SCORECARDS.length} scorecards.`);
}
