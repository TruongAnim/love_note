import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';
import type { Lang } from '../translations';

export type MilestoneIcon = 'heart' | 'message' | 'sparkles';

/** Layout variant for a special milestone's full-page section. */
export type SpecialLayout = 'media-left' | 'media-right';

/** A text field translated into every supported language. */
export type LocalizedText = Record<Lang, string>;

export interface StoryDoc {
  title: LocalizedText;
  date: LocalizedText;
  paragraphs: LocalizedText[];
}

export interface MilestoneDoc {
  id: string;
  order: number;
  date: string;
  icon: MilestoneIcon;
  title: LocalizedText;
  description: LocalizedText;
  image?: string;

  /** Regular milestone: show in the highlighted timeline on the Milestones section. */
  isHighlight?: boolean;

  /** Special milestone: rendered as its own full-page section with richer content. */
  isSpecial?: boolean;
  layout?: SpecialLayout;
  /** If present, adds an entry to the top navigation for this milestone. */
  navLabel?: LocalizedText;
  chapter?: LocalizedText;
  /** Optional italic accent rendered as the second line of the section title. */
  titleAccent?: LocalizedText;
  video?: string;
  videoTag?: LocalizedText;
  videoDate?: LocalizedText;
  commentLink?: string;
  ctaLabel?: LocalizedText;
  story?: StoryDoc;
}

export async function fetchMilestones(): Promise<MilestoneDoc[]> {
  const q = query(collection(db, 'milestones'), orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as MilestoneDoc));
}
