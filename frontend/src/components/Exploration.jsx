import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Lock, Sparkles, Flame, Crown, Sword, Clock } from 'lucide-react';
import { ZONES, STAT_ABBR } from '../data/missions';
import { getActiveSpecialEvent, buildSpecialMission } from '../data/specialEvents';

const SPECIAL_ICONS = { Sparkles, Flame, Crown, Sword };

const MissionCard = ({ mission, stats, onAttempt }) => {
  const { stat, value } = mission.requirement;
  const canComplete = stats[stat] >= value;

  return (
    <div className="bg-[#27272A] border border-[#3F3F46] p-3">
      <div className="flex justify-between items-start mb-2 gap-2">
        <h4 className="font-pixel text-[9px] text-zinc-100 leading-tight flex-1">
          {mission.name}
        </h4>
        <div className={`flex items-center gap-1 flex-shrink-0 border px-1.5 py-0.5 ${
          canComplete
            ? 'text-green-400 border-green-500/40 bg-green-500/10'
            : 'text-red-400 border-red-500/40 bg-red-500/10'
        }`}>
          {canComplete ? <CheckCircle size={9} /> : <XCircle size={9} />}
          <span className="font-pixel text-[7px]">
            {STAT_ABBR[stat]} {'>='} {value}
          </span>
        </div>
      </div>
      <p className="font-plex text-xs text-zinc-400 mb-3 line-clamp-2 leading-snug">
        {mission.lore}
      </p>
      <div className="flex items-center justify-between">
        <span className="font-plex text-[10px] text-zinc-500">
          Loot: <span className="text-[#FF4500]">{mission.loot}</span>
        </span>
        <button
          data-testid={`attempt-mission-${mission.id}`}
          onClick={() => onAttempt(mission)}
          className="font-pixel text-[8px] bg-[#FF4500] hover:bg-[#DC2626] text-white px-3 py-2 border border-[#FF8C00] active:translate-y-[1px] transition-all"
        >
          ATTEMPT
        </button>
      </div>
    </div>
  );
};

const LockedZoneCard = ({ zone }) => (
  <div className="border-2 border-[#3F3F46] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] relative overflow-hidden">
    <div
      className="relative h-36 bg-cover bg-center grayscale opacity-50"
      style={{ backgroundImage: `url(${zone.image})` }}
    />
    <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-center px-4">
      <Lock size={22} className="text-zinc-400 mb-2" />
      <p className="font-pixel text-[10px] text-zinc-200 mb-1">{zone.name}</p>
      <p className="font-plex text-xs text-zinc-400 mb-2">{zone.subtitle}</p>
      <span data-testid={`zone-${zone.id}-locked`} className="font-pixel text-[8px] border border-[#FF8C00]/60 text-[#FF8C00] bg-[#FF8C00]/10 px-2 py-1">
        UNLOCKS AT LEVEL {zone.unlockLevel}
      </span>
    </div>
  </div>
);

const ZoneCard = ({ zone, stats, onAttempt }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-2 border-[#3F3F46] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)]">
      <button
        data-testid={`zone-${zone.id}-toggle`}
        onClick={() => setOpen(v => !v)}
        className="w-full text-left"
      >
        <div
          className="relative h-36 bg-cover bg-center"
          style={{ backgroundImage: `url(${zone.image})` }}
        >
          <div className="absolute inset-0 bg-black/65" />
          <div className="absolute inset-0 p-4 flex flex-col justify-end">
            <span className="font-pixel text-[8px] text-[#FF4500] uppercase mb-0.5">{zone.climate}</span>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-pixel text-base text-zinc-100 leading-tight">{zone.name}</h2>
                <p className="font-plex text-xs text-zinc-400 mt-0.5">{zone.subtitle}</p>
              </div>
              <div className="bg-[#09090B]/70 border border-[#3F3F46] p-1.5">
                {open ? <ChevronUp size={16} className="text-zinc-300" /> : <ChevronDown size={16} className="text-zinc-300" />}
              </div>
            </div>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden bg-[#18181B]"
          >
            <div className="p-3 space-y-3 border-t-2 border-[#3F3F46]">
              <p className="font-plex text-xs text-zinc-400 italic leading-snug">{zone.description}</p>
              {zone.missions.map(mission => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  stats={stats}
                  onAttempt={onAttempt}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Countdown for the active event
const useCountdown = (expiresAt) => {
  const [ms, setMs] = useState(expiresAt - Date.now());
  useEffect(() => {
    const id = setInterval(() => setMs(expiresAt - Date.now()), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);
  if (ms <= 0) return '00:00:00';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
};

const SpecialEventCard = ({ stats, onAttempt }) => {
  const { event, expiresAt } = getActiveSpecialEvent();
  const countdown = useCountdown(expiresAt);
  const Icon = SPECIAL_ICONS[event.icon] || Sparkles;

  const handleAttempt = () => {
    const mission = buildSpecialMission(event, stats);
    onAttempt(mission);
  };

  return (
    <div className={`border-2 ${event.accentBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] overflow-hidden relative`}>
      {/* Shine sweep */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/8 to-transparent pointer-events-none z-20"
      />

      <div className={`relative h-40 bg-gradient-to-br ${event.gradient}`}>
        <div className="absolute inset-0 p-4 flex flex-col">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <span className={`font-pixel text-[8px] ${event.accent} border ${event.accentBorder} px-1.5 py-0.5 uppercase tracking-wider`}>
              ⚡ SPECIAL EVENT
            </span>
            <div className="bg-black/50 border border-white/20 px-2 py-0.5 flex items-center gap-1">
              <Clock size={10} className="text-white/70" />
              <span data-testid="event-countdown" className="font-pixel text-[8px] text-white/90">{countdown}</span>
            </div>
          </div>

          {/* Center icon */}
          <div className="flex-1 flex items-center justify-center">
            <Icon size={48} className={`${event.accent} drop-shadow-[0_0_8px_currentColor]`} />
          </div>

          {/* Bottom */}
          <div>
            <p className={`font-pixel text-[9px] ${event.accent} uppercase`}>{event.climate}</p>
            <h2 className="font-pixel text-base text-zinc-100 leading-tight">{event.name}</h2>
            <p className="font-plex text-xs text-zinc-300 mt-0.5">{event.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="p-3 bg-[#0a0a0d] border-t-2 border-[#3F3F46] space-y-3">
        <p className="font-plex text-xs text-zinc-400 italic leading-snug">{event.lore}</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#18181B] border border-[#3F3F46] p-2 text-center">
            <p className="font-pixel text-[6px] text-zinc-500 mb-0.5">SCALING</p>
            <p className={`font-pixel text-[9px] ${event.accent}`}>+20%</p>
          </div>
          <div className="bg-[#18181B] border border-[#3F3F46] p-2 text-center">
            <p className="font-pixel text-[6px] text-zinc-500 mb-0.5">GOLD</p>
            <p className="font-pixel text-[9px] text-[#FF8C00]">{event.rewardGold.min}-{event.rewardGold.max}</p>
          </div>
          <div className="bg-[#18181B] border border-[#3F3F46] p-2 text-center">
            <p className="font-pixel text-[6px] text-zinc-500 mb-0.5">DROP</p>
            <p className="font-pixel text-[9px] text-zinc-200">EPIC</p>
          </div>
        </div>
        <button
          data-testid={`attempt-event-${event.id}`}
          onClick={handleAttempt}
          className={`w-full font-pixel text-[10px] py-3 border-2 text-white transition-all ${event.accentBorder} bg-gradient-to-r ${event.gradient} hover:brightness-125 shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.4),_3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[1px]`}
        >
          ENTER THE EVENT
        </button>
      </div>
    </div>
  );
};

const Exploration = ({ gameData, onAttemptMission }) => {
  const { stats, level } = gameData;

  return (
    <div className="bg-[#09090B] min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="bg-[#18181B] border-b-2 border-[#3F3F46] px-4 py-3 flex items-center justify-between">
        <span className="font-pixel text-[#FF4500] text-[11px]">FITNESS QUEST</span>
        <span className="font-pixel text-[9px] text-zinc-500">EXPLORATION</span>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-4">
        {/* SPECIAL EVENTS — always at top */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <SpecialEventCard stats={stats} onAttempt={onAttemptMission} />
        </motion.div>

        {/* Instructions */}
        <div className="bg-[#18181B] border-2 border-[#3F3F46] p-3">
          <p className="font-pixel text-[9px] text-zinc-300 leading-loose">
            Select a zone to view missions.
          </p>
          <p className="font-plex text-xs text-zinc-500 mt-1">
            Meet stat requirements to succeed. Locked zones unlock as you level up.
          </p>
        </div>

        {/* Zone Cards */}
        {ZONES.map((zone, i) => {
          const locked = level < (zone.unlockLevel || 1);
          return (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              {locked
                ? <LockedZoneCard zone={zone} />
                : <ZoneCard zone={zone} stats={stats} onAttempt={onAttemptMission} />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Exploration;
