import { useState, useEffect, useCallback, useRef } from 'react';
import { GEAR_POOL } from '../data/shop';

const STORAGE_KEY = 'fitness_quest_v1';

// HP scales with endurance: 10 base + 5 per END point
export const getMaxHP = (stats) => 10 + (stats?.endurance || 1) * 5;

const nowISO = () => new Date().toISOString();
const todayKey = () => new Date().toISOString().split('T')[0];

const INITIAL_STATE = {
  name: '',
  characterClass: '',
  level: 1,
  xp: 0,
  xpMax: 100,
  sp: 0,
  stats: { strength: 1, agility: 1, endurance: 1 },
  inventory: [],        // quest loot trophies (read-only)
  // V3 additions
  hp: 15,               // current HP (persisted)
  gold: 0,
  potions: 0,
  gear: [],             // [{ id, name, tier, sellValue }]
  lastRegenAt: null,    // ISO timestamp of last regen tick
  lastDailyHealDate: null, // 'YYYY-MM-DD' of last midnight heal
};

export function useGameData() {
  const [gameData, setGameData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged = {
          ...INITIAL_STATE,
          ...parsed,
          stats: { ...INITIAL_STATE.stats, ...parsed.stats },
          inventory: parsed.inventory || [],
          gear: parsed.gear || [],
        };
        // Migration: ensure hp set
        if (typeof merged.hp !== 'number' || merged.hp <= 0) {
          merged.hp = getMaxHP(merged.stats);
        }
        return merged;
      }
    } catch {}
    return { ...INITIAL_STATE };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameData));
  }, [gameData]);

  const updateGameData = (updates) => {
    setGameData(prev => ({ ...prev, ...updates }));
  };

  // ─── XP & LEVEL ────────────────────────────────────────
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
    setGameData(prev => {
      const newStats = { ...prev.stats, [stat]: prev.stats[stat] + 1 };
      // If endurance upgraded, also bump current HP by the +5 gained
      const hpBonus = stat === 'endurance' ? 5 : 0;
      return {
        ...prev,
        sp: prev.sp - 1,
        stats: newStats,
        hp: Math.min(getMaxHP(newStats), prev.hp + hpBonus),
      };
    });
    return true;
  };

  // ─── QUEST LOOT (trophies) ─────────────────────────────
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

  // ─── HP & RECOVERY ─────────────────────────────────────
  // Damage and heal helpers update gameData immediately.
  const damagePlayer = useCallback((amount) => {
    setGameData(prev => ({
      ...prev,
      hp: Math.max(0, prev.hp - amount),
    }));
  }, []);

  const healPlayer = useCallback((amount) => {
    setGameData(prev => {
      const max = getMaxHP(prev.stats);
      return { ...prev, hp: Math.min(max, prev.hp + amount) };
    });
  }, []);

  const setPlayerHP = useCallback((hp) => {
    setGameData(prev => {
      const max = getMaxHP(prev.stats);
      return { ...prev, hp: Math.max(0, Math.min(max, hp)) };
    });
  }, []);

  const usePotion = useCallback(() => {
    let ok = false;
    setGameData(prev => {
      if (prev.potions <= 0) return prev;
      const max = getMaxHP(prev.stats);
      if (prev.hp >= max) return prev; // already full
      const healAmt = Math.ceil(max * 0.3);
      ok = true;
      return {
        ...prev,
        potions: prev.potions - 1,
        hp: Math.min(max, prev.hp + healAmt),
      };
    });
    return ok;
  }, []);

  // Apply passive regen + midnight full heal. Idempotent on call.
  const applyRecovery = useCallback(() => {
    setGameData(prev => {
      const max = getMaxHP(prev.stats);
      let { hp, lastRegenAt, lastDailyHealDate } = prev;
      const today = todayKey();
      let changed = false;

      // Daily midnight heal — if we crossed into a new day since last heal
      if (lastDailyHealDate !== today) {
        hp = max;
        lastDailyHealDate = today;
        changed = true;
      }

      // Passive regen at 10% max per hour, only if not full
      if (hp < max && lastRegenAt) {
        const elapsedMs = Date.now() - new Date(lastRegenAt).getTime();
        const hours = elapsedMs / (1000 * 60 * 60);
        if (hours > 0) {
          const regen = Math.floor(max * 0.1 * hours);
          if (regen > 0) {
            hp = Math.min(max, hp + regen);
            lastRegenAt = nowISO();
            changed = true;
          }
        }
      } else if (!lastRegenAt) {
        lastRegenAt = nowISO();
        changed = true;
      } else if (hp >= max) {
        // Reset regen marker when full so accumulation doesn't dump on first hit
        if (lastRegenAt !== nowISO()) {
          lastRegenAt = nowISO();
          changed = true;
        }
      }

      return changed ? { ...prev, hp, lastRegenAt, lastDailyHealDate } : prev;
    });
  }, []);

  // ─── ECONOMY ────────────────────────────────────────────
  const addGold = useCallback((amount) => {
    setGameData(prev => ({ ...prev, gold: prev.gold + amount }));
  }, []);

  const spendGold = useCallback((amount) => {
    let ok = false;
    setGameData(prev => {
      if (prev.gold < amount) return prev;
      ok = true;
      return { ...prev, gold: prev.gold - amount };
    });
    return ok;
  }, []);

  const addPotion = useCallback((qty = 1) => {
    setGameData(prev => ({ ...prev, potions: prev.potions + qty }));
  }, []);

  const addGear = useCallback((gearItem) => {
    const entry = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      ...gearItem,
    };
    setGameData(prev => ({ ...prev, gear: [entry, ...prev.gear].slice(0, 60) }));
    return entry;
  }, []);

  const sellGear = useCallback((gearId) => {
    setGameData(prev => {
      const item = prev.gear.find(g => g.id === gearId);
      if (!item) return prev;
      return {
        ...prev,
        gear: prev.gear.filter(g => g.id !== gearId),
        gold: prev.gold + (item.sellValue || 0),
      };
    });
  }, []);

  // ─── SHOP PURCHASES ─────────────────────────────────────
  const buyPotion = useCallback((price = 25) => {
    let result = { ok: false, reason: 'gold' };
    setGameData(prev => {
      if (prev.gold < price) return prev;
      result = { ok: true };
      return { ...prev, gold: prev.gold - price, potions: prev.potions + 1 };
    });
    return result;
  }, []);

  const buyGear = useCallback((shopItem) => {
    let result = { ok: false, reason: 'gold', item: null };
    setGameData(prev => {
      if (prev.gold < shopItem.price) return prev;
      const entry = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: shopItem.name,
        tier: shopItem.tier,
        sellValue: shopItem.sellValue,
      };
      result = { ok: true, item: entry };
      return {
        ...prev,
        gold: prev.gold - shopItem.price,
        gear: [entry, ...prev.gear].slice(0, 60),
      };
    });
    return result;
  }, []);

  // ─── MYSTERY CHEST (Gacha) ─────────────────────────────
  // Returns { ok, drop: { kind: 'potion'|'common'|'epic'|'legendary', item } }
  const openMysteryChest = useCallback((price = 100) => {
    let result = { ok: false, reason: 'gold', drop: null };

    setGameData(prev => {
      if (prev.gold < price) return prev;

      const roll = Math.random() * 100;
      let kind, dropEntry;

      if (roll < 60) {
        kind = 'potion';
        dropEntry = { kind, name: 'Health Potion' };
      } else if (roll < 90) {
        kind = 'common';
        const pool = GEAR_POOL.common;
        const pick = pool[Math.floor(Math.random() * pool.length)];
        dropEntry = { kind, ...pick };
      } else if (roll < 99) {
        kind = 'epic';
        const pool = GEAR_POOL.epic;
        const pick = pool[Math.floor(Math.random() * pool.length)];
        dropEntry = { kind, ...pick };
      } else {
        kind = 'legendary';
        const pool = GEAR_POOL.legendary;
        const pick = pool[Math.floor(Math.random() * pool.length)];
        dropEntry = { kind, ...pick };
      }

      result = { ok: true, drop: dropEntry };

      // Apply effects
      let newPotions = prev.potions;
      let newGear = prev.gear;
      if (kind === 'potion') {
        newPotions += 1;
      } else {
        const entry = {
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          name: dropEntry.name,
          tier: dropEntry.tier,
          sellValue: dropEntry.sellValue,
        };
        newGear = [entry, ...newGear].slice(0, 60);
        result.drop.entryId = entry.id;
      }

      return {
        ...prev,
        gold: prev.gold - price,
        potions: newPotions,
        gear: newGear,
      };
    });

    return result;
  }, []);

  // ─── DAILY WORKOUT TRACKING (anti-cheat) ───────────────
  const getDailyMinutes = () => {
    try {
      const today = todayKey();
      const data = JSON.parse(localStorage.getItem('fq_daily_workout') || '{}');
      return data.date === today ? (data.totalMinutes || 0) : 0;
    } catch { return 0; }
  };

  const recordDailyMinutes = (minutes) => {
    const today = todayKey();
    const data = JSON.parse(localStorage.getItem('fq_daily_workout') || '{}');
    const total = (data.date === today ? (data.totalMinutes || 0) : 0) + minutes;
    localStorage.setItem('fq_daily_workout', JSON.stringify({ date: today, totalMinutes: total }));
  };

  const resetGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('fq_daily_workout');
    setGameData({ ...INITIAL_STATE });
  };

  // ─── Auto recovery on mount + every minute ─────────────
  const recoveryTimerRef = useRef(null);
  useEffect(() => {
    applyRecovery();
    recoveryTimerRef.current = setInterval(applyRecovery, 60_000);
    return () => clearInterval(recoveryTimerRef.current);
  }, [applyRecovery]);

  return {
    gameData,
    updateGameData,
    addXP,
    upgradeStat,
    addToInventory,
    resetGame,
    getDailyMinutes,
    recordDailyMinutes,
    // V3
    getMaxHP: () => getMaxHP(gameData.stats),
    damagePlayer,
    healPlayer,
    setPlayerHP,
    usePotion,
    addGold,
    spendGold,
    addPotion,
    addGear,
    sellGear,
    buyPotion,
    buyGear,
    openMysteryChest,
    applyRecovery,
  };
}
