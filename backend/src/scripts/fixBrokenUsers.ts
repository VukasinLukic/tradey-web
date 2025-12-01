/**
 * Script to fix "broken" users who exist in Firebase Auth but not in Firestore
 *
 * Run with: npx ts-node src/scripts/fixBrokenUsers.ts
 */

import admin from 'firebase-admin';
import '../config/firebaseAdmin'; // Initialize Firebase Admin
import { COLLECTIONS } from '../shared/constants/firebasePaths';

async function fixBrokenUsers() {
  console.log('🔍 Searching for broken users...\n');

  const db = admin.firestore();
  const auth = admin.auth();

  try {
    // Get all Firebase Auth users
    const listUsersResult = await auth.listUsers();
    const authUsers = listUsersResult.users;

    console.log(`Found ${authUsers.length} users in Firebase Auth`);

    let fixedCount = 0;
    let alreadyExistsCount = 0;

    for (const authUser of authUsers) {
      const uid = authUser.uid;

      // Check if user exists in Firestore
      const userDoc = await db.collection(COLLECTIONS.USERS).doc(uid).get();

      if (!userDoc.exists) {
        console.log(`\n❌ BROKEN USER FOUND: ${uid}`);
        console.log(`   Email: ${authUser.email}`);
        console.log(`   Created: ${authUser.metadata.creationTime}`);

        // Create minimal Firestore profile
        const newUserProfile = {
          uid: authUser.uid,
          username: authUser.email?.split('@')[0] || `user_${uid.substring(0, 8)}`,
          email: authUser.email || '',
          phone: authUser.phoneNumber || '',
          location: '',
          createdAt: new Date(authUser.metadata.creationTime),
          following: [],
          followers: [],
          likedPosts: [],
          rating: 0,
          totalReviews: 0,
          reviews: [],
        };

        await db.collection(COLLECTIONS.USERS).doc(uid).set(newUserProfile);
        console.log(`   ✅ Created Firestore profile`);
        fixedCount++;
      } else {
        alreadyExistsCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Summary:');
    console.log(`   Total users in Auth: ${authUsers.length}`);
    console.log(`   Already have Firestore profile: ${alreadyExistsCount}`);
    console.log(`   Fixed (created profile): ${fixedCount}`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
fixBrokenUsers()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
