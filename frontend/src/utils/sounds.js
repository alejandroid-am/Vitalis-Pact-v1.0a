// Chiptune sound generator using the Web Audio API.
// Zero external assets, zero dependencies — sounds are synthesized at play time.
// AudioContext must be unlocked on first user gesture (browser autoplay policy).

const STORAGE_KEY = 'fq_sound_muted';

let _ctx = null;
let _muted = false;

try {
  _muted = localStorage.getItem(STORAGE_KEY) === '1';
} catch (err) {
  console.error('[sounds] failed to read mute setting:', err);
}

const getCtx = () => {
  if (typeof window === 'undefined') return null;
  if (!_ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    _ctx = new AC();
  }
  // Resume if suspended (Safari/iOS)
  if (_ctx.state === 'suspended') _ctx.resume().catch(() => {});
  return _ctx;
};

// Listeners so the React UI can subscribe to mute changes
const listeners = new Set();
const notify = () => listeners.forEach(fn => fn(_muted));

export const isMuted = () => _muted;

export const setMuted = (v) => {
  _muted = !!v;
  try { localStorage.setItem(STORAGE_KEY, _muted ? '1' : '0'); } catch (err) {
    console.error('[sounds] failed to persist mute setting:', err);
  }
  notify();
};

export const toggleMuted = () => setMuted(!_muted);

export const onMuteChange = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

// ─── Primitive note player ─────────────────────────────────
// Plays a single tone with ADSR-ish envelope.
const tone = ({ freq, dur = 0.12, type = 'square', volume = 0.18, attack = 0.005, decay = 0.05, when = 0 }) => {
  const ctx = getCtx();
  if (!ctx || _muted) return;
  const t0 = ctx.currentTime + when;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(volume, t0 + attack);
  gain.gain.linearRampToValueAtTime(volume * 0.6, t0 + attack + decay);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
};

// Noise burst (for hits/critical)
const noise = ({ dur = 0.12, volume = 0.18, when = 0, bandpass = null }) => {
  const ctx = getCtx();
  if (!ctx || _muted) return;
  const t0 = ctx.currentTime + when;
  const bufferSize = Math.floor(ctx.sampleRate * dur);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  if (bandpass) {
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = bandpass;
    filter.Q.value = 1;
    src.connect(filter); filter.connect(gain);
  } else {
    src.connect(gain);
  }
  gain.connect(ctx.destination);
  src.start(t0);
  src.stop(t0 + dur);
};

// ─── Named sound effects ──────────────────────────────────
// Notes (MIDI) → frequencies
const N = { C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
            C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
            C6: 1046.50, E6: 1318.51, G6: 1567.98 };

export const sfx = {
  click: () => tone({ freq: N.A5, dur: 0.04, type: 'square', volume: 0.10 }),
  hover: () => tone({ freq: N.E5, dur: 0.02, type: 'square', volume: 0.06 }),

  coin: () => {
    tone({ freq: N.E6, dur: 0.06, type: 'square', volume: 0.16, when: 0 });
    tone({ freq: N.G6, dur: 0.10, type: 'square', volume: 0.16, when: 0.05 });
  },

  potion: () => {
    tone({ freq: N.E5, dur: 0.08, type: 'sine', volume: 0.14, when: 0 });
    tone({ freq: N.A5, dur: 0.10, type: 'sine', volume: 0.14, when: 0.06 });
    tone({ freq: N.E6, dur: 0.14, type: 'sine', volume: 0.12, when: 0.13 });
  },

  hit: () => {
    noise({ dur: 0.10, volume: 0.22, bandpass: 1200 });
    tone({ freq: 90, dur: 0.10, type: 'triangle', volume: 0.18 });
  },

  critical: () => {
    noise({ dur: 0.18, volume: 0.28, bandpass: 2000 });
    tone({ freq: 140, dur: 0.16, type: 'sawtooth', volume: 0.20 });
    tone({ freq: N.A4, dur: 0.10, type: 'square', volume: 0.16, when: 0.08 });
  },

  dodge: () => {
    tone({ freq: N.C5, dur: 0.06, type: 'triangle', volume: 0.12, when: 0 });
    tone({ freq: N.G5, dur: 0.08, type: 'triangle', volume: 0.12, when: 0.05 });
  },

  levelUp: () => {
    const seq = [N.C5, N.E5, N.G5, N.C6, N.E6];
    seq.forEach((f, i) => tone({ freq: f, dur: 0.16, type: 'square', volume: 0.18, when: i * 0.09 }));
  },

  chestOpen: () => {
    // Suspense pluck
    tone({ freq: N.C4, dur: 0.10, type: 'triangle', volume: 0.16, when: 0 });
    tone({ freq: N.G4, dur: 0.10, type: 'triangle', volume: 0.16, when: 0.12 });
    // Sparkle
    const sparkle = [N.E6, N.G6, N.E6, N.A5, N.C6];
    sparkle.forEach((f, i) => tone({ freq: f, dur: 0.08, type: 'square', volume: 0.14, when: 0.25 + i * 0.07 }));
  },

  victory: () => {
    const fanfare = [N.G4, N.G4, N.G4, N.E4, N.G4, N.C5, N.E5];
    fanfare.forEach((f, i) => tone({ freq: f, dur: 0.16, type: 'square', volume: 0.20, when: i * 0.12 }));
  },

  defeat: () => {
    const fall = [N.G4, N.E4, N.C4, N.A4 / 2];
    fall.forEach((f, i) => tone({ freq: f, dur: 0.20, type: 'triangle', volume: 0.18, when: i * 0.18 }));
  },

  equip: () => {
    tone({ freq: N.G4, dur: 0.05, type: 'square', volume: 0.14, when: 0 });
    tone({ freq: N.C5, dur: 0.08, type: 'square', volume: 0.14, when: 0.04 });
  },

  purchase: () => {
    tone({ freq: N.A4, dur: 0.05, type: 'square', volume: 0.14, when: 0 });
    tone({ freq: N.E5, dur: 0.05, type: 'square', volume: 0.14, when: 0.04 });
    tone({ freq: N.A5, dur: 0.10, type: 'square', volume: 0.14, when: 0.08 });
  },

  achievement: () => {
    const seq = [N.E5, N.G5, N.C6, N.E6];
    seq.forEach((f, i) => tone({ freq: f, dur: 0.14, type: 'square', volume: 0.18, when: i * 0.08 }));
  },
};

// Convenience: unlock context on first interaction (call once from App on first mount)
export const unlockAudio = () => {
  const ctx = getCtx();
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
};
