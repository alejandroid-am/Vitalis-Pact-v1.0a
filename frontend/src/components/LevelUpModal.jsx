import React from 'react';
import { motion } from 'framer-motion';
import { Star, Zap } from 'lucide-react';

const LevelUpModal = ({ data, onClose }) => {
  const { levelsGained, newLevel, xpGained } = data;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 14, stiffness: 220 }}
        className="bg-[#18181B] border-4 border-[#FF4500] w-full max-w-sm p-6 shadow-[8px_8px_0px_0px_rgba(255,69,0,0.4)] text-center"
      >
        {/* Glow ring */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="inline-flex items-center justify-center w-16 h-16 border-4 border-[#FF4500] mb-4 mx-auto bg-[#FF4500]/10"
        >
          <Star size={28} className="text-[#FF4500]" fill="currentColor" />
        </motion.div>

        <motion.h2
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="font-pixel text-[#FF4500] text-base mb-2 leading-tight"
        >
          LEVEL UP!
        </motion.h2>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25, type: 'spring' }}
        >
          <p className="font-pixel text-5xl text-zinc-100 my-4">{newLevel}</p>
        </motion.div>

        {levelsGained > 1 && (
          <p className="font-pixel text-[9px] text-[#FF4500] mb-2">
            +{levelsGained} LEVELS GAINED!
          </p>
        )}

        <div className="bg-[#09090B] border-2 border-[#3F3F46] p-3 mb-5">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Zap size={12} className="text-[#FF4500]" />
            <span className="font-pixel text-[9px] text-zinc-300">+{xpGained} XP EARNED</span>
          </div>
          <p className="font-pixel text-[9px] text-[#FF4500]">
            +{levelsGained} SKILL {levelsGained === 1 ? 'POINT' : 'POINTS'} AWARDED
          </p>
          <p className="font-plex text-xs text-zinc-400 mt-2">
            Visit THE HERO to upgrade your stats.
          </p>
        </div>

        <button
          data-testid="levelup-close-btn"
          onClick={onClose}
          className="w-full bg-[#FF4500] hover:bg-[#DC2626] text-white font-pixel text-[10px] py-4 border-2 border-[#FF8C00] shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.4),_3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none transition-all"
        >
          CLAIM GLORY
        </button>
      </motion.div>
    </div>
  );
};

export default LevelUpModal;
