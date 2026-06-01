import { useState, useEffect } from 'react';

const STORAGE_KEY = 'fitness_quest_v1';

const INITIAL_STATE = {
  name: '',
  characterClass: '',
  level: 1,
  xp: 0,
  xpMax: 100,
  sp: 0,
  stats: { strength: 1, agility: 1, endurance: 1 },
  inventory: [],
};

export function useGameData() {
  const [gameData, setGameData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...INITIAL_STATE,
          ...parsed,
          stats: { ...INITIAL_STATE.stats, ...parsed.stats },
          inventory: parsed.inventory || [],
        };
      }
    } catch {}
    return INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameData));
  }, [gameData]);

  const updateGameData = (updates) => {
    setGameData(prev => ({ ...prev, ...updates }));
  };

  const addXP = (xpToAdd) => {
    let { level, xp, xpMax, sp } = gameData;
    xp += xpToAdd;
    let levelsGained = 0;

    while (xp >= xpMax) {
      xp -= xpMax;
      level++;
      sp++;
      levelsGained++;
      xpMax = Math.round(xpMax * 1.2);
    }

    setGameData(prev => ({ ...prev, level, xp, xpMax, sp }));
    return { levelsGained, newLevel: level };
  };

  const upgradeStat = (stat) => {
    if (gameData.sp <= 0) return false;
    setGameData(prev => ({
      ...prev,
      sp: prev.sp - 1,
      stats: { ...prev.stats, [stat]: prev.stats[stat] + 1 },
    }));
    return true;
  };

  const addToInventory = (item, missionName) => {
    const entry = {
      item,
      from: missionName,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
    setGameData(prev => ({
      ...prev,
      inventory: [entry, ...prev.inventory].slice(0, 60),
    }));
  };

  const resetGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    setGameData(INITIAL_STATE);
  };

  return { gameData, updateGameData, addXP, upgradeStat, addToInventory, resetGame };
}
