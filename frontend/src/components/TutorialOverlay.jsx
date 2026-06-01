import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Store, AlertTriangle, Sparkles, ChevronRight, Flame } from 'lucide-react';
import { sfx } from '../utils/sounds';

const SLIDES = [
  {
    id: 'welcome',
    Icon: Flame,
    title: 'Welcome to Vitalis Pact',
    body: 'Every real-world workout fuels your hero. Train to earn XP, level up, and unlock new zones across the wilds.',
    accent: 'text-[#FF4500]',
    border: 'border-[#FF4500]/60',
  },
  {
    id: 'hp',
    Icon: Heart,
    title: 'Health & Recovery',
    body: 'Your HP carries between battles. It regenerates 10% per hour and refills fully at midnight. Drink potions to heal anywhere.',
    accent: 'text-emerald-300',
    border: 'border-emerald-500/60',
  },
  {
    id: 'market',
    Icon: Store,
    title: 'The Market & Mystery Chests',
    body: 'Spend gold dropped by enemies on potions, gear, and the Mystery Chest — your shot at epic or legendary loot.',
    accent: 'text-[#FF8C00]',
    border: 'border-[#FF8C00]/60',
  },
  {
    id: 'rusted',
    Icon: AlertTriangle,
    title: 'Rusted (Debuff)',
    body: 'Skip workouts for 48+ hours and your hero becomes Rusted — 30% less damage dealt, 30% more taken. Train to forge yourself back.',
    accent: 'text-red-300',
    border: 'border-red-500/60',
  },
  {
    id: 'events',
    Icon: Sparkles,
    title: 'Special Events',
    body: 'A new fantastical event rotates every 12 hours. Enemies scale to your power, but rewards include guaranteed epic gear.',
    accent: 'text-purple-300',
    border: 'border-purple-500/60',
  },
];

const TutorialOverlay = ({ onComplete }) => {
  const [idx, setIdx] = useState(0);
  const slide = SLIDES[idx];
  const isLast = idx === SLIDES.length - 1;

  const handleNext = () => {
    sfx.click();
    if (isLast) onComplete();
    else setIdx(idx + 1);
  };

  const handleSkip = () => {
    sfx.click();
    onComplete();
  };

  const Icon = slide.Icon;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[10500] flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 240 }}
        className={`bg-[#18181B] border-4 ${slide.border} w-full max-w-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden`}
      >
        {/* Top bar with progress dots + skip */}
        <div className="bg-[#27272A] border-b-2 border-[#3F3F46] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <span
                key={i}
                data-testid={`tutorial-dot-${i}`}
                className={`block transition-all ${
                  i === idx
                    ? 'w-6 h-2 bg-[#FF4500]'
                    : i < idx
                    ? 'w-2 h-2 bg-zinc-400'
                    : 'w-2 h-2 bg-zinc-700'
                }`}
              />
            ))}
          </div>
          <button
            data-testid="tutorial-skip-btn"
            onClick={handleSkip}
            className="font-pixel text-[8px] text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            SKIP
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.22 }}
            className="p-6"
          >
            <div className="flex justify-center mb-5">
              <div className={`w-20 h-20 border-2 ${slide.border} bg-[#09090B] flex items-center justify-center`}>
                <Icon size={36} className={slide.accent} />
              </div>
            </div>
            <p data-testid="tutorial-step-title" className={`font-pixel text-[12px] ${slide.accent} text-center mb-3`}>
              {slide.title}
            </p>
            <p className="font-plex text-sm text-zinc-300 leading-relaxed text-center">
              {slide.body}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="p-4 pt-0">
          <button
            data-testid="tutorial-next-btn"
            onClick={handleNext}
            className="w-full bg-[#FF4500] hover:bg-[#DC2626] text-white font-pixel text-[10px] py-4 border-2 border-[#FF8C00] shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.4),_3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            {isLast ? 'BEGIN THE QUEST' : 'NEXT'}
            {!isLast && <ChevronRight size={14} />}
          </button>
          <p className="text-center font-pixel text-[7px] text-zinc-600 mt-2">
            {idx + 1} / {SLIDES.length}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TutorialOverlay;
