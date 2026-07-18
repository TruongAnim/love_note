import { getDb, readData, writeBackup } from './lib/firestore';

const COLLECTION = 'milestones';

interface MilestoneEntry {
  id: string;
  [key: string]: unknown;
}

const db = getDb();
const milestones = readData<MilestoneEntry[]>('milestones.json');

async function sync() {
  const snapshot = await db.collection(COLLECTION).get();
  const existing = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  console.log(`Backed up ${existing.length} existing documents to ${writeBackup('milestones', existing)}`);

  const deleteBatch = db.batch();
  snapshot.docs.forEach((doc) => deleteBatch.delete(doc.ref));
  await deleteBatch.commit();

  const writeBatch = db.batch();
  for (const { id, ...fields } of milestones) {
    writeBatch.set(db.collection(COLLECTION).doc(id), fields);
  }
  await writeBatch.commit();

  console.log(`Deleted ${existing.length} documents, wrote ${milestones.length} documents from data/milestones.json.`);
}

sync().catch((err) => {
  console.error(err);
  process.exit(1);
});
