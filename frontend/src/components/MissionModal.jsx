import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Package, Dumbbell } from 'lucide-react';
import { STAT_ABBR } from '../data/missions';

const MissionModal = ({ result, onClose }) => {
  const { mission, success } = result;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 18, stiffness: 250 }}
        className={`bg-[#18181B] border-4 w-full max-w-sm p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${
          success ? 'border-green-500' : 'border-red-600/70'
        }`}
      >
        {/* Result Badge */}
        <div className="flex items-center gap-3 mb-4">
          {success
            ? <CheckCircle size={28} className="text-green-400 flex-shrink-0" />
            : <XCircle size={28} className="text-red-400 flex-shrink-0" />
          }
          <div>
            <p data-testid="mission-result-status" className={`font-pixel text-xs ${success ? 'text-green-400' : 'text-red-400'}`}>
              {success ? 'MISSION SUCCESS' : 'MISSION FAILED'}
            </p>
            <p className="font-pixel text-[9px] text-zinc-400 mt-0.5">{mission.name}</p>
          </div>
        </div>

        {/* Requirement shown */}
        <div className="bg-[#09090B] border border-[#3F3F46] px-3 py-2 mb-4 flex items-center gap-2">
          <Dumbbell size={12} className="text-zinc-500" />
          <span className="font-pixel text-[8px] text-zinc-400">
            Required: {STAT_ABBR[mission.requirement.stat]} {'>='}  {mission.requirement.value}
          </span>
        </div>

        {/* Flavor Text */}
        <p className="font-plex text-sm text-zinc-300 leading-relaxed mb-4">
          {success ? mission.successText : mission.failText}
        </p>

        {/* Loot (success only) */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#FF4500]/10 border-2 border-[#FF4500]/40 p-3 mb-4 flex items-center gap-3"
          >
            <Package size={18} className="text-[#FF4500] flex-shrink-0" />
            <div>
              <p className="font-pixel text-[8px] text-zinc-400 mb-0.5">ITEM OBTAINED</p>
              <p data-testid="mission-loot" className="font-pixel text-[10px] text-[#FF4500]">{mission.loot}</p>
            </div>
          </motion.div>
        )}

        {/* Fail motivation */}
        {!success && (
          <div className="bg-[#27272A] border border-[#3F3F46] p-3 mb-4">
            <p className="font-pixel text-[8px] text-zinc-400 mb-1">HOW TO IMPROVE</p>
            <p className="font-plex text-xs text-zinc-400">
              Go work out in the real world, log your session, and spend Skill Points to upgrade your{' '}
              <span className="text-[#FF4500]">{STAT_ABBR[mission.requirement.stat]}</span>.
            </p>
          </div>
        )}

        {/* Close Button */}
        <button
          data-testid="mission-modal-close-btn"
          onClick={onClose}
          className={`w-full text-white font-pixel text-[10px] py-4 border-2 shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.4),_3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none transition-all ${
            success
              ? 'bg-green-600 hover:bg-green-700 border-green-500'
              : 'bg-[#27272A] hover:bg-[#3F3F46] border-[#52525B]'
          }`}
        >
          {success ? 'CLAIM LOOT' : 'RETREAT'}
        </button>
      </motion.div>
    </div>
  );
};

export default MissionModal;
