/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Milestones, 
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

// --- Types ---
interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  image?: string;
  icon: React.ReactNode;
  isHighlight?: boolean;
}

interface Stat {
  id: string;
  value: string;
  label: string;
  icon: React.ReactNode;
  bgClass?: string;
}

// --- Data ---
const ALL_MILESTONES: Milestone[] = [
  {
    id: 'm1',
    date: 'November 25, 2025',
    title: 'Admiration from Afar',
    description: 'Ms. Chinh introduced her to me. Looking at her Facebook, she seemed so positive and cheerful. I gathered my courage to send a friend request, and luckily, she accepted it.',
    icon: <Heart className="w-5 h-5" />
  },
  {
    id: 'm2',
    date: 'January 25, 2026',
    title: 'The First Message',
    description: 'After two months of just admiring her from afar and "hearting" all her stories, I finally dared to reply to one. I was so shy and didn\'t know what to say, but fortunately, she was very open and easy to talk to.',
    icon: <MessageCircle className="w-5 h-5" />
  },
  {
    id: 'm3',
    date: 'February 1, 2026',
    title: 'The First Encounter',
    description: 'I traveled from Hanoi to my hometown to meet her. We went to the market together. She looked like a radiant sunflower, warming up the chilly early winter weather. She invited me to try "Bánh Tẻ"—a hometown specialty—and then we sat together sipping coffee, cracking sunflower seeds in the cold breeze.',
    image: 'https://love-note.earth.io.vn/images/a1e43e88-c2af-4873-b418-418c0be65bd8.jpg',
    icon: <Heart className="w-5 h-5" />,
    isHighlight: true
  },
  {
    id: 'm4',
    date: 'February 14, 2026',
    title: 'First Time Giving Flowers',
    description: 'Valentine\'s Day. I bought a large basket of roses and a cute little gift for her. When I arrived, there were many relatives wrapping Chung cake. Standing at her door with the flowers, I felt incredibly shy. We went out for drinks and took photos at the square. The New Year atmosphere was drawing near.',
    icon: <Sparkles className="w-5 h-5" />
  },
  {
    id: 'm5',
    date: 'February 16, 2026',
    title: 'New Year\'s Eve Together',
    description: 'I asked her to watch the NYE fireworks. She hesitated at first because she wanted to spend New Year\'s Eve with her parents, but eventually agreed to go with me. We watched the fireworks at the square, welcoming the new year with beautiful wishes.',
    image: 'https://love-note.earth.io.vn/images/c96f0d97-ed33-487a-8341-ce94235f734a.jpg',
    icon: <Sparkles className="w-5 h-5" />,
    isHighlight: true
  },
  {
    id: 'm6',
    date: 'February 17, 2026',
    title: 'Visiting Her Home',
    description: 'Early in the Lunar New Year, right after midnight, I drove her home and came inside to visit. I met her dad, and he offered me a can of beer. He seemed very cheerful, and I had a feeling he liked me too.',
    icon: <Heart className="w-5 h-5" />
  },
  {
    id: 'm7',
    date: 'February 19, 2026',
    title: 'Visiting Hung Temple',
    description: 'We visited Hung Temple together for the new year. We climbed the steps and lit incense at the Lower, Middle, Upper, and Well temples, praying for a happy and peaceful year ahead.',
    image: 'https://love-note.earth.io.vn/images/344cf8fa-c806-46ff-aa0b-90af2bb3330f.jpg',
    icon: <Heart className="w-5 h-5" />,
    isHighlight: true
  },
  {
    id: 'm8',
    date: 'March 2, 2026',
    title: 'Planning Our Getaway',
    description: 'We often call each other at night, sharing travel memories. On March 2nd, I asked her to go to Da Nang with me. Instead of being worried, she was very enthusiastic about the plan. She searched for flight prices, travel combos, everything, which surprised me quite a bit. By March 5th, we had paid a deposit for a 4-day, 3-night tour to a beautiful coastal city. Both of us are eagerly waiting for the holiday.',
    icon: <Sparkles className="w-5 h-5" />
  },
  {
    id: 'm9',
    date: 'March 8, 2026',
    title: 'International Women\'s Day',
    description: 'It was Sunday, I went back to my hometown for a wedding. By evening, I went to buy a large basket of flowers, along with a Bluetooth headphone and a sleep mask. I chose these two gifts very carefully, hoping she would like them. Then I went to her house to give her the flowers. We went to eat a buffet at Manwah together, and then watched the movie "Thỏ". The psychological and romantic movie made both of us think quite a bit.',
    icon: <Heart className="w-5 h-5" />
  }
];

const STATS: Stat[] = [
  { id: 's1', value: '92', label: 'Days Together', icon: <CalendarDays />, bgClass: 'bg-secondary-container/20' },
  { id: 's2', value: '6,401', label: 'Messages Exchanged', icon: <MessageCircle /> },
  { id: 's3', value: '1,492', label: 'Reactions', icon: <Heart /> },
  { id: 's4', value: '639', label: 'Media Shared', icon: <ImageIcon />, bgClass: 'bg-primary-fixed/30' }
];

// --- Components ---

const ChapterOnePopup = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
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
            className="w-full max-w-3xl h-auto max-h-[85vh] bg-surface-container-lowest glass-panel ethereal-shadow rounded-3xl overflow-hidden flex flex-col z-10"
          >
            <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-lowest/50 backdrop-blur-xl">
              <div>
                <h2 className="font-headline text-3xl text-primary">The First Adventure</h2>
                <p className="text-on-surface-variant font-body mt-1">March 28, 2026</p>
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
                  <p>
                    It was our very first date, the weekend of March 28, 2026. After work that Saturday, we had planned for you to take a bus down to Hanoi to visit me. When evening fell and I couldn't reach you, my heart grew heavy with worry—until you finally arrived. We wandered around the tranquil Hoan Kiem Lake, caught a movie at Trang Tien Plaza, and stayed out talking until the late hours.
                  </p>
                  <p>
                    The very next day, I picked you up for an adventure at Royal City. It was raining heavily, and despite our raincoats, our shoes were completely soaked. Yet, the rain couldn't dampen our spirits. We went bowling, played arcade games, shared tacos, and played badminton together. Every second was filled with unapologetic joy. 
                  </p>
                  <p>
                    When darkness fell, I couldn't just let you go back alone on a bus. So, I drove you all the way back to your hometown on my motorbike. We finally arrived at 11 PM. Looking back, that rainy weekend remains one of our most beautiful and cherished memories.
                  </p>
               </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ChapterTwoPopup = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
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
            className="w-full max-w-3xl h-auto max-h-[85vh] bg-surface-container-lowest glass-panel ethereal-shadow rounded-3xl overflow-hidden flex flex-col z-10"
          >
            <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-lowest/50 backdrop-blur-xl">
              <div>
                <h2 className="font-headline text-3xl text-primary">Meeting The Family</h2>
                <p className="text-on-surface-variant font-body mt-1">April 11, 2026</p>
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
                  <p>
                    It was the weekend of April 11th. I went back to my hometown, and you came to pick me up for a walk. We strolled along the peaceful dike, cutting across the vast, green rice fields. That was the moment I finally gathered the courage to hold your hand for the very first time.
                  </p>
                  <p>
                    The next morning, you rode your motorbike to pick me up and visit your grandmother's house for lunch. We went to the market together to buy groceries. When we arrived, meeting your extended family made me quite nervous, but I tried my best to help out in the kitchen—even though my cooking skills were less than stellar! We prepared a feast: fried spring rolls, boiled duck, stir-fried buffalo meat with piper lolot, and bean sprouts with duck. You even brought a bottle of wine and some beers. 
                  </p>
                  <p>
                    The whole family was so welcoming, and the meal was filled with laughter, which eased my anxiety. I ended up drinking a bit more than I should have, trying to keep up with your brothers, but it was all in good spirits. We finished the meal with a sweet yogurt dessert. Afterward, you drove me to catch my bus back to Hanoi, and surprised me with a beautiful outfit you had ordered for me. 
                  </p>
                  <p>
                    Meeting your family for the first time was daunting, but everything went wonderfully. It warmed my heart to feel that they liked me too.
                  </p>
               </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const StatsPopup = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
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
                <h2 className="font-headline text-2xl md:text-3xl text-primary">Our Digital Connection</h2>
                <p className="text-on-surface-variant font-body mt-1 text-sm md:text-base">Jan 25, 2026 – Apr 26, 2026 <span className="opacity-70">(92 days)</span></p>
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
                {[
                  { label: 'Active Days', value: '89', sub: '~71.9/day' },
                  { label: 'Text Messages', value: '5,568', sub: 'Words of love' },
                  { label: 'Links Shared', value: '162', sub: 'Memes & songs' },
                  { label: 'Deleted', value: '32', sub: 'Oops moments' }
                ].map((stat, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="p-5 rounded-2xl bg-surface-container-low/50 border border-outline-variant/10 shadow-sm flex flex-col justify-between hover:bg-surface-container-low transition-colors"
                  >
                    <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">{stat.label}</p>
                    <div>
                      <p className="font-display text-2xl md:text-3xl text-primary mb-1">{stat.value}</p>
                      <p className="text-xs text-secondary/80 italic">{stat.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                
                {/* Person 1  */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="p-6 rounded-3xl bg-secondary-container/20 border border-secondary/20 relative overflow-hidden group hover:!border-secondary/40 transition-colors"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Heart className="w-24 h-24 text-secondary fill-current rotate-12" />
                  </div>
                  <div className="flex justify-between items-end mb-4 relative z-10">
                    <div>
                      <h3 className="font-display text-2xl text-secondary mb-1">Trường Anim</h3>
                      <p className="text-sm text-secondary/70 font-semibold tracking-wider">52% CONTRIBUTION</p>
                    </div>
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-secondary shadow-lg">
                       <img src="https://love-note.earth.io.vn/images/672394217_946668514823940_3684029729342554678_n.jpg" alt="Truong" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  
                  <div className="w-full h-2 bg-secondary/20 rounded-full mb-6 overflow-hidden relative z-10">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: "52%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-secondary rounded-full" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center relative z-10">
                    <div className="bg-surface/60 rounded-xl p-3 border border-secondary/10">
                      <p className="font-display text-xl text-on-surface mb-1">3,307</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Messages</p>
                    </div>
                    <div className="bg-surface/60 rounded-xl p-3 border border-secondary/10">
                      <p className="font-display text-xl text-on-surface mb-1">1,204</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Given Reacts</p>
                    </div>
                    <div className="bg-surface/60 rounded-xl p-3 border border-secondary/10">
                      <p className="font-display text-xl text-on-surface mb-1">288</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Got Reacts</p>
                    </div>
                  </div>
                </motion.div>

                {/* Person 2  */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="p-6 rounded-3xl bg-primary/5 border border-primary/20 relative overflow-hidden group hover:!border-primary/40 transition-colors"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Heart className="w-24 h-24 text-primary fill-current -rotate-12" />
                  </div>
                  <div className="flex justify-between items-end mb-4 relative z-10">
                    <div>
                      <h3 className="font-display text-2xl text-primary mb-1">Bích Ngọc</h3>
                      <p className="text-sm text-primary/70 font-semibold tracking-wider">48% CONTRIBUTION</p>
                    </div>
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary shadow-lg">
                       <img src="https://love-note.earth.io.vn/images/641226165_1911914302770064_335593052087986292_n.jpg" alt="Ngoc" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  
                  <div className="w-full h-2 bg-primary/20 rounded-full mb-6 overflow-hidden relative z-10">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: "48%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-primary rounded-full" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center relative z-10">
                    <div className="bg-surface/60 rounded-xl p-3 border border-primary/10">
                      <p className="font-display text-xl text-on-surface mb-1">3,094</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Messages</p>
                    </div>
                    <div className="bg-surface/60 rounded-xl p-3 border border-primary/10">
                      <p className="font-display text-xl text-on-surface mb-1">288</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Given Reacts</p>
                    </div>
                    <div className="bg-surface/60 rounded-xl p-3 border border-primary/10">
                      <p className="font-display text-xl text-on-surface mb-1">1,204</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Got Reacts</p>
                    </div>
                  </div>
                </motion.div>

              </div>
              
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MemoriesPopup = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
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
                <h2 className="font-headline text-3xl text-primary">All Our Memories</h2>
                <p className="text-on-surface-variant font-body mt-1">A complete archive of our shared journey.</p>
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

                {ALL_MILESTONES.map((m, idx) => (
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
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Navbar = () => {
  const [showLinks, setShowLinks] = useState<string | null>(null);

  const socialLinks = {
    truong: { name: 'Truong Anim', fb: 'https://facebook.com/truonganim', color: 'ring-blue-400' },
    bich: { name: 'Bich Ngoc', fb: 'https://facebook.com/bichngoc', color: 'ring-pink-400' }
  };

  return (
    <header className="fixed top-0 w-full z-100 bg-surface/60 backdrop-blur-xl transition-all duration-300">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <div className="font-headline italic text-2xl text-primary tracking-tighter">
          Love Note
        </div>
        <nav className="hidden md:flex gap-8">
          {[
            { label: 'Home', id: 'hero' }, 
            { label: 'Memories', id: 'milestones' }, 
            { label: 'Confessions', id: 'confessions' }, 
            { label: 'Cinema', id: 'cinema' }, 
            { label: 'Journey', id: 'stats' }
          ].map((item) => (
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
          <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
            {/* Truong Anim Avatar */}
            <button 
              onClick={() => setShowLinks(showLinks === 'truong' ? null : 'truong')}
              className={`w-10 h-10 rounded-full border-2 border-white ring-2 ${socialLinks.truong.color} overflow-hidden cursor-pointer transition-transform hover:scale-110 active:scale-95`}
            >
              <img src="https://love-note.earth.io.vn/images/672394217_946668514823940_3684029729342554678_n.jpg" alt="Truong Anim" className="w-full h-full object-cover bg-blue-50" />
            </button>
            {/* Bich Ngoc Avatar */}
            <button 
              onClick={() => setShowLinks(showLinks === 'bich' ? null : 'bich')}
              className={`w-10 h-10 rounded-full border-2 border-white ring-2 ${socialLinks.bich.color} overflow-hidden cursor-pointer transition-transform hover:scale-110 active:scale-95`}
            >
              <img src="https://love-note.earth.io.vn/images/641226165_1911914302770064_335593052087986292_n.jpg" alt="Bich Ngoc" className="w-full h-full object-cover bg-pink-50" />
            </button>
          </div>

          <AnimatePresence>
            {showLinks && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-4 bg-white/80 backdrop-blur-xl border border-outline-variant/20 p-4 rounded-2xl ethereal-shadow min-w-[200px]"
              >
                <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-2">Connect with {socialLinks[showLinks as keyof typeof socialLinks].name}</p>
                <a 
                  href={socialLinks[showLinks as keyof typeof socialLinks].fb} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 hover:bg-primary/5 rounded-xl transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <span className="font-bold text-lg">f</span>
                  </div>
                  <span className="text-sm font-medium text-on-surface group-hover:text-primary">Facebook Profile</span>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

const SideNav = ({ activeSection }: { activeSection: string }) => {
  const sections = ['hero', 'milestones', 'confessions', 'cinema', 'stats', 'continuation'];
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

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isChapterOnePopupOpen, setIsChapterOnePopupOpen] = useState(false);
  const [isChapterTwoPopupOpen, setIsChapterTwoPopupOpen] = useState(false);
  const [isStatsPopupOpen, setIsStatsPopupOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'milestones', 'confessions', 'cinema', 'stats', 'continuation'];
      const scrollPos = containerRef.current?.scrollTop || 0;
      const height = window.innerHeight;
      
      const index = Math.round(scrollPos / height);
      if (sections[index]) {
        setActiveSection(sections[index]);
      }
    };

    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative bg-surface text-on-surface font-body overflow-hidden">
      <Navbar />
      <SideNav activeSection={activeSection} />
      <MemoriesPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      <ChapterOnePopup isOpen={isChapterOnePopupOpen} onClose={() => setIsChapterOnePopupOpen(false)} />
      <ChapterTwoPopup isOpen={isChapterTwoPopupOpen} onClose={() => setIsChapterTwoPopupOpen(false)} />
      <StatsPopup isOpen={isStatsPopupOpen} onClose={() => setIsStatsPopupOpen(false)} />

      <main ref={containerRef} className="snap-container">
        {/* SECTION 1: HERO */}
        <section id="hero" className="snap-section bg-[url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-surface/85 z-0" />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl text-center z-10 flex flex-col items-center gap-6 px-6"
          >
            <span className="font-label text-sm uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">The Beginning</span>
            <h1 className="font-headline text-6xl md:text-8xl text-primary tracking-tight leading-tight">
              A Journey <br/><span className="italic font-light text-on-surface">of Us</span>
            </h1>
            <p className="font-body text-xl md:text-2xl text-on-surface-variant max-w-2xl mt-4 leading-relaxed">
              Truong Anim & Bich Ngoc
            </p>
            <div className="mt-12 glass-panel p-8 rounded-xl ethereal-shadow max-w-lg relative overflow-hidden backdrop-blur-2xl">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-container/20 rounded-full blur-3xl shadow-none" />
              <p className="italic font-headline text-on-surface leading-loose text-center opacity-90 relative z-10">
                "In the vastness of time and space, finding you was the serendipity that gave my universe color."
              </p>
            </div>
            
            <div className="absolute bottom-12 flex flex-col items-center gap-2 animate-bounce opacity-50">
              <span className="font-label text-xs tracking-widest uppercase mb-1">Descend</span>
              <ChevronDown className="text-primary w-6 h-6" />
            </div>
          </motion.div>
        </section>

        {/* SECTION 2: MILESTONES */}
        <section id="milestones" className="snap-section bg-surface-container-low px-6 md:px-12 py-24">
          <div className="max-w-5xl w-full flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-1/3 flex flex-col gap-4 sticky top-32">
              <h2 className="font-headline text-4xl md:text-5xl text-primary">Milestones</h2>
              <p className="font-body text-on-surface-variant text-lg leading-relaxed max-w-sm">
                Every moment documented, every memory cherished. The chapters of our ethereal manuscript.
              </p>
              <button 
                onClick={() => setIsPopupOpen(true)}
                className="mt-6 flex items-center gap-2 text-primary font-bold group w-fit"
              >
                <span className="border-b-2 border-primary/20 group-hover:border-primary transition-all pb-1 tracking-tight">See All Memories</span>
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
            <div className="lg:w-2/3 relative w-full space-y-[-60px] md:space-y-[-120px] pt-12">
              {/* Central Timeline Line */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-primary-fixed/30 hidden md:block" />
              
              {ALL_MILESTONES.filter((m) => m.isHighlight).map((m, idx) => (
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

        {/* SECTION 3: CONFESSIONS */}
        <section id="confessions" className="snap-section px-6 md:px-12 lg:px-24">
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            <div className="lg:col-span-5 flex justify-center lg:justify-start">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                className="relative w-full max-w-[260px] md:max-w-[320px] aspect-[9/16] rounded-2xl overflow-hidden ethereal-shadow group"
              >
                <video 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale-[10%]"
                >
                  <source src="https://love-note.earth.io.vn/videos/di_choi.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-60" />
                <motion.div 
                  initial={{ y: 0 }}
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-8 left-8 right-8 z-20"
                >
                  <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20">
                    <div className="flex items-center gap-4">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-10 h-10 rounded-full primary-gradient-glow flex items-center justify-center"
                      >
                        <Heart className="text-white w-5 h-5 fill-current" />
                      </motion.div>
                      <div>
                        <p className="text-white text-sm font-medium">A Rainy First Date</p>
                        <p className="text-white/60 text-[10px] uppercase tracking-[0.2em] font-label">Hanoi, Mar 28, 2026</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="lg:col-span-7 space-y-8"
            >
              <div>
                <span className="font-label text-secondary uppercase tracking-[0.2em] mb-4 block text-xs font-semibold">Chapter I: The Encounter</span>
                <h1 className="font-display text-5xl md:text-7xl text-on-surface leading-[1.1] mb-6">
                  Our First <br/>
                  <span className="italic text-primary">Adventure</span>
                </h1>
              </div>
              <p className="font-body text-lg md:text-xl text-on-surface-variant leading-relaxed opacity-90 max-w-xl">
                It was a weekend in March when our story truly began. Despite the pouring rain, we wandered through Hanoi, sharing laughter over arcade games and a memorable midnight ride home. A perfect memory etched in time.
              </p>
              <div className="flex flex-wrap gap-8 items-center pt-4">
                <a 
                  href="https://www.facebook.com/share/r/18dp6zyt4n/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="primary-gradient-glow text-white px-10 py-4 rounded-full font-semibold hover:shadow-[0_0_30px_rgba(188,0,79,0.3)] transition-all inline-block"
                >
                  Comment
                </a>
                <button 
                  onClick={() => setIsChapterOnePopupOpen(true)}
                  className="flex items-center gap-3 text-primary font-bold group cursor-pointer"
                >
                  <span className="border-b-2 border-primary/20 group-hover:border-primary transition-all pb-1 tracking-tight">See All</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 4: CHAPTER 2 */}
        <section id="cinema" className="snap-section bg-surface-container-low px-6 md:px-12 lg:px-24 flex items-center justify-center">
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="lg:col-span-7 space-y-8 order-2 lg:order-1"
            >
              <div>
                <span className="font-label text-secondary uppercase tracking-[0.2em] mb-4 block text-xs font-semibold">Chapter II: The Family</span>
                <h2 className="font-headline text-5xl md:text-7xl text-on-surface leading-[1.1] mb-6">
                  Meeting <br/>
                  <span className="italic text-primary">The Family</span>
                </h2>
              </div>
              <p className="font-body text-lg md:text-xl text-on-surface-variant leading-relaxed opacity-90 max-w-xl">
                The weekend of April 11th brought a new milestone: meeting your family. From a quiet walk along the dike where we first held hands, to a bustling, warm family lunch.
              </p>
              <div className="flex flex-wrap gap-8 items-center pt-4">
                <a 
                  href="https://www.facebook.com/share/r/1bNv5pq4wT/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="primary-gradient-glow text-white px-10 py-4 rounded-full font-semibold hover:shadow-[0_0_30px_rgba(188,0,79,0.3)] transition-all inline-block"
                >
                  Comment
                </a>
                <button 
                  onClick={() => setIsChapterTwoPopupOpen(true)}
                  className="flex items-center gap-3 text-primary font-bold group cursor-pointer"
                >
                  <span className="border-b-2 border-primary/20 group-hover:border-primary transition-all pb-1 tracking-tight">Read More</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                className="relative w-full max-w-[260px] md:max-w-[320px] aspect-[9/16] rounded-2xl overflow-hidden ethereal-shadow group bg-black"
              >
                <video 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className="w-full h-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105"
                >
                  <source src="https://love-note.earth.io.vn/videos/di_choi_2.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-60" />
                <motion.div 
                  initial={{ y: 0 }}
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-8 left-8 right-8 z-20"
                >
                  <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 flex justify-end">
                    <div className="flex flex-row-reverse items-center gap-4 text-right">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="w-10 h-10 rounded-full primary-gradient-glow flex items-center justify-center shrink-0"
                      >
                        <Heart className="text-white w-5 h-5 fill-current" />
                      </motion.div>
                      <div>
                        <p className="text-white text-sm font-medium">Meeting the Family</p>
                        <p className="text-white/60 text-[10px] uppercase tracking-[0.2em] font-label">Hometown, Apr 11, 2026</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
            
          </div>
        </section>

        {/* SECTION 5: STATS */}
        <section id="stats" className="snap-section bg-surface px-6 md:px-12 py-24 overflow-hidden relative">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-fixed/40 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-container/30 rounded-full blur-3xl opacity-50" />
          
          <div className="max-w-6xl w-full z-10 flex flex-col items-center gap-10">
            <div className="text-center">
              <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-4 block font-semibold">By The Numbers</span>
              <h2 className="font-headline text-5xl md:text-6xl text-primary tracking-tight mb-8">
                The Metrics of <span className="italic font-light">Us</span>
              </h2>
              <button 
                onClick={() => setIsStatsPopupOpen(true)}
                className="group relative px-8 py-4 bg-primary text-white rounded-full font-semibold font-label uppercase tracking-widest text-sm hover:shadow-[0_0_40px_rgba(188,0,79,0.4)] transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative flex items-center gap-3">
                  <Heart className="w-4 h-4 fill-current text-white" />
                  View Detailed Stats
                </span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {STATS.map((stat, idx) => (
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
              <motion.div 
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-[20%] md:left-[30%] w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white ethereal-shadow ring-4 ring-blue-400/30 overflow-hidden z-20"
              >
                <img src="https://love-note.earth.io.vn/images/672394217_946668514823940_3684029729342554678_n.jpg" className="w-full h-full object-cover bg-blue-50" alt="Truong Anim" />
              </motion.div>

              <motion.div 
                animate={{ 
                  y: [0, 20, 0],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-[20%] md:right-[30%] w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white ethereal-shadow ring-4 ring-pink-400/30 overflow-hidden z-20"
              >
                <img src="https://love-note.earth.io.vn/images/641226165_1911914302770064_335593052087986292_n.jpg" className="w-full h-full object-cover bg-pink-50" alt="Bich Ngoc" />
              </motion.div>

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
              <span className="font-label text-xs uppercase tracking-[0.4em] text-primary font-bold">The Infinite Chapter</span>
              <h2 className="font-headline text-5xl md:text-7xl text-on-surface">
                To Be <span className="italic font-light">Continued...</span>
              </h2>
              <p className="font-body text-xl text-on-surface-variant max-w-xl mx-auto leading-relaxed">
                As long as the stars find the night, or the ocean seeks the shore, our ethereal manuscript will never reach its final page.
              </p>
            </motion.div>
          </div>

          <footer className="absolute bottom-0 w-full py-12 flex flex-col items-center justify-center gap-6 bg-transparent z-20">
            <div className="flex gap-10">
              {['Forever', 'Always', 'Together'].map(word => (
                 <a key={word} href="#" className="font-label text-[10px] tracking-[0.3em] uppercase text-on-surface-variant/50 hover:text-primary hover:opacity-100 transition-all font-bold">
                    {word}
                 </a>
              ))}
            </div>
            <div className="font-label text-[10px] tracking-[0.1em] uppercase text-on-surface-variant/30 text-center">
              A Digital Sanctuary for Our Love © 2026
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
