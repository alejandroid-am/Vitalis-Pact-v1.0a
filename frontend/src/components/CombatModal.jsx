import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Shield, Heart, Dumbbell, Zap, CheckCircle, XCircle, Package, X, Skull } from 'lucide-react';

const TIER_COLORS = {
  I: { border: 'border-amber-600/60', bg: 'bg-amber-600/10', text: 'text-amber-400', badge: 'bg-amber-600/20 text-amber-400 border-amber-600/40' },
  II: { border: 'border-zinc-400/60', bg: 'bg-zinc-400/10', text: 'text-zinc-300', badge: 'bg-zinc-400/20 text-zinc-300 border-zinc-400/40' },
  III: { border: 'border-red-600/60', bg: 'bg-red-600/10', text: 'text-red-400', badge: 'bg-red-600/20 text-red-400 border-red-600/40' },
};

const HPBar = ({ current, max, color = 'from-red-600 to-orange-500' }) => {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  return (
    <div className="h-4 bg-[#09090B] border border-[#3F3F46] w-full overflow-hidden relative">
      <motion.div
        className={`h-full bg-gradient-to-r ${color} transition-all duration-300`}
        style={{ width: `${pct}%` }}
      />
      <span className="absolute inset-0 flex items-center justify-center font-pixel text-[7px] text-white/80">
        {current}/{max}
      </span>
    </div>
  );
};

const CombatModal = ({ mission, gameData, onVictory, onDefeat, onClose }) => {
  const { stats, name, characterClass } = gameData;
  const { enemy } = mission;

  // Player combat stats
  const playerMaxHP = 10 + stats.endurance * 5;
  const playerAttack = stats.strength * 2;
  const playerDodgePct = Math.min(stats.agility * 10, 60);

  const tierColors = TIER_COLORS[enemy.tier] || TIER_COLORS.I;

  const [phase, setPhase] = useState('intro'); // intro | combat | victory | defeat
  const [playerHP, setPlayerHP] = useState(playerMaxHP);
  const [enemyHP, setEnemyHP] = useState(enemy.hp);
  const [log, setLog] = useState([]);
  const [busy, setBusy] = useState(false);

  const pushLog = (msg, type = 'neutral') => {
    setLog(prev => [{ msg, type, id: Date.now() + Math.random() }, ...prev].slice(0, 6));
  };

  const handleAttack = () => {
    if (busy || phase !== 'combat') return;
    setBusy(true);

    // Player strikes
    const variance = Math.floor(Math.random() * 3) - 1;
    const dmg = Math.max(1, playerAttack + variance);
    const enemyEvades = Math.random() * 100 < enemy.dodge;

    const newEnemyHP = enemyEvades ? enemyHP : Math.max(0, enemyHP - dmg);
    setEnemyHP(newEnemyHP);

    if (enemyEvades) {
      pushLog(`${enemy.name} dodges your strike!`, 'enemy');
    } else {
      pushLog(`You strike for ${dmg} damage!`, 'player');
    }

    if (newEnemyHP <= 0) {
      pushLog('>>> ENEMY DEFEATED! VICTORY!', 'system');
      setTimeout(() => { setPhase('victory'); setBusy(false); }, 800);
      return;
    }

    // Enemy counter-attacks after delay
    setTimeout(() => {
      const playerEvades = Math.random() * 100 < playerDodgePct;
      const eDmg = Math.max(1, enemy.attack + Math.floor(Math.random() * 2));
      const newPHP = playerEvades ? playerHP : Math.max(0, playerHP - eDmg);

      if (playerEvades) {
        pushLog(`You dodge ${enemy.name}'s counter!`, 'player');
      } else {
        setPlayerHP(newPHP);
        pushLog(`${enemy.name} hits you for ${eDmg}!`, 'enemy');
      }

      if (!playerEvades && newPHP <= 0) {
        pushLog('>>> You have fallen in battle...', 'system');
        setTimeout(() => { setPhase('defeat'); setBusy(false); }, 800);
        return;
      }
      setBusy(false);
    }, 700);
  };

  const logColors = { player: 'text-zinc-100', enemy: 'text-orange-300', system: 'text-[#FF4500]', neutral: 'text-zinc-400' };

  // ─── INTRO PHASE ───
  if (phase === 'intro') {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 18, stiffness: 240 }}
          className="bg-[#18181B] border-4 border-[#3F3F46] w-full max-w-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          {/* Header */}
          <div className="bg-[#27272A] border-b-2 border-[#3F3F46] px-4 py-3 flex items-center justify-between">
            <span className="font-pixel text-[9px] text-zinc-300">MISSION BRIEFING</span>
            <button onClick={onClose} data-testid="combat-modal-close" className="text-zinc-600 hover:text-zinc-400">
              <X size={16} />
            </button>
          </div>

          <div className="p-4">
            <p className="font-pixel text-[9px] text-[#FF4500] mb-1">{mission.name}</p>

            {/* Enemy vs Player */}
            <div className="grid grid-cols-2 gap-3 my-4">
              {/* Player */}
              <div className="bg-[#09090B] border-2 border-[#52525B] p-3">
                <p className="font-pixel text-[7px] text-zinc-500 mb-1">HERO</p>
                <p className="font-pixel text-[10px] text-zinc-100 truncate">{name}</p>
                <p className="font-pixel text-[7px] text-zinc-500 mt-2 mb-1">HP</p>
                <p className="font-pixel text-base text-green-400">{playerMaxHP}</p>
                <div className="mt-2 space-y-0.5">
                  <p className="font-pixel text-[7px] text-zinc-400">ATK: <span className="text-zinc-200">{playerAttack}</span></p>
                  <p className="font-pixel text-[7px] text-zinc-400">EVD: <span className="text-zinc-200">{playerDodgePct}%</span></p>
                </div>
              </div>

              {/* Enemy */}
              <div className={`border-2 ${tierColors.border} ${tierColors.bg} p-3`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="font-pixel text-[7px] text-zinc-500">ENEMY</p>
                  <span className={`font-pixel text-[7px] border px-1 py-0.5 ${tierColors.badge}`}>
                    TIER {enemy.tier}
                  </span>
                </div>
                <p className={`font-pixel text-[9px] ${tierColors.text}`}>{enemy.name}</p>
                <p className="font-pixel text-[7px] text-zinc-500 mt-2 mb-1">HP</p>
                <p className="font-pixel text-base text-red-400">{enemy.hp}</p>
                <div className="mt-2 space-y-0.5">
                  <p className="font-pixel text-[7px] text-zinc-400">ATK: <span className="text-zinc-200">{enemy.attack}</span></p>
                  <p className="font-pixel text-[7px] text-zinc-400">EVD: <span className="text-zinc-200">{enemy.dodge}%</span></p>
                </div>
              </div>
            </div>

            {/* Enemy description */}
            <div className="bg-[#09090B] border border-[#3F3F46] p-3 mb-4">
              <p className="font-plex text-xs text-zinc-400 italic leading-snug">{enemy.description}</p>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <button
                data-testid="begin-combat-btn"
                onClick={() => {
                  setPhase('combat');
                  pushLog('Combat begins. May your training hold...');
                }}
                className="w-full bg-[#FF4500] hover:bg-[#DC2626] text-white font-pixel text-[10px] py-4 border-2 border-[#FF8C00] shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.4),_3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none transition-all"
              >
                BEGIN BATTLE
              </button>
              <button
                data-testid="combat-retreat-btn"
                onClick={onClose}
                className="w-full bg-transparent text-zinc-500 hover:text-zinc-300 font-pixel text-[9px] py-2 border border-[#3F3F46] transition-all"
              >
                RETREAT
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── COMBAT PHASE ───
  if (phase === 'combat') {
    return (
      <div className="fixed inset-0 bg-black/92 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#18181B] border-4 border-[#3F3F46] w-full max-w-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          {/* HP Bars */}
          <div className="grid grid-cols-2 divide-x-2 divide-[#3F3F46]">
            <div className="p-3">
              <div className="flex items-center gap-1 mb-1">
                <Heart size={10} className="text-green-400" />
                <p className="font-pixel text-[7px] text-zinc-400">{name.slice(0, 8)}</p>
              </div>
              <HPBar current={playerHP} max={playerMaxHP} color="from-green-700 to-green-500" />
            </div>
            <div className="p-3">
              <div className="flex items-center gap-1 mb-1 justify-end">
                <p className={`font-pixel text-[7px] ${tierColors.text}`}>{enemy.name.split(' ')[0]}</p>
                <Skull size={10} className={tierColors.text} />
              </div>
              <HPBar current={enemyHP} max={enemy.hp} color="from-red-800 to-red-500" />
            </div>
          </div>

          {/* Combat Log */}
          <div className="bg-[#09090B] border-y-2 border-[#3F3F46] px-3 py-2 min-h-[100px] max-h-[120px] overflow-hidden">
            <AnimatePresence>
              {log.map((entry) => (
                <motion.p
                  key={entry.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`font-plex text-xs mb-0.5 ${logColors[entry.type] || logColors.neutral}`}
                >
                  &gt; {entry.msg}
                </motion.p>
              ))}
            </AnimatePresence>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 border-b-2 border-[#3F3F46]">
            {[
              { icon: Dumbbell, label: 'ATK', val: playerAttack },
              { icon: Zap, label: 'EVD', val: `${playerDodgePct}%` },
              { icon: Shield, label: 'HP', val: `${playerHP}/${playerMaxHP}` },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="p-2 text-center border-r last:border-r-0 border-[#3F3F46]">
                <Icon size={10} className="text-zinc-500 mx-auto mb-0.5" />
                <p className="font-pixel text-[7px] text-zinc-500">{label}</p>
                <p className="font-pixel text-[9px] text-zinc-300">{val}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="p-3 grid grid-cols-2 gap-2">
            <button
              data-testid="combat-attack-btn"
              onClick={handleAttack}
              disabled={busy}
              className={`font-pixel text-[10px] py-4 border-2 flex items-center justify-center gap-2 transition-all ${
                busy
                  ? 'bg-zinc-700 border-zinc-600 text-zinc-500 cursor-not-allowed'
                  : 'bg-[#FF4500] hover:bg-[#DC2626] border-[#FF8C00] text-white shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.4),_3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none'
              }`}
            >
              <Sword size={14} />
              ATTACK
            </button>
            <button
              data-testid="combat-flee-btn"
              onClick={() => { pushLog('You flee from battle!'); setTimeout(onClose, 600); }}
              disabled={busy}
              className="font-pixel text-[9px] py-4 border-2 border-[#3F3F46] text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 transition-all"
            >
              FLEE
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── VICTORY PHASE ───
  if (phase === 'victory') {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 220 }}
          className="bg-[#18181B] border-4 border-green-600 w-full max-w-sm p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center"
        >
          <CheckCircle size={36} className="text-green-400 mx-auto mb-3" />
          <p data-testid="mission-result-status" className="font-pixel text-sm text-green-400 mb-1">VICTORY!</p>
          <p className="font-pixel text-[9px] text-zinc-400 mb-3">{mission.name}</p>
          <p className="font-plex text-sm text-zinc-300 leading-relaxed mb-4">{mission.successText}</p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#FF4500]/10 border-2 border-[#FF4500]/40 p-3 mb-4 flex items-center gap-3"
          >
            <Package size={18} className="text-[#FF4500] flex-shrink-0" />
            <div className="text-left">
              <p className="font-pixel text-[8px] text-zinc-400 mb-0.5">LOOT OBTAINED</p>
              <p data-testid="mission-loot" className="font-pixel text-[10px] text-[#FF4500]">{mission.loot}</p>
            </div>
          </motion.div>
          <button
            data-testid="mission-modal-close-btn"
            onClick={onVictory}
            className="w-full bg-green-700 hover:bg-green-600 text-white font-pixel text-[10px] py-4 border-2 border-green-500 shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.4),_3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none transition-all"
          >
            CLAIM LOOT
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── DEFEAT PHASE ───
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 14, stiffness: 220 }}
        className="bg-[#18181B] border-4 border-red-700/70 w-full max-w-sm p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center"
      >
        <XCircle size={36} className="text-red-500 mx-auto mb-3" />
        <p data-testid="mission-result-status" className="font-pixel text-sm text-red-500 mb-1">DEFEATED</p>
        <p className="font-pixel text-[9px] text-zinc-400 mb-3">{mission.name}</p>
        <p className="font-plex text-sm text-zinc-300 leading-relaxed mb-4">{mission.failText}</p>
        <div className="bg-[#27272A] border border-[#3F3F46] p-3 mb-4 text-left">
          <p className="font-pixel text-[8px] text-zinc-400 mb-1">HOW TO IMPROVE</p>
          <p className="font-plex text-xs text-zinc-400">
            Go train in real life, log your session, and spend Skill Points on{' '}
            <span className="text-[#FF4500]">{mission.requirement.stat}</span> to increase your power.
          </p>
        </div>
        <button
          data-testid="mission-modal-close-btn"
          onClick={onDefeat}
          className="w-full bg-[#27272A] hover:bg-[#3F3F46] text-zinc-300 font-pixel text-[10px] py-4 border-2 border-[#52525B] transition-all"
        >
          RETREAT & TRAIN
        </button>
      </motion.div>
    </div>
  );
};

export default CombatModal;
