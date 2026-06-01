import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Timer, Dumbbell, Wind, Flame } from 'lucide-react';

const WorkoutModal = ({ characterClass, onClose, onSubmit }) => {
  const [minutes, setMinutes] = useState('');
  const [activityType, setActivityType] = useState('');
  const [error, setError] = useState('');

  const parsedMin = parseInt(minutes, 10);
  const validInput = !isNaN(parsedMin) && parsedMin > 0 && activityType;
  const baseXP = validInput ? parsedMin * 3 : 0;
  const isBonus =
    (characterClass === 'warrior' && activityType === 'strength') ||
    (characterClass === 'rogue' && activityType === 'cardio');
  const xpGained = isBonus ? Math.round(baseXP * 1.2) : baseXP;

  const handleSubmit = () => {
    if (!minutes || isNaN(parsedMin) || parsedMin <= 0) {
      setError('Enter a valid number of minutes.');
      return;
    }
    if (!activityType) {
      setError('Choose an activity type.');
      return;
    }
    onSubmit(parsedMin, activityType);
  };

  return (
    <div
      data-testid="workout-modal-overlay"
      className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="bg-[#18181B] border-4 border-[#3F3F46] w-full max-w-sm p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-pixel text-xs text-zinc-100">LOG WORKOUT</h2>
          <button
            data-testid="close-workout-modal"
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Minutes Input */}
        <div className="mb-4">
          <label className="font-pixel text-[9px] text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Timer size={11} />
            Duration (minutes)
          </label>
          <input
            data-testid="workout-minutes-input"
            type="number"
            min="1"
            max="300"
            value={minutes}
            onChange={e => { setMinutes(e.target.value); setError(''); }}
            placeholder="e.g. 45"
            className="bg-[#09090B] border-2 border-[#52525B] text-zinc-100 font-plex text-lg px-4 py-3 focus:outline-none focus:border-[#FF4500] placeholder-zinc-600 w-full transition-colors"
          />
        </div>

        {/* Activity Type */}
        <div className="mb-5">
          <label className="font-pixel text-[9px] text-zinc-400 uppercase tracking-wider block mb-2">
            Activity Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              data-testid="activity-cardio-btn"
              onClick={() => { setActivityType('cardio'); setError(''); }}
              className={`py-3 border-2 font-pixel text-[9px] transition-all flex flex-col items-center gap-1.5 ${
                activityType === 'cardio'
                  ? 'bg-[#FF4500] border-[#FF8C00] text-white'
                  : 'bg-[#27272A] border-[#52525B] text-zinc-400 hover:border-[#71717A]'
              }`}
            >
              <Wind size={16} />
              CARDIO
            </button>
            <button
              data-testid="activity-strength-btn"
              onClick={() => { setActivityType('strength'); setError(''); }}
              className={`py-3 border-2 font-pixel text-[9px] transition-all flex flex-col items-center gap-1.5 ${
                activityType === 'strength'
                  ? 'bg-[#FF4500] border-[#FF8C00] text-white'
                  : 'bg-[#27272A] border-[#52525B] text-zinc-400 hover:border-[#71717A]'
              }`}
            >
              <Dumbbell size={16} />
              STRENGTH
            </button>
          </div>
        </div>

        {/* XP Preview */}
        {validInput && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#09090B] border-2 border-[#3F3F46] p-3 mb-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame size={14} className="text-[#FF4500]" />
                <span className="font-pixel text-[9px] text-zinc-400">XP GAINED</span>
              </div>
              <div className="text-right">
                <span data-testid="xp-preview" className="font-pixel text-lg text-[#FF4500]">+{xpGained}</span>
                {isBonus && (
                  <p className="font-pixel text-[7px] text-green-400">CLASS BONUS +20%</p>
                )}
              </div>
            </div>
            <p className="font-plex text-[10px] text-zinc-500 mt-1">
              {parsedMin} min x 3 XP{isBonus ? ' x 1.2 (bonus)' : ''}
            </p>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <p className="font-plex text-[#FF4500] text-xs mb-3">{error}</p>
        )}

        {/* Submit */}
        <button
          data-testid="submit-workout-btn"
          onClick={handleSubmit}
          className="w-full bg-[#FF4500] hover:bg-[#DC2626] text-white font-pixel text-[10px] py-4 border-2 border-[#FF8C00] shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.4),_3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all uppercase"
        >
          Earn XP
        </button>
      </motion.div>
    </div>
  );
};

export default WorkoutModal;
