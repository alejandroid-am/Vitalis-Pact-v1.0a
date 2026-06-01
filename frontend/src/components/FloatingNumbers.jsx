import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Floating combat numbers (damage / heal / dodge). Renders absolute-positioned
// spans inside the parent (which must have position: relative).
// `numbers` is an array of { id, value, type, x } where type is 'dmg-out', 'dmg-in', 'heal', or 'dodge'.

const COLORS = {
  'dmg-out': 'text-orange-300',
  'dmg-in':  'text-red-400',
  'heal':    'text-emerald-300',
  'dodge':   'text-cyan-300',
};

const FloatingNumbers = ({ numbers }) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden z-30">
    <AnimatePresence>
      {numbers.map((n) => (
        <motion.span
          key={n.id}
          initial={{ y: 0, opacity: 0, scale: 0.7 }}
          animate={{ y: -70, opacity: 1, scale: 1.1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ left: `${n.x}%`, top: '50%' }}
          className={`absolute -translate-x-1/2 -translate-y-1/2 font-pixel text-[14px] drop-shadow-[2px_2px_0_rgba(0,0,0,1)] ${COLORS[n.type]}`}
        >
          {n.value}
        </motion.span>
      ))}
    </AnimatePresence>
  </div>
);

export default FloatingNumbers;
