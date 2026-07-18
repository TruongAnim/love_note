import { getDb, readData, writeBackup } from './lib/firestore';

const COLLECTION = 'config';
const DOC_ID = 'site';

const db = getDb();
const config = readData<Record<string, unknown>>('site-config.json');

async function sync() {
  const ref = db.collection(COLLECTION).doc(DOC_ID);
  const snapshot = await ref.get();
  const existing = snapshot.exists ? snapshot.data() : null;

  console.log(
    existing
      ? `Backed up existing config to ${writeBackup('site-config', existing)}`
      : `No existing config on the server (first run); wrote empty backup to ${writeBackup('site-config', {})}`
  );

  // set() without merge replaces the whole document, so removed keys disappear too.
  await ref.set(config);

  console.log(`Wrote data/site-config.json to ${COLLECTION}/${DOC_ID}.`);
}

sync().catch((err) => {
  console.error(err);
  process.exit(1);
});
