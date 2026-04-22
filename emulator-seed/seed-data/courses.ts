import { Firestore } from 'firebase-admin/firestore';

function allPar3Holes() {
  return Object.fromEntries(
    Array.from({ length: 18 }, (_, i) => [`hole${i + 1}`, { par: 3 }]),
  );
}

function allPar4Holes() {
  return Object.fromEntries(
    Array.from({ length: 18 }, (_, i) => [`hole${i + 1}`, { par: 4 }]),
  );
}

function holesFromPars(pars: number[]) {
  return Object.fromEntries(pars.map((par, i) => [`hole${i + 1}`, { par }]));
}

function mixedParHoles() {
  const pars = [4, 5, 3, 4, 4, 3, 5, 4, 4, 3, 4, 5, 4, 3, 4, 5, 4, 4];
  return Object.fromEntries(
    pars.map((par, i) => [`hole${i + 1}`, { par }]),
  );
}

export const GOLF_COURSES = [
  {
    id: 'course-pebble-001',
    name: 'Pebble Beach Golf Links',
    holes: mixedParHoles(),
  },
  {
    id: 'course-par3-002',
    name: 'Sunset Par 3 Course',
    holes: allPar3Holes(),
  },
  {
    id: 'course-eagle-ridge-003',
    name: 'Eagle Ridge Golf Club',
    holes: holesFromPars([4, 4, 3, 5, 4, 3, 4, 5, 4, 3, 4, 5, 4, 3, 4, 5, 3, 4]),
  },
  {
    id: 'course-birdie-bay-004',
    name: 'Birdie Bay Links',
    holes: holesFromPars([4, 4, 4, 4, 3, 4, 4, 5, 4, 4, 4, 3, 5, 4, 4, 4, 3, 4]),
  },
  {
    id: 'course-dogleg-005',
    name: 'Dogleg Left Country Club',
    holes: holesFromPars([5, 3, 4, 4, 5, 4, 3, 4, 5, 4, 3, 5, 4, 4, 3, 5, 4, 4]),
  },
  {
    id: 'course-divot-valley-006',
    name: 'Divot Valley Golf Course',
    holes: holesFromPars([4, 3, 5, 4, 4, 3, 5, 4, 3, 4, 5, 4, 3, 4, 5, 3, 4, 4]),
  },
  {
    id: 'course-windmill-007',
    name: 'The Windmill Par 3 Course',
    holes: allPar3Holes(),
  },
  {
    id: 'course-sand-trap-008',
    name: 'Sand Trap Shores',
    holes: holesFromPars([4, 5, 3, 4, 4, 5, 3, 4, 4, 3, 5, 4, 4, 3, 5, 4, 4, 3]),
  },
  {
    id: 'course-water-hazard-009',
    name: 'Water Hazard Heights',
    holes: allPar4Holes(),
  },
  {
    id: 'course-mulligan-manor-010',
    name: 'Mulligan Manor Golf Links',
    holes: holesFromPars([4, 4, 5, 3, 4, 4, 3, 5, 4, 4, 3, 4, 5, 4, 3, 4, 4, 5]),
  },
  {
    id: 'course-19th-hole-011',
    name: 'The 19th Hole Golf Club',
    holes: holesFromPars([3, 4, 5, 4, 3, 4, 4, 5, 4, 3, 4, 4, 5, 3, 4, 4, 5, 3]),
  },
  {
    id: 'course-ace-links-012',
    name: 'Ace in the Hole Links',
    holes: holesFromPars([5, 4, 3, 5, 5, 4, 3, 5, 4, 3, 5, 5, 4, 3, 5, 5, 4, 3]),
  },
];

export async function seedGolfCourses(db: Firestore) {
  console.log('Seeding golfCourses collection...');
  const batch = db.batch();
  for (const course of GOLF_COURSES) {
    const { id, ...data } = course;
    batch.set(db.collection('golfCourses').doc(id), data);
  }
  await batch.commit();
  console.log(`  Written ${GOLF_COURSES.length} golf courses.`);
}
