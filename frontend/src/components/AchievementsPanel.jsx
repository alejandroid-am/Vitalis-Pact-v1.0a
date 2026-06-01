import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock, Flame, Skull, Coins, Gift, Dumbbell, Zap, Heart, FlaskConical, Sparkles, Award, Lock,
} from 'lucide-react';
import { ACHIEVEMENTS, TIER_META, tierForValue, nextTierProgress } from '../data/achievements';

const ICON_MAP = { Clock, Flame, Skull, Coins, Gift, Dumbbell, Zap, Heart, FlaskConical, Sparkles };

const MedalBadge = ({ tier }) => {
  if (!tier) {
    return (
      <span className="font-pixel text-[7px] border border-[#3F3F46] text-zinc-600 px-1.5 py-0.5 flex items-center gap-1">
        <Lock size={8} /> LOCKED
      </span>
    );
  }
  const m = TIER_META[tier];
  return (
    <span className={`font-pixel text-[7px] border ${m.border} ${m.color} ${m.bg} px-1.5 py-0.5`}>
      {m.label}
    </span>
  );
};

const AchievementRow = ({ def, gameData }) => {
  const Icon = ICON_MAP[def.icon] || Award;
  const value = def.getValue(gameData);
  const earned = tierForValue(value, def.thresholds);
  const { next, target, pct } = nextTierProgress(value, def.thresholds);

  const tierClass =
    earned === 'gold'   ? 'border-yellow-400/70 bg-yellow-400/5'
    : earned === 'silver' ? 'border-zinc-300/60 bg-zinc-300/5'
    : earned === 'bronze' ? 'border-amber-600/60 bg-amber-700/5'
    : 'border-[#3F3F46]';

  const barColor =
    earned === 'gold'   ? 'from-yellow-500 to-yellow-300'
    : earned === 'silver' ? 'from-zinc-400 to-zinc-200'
    : earned === 'bronze' ? 'from-amber-700 to-amber-500'
    : 'from-zinc-700 to-zinc-500';

  const valueLabel = def.unit ? `${value} ${def.unit}` : value;

  return (
    <div
      data-testid={`achievement-${def.id}`}
      className={`bg-[#18181B] border-2 ${tierClass} p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.7)]`}
    >
      <div className="flex items-start gap-3 mb-2">
        <div className={`w-10 h-10 border-2 ${tierClass} bg-[#09090B] flex items-center justify-center flex-shrink-0`}>
          <Icon size={16} className={
            earned === 'gold'   ? 'text-yellow-300'
            : earned === 'silver' ? 'text-zinc-200'
            : earned === 'bronze' ? 'text-amber-500'
            : 'text-zinc-500'
          } />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <p className="font-pixel text-[10px] text-zinc-100 truncate">{def.name}</p>
            <MedalBadge tier={earned} />
          </div>
          <p className="font-plex text-[11px] text-zinc-500 leading-snug">{def.description}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-1">
        <span className="font-pixel text-[7px] text-zinc-400">{valueLabel}</span>
        <span className="font-pixel text-[7px] text-zinc-500">
          {next ? `next: ${target}` : 'MAX'}
        </span>
      </div>
      <div className="h-2 bg-[#09090B] border border-[#3F3F46] overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${barColor}`}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      {/* Tier dots */}
      <div className="flex justify-between mt-1 px-0.5">
        {['bronze', 'silver', 'gold'].map((t, i) => {
          const hit = earned && ['bronze','silver','gold'].indexOf(earned) >= i;
          const m = TIER_META[t];
          return (
            <span key={t} className={`font-pixel text-[6px] ${hit ? m.color : 'text-zinc-700'}`}>
              {def.thresholds[i]}{def.unit && def.unit !== 'STR' && def.unit !== 'AGI' && def.unit !== 'END' ? def.unit[0]?.toUpperCase() || '' : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const AchievementsPanel = ({ gameData }) => {
  // Compute summary counts
  const counts = { bronze: 0, silver: 0, gold: 0 };
  ACHIEVEMENTS.forEach(a => {
    const v = a.getValue(gameData);
    const t = tierForValue(v, a.thresholds);
    if (t) counts[t] += 1;
  });

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Award size={14} className="text-[#FF4500]" />
        <p className="font-pixel text-[9px] text-zinc-400 uppercase">Achievements</p>
        <div className="ml-auto flex items-center gap-1.5">
          <span data-testid="ach-count-bronze" className="font-pixel text-[8px] text-amber-500">🥉{counts.bronze}</span>
          <span data-testid="ach-count-silver" className="font-pixel text-[8px] text-zinc-300">🥈{counts.silver}</span>
          <span data-testid="ach-count-gold" className="font-pixel text-[8px] text-yellow-300">🥇{counts.gold}</span>
        </div>
      </div>
      <div className="space-y-2">
        {ACHIEVEMENTS.map((def, i) => (
          <motion.div
            key={def.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <AchievementRow def={def} gameData={gameData} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsPanel;
