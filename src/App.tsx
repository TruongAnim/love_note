/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart,
  Milestones as MilestonesIcon,
  BarChart2,
  Video,
  ChevronDown,
  Coffee,
  MessageCircle,
  Phone,
  ArrowRight,
  Sparkles,
  BookOpen,
  CalendarDays,
  Image as ImageIcon
} from 'lucide-react';
import { translations, Lang } from './translations';
import { fetchMilestones, MilestoneDoc, MilestoneIcon, SpecialLayout } from './services/milestones';
import { fetchSiteConfig, SiteConfigDoc, StatIcon, PersonDoc } from './services/config';
import {
  fetchMessengerStats,
  formatPeriod,
  formatStatValue,
  MessengerStatsDoc,
  resolveMetric
} from './services/messengerStats';

// --- Types ---
interface Stat {
  id: string;
  value: string;
  label: string;
  icon: React.ReactNode;
  bgClass?: string;
}

const STAT_ICONS: Record<StatIcon, React.ReactNode> = {
  calendar: <CalendarDays />,
  message: <MessageCircle />,
  heart: <Heart />,
  image: <ImageIcon />
};

interface LocalizedMilestone {
  id: string;
  date: string;
  title: string;
  description: string;
  image?: string;
  icon: React.ReactNode;
  isHighlight?: boolean;
}

interface StoryView {
  title: string;
  date: string;
  paragraphs: string[];
}

interface LocalizedSpecial {
  id: string;
  order: number;
  date: string;
  layout: SpecialLayout;
  navLabel?: string;
  chapter: string;
  title: string;
  titleAccent?: string;
  description: string;
  video?: string;
  image?: string;
  videoTag?: string;
  videoDate?: string;
  commentLink?: string;
  ctaLabel?: string;
  story?: StoryView;
}

type MemoryEntry =
  | { kind: 'regular'; data: LocalizedMilestone }
  | { kind: 'special'; data: LocalizedSpecial };

const MILESTONE_ICONS: Record<MilestoneIcon, React.ReactNode> = {
  heart: <Heart className="w-5 h-5" />,
  message: <MessageCircle className="w-5 h-5" />,
  sparkles: <Sparkles className="w-5 h-5" />
};

const localizeMilestone = (m: MilestoneDoc, lang: Lang): LocalizedMilestone => ({
  id: m.id,
  date: m.date,
  title: m.title[lang],
  description: m.description[lang],
  image: m.image,
  icon: MILESTONE_ICONS[m.icon],
  isHighlight: m.isHighlight
});

const localizeSpecial = (m: MilestoneDoc, lang: Lang): LocalizedSpecial => ({
  id: m.id,
  order: m.order,
  date: m.date,
  layout: m.layout ?? 'media-left',
  navLabel: m.navLabel?.[lang],
  chapter: m.chapter?.[lang] ?? '',
  title: m.title[lang],
  titleAccent: m.titleAccent?.[lang],
  description: m.description[lang],
  video: m.video,
  image: m.image,
  videoTag: m.videoTag?.[lang],
  videoDate: m.videoDate?.[lang],
  commentLink: m.commentLink,
  ctaLabel: m.ctaLabel?.[lang],
  story: m.story
    ? {
        title: m.story.title[lang],
        date: m.story.date[lang],
        paragraphs: m.story.paragraphs.map((p) => p[lang])
      }
    : undefined
});

const localizeMilestones = (docs: MilestoneDoc[], lang: Lang): LocalizedMilestone[] =>
  docs.filter((d) => !d.isSpecial).map((d) => localizeMilestone(d, lang));

const localizeSpecials = (docs: MilestoneDoc[], lang: Lang): LocalizedSpecial[] =>
  docs.filter((d) => d.isSpecial).map((d) => localizeSpecial(d, lang));

const toMemoryEntries = (docs: MilestoneDoc[], lang: Lang): MemoryEntry[] =>
  docs.map((d) =>
    d.isSpecial
      ? { kind: 'special' as const, data: localizeSpecial(d, lang) }
      : { kind: 'regular' as const, data: localizeMilestone(d, lang) }
  );

const getStats = (config: SiteConfigDoc | null, stats: MessengerStatsDoc | null, lang: Lang): Stat[] => {
  if (!config || !stats) return [];
  return config.stats.summary.map((s) => ({
    id: s.id,
    value: formatStatValue(resolveMetric(stats, s.metric)),
    label: s.label[lang],
    icon: STAT_ICONS[s.icon],
    bgClass: s.bgClass
  }));
};

// --- Components ---

const StoryPopup = ({ story, onClose }: { story: StoryView | null, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {story && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 xl:p-8"
        >
          <div className="absolute inset-0 bg-surface/80 backdrop-blur-md" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-3xl h-auto max-h-[85vh] bg-surface-container-lowest glass-panel ethereal-shadow rounded-3xl overflow-hidden flex flex-col z-10"
          >
            <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-lowest/50 backdrop-blur-xl">
              <div>
                <h2 className="font-headline text-3xl text-primary">{story.title}</h2>
                <p className="text-on-surface-variant font-body mt-1">{story.date}</p>
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-full hover:bg-primary/5 flex items-center justify-center transition-all group shrink-0 ml-4"
              >
                <div className="relative w-6 h-6">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-on-surface-variant -rotate-45 group-hover:bg-primary transition-all" />
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-on-surface-variant rotate-45 group-hover:bg-primary transition-all" />
                </div>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
               <div className="prose prose-lg prose-p:text-on-surface-variant prose-p:leading-relaxed max-w-none space-y-6">
                  {story.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
               </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/** Full class strings per accent so Tailwind can see them at build time. */
const ACCENT_STYLES = {
  secondary: {
    card: 'bg-secondary-container/20 border-secondary/20 hover:!border-secondary/40',
    watermark: 'text-secondary rotate-12',
    name: 'text-secondary',
    percent: 'text-secondary/70',
    avatarBorder: 'border-secondary',
    track: 'bg-secondary/20',
    bar: 'bg-secondary',
    tile: 'border-secondary/10'
  },
  primary: {
    card: 'bg-primary/5 border-primary/20 hover:!border-primary/40',
    watermark: 'text-primary -rotate-12',
    name: 'text-primary',
    percent: 'text-primary/70',
    avatarBorder: 'border-primary',
    track: 'bg-primary/20',
    bar: 'bg-primary',
    tile: 'border-primary/10'
  }
} as const;

const StatsPopup = ({ isOpen, onClose, lang, config, stats }: { isOpen: boolean, onClose: () => void, lang: Lang, config: SiteConfigDoc | null, stats: MessengerStatsDoc | null }) => {
  const t = translations[lang].popups.stats;
  const sendersByName = new Map((stats?.bySender ?? []).map((s) => [s.name, s]));
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 xl:p-8"
        >
          <div className="absolute inset-0 bg-surface/80 backdrop-blur-md" onClick={onClose} />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-4xl h-auto max-h-[90vh] bg-surface-container-lowest glass-panel ethereal-shadow rounded-3xl overflow-hidden flex flex-col z-10 relative"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              {Array.from({length: 15}).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: "100%", x: "-50%", opacity: 0, scale: 0 }}
                  animate={{ 
                    y: "-100%", 
                    opacity: [0, 1, 0.8, 0],
                    scale: [0.5, 1.2, 1, 0.8],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: Math.random() * 5 + 8,
                    delay: Math.random() * 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute bottom-0"
                  style={{ left: `${Math.random() * 100}%` }}
                >
                  <Heart className="text-secondary/20 fill-current" size={Math.random() * 10 + 10} />
                </motion.div>
              ))}
            </div>
            
            <div className="p-6 md:p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-lowest/50 backdrop-blur-xl relative z-20">
              <div>
                <h2 className="font-headline text-2xl md:text-3xl text-primary">{t.title}</h2>
                <p className="text-on-surface-variant font-body mt-1 text-sm md:text-base">
                  {stats && <>{formatPeriod(stats, lang)} <span className="opacity-70">({formatStatValue(resolveMetric(stats, 'daysTogether'))} {t.daysUnit})</span></>}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-full hover:bg-primary/5 flex items-center justify-center transition-all group shrink-0 ml-4"
              >
                <div className="relative w-6 h-6">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-on-surface-variant -rotate-45 group-hover:bg-primary transition-all" />
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-on-surface-variant rotate-45 group-hover:bg-primary transition-all" />
                </div>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative z-20 space-y-8">
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats && (config?.stats.detail ?? []).map((stat, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    key={stat.id}
                    className="p-5 rounded-2xl bg-surface-container-low/50 border border-outline-variant/10 shadow-sm flex flex-col justify-between hover:bg-surface-container-low transition-colors"
                  >
                    <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">{stat.label[lang]}</p>
                    <div>
                      <p className="font-display text-2xl md:text-3xl text-primary mb-1">{formatStatValue(resolveMetric(stats, stat.metric))}</p>
                      <p className="text-xs text-secondary/80 italic">
                        {stat.subMetric
                          ? stat.sub[lang].replace('{value}', formatStatValue(resolveMetric(stats, stat.subMetric)))
                          : stat.sub[lang]}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {(config?.people ?? []).map((person, i) => {
                  const sender = sendersByName.get(person.messengerName);
                  if (!sender) return null;
                  const style = ACCENT_STYLES[person.accent];

                  return (
                    <motion.div
                      key={person.id}
                      initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                      className={`p-6 rounded-3xl border relative overflow-hidden group transition-colors ${style.card}`}
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Heart className={`w-24 h-24 fill-current ${style.watermark}`} />
                      </div>
                      <div className="flex justify-between items-end mb-4 relative z-10">
                        <div>
                          <h3 className={`font-display text-2xl mb-1 ${style.name}`}>{person.name}</h3>
                          <p className={`text-sm font-semibold tracking-wider ${style.percent}`}>{Math.round(sender.share)}% {t.contrib}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-full overflow-hidden border-2 shadow-lg ${style.avatarBorder}`}>
                          <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
                        </div>
                      </div>

                      <div className={`w-full h-2 rounded-full mb-6 overflow-hidden relative z-10 ${style.track}`}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${sender.share}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={`h-full rounded-full ${style.bar}`}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center relative z-10">
                        {[
                          { value: formatStatValue(sender.total), label: t.msg },
                          { value: formatStatValue(sender.reactionsGiven), label: t.given },
                          { value: formatStatValue(sender.reactionsReceived), label: t.got }
                        ].map((tile) => (
                          <div key={tile.label} className={`bg-surface/60 rounded-xl p-3 border ${style.tile}`}>
                            <p className="font-display text-xl text-on-surface mb-1">{tile.value}</p>
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{tile.label}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MemoriesPopup = ({ isOpen, onClose, lang, entries, onNavigate }: { isOpen: boolean, onClose: () => void, lang: Lang, entries: MemoryEntry[], onNavigate: (id: string) => void }) => {
  const t = translations[lang];
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
        >
          <div className="absolute inset-0 bg-surface/80 backdrop-blur-md" onClick={onClose} />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-4xl h-[85vh] bg-surface-container-lowest glass-panel ethereal-shadow rounded-3xl overflow-hidden flex flex-col z-10"
          >
            <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-lowest/50 backdrop-blur-xl">
              <div>
                <h2 className="font-headline text-3xl text-primary">{t.popups.memories.title}</h2>
                <p className="text-on-surface-variant font-body mt-1">{t.popups.memories.desc}</p>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-full hover:bg-primary/5 flex items-center justify-center transition-all group"
              >
                <div className="relative w-6 h-6">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-on-surface-variant -rotate-45 group-hover:bg-primary transition-all" />
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-on-surface-variant rotate-45 group-hover:bg-primary transition-all" />
                </div>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="relative w-full space-y-[-20px] md:space-y-[-40px] py-12">
                {/* Central Timeline Line */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-primary-fixed/20 hidden md:block" />

                {entries.map((entry, idx) => {
                  if (entry.kind === 'special') {
                    const s = entry.data;
                    return (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5 }}
                        className={`relative flex flex-col md:flex-row items-center w-full z-10 ${
                          idx % 2 === 0 ? 'md:flex-row-reverse text-right' : 'text-left'
                        }`}
                      >
                        {/* Card Content */}
                        <div className="w-full md:w-[46%] pb-8 md:pb-0">
                          <button
                            type="button"
                            onClick={() => onNavigate(s.id)}
                            className="w-full text-inherit rounded-2xl p-[1.5px] bg-gradient-to-r from-primary/70 via-secondary/60 to-primary/70 ethereal-shadow transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 group block cursor-pointer"
                          >
                            <div className="rounded-[15px] bg-surface-container-lowest px-6 py-5 relative overflow-hidden">
                              <div className="absolute -right-3 -top-3 opacity-[0.07] pointer-events-none">
                                <Heart className="w-20 h-20 text-primary fill-current" />
                              </div>
                              <span className="font-label text-[10px] text-secondary font-bold tracking-[0.2em] uppercase mb-2 block relative z-10">{s.chapter}</span>
                              <h4 className="font-headline text-xl text-on-surface mb-3 relative z-10 leading-tight">
                                {s.title} {s.titleAccent && <span className="italic text-primary">{s.titleAccent}</span>}
                              </h4>
                              <span className="inline-flex items-center gap-2 text-primary font-bold text-sm relative z-10">
                                <span className="border-b-2 border-primary/20 group-hover:border-primary transition-all pb-0.5 tracking-tight">{t.special.viewChapter}</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </span>
                            </div>
                          </button>
                        </div>

                        {/* Centered Book Icon (special node) */}
                        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-9 h-9 rounded-full primary-gradient-glow ring-4 ring-primary-fixed/30 items-center justify-center z-20 shadow-md">
                          <BookOpen className="w-4 h-4 text-white" />
                        </div>

                        {/* Spacer for symmetry */}
                        <div className="hidden md:block md:w-[46%]" />
                      </motion.div>
                    );
                  }

                  const m = entry.data;
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5 }}
                      className={`relative flex flex-col md:flex-row items-center w-full z-10 ${
                        idx % 2 === 0 ? 'md:flex-row-reverse text-right' : 'text-left'
                      }`}
                    >
                      {/* Card Content */}
                      <div className="w-full md:w-[46%] pb-8 md:pb-0">
                        <div className="bg-surface-container-low/90 backdrop-blur-sm rounded-2xl p-6 ethereal-shadow border border-outline-variant/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 group relative overflow-hidden">
                          <span className="font-label text-[10px] text-primary font-bold tracking-[0.2em] uppercase mb-2 block">{m.date}</span>
                          <h4 className="font-headline text-lg text-on-surface mb-3">{m.title}</h4>
                          {m.image && (
                            <div className="overflow-hidden rounded-lg aspect-video mb-4">
                              <img src={m.image} alt={m.title} className="w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105" />
                            </div>
                          )}
                          {m.description && (
                            <p className={`font-body text-xs text-on-surface-variant leading-relaxed opacity-80 ${idx % 2 === 0 ? 'ml-auto' : ''}`}>
                              {m.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Centered Heart Icon */}
                      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 bg-surface-container-lowest rounded-full ring-4 ring-primary-fixed/30 border border-primary/20 items-center justify-center z-20 shadow-sm">
                        <Heart className="w-3 h-3 text-primary fill-current" />
                      </div>

                      {/* Spacer for symmetry */}
                      <div className="hidden md:block md:w-[46%]" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ lang, setLang, navItems, brandName, people }: { lang: Lang, setLang: (l: Lang) => void, navItems: { label: string; id: string }[], brandName: string, people: PersonDoc[] }) => {
  const t = translations[lang];
  const [showLinks, setShowLinks] = useState<string | null>(null);
  const selectedPerson = people.find((p) => p.id === showLinks);

  return (
    <header className="fixed top-0 w-full z-100 bg-surface/60 backdrop-blur-xl transition-all duration-300">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <div className="font-headline italic text-2xl text-primary tracking-tighter">
          {brandName}
        </div>
        <nav className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <a 
              key={item.id}
              href={`#${item.id}`} 
              className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-300 text-sm tracking-wide"
            >
              {item.label}
            </a>
          ))}
        </nav>
        
        <div className="flex items-center gap-3 relative">
          <button 
            onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant/30 hover:bg-surface-variant transition-colors overflow-hidden"
            aria-label="Toggle language"
          >
            {lang === 'en' ? (
              <span className="text-xl leading-none" role="img" aria-label="Chinese flag">🇨🇳</span>
            ) : (
              <span className="text-xl leading-none" role="img" aria-label="UK flag">🇬🇧</span>
            )}
          </button>
          <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
            {people.map((person) => (
              <button
                key={person.id}
                onClick={() => setShowLinks(showLinks === person.id ? null : person.id)}
                className={`w-10 h-10 rounded-full border-2 border-white ring-2 ${person.ringClass} overflow-hidden cursor-pointer transition-transform hover:scale-110 active:scale-95`}
              >
                <img src={person.avatar} alt={person.name} className={`w-full h-full object-cover ${person.avatarBgClass}`} />
              </button>
            ))}
          </div>

          <AnimatePresence>
            {selectedPerson && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-4 bg-white/80 backdrop-blur-xl border border-outline-variant/20 p-4 rounded-2xl ethereal-shadow min-w-[200px]"
              >
                <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-2">{t.socials.connectWith} {selectedPerson.name}</p>
                <a
                  href={selectedPerson.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 hover:bg-primary/5 rounded-xl transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <span className="font-bold text-lg">f</span>
                  </div>
                  <span className="text-sm font-medium text-on-surface group-hover:text-primary">{t.socials.fbProfile}</span>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

const SideNav = ({ activeSection, sections }: { activeSection: string, sections: string[] }) => {
  return (
    <nav className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 items-center z-50">
      {sections.map((section) => (
        <a
          key={section}
          href={`#${section}`}
          className={`w-3 h-3 rounded-full transition-all duration-500 ${
            activeSection === section 
              ? 'bg-primary scale-125 ring-4 ring-primary-container/20' 
              : 'bg-outline-variant hover:bg-primary/50'
          }`}
          aria-label={`Go to ${section} section`}
        />
      ))}
    </nav>
  );
};

const SpecialSection = ({ special, isActive, bgClass, commentLabel, onOpenStory }: {
  special: LocalizedSpecial;
  isActive: boolean;
  bgClass: string;
  commentLabel: string;
  onOpenStory: (story: StoryView) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaLeft = special.layout === 'media-left';

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) v.play().catch(() => {});
    else v.pause();
  }, [isActive]);

  const media = (
    <div className={`lg:col-span-5 flex justify-center ${mediaLeft ? 'lg:justify-start' : 'lg:justify-end order-1 lg:order-2'}`}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-[260px] md:max-w-[320px] aspect-[9/16] rounded-2xl overflow-hidden ethereal-shadow group bg-black"
      >
        {special.video ? (
          <video ref={videoRef} loop muted playsInline className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105">
            <source src={special.video} type="video/mp4" />
          </video>
        ) : special.image ? (
          <img src={special.image} alt={special.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-60" />
        {(special.videoTag || special.videoDate) && (
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-8 right-8 z-20"
          >
            <div className={`bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 ${mediaLeft ? '' : 'flex justify-end'}`}>
              <div className={`flex items-center gap-4 ${mediaLeft ? '' : 'flex-row-reverse text-right'}`}>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-10 h-10 rounded-full primary-gradient-glow flex items-center justify-center shrink-0"
                >
                  <Heart className="text-white w-5 h-5 fill-current" />
                </motion.div>
                <div>
                  {special.videoTag && <p className="text-white text-sm font-medium">{special.videoTag}</p>}
                  {special.videoDate && <p className="text-white/60 text-[10px] uppercase tracking-[0.2em] font-label">{special.videoDate}</p>}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );

  const content = (
    <motion.div
      initial={{ opacity: 0, x: mediaLeft ? 20 : -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      className={`lg:col-span-7 space-y-8 ${mediaLeft ? '' : 'order-2 lg:order-1'}`}
    >
      <div>
        <span className="font-label text-secondary uppercase tracking-[0.2em] mb-4 block text-xs font-semibold">{special.chapter}</span>
        <h2 className="font-headline text-5xl md:text-7xl text-on-surface leading-[1.1] mb-6">
          {special.title}<br/>
          {special.titleAccent && <span className="italic text-primary">{special.titleAccent}</span>}
        </h2>
      </div>
      <p className="font-body text-lg md:text-xl text-on-surface-variant leading-relaxed opacity-90 max-w-xl">
        {special.description}
      </p>
      <div className="flex flex-wrap gap-8 items-center pt-4">
        {special.commentLink && (
          <a
            href={special.commentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="primary-gradient-glow text-white px-10 py-4 rounded-full font-semibold hover:shadow-[0_0_30px_rgba(188,0,79,0.3)] transition-all inline-block"
          >
            {commentLabel}
          </a>
        )}
        {special.story && (
          <button
            onClick={() => onOpenStory(special.story!)}
            className="flex items-center gap-3 text-primary font-bold group cursor-pointer"
          >
            <span className="border-b-2 border-primary/20 group-hover:border-primary transition-all pb-1 tracking-tight">{special.ctaLabel}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </motion.div>
  );

  return (
    <section id={special.id} className={`snap-section px-6 md:px-12 lg:px-24 flex items-center justify-center ${bgClass}`}>
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
        {mediaLeft ? <>{media}{content}</> : <>{content}{media}</>}
      </div>
    </section>
  );
};

export default function App() {
  const [lang, setLang] = useState<Lang>('en');
  const [activeSection, setActiveSection] = useState('hero');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeStory, setActiveStory] = useState<StoryView | null>(null);
  const [isStatsPopupOpen, setIsStatsPopupOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [milestoneDocs, setMilestoneDocs] = useState<MilestoneDoc[]>([]);
  const [config, setConfig] = useState<SiteConfigDoc | null>(null);
  const [messengerStats, setMessengerStats] = useState<MessengerStatsDoc | null>(null);

  const t = translations[lang];
  const people = config?.people ?? [];
  const regulars = localizeMilestones(milestoneDocs, lang);
  const specials = localizeSpecials(milestoneDocs, lang);
  const memoryEntries = toMemoryEntries(milestoneDocs, lang);

  const sectionIds = ['hero', 'milestones', ...specials.map((s) => s.id), 'stats', 'continuation'];
  const navItems = [
    { label: t.nav.home, id: 'hero' },
    { label: t.nav.memories, id: 'milestones' },
    ...specials.filter((s) => s.navLabel).map((s) => ({ label: s.navLabel!, id: s.id })),
    { label: t.nav.journey, id: 'stats' }
  ];

  useEffect(() => {
    fetchMilestones().then(setMilestoneDocs).catch(console.error);
    fetchSiteConfig()
      .then((cfg) => {
        setConfig(cfg);
        return cfg?.stats.source ? fetchMessengerStats(cfg.stats.source).then(setMessengerStats) : undefined;
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'milestones', ...milestoneDocs.filter((d) => d.isSpecial).map((d) => d.id), 'stats', 'continuation'];

      if (window.innerWidth >= 768) {
        const scrollPos = containerRef.current?.scrollTop || 0;
        const height = window.innerHeight;
        const index = Math.round(scrollPos / height);
        if (sections[index]) {
          setActiveSection(sections[index]);
        }
      } else {
        const midY = window.innerHeight / 2;
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= midY && rect.bottom >= midY) {
              setActiveSection(id);
              break;
            }
          }
        }
      }
    };

    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [milestoneDocs]);

  const handleNavigateToSection = (id: string) => {
    setIsPopupOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  return (
    <div className="relative bg-surface text-on-surface font-body overflow-hidden">
      <Navbar lang={lang} setLang={setLang} navItems={navItems} brandName={config?.brand.name ?? ''} people={people} />
      <SideNav activeSection={activeSection} sections={sectionIds} />
      <MemoriesPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} lang={lang} entries={memoryEntries} onNavigate={handleNavigateToSection} />
      <StoryPopup story={activeStory} onClose={() => setActiveStory(null)} />
      <StatsPopup isOpen={isStatsPopupOpen} onClose={() => setIsStatsPopupOpen(false)} lang={lang} config={config} stats={messengerStats} />

      <main ref={containerRef} className="snap-container">
        {/* SECTION 1: HERO */}
        <section
          id="hero"
          className="snap-section bg-cover bg-center"
          style={config?.hero.backgroundImage ? { backgroundImage: `url('${config.hero.backgroundImage}')` } : undefined}
        >
          <div className="absolute inset-0 bg-surface/85 z-0" />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl text-center z-10 flex flex-col items-center gap-6 px-6"
          >
            <span className="font-label text-sm uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">{t.hero.beginning}</span>
            <h1 className="font-headline text-6xl md:text-8xl text-primary tracking-tight leading-tight">
              {config?.hero.title[lang]} <br/><span className="italic font-light text-on-surface">{config?.hero.titleAccent[lang]}</span>
            </h1>
            <p className="font-body text-xl md:text-2xl text-on-surface-variant max-w-2xl mt-4 leading-relaxed">
              {config?.hero.subtitle}
            </p>
            <div className="mt-12 glass-panel p-8 rounded-xl ethereal-shadow max-w-lg relative overflow-hidden backdrop-blur-2xl">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-container/20 rounded-full blur-3xl shadow-none" />
              <p className="italic font-headline text-on-surface leading-loose text-center opacity-90 relative z-10">
                {config?.hero.quote[lang]}
              </p>
            </div>
            
            <div className="absolute bottom-12 flex flex-col items-center gap-2 animate-bounce opacity-50">
              <span className="font-label text-xs tracking-widest uppercase mb-1">{t.hero.descend}</span>
              <ChevronDown className="text-primary w-6 h-6" />
            </div>
          </motion.div>
        </section>

        {/* SECTION 2: MILESTONES */}
        <section id="milestones" className="snap-section bg-surface-container-low px-6 md:px-12 py-24">
          <div className="max-w-5xl w-full flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-1/3 flex flex-col gap-4 sticky top-32">
              <h2 className="font-headline text-4xl md:text-5xl text-primary">{t.milestones.title}</h2>
              <p className="font-body text-on-surface-variant text-lg leading-relaxed max-w-sm">
                {t.milestones.subtitle}
              </p>
              <button 
                onClick={() => setIsPopupOpen(true)}
                className="mt-6 flex items-center gap-2 text-primary font-bold group w-fit"
              >
                <span className="border-b-2 border-primary/20 group-hover:border-primary transition-all pb-1 tracking-tight">{t.milestones.seeAll}</span>
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
            <div className="lg:w-2/3 relative w-full space-y-[-60px] md:space-y-[-120px] pt-12">
              {/* Central Timeline Line */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-primary-fixed/30 hidden md:block" />
              
              {regulars.filter((m) => m.isHighlight).map((m, idx) => (
                <motion.div 
                  key={m.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: idx * 0.15 }}
                  className={`relative flex flex-col md:flex-row items-center w-full z-10 ${
                    idx % 2 === 0 ? 'md:flex-row-reverse text-right' : 'text-left'
                  }`}
                >
                  {/* Card Content */}
                  <div className="w-full md:w-[48%]">
                    <div className="bg-surface-container-lowest/90 backdrop-blur-md rounded-3xl p-8 ethereal-shadow border border-outline-variant/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 group relative overflow-hidden">
                      <span className="font-label text-xs text-primary font-bold tracking-[0.2em] uppercase mb-3 block">{m.date}</span>
                      <h3 className="font-headline text-2xl text-on-surface mb-6">{m.title}</h3>
                      {m.image && (
                        <div className="overflow-hidden rounded-xl aspect-[16/10]">
                          <img src={m.image} alt={m.title} className="w-full h-full object-cover opacity-90 grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Centered Heart Icon */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-surface-container-lowest rounded-full ring-8 ring-primary-fixed/30 border-2 border-primary/20 items-center justify-center z-20 shadow-lg">
                    <Heart className="w-5 h-5 text-primary fill-current" />
                  </div>

                  {/* Spacer for symmetry */}
                  <div className="hidden md:block md:w-[48%]" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SPECIAL MILESTONE SECTIONS (data-driven) */}
        {specials.map((s, i) => (
          <SpecialSection
            key={s.id}
            special={s}
            isActive={activeSection === s.id}
            bgClass={i % 2 === 0 ? '' : 'bg-surface-container-low'}
            commentLabel={t.special.comment}
            onOpenStory={(story) => setActiveStory(story)}
          />
        ))}

        {/* SECTION 5: STATS */}
        <section id="stats" className="snap-section bg-surface px-6 md:px-12 py-24 overflow-hidden relative">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-fixed/40 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-container/30 rounded-full blur-3xl opacity-50" />
          
          <div className="max-w-6xl w-full z-10 flex flex-col items-center gap-10">
            <div className="text-center">
              <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-4 block font-semibold">{t.stats.tag}</span>
              <h2 className="font-headline text-5xl md:text-6xl text-primary tracking-tight mb-8">
                {t.stats.titleP1}<span className="italic font-light">{t.stats.titleP2}</span>
              </h2>
              <button 
                onClick={() => setIsStatsPopupOpen(true)}
                className="group relative px-8 py-4 bg-primary text-white rounded-full font-semibold font-label uppercase tracking-widest text-sm hover:shadow-[0_0_40px_rgba(188,0,79,0.4)] transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative flex items-center gap-3">
                  <Heart className="w-4 h-4 fill-current text-white" />
                  {t.stats.viewDetailed}
                </span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {getStats(config, messengerStats, lang).map((stat, idx) => (
                <motion.div 
                  key={stat.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`rounded-2xl p-8 flex flex-col items-center justify-center text-center ethereal-shadow border border-outline-variant/10 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 ${stat.bgClass || 'bg-surface-container-lowest'}`}
                >
                  <div className="absolute inset-0 primary-gradient-glow opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500" />
                  <div className="text-primary/60 mb-4 scale-110">
                    {stat.icon}
                  </div>
                  <div className="font-headline text-5xl text-primary mb-2 tabular-nums">
                    {stat.value}
                  </div>
                  <div className="font-label text-xs tracking-[0.1em] text-on-surface-variant uppercase font-semibold">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: CONTINUATION (To Be Continued...) */}
        <section id="continuation" className="snap-section bg-surface flex flex-col items-center justify-center py-24 px-6 md:px-12 relative overflow-hidden">
          {/* Animated Hearts Background */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-primary/10 pointer-events-none"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: window.innerHeight + 100,
                scale: Math.random() * 0.5 + 0.5,
                opacity: 0
              }}
              animate={{ 
                y: -100, 
                opacity: [0, 0.5, 0],
                rotate: Math.random() * 360
              }}
              transition={{ 
                duration: Math.random() * 10 + 10, 
                repeat: Infinity,
                delay: Math.random() * 10
              }}
            >
              <Heart className="w-12 h-12 fill-current" />
            </motion.div>
          ))}

          <div className="max-w-4xl w-full z-10 flex flex-col items-center text-center gap-12">
            <div className="relative h-64 md:h-80 w-full flex items-center justify-center">
              {/* Floating Avatars */}
              {people.map((person, i) => (
                <motion.div
                  key={person.id}
                  animate={{
                    y: i === 0 ? [0, -20, 0] : [0, 20, 0],
                    rotate: i === 0 ? [0, 5, -5, 0] : [0, -5, 5, 0]
                  }}
                  transition={{ duration: i === 0 ? 6 : 7, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute ${i === 0 ? 'left-[20%] md:left-[30%]' : 'right-[20%] md:right-[30%]'} w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white ethereal-shadow ring-4 ${person.ringSoftClass} overflow-hidden z-20`}
                >
                  <img src={person.avatar} className={`w-full h-full object-cover ${person.avatarBgClass}`} alt={person.name} />
                </motion.div>
              ))}

              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                className="bg-primary/5 p-12 rounded-full blur-3xl w-64 h-64 absolute z-0"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <span className="font-label text-xs uppercase tracking-[0.4em] text-primary font-bold">{t.continuation.tag}</span>
              <h2 className="font-headline text-5xl md:text-7xl text-on-surface">
                {t.continuation.titleP1}<span className="italic font-light">{t.continuation.titleP2}</span>
              </h2>
              <p className="font-body text-xl text-on-surface-variant max-w-xl mx-auto leading-relaxed">
                {t.continuation.desc}
              </p>
            </motion.div>
          </div>

          <footer className="absolute bottom-0 w-full py-12 flex flex-col items-center justify-center gap-6 bg-transparent z-20">
            <div className="flex gap-10">
              {[t.footerLinks.forever, t.footerLinks.always, t.footerLinks.together].map(word => (
                 <a key={word} href="#" className="font-label text-[10px] tracking-[0.3em] uppercase text-on-surface-variant/50 hover:text-primary hover:opacity-100 transition-all font-bold">
                    {word}
                 </a>
              ))}
            </div>
            <div className="font-label text-[10px] tracking-[0.1em] uppercase text-on-surface-variant/30 text-center">
              {config?.footer.copyright[lang]}
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
