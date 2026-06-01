import React, { useState, useEffect } from 'react';
import './App.css';
import { useGameData } from './hooks/useGameData';
import Onboarding from './components/Onboarding';
import Camp from './components/Camp';
import Hero from './components/Hero';
import Exploration from './components/Exploration';
import Market from './components/Market';
import BottomNav from './components/BottomNav';
import WorkoutModal from './components/WorkoutModal';
import LevelUpModal from './components/LevelUpModal';
import CombatModal from './components/CombatModal';
import DailyBoostModal from './components/DailyBoostModal';
import { GEAR_POOL } from './data/shop';

const ENEMY_BUFF = 1.17;
const todayKey = () => new Date().toISOString().split('T')[0];

function App() {
  const {
    gameData, updateGameData, addXP, upgradeStat, addToInventory,
    getDailyMinutes, recordDailyMinutes,
    getMaxHP, damagePlayer, setPlayerHP, usePotion,
    addGold, buyPotion, buyGear, sellGear, openMysteryChest, grantFreeChest, addGear, addPotion,
    recordWorkout, recordEnemyDefeat, isStiff, getDailyBoostStatus,
  } = useGameData();

  const [screen, setScreen] = useState('camp');
  const [marketTab, setMarketTab] = useState('shop');
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const [levelUpData, setLevelUpData] = useState(null);
  const [activeMission, setActiveMission] = useState(null);
  const [dailyBoostOpen, setDailyBoostOpen] = useState(false);
  const [boostClaimedToast, setBoostClaimedToast] = useState(null);

  const isOnboarding = !gameData.name || !gameData.characterClass;

  // Show Daily Boost popup once per day on app load (after onboarding)
  useEffect(() => {
    if (isOnboarding) return;
    const lastShown = localStorage.getItem('fq_boost_shown_date');
    if (lastShown !== todayKey()) {
      const status = getDailyBoostStatus();
      if (status.available) {
        setDailyBoostOpen(true);
        localStorage.setItem('fq_boost_shown_date', todayKey());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnboarding]);

  const handleOnboarding = (name, characterClass) => {
    updateGameData({ name, characterClass });
  };

  const handleLogWorkout = (minutes, activityType) => {
    recordDailyMinutes(minutes);
    const baseXP = minutes * 3;
    const isBonus =
      (gameData.characterClass === 'warrior' && activityType === 'strength') ||
      (gameData.characterClass === 'rogue' && activityType === 'cardio');
    const xpGained = isBonus ? Math.round(baseXP * 1.2) : baseXP;
    const { levelsGained, newLevel } = addXP(xpGained);

    // Record streak, lifetime minutes, lastWorkoutAt; auto-claim daily boost if applicable
    const boostClaim = recordWorkout(minutes);

    setWorkoutOpen(false);

    if (boostClaim) {
      addGold(boostClaim.gold);
      let chestDrop = null;
      if (boostClaim.chest) {
        const r = grantFreeChest();
        chestDrop = r.drop;
      }
      setBoostClaimedToast({ ...boostClaim, chestDrop });
      setTimeout(() => setBoostClaimedToast(null), 4500);
    }

    if (levelsGained > 0) {
      setLevelUpData({ levelsGained, newLevel, xpGained });
    }
  };

  const handleAttemptMission = (mission) => {
    if (mission.isSpecial) {
      // Special events: enemy already scaled in buildSpecialMission; don't buff again
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

    // Special events grant a guaranteed epic gear drop
    if (activeMission.isSpecial && activeMission.epicGuaranteed) {
      const pool = GEAR_POOL.epic;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      addGear(pick);
    }
    setActiveMission(null);
  };

  const handleCombatDefeat = () => setActiveMission(null);

  const handleOpenBag = () => {
    setMarketTab('bag');
    setScreen('market');
  };

  if (isOnboarding) {
    return <Onboarding onComplete={handleOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-md mx-auto min-h-screen relative pb-16">
        {screen === 'camp' && (
          <Camp
            gameData={gameData}
            maxHP={getMaxHP()}
            isStiff={isStiff()}
            onLogWorkout={() => setWorkoutOpen(true)}
            onUsePotion={usePotion}
          />
        )}
        {screen === 'hero' && (
          <Hero
            gameData={gameData}
            maxHP={getMaxHP()}
            isStiff={isStiff()}
            onUpgradeStat={upgradeStat}
            onUsePotion={usePotion}
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
          />
        )}
        {screen === 'exploration' && (
          <Exploration gameData={gameData} onAttemptMission={handleAttemptMission} />
        )}
        <BottomNav screen={screen} onNavigate={setScreen} />
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
          onPlayerDamage={damagePlayer}
          onSyncHP={setPlayerHP}
          onUsePotion={usePotion}
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
