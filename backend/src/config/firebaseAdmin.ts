import admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Initialize Firebase Admin SDK
let serviceAccount: admin.ServiceAccount;

try {
  // Option 1: Try to load from environment variable (recommended for Railway/Vercel)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.log('📦 Loading Firebase credentials from environment variable...');
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }
  // Option 2: Fallback to file (for local development)
  else {
    console.log('📂 Loading Firebase credentials from file...');
    const serviceAccountPath = path.resolve(
      process.cwd(),
      process.env.FIREBASE_ADMIN_KEY_PATH || './firebase-service-account.json'
    );
    serviceAccount = require(serviceAccountPath);
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`
  });

  console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin SDK:', error);
  console.error('💡 Make sure FIREBASE_SERVICE_ACCOUNT env variable is set or firebase-service-account.json file exists');
  process.exit(1);
}

// Export Firebase services
export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage().bucket();
export default admin;
