import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, XCircle, Lock, Sparkles, Flame, Crown, Sword,
  Clock, ChevronLeft, Swords, Package, Star
} from 'lucide-react';
import { ZONES, STAT_ABBR } from '../data/missions';
import { getActiveSpecialEvent, buildSpecialMission } from '../data/specialEvents';
import HeroSprite, { EnemySprite } from './HeroSprite';
import { sfx } from '../utils/sounds';

const SPECIAL_ICONS = { Sparkles, Flame, Crown, Sword };

// ─── Zone visual config (colors + SVG bg theme) ─────────────
const ZONE_THEME = {
  emberwood:  { primary: '#F97316', secondary: '#7C2D12', glow: '#F9731640', climate: '🌲', bg: 'from-orange-950 to-red-950' },
  ironpeak:   { primary: '#94A3B8', secondary: '#1E3A5F', glow: '#94A3B840', climate: '⛰', bg: 'from-slate-900 to-blue-950' },
  ashveil:    { primary: '#EAB308', secondary: '#713F12', glow: '#EAB30840', climate: '🏜', bg: 'from-yellow-950 to-amber-950' },
  frostbite:  { primary: '#67E8F9', secondary: '#0C4A6E', glow: '#67E8F940', climate: '❄', bg: 'from-cyan-950 to-sky-950' },
  caldera:    { primary: '#EF4444', secondary: '#450A0A', glow: '#EF444440', climate: '🌋', bg: 'from-red-950 to-rose-950' },
};

// ─── World map node positions (% of container) ──────────────
const MAP_NODES = [
  { id: 'emberwood', x: 22, y: 72 },
  { id: 'ironpeak',  x: 50, y: 48 },
  { id: 'ashveil',   x: 76, y: 68 },
  { id: 'frostbite', x: 68, y: 24 },
  { id: 'caldera',   x: 32, y: 22 },
];

// Path connections between nodes (pairs of zone ids)
const MAP_PATHS = [
  ['emberwood', 'ironpeak'],
  ['ironpeak',  'ashveil'],
  ['ironpeak',  'frostbite'],
  ['ironpeak',  'caldera'],
  ['caldera',   'frostbite'],
];

// ─── Countdown hook ──────────────────────────────────────────
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

// ─── SVG World Map ───────────────────────────────────────────
const WorldMap = ({ zones, level, characterClass, selectedZone, onSelectZone, heroPos }) => {
  const containerRef = useRef(null);

  const getNode = (id) => MAP_NODES.find(n => n.id === id);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{
        height: 280,
        background: 'linear-gradient(180deg, #060310 0%, #0a0618 40%, #0d0a10 100%)',
        borderBottom: '2px solid #1a1a22',
      }}
    >
      {/* Star field background */}
      {[...Array(40)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: i % 5 === 0 ? 2 : 1,
            height: i % 5 === 0 ? 2 : 1,
            left: `${(i * 37 + 11) % 100}%`,
            top: `${(i * 23 + 7) % 55}%`,
            opacity: 0.15 + (i % 4) * 0.1,
          }}
        />
      ))}

      {/* Terrain silhouettes */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 280"
        preserveAspectRatio="none"
        style={{ opacity: 0.18 }}
      >
        {/* Mountain range */}
        <polygon points="120,180 160,100 200,140 240,80 280,130 320,90 360,160 380,180" fill="#4B5563"/>
        {/* Forest hills */}
        <ellipse cx="80"  cy="210" rx="60" ry="40" fill="#166534"/>
        <ellipse cx="140" cy="220" rx="40" ry="30" fill="#166534"/>
        {/* Desert dunes */}
        <ellipse cx="310" cy="220" rx="70" ry="35" fill="#78350F"/>
        <ellipse cx="360" cy="230" rx="50" ry="25" fill="#92400E"/>
        {/* Tundra flat */}
        <rect x="230" y="190" width="100" height="30" fill="#0C4A6E" opacity="0.5"/>
        {/* Volcano */}
        <polygon points="110,180 140,100 170,180" fill="#7F1D1D"/>
        <polygon points="125,180 140,110 155,180" fill="#991B1B"/>
      </svg>

      {/* SVG paths between nodes */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {MAP_PATHS.map(([a, b]) => {
          const nodeA = getNode(a);
          const nodeB = getNode(b);
          const zoneA = zones.find(z => z.id === a);
          const zoneB = zones.find(z => z.id === b);
          const locked = level < (zoneA?.unlockLevel || 1) || level < (zoneB?.unlockLevel || 1);
          return (
            <line
              key={`${a}-${b}`}
              x1={nodeA.x} y1={nodeA.y}
              x2={nodeB.x} y2={nodeB.y}
              stroke={locked ? '#2a2a32' : '#FF450025'}
              strokeWidth="0.8"
              strokeDasharray={locked ? '2 2' : '3 1'}
            />
          );
        })}
      </svg>

      {/* Zone nodes */}
      {MAP_NODES.map(({ id, x, y }) => {
        const zone    = zones.find(z => z.id === id);
        const theme   = ZONE_THEME[id] || ZONE_THEME.emberwood;
        const locked  = level < (zone?.unlockLevel || 1);
        const active  = selectedZone?.id === id;
        const isHero  = heroPos === id;

        return (
          <motion.button
            key={id}
            onClick={() => { if (!locked) { sfx.click(); onSelectZone(zone); }}}
            className="absolute flex flex-col items-center"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            whileTap={locked ? {} : { scale: 0.9 }}
          >
            {/* Node circle */}
            <motion.div
              animate={active ? { scale: [1, 1.12, 1] } : {}}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="relative flex items-center justify-center rounded-full border-2"
              style={{
                width: 44,
                height: 44,
                background: locked
                  ? '#0d0d12'
                  : active
                    ? theme.primary + '30'
                    : '#0d0d1a',
                borderColor: locked ? '#2a2a32' : active ? theme.primary : theme.primary + '60',
                boxShadow: !locked ? `0 0 ${active ? 18 : 8}px ${theme.glow}` : 'none',
              }}
            >
              {locked
                ? <Lock size={14} className="text-zinc-700" />
                : <span style={{ fontSize: 18 }}>{theme.climate}</span>
              }

              {/* Hero marker */}
              {isHero && (
                <div className="absolute -top-1 -right-1">
                  <div
                    className="w-5 h-5 rounded-full border-2 border-yellow-400 flex items-center justify-center"
                    style={{ background: '#1a1400' }}
                  >
                    <Star size={9} className="text-yellow-400" fill="currentColor" />
                  </div>
                </div>
              )}

              {/* Active pulse ring */}
              {active && !locked && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2"
                  style={{ borderColor: theme.primary }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>

            {/* Label */}
            <div
              className="mt-1 px-1.5 py-0.5 text-center"
              style={{
                background: 'rgba(6,6,8,0.85)',
                border: `1px solid ${locked ? '#1a1a22' : theme.primary + '40'}`,
              }}
            >
              <p
                className="font-pixel"
                style={{
                  fontSize: '5.5px',
                  color: locked ? '#3F3F46' : active ? theme.primary : '#71717A',
                  lineHeight: 1.4,
                  whiteSpace: 'nowrap',
                }}
              >
                {zone?.name}
              </p>
              {locked && (
                <p className="font-pixel" style={{ fontSize: '5px', color: '#FF8C00' }}>
                  Lv{zone?.unlockLevel}
                </p>
              )}
            </div>
          </motion.button>
        );
      })}

      {/* Map title overlay */}
      <div className="absolute top-3 left-3">
        <p className="font-pixel text-[8px]" style={{ color: '#FF4500' }}>VITALIS WORLD</p>
      </div>
      <div className="absolute top-3 right-3 font-pixel text-[7px] text-zinc-600">
        LV {level}
      </div>
    </div>
  );
};

// ─── Mission card ────────────────────────────────────────────
const MissionCard = ({ mission, stats, characterClass, onAttempt }) => {
  const { stat, value } = mission.requirement;
  const canComplete = stats[stat] >= value;
  const [showLore, setShowLore] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="border overflow-hidden"
      style={{ borderColor: '#1a1a22', background: '#0a0a0e' }}
    >
      {/* Mission header */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-pixel text-[8px] text-zinc-100 leading-tight flex-1">
            {mission.name}
          </h4>
          <div
            className="flex items-center gap-1 flex-shrink-0 border px-1.5 py-0.5"
            style={
              canComplete
                ? { color: '#4ADE80', borderColor: 'rgba(74,222,128,0.4)', background: 'rgba(74,222,128,0.08)' }
                : { color: '#F87171', borderColor: 'rgba(248,113,113,0.4)', background: 'rgba(248,113,113,0.08)' }
            }
          >
            {canComplete ? <CheckCircle size={8} /> : <XCircle size={8} />}
            <span className="font-pixel text-[6px]">{STAT_ABBR[stat]} ≥ {value}</span>
          </div>
        </div>

        {/* Enemy preview row */}
        <div
          className="flex items-center gap-3 p-2 mb-2 border"
          style={{ background: '#060608', borderColor: '#1a1a22' }}
        >
          <EnemySprite enemyName={mission.enemy.name} tier={mission.enemy.tier} size={36} />
          <div className="flex-1 min-w-0">
            <p className="font-pixel text-[7px] text-zinc-300">{mission.enemy.name}</p>
            <p className="font-plex text-[9px] text-zinc-600 line-clamp-1">{mission.enemy.description}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-pixel text-[6px] text-zinc-600">TIER</p>
            <p
              className="font-pixel text-[10px]"
              style={{ color: mission.enemy.tier === 'III' ? '#EF4444' : mission.enemy.tier === 'II' ? '#94A3B8' : '#F97316' }}
            >
              {mission.enemy.tier}
            </p>
          </div>
        </div>

        {/* Lore toggle */}
        <button
          onClick={() => setShowLore(v => !v)}
          className="font-pixel text-[6px] text-zinc-600 hover:text-zinc-400 mb-2 transition-colors"
        >
          {showLore ? '▲ HIDE LORE' : '▼ READ LORE'}
        </button>

        <AnimatePresence>
          {showLore && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="font-plex text-[10px] text-zinc-500 italic leading-snug mb-2 overflow-hidden"
            >
              {mission.lore}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Package size={10} style={{ color: '#FF4500' }} />
            <span className="font-plex text-[10px] text-zinc-500">
              {mission.loot}
            </span>
          </div>
          <motion.button
            data-testid={`attempt-mission-${mission.id}`}
            onClick={() => { sfx.click(); onAttempt(mission); }}
            whileTap={{ scale: 0.95 }}
            className="font-pixel text-[8px] px-3 py-2 border flex items-center gap-1.5"
            style={
              canComplete
                ? {
                    background: 'linear-gradient(145deg, #FF6B35, #FF4500)',
                    borderColor: 'rgba(255,140,0,0.5)',
                    color: 'white',
                  }
                : {
                    background: '#0d0d12',
                    borderColor: '#1a1a22',
                    color: '#3F3F46',
                    cursor: 'not-allowed',
                  }
            }
          >
            <Swords size={10} />
            {canComplete ? 'FIGHT' : 'LOCKED'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Zone detail panel ───────────────────────────────────────
const ZonePanel = ({ zone, stats, level, characterClass, onAttempt, onBack }) => {
  const theme = ZONE_THEME[zone.id] || ZONE_THEME.emberwood;

  return (
    <motion.div
      key={zone.id}
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      className="absolute inset-0 flex flex-col overflow-y-auto"
      style={{ background: '#060608' }}
    >
      {/* Zone header */}
      <div
        className="flex-shrink-0 relative overflow-hidden"
        style={{ minHeight: 140 }}
      >
        {/* Gradient bg */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${theme.bg}`}
          style={{ opacity: 0.9 }}
        />
        {/* Pixel pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, ${theme.primary} 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />
        {/* Scanline */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.3) 3px, rgba(0,0,0,0.3) 4px)',
          }}
        />

        <div className="relative p-4">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 font-pixel text-[8px] mb-3 transition-colors"
            style={{ color: theme.primary }}
          >
            <ChevronLeft size={12} /> WORLD MAP
          </button>

          {/* Zone info */}
          <div className="flex items-end justify-between">
            <div>
              <span
                className="font-pixel text-[7px] uppercase mb-1 block"
                style={{ color: theme.primary }}
              >
                {zone.climate} ZONE
              </span>
              <h2 className="font-pixel text-xl text-zinc-100 leading-tight">{zone.name}</h2>
              <p className="font-plex text-xs text-zinc-400 mt-0.5">{zone.subtitle}</p>
            </div>
            <div
              className="text-4xl"
              style={{ filter: `drop-shadow(0 0 12px ${theme.primary})` }}
            >
              {theme.climate}
            </div>
          </div>

          {/* Lore */}
          <p
            className="font-plex text-[10px] mt-3 leading-relaxed"
            style={{ color: theme.primary + 'cc' }}
          >
            {zone.description}
          </p>
        </div>
      </div>

      {/* Missions */}
      <div className="flex-1 p-3 space-y-3" style={{ paddingBottom: '5rem' }}>
        <p className="font-pixel text-[8px] text-zinc-600">
          {zone.missions.length} MISSIONS
        </p>
        {zone.missions.map((mission, i) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <MissionCard
              mission={mission}
              stats={stats}
              characterClass={characterClass}
              onAttempt={onAttempt}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── Special event banner ────────────────────────────────────
const SpecialEventBanner = ({ stats, onAttempt }) => {
  const { event, expiresAt } = getActiveSpecialEvent();
  const countdown = useCountdown(expiresAt);
  const Icon = SPECIAL_ICONS[event.icon] || Sparkles;

  const handleAttempt = () => {
    const mission = buildSpecialMission(event, stats);
    onAttempt(mission);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mx-3 mt-3 border-2 ${event.accentBorder} relative overflow-hidden`}
      style={{ background: '#0a0a0e' }}
    >
      {/* Shine sweep */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-y-0 w-1/3 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
      />

      <div className="flex items-center gap-3 p-3">
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-10 h-10 flex items-center justify-center border ${event.accentBorder}`}
          style={{ background: '#060608' }}
        >
          <Icon size={20} className={event.accent} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`font-pixel text-[7px] ${event.accent}`}>⚡ SPECIAL EVENT</span>
            <div className="flex items-center gap-1">
              <Clock size={8} className="text-zinc-500" />
              <span data-testid="event-countdown" className="font-pixel text-[7px] text-zinc-500">
                {countdown}
              </span>
            </div>
          </div>
          <p className="font-pixel text-[9px] text-zinc-200 truncate">{event.name}</p>
          <p className="font-plex text-[9px] text-zinc-500 truncate">{event.subtitle}</p>
        </div>

        {/* CTA */}
        <motion.button
          data-testid={`attempt-event-${event.id}`}
          onClick={handleAttempt}
          whileTap={{ scale: 0.94 }}
          className={`flex-shrink-0 font-pixel text-[8px] px-3 py-2 border-2 ${event.accentBorder} text-white`}
          style={{ background: 'rgba(255,69,0,0.15)' }}
        >
          ENTER
        </motion.button>
      </div>
    </motion.div>
  );
};

// ─── Main Exploration screen ─────────────────────────────────
const Exploration = ({ gameData, onAttemptMission }) => {
  const { stats, level, characterClass } = gameData;
  const [selectedZone, setSelectedZone] = useState(null);
  // Track which zone the hero is "at" (last visited)
  const [heroPos, setHeroPos] = useState(() => {
    return localStorage.getItem('vp_hero_zone') || 'emberwood';
  });

  const handleSelectZone = (zone) => {
    setSelectedZone(zone);
    setHeroPos(zone.id);
    localStorage.setItem('vp_hero_zone', zone.id);
  };

  const handleAttempt = (mission) => {
    onAttemptMission(mission);
    setSelectedZone(null); // close panel — combat modal takes over
  };

  return (
    <div
      className="relative overflow-hidden flex flex-col"
      style={{ height: 'calc(100vh - 4rem)', background: '#060608' }}
    >
      {/* ─── World Map ─── */}
      <WorldMap
        zones={ZONES}
        level={level}
        characterClass={characterClass}
        selectedZone={selectedZone}
        onSelectZone={handleSelectZone}
        heroPos={heroPos}
      />

      {/* ─── Special Event Banner ─── */}
      <SpecialEventBanner stats={stats} onAttempt={onAttemptMission} />

      {/* ─── Zone list (compact) ─── */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: '5rem' }}
      >
        {!selectedZone && (
          <div className="p-3 space-y-2">
            <p className="font-pixel text-[8px] text-zinc-600 px-1 pt-1">ZONES</p>
            {ZONES.map((zone, i) => {
              const locked  = level < (zone.unlockLevel || 1);
              const theme   = ZONE_THEME[zone.id] || ZONE_THEME.emberwood;
              const isHere  = heroPos === zone.id;

              return (
                <motion.button
                  key={zone.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => { if (!locked) handleSelectZone(zone); }}
                  className="w-full flex items-center gap-3 p-3 border text-left transition-all"
                  style={
                    locked
                      ? { background: '#0a0a0e', borderColor: '#1a1a22', cursor: 'not-allowed' }
                      : isHere
                        ? { background: `${theme.primary}12`, borderColor: theme.primary + '60', boxShadow: `0 0 10px ${theme.glow}` }
                        : { background: '#0a0a0e', borderColor: '#1a1a22' }
                  }
                  data-testid={`zone-${zone.id}-toggle`}
                >
                  {/* Climate icon */}
                  <div
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center border text-xl"
                    style={{
                      borderColor: locked ? '#1a1a22' : theme.primary + '40',
                      background: locked ? '#060608' : theme.primary + '10',
                      filter: locked ? 'none' : `drop-shadow(0 0 6px ${theme.glow})`,
                    }}
                  >
                    {locked ? <Lock size={14} className="text-zinc-700" /> : theme.climate}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className="font-pixel text-[9px]"
                        style={{ color: locked ? '#3F3F46' : isHere ? theme.primary : '#A1A1AA' }}
                      >
                        {zone.name}
                      </p>
                      {isHere && !locked && (
                        <span
                          className="font-pixel text-[6px] px-1.5 py-0.5 border"
                          style={{ color: '#FFD700', borderColor: 'rgba(255,215,0,0.4)', background: 'rgba(255,215,0,0.08)' }}
                        >
                          ★ HERE
                        </span>
                      )}
                    </div>
                    <p className="font-plex text-[10px] text-zinc-600 truncate">{zone.subtitle}</p>
                    {locked && (
                      <p
                        className="font-pixel text-[7px] mt-0.5"
                        style={{ color: '#FF8C00' }}
                        data-testid={`zone-${zone.id}-locked`}
                      >
                        UNLOCKS LV {zone.unlockLevel}
                      </p>
                    )}
                  </div>

                  {/* Mission count / chevron */}
                  {!locked && (
                    <div className="flex-shrink-0 text-right">
                      <p className="font-pixel text-[7px] text-zinc-600">{zone.missions.length} missions</p>
                      <p className="font-pixel text-[10px] mt-0.5" style={{ color: theme.primary }}>→</p>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Zone Detail Panel (slides in from right) ─── */}
      <AnimatePresence>
        {selectedZone && (
          <ZonePanel
            zone={selectedZone}
            stats={stats}
            level={level}
            characterClass={characterClass}
            onAttempt={handleAttempt}
            onBack={() => setSelectedZone(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Exploration;
