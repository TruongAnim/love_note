import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';
import type { Lang } from '../translations';

export type MilestoneIcon = 'heart' | 'message' | 'sparkles';

export interface MilestoneDoc {
  id: string;
  date: string;
  order: number;
  icon: MilestoneIcon;
  isHighlight?: boolean;
  image?: string;
  video?: string;
  driveLink?: string;
  title: Record<Lang, string>;
  description: Record<Lang, string>;
}

export async function fetchMilestones(): Promise<MilestoneDoc[]> {
  const q = query(collection(db, 'milestones'), orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as MilestoneDoc));
}
