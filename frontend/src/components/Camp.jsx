import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell, Zap, Heart, Flame, Coins, FlaskConical,
  AlertTriangle, Settings as SettingsIcon, ChevronDown, ChevronUp, Swords,
} from 'lucide-react';
import WeeklyChallenge from './WeeklyChallenge';
import WorkoutHistory from './WorkoutHistory';
import HeroSprite from './HeroSprite';

const STAT_INFO = [
  { key: 'strength',  label: 'STR', Icon: Dumbbell, color: '#F97316' },
  { key: 'agility',   label: 'AGI', Icon: Zap,      color: '#EAB308' },
  { key: 'endurance', label: 'END', Icon: Heart,    color: '#EF4444' },
];

const CLASS_LABEL = { warrior: 'WARRIOR', rogue: 'ROGUE', mage: 'MAGE', ranger: 'RANGER' };
const CLASS_BONUS = {
  warrior: '+20% XP Strength',
  rogue:   '+20% XP Cardio',
  mage:    '+20% XP Flexibility',
  ranger:  '+20% XP Outdoor',
};
const CLASS_COLOR = {
  warrior: '#F97316',
  rogue:   '#A78BFA',
  mage:    '#60A5FA',
  ranger:  '#4ADE80',
};

const Camp = ({ gameData, maxHP, isStiff, weeklyInfo, onLogWorkout, onUsePotion, onOpenSettings, onClaimWeeklyTier }) => {
  const { name, characterClass, level, xp, xpMax, sp, stats, hp, gold, potions } = gameData;
  const [historyOpen, setHistoryOpen] = useState(false);

  const xpPercent  = Math.min(100, Math.round((xp / xpMax) * 100));
  const hpPercent  = Math.min(100, Math.round((hp / maxHP) * 100));
  const hpLow      = hp < maxHP * 0.4;
  const classColor = CLASS_COLOR[characterClass] || '#FF4500';
  const classLabel = CLASS_LABEL[characterClass] || 'HERO';
  const classBonus = CLASS_BONUS[characterClass] || '+20% XP';

  return (
    <div className="bg-[#060608] min-h-[calc(100vh-4rem)] flex flex-col">

      {/* ─── Header ─── */}
      <div
        className="px-4 py-3 flex items-center justify-between border-b border-[#1a1a22]"
        style={{ background: 'rgba(10,10,14,0.95)' }}
      >
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[10px]" style={{ color: '#FF4500', letterSpacing: '0.12em' }}>
            VITALIS PACT
          </span>
          {sp > 0 && (
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="font-pixel text-[7px] px-2 py-0.5 border"
              style={{ color: '#FF4500', borderColor: 'rgba(255,69,0,0.5)' }}
            >
              {sp} SP!
            </motion.span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Gold */}
          <div className="flex items-center gap-1 px-2 py-1 border" style={{ background: 'rgba(255,140,0,0.08)', borderColor: 'rgba(255,140,0,0.3)' }}>
            <Coins size={10} style={{ color: '#FF8C00' }} />
            <span data-testid="camp-gold-display" className="font-pixel text-[8px]" style={{ color: '#FF8C00' }}>
              {gold}G
            </span>
          </div>
          <button
            data-testid="open-settings-btn"
            onClick={onOpenSettings}
            className="w-7 h-7 border flex items-center justify-center transition-all"
            style={{ borderColor: '#2a2a32', color: '#71717A' }}
          >
            <SettingsIcon size={12} />
          </button>
        </div>
      </div>

      <div className="flex-1 p-3 space-y-3 overflow-y-auto" style={{ paddingBottom: '5rem' }}>

        {/* ─── Hero Card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden border-2 border-glow-red"
          style={{
            borderColor: 'rgba(255,69,0,0.3)',
            background: 'linear-gradient(135deg, #0d0d12 0%, #12121a 60%, #0f0a0a 100%)',
          }}
        >
          {/* Scanline overlay */}
          <div className="scanlines absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} />

          {/* Background pixel pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle, ${classColor} 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }}
          />

          <div className="relative p-4" style={{ zIndex: 2 }}>
            <div className="flex items-end gap-4">
              {/* Sprite */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div
                  className="w-20 h-20 flex items-center justify-center relative"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: `2px solid ${classColor}30`,
                  }}
                >
                  {/* Glow under sprite */}
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-3 rounded-full opacity-40"
                    style={{ background: classColor, filter: 'blur(8px)' }}
                  />
                  <HeroSprite characterClass={characterClass} size={56} animate />
                </div>
                {/* Class badge */}
                <div
                  className="font-pixel text-[6px] px-2 py-0.5 mt-1"
                  style={{
                    background: `${classColor}20`,
                    color: classColor,
                    border: `1px solid ${classColor}50`,
                  }}
                >
                  {classLabel}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-pixel text-sm text-zinc-100 truncate mb-1">{name}</p>

                {/* Level */}
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-pixel text-[7px] text-zinc-500">LV</span>
                  <span data-testid="player-level" className="font-pixel text-4xl leading-none" style={{ color: classColor }}>
                    {level}
                  </span>
                  <span className="font-pixel text-[7px] text-zinc-600">{classBonus}</span>
                </div>

                {/* XP Bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <Flame size={9} style={{ color: '#FF4500' }} />
                      <span className="font-pixel text-[7px] text-zinc-500">EXP</span>
                    </div>
                    <span data-testid="xp-display" className="font-pixel text-[7px] text-zinc-500">
                      {xp}/{xpMax}
                    </span>
                  </div>
                  <div className="h-4 w-full overflow-hidden border border-[#1a1a22]" style={{ background: '#09090d' }}>
                    <motion.div
                      className="h-full xp-shimmer"
                      initial={{ width: 0 }}
                      animate={{ width: `${xpPercent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* HP Bar */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <Heart size={9} style={{ color: hpLow ? '#EF4444' : '#4ADE80' }} />
                      <span className="font-pixel text-[7px] text-zinc-500">HP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        data-testid="camp-use-potion-btn"
                        onClick={onUsePotion}
                        disabled={potions <= 0 || hp >= maxHP}
                        className="font-pixel text-[6px] px-1.5 py-0.5 border flex items-center gap-1 transition-all"
                        style={
                          potions > 0 && hp < maxHP
                            ? { borderColor: '#4ADE80', color: '#4ADE80' }
                            : { borderColor: '#27272A', color: '#3F3F46', cursor: 'not-allowed' }
                        }
                      >
                        <FlaskConical size={7} /> ×{potions}
                      </button>
                      <span
                        data-testid="camp-hp-display"
                        className="font-pixel text-[7px]"
                        style={{ color: hpLow ? '#EF4444' : '#71717A' }}
                      >
                        {hp}/{maxHP}
                      </span>
                    </div>
                  </div>
                  <div className="h-3 w-full overflow-hidden border border-[#1a1a22]" style={{ background: '#09090d' }}>
                    <motion.div
                      className={`h-full bg-gradient-to-r ${hpLow ? 'from-red-900 to-red-500' : 'from-green-900 to-green-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${hpPercent}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── RUSTED Warning ─── */}
        <AnimatePresence>
          {isStiff && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-2 flex items-center gap-3 p-3 overflow-hidden"
              style={{
                background: 'rgba(127,29,29,0.2)',
                borderColor: 'rgba(239,68,68,0.5)',
              }}
            >
              <AlertTriangle size={18} className="text-red-400 flex-shrink-0 rusted-icon" />
              <div>
                <p data-testid="camp-rusted-banner" className="font-pixel text-[8px] text-red-400 mb-0.5">
                  ⚠ RUSTED
                </p>
                <p className="font-plex text-[11px] text-red-200/80 leading-snug">
                  Inactive 48h+. Blade dulls — train to forge back.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Stats Row ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="grid grid-cols-3 gap-2"
        >
          {STAT_INFO.map(({ key, label, Icon, color }) => (
            <div
              key={key}
              data-testid={`stat-${key}`}
              className="p-3 text-center border"
              style={{ background: '#0d0d12', borderColor: '#1a1a22' }}
            >
              <Icon size={13} style={{ color }} className="mx-auto mb-1" />
              <p className="font-pixel text-[7px] text-zinc-500 mb-1">{label}</p>
              <p className="font-pixel text-xl text-zinc-100">{stats[key]}</p>
            </div>
          ))}
        </motion.div>

        {/* ─── Quick actions strip ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
          className="flex gap-2"
        >
          <div
            className="flex-1 flex items-center gap-2 px-3 py-2 border"
            style={{ background: '#0d0d12', borderColor: '#1a1a22' }}
          >
            <Swords size={12} style={{ color: classColor }} />
            <span className="font-pixel text-[7px] text-zinc-400">{classBonus}</span>
          </div>
          {sp > 0 && (
            <div
              className="flex items-center gap-1.5 px-3 py-2 border"
              style={{ background: 'rgba(255,69,0,0.08)', borderColor: 'rgba(255,69,0,0.3)' }}
            >
              <span className="font-pixel text-[7px]" style={{ color: '#FF4500' }}>
                {sp} SP → HERO
              </span>
            </div>
          )}
        </motion.div>

        {/* ─── Weekly Challenge ─── */}
        {weeklyInfo && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
            <WeeklyChallenge info={weeklyInfo} onClaim={onClaimWeeklyTier} />
          </motion.div>
        )}

        {/* ─── Workout History (collapsible) ─── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}>
          <button
            onClick={() => setHistoryOpen(v => !v)}
            className="w-full flex items-center justify-between px-3 py-2 border"
            style={{ background: '#0d0d12', borderColor: '#1a1a22', color: '#52525B' }}
          >
            <span className="font-pixel text-[8px] text-zinc-500">RECENT TRAINING</span>
            {historyOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <AnimatePresence>
            {historyOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <WorkoutHistory history={gameData.workoutHistory || []} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
};

export default Camp;
