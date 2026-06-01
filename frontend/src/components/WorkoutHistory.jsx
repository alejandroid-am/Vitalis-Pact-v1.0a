import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Heart, Activity, Flame, Clock } from 'lucide-react';

const TYPE_META = {
  strength: { Icon: Dumbbell, color: 'text-orange-400', label: 'STR' },
  cardio:   { Icon: Heart,    color: 'text-red-400',    label: 'CARDIO' },
  mobility: { Icon: Activity, color: 'text-emerald-400', label: 'MOBILITY' },
};

const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    const today = new Date();
    today.setHours(0,0,0,0);
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const day = new Date(d); day.setHours(0,0,0,0);
    if (day.getTime() === today.getTime()) return 'Today';
    if (day.getTime() === yesterday.getTime()) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch { return ''; }
};

const WorkoutHistory = ({ history = [] }) => {
  const recent = history.slice(0, 5);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Clock size={14} className="text-zinc-400" />
        <p className="font-pixel text-[9px] text-zinc-400 uppercase">Workout History</p>
        <span className="font-pixel text-[8px] text-zinc-600 ml-auto">last 5</span>
      </div>

      {recent.length === 0 ? (
        <div className="bg-[#18181B] border-2 border-[#3F3F46] border-dashed p-5 text-center">
          <p className="font-pixel text-[9px] text-zinc-600">No sessions logged yet.</p>
          <p className="font-plex text-[11px] text-zinc-600 mt-1">Tap LOG WORKOUT to begin.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {recent.map((entry, i) => {
            const meta = TYPE_META[entry.type] || TYPE_META.cardio;
            const Icon = meta.Icon;
            return (
              <motion.div
                key={entry.id}
                data-testid={`history-entry-${i}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-[#18181B] border-2 border-[#3F3F46] p-2.5 flex items-center gap-3"
              >
                <div className={`w-9 h-9 border-2 border-[#3F3F46] bg-[#09090B] flex items-center justify-center`}>
                  <Icon size={14} className={meta.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-pixel text-[9px] text-zinc-200">{entry.minutes} min</p>
                    <span className={`font-pixel text-[7px] ${meta.color}`}>{meta.label}</span>
                    {entry.bonus && (
                      <span className="font-pixel text-[6px] text-[#FF4500] border border-[#FF4500]/50 px-1 py-px">
                        +20%
                      </span>
                    )}
                  </div>
                  <p className="font-plex text-[10px] text-zinc-500 mt-0.5">{formatDate(entry.date)}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Flame size={10} className="text-[#FF4500]" />
                    <span className="font-pixel text-[9px] text-[#FF4500]">+{entry.xp}</span>
                  </div>
                  <p className="font-pixel text-[7px] text-zinc-600">XP</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;
