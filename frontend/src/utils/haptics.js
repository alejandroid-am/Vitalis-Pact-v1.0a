// Haptic feedback helper. Respects user preference stored in localStorage.
const KEY = 'fq_haptic_muted';

let _muted = false;
try {
  _muted = localStorage.getItem(KEY) === '1';
} catch (err) {
  console.error('[haptics] failed to read setting:', err);
}

const listeners = new Set();
const notify = () => listeners.forEach(fn => fn(_muted));

export const isHapticMuted = () => _muted;

export const setHapticMuted = (v) => {
  _muted = !!v;
  try { localStorage.setItem(KEY, _muted ? '1' : '0'); } catch (err) {
    console.error('[haptics] failed to persist setting:', err);
  }
  notify();
};

export const toggleHapticMuted = () => setHapticMuted(!_muted);

export const onHapticChange = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

// No-op when muted or when navigator.vibrate is unavailable (desktop).
export const vibrate = (pattern) => {
  if (_muted) return;
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try { navigator.vibrate(pattern); } catch (err) { console.error('[haptics] vibrate failed:', err); }
  }
};
