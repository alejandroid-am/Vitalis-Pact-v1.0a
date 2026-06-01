import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Skull, Coins, Gift, FlaskConical, Trophy, Lock, CheckCircle, Sparkles } from 'lucide-react';
import { TIER_REWARDS, TIER_COLORS, msUntilNextWeek } from '../data/weeklyChallenges';
import { sfx } from '../utils/sounds';

const ICON_MAP = { Clock, Skull, Coins, Gift, FlaskConical };

const formatCountdown = (ms) => {
  if (ms <= 0) return '0d 0h';
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  return `${days}d ${hours}h`;
};

const TierRow = ({ tier, value, threshold, claimed, reached, onClaim }) => {
  const c = TIER_COLORS[tier];
  const reward = TIER_REWARDS[tier];
  const rewardLabel =
    reward.legendary ? 'LEGENDARY GEAR' :
    reward.chest     ? 'MYSTERY CHEST' :
    `+${reward.gold}G`;

  const canClaim = reached && !claimed;

  return (
    <div className={`flex items-center gap-2 p-2 border-2 ${claimed ? 'border-emerald-500/40 bg-emerald-500/5' : c.border} ${claimed ? '' : c.bg}`}>
      <div className={`w-8 h-8 border-2 ${c.border} ${c.bg} flex items-center justify-center flex-shrink-0`}>
        {claimed
          ? <CheckCircle size={14} className="text-emerald-300" />
          : reached
          ? <Trophy size={14} className={c.text} />
          : <Lock size={12} className="text-zinc-600" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-pixel text-[8px] ${c.text}`}>{reward.label}</p>
        <p className="font-pixel text-[7px] text-zinc-400">{rewardLabel} · @ {threshold}</p>
      </div>
      <button
        data-testid={`claim-weekly-${tier}-btn`}
        onClick={() => canClaim && onClaim(tier)}
        disabled={!canClaim}
        className={`font-pixel text-[8px] px-2 py-1 border transition-all ${
          claimed
            ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10 cursor-default'
            : canClaim
            ? `${c.border} ${c.text} hover:bg-white/5 active:translate-y-[1px]`
            : 'border-[#3F3F46] text-zinc-600 cursor-not-allowed'
        }`}
      >
        {claimed ? 'CLAIMED' : canClaim ? 'CLAIM' : 'LOCKED'}
      </button>
    </div>
  );
};

const WeeklyChallenge = ({ info, onClaim }) => {
  const { challenge, value, weekly } = info;
  const [ms, setMs] = useState(msUntilNextWeek());
  const [drop, setDrop] = useState(null);

  useEffect(() => {
    const id = setInterval(() => setMs(msUntilNextWeek()), 60_000);
    return () => clearInterval(id);
  }, []);

  const Icon = ICON_MAP[challenge.icon] || Sparkles;
  const goldTarget = challenge.thresholds.gold;
  const pct = Math.min(100, (value / goldTarget) * 100);

  const handleClaim = (tier) => {
    const res = onClaim(tier);
    if (res?.ok) {
      sfx.achievement();
      if (res.drop) setDrop({ ...res.drop, tier });
    }
  };

  const closeDrop = () => setDrop(null);

  return (
    <div className="bg-[#18181B] border-2 border-[#FF8C00]/60 p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] relative overflow-hidden">
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-[#FF8C00]/8 to-transparent pointer-events-none"
      />

      <div className="flex items-start gap-3 mb-3 relative">
        <div className="w-10 h-10 border-2 border-[#FF8C00]/60 bg-[#FF8C00]/15 flex items-center justify-center flex-shrink-0">
          <Icon size={18} className="text-[#FF8C00]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-pixel text-[9px] text-[#FF8C00]">WEEKLY CHALLENGE</p>
            <span data-testid="weekly-countdown" className="font-pixel text-[7px] text-zinc-500">Resets in {formatCountdown(ms)}</span>
          </div>
          <p data-testid="weekly-challenge-name" className="font-pixel text-[10px] text-zinc-100 mt-0.5">{challenge.name}</p>
          <p className="font-plex text-[11px] text-zinc-400 leading-snug">{challenge.description}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-1 flex items-center justify-between">
        <span data-testid="weekly-progress-value" className="font-pixel text-[8px] text-zinc-200">
          {value} {challenge.unit}
        </span>
        <span className="font-pixel text-[7px] text-zinc-500">/ {goldTarget} {challenge.unit}</span>
      </div>
      <div className="h-3 bg-[#09090B] border-2 border-[#3F3F46] overflow-hidden relative mb-2">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-700 via-zinc-300 to-yellow-300"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6 }}
        />
        {/* Tier markers */}
        {['bronze', 'silver'].map(t => {
          const left = (challenge.thresholds[t] / goldTarget) * 100;
          return <span key={t} className="absolute top-0 bottom-0 w-px bg-black/60" style={{ left: `${left}%` }} />;
        })}
      </div>

      {/* Tier claim list */}
      <div className="space-y-1.5">
        {['bronze', 'silver', 'gold'].map(t => (
          <TierRow
            key={t}
            tier={t}
            value={value}
            threshold={challenge.thresholds[t]}
            claimed={!!weekly.claimedTiers[t]}
            reached={value >= challenge.thresholds[t]}
            onClaim={handleClaim}
          />
        ))}
      </div>

      <AnimatePresence>
        {drop && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[10100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 14, stiffness: 220 }}
              className={`bg-[#18181B] border-4 ${TIER_COLORS[drop.tier].border} w-full max-w-sm p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center`}
            >
              <Sparkles size={36} className={`${TIER_COLORS[drop.tier].text} mx-auto mb-3`} />
              <p className={`font-pixel text-sm ${TIER_COLORS[drop.tier].text} mb-1`}>{TIER_REWARDS[drop.tier].label} REWARD!</p>
              <p data-testid="weekly-drop-name" className="font-pixel text-[10px] text-zinc-200 mb-4">{drop.name || drop.kind}</p>
              <button
                data-testid="weekly-drop-close"
                onClick={closeDrop}
                className="w-full bg-[#FF4500] hover:bg-[#DC2626] text-white font-pixel text-[10px] py-3 border-2 border-[#FF8C00]"
              >
                CLAIM
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeeklyChallenge;
