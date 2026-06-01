// PWA utilities: service worker registration, install prompt capture,
// and local browser notifications (no push backend).

const NOTIF_ENABLED_KEY = 'fq_notifications_enabled';
const LAST_REMINDER_KEY = 'fq_last_reminder_at';

let deferredInstall = null;
const listeners = new Set();
const notifyListeners = () => listeners.forEach(fn => fn(!!deferredInstall));

export const onInstallPromptChange = (fn) => {
  listeners.add(fn);
  fn(!!deferredInstall);
  return () => listeners.delete(fn);
};

export const canInstall = () => !!deferredInstall;

export const promptInstall = async () => {
  if (!deferredInstall) return { ok: false, reason: 'unavailable' };
  try {
    deferredInstall.prompt();
    const choice = await deferredInstall.userChoice;
    deferredInstall = null;
    notifyListeners();
    return { ok: true, outcome: choice?.outcome || 'unknown' };
  } catch (err) {
    console.error('[pwa] install prompt failed:', err);
    return { ok: false, reason: 'error' };
  }
};

// Initialise PWA features. Call once at app boot.
export const initPWA = () => {
  if (typeof window === 'undefined') return;

  // Capture install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstall = e;
    notifyListeners();
  });
  window.addEventListener('appinstalled', () => {
    deferredInstall = null;
    notifyListeners();
  });

  // Register service worker (production-only would be ideal; here we register
  // always so users in this preview env benefit too. Errors are non-fatal.)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.error('[pwa] sw registration failed:', err);
      });
    });
  }
};

// ─── Notifications ─────────────────────────────────────────
export const isNotificationsEnabled = () => {
  try {
    return localStorage.getItem(NOTIF_ENABLED_KEY) === '1'
      && typeof Notification !== 'undefined'
      && Notification.permission === 'granted';
  } catch (err) {
    console.error('[pwa] read notif setting:', err);
    return false;
  }
};

export const setNotificationsPreference = (enabled) => {
  try { localStorage.setItem(NOTIF_ENABLED_KEY, enabled ? '1' : '0'); } catch (err) {
    console.error('[pwa] persist notif setting:', err);
  }
};

export const requestNotificationPermission = async () => {
  if (typeof Notification === 'undefined') return { ok: false, reason: 'unsupported' };
  try {
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      setNotificationsPreference(true);
      return { ok: true };
    }
    setNotificationsPreference(false);
    return { ok: false, reason: perm };
  } catch (err) {
    console.error('[pwa] permission request:', err);
    return { ok: false, reason: 'error' };
  }
};

export const disableNotifications = () => {
  setNotificationsPreference(false);
};

// Show a local browser notification. Used to remind user to train when
// they have not exercised in 24h+ AND last reminder was >12h ago.
// Pure client-side: best-effort, only fires while app is loaded or SW is alive.
export const showLocalNotification = (title, body) => {
  if (!isNotificationsEnabled()) return;
  try {
    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'show-notification', title, body });
    } else if (typeof Notification !== 'undefined') {
      // eslint-disable-next-line no-new
      new Notification(title, { body, icon: '/icon.svg' });
    }
  } catch (err) {
    console.error('[pwa] show notification:', err);
  }
};

// Decide whether the user deserves a "you have not trained today" nudge and fire it.
// Called on app load. Honors the 12h cooldown to avoid spam.
export const maybeRemindToTrain = (gameData) => {
  if (!isNotificationsEnabled()) return;
  const lastWorkout = gameData?.lastWorkoutAt ? new Date(gameData.lastWorkoutAt).getTime() : 0;
  const hoursSinceWorkout = (Date.now() - lastWorkout) / 3600000;
  if (hoursSinceWorkout < 24) return;

  let lastReminder = 0;
  try { lastReminder = parseInt(localStorage.getItem(LAST_REMINDER_KEY) || '0', 10) || 0; }
  catch (err) { console.error('[pwa] read last reminder:', err); }
  const hoursSinceReminder = (Date.now() - lastReminder) / 3600000;
  if (hoursSinceReminder < 12) return;

  showLocalNotification(
    'Your hero grows restless',
    hoursSinceWorkout > 48
      ? 'Rusted debuff active — log a workout to forge yourself back.'
      : 'It has been a day since your last training. The wilds are waiting.',
  );

  try { localStorage.setItem(LAST_REMINDER_KEY, String(Date.now())); }
  catch (err) { console.error('[pwa] persist last reminder:', err); }
};
