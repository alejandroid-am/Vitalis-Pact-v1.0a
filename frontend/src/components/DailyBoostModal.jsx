import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Gift, Flame, CheckCircle, X } from 'lucide-react';

// Daily boost popup — shown when user opens app and hasn't claimed today.
// `status` is from getDailyBoostStatus(): { available, nextDay, target, todayMinutes, reward }
const DailyBoostModal = ({ status, onClose }) => {
  const { nextDay, target, todayMinutes, reward } = status;
  const pct = Math.min(100, Math.round((todayMinutes / target) * 100));
  const earned = todayMinutes >= target;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[10200] flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 18, stiffness: 240 }}
        className="bg-[#18181B] border-4 border-[#FF8C00] w-full max-w-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
      >
        {/* Shine */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#FF8C00]/15 to-transparent pointer-events-none"
        />

        {/* Header */}
        <div className="bg-[#27272A] border-b-2 border-[#FF8C00] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={14} className="text-[#FF8C00]" />
            <span className="font-pixel text-[10px] text-[#FF8C00]">DAILY BOOST</span>
          </div>
          <button data-testid="daily-boost-close" onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X size={16} />
          </button>
        </div>

        <div className="p-4">
          <p className="font-pixel text-[9px] text-zinc-400 mb-1">Day {nextDay} streak reward</p>

          {/* Reward card */}
          <div className="bg-[#09090B] border-2 border-[#FF8C00]/40 p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <Coins size={20} className="text-[#FF8C00]" />
              <p data-testid="boost-gold-reward" className="font-pixel text-lg text-[#FF8C00]">+{reward.gold}G</p>
            </div>
            {reward.chest && (
              <div className="flex items-center gap-3">
                <Gift size={20} className="text-purple-300" />
                <p data-testid="boost-chest-reward" className="font-pixel text-[10px] text-purple-300">+ FREE MYSTERY CHEST</p>
              </div>
            )}
          </div>

          {/* Challenge */}
          <div className="bg-[#27272A] border border-[#3F3F46] p-3 mb-4">
            <p className="font-pixel text-[9px] text-zinc-200 mb-2">
              Train <span className="text-[#FF4500]">{target}+ min</span> today to claim.
            </p>
            <div className="flex items-center justify-between mb-1">
              <span className="font-pixel text-[7px] text-zinc-500">PROGRESS</span>
              <span className="font-pixel text-[7px] text-zinc-300">{todayMinutes} / {target} min</span>
            </div>
            <div className="h-3 bg-[#09090B] border border-[#3F3F46] overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${earned ? 'from-emerald-700 to-emerald-400' : 'from-[#DC2626] to-[#FF8C00]'}`}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>

          {/* Day chain */}
          <div className="flex justify-between mb-4">
            {[1,2,3,4,5,6,7].map(d => {
              const isCurrent = d === nextDay;
              const isPast = d < nextDay;
              return (
                <div key={d} className="flex flex-col items-center gap-1">
                  <div className={`w-6 h-6 border-2 flex items-center justify-center font-pixel text-[8px] ${
                    isCurrent ? 'border-[#FF8C00] bg-[#FF8C00]/20 text-[#FF8C00]'
                    : isPast  ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300'
                    : 'border-[#3F3F46] text-zinc-600'
                  }`}>
                    {isPast ? <CheckCircle size={10} /> : d}
                  </div>
                  <span className="font-pixel text-[6px] text-zinc-600">D{d}</span>
                </div>
              );
            })}
          </div>

          <button
            data-testid="daily-boost-ack-btn"
            onClick={onClose}
            className={`w-full font-pixel text-[10px] py-4 border-2 transition-all ${
              earned
                ? 'bg-emerald-700 hover:bg-emerald-600 border-emerald-500 text-white shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.4),_3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[1px]'
                : 'bg-[#FF4500] hover:bg-[#DC2626] border-[#FF8C00] text-white shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.4),_3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[1px]'
            }`}
          >
            {earned ? 'CLAIMED ✓' : "LET'S TRAIN"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DailyBoostModal;
