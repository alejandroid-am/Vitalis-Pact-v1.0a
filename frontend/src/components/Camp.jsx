import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Zap, Heart, Flame, Coins, FlaskConical, AlertTriangle } from 'lucide-react';

const CAMP_BG = 'https://static.prod-images.emergentagent.com/jobs/ce456438-b97a-4a6a-aa70-aab136e72d1b/images/27ecd094631a8ac3ef331a753831926074b8c643e49113267ee8a55178495503.png';
const WARRIOR_IMG = 'https://static.prod-images.emergentagent.com/jobs/ce456438-b97a-4a6a-aa70-aab136e72d1b/images/5ef76335b71bf68581dd0a74141fd29a97909f764e61788554de80b839d907b6.png';
const ROGUE_IMG = 'https://static.prod-images.emergentagent.com/jobs/ce456438-b97a-4a6a-aa70-aab136e72d1b/images/98e85895129f1cdc43fbac30a406cec77cb7fcf8ce4e0a6f7bdde9dc5cff7cd4.png';

const STAT_INFO = [
  { key: 'strength', label: 'STR', Icon: Dumbbell },
  { key: 'agility', label: 'AGI', Icon: Zap },
  { key: 'endurance', label: 'END', Icon: Heart },
];

const Camp = ({ gameData, maxHP, isStiff, onLogWorkout, onUsePotion }) => {
  const { name, characterClass, level, xp, xpMax, sp, stats, hp, gold, potions } = gameData;
  const xpPercent = Math.min(100, Math.round((xp / xpMax) * 100));
  const hpPercent = Math.min(100, Math.round((hp / maxHP) * 100));
  const hpLow = hp < maxHP * 0.4;
  const classImg = characterClass === 'warrior' ? WARRIOR_IMG : ROGUE_IMG;
  const classLabel = characterClass === 'warrior' ? 'WARRIOR' : 'ROGUE';
  const classBonus = characterClass === 'warrior' ? '+20% XP on Strength Training' : '+20% XP on Cardio';

  return (
    <div className="bg-[#09090B] min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="bg-[#18181B] border-b-2 border-[#3F3F46] px-4 py-3 flex items-center justify-between">
        <span className="font-pixel text-[#FF4500] text-[11px]">FITNESS QUEST</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#27272A] border-2 border-[#FF8C00]/50 px-2 py-1">
            <Coins size={10} className="text-[#FF8C00]" />
            <span data-testid="camp-gold-display" className="font-pixel text-[9px] text-[#FF8C00]">{gold}G</span>
          </div>
          {sp > 0 && (
            <span className="font-pixel text-[8px] text-[#FF4500] animate-pulse-glow border border-[#FF4500]/50 px-2 py-1">
              {sp} SP
            </span>
          )}
          <span className="font-pixel text-[9px] text-zinc-500">CAMP</span>
        </div>
      </div>

      <div className="flex-1 p-4 pb-2 space-y-4">
        {/* Character Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden border-2 border-[#3F3F46] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${CAMP_BG})` }}
          />
          <div className="absolute inset-0 bg-black/72" />
          <div className="relative p-4">
            {/* Character info row */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 border-2 border-[#52525B] bg-[#09090B]/60 flex items-center justify-center flex-shrink-0">
                <img src={classImg} alt={classLabel} className="w-12 h-12 object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-pixel text-[8px] text-[#FF4500] border border-[#FF4500]/50 px-1.5 py-0.5">{classLabel}</span>
                </div>
                <p className="font-pixel text-sm text-zinc-100 truncate">{name}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-pixel text-[8px] text-zinc-500 mb-0.5">LEVEL</p>
                <p data-testid="player-level" className="font-pixel text-3xl text-[#FF4500] leading-none">{level}</p>
              </div>
            </div>

            {/* XP Bar */}
            <div>
              <div className="flex justify-between mb-1.5">
                <div className="flex items-center gap-1">
                  <Flame size={10} className="text-[#FF4500]" />
                  <span className="font-pixel text-[8px] text-zinc-400">EXP</span>
                </div>
                <span data-testid="xp-display" className="font-pixel text-[8px] text-zinc-400">
                  {xp} / {xpMax}
                </span>
              </div>
              <div className="h-7 bg-[#09090B] border-2 border-[#3F3F46] w-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#DC2626] to-[#FF4500]"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
                <span className="absolute inset-0 flex items-center justify-center font-pixel text-[8px] text-white/90">
                  {xpPercent}%
                </span>
              </div>
            </div>

            {/* HP Bar */}
            <div className="mt-3">
              <div className="flex justify-between mb-1.5">
                <div className="flex items-center gap-1">
                  <Heart size={10} className={hpLow ? 'text-red-400' : 'text-green-400'} />
                  <span className="font-pixel text-[8px] text-zinc-400">HP</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    data-testid="camp-use-potion-btn"
                    onClick={onUsePotion}
                    disabled={potions <= 0 || hp >= maxHP}
                    className={`font-pixel text-[7px] px-1.5 py-0.5 border transition-all flex items-center gap-1 ${
                      potions > 0 && hp < maxHP
                        ? 'border-emerald-500/60 text-emerald-300 hover:bg-emerald-500/10 active:translate-y-[1px]'
                        : 'border-[#3F3F46] text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    <FlaskConical size={8} />
                    x{potions}
                  </button>
                  <span data-testid="camp-hp-display" className={`font-pixel text-[8px] ${hpLow ? 'text-red-400' : 'text-zinc-400'}`}>
                    {hp} / {maxHP}
                  </span>
                </div>
              </div>
              <div className="h-5 bg-[#09090B] border-2 border-[#3F3F46] w-full overflow-hidden relative">
                <motion.div
                  className={`h-full bg-gradient-to-r ${hpLow ? 'from-red-800 to-red-500' : 'from-green-800 to-green-400'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${hpPercent}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
                <span className="absolute inset-0 flex items-center justify-center font-pixel text-[7px] text-white/90">
                  {hpPercent}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-2"
        >
          {STAT_INFO.map(({ key, label, Icon }) => (
            <div
              key={key}
              data-testid={`stat-${key}`}
              className="bg-[#18181B] border-2 border-[#3F3F46] p-3 text-center"
            >
              <Icon size={14} className="text-[#FF4500] mx-auto mb-1" />
              <p className="font-pixel text-[8px] text-zinc-500 mb-1">{label}</p>
              <p className="font-pixel text-xl text-zinc-100">{stats[key]}</p>
            </div>
          ))}
        </motion.div>

        {/* Class Bonus */}
        <div className="bg-[#18181B] border-2 border-[#FF4500]/25 p-3">
          <p className="font-plex text-xs text-zinc-400">
            <span className="text-[#FF4500] font-semibold">Class Bonus: </span>
            {classBonus}
          </p>
        </div>

        {/* Stiffness banner */}
        {isStiff && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-950/50 border-2 border-red-500/60 p-3 flex items-center gap-3"
          >
            <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />
            <div className="flex-1">
              <p data-testid="camp-stiffness-banner" className="font-pixel text-[9px] text-red-300 mb-0.5">STIFFNESS — ENTUMECIDO</p>
              <p className="font-plex text-[11px] text-red-200/80 leading-snug">
                Inactive 48h+. Log a workout to cure the debuff.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Log Workout Button */}
      <div className="p-4">
        <motion.button
          data-testid="log-workout-btn"
          onClick={onLogWorkout}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-[#FF4500] hover:bg-[#DC2626] text-white font-pixel text-sm py-5 border-2 border-[#FF8C00] hover:border-[#FF4500] shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.4),_4px_4px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[inset_-1px_-1px_0px_rgba(0,0,0,0.4),_1px_1px_0px_rgba(0,0,0,1)] transition-colors uppercase"
        >
          Log Workout
        </motion.button>
      </div>
    </div>
  );
};

export default Camp;
