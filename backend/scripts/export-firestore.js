/**
 * Firebase Firestore Export Script
 *
 * Exportuje sve dokumente iz svih kolekcija u JSON format.
 * Koristi Firebase Admin SDK i service account za autentifikaciju.
 *
 * Kolekcije:
 * - users (korisnički profili)
 * - posts (objave artikala)
 * - chats (chat konverzacije)
 * - messages (poruke u chat-ovima)
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Inicijalizacija Firebase Admin SDK
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Lista svih kolekcija za export
const COLLECTIONS = ['users', 'posts', 'chats', 'messages'];

/**
 * Konvertuje Firestore Timestamp u ISO string format
 */
function convertTimestamp(data) {
  if (data === null || data === undefined) {
    return data;
  }

  if (data._seconds !== undefined && data._nanoseconds !== undefined) {
    // Firestore Timestamp format
    const timestamp = new admin.firestore.Timestamp(data._seconds, data._nanoseconds);
    return timestamp.toDate().toISOString();
  }

  if (data.toDate && typeof data.toDate === 'function') {
    // Firestore Timestamp objekat
    return data.toDate().toISOString();
  }

  if (typeof data === 'object' && !Array.isArray(data)) {
    // Rekurzivno procesuiraj objekte
    const converted = {};
    for (const key in data) {
      converted[key] = convertTimestamp(data[key]);
    }
    return converted;
  }

  if (Array.isArray(data)) {
    // Procesuiraj nizove
    return data.map(item => convertTimestamp(item));
  }

  return data;
}

/**
 * Exportuje sve dokumente iz jedne kolekcije
 */
async function exportCollection(collectionName) {
  console.log(`\n📂 Čitam kolekciju: ${collectionName}...`);

  try {
    const snapshot = await db.collection(collectionName).get();
    const documents = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      const convertedData = convertTimestamp(data);

      documents.push({
        id: doc.id,
        ...convertedData
      });
    });

    console.log(`✅ Pročitano ${documents.length} dokumenata iz '${collectionName}'`);
    return documents;
  } catch (error) {
    console.error(`❌ Greška pri čitanju '${collectionName}':`, error.message);
    return [];
  }
}

/**
 * Exportuje sve kolekcije u JSON
 */
async function exportAllCollections() {
  console.log('🚀 Započinjem export Firebase Firestore baze...\n');
  console.log('=' .repeat(60));

  const exportData = {
    exportDate: new Date().toISOString(),
    projectId: serviceAccount.project_id,
    collections: {}
  };

  let totalDocuments = 0;

  // Exportuj svaku kolekciju
  for (const collectionName of COLLECTIONS) {
    const documents = await exportCollection(collectionName);
    exportData.collections[collectionName] = documents;
    totalDocuments += documents.length;
  }

  // Sačuvaj u JSON fajl
  const outputPath = path.join(__dirname, '../../firestore_data.json');
  const jsonContent = JSON.stringify(exportData, null, 2);

  fs.writeFileSync(outputPath, jsonContent, 'utf8');

  console.log('\n' + '=' .repeat(60));
  console.log('✅ EXPORT ZAVRŠEN!\n');
  console.log('📊 STATISTIKA:');
  console.log('-' .repeat(60));

  for (const collectionName of COLLECTIONS) {
    const count = exportData.collections[collectionName].length;
    console.log(`   ${collectionName.padEnd(20)} ${count.toString().padStart(5)} dokumenata`);
  }

  console.log('-' .repeat(60));
  console.log(`   ${'UKUPNO'.padEnd(20)} ${totalDocuments.toString().padStart(5)} dokumenata`);
  console.log('=' .repeat(60));
  console.log(`\n💾 Fajl sačuvan: ${outputPath}`);
  console.log(`📦 Veličina: ${(jsonContent.length / 1024).toFixed(2)} KB\n`);
}

// Pokreni export
exportAllCollections()
  .then(() => {
    console.log('🎉 Export uspešno završen!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Kritična greška:', error);
    process.exit(1);
  });
