import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Zap, Heart, Plus, Package, Coins, FlaskConical, Sword, Backpack, AlertTriangle, Shield, Gem } from 'lucide-react';
import { STAT_LABELS } from '../data/missions';
import { TIER_STYLES, SLOT_LABEL } from '../data/shop';
import AchievementsPanel from './AchievementsPanel';
import { sfx } from '../utils/sounds';

const SLOT_ICON = { weapon: Sword, armor: Shield, trinket: Gem };

const STAT_INFO = [
  { key: 'strength', Icon: Dumbbell, color: 'text-orange-400', desc: 'Raw power. Required for heavy combat missions.' },
  { key: 'agility', Icon: Zap, color: 'text-yellow-400', desc: 'Speed and precision. Required for swift missions.' },
  { key: 'endurance', Icon: Heart, color: 'text-red-400', desc: 'Stamina and resilience. Boosts max HP.' },
];

const HPRow = ({ hp, maxHP, potions, onUsePotion }) => {
  const pct = Math.max(0, Math.min(100, (hp / maxHP) * 100));
  const low = hp < maxHP * 0.4;
  const canDrink = potions > 0 && hp < maxHP;

  return (
    <div className="bg-[#18181B] border-2 border-[#3F3F46] p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Heart size={12} className={low ? 'text-red-400' : 'text-green-400'} />
          <span className="font-pixel text-[9px] text-zinc-300">HEALTH</span>
        </div>
        <span data-testid="hp-display" className={`font-pixel text-[10px] ${low ? 'text-red-400' : 'text-green-400'}`}>
          {hp}/{maxHP}
        </span>
      </div>
      <div className="h-5 bg-[#09090B] border-2 border-[#3F3F46] w-full overflow-hidden relative">
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full bg-gradient-to-r ${low ? 'from-red-800 to-red-500' : 'from-green-800 to-green-400'}`}
        />
        <span className="absolute inset-0 flex items-center justify-center font-pixel text-[8px] text-white/90">
          {Math.round(pct)}%
        </span>
      </div>
      <div className="flex items-center justify-between mt-2 gap-2">
        <p className="font-plex text-[10px] text-zinc-500 flex-1">
          Regen 10%/hr · Full heal at midnight.
        </p>
        <button
          data-testid="use-potion-btn"
          onClick={onUsePotion}
          disabled={!canDrink}
          className={`font-pixel text-[8px] px-2.5 py-1.5 border-2 transition-all flex items-center gap-1 ${
            canDrink
              ? 'bg-emerald-700 hover:bg-emerald-600 border-emerald-500 text-white active:translate-y-[1px]'
              : 'bg-[#27272A] border-[#3F3F46] text-zinc-600 cursor-not-allowed'
          }`}
        >
          <FlaskConical size={10} />
          POTION x{potions}
        </button>
      </div>
    </div>
  );
};

const StiffnessBanner = () => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-red-950/50 border-2 border-red-500/60 p-3 flex items-center gap-3 relative overflow-hidden"
  >
    <motion.div
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.6, repeat: Infinity }}
      className="absolute inset-0 bg-red-500/5 pointer-events-none"
    />
    <AlertTriangle size={20} className="text-red-400 flex-shrink-0 relative" />
    <div className="relative flex-1">
      <p data-testid="rusted-banner" className="font-pixel text-[10px] text-red-300 mb-0.5">RUSTED</p>
      <p className="font-plex text-[11px] text-red-200/80 leading-snug">
        Inactive for 48h+. <span className="text-red-300">-30% damage</span>, <span className="text-red-300">+30% taken</span>. Train to forge yourself back.
      </p>
    </div>
  </motion.div>
);

const Hero = ({ gameData, maxHP, isStiff, effectiveStats, onUpgradeStat, onUsePotion, onOpenBag }) => {
  const { name, characterClass, level, sp, stats, inventory, hp, gold, gear, streak, equippedGearIds } = gameData;
  const stiff = !!isStiff;
  const eff = effectiveStats || stats;

  const equipped = ['weapon', 'armor', 'trinket'].map(slot => {
    const id = equippedGearIds?.[slot];
    return { slot, item: id ? gear.find(g => g.id === id) : null };
  });
  const anyEquipped = equipped.some(e => e.item);

  return (
    <div className="bg-[#09090B] min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="bg-[#18181B] border-b-2 border-[#3F3F46] px-4 py-3 flex items-center justify-between">
        <span className="font-pixel text-[#FF4500] text-[11px]">VITALIS PACT</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#27272A] border-2 border-[#FF8C00]/50 px-2 py-1">
            <Coins size={10} className="text-[#FF8C00]" />
            <span data-testid="hero-gold-display" className="font-pixel text-[9px] text-[#FF8C00]">{gold}G</span>
          </div>
          <span className="font-pixel text-[9px] text-zinc-500">THE HERO</span>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-4">
        {/* Character summary */}
        <div className="bg-[#18181B] border-2 border-[#3F3F46] p-4 flex items-center justify-between">
          <div>
            <p className="font-pixel text-[8px] text-zinc-500 mb-1">{characterClass === 'warrior' ? 'WARRIOR' : 'ROGUE'}</p>
            <p className="font-pixel text-sm text-zinc-100">{name}</p>
            <p className="font-pixel text-[9px] text-zinc-400 mt-1">Level {level}</p>
            {streak?.current > 0 && (
              <p data-testid="streak-display" className="font-pixel text-[8px] text-[#FF8C00] mt-1">🔥 {streak.current}-day streak</p>
            )}
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

        {/* Stiffness Banner */}
        {stiff && <StiffnessBanner />}

        {/* HP bar + potion */}
        <HPRow hp={hp} maxHP={maxHP} potions={gameData.potions} onUsePotion={onUsePotion} />

        {/* OPEN BAG shortcut + SHARE */}
        <div>
          <button
            data-testid="open-bag-btn"
            onClick={onOpenBag}
            className="w-full bg-[#18181B] hover:bg-[#27272A] border-2 border-[#FF8C00]/40 hover:border-[#FF8C00] p-3 flex items-center justify-between transition-all active:translate-y-[1px]"
          >
            <div className="flex items-center gap-2">
              <Backpack size={16} className="text-[#FF8C00]" />
              <div className="text-left">
                <p className="font-pixel text-[9px] text-zinc-200">BAG</p>
                <p className="font-plex text-[9px] text-zinc-500">{gameData.potions} · {gear.length}</p>
              </div>
            </div>
            <span className="font-pixel text-[8px] text-[#FF8C00]">→</span>
          </button>
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
            {STAT_INFO.map(({ key, Icon, color, desc }, i) => {
              const base = stats[key];
              const effVal = eff[key];
              const bonus = effVal - base;
              return (
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
                  <div className="text-right">
                    <span data-testid={`stat-${key}-value`} className="font-pixel text-xl text-zinc-100">
                      {effVal}
                    </span>
                    {bonus > 0 && (
                      <p data-testid={`stat-${key}-bonus`} className="font-pixel text-[7px] text-emerald-300 leading-none">
                        {base} +{bonus}
                      </p>
                    )}
                  </div>
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
              );
            })}
          </div>
        </div>

        {/* Equipped Gear */}
        <div>
          <p className="font-pixel text-[9px] text-zinc-400 uppercase mb-3">Equipped</p>
          <div className="grid grid-cols-3 gap-2">
            {equipped.map(({ slot, item }) => {
              const SlotIcon = SLOT_ICON[slot] || Sword;
              if (!item) {
                return (
                  <div
                    key={slot}
                    data-testid={`equipped-${slot}-empty`}
                    className="bg-[#18181B] border-2 border-dashed border-[#3F3F46] p-2 text-center"
                  >
                    <SlotIcon size={16} className="text-zinc-700 mx-auto mb-1" />
                    <p className="font-pixel text-[7px] text-zinc-600">{SLOT_LABEL[slot]}</p>
                    <p className="font-pixel text-[7px] text-zinc-700 mt-0.5">empty</p>
                  </div>
                );
              }
              const t = TIER_STYLES[item.tier] || TIER_STYLES.I;
              return (
                <div
                  key={slot}
                  data-testid={`equipped-${slot}-slot`}
                  className={`bg-[#18181B] border-2 ${t.border} p-2 text-center`}
                >
                  <SlotIcon size={16} className={`${t.text} mx-auto mb-1`} />
                  <p className="font-pixel text-[7px] text-zinc-500">{SLOT_LABEL[slot]}</p>
                  <p className={`font-pixel text-[8px] ${t.text} truncate leading-tight mt-0.5`}>{item.name}</p>
                </div>
              );
            })}
          </div>
          {!anyEquipped && (
            <p className="font-plex text-[10px] text-zinc-600 mt-2 text-center">
              Open your Bag and equip gear for stat bonuses.
            </p>
          )}
        </div>

        {/* Achievements */}
        <AchievementsPanel gameData={gameData} />

        {/* Quest Relics (former trophies) */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Package size={14} className="text-zinc-400" />
            <p className="font-pixel text-[9px] text-zinc-400 uppercase">Quest Relics</p>
            <span className="font-pixel text-[8px] text-zinc-600">({inventory.length})</span>
          </div>
          {inventory.length === 0 ? (
            <div className="bg-[#18181B] border-2 border-[#3F3F46] border-dashed p-6 text-center">
              <p className="font-pixel text-[9px] text-zinc-600 leading-relaxed">
                No relics yet.
              </p>
              <p className="font-plex text-xs text-zinc-600 mt-2">
                Complete missions to collect rare relics.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {inventory.map((entry, i) => {
                const key = entry.id || `${entry.item}-${entry.from}-${entry.date}`;
                return (
                  <div
                    key={key}
                    data-testid={`inventory-item-${i}`}
                    className="bg-[#18181B] border-2 border-[#3F3F46] p-2.5"
                  >
                    <p className="font-pixel text-[8px] text-[#FF4500] leading-tight mb-1">{entry.item}</p>
                    <p className="font-plex text-[10px] text-zinc-500 leading-tight truncate">{entry.from}</p>
                    <p className="font-plex text-[10px] text-zinc-600 mt-0.5">{entry.date}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Gear quick view (shop/chest items) */}
        {gear && gear.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sword size={14} className="text-zinc-400" />
              <p className="font-pixel text-[9px] text-zinc-400 uppercase">Gear preview</p>
              <span className="font-pixel text-[8px] text-zinc-600">({gear.length})</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {gear.slice(0, 6).map((g) => {
                const t = TIER_STYLES[g.tier] || TIER_STYLES.I;
                return (
                  <div key={g.id} className={`bg-[#18181B] border-2 ${t.border} p-2.5`}>
                    <p className={`font-pixel text-[8px] ${t.text} leading-tight mb-1 truncate`}>{g.name}</p>
                    <p className="font-pixel text-[7px] text-zinc-500">{t.label}</p>
                  </div>
                );
              })}
            </div>
            {gear.length > 6 && (
              <p className="text-center font-pixel text-[8px] text-zinc-500 mt-2">+{gear.length - 6} more in Bag</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
