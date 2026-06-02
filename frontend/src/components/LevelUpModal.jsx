import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const COLORS = ['#FF4500','#FF8C00','#FFD700','#FF6B35','#FFA500'];

const LevelUpModal = ({ data, onClose }) => {
  const { levelsGained, newLevel, xpGained } = data;
  const canvasRef = useRef(null);

  // Confetti burst
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: canvas.width / 2,
      y: canvas.height * 0.35,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 1.5) * 8,
      size: Math.random() * 6 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.2,
      life: 1,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.vy += 0.25;
        p.x  += p.vx;
        p.y  += p.vy;
        p.rotation += p.rotSpeed;
        p.life -= 0.012;
        if (p.life <= 0) return;
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
        ctx.restore();
      });
      if (alive) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    /* z-[10200] — above BottomNav (10000) but below TutorialOverlay (10500) */
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        zIndex: 10200,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(6px)',
      }}
      /* clicking the backdrop also dismisses */
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Confetti canvas — pointer-events none so clicks pass through to button */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 14, stiffness: 220 }}
        className="relative w-full max-w-xs text-center border-2"
        style={{
          background: 'linear-gradient(145deg, #0d0d12, #12121a)',
          borderColor: 'rgba(255,215,0,0.5)',
          boxShadow: '0 0 40px rgba(255,140,0,0.3)',
          padding: '2rem 1.5rem',
          /* ensure the card itself never captures pointer-events away from button */
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Burst rings */}
        <div className="absolute inset-0 flex items-start justify-center" style={{ top: '2rem', pointerEvents: 'none' }}>
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="absolute w-20 h-20 rounded-full border-2"
              style={{ borderColor: '#FFD700' }}
              initial={{ scale: 0.4, opacity: 0.9 }}
              animate={{ scale: 2.5 + i * 0.5, opacity: 0 }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: 'easeOut' }}
            />
          ))}
        </div>

        {/* Level number */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className="font-pixel text-[8px] text-zinc-500 mb-1">LEVEL UP!</p>
          <p
            className="font-pixel victory-text"
            style={{ fontSize: '72px', color: '#FFD700', lineHeight: 1 }}
          >
            {newLevel}
          </p>
          <p className="font-pixel text-[8px] text-zinc-400 mt-1">
            {levelsGained > 1 ? `+${levelsGained} LEVELS GAINED` : 'NEW LEVEL'}
          </p>
        </motion.div>

        {/* XP + SP info */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 p-3 border"
          style={{ background: '#0d0d12', borderColor: '#1a1a22' }}
        >
          <p className="font-pixel text-[9px] text-zinc-300 mb-1">+{xpGained} XP EARNED</p>
          <p className="font-pixel text-[9px]" style={{ color: '#FF4500' }}>
            +{levelsGained} SKILL {levelsGained === 1 ? 'POINT' : 'POINTS'}
          </p>
          <p className="font-plex text-[10px] text-zinc-500 mt-1.5">
            Go to HERO to upgrade your stats.
          </p>
        </motion.div>

        <motion.button
          data-testid="levelup-close-btn"
          onClick={onClose}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full mt-4 font-pixel text-[10px] py-4 border-2 uppercase"
          style={{
            background: 'linear-gradient(145deg, #FF6B35, #FF4500)',
            borderColor: 'rgba(255,140,0,0.6)',
            color: 'white',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 2,
          }}
        >
          CLAIM GLORY
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LevelUpModal;
