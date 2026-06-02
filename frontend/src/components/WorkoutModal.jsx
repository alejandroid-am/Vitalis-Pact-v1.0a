import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Timer, Dumbbell, Wind, Flame, AlertTriangle, Clock,
  Bike, Waves, PersonStanding, Mountain, Volleyball
} from 'lucide-react';

const SESSION_LIMIT = 120;
const DAILY_LIMIT   = 240;

const PRESETS = [15, 20, 30, 45, 60, 90];

const ACTIVITIES = [
  { id: 'cardio',    label: 'CARDIO',    type: 'cardio',    Icon: Wind,           color: '#60A5FA', desc: 'Run · Swim · Bike' },
  { id: 'strength',  label: 'STRENGTH',  type: 'strength',  Icon: Dumbbell,       color: '#F97316', desc: 'Weights · Push-ups' },
  { id: 'cycling',   label: 'CYCLING',   type: 'cardio',    Icon: Bike,           color: '#34D399', desc: 'Road · Indoor' },
  { id: 'swimming',  label: 'SWIMMING',  type: 'cardio',    Icon: Waves,          color: '#38BDF8', desc: 'Pool · Open water' },
  { id: 'sport',     label: 'SPORT',     type: 'agility',   Icon: Volleyball,     color: '#A78BFA', desc: 'Team · Racket' },
  { id: 'hiking',    label: 'HIKING',    type: 'endurance', Icon: Mountain,       color: '#4ADE80', desc: 'Trail · Outdoors' },
  { id: 'yoga',      label: 'YOGA',      type: 'endurance', Icon: PersonStanding, color: '#F472B6', desc: 'Flow · Stretch' },
  { id: 'other',     label: 'OTHER',     type: 'cardio',    Icon: Flame,          color: '#FF4500', desc: 'Any movement!' },
];

const WorkoutModal = ({ characterClass, getDailyMinutes, onClose, onSubmit }) => {
  const [minutes, setMinutes]       = useState('');
  const [activityId, setActivityId] = useState('');
  const [error, setError]           = useState('');
  const [showAll, setShowAll]       = useState(false);

  const dailyUsed      = getDailyMinutes();
  const dailyRemaining = Math.max(0, DAILY_LIMIT - dailyUsed);
  const parsedMin      = parseInt(minutes, 10);
  const selected       = ACTIVITIES.find(a => a.id === activityId);
  const activityType   = selected?.type || '';

  const validInput = !isNaN(parsedMin) && parsedMin > 0 && activityId;
  const baseXP     = validInput ? parsedMin * 3 : 0;
  const isBonus    =
    (characterClass === 'warrior' && activityType === 'strength') ||
    (characterClass === 'rogue'   && activityType === 'cardio')   ||
    (characterClass === 'mage'    && activityType === 'endurance') ||
    (characterClass === 'ranger'  && activityType === 'endurance');
  const xpGained   = isBonus ? Math.round(baseXP * 1.2) : baseXP;

  const visibleActivities = showAll ? ACTIVITIES : ACTIVITIES.slice(0, 4);

  const handlePreset = (min) => { setMinutes(String(min)); setError(''); };

  const handleSubmit = () => {
    if (!minutes || isNaN(parsedMin) || parsedMin <= 0) { setError('Enter a valid number of minutes.'); return; }
    if (parsedMin > SESSION_LIMIT) { setError(`Max ${SESSION_LIMIT} min per session.`); return; }
    if (dailyRemaining <= 0) { setError('Daily limit reached. Return at dawn.'); return; }
    if (parsedMin > dailyRemaining) { setError(`Only ${dailyRemaining} min left today.`); return; }
    if (!activityId) { setError('Choose an activity type.'); return; }
    onSubmit(parsedMin, activityType);
  };

  return (
    <div
      data-testid="workout-modal-overlay"
      className="fixed inset-0 flex items-end justify-center"
      /* z-[10100] — above BottomNav (10000), below LevelUp (10200) */
      style={{ zIndex: 10100, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0.8 }}
        animate={{ y: 0,      opacity: 1 }}
        exit={{   y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
        className="w-full max-w-md border-t-2 flex flex-col"
        style={{
          background: '#0a0a0e',
          borderColor: 'rgba(255,69,0,0.35)',
          /* Fixed height so content scrolls, button stays visible */
          maxHeight: '88vh',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-[#2a2a32]" />
        </div>

        {/* Scrollable content area — leaves room for the fixed button */}
        <div
          className="flex-1 overflow-y-auto px-4 pb-2"
          style={{ overscrollBehavior: 'contain' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pt-1">
            <h2 className="font-pixel text-[11px] text-zinc-100">LOG WORKOUT</h2>
            <button data-testid="close-workout-modal" onClick={onClose}>
              <X size={18} className="text-zinc-500 hover:text-zinc-300" />
            </button>
          </div>

          {/* Daily progress */}
          <div className="mb-4 p-3 border" style={{ background: '#0d0d12', borderColor: '#1a1a22' }}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Clock size={10} className="text-zinc-500" />
                <span className="font-pixel text-[7px] text-zinc-500">TODAY'S TRAINING</span>
              </div>
              <span className="font-pixel text-[7px] text-zinc-500">{dailyUsed}/{DAILY_LIMIT} min</span>
            </div>
            <div className="h-2 w-full overflow-hidden" style={{ background: '#1a1a22' }}>
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (dailyUsed / DAILY_LIMIT) * 100)}%`,
                  background: dailyUsed >= DAILY_LIMIT ? '#EF4444' : dailyUsed >= DAILY_LIMIT * 0.75 ? '#F97316' : '#FF4500',
                }}
              />
            </div>
            <p className="font-plex text-[10px] text-zinc-600 mt-1">
              {dailyRemaining > 0 ? `${dailyRemaining} min remaining` : 'Daily limit reached — rest up!'}
            </p>
          </div>

          {/* Activity selector */}
          <div className="mb-4">
            <label className="font-pixel text-[8px] text-zinc-500 block mb-2">ACTIVITY TYPE</label>
            <div className="grid grid-cols-2 gap-2">
              {visibleActivities.map(act => {
                const isSel = activityId === act.id;
                return (
                  <button
                    key={act.id}
                    data-testid={`activity-${act.id}-btn`}
                    onClick={() => { setActivityId(act.id); setError(''); }}
                    className="flex items-center gap-2 px-3 py-2.5 border transition-all text-left"
                    style={
                      isSel
                        ? { background: `${act.color}15`, borderColor: act.color, boxShadow: `0 0 10px ${act.color}25` }
                        : { background: '#0d0d12', borderColor: '#1a1a22' }
                    }
                  >
                    <act.Icon size={16} style={{ color: isSel ? act.color : '#52525B', flexShrink: 0 }} />
                    <div>
                      <p className="font-pixel text-[8px]" style={{ color: isSel ? act.color : '#71717A' }}>{act.label}</p>
                      <p className="font-plex text-[9px] text-zinc-600">{act.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowAll(v => !v)}
              className="mt-2 w-full font-pixel text-[7px] text-zinc-600 hover:text-zinc-400 py-1 transition-colors"
            >
              {showAll ? '▲ SHOW LESS' : '▼ MORE ACTIVITIES'}
            </button>
          </div>

          {/* Duration */}
          <div className="mb-4">
            <label className="font-pixel text-[8px] text-zinc-500 flex items-center gap-1.5 mb-2">
              <Timer size={10} /> DURATION
            </label>
            <div className="grid grid-cols-6 gap-1.5 mb-3">
              {PRESETS.map(min => (
                <button
                  key={min}
                  onClick={() => handlePreset(min)}
                  className="preset-btn font-pixel text-[8px] py-2 border transition-all"
                  style={
                    parseInt(minutes) === min
                      ? { background: 'rgba(255,69,0,0.15)', borderColor: '#FF4500', color: '#FF4500' }
                      : { background: '#0d0d12', borderColor: '#1a1a22', color: '#71717A' }
                  }
                >
                  {min}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                data-testid="workout-minutes-input"
                type="number"
                min="1"
                max={SESSION_LIMIT}
                value={minutes}
                onChange={e => { setMinutes(e.target.value); setError(''); }}
                placeholder="or type minutes..."
                className="w-full font-pixel text-sm px-4 py-3 border outline-none placeholder-zinc-700 transition-all"
                style={{
                  background: '#0d0d12',
                  borderColor: minutes ? 'rgba(255,69,0,0.5)' : '#1a1a22',
                  color: '#f4f4f5',
                }}
              />
              {minutes && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-pixel text-[8px]" style={{ color: '#FF4500' }}>
                  MIN
                </span>
              )}
            </div>
          </div>

          {/* XP Preview */}
          <AnimatePresence>
            {validInput && parsedMin <= SESSION_LIMIT && parsedMin <= dailyRemaining && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="mb-4 p-3 border"
                style={{ background: 'rgba(255,69,0,0.06)', borderColor: 'rgba(255,69,0,0.3)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame size={14} style={{ color: '#FF4500' }} />
                    <span className="font-pixel text-[8px] text-zinc-400">XP EARNED</span>
                  </div>
                  <div className="text-right">
                    <span data-testid="xp-preview" className="font-pixel text-2xl" style={{ color: '#FF4500' }}>
                      +{xpGained}
                    </span>
                    {isBonus && <p className="font-pixel text-[7px] text-green-400 mt-0.5">★ CLASS BONUS ×1.2</p>}
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-[#1a1a22] flex items-center justify-between">
                  <span className="font-plex text-[10px] text-zinc-600">
                    {parsedMin} min × 3 XP{isBonus ? ' × 1.2' : ''}
                  </span>
                  {selected && (
                    <span
                      className="font-pixel text-[7px] px-2 py-0.5"
                      style={{ color: selected.color, background: `${selected.color}15`, border: `1px solid ${selected.color}30` }}
                    >
                      {selected.label}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-2 p-3 mb-4 border"
                style={{ background: 'rgba(127,29,29,0.2)', borderColor: 'rgba(239,68,68,0.4)' }}
              >
                <AlertTriangle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p data-testid="workout-error" className="font-plex text-xs text-red-300 leading-snug">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Submit button — FIXED at bottom, always visible, above nav ─── */}
        <div
          className="flex-shrink-0 px-4 pt-3 pb-4 border-t"
          style={{
            borderColor: '#1a1a22',
            background: '#0a0a0e',
          }}
        >
          <motion.button
            data-testid="submit-workout-btn"
            onClick={handleSubmit}
            disabled={dailyRemaining <= 0}
            whileTap={{ scale: 0.97 }}
            className="w-full font-pixel text-[10px] py-4 border-2 uppercase"
            style={
              dailyRemaining <= 0
                ? { background: '#1a1a22', borderColor: '#2a2a32', color: '#3F3F46', cursor: 'not-allowed' }
                : {
                    background: 'linear-gradient(145deg, #FF6B35, #FF4500)',
                    borderColor: 'rgba(255,140,0,0.6)',
                    color: 'white',
                    boxShadow: '0 4px 16px rgba(255,69,0,0.35)',
                    cursor: 'pointer',
                  }
            }
          >
            {dailyRemaining <= 0 ? 'Rest Until Tomorrow' : '⚔ Earn XP'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default WorkoutModal;
