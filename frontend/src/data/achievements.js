// Apple Activity-style progressive achievements.
// 10 medals × 3 tiers (Bronze / Silver / Gold) = 30 unlockable goals.
//
// Each definition computes its current value from gameData.
// Tiers are progressive thresholds — earning Gold implies you also hold Silver+Bronze.

export const TIERS = ['bronze', 'silver', 'gold'];

export const TIER_META = {
  bronze: { label: 'BRONZE', color: 'text-amber-600', border: 'border-amber-700/70', bg: 'bg-amber-700/15' },
  silver: { label: 'SILVER', color: 'text-zinc-200',  border: 'border-zinc-300/70', bg: 'bg-zinc-300/10' },
  gold:   { label: 'GOLD',   color: 'text-yellow-300', border: 'border-yellow-400/80', bg: 'bg-yellow-400/15' },
};

// Helper: derive the highest tier earned given a numeric value and tier thresholds
export const tierForValue = (value, thresholds) => {
  let earned = null;
  TIERS.forEach((t, i) => {
    if (value >= thresholds[i]) earned = t;
  });
  return earned;
};

// Returns next threshold and remaining progress to next tier
export const nextTierProgress = (value, thresholds) => {
  for (let i = 0; i < TIERS.length; i++) {
    if (value < thresholds[i]) {
      return { next: TIERS[i], target: thresholds[i], progress: value, pct: Math.min(100, (value / thresholds[i]) * 100) };
    }
  }
  return { next: null, target: thresholds[2], progress: value, pct: 100 };
};

// IconName must map to a lucide-react icon name imported in AchievementsPanel
export const ACHIEVEMENTS = [
  {
    id: 'iron_discipline',
    name: 'Iron Discipline',
    icon: 'Clock',
    description: 'Total minutes trained (lifetime).',
    unit: 'min',
    thresholds: [100, 500, 1000],
    getValue: (gd) => gd.lifetime?.totalMinutes || 0,
  },
  {
    id: 'long_road',
    name: 'The Long Road',
    icon: 'Flame',
    description: 'Longest daily streak.',
    unit: 'days',
    thresholds: [7, 30, 100],
    getValue: (gd) => gd.streak?.longest || 0,
  },
  {
    id: 'hunter',
    name: 'Hunter',
    icon: 'Skull',
    description: 'Enemies defeated.',
    unit: '',
    thresholds: [10, 50, 200],
    getValue: (gd) => gd.lifetime?.enemiesDefeated || 0,
  },
  {
    id: 'hoarder',
    name: 'Treasure Hoarder',
    icon: 'Coins',
    description: 'Total gold earned.',
    unit: 'G',
    thresholds: [500, 5000, 20000],
    getValue: (gd) => gd.lifetime?.goldEarned || 0,
  },
  {
    id: 'gambler',
    name: 'Chest Gambler',
    icon: 'Gift',
    description: 'Mystery Chests opened.',
    unit: '',
    thresholds: [10, 50, 200],
    getValue: (gd) => gd.lifetime?.chestsOpened || 0,
  },
  {
    id: 'mighty',
    name: 'Mighty',
    icon: 'Dumbbell',
    description: 'Strength attribute.',
    unit: 'STR',
    thresholds: [5, 10, 20],
    getValue: (gd) => gd.stats?.strength || 0,
  },
  {
    id: 'swift',
    name: 'Swift',
    icon: 'Zap',
    description: 'Agility attribute.',
    unit: 'AGI',
    thresholds: [5, 10, 20],
    getValue: (gd) => gd.stats?.agility || 0,
  },
  {
    id: 'unyielding',
    name: 'Unyielding',
    icon: 'Heart',
    description: 'Endurance attribute.',
    unit: 'END',
    thresholds: [5, 10, 20],
    getValue: (gd) => gd.stats?.endurance || 0,
  },
  {
    id: 'apothecary',
    name: 'Apothecary',
    icon: 'FlaskConical',
    description: 'Potions consumed.',
    unit: '',
    thresholds: [10, 50, 200],
    getValue: (gd) => gd.lifetime?.potionsDrunk || 0,
  },
  {
    id: 'champion',
    name: 'Champion',
    icon: 'Sparkles',
    description: 'Special Events conquered.',
    unit: '',
    thresholds: [1, 10, 50],
    getValue: (gd) => gd.lifetime?.specialEventsCompleted || 0,
  },
];

// ── Daily Boost progressive rewards ──────────────────────
// Day 1 → day 6: increasing gold. Day 7+ caps with gold + free chest.
export const DAILY_BOOST_TARGET_MIN = 20;

export const DAILY_BOOST_REWARDS = [
  { day: 1, gold: 25,  chest: false },
  { day: 2, gold: 50,  chest: false },
  { day: 3, gold: 75,  chest: false },
  { day: 4, gold: 100, chest: false },
  { day: 5, gold: 125, chest: false },
  { day: 6, gold: 150, chest: false },
  { day: 7, gold: 200, chest: true  }, // day 7+ cap
];

export const getBoostReward = (streakDay) => {
  const idx = Math.min(streakDay - 1, DAILY_BOOST_REWARDS.length - 1);
  return DAILY_BOOST_REWARDS[Math.max(0, idx)];
};
