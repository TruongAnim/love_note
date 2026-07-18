import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const COLLECTION = 'milestones';

const serviceAccountPath = resolve(import.meta.dirname, '../serviceAccountKey.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));

const app = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);

interface MilestoneEntry {
  id: string;
  [key: string]: unknown;
}

const dataPath = resolve(import.meta.dirname, '../data/milestones.json');
const milestones: MilestoneEntry[] = JSON.parse(readFileSync(dataPath, 'utf-8'));

function backupPath(): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  return resolve(import.meta.dirname, `../backups/milestones-${stamp}.json`);
}

async function backupExistingData(): Promise<FirebaseFirestore.QueryDocumentSnapshot[]> {
  const snapshot = await db.collection(COLLECTION).get();
  const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const backupDir = resolve(import.meta.dirname, '../backups');
  mkdirSync(backupDir, { recursive: true });
  const filePath = backupPath();
  writeFileSync(filePath, JSON.stringify(docs, null, 2));
  console.log(`Backed up ${docs.length} existing documents to ${filePath}`);

  return snapshot.docs;
}

async function sync() {
  const existingDocs = await backupExistingData();

  const deleteBatch = db.batch();
  existingDocs.forEach((doc) => deleteBatch.delete(doc.ref));
  await deleteBatch.commit();

  const writeBatch = db.batch();
  for (const { id, ...fields } of milestones) {
    writeBatch.set(db.collection(COLLECTION).doc(id), fields);
  }
  await writeBatch.commit();

  console.log(`Deleted ${existingDocs.length} documents, wrote ${milestones.length} documents from data/milestones.json.`);
}

sync().catch((err) => {
  console.error(err);
  process.exit(1);
});
