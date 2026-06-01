import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Shield, Sword, Flame, Clock, Coins, Award, Sparkles, Lock } from 'lucide-react';
import { MOCK_FRIENDS } from '../data/friendsMock';
import { TIER_META } from '../data/achievements';
import { sfx } from '../utils/sounds';

const CLASS_ICON = { warrior: Shield, rogue: Sword };

const TIER_BADGE = {
  bronze: 'border-amber-700 text-amber-500 bg-amber-700/15',
  silver: 'border-zinc-300/70 text-zinc-200 bg-zinc-300/10',
  gold:   'border-yellow-400/80 text-yellow-300 bg-yellow-400/15',
};

const FriendCard = ({ friend, delay }) => {
  const ClassIcon = CLASS_ICON[friend.characterClass] || Shield;
  const tierMeta = TIER_META[friend.topTier] || TIER_META.bronze;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-[#18181B] border-2 border-[#3F3F46] p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.6)]"
    >
      <div className="flex items-center gap-3 mb-2">
        {/* Avatar */}
        <div className="relative w-11 h-11 border-2 border-[#52525B] bg-[#09090B] flex items-center justify-center flex-shrink-0">
          <ClassIcon size={18} className="text-zinc-300" />
          <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-[#18181B] ${friend.online ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-pixel text-[10px] text-zinc-100">{friend.name}</p>
            <span className="font-pixel text-[7px] text-zinc-500 uppercase">{friend.characterClass}</span>
          </div>
          <p className="font-pixel text-[8px] text-zinc-500 mt-0.5">LVL {friend.level} · {friend.lastActive}</p>
        </div>
        <span className={`font-pixel text-[7px] border px-1.5 py-0.5 ${TIER_BADGE[friend.topTier]}`}>
          {tierMeta.label}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-1.5">
        <div className="bg-[#27272A] border border-[#3F3F46] p-1.5 text-center">
          <Flame size={10} className="text-[#FF4500] mx-auto" />
          <p className="font-pixel text-[8px] text-zinc-200 mt-0.5">{friend.streak}d</p>
          <p className="font-pixel text-[6px] text-zinc-500">STREAK</p>
        </div>
        <div className="bg-[#27272A] border border-[#3F3F46] p-1.5 text-center">
          <Clock size={10} className="text-zinc-400 mx-auto" />
          <p className="font-pixel text-[8px] text-zinc-200 mt-0.5">{friend.totalMinutes}</p>
          <p className="font-pixel text-[6px] text-zinc-500">MIN</p>
        </div>
        <div className="bg-[#27272A] border border-[#3F3F46] p-1.5 text-center">
          <Coins size={10} className="text-[#FF8C00] mx-auto" />
          <p className="font-pixel text-[8px] text-zinc-200 mt-0.5">{friend.goldEarned}</p>
          <p className="font-pixel text-[6px] text-zinc-500">GOLD</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="mt-2 flex items-center justify-end gap-1.5">
        <span className="font-pixel text-[7px] text-amber-500">🥉{friend.achievementsCount.bronze}</span>
        <span className="font-pixel text-[7px] text-zinc-300">🥈{friend.achievementsCount.silver}</span>
        <span className="font-pixel text-[7px] text-yellow-300">🥇{friend.achievementsCount.gold}</span>
      </div>
    </motion.div>
  );
};

const Friends = ({ onBack }) => {
  return (
    <div className="bg-[#09090B] min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="bg-[#18181B] border-b-2 border-[#3F3F46] px-4 py-3 flex items-center gap-3">
        <button
          data-testid="friends-back-btn"
          onClick={() => { sfx.click(); onBack(); }}
          className="w-7 h-7 border-2 border-[#3F3F46] flex items-center justify-center text-zinc-300 hover:border-[#FF4500] hover:text-[#FF4500] transition-all"
        >
          <ArrowLeft size={14} />
        </button>
        <span className="font-pixel text-[#FF4500] text-[11px] flex-1">FRIENDS</span>
        <span className="font-pixel text-[8px] text-zinc-500">PREVIEW</span>
      </div>

      <div className="flex-1 p-4 space-y-3 overflow-y-auto pb-4">
        {/* Preview banner */}
        <div className="bg-purple-950/40 border-2 border-purple-500/60 p-3 flex items-center gap-3">
          <Lock size={18} className="text-purple-300 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-pixel text-[9px] text-purple-300 mb-0.5">PROTOTYPE PREVIEW</p>
            <p className="font-plex text-[11px] text-purple-200/80 leading-snug">
              This is a static demo. Real-time friends, invitations and leaderboards arrive when backend sync is enabled.
            </p>
          </div>
        </div>

        {/* Header summary */}
        <div className="bg-[#18181B] border-2 border-[#3F3F46] p-3 flex items-center gap-3">
          <Users size={20} className="text-[#FF4500]" />
          <div className="flex-1">
            <p className="font-pixel text-[10px] text-zinc-100">5 friends · 2 online</p>
            <p className="font-plex text-[11px] text-zinc-500">Ranked by total minutes trained.</p>
          </div>
        </div>

        {/* Top friend */}
        <p className="font-pixel text-[8px] text-zinc-500 uppercase mt-2">Leaderboard</p>
        {[...MOCK_FRIENDS]
          .sort((a, b) => b.totalMinutes - a.totalMinutes)
          .map((f, i) => (
            <FriendCard key={f.id} friend={f} delay={i * 0.05} />
          ))}

        {/* Future actions placeholder */}
        <div className="bg-[#18181B] border-2 border-dashed border-[#3F3F46] p-4 text-center mt-3">
          <Sparkles size={18} className="text-zinc-600 mx-auto mb-2" />
          <p className="font-pixel text-[9px] text-zinc-500">Coming soon</p>
          <p className="font-plex text-[11px] text-zinc-600 mt-1 leading-snug">
            Add friends by code · Compare weekly challenges · Co-op events
          </p>
        </div>
      </div>
    </div>
  );
};

export default Friends;
