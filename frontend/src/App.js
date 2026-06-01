import React, { useState } from 'react';
import './App.css';
import { useGameData } from './hooks/useGameData';
import Onboarding from './components/Onboarding';
import Camp from './components/Camp';
import Hero from './components/Hero';
import Exploration from './components/Exploration';
import BottomNav from './components/BottomNav';
import WorkoutModal from './components/WorkoutModal';
import LevelUpModal from './components/LevelUpModal';
import CombatModal from './components/CombatModal';

function App() {
  const {
    gameData, updateGameData, addXP, upgradeStat, addToInventory,
    getDailyMinutes, recordDailyMinutes,
  } = useGameData();

  const [screen, setScreen] = useState('camp');
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const [levelUpData, setLevelUpData] = useState(null);
  const [activeMission, setActiveMission] = useState(null);

  const isOnboarding = !gameData.name || !gameData.characterClass;

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
    setWorkoutOpen(false);
    if (levelsGained > 0) {
      setLevelUpData({ levelsGained, newLevel, xpGained });
    }
  };

  const handleAttemptMission = (mission) => setActiveMission(mission);

  const handleCombatVictory = () => {
    addToInventory(activeMission.loot, activeMission.name);
    setActiveMission(null);
  };

  const handleCombatDefeat = () => setActiveMission(null);

  if (isOnboarding) {
    return <Onboarding onComplete={handleOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-md mx-auto min-h-screen relative pb-16">
        {screen === 'camp' && (
          <Camp gameData={gameData} onLogWorkout={() => setWorkoutOpen(true)} />
        )}
        {screen === 'hero' && (
          <Hero gameData={gameData} onUpgradeStat={upgradeStat} />
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
          onVictory={handleCombatVictory}
          onDefeat={handleCombatDefeat}
          onClose={() => setActiveMission(null)}
        />
      )}
    </div>
  );
}

export default App;
