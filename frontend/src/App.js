import React, { useState, useEffect } from 'react';
import './App.css';
import { useGameData } from './hooks/useGameData';
import Onboarding from './components/Onboarding';
import Camp from './components/Camp';
import Hero from './components/Hero';
import Exploration from './components/Exploration';
import Market from './components/Market';
import Settings from './components/Settings';
import Friends from './components/Friends';
import BottomNav from './components/BottomNav';
import WorkoutModal from './components/WorkoutModal';
import LevelUpModal from './components/LevelUpModal';
import CombatModal from './components/CombatModal';
import DailyBoostModal from './components/DailyBoostModal';
import TutorialOverlay from './components/TutorialOverlay';
import { GEAR_POOL } from './data/shop';
import { sfx, unlockAudio } from './utils/sounds';

const ENEMY_BUFF = 1.17;
const TUTORIAL_KEY = 'fq_tutorial_completed';
const todayKey = () => new Date().toISOString().split('T')[0];

function App() {
  const {
    gameData, updateGameData, addXP, upgradeStat, addToInventory,
    getDailyMinutes, recordDailyMinutes,
    getMaxHP, getEffectiveStats, damagePlayer, setPlayerHP, usePotion: drinkPotion,
    addGold, buyPotion, buyGear, sellGear, equipGear, unequipGear,
    openMysteryChest, grantFreeChest, addGear, addPotion,
    recordWorkout, recordEnemyDefeat, isStiff, getDailyBoostStatus,
    getWeeklyInfo, claimWeeklyTier, exportSave, importSave, resetTutorial, resetGame,
  } = useGameData();

  const [screen, setScreen] = useState('camp');
  const [prevScreen, setPrevScreen] = useState('camp');
  const [marketTab, setMarketTab] = useState('shop');
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const [levelUpData, setLevelUpData] = useState(null);
  const [activeMission, setActiveMission] = useState(null);
  const [dailyBoostOpen, setDailyBoostOpen] = useState(false);
  const [boostClaimedToast, setBoostClaimedToast] = useState(null);
  const [tutorialOpen, setTutorialOpen] = useState(false);

  const isOnboarding = !gameData.name || !gameData.characterClass;

  // Unlock audio on first user interaction
  useEffect(() => {
    const handler = () => { unlockAudio(); window.removeEventListener('pointerdown', handler); };
    window.addEventListener('pointerdown', handler);
    return () => window.removeEventListener('pointerdown', handler);
  }, []);

  // Tutorial on first launch after onboarding
  useEffect(() => {
    if (isOnboarding) return;
    const done = localStorage.getItem(TUTORIAL_KEY) === '1';
    if (!done) setTutorialOpen(true);
  }, [isOnboarding]);

  // Daily boost popup once per day on load (after tutorial)
  useEffect(() => {
    if (isOnboarding || tutorialOpen) return;
    const lastShown = localStorage.getItem('fq_boost_shown_date');
    if (lastShown !== todayKey()) {
      const status = getDailyBoostStatus();
      if (status.available) {
        setDailyBoostOpen(true);
        localStorage.setItem('fq_boost_shown_date', todayKey());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnboarding, tutorialOpen]);

  const navigate = (s) => {
    sfx.click();
    setPrevScreen(screen);
    setScreen(s);
  };

  const handleOnboarding = (name, characterClass) => {
    updateGameData({ name, characterClass });
  };

  const handleTutorialComplete = () => {
    localStorage.setItem(TUTORIAL_KEY, '1');
    setTutorialOpen(false);
  };

  const handleLogWorkout = (minutes, activityType) => {
    recordDailyMinutes(minutes);
    const baseXP = minutes * 3;
    const isBonus =
      (gameData.characterClass === 'warrior' && activityType === 'strength') ||
      (gameData.characterClass === 'rogue' && activityType === 'cardio');
    const xpGained = isBonus ? Math.round(baseXP * 1.2) : baseXP;
    const { levelsGained, newLevel } = addXP(xpGained);

    const boostClaim = recordWorkout(minutes, activityType, xpGained, isBonus);

    setWorkoutOpen(false);

    if (boostClaim) {
      addGold(boostClaim.gold);
      sfx.coin();
      let chestDrop = null;
      if (boostClaim.chest) {
        const r = grantFreeChest();
        chestDrop = r.drop;
        sfx.chestOpen();
      }
      setBoostClaimedToast({ ...boostClaim, chestDrop });
      setTimeout(() => setBoostClaimedToast(null), 4500);
    }

    if (levelsGained > 0) {
      sfx.levelUp();
      setLevelUpData({ levelsGained, newLevel, xpGained });
    }
  };

  const handleAttemptMission = (mission) => {
    if (mission.isSpecial) {
      setActiveMission(mission);
      return;
    }
    const buffedMission = {
      ...mission,
      enemy: {
        ...mission.enemy,
        hp: Math.ceil(mission.enemy.hp * ENEMY_BUFF),
        attack: Math.ceil(mission.enemy.attack * ENEMY_BUFF),
      },
    };
    setActiveMission(buffedMission);
  };

  const handleCombatVictory = (goldEarned) => {
    addToInventory(activeMission.loot, activeMission.name);
    if (goldEarned > 0) addGold(goldEarned);
    recordEnemyDefeat({ isSpecial: !!activeMission.isSpecial });

    if (activeMission.isSpecial && activeMission.epicGuaranteed) {
      const pool = GEAR_POOL.epic;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      addGear(pick);
    }
    setActiveMission(null);
  };

  const handleCombatDefeat = () => setActiveMission(null);

  const handleOpenBag = () => {
    sfx.click();
    setMarketTab('bag');
    setPrevScreen(screen);
    setScreen('market');
  };

  if (isOnboarding) {
    return <Onboarding onComplete={handleOnboarding} />;
  }

  const effStats = getEffectiveStats();
  const weeklyInfo = getWeeklyInfo();
  const showBottomNav = !['settings', 'friends'].includes(screen);

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className={`max-w-md mx-auto min-h-screen relative ${showBottomNav ? 'pb-16' : ''}`}>
        {screen === 'camp' && (
          <Camp
            gameData={gameData}
            maxHP={getMaxHP()}
            isStiff={isStiff()}
            weeklyInfo={weeklyInfo}
            onLogWorkout={() => { sfx.click(); setWorkoutOpen(true); }}
            onUsePotion={() => { const ok = drinkPotion(); if (ok) sfx.potion(); return ok; }}
            onOpenSettings={() => navigate('settings')}
            onClaimWeeklyTier={claimWeeklyTier}
          />
        )}
        {screen === 'hero' && (
          <Hero
            gameData={gameData}
            maxHP={getMaxHP()}
            isStiff={isStiff()}
            effectiveStats={effStats}
            onUpgradeStat={(s) => { const ok = upgradeStat(s); if (ok) sfx.click(); return ok; }}
            onUsePotion={() => { const ok = drinkPotion(); if (ok) sfx.potion(); return ok; }}
            onOpenBag={handleOpenBag}
          />
        )}
        {screen === 'market' && (
          <Market
            gameData={gameData}
            initialTab={marketTab}
            onBuyPotion={buyPotion}
            onBuyGear={buyGear}
            onOpenChest={openMysteryChest}
            onSellGear={sellGear}
            onEquipGear={equipGear}
            onUnequipGear={unequipGear}
          />
        )}
        {screen === 'exploration' && (
          <Exploration gameData={gameData} onAttemptMission={handleAttemptMission} />
        )}
        {screen === 'settings' && (
          <Settings
            gameData={gameData}
            onBack={() => navigate(prevScreen === 'settings' ? 'camp' : prevScreen)}
            onOpenFriends={() => navigate('friends')}
            onResetGame={() => { resetGame(); setScreen('camp'); }}
            onResetTutorial={resetTutorial}
            onExport={exportSave}
            onImport={importSave}
          />
        )}
        {screen === 'friends' && (
          <Friends onBack={() => navigate('settings')} />
        )}
        {showBottomNav && <BottomNav screen={screen} onNavigate={navigate} />}
      </div>

      {workoutOpen && (
        <WorkoutModal
          characterClass={gameData.characterClass}
          getDailyMinutes={getDailyMinutes}
          onClose={() => setWorkoutOpen(false)}
          onSubmit={handleLogWorkout}
        />
      )}
      {levelUpData && (
        <LevelUpModal data={levelUpData} onClose={() => setLevelUpData(null)} />
      )}
      {activeMission && (
        <CombatModal
          mission={activeMission}
          gameData={gameData}
          maxHP={getMaxHP()}
          isStiff={isStiff()}
          effectiveStats={effStats}
          onPlayerDamage={damagePlayer}
          onSyncHP={setPlayerHP}
          onUsePotion={drinkPotion}
          onVictory={handleCombatVictory}
          onDefeat={handleCombatDefeat}
          onClose={() => setActiveMission(null)}
        />
      )}
      {dailyBoostOpen && (
        <DailyBoostModal
          status={getDailyBoostStatus()}
          onClose={() => setDailyBoostOpen(false)}
        />
      )}
      {tutorialOpen && (
        <TutorialOverlay onComplete={handleTutorialComplete} />
      )}
      {boostClaimedToast && (
        <div
          data-testid="boost-claimed-toast"
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[10300] font-pixel text-[9px] bg-[#FF8C00] text-black px-4 py-3 border-2 border-[#FF4500] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse-glow"
        >
          DAILY BOOST CLAIMED · +{boostClaimedToast.gold}G
          {boostClaimedToast.chest ? ' + FREE CHEST!' : ''}
        </div>
      )}
    </div>
  );
}

export default App;
