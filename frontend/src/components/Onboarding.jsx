import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSprite from './HeroSprite';

const CLASSES = [
  {
    id: 'warrior',
    label: 'WARRIOR',
    subtitle: 'Iron & Blood',
    bonus: '+20% XP on Strength',
    desc: 'Master of brute force. Crushes iron and stone with sheer will.',
    color: '#F97316',
    stats: { STR: 3, AGI: 1, END: 2 },
  },
  {
    id: 'rogue',
    label: 'ROGUE',
    subtitle: 'Shadow & Speed',
    bonus: '+20% XP on Cardio',
    desc: 'Swift as shadow. Endures where others fall. Born for the long run.',
    color: '#A78BFA',
    stats: { STR: 1, AGI: 3, END: 2 },
  },
  {
    id: 'mage',
    label: 'MAGE',
    subtitle: 'Mind & Magic',
    bonus: '+20% XP on Flexibility',
    desc: 'Commands arcane forces. Turns discipline of mind into power.',
    color: '#60A5FA',
    stats: { STR: 1, AGI: 2, END: 3 },
  },
  {
    id: 'ranger',
    label: 'RANGER',
    subtitle: 'Wild & Free',
    bonus: '+20% XP on Outdoor',
    desc: 'One with nature. Endurance beyond measure, eyes like a hawk.',
    color: '#4ADE80',
    stats: { STR: 2, AGI: 2, END: 2 },
  },
];

const Onboarding = ({ onComplete }) => {
  const [step, setStep]                   = useState(0); // 0=title, 1=name, 2=class
  const [name, setName]                   = useState('');
  const [characterClass, setClass]        = useState('');
  const [error, setError]                 = useState('');
  const [selectedPreview, setPreview]     = useState(null);

  const selected = CLASSES.find(c => c.id === characterClass);

  const handleNameNext = () => {
    if (!name.trim()) { setError('Enter your hero name.'); return; }
    setError('');
    setStep(2);
  };

  const handleComplete = () => {
    if (!characterClass) { setError('Choose your class.'); return; }
    onComplete(name.trim(), characterClass);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: '#060608' }}
    >
      {/* Pixel grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `linear-gradient(#FF4500 1px, transparent 1px), linear-gradient(90deg, #FF4500 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="w-full max-w-md relative z-10">
        <AnimatePresence mode="wait">

          {/* ─── Step 0: Title Screen ─── */}
          {step === 0 && (
            <motion.div
              key="title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="text-center"
            >
              {/* Logo */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-2"
              >
                <div
                  className="inline-block px-4 py-1 mb-4 border"
                  style={{ borderColor: 'rgba(255,69,0,0.4)', color: '#FF4500' }}
                >
                  <span className="font-pixel text-[9px]">SEASON I</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="mb-6"
              >
                <h1
                  className="font-pixel leading-tight"
                  style={{ fontSize: '28px', color: '#FF4500', textShadow: '0 0 30px rgba(255,69,0,0.5)' }}
                >
                  VITALIS
                </h1>
                <h1
                  className="font-pixel leading-tight"
                  style={{ fontSize: '28px', color: '#f4f4f5' }}
                >
                  PACT
                </h1>
              </motion.div>

              {/* Hero sprites preview row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex justify-center gap-6 mb-8"
              >
                {CLASSES.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div
                      className="p-1 border"
                      style={{
                        borderColor: `${c.color}30`,
                        background: `${c.color}08`,
                        filter: `drop-shadow(0 4px 12px ${c.color}30)`,
                      }}
                    >
                      <HeroSprite characterClass={c.id} size={40} animate />
                    </div>
                    <span className="font-pixel text-[5px]" style={{ color: c.color }}>
                      {c.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="font-plex text-sm text-zinc-400 mb-8 leading-relaxed"
              >
                Your real-world effort earns in-game power.<br />
                Train hard. Level up. Conquer.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep(1)}
                className="w-full font-pixel text-sm py-5 border-2 uppercase"
                style={{
                  background: 'linear-gradient(145deg, #FF6B35, #FF4500)',
                  borderColor: 'rgba(255,140,0,0.6)',
                  color: 'white',
                  boxShadow: '0 4px 24px rgba(255,69,0,0.4)',
                }}
              >
                BEGIN YOUR PACT
              </motion.button>
            </motion.div>
          )}

          {/* ─── Step 1: Name ─── */}
          {step === 1 && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <button
                onClick={() => setStep(0)}
                className="font-pixel text-[8px] text-zinc-600 mb-6 hover:text-zinc-400 transition-colors"
              >
                ← BACK
              </button>

              <div className="mb-8">
                <h2 className="font-pixel text-base text-zinc-100 mb-2">HERO NAME</h2>
                <p className="font-plex text-sm text-zinc-500">What shall legends call you?</p>
              </div>

              <input
                data-testid="hero-name-input"
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleNameNext()}
                placeholder="Enter your name..."
                maxLength={20}
                autoFocus
                className="w-full font-pixel text-lg px-4 py-4 border-2 outline-none placeholder-zinc-700 mb-2 transition-all"
                style={{
                  background: '#0d0d12',
                  borderColor: name ? 'rgba(255,69,0,0.6)' : '#1a1a22',
                  color: '#f4f4f5',
                }}
              />

              {error && (
                <p className="font-plex text-xs text-red-400 mb-4">{error}</p>
              )}

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleNameNext}
                disabled={!name.trim()}
                className="w-full font-pixel text-sm py-4 border-2 mt-4 uppercase transition-all"
                style={
                  name.trim()
                    ? {
                        background: 'linear-gradient(145deg, #FF6B35, #FF4500)',
                        borderColor: 'rgba(255,140,0,0.6)',
                        color: 'white',
                        boxShadow: '0 4px 16px rgba(255,69,0,0.35)',
                      }
                    : { background: '#0d0d12', borderColor: '#1a1a22', color: '#3F3F46' }
                }
              >
                NEXT →
              </motion.button>
            </motion.div>
          )}

          {/* ─── Step 2: Class ─── */}
          {step === 2 && (
            <motion.div
              key="class"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <button
                onClick={() => setStep(1)}
                className="font-pixel text-[8px] text-zinc-600 mb-4 hover:text-zinc-400 transition-colors"
              >
                ← BACK
              </button>

              <div className="mb-4">
                <h2 className="font-pixel text-sm text-zinc-100 mb-1">
                  CHOOSE YOUR CLASS
                </h2>
                <p className="font-plex text-xs text-zinc-500">
                  Your class determines your bonus XP for your preferred activity.
                </p>
              </div>

              {/* Class cards */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {CLASSES.map(c => {
                  const isSelected = characterClass === c.id;
                  return (
                    <motion.button
                      key={c.id}
                      data-testid={`class-${c.id}-btn`}
                      onClick={() => { setClass(c.id); setPreview(c.id); setError(''); }}
                      whileTap={{ scale: 0.97 }}
                      className="text-left p-3 border-2 transition-all relative overflow-hidden"
                      style={
                        isSelected
                          ? {
                              borderColor: c.color,
                              background: `${c.color}12`,
                              boxShadow: `0 0 16px ${c.color}25`,
                            }
                          : { borderColor: '#1a1a22', background: '#0d0d12' }
                      }
                    >
                      {isSelected && (
                        <div
                          className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                          style={{ background: c.color }}
                        />
                      )}
                      <div className="flex flex-col items-center mb-2">
                        <HeroSprite characterClass={c.id} size={44} animate={isSelected} />
                      </div>
                      <p
                        className="font-pixel text-[8px] mb-0.5"
                        style={{ color: isSelected ? c.color : '#71717A' }}
                      >
                        {c.label}
                      </p>
                      <p className="font-plex text-[9px] text-zinc-600">{c.subtitle}</p>
                    </motion.button>
                  );
                })}
              </div>

              {/* Selected class detail */}
              <AnimatePresence>
                {selected && (
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="p-3 border mb-4"
                    style={{
                      background: `${selected.color}08`,
                      borderColor: `${selected.color}30`,
                    }}
                  >
                    <p className="font-pixel text-[8px] mb-1" style={{ color: selected.color }}>
                      {selected.label} — {selected.subtitle}
                    </p>
                    <p className="font-plex text-xs text-zinc-400 mb-2">{selected.desc}</p>
                    <div className="flex items-center gap-3">
                      {Object.entries(selected.stats).map(([stat, val]) => (
                        <div key={stat} className="text-center">
                          <p className="font-pixel text-[7px] text-zinc-600">{stat}</p>
                          <p className="font-pixel text-sm" style={{ color: selected.color }}>{val}</p>
                        </div>
                      ))}
                      <div
                        className="ml-auto font-pixel text-[7px] px-2 py-1 border"
                        style={{ color: selected.color, borderColor: `${selected.color}40` }}
                      >
                        {selected.bonus}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && <p className="font-plex text-xs text-red-400 mb-3">{error}</p>}

              <motion.button
                data-testid="start-game-btn"
                whileTap={{ scale: 0.97 }}
                onClick={handleComplete}
                disabled={!characterClass}
                className="w-full font-pixel text-sm py-5 border-2 uppercase transition-all"
                style={
                  characterClass
                    ? {
                        background: `linear-gradient(145deg, ${selected?.color || '#FF4500'}, ${selected?.color || '#FF4500'}cc)`,
                        borderColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        boxShadow: `0 4px 24px ${selected?.color || '#FF4500'}40`,
                      }
                    : { background: '#0d0d12', borderColor: '#1a1a22', color: '#3F3F46' }
                }
              >
                {characterClass ? `FORGE ${name.toUpperCase()} THE ${selected?.label}` : 'SELECT A CLASS'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
