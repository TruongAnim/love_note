import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { LocalizedText } from './milestones';

export type StatIcon = 'calendar' | 'message' | 'heart' | 'image';

/** Which theme colour a person's blocks are painted with. */
export type PersonAccent = 'primary' | 'secondary';

export interface PersonDoc {
  id: string;
  name: string;
  avatar: string;
  facebook: string;
  accent: PersonAccent;
  ringClass: string;
  /** Softer ring used for the large floating avatars. */
  ringSoftClass: string;
  avatarBgClass: string;
}

export interface SummaryStatDoc {
  id: string;
  icon: StatIcon;
  value: string;
  label: LocalizedText;
  bgClass?: string;
}

export interface DetailStatDoc {
  id: string;
  value: string;
  label: LocalizedText;
  sub: LocalizedText;
}

export interface ContributionDoc {
  personId: string;
  percent: number;
  messages: string;
  given: string;
  got: string;
}

export interface SiteConfigDoc {
  brand: { name: string };
  hero: {
    backgroundImage: string;
    title: LocalizedText;
    titleAccent: LocalizedText;
    subtitle: string;
    quote: LocalizedText;
  };
  people: PersonDoc[];
  stats: {
    period: LocalizedText;
    periodDays: LocalizedText;
    summary: SummaryStatDoc[];
    detail: DetailStatDoc[];
    contributions: ContributionDoc[];
  };
  footer: { copyright: LocalizedText };
}

export const CONFIG_COLLECTION = 'config';
export const CONFIG_DOC_ID = 'site';

export async function fetchSiteConfig(): Promise<SiteConfigDoc | null> {
  const snapshot = await getDoc(doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID));
  return snapshot.exists() ? (snapshot.data() as SiteConfigDoc) : null;
}
