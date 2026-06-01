import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Zap, Heart, Plus, Package } from 'lucide-react';
import { STAT_LABELS } from '../data/missions';

const STAT_INFO = [
  { key: 'strength', Icon: Dumbbell, color: 'text-orange-400', desc: 'Raw power. Required for heavy combat missions.' },
  { key: 'agility', Icon: Zap, color: 'text-yellow-400', desc: 'Speed and precision. Required for swift missions.' },
  { key: 'endurance', Icon: Heart, color: 'text-red-400', desc: 'Stamina and resilience. Required for grueling missions.' },
];

const Hero = ({ gameData, onUpgradeStat }) => {
  const { name, characterClass, level, sp, stats, inventory } = gameData;

  return (
    <div className="bg-[#09090B] min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="bg-[#18181B] border-b-2 border-[#3F3F46] px-4 py-3 flex items-center justify-between">
        <span className="font-pixel text-[#FF4500] text-[11px]">FITNESS QUEST</span>
        <span className="font-pixel text-[9px] text-zinc-500">THE HERO</span>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-4">
        {/* Character summary */}
        <div className="bg-[#18181B] border-2 border-[#3F3F46] p-4 flex items-center justify-between">
          <div>
            <p className="font-pixel text-[8px] text-zinc-500 mb-1">{characterClass === 'warrior' ? 'WARRIOR' : 'ROGUE'}</p>
            <p className="font-pixel text-sm text-zinc-100">{name}</p>
            <p className="font-pixel text-[9px] text-zinc-400 mt-1">Level {level}</p>
          </div>
          <div className="text-right">
            <p className="font-pixel text-[8px] text-zinc-500 mb-0.5">SKILL PTS</p>
            <p
              data-testid="sp-counter"
              className={`font-pixel text-3xl leading-none ${sp > 0 ? 'text-[#FF4500] animate-pulse-glow' : 'text-zinc-600'}`}
            >
              {sp}
            </p>
          </div>
        </div>

        {/* SP instructions */}
        {sp > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FF4500]/10 border-2 border-[#FF4500]/40 p-3"
          >
            <p className="font-pixel text-[9px] text-[#FF4500] leading-relaxed">
              You have {sp} Skill {sp === 1 ? 'Point' : 'Points'} to spend!
            </p>
            <p className="font-plex text-xs text-zinc-400 mt-1">
              Tap + to upgrade a stat and unlock stronger missions.
            </p>
          </motion.div>
        )}

        {/* Stats Upgrade */}
        <div>
          <p className="font-pixel text-[9px] text-zinc-400 uppercase mb-3">Attributes</p>
          <div className="space-y-2">
            {STAT_INFO.map(({ key, Icon, color, desc }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-[#18181B] border-2 border-[#3F3F46] p-3 flex items-center gap-3"
              >
                <Icon size={20} className={color} />
                <div className="flex-1 min-w-0">
                  <p className="font-pixel text-[10px] text-zinc-100">{STAT_LABELS[key]}</p>
                  <p className="font-plex text-[10px] text-zinc-500 leading-tight mt-0.5">{desc}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span data-testid={`stat-${key}-value`} className="font-pixel text-xl text-zinc-100 w-6 text-center">
                    {stats[key]}
                  </span>
                  <button
                    data-testid={`upgrade-${key}-btn`}
                    onClick={() => onUpgradeStat(key)}
                    disabled={sp === 0}
                    className={`w-9 h-9 border-2 flex items-center justify-center font-pixel text-sm transition-all ${
                      sp > 0
                        ? 'border-[#FF4500] text-[#FF4500] bg-[#FF4500]/10 hover:bg-[#FF4500]/20 active:scale-90'
                        : 'border-[#3F3F46] text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Inventory */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Package size={14} className="text-zinc-400" />
            <p className="font-pixel text-[9px] text-zinc-400 uppercase">Inventory</p>
            <span className="font-pixel text-[8px] text-zinc-600">({inventory.length})</span>
          </div>
          {inventory.length === 0 ? (
            <div className="bg-[#18181B] border-2 border-[#3F3F46] border-dashed p-6 text-center">
              <p className="font-pixel text-[9px] text-zinc-600 leading-relaxed">
                No loot yet.
              </p>
              <p className="font-plex text-xs text-zinc-600 mt-2">
                Complete missions to collect items.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {inventory.map((entry, i) => (
                <div
                  key={i}
                  data-testid={`inventory-item-${i}`}
                  className="bg-[#18181B] border-2 border-[#3F3F46] p-2.5"
                >
                  <p className="font-pixel text-[8px] text-[#FF4500] leading-tight mb-1">{entry.item}</p>
                  <p className="font-plex text-[10px] text-zinc-500 leading-tight truncate">{entry.from}</p>
                  <p className="font-plex text-[10px] text-zinc-600 mt-0.5">{entry.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
