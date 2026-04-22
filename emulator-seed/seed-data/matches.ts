import { Firestore } from 'firebase-admin/firestore';

export const MATCHES = [
  {
    id: 'match-001',
    name: 'Friday Round',
    createdByUserId: 'user-alice-001',
    createdAt: new Date('2026-04-10T10:00:00Z').toISOString(),
    players: ['user-alice-001', 'user-bob-002'],
    golfCourseId: 'course-pebble-001',
  },
  {
    id: 'match-002',
    name: 'Weekend Par 3 Challenge',
    createdByUserId: 'user-bob-002',
    createdAt: new Date('2026-04-12T14:00:00Z').toISOString(),
    players: ['user-bob-002', 'user-carol-003'],
    golfCourseId: 'course-par3-002',
  },
  {
    id: 'match-003',
    name: 'Eagle Ridge Showdown',
    createdByUserId: 'user-eagle-004',
    createdAt: new Date('2026-04-13T09:00:00Z').toISOString(),
    players: ['user-eagle-004', 'user-birdie-005', 'user-bogey-006'],
    golfCourseId: 'course-eagle-ridge-003',
  },
  {
    id: 'match-004',
    name: 'Birdie Bay Duel',
    createdByUserId: 'user-chip-007',
    createdAt: new Date('2026-04-14T08:30:00Z').toISOString(),
    players: ['user-chip-007', 'user-sandy-008'],
    golfCourseId: 'course-birdie-bay-004',
  },
  {
    id: 'match-005',
    name: 'Dogleg Left Derby',
    createdByUserId: 'user-driver-009',
    createdAt: new Date('2026-04-15T10:00:00Z').toISOString(),
    players: ['user-driver-009', 'user-putt-010', 'user-fairway-011'],
    golfCourseId: 'course-dogleg-005',
  },
  {
    id: 'match-006',
    name: 'Divot Valley Deathmatch',
    createdByUserId: 'user-iron-012',
    createdAt: new Date('2026-04-16T07:00:00Z').toISOString(),
    players: ['user-iron-012', 'user-ace-013'],
    golfCourseId: 'course-divot-valley-006',
  },
  {
    id: 'match-007',
    name: 'Sand Trap Invitational',
    createdByUserId: 'user-alice-001',
    createdAt: new Date('2026-04-17T09:30:00Z').toISOString(),
    players: ['user-alice-001', 'user-eagle-004', 'user-driver-009', 'user-sandy-008'],
    golfCourseId: 'course-sand-trap-008',
  },
  {
    id: 'match-008',
    name: 'Windmill Scramble',
    createdByUserId: 'user-bob-002',
    createdAt: new Date('2026-04-18T11:00:00Z').toISOString(),
    players: ['user-bob-002', 'user-carol-003', 'user-birdie-005', 'user-chip-007', 'user-putt-010'],
    golfCourseId: 'course-windmill-007',
  },
  {
    id: 'match-009',
    name: 'Water Hazard Rumble',
    createdByUserId: 'user-fairway-011',
    createdAt: new Date('2026-04-19T08:00:00Z').toISOString(),
    players: ['user-fairway-011', 'user-iron-012', 'user-bogey-006', 'user-ace-013'],
    golfCourseId: 'course-water-hazard-009',
  },
  {
    id: 'match-010',
    name: 'Mulligan Manor Match Play',
    createdByUserId: 'user-sandy-008',
    createdAt: new Date('2026-04-20T07:30:00Z').toISOString(),
    players: ['user-sandy-008', 'user-driver-009'],
    golfCourseId: 'course-mulligan-manor-010',
  },
  {
    id: 'match-011',
    name: 'Grand Slam Open',
    createdByUserId: 'user-eagle-004',
    createdAt: new Date('2026-04-21T07:00:00Z').toISOString(),
    players: [
      'user-alice-001', 'user-bob-002', 'user-carol-003',
      'user-eagle-004', 'user-birdie-005', 'user-bogey-006',
      'user-chip-007', 'user-sandy-008', 'user-driver-009',
      'user-putt-010', 'user-fairway-011', 'user-iron-012', 'user-ace-013',
    ],
    golfCourseId: 'course-eagle-ridge-003',
  },
  {
    id: 'match-012',
    name: 'Club Championship',
    createdByUserId: 'user-ace-013',
    createdAt: new Date('2026-04-22T08:00:00Z').toISOString(),
    players: [
      'user-alice-001', 'user-bob-002', 'user-carol-003',
      'user-eagle-004', 'user-birdie-005', 'user-bogey-006',
      'user-chip-007', 'user-sandy-008', 'user-driver-009',
      'user-putt-010', 'user-fairway-011', 'user-iron-012', 'user-ace-013',
    ],
    golfCourseId: 'course-19th-hole-011',
  },
];

export async function seedMatches(db: Firestore) {
  console.log('Seeding matches collection...');
  const batch = db.batch();
  for (const match of MATCHES) {
    const { id, ...data } = match;
    batch.set(db.collection('matches').doc(id), data);
  }
  await batch.commit();
  console.log(`  Written ${MATCHES.length} matches.`);
}
