import { Auth } from 'firebase-admin/auth';
import { Firestore } from 'firebase-admin/firestore';

export const TEST_USERS = [
  {
    uid: 'user-alice-001',
    email: 'alice@test.com',
    password: 'password123',
    displayName: 'Alice Thompson',
    photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=user-alice-001`,
  },
  {
    uid: 'user-bob-002',
    email: 'bob@test.com',
    password: 'password123',
    displayName: 'Bob Miller',
    photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=user-bob-002`,
  },
  {
    uid: 'user-carol-003',
    email: 'carol@test.com',
    password: 'password123',
    displayName: 'Carol Davis',
    photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=user-carol-003`,
  },
  {
    uid: 'user-eagle-004',
    email: 'eddie@test.com',
    password: 'password123',
    displayName: 'Eddie "Eagle" Birdsong',
    photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=user-eagle-004`,
  },
  {
    uid: 'user-birdie-005',
    email: 'birdie@test.com',
    password: 'password123',
    displayName: 'Birdie McLinks',
    photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=user-birdie-005`,
  },
  {
    uid: 'user-bogey-006',
    email: 'bogey@test.com',
    password: 'password123',
    displayName: 'Bo "Bogey" Stanton',
    photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=user-bogey-006`,
  },
  {
    uid: 'user-chip-007',
    email: 'chip@test.com',
    password: 'password123',
    displayName: 'Chip Sandwedge',
    photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=user-chip-007`,
  },
  {
    uid: 'user-sandy-008',
    email: 'sandy@test.com',
    password: 'password123',
    displayName: 'Sandy Bunker',
    photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=user-sandy-008`,
  },
  {
    uid: 'user-driver-009',
    email: 'drake@test.com',
    password: 'password123',
    displayName: 'Drake "Driver" Woods',
    photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=user-driver-009`,
  },
  {
    uid: 'user-putt-010',
    email: 'patty@test.com',
    password: 'password123',
    displayName: 'Patty Puttmore',
    photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=user-putt-010`,
  },
  {
    uid: 'user-fairway-011',
    email: 'fred@test.com',
    password: 'password123',
    displayName: 'Fred Fairway',
    photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=user-fairway-011`,
  },
  {
    uid: 'user-iron-012',
    email: 'irene@test.com',
    password: 'password123',
    displayName: 'Irene "Iron" McGee',
    photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=user-iron-012`,
  },
  {
    uid: 'user-ace-013',
    email: 'ace@test.com',
    password: 'password123',
    displayName: 'Ace Holeinone',
    photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=user-ace-013`,
  },
];

export async function seedAuthUsers(auth: Auth) {
  console.log('Seeding Auth users...');
  for (const user of TEST_USERS) {
    try {
      await auth.createUser({
        uid: user.uid,
        email: user.email,
        password: user.password,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: true,
      });
      console.log(`  Created user: ${user.email}`);
    } catch (err: unknown) {
      if ((err as { code?: string }).code === 'auth/uid-already-exists') {
        console.log(`  Skipped (already exists): ${user.email}`);
      } else {
        throw err;
      }
    }
  }
}

export async function seedPublicUsers(db: Firestore) {
  console.log('Seeding publicUsers collection...');
  const batch = db.batch();
  for (const user of TEST_USERS) {
    const ref = db.collection('publicUsers').doc(user.uid);
    batch.set(ref, { userId: user.uid, displayName: user.displayName });
  }
  await batch.commit();
  console.log(`  Written ${TEST_USERS.length} public users.`);
}
