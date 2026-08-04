import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { LocalizedText } from './milestones';
import type { StatMetric } from './messengerStats';

export type StatIcon = 'calendar' | 'message' | 'heart' | 'image';

/** Which theme colour a person's blocks are painted with. */
export type PersonAccent = 'primary' | 'secondary';

export interface PersonDoc {
  id: string;
  name: string;
  /** Name this person appears under in the Messenger export, used to match stats. */
  messengerName: string;
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
  metric: StatMetric;
  label: LocalizedText;
  bgClass?: string;
}

export interface DetailStatDoc {
  id: string;
  metric: StatMetric;
  label: LocalizedText;
  /** Caption under the number; a `{value}` token is filled in from `subMetric`. */
  sub: LocalizedText;
  subMetric?: StatMetric;
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
    /** Document id inside the `messenger_stats` collection to pull numbers from. */
    source: string;
    summary: SummaryStatDoc[];
    detail: DetailStatDoc[];
  };
  footer: { copyright: LocalizedText };
}

export const CONFIG_COLLECTION = 'config';
export const CONFIG_DOC_ID = 'site';

export async function fetchSiteConfig(): Promise<SiteConfigDoc | null> {
  const snapshot = await getDoc(doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID));
  return snapshot.exists() ? (snapshot.data() as SiteConfigDoc) : null;
}
