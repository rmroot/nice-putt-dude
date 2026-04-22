import { Firestore } from 'firebase-admin/firestore';

export const FRIENDSHIPS = [
  // ─── Original ───────────────────────────────────────────────────────────────
  { id: 'friendship-001', user1Id: 'user-alice-001', user2Id: 'user-bob-002'    },
  { id: 'friendship-002', user1Id: 'user-bob-002',   user2Id: 'user-carol-003'  },
  // ─── Alice (4 friends total) ────────────────────────────────────────────────
  { id: 'friendship-003', user1Id: 'user-alice-001', user2Id: 'user-carol-003'  },
  { id: 'friendship-004', user1Id: 'user-alice-001', user2Id: 'user-eagle-004'  },
  { id: 'friendship-005', user1Id: 'user-alice-001', user2Id: 'user-birdie-005' },
  // ─── Bob (5 friends total) ──────────────────────────────────────────────────
  { id: 'friendship-006', user1Id: 'user-bob-002',   user2Id: 'user-eagle-004'  },
  { id: 'friendship-007', user1Id: 'user-bob-002',   user2Id: 'user-chip-007'   },
  { id: 'friendship-008', user1Id: 'user-bob-002',   user2Id: 'user-putt-010'   },
  // ─── Carol (4 friends total) ────────────────────────────────────────────────
  { id: 'friendship-009', user1Id: 'user-carol-003', user2Id: 'user-sandy-008'  },
  { id: 'friendship-010', user1Id: 'user-carol-003', user2Id: 'user-birdie-005' },
  // ─── Eddie (6 friends total) ────────────────────────────────────────────────
  { id: 'friendship-011', user1Id: 'user-eagle-004', user2Id: 'user-birdie-005' },
  { id: 'friendship-012', user1Id: 'user-eagle-004', user2Id: 'user-bogey-006'  },
  { id: 'friendship-013', user1Id: 'user-eagle-004', user2Id: 'user-sandy-008'  },
  { id: 'friendship-014', user1Id: 'user-eagle-004', user2Id: 'user-driver-009' },
  // ─── Birdie (5 friends total) ───────────────────────────────────────────────
  { id: 'friendship-015', user1Id: 'user-birdie-005', user2Id: 'user-chip-007'   },
  { id: 'friendship-016', user1Id: 'user-birdie-005', user2Id: 'user-putt-010'   },
  // ─── Bogey (3 friends total) ────────────────────────────────────────────────
  { id: 'friendship-017', user1Id: 'user-bogey-006', user2Id: 'user-chip-007'   },
  { id: 'friendship-018', user1Id: 'user-bogey-006', user2Id: 'user-ace-013'    },
  // ─── Chip (4 friends total) ─────────────────────────────────────────────────
  { id: 'friendship-019', user1Id: 'user-chip-007',   user2Id: 'user-sandy-008'  },
  // ─── Sandy (5 friends total) ────────────────────────────────────────────────
  { id: 'friendship-020', user1Id: 'user-sandy-008',  user2Id: 'user-driver-009' },
  { id: 'friendship-021', user1Id: 'user-sandy-008',  user2Id: 'user-fairway-011'},
  // ─── Drake (4 friends total) ────────────────────────────────────────────────
  { id: 'friendship-022', user1Id: 'user-driver-009', user2Id: 'user-putt-010'   },
  { id: 'friendship-023', user1Id: 'user-driver-009', user2Id: 'user-fairway-011'},
  // ─── Patty (4 friends total) ────────────────────────────────────────────────
  { id: 'friendship-024', user1Id: 'user-putt-010',   user2Id: 'user-iron-012'   },
  // ─── Fred (4 friends total) ─────────────────────────────────────────────────
  { id: 'friendship-025', user1Id: 'user-fairway-011', user2Id: 'user-iron-012'  },
  { id: 'friendship-026', user1Id: 'user-fairway-011', user2Id: 'user-ace-013'   },
  // ─── Irene (3 friends total) ────────────────────────────────────────────────
  { id: 'friendship-027', user1Id: 'user-iron-012',   user2Id: 'user-ace-013'    },
];

export async function seedFriendships(db: Firestore) {
  console.log('Seeding friendships collection...');
  const batch = db.batch();
  for (const friendship of FRIENDSHIPS) {
    const { id, ...data } = friendship;
    batch.set(db.collection('friendships').doc(id), data);
  }
  await batch.commit();
  console.log(`  Written ${FRIENDSHIPS.length} friendships.`);
}
