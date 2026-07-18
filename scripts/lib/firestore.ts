import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

const ROOT = resolve(import.meta.dirname, '../..');

let db: Firestore | null = null;

/** Firestore admin handle, authenticated with the local service account key. */
export function getDb(): Firestore {
  if (!db) {
    const serviceAccount = JSON.parse(readFileSync(resolve(ROOT, 'serviceAccountKey.json'), 'utf-8'));
    db = getFirestore(initializeApp({ credential: cert(serviceAccount) }));
  }
  return db;
}

export function readData<T>(fileName: string): T {
  return JSON.parse(readFileSync(resolve(ROOT, 'data', fileName), 'utf-8')) as T;
}

/** Writes a timestamped snapshot of whatever is currently on the server. */
export function writeBackup(name: string, payload: unknown): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dir = resolve(ROOT, 'backups');
  mkdirSync(dir, { recursive: true });
  const filePath = resolve(dir, `${name}-${stamp}.json`);
  writeFileSync(filePath, JSON.stringify(payload, null, 2));
  return filePath;
}
