import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Sparkles } from 'lucide-react';
import { TIER_META } from '../data/achievements';
import { sfx } from '../utils/sounds';

// Lightweight CSS confetti. No external dep. Generates N animated divs.
const Confetti = ({ count = 28, color }) => {
  const pieces = Array.from({ length: count });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.4;
        const dur = 1.2 + Math.random() * 1.2;
        const size = 4 + Math.floor(Math.random() * 4);
        const rotate = Math.floor(Math.random() * 360);
        return (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: '-12px',
              width: size,
              height: size + 4,
              background: color,
              transform: `rotate(${rotate}deg)`,
              animation: `confetti-fall ${dur}s ease-in ${delay}s forwards`,
              opacity: 0.9,
            }}
          />
        );
      })}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const TIER_COLOR_HEX = {
  bronze: '#D97706',
  silver: '#E4E4E7',
  gold:   '#FDE047',
};

const AchievementUnlockModal = ({ unlock, onClose }) => {
  const { achievement, tier } = unlock;
  const tierMeta = TIER_META[tier];
  const color = TIER_COLOR_HEX[tier];

  useEffect(() => {
    sfx.achievement();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[10600] flex items-center justify-center p-4">
      <Confetti color={color} />
      <motion.div
        initial={{ scale: 0.4, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className={`bg-[#18181B] border-4 ${tierMeta.border} w-full max-w-sm p-5 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden`}
      >
        {/* Shine sweep */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
        />

        <p className="font-pixel text-[8px] text-zinc-500 text-center mb-2">ACHIEVEMENT UNLOCKED</p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', damping: 10 }}
          className={`w-24 h-24 mx-auto mb-3 border-4 ${tierMeta.border} ${tierMeta.bg} flex items-center justify-center relative`}
        >
          <Award size={40} className={tierMeta.color} />
          <Sparkles size={16} className={`${tierMeta.color} absolute -top-2 -right-2`} />
        </motion.div>

        <p data-testid="unlock-tier-label" className={`font-pixel text-[14px] ${tierMeta.color} text-center mb-1`}>
          {tierMeta.label}
        </p>
        <p data-testid="unlock-achievement-name" className="font-pixel text-[10px] text-zinc-100 text-center mb-1">
          {achievement.name}
        </p>
        <p className="font-plex text-[11px] text-zinc-400 text-center mb-5 leading-snug">
          {achievement.description}
        </p>

        <button
          data-testid="unlock-close-btn"
          onClick={onClose}
          className={`w-full font-pixel text-[10px] py-3 border-2 ${tierMeta.border} ${tierMeta.bg} ${tierMeta.color} hover:brightness-125 shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.4),_3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[1px] transition-all`}
        >
          CONTINUE
        </button>
      </motion.div>
    </div>
  );
};

export default AchievementUnlockModal;
