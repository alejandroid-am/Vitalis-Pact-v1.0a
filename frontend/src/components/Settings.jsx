import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Volume2, VolumeX, Smartphone, SmartphoneNfc, Palette, BarChart3,
  Download, Upload, RefreshCw, BookOpen, Info, FileText, Lock, Users, Coins, Flame, Skull, Gift, FlaskConical, Clock,
  DownloadCloud, Bell, BellOff,
} from 'lucide-react';
import { isMuted as sndMuted, toggleMuted as sndToggle, onMuteChange as sndOnChange, sfx } from '../utils/sounds';
import { isHapticMuted, toggleHapticMuted, onHapticChange, vibrate } from '../utils/haptics';
import {
  canInstall, promptInstall, onInstallPromptChange,
  isNotificationsEnabled, requestNotificationPermission, disableNotifications,
} from '../utils/pwa';

const APP_VERSION = '1.0.0';

const Row = ({ icon: Icon, label, hint, right, onClick, testId, disabled }) => {
  // When `right` is an interactive control (e.g. Switch), render Row as a div with role=button
  // to avoid invalid <button> inside <button> nesting.
  const interactiveRight = !!right && right.type !== Lock;
  const Comp = interactiveRight ? 'div' : 'button';
  const commonProps = {
    'data-testid': testId,
    onClick: (e) => { if (!disabled && onClick) onClick(e); },
    className: `w-full bg-[#18181B] border-2 border-[#3F3F46] p-3 flex items-center gap-3 transition-all text-left ${
      onClick && !disabled ? 'hover:border-[#FF4500]/40 active:translate-y-[1px] cursor-pointer' : ''
    } ${disabled ? 'opacity-50' : ''}`,
  };
  if (!interactiveRight) {
    commonProps.disabled = disabled || !onClick;
  } else {
    commonProps.role = 'button';
    commonProps.tabIndex = onClick && !disabled ? 0 : -1;
  }
  return (
    <Comp {...commonProps}>
      <Icon size={16} className="text-zinc-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-pixel text-[9px] text-zinc-100">{label}</p>
        {hint && <p className="font-plex text-[10px] text-zinc-500 leading-tight mt-0.5">{hint}</p>}
      </div>
      {right}
    </Comp>
  );
};

const Switch = ({ on, onClick, testId }) => (
  <button
    data-testid={testId}
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`relative w-10 h-5 border-2 transition-colors flex-shrink-0 ${
      on ? 'bg-[#FF4500] border-[#FF8C00]' : 'bg-[#27272A] border-[#3F3F46]'
    }`}
  >
    <span className={`block absolute top-0 w-3 h-3 bg-zinc-100 transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
  </button>
);

const StatChip = ({ Icon, label, value, color = 'text-zinc-300' }) => (
  <div className="bg-[#27272A] border border-[#3F3F46] p-2 flex items-center gap-2">
    <Icon size={12} className={color} />
    <div>
      <p className="font-pixel text-[7px] text-zinc-500">{label}</p>
      <p className={`font-pixel text-[10px] ${color}`}>{value}</p>
    </div>
  </div>
);

const ConfirmResetModal = ({ onConfirm, onCancel }) => {
  const [text, setText] = useState('');
  const match = text.trim().toUpperCase() === 'RESET';
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[10400] flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#18181B] border-4 border-red-600 w-full max-w-sm p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      >
        <p className="font-pixel text-[12px] text-red-400 mb-2">RESET GAME?</p>
        <p className="font-plex text-sm text-zinc-300 leading-snug mb-4">
          This will permanently delete your hero, gear, gold, achievements and workout history. <span className="text-red-300">This cannot be undone.</span>
        </p>
        <p className="font-pixel text-[8px] text-zinc-400 mb-1">Type <span className="text-red-400">RESET</span> to confirm:</p>
        <input
          data-testid="reset-confirm-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
          placeholder="RESET"
          className="w-full bg-[#09090B] border-2 border-[#3F3F46] text-zinc-100 font-pixel text-sm px-3 py-2 mb-4 outline-none focus:border-red-500 tracking-widest"
        />
        <div className="grid grid-cols-2 gap-2">
          <button
            data-testid="reset-cancel-btn"
            onClick={onCancel}
            className="font-pixel text-[10px] py-3 border-2 border-[#52525B] text-zinc-300 hover:bg-[#27272A] active:translate-y-[1px] transition-all"
          >
            CANCEL
          </button>
          <button
            data-testid="reset-confirm-btn"
            onClick={() => match && onConfirm()}
            disabled={!match}
            className={`font-pixel text-[10px] py-3 border-2 transition-all ${
              match
                ? 'bg-red-700 hover:bg-red-600 border-red-500 text-white shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.4)] active:translate-y-[1px]'
                : 'bg-[#27272A] border-[#3F3F46] text-zinc-600 cursor-not-allowed'
            }`}
          >
            DELETE
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Settings = ({ gameData, effectiveStats, onBack, onOpenFriends, onResetGame, onResetTutorial, onExport, onImport }) => {
  const [muted, setMuted] = useState(sndMuted());
  const [hapticMuted, setHapticMutedState] = useState(isHapticMuted());
  const [installAvailable, setInstallAvailable] = useState(canInstall());
  const [notifEnabled, setNotifEnabled] = useState(isNotificationsEnabled());
  const [confirmReset, setConfirmReset] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => sndOnChange(setMuted), []);
  useEffect(() => onHapticChange(setHapticMutedState), []);
  useEffect(() => onInstallPromptChange(setInstallAvailable), []);

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 2500);
  };

  const lifetime = gameData.lifetime || {};

  const handleExport = () => {
    sfx.click();
    const json = onExport();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitness-quest-save-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Save exported.', 'ok');
  };

  const handleImportClick = () => {
    sfx.click();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const res = onImport(text);
      if (res.ok) showToast('Save imported successfully.', 'ok');
      else showToast(`Import failed: ${res.reason}`, 'err');
    } catch (err) {
      showToast('Could not read file.', 'err');
    } finally {
      e.target.value = '';
    }
  };

  const handleToggleNotifications = async () => {
    sfx.click();
    if (notifEnabled) {
      disableNotifications();
      setNotifEnabled(false);
      showToast('Reminders disabled.', 'info');
      return;
    }
    const res = await requestNotificationPermission();
    if (res.ok) {
      setNotifEnabled(true);
      showToast('Reminders enabled.', 'ok');
    } else {
      showToast(`Reminders denied (${res.reason}).`, 'err');
    }
  };

  const handleInstall = async () => {
    sfx.click();
    const res = await promptInstall();
    if (res.ok && res.outcome === 'accepted') showToast('Installing app...', 'ok');
    else if (res.reason === 'unavailable') showToast('Already installed or unsupported.', 'info');
  };

  return (
    <div className="bg-[#09090B] min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="bg-[#18181B] border-b-2 border-[#3F3F46] px-4 py-3 flex items-center gap-3">
        <button
          data-testid="settings-back-btn"
          onClick={() => { sfx.click(); onBack(); }}
          className="w-7 h-7 border-2 border-[#3F3F46] flex items-center justify-center text-zinc-300 hover:border-[#FF4500] hover:text-[#FF4500] transition-all"
        >
          <ArrowLeft size={14} />
        </button>
        <span className="font-pixel text-[#FF4500] text-[11px] flex-1">SETTINGS</span>
        <span className="font-pixel text-[8px] text-zinc-500">v{APP_VERSION}</span>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-4">
        {/* AUDIO & HAPTICS */}
        <div>
          <p className="font-pixel text-[8px] text-zinc-500 uppercase mb-2">Feedback</p>
          <div className="space-y-2">
            <Row
              testId="settings-sound-row"
              icon={muted ? VolumeX : Volume2}
              label="Sound Effects"
              hint="Chiptune SFX for combat, level up, chests."
              onClick={() => { sndToggle(); if (sndMuted() === false) sfx.click(); }}
              right={<Switch on={!muted} onClick={() => { sndToggle(); if (sndMuted() === false) sfx.click(); }} testId="settings-sound-switch" />}
            />
            <Row
              testId="settings-haptic-row"
              icon={hapticMuted ? Smartphone : SmartphoneNfc}
              label="Haptic Feedback"
              hint="Mobile vibration on chest open, hits, etc."
              onClick={() => { toggleHapticMuted(); if (!isHapticMuted()) vibrate(40); }}
              right={<Switch on={!hapticMuted} onClick={() => { toggleHapticMuted(); if (!isHapticMuted()) vibrate(40); }} testId="settings-haptic-switch" />}
            />
            <Row
              testId="settings-theme-row"
              icon={Palette}
              label="Theme: Forged Metal (Dark)"
              hint="Light theme coming in a future update."
              right={<Lock size={12} className="text-zinc-600" />}
              disabled
            />
          </div>
        </div>

        {/* LIFETIME STATS */}
        <div>
          <p className="font-pixel text-[8px] text-zinc-500 uppercase mb-2 flex items-center gap-1.5">
            <BarChart3 size={10} /> Lifetime Stats
          </p>
          <div className="grid grid-cols-2 gap-2">
            <StatChip Icon={Clock} label="MINUTES" value={lifetime.totalMinutes || 0} color="text-zinc-200" />
            <StatChip Icon={Skull} label="ENEMIES" value={lifetime.enemiesDefeated || 0} color="text-red-300" />
            <StatChip Icon={Coins} label="GOLD" value={lifetime.goldEarned || 0} color="text-[#FF8C00]" />
            <StatChip Icon={Gift} label="CHESTS" value={lifetime.chestsOpened || 0} color="text-purple-300" />
            <StatChip Icon={FlaskConical} label="POTIONS" value={lifetime.potionsDrunk || 0} color="text-emerald-300" />
            <StatChip Icon={Flame} label="STREAK" value={`${gameData.streak?.longest || 0}d`} color="text-[#FF4500]" />
          </div>
        </div>

        {/* SAVE DATA */}
        <div>
          <p className="font-pixel text-[8px] text-zinc-500 uppercase mb-2">Save Data</p>
          <div className="space-y-2">
            <Row testId="settings-export-row" icon={Download} label="Export Save" hint="Download your progress as JSON." onClick={handleExport} />
            <Row testId="settings-import-row" icon={Upload} label="Import Save" hint="Restore progress from a JSON file." onClick={handleImportClick} />
            <input ref={fileInputRef} type="file" accept="application/json,.json" onChange={handleFileChange} className="hidden" data-testid="settings-import-input" />
            <Row testId="settings-reset-tutorial-row" icon={BookOpen} label="Reset Tutorial" hint="Show the intro carousel again next launch." onClick={() => { sfx.click(); onResetTutorial(); showToast('Tutorial will show on next launch.', 'ok'); }} />
            <Row testId="settings-reset-game-row" icon={RefreshCw} label="Reset Game" hint="Erase all progress permanently." onClick={() => { sfx.click(); setConfirmReset(true); }} />
          </div>
        </div>

        {/* APP */}
        <div>
          <p className="font-pixel text-[8px] text-zinc-500 uppercase mb-2">App</p>
          <div className="space-y-2">
            <Row
              testId="settings-install-row"
              icon={DownloadCloud}
              label="Install App"
              hint={installAvailable ? 'Add to home screen for a native feel.' : 'Already installed or browser unsupported.'}
              onClick={installAvailable ? handleInstall : undefined}
              disabled={!installAvailable}
            />
            <Row
              testId="settings-notifications-row"
              icon={notifEnabled ? Bell : BellOff}
              label="Daily Reminders"
              hint="Local notifications when you skip a workout."
              onClick={handleToggleNotifications}
              right={<Switch on={notifEnabled} onClick={handleToggleNotifications} testId="settings-notifications-switch" />}
            />
          </div>
        </div>

        {/* FRIENDS PREVIEW */}
        <div>
          <p className="font-pixel text-[8px] text-zinc-500 uppercase mb-2">Community</p>
          <Row
            testId="settings-friends-row"
            icon={Users}
            label="Friends (Preview)"
            hint="Static prototype — backend coming soon."
            onClick={() => { sfx.click(); onOpenFriends(); }}
          />
        </div>

        {/* ABOUT */}
        <div>
          <p className="font-pixel text-[8px] text-zinc-500 uppercase mb-2">About</p>
          <div className="space-y-2">
            <div className="bg-[#18181B] border-2 border-[#3F3F46] p-3 flex items-center gap-3">
              <Info size={16} className="text-zinc-400" />
              <div className="flex-1">
                <p className="font-pixel text-[9px] text-zinc-100">Vitalis Pact</p>
                <p className="font-plex text-[10px] text-zinc-500 mt-0.5">Train your body. Forge your hero.</p>
              </div>
              <span className="font-pixel text-[8px] text-zinc-500">v{APP_VERSION}</span>
            </div>
            <Row testId="settings-privacy-row" icon={FileText} label="Privacy Policy" hint="All data is stored locally on your device." />
            <Row testId="settings-terms-row" icon={FileText} label="Terms of Service" hint="Coming soon." />
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div data-testid="settings-toast" className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-[10500] font-pixel text-[9px] px-3 py-2 border-2 ${
          toast.type === 'ok' ? 'bg-emerald-900/80 border-emerald-500 text-emerald-200'
          : toast.type === 'err' ? 'bg-red-900/80 border-red-500 text-red-200'
          : 'bg-[#27272A] border-[#52525B] text-zinc-200'
        }`}>
          {toast.msg}
        </div>
      )}

      {confirmReset && (
        <ConfirmResetModal
          onCancel={() => setConfirmReset(false)}
          onConfirm={() => { setConfirmReset(false); onResetGame(); }}
        />
      )}
    </div>
  );
};

export default Settings;
