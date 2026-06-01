import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react';
import { ZONES, STAT_ABBR } from '../data/missions';

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
          {canComplete
            ? <CheckCircle size={9} />
            : <XCircle size={9} />
          }
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

const ZoneCard = ({ zone, stats, onAttempt }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-2 border-[#3F3F46] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)]">
      {/* Zone Header */}
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

      {/* Missions */}
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

const Exploration = ({ gameData, onAttemptMission }) => {
  return (
    <div className="bg-[#09090B] min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-[#18181B] border-b-2 border-[#3F3F46] px-4 py-3 flex items-center justify-between">
        <span className="font-pixel text-[#FF4500] text-[11px]">FITNESS QUEST</span>
        <span className="font-pixel text-[9px] text-zinc-500">EXPLORATION</span>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Instructions */}
        <div className="bg-[#18181B] border-2 border-[#3F3F46] p-3">
          <p className="font-pixel text-[9px] text-zinc-300 leading-loose">
            Select a zone to view missions.
          </p>
          <p className="font-plex text-xs text-zinc-500 mt-1">
            Meet stat requirements to succeed. Train in the real world to grow stronger.
          </p>
        </div>

        {/* Zone Cards */}
        {ZONES.map((zone, i) => (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <ZoneCard
              zone={zone}
              stats={gameData.stats}
              onAttempt={onAttemptMission}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Exploration;
