import { useState, useEffect, useCallback, useRef } from 'react';
import { GEAR_POOL } from '../data/shop';
import { DAILY_BOOST_TARGET_MIN, getBoostReward } from '../data/achievements';
import {
  getWeekKey, getChallengeForWeek, getEarnedWeeklyTier,
  WEEKLY_CHALLENGES, TIER_REWARDS,
} from '../data/weeklyChallenges';

const STORAGE_KEY = 'fitness_quest_v1';
const STIFFNESS_THRESHOLD_MS = 48 * 60 * 60 * 1000;

export const getMaxHP = (stats) => 10 + (stats?.endurance || 1) * 5;

const nowISO = () => new Date().toISOString();
const todayKey = () => new Date().toISOString().split('T')[0];

const daysBetween = (d1, d2) => {
  const a = new Date(`${d1}T00:00:00Z`).getTime();
  const b = new Date(`${d2}T00:00:00Z`).getTime();
  return Math.round((b - a) / (24 * 3600 * 1000));
};

const INITIAL_STATE = {
  name: '',
  characterClass: '',
  level: 1,
  xp: 0,
  xpMax: 100,
  sp: 0,
  stats: { strength: 1, agility: 1, endurance: 1 },
  inventory: [],
  hp: 15,
  gold: 0,
  potions: 0,
  gear: [],
  equippedGearIds: { weapon: null, armor: null, trinket: null },
  lastRegenAt: null,
  lastDailyHealDate: null,
  // V3.1 additions
  lifetime: {
    totalMinutes: 0,
    enemiesDefeated: 0,
    goldEarned: 0,
    chestsOpened: 0,
    potionsDrunk: 0,
    specialEventsCompleted: 0,
  },
  streak: { current: 0, longest: 0, lastWorkoutDate: null },
  dailyBoost: { currentStreak: 0, lastClaimedDate: null },
  lastWorkoutAt: null,
  // V3.3 additions
  workoutHistory: [],   // last 30 sessions
  weekly: { weekKey: null, challengeId: null,
            progress: { minutes: 0, enemiesDefeated: 0, goldEarned: 0, chestsOpened: 0, potionsDrunk: 0 },
            claimedTiers: { bronze: false, silver: false, gold: false } },
  // V3.4 additions
  seenAchievementTiers: {},  // { achievementId: 'bronze'|'silver'|'gold' }
};

// Sum of bonuses from equipped gear items.
export const sumGearBonus = (gear, equippedGearIds) => {
  const total = { strength: 0, agility: 0, endurance: 0 };
  if (!gear || !equippedGearIds) return total;
  for (const slot of Object.keys(equippedGearIds)) {
    const id = equippedGearIds[slot];
    if (!id) continue;
    const item = gear.find(g => g.id === id);
    if (!item || !item.bonus) continue;
    total.strength += item.bonus.strength || 0;
    total.agility += item.bonus.agility || 0;
    total.endurance += item.bonus.endurance || 0;
  }
  return total;
};

// Effective combat stats = base stats + equipped gear bonuses
export const getEffectiveStats = (data) => {
  const bonus = sumGearBonus(data.gear, data.equippedGearIds);
  return {
    strength: (data.stats?.strength || 1) + bonus.strength,
    agility:  (data.stats?.agility || 1) + bonus.agility,
    endurance:(data.stats?.endurance || 1) + bonus.endurance,
  };
};

// Returns a fresh weekly slice if the stored week is stale.
const ensureWeekly = (prevWeekly) => {
  const currentKey = getWeekKey();
  if (prevWeekly && prevWeekly.weekKey === currentKey) return prevWeekly;
  const challenge = getChallengeForWeek(currentKey);
  return {
    weekKey: currentKey,
    challengeId: challenge.id,
    progress: { minutes: 0, enemiesDefeated: 0, goldEarned: 0, chestsOpened: 0, potionsDrunk: 0 },
    claimedTiers: { bronze: false, silver: false, gold: false },
  };
};

const bumpWeekly = (prevWeekly, metric, delta) => {
  const weekly = ensureWeekly(prevWeekly);
  return {
    ...weekly,
    progress: { ...weekly.progress, [metric]: (weekly.progress[metric] || 0) + delta },
  };
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
          equippedGearIds: { ...INITIAL_STATE.equippedGearIds, ...(parsed.equippedGearIds || {}) },
          lifetime: { ...INITIAL_STATE.lifetime, ...(parsed.lifetime || {}) },
          streak: { ...INITIAL_STATE.streak, ...(parsed.streak || {}) },
          dailyBoost: { ...INITIAL_STATE.dailyBoost, ...(parsed.dailyBoost || {}) },
          workoutHistory: parsed.workoutHistory || [],
          weekly: { ...INITIAL_STATE.weekly, ...(parsed.weekly || {}),
                    progress: { ...INITIAL_STATE.weekly.progress, ...((parsed.weekly && parsed.weekly.progress) || {}) },
                    claimedTiers: { ...INITIAL_STATE.weekly.claimedTiers, ...((parsed.weekly && parsed.weekly.claimedTiers) || {}) } },
          seenAchievementTiers: { ...INITIAL_STATE.seenAchievementTiers, ...(parsed.seenAchievementTiers || {}) },
        };
        if (typeof merged.hp !== 'number' || merged.hp <= 0) {
          merged.hp = getMaxHP(merged.stats);
        }
        return merged;
      }
    } catch (err) {
      console.error('[useGameData] Failed to parse saved game from LocalStorage:', err);
    }
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
    let result = { levelsGained: 0, newLevel: 1 };
    setGameData(prev => {
      let { level, xp, xpMax, sp } = prev;
      xp += xpToAdd;
      let levelsGained = 0;

      while (xp >= xpMax) {
        xp -= xpMax;
        level++;
        sp++;
        levelsGained++;
        xpMax = Math.round(xpMax * 1.2);
      }

      result = { levelsGained, newLevel: level };
      return { ...prev, level, xp, xpMax, sp };
    });
    return result;
  };

  const upgradeStat = (stat) => {
    let ok = false;
    setGameData(prev => {
      if (prev.sp <= 0) return prev;
      const newStats = { ...prev.stats, [stat]: prev.stats[stat] + 1 };
      const hpBonus = stat === 'endurance' ? 5 : 0;
      const effective = {
        ...newStats,
        endurance: newStats.endurance + sumGearBonus(prev.gear, prev.equippedGearIds).endurance,
      };
      ok = true;
      return {
        ...prev,
        sp: prev.sp - 1,
        stats: newStats,
        hp: Math.min(getMaxHP(effective), prev.hp + hpBonus),
      };
    });
    return ok;
  };

  // ─── QUEST LOOT (relics) ───────────────────────────────
  const addToInventory = (item, missionName) => {
    const entry = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
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
  const damagePlayer = useCallback((amount) => {
    setGameData(prev => ({
      ...prev,
      hp: Math.max(0, prev.hp - amount),
      lastRegenAt: nowISO(),
    }));
  }, []);

  const healPlayer = useCallback((amount) => {
    setGameData(prev => {
      const max = getMaxHP(getEffectiveStats(prev));
      return { ...prev, hp: Math.min(max, prev.hp + amount) };
    });
  }, []);

  const setPlayerHP = useCallback((hp) => {
    setGameData(prev => {
      const max = getMaxHP(getEffectiveStats(prev));
      return { ...prev, hp: Math.max(0, Math.min(max, hp)) };
    });
  }, []);

  const usePotion = useCallback(() => {
    let ok = false;
    setGameData(prev => {
      if (prev.potions <= 0) return prev;
      const max = getMaxHP(getEffectiveStats(prev));
      if (prev.hp >= max) return prev;
      const healAmt = Math.ceil(max * 0.3);
      ok = true;
      return {
        ...prev,
        potions: prev.potions - 1,
        hp: Math.min(max, prev.hp + healAmt),
        lifetime: { ...prev.lifetime, potionsDrunk: (prev.lifetime?.potionsDrunk || 0) + 1 },
        weekly: bumpWeekly(prev.weekly, 'potionsDrunk', 1),
      };
    });
    return ok;
  }, []);

  const applyRecovery = useCallback(() => {
    setGameData(prev => {
      const max = getMaxHP(getEffectiveStats(prev));
      let { hp, lastRegenAt, lastDailyHealDate } = prev;
      const today = todayKey();
      let changed = false;

      if (lastDailyHealDate !== today) {
        hp = max;
        lastDailyHealDate = today;
        changed = true;
      }

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
      }

      return changed ? { ...prev, hp, lastRegenAt, lastDailyHealDate } : prev;
    });
  }, []);

  // ─── ECONOMY ────────────────────────────────────────────
  const addGold = useCallback((amount) => {
    setGameData(prev => ({
      ...prev,
      gold: prev.gold + amount,
      lifetime: { ...prev.lifetime, goldEarned: (prev.lifetime?.goldEarned || 0) + Math.max(0, amount) },
      weekly: amount > 0 ? bumpWeekly(prev.weekly, 'goldEarned', amount) : ensureWeekly(prev.weekly),
    }));
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
      // Auto-unequip if currently equipped
      const newEquipped = { ...prev.equippedGearIds };
      for (const slot of Object.keys(newEquipped)) {
        if (newEquipped[slot] === gearId) newEquipped[slot] = null;
      }
      return {
        ...prev,
        gear: prev.gear.filter(g => g.id !== gearId),
        equippedGearIds: newEquipped,
        gold: prev.gold + (item.sellValue || 0),
      };
    });
  }, []);

  // Equip a gear item into its slot. Replaces whatever was equipped in that slot.
  const equipGear = useCallback((gearId) => {
    setGameData(prev => {
      const item = prev.gear.find(g => g.id === gearId);
      if (!item || !item.slot) return prev;
      return {
        ...prev,
        equippedGearIds: { ...prev.equippedGearIds, [item.slot]: gearId },
      };
    });
  }, []);

  const unequipGear = useCallback((gearId) => {
    setGameData(prev => {
      const newEquipped = { ...prev.equippedGearIds };
      for (const slot of Object.keys(newEquipped)) {
        if (newEquipped[slot] === gearId) newEquipped[slot] = null;
      }
      return { ...prev, equippedGearIds: newEquipped };
    });
  }, []);

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
        slot: shopItem.slot,
        bonus: shopItem.bonus,
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
        dropEntry = { kind, ...pool[Math.floor(Math.random() * pool.length)] };
      } else if (roll < 99) {
        kind = 'epic';
        const pool = GEAR_POOL.epic;
        dropEntry = { kind, ...pool[Math.floor(Math.random() * pool.length)] };
      } else {
        kind = 'legendary';
        const pool = GEAR_POOL.legendary;
        dropEntry = { kind, ...pool[Math.floor(Math.random() * pool.length)] };
      }

      result = { ok: true, drop: dropEntry };

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
          slot: dropEntry.slot,
          bonus: dropEntry.bonus,
        };
        newGear = [entry, ...newGear].slice(0, 60);
        result.drop.entryId = entry.id;
      }

      return {
        ...prev,
        gold: prev.gold - price,
        potions: newPotions,
        gear: newGear,
        lifetime: { ...prev.lifetime, chestsOpened: (prev.lifetime?.chestsOpened || 0) + 1 },
        weekly: bumpWeekly(prev.weekly, 'chestsOpened', 1),
      };
    });

    return result;
  }, []);

  // Grant a free Mystery Chest open (for Daily Boost day 7 reward)
  const grantFreeChest = useCallback(() => {
    let result = { drop: null };

    setGameData(prev => {
      const roll = Math.random() * 100;
      let kind, dropEntry;
      if (roll < 60) { kind = 'potion'; dropEntry = { kind, name: 'Health Potion' }; }
      else if (roll < 90) { kind = 'common'; const p = GEAR_POOL.common; dropEntry = { kind, ...p[Math.floor(Math.random() * p.length)] }; }
      else if (roll < 99) { kind = 'epic'; const p = GEAR_POOL.epic; dropEntry = { kind, ...p[Math.floor(Math.random() * p.length)] }; }
      else { kind = 'legendary'; const p = GEAR_POOL.legendary; dropEntry = { kind, ...p[Math.floor(Math.random() * p.length)] }; }

      result.drop = dropEntry;

      let newPotions = prev.potions;
      let newGear = prev.gear;
      if (kind === 'potion') newPotions += 1;
      else {
        const entry = {
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          name: dropEntry.name,
          tier: dropEntry.tier,
          sellValue: dropEntry.sellValue,
          slot: dropEntry.slot,
          bonus: dropEntry.bonus,
        };
        newGear = [entry, ...newGear].slice(0, 60);
      }

      return {
        ...prev,
        potions: newPotions,
        gear: newGear,
        lifetime: { ...prev.lifetime, chestsOpened: (prev.lifetime?.chestsOpened || 0) + 1 },
        weekly: bumpWeekly(prev.weekly, 'chestsOpened', 1),
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
    } catch (err) {
      console.error('[useGameData] Failed to read fq_daily_workout:', err);
      return 0;
    }
  };

  const recordDailyMinutes = (minutes) => {
    const today = todayKey();
    const data = JSON.parse(localStorage.getItem('fq_daily_workout') || '{}');
    const total = (data.date === today ? (data.totalMinutes || 0) : 0) + minutes;
    localStorage.setItem('fq_daily_workout', JSON.stringify({ date: today, totalMinutes: total }));
  };

  // ─── LIFETIME / STREAK / WORKOUT ────────────────────────
  // Called on every successful workout submit. Updates streak, lifetime minutes,
  // lastWorkoutAt (for stiffness), workoutHistory, weekly progress;
  // returns whether the daily boost should be claimed now.
  const recordWorkout = useCallback((minutes, activityType, xpGained, isBonus) => {
    let boostClaim = null;
    setGameData(prev => {
      const today = todayKey();
      const last = prev.streak?.lastWorkoutDate;
      let current = prev.streak?.current || 0;
      let longest = prev.streak?.longest || 0;

      if (last === today) {
        // already counted today — keep streak as-is
      } else if (!last) {
        current = 1;
      } else {
        const gap = daysBetween(last, today);
        current = gap === 1 ? current + 1 : 1;
      }
      if (current > longest) longest = current;

      // Daily boost logic
      const todayMins = (() => {
        try {
          const d = JSON.parse(localStorage.getItem('fq_daily_workout') || '{}');
          return d.date === today ? (d.totalMinutes || 0) : 0;
        } catch (err) {
          console.error('[useGameData] Failed to read daily minutes for boost:', err);
          return 0;
        }
      })();

      let newBoost = prev.dailyBoost || { currentStreak: 0, lastClaimedDate: null };
      if (todayMins >= DAILY_BOOST_TARGET_MIN && newBoost.lastClaimedDate !== today) {
        let boostStreak;
        if (!newBoost.lastClaimedDate) boostStreak = 1;
        else {
          const gap = daysBetween(newBoost.lastClaimedDate, today);
          boostStreak = gap === 1 ? newBoost.currentStreak + 1 : 1;
        }
        const reward = getBoostReward(boostStreak);
        boostClaim = { day: boostStreak, ...reward };
        newBoost = { currentStreak: boostStreak, lastClaimedDate: today };
      }

      // Workout history entry
      const historyEntry = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        date: nowISO(),
        minutes: Math.max(0, minutes),
        type: activityType || 'cardio',
        xp: xpGained || 0,
        bonus: !!isBonus,
      };

      return {
        ...prev,
        lastWorkoutAt: nowISO(),
        streak: { current, longest, lastWorkoutDate: today },
        lifetime: { ...prev.lifetime, totalMinutes: (prev.lifetime?.totalMinutes || 0) + Math.max(0, minutes) },
        dailyBoost: newBoost,
        workoutHistory: [historyEntry, ...(prev.workoutHistory || [])].slice(0, 30),
        weekly: bumpWeekly(prev.weekly, 'minutes', Math.max(0, minutes)),
      };
    });
    return boostClaim;
  }, []);

  const recordEnemyDefeat = useCallback(({ isSpecial = false } = {}) => {
    setGameData(prev => ({
      ...prev,
      lifetime: {
        ...prev.lifetime,
        enemiesDefeated: (prev.lifetime?.enemiesDefeated || 0) + 1,
        specialEventsCompleted: (prev.lifetime?.specialEventsCompleted || 0) + (isSpecial ? 1 : 0),
      },
      weekly: bumpWeekly(prev.weekly, 'enemiesDefeated', 1),
    }));
  }, []);

  // ─── STIFFNESS ──────────────────────────────────────────
  const isStiff = useCallback(() => {
    if (!gameData.lastWorkoutAt) return false;
    return (Date.now() - new Date(gameData.lastWorkoutAt).getTime()) > STIFFNESS_THRESHOLD_MS;
  }, [gameData.lastWorkoutAt]);

  // ─── DAILY BOOST helpers ────────────────────────────────
  // Returns info for popup: { available, streakDay, target }
  const getDailyBoostStatus = useCallback(() => {
    const today = todayKey();
    const last = gameData.dailyBoost?.lastClaimedDate;
    const claimed = last === today;
    // Predicted streak day if user trains today
    let nextDay;
    if (!last) nextDay = 1;
    else {
      const gap = daysBetween(last, today);
      nextDay = gap === 1 ? (gameData.dailyBoost.currentStreak + 1) : 1;
    }
    const reward = getBoostReward(claimed ? gameData.dailyBoost.currentStreak : nextDay);
    return {
      available: !claimed,
      claimed,
      nextDay: claimed ? gameData.dailyBoost.currentStreak : nextDay,
      target: DAILY_BOOST_TARGET_MIN,
      todayMinutes: getDailyMinutes(),
      reward,
    };
  }, [gameData.dailyBoost]);

  // ─── WEEKLY CHALLENGE ───────────────────────────────────
  const getWeeklyInfo = useCallback(() => {
    const weekly = ensureWeekly(gameData.weekly);
    const challenge = WEEKLY_CHALLENGES.find(c => c.id === weekly.challengeId) || getChallengeForWeek(weekly.weekKey);
    const value = weekly.progress[challenge.metric] || 0;
    const earned = getEarnedWeeklyTier(value, challenge.thresholds);
    return { weekly, challenge, value, earned };
  }, [gameData.weekly]);

  // Claim a tier reward (gold/chest/legendary gear). Only if reached + not already claimed.
  const claimWeeklyTier = useCallback((tier) => {
    let result = { ok: false, reason: 'unreached', drop: null };
    setGameData(prev => {
      const weekly = ensureWeekly(prev.weekly);
      const challenge = WEEKLY_CHALLENGES.find(c => c.id === weekly.challengeId) || getChallengeForWeek(weekly.weekKey);
      const value = weekly.progress[challenge.metric] || 0;
      const reached = value >= challenge.thresholds[tier];
      if (!reached) { result = { ok: false, reason: 'unreached' }; return prev; }
      if (weekly.claimedTiers[tier]) { result = { ok: false, reason: 'claimed' }; return prev; }

      const reward = TIER_REWARDS[tier];
      let nextGold = prev.gold;
      let nextPotions = prev.potions;
      let nextGear = prev.gear;
      let drop = null;

      if (reward.gold > 0) nextGold += reward.gold;
      if (reward.chest) {
        // Inline mystery roll (mimics openMysteryChest but free)
        const roll = Math.random() * 100;
        let kind, pickEntry;
        if (roll < 60) { kind = 'potion'; pickEntry = { name: 'Health Potion' }; }
        else if (roll < 90) { kind = 'common'; const p = GEAR_POOL.common; pickEntry = p[Math.floor(Math.random() * p.length)]; }
        else if (roll < 99) { kind = 'epic'; const p = GEAR_POOL.epic; pickEntry = p[Math.floor(Math.random() * p.length)]; }
        else { kind = 'legendary'; const p = GEAR_POOL.legendary; pickEntry = p[Math.floor(Math.random() * p.length)]; }
        drop = { kind, ...pickEntry };
        if (kind === 'potion') nextPotions += 1;
        else nextGear = [{ id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, name: pickEntry.name, tier: pickEntry.tier, sellValue: pickEntry.sellValue, slot: pickEntry.slot, bonus: pickEntry.bonus }, ...nextGear].slice(0, 60);
      }
      if (reward.legendary) {
        const p = GEAR_POOL.legendary;
        const pick = p[Math.floor(Math.random() * p.length)];
        drop = { kind: 'legendary', ...pick };
        nextGear = [{ id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, name: pick.name, tier: pick.tier, sellValue: pick.sellValue, slot: pick.slot, bonus: pick.bonus }, ...nextGear].slice(0, 60);
      }

      result = { ok: true, drop };
      return {
        ...prev,
        gold: nextGold,
        potions: nextPotions,
        gear: nextGear,
        weekly: { ...weekly, claimedTiers: { ...weekly.claimedTiers, [tier]: true } },
      };
    });
    return result;
  }, []);

  // ─── SAVE EXPORT / IMPORT / RESET ───────────────────────
  const exportSave = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw || JSON.stringify(gameData);
    } catch (err) {
      console.error('[useGameData] exportSave failed:', err);
      return JSON.stringify(gameData);
    }
  }, [gameData]);

  const importSave = useCallback((jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object' || !parsed.name) {
        return { ok: false, reason: 'invalid_shape' };
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      setGameData({ ...INITIAL_STATE, ...parsed });
      return { ok: true };
    } catch (err) {
      console.error('[useGameData] importSave failed:', err);
      return { ok: false, reason: 'parse_error' };
    }
  }, []);

  const resetTutorial = useCallback(() => {
    try { localStorage.removeItem('fq_tutorial_completed'); } catch (err) {
      console.error('[useGameData] resetTutorial failed:', err);
    }
  }, []);

  // Mark an achievement tier as "seen" so we don't re-show the unlock modal.
  const markAchievementSeen = useCallback((achievementId, tier) => {
    setGameData(prev => ({
      ...prev,
      seenAchievementTiers: { ...prev.seenAchievementTiers, [achievementId]: tier },
    }));
  }, []);

  const resetGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('fq_daily_workout');
    localStorage.removeItem('fq_tutorial_completed');
    localStorage.removeItem('fq_boost_shown_date');
    setGameData({ ...INITIAL_STATE });
  };

  // Auto recovery on mount + every minute
  const recoveryTimerRef = useRef(null);
  useEffect(() => {
    applyRecovery();
    recoveryTimerRef.current = setInterval(applyRecovery, 60_000);
    return () => clearInterval(recoveryTimerRef.current);
  }, [applyRecovery]);

  // Ensure weekly slice is up-to-date on mount and at week boundaries.
  useEffect(() => {
    setGameData(prev => {
      const fresh = ensureWeekly(prev.weekly);
      return fresh === prev.weekly ? prev : { ...prev, weekly: fresh };
    });
  }, []);

  return {
    gameData,
    updateGameData,
    addXP,
    upgradeStat,
    addToInventory,
    resetGame,
    getDailyMinutes,
    recordDailyMinutes,
    getEffectiveStats: () => getEffectiveStats(gameData),
    getMaxHP: () => getMaxHP(getEffectiveStats(gameData)),
    damagePlayer,
    healPlayer,
    setPlayerHP,
    usePotion,
    addGold,
    spendGold,
    addPotion,
    addGear,
    sellGear,
    equipGear,
    unequipGear,
    buyPotion,
    buyGear,
    openMysteryChest,
    grantFreeChest,
    applyRecovery,
    recordWorkout,
    recordEnemyDefeat,
    isStiff,
    getDailyBoostStatus,
    // V3.3
    getWeeklyInfo,
    claimWeeklyTier,
    exportSave,
    importSave,
    resetTutorial,
    markAchievementSeen,
  };
}
