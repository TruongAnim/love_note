import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Lang } from '../translations';

export const MESSENGER_STATS_COLLECTION = 'messenger_stats';

/** Per-participant breakdown of one conversation. */
export interface SenderStats {
  name: string;
  total: number;
  share: number;
  media: number;
  links: number;
  reactionsReceived: number;
  reactionsGiven: number;
  byHour: number[];
}

export interface MessengerStatsDoc {
  displayName: string;
  participants: string[];
  totals: {
    messages: number;
    text: number;
    media: number;
    links: number;
    unsent: number;
    reactions: number;
  };
  period: {
    firstTimestamp: number;
    lastTimestamp: number;
    activeDays: number;
    longestStreak: number;
    avgPerActiveDay: number;
  };
  byHour: number[];
  byDay: { date: string; count: number }[];
  byMonth: { date: string; count: number }[];
  topReactions: { emoji: string; count: number }[];
  bySender: SenderStats[];
}

/** Numbers a stat tile in the site config can point at. */
export type StatMetric =
  | 'daysTogether'
  | 'messages'
  | 'text'
  | 'media'
  | 'links'
  | 'unsent'
  | 'reactions'
  | 'activeDays'
  | 'longestStreak'
  | 'avgPerActiveDay';

const MS_PER_DAY = 86_400_000;

const startOfDay = (ts: number): number => {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

/** Calendar days spanned by the conversation, counting both end days. */
export const daysTogether = (stats: MessengerStatsDoc): number =>
  Math.round((startOfDay(stats.period.lastTimestamp) - startOfDay(stats.period.firstTimestamp)) / MS_PER_DAY) + 1;

export function resolveMetric(stats: MessengerStatsDoc, metric: StatMetric): number {
  switch (metric) {
    case 'daysTogether': return daysTogether(stats);
    case 'messages': return stats.totals.messages;
    case 'text': return stats.totals.text;
    case 'media': return stats.totals.media;
    case 'links': return stats.totals.links;
    case 'unsent': return stats.totals.unsent;
    case 'reactions': return stats.totals.reactions;
    case 'activeDays': return stats.period.activeDays;
    case 'longestStreak': return stats.period.longestStreak;
    case 'avgPerActiveDay': return stats.period.avgPerActiveDay;
  }
}

/** Thousands separators for counts, two decimals for averages. */
export const formatStatValue = (value: number): string =>
  Number.isInteger(value) ? value.toLocaleString('en-US') : value.toFixed(2);

const DATE_FORMATS: Record<Lang, { locale: string; options: Intl.DateTimeFormatOptions }> = {
  en: { locale: 'en-US', options: { month: 'short', day: 'numeric', year: 'numeric' } },
  zh: { locale: 'zh-CN', options: { year: 'numeric', month: 'long', day: 'numeric' } }
};

export function formatPeriod(stats: MessengerStatsDoc, lang: Lang): string {
  const { locale, options } = DATE_FORMATS[lang];
  const format = (ts: number) => new Date(ts).toLocaleDateString(locale, options);
  return `${format(stats.period.firstTimestamp)} – ${format(stats.period.lastTimestamp)}`;
}

export async function fetchMessengerStats(docId: string): Promise<MessengerStatsDoc | null> {
  const snapshot = await getDoc(doc(db, MESSENGER_STATS_COLLECTION, docId));
  return snapshot.exists() ? (snapshot.data() as MessengerStatsDoc) : null;
}
