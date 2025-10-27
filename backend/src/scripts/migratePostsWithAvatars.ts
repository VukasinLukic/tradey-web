/**
 * Migration script to add authorAvatarUrl to existing posts
 * Run this once: npx ts-node src/scripts/migratePostsWithAvatars.ts
 */
import * as admin from 'firebase-admin';
import * as path from 'path';

// Initialize Firebase Admin
const serviceAccountPath = path.resolve(__dirname, '../../firebase-service-account.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function migratePostsWithAvatars() {
  console.log('Starting migration: Adding authorAvatarUrl to posts...');

  try {
    // Get all posts
    const postsSnapshot = await db.collection('posts').get();
    console.log(`Found ${postsSnapshot.size} posts to migrate`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const postDoc of postsSnapshot.docs) {
      const post = postDoc.data();

      // Skip if already has authorAvatarUrl
      if (post.authorAvatarUrl !== undefined) {
        skipped++;
        continue;
      }

      // Get author's profile
      const authorId = post.authorId;
      if (!authorId) {
        console.warn(`Post ${postDoc.id} has no authorId, skipping...`);
        errors++;
        continue;
      }

      try {
        const userDoc = await db.collection('users').doc(authorId).get();
        if (!userDoc.exists) {
          console.warn(`Author ${authorId} not found for post ${postDoc.id}`);
          errors++;
          continue;
        }

        const userData = userDoc.data();
        const authorAvatarUrl = userData?.avatarUrl || null;

        // Update post with authorAvatarUrl
        await postDoc.ref.update({
          authorAvatarUrl: authorAvatarUrl,
          tags: post.tags || [],
          status: post.status || 'available',
          savedBy: post.savedBy || [],
          comments: post.comments || [],
        });

        updated++;
        console.log(`✓ Updated post ${postDoc.id} with avatar`);
      } catch (error) {
        console.error(`Error updating post ${postDoc.id}:`, error);
        errors++;
      }
    }

    console.log('\n=== Migration Complete ===');
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Errors: ${errors}`);
    console.log(`Total: ${postsSnapshot.size}`);

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

// Run migration
migratePostsWithAvatars();
