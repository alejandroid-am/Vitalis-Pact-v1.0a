// Weekly Challenge system — 1 challenge per week with 3 tiers (Bronze/Silver/Gold).
// Challenge rotates deterministically based on ISO week.

export const WEEKLY_CHALLENGES = [
  {
    id: 'iron_will',
    name: 'Iron Will',
    icon: 'Clock',
    metric: 'minutes',
    unit: 'min',
    description: 'Train this many total minutes this week.',
    thresholds: { bronze: 100, silver: 200, gold: 300 },
  },
  {
    id: 'bloodletter',
    name: 'Bloodletter',
    icon: 'Skull',
    metric: 'enemiesDefeated',
    unit: 'kills',
    description: 'Defeat this many enemies this week.',
    thresholds: { bronze: 10, silver: 25, gold: 50 },
  },
  {
    id: 'treasure_run',
    name: 'Treasure Run',
    icon: 'Coins',
    metric: 'goldEarned',
    unit: 'G',
    description: 'Earn this much gold this week.',
    thresholds: { bronze: 200, silver: 500, gold: 1000 },
  },
  {
    id: 'lucky_streak',
    name: 'Lucky Streak',
    icon: 'Gift',
    metric: 'chestsOpened',
    unit: 'chests',
    description: 'Open this many Mystery Chests this week.',
    thresholds: { bronze: 3, silver: 7, gold: 15 },
  },
  {
    id: 'potion_master',
    name: 'Potion Master',
    icon: 'FlaskConical',
    metric: 'potionsDrunk',
    unit: 'sips',
    description: 'Drink this many potions this week.',
    thresholds: { bronze: 5, silver: 12, gold: 25 },
  },
];

export const TIER_REWARDS = {
  bronze: { label: 'BRONZE', gold: 100,  chest: false, legendary: false },
  silver: { label: 'SILVER', gold: 0,    chest: true,  legendary: false },
  gold:   { label: 'GOLD',   gold: 0,    chest: false, legendary: true  },
};

export const TIER_COLORS = {
  bronze: { text: 'text-amber-500', border: 'border-amber-700/60', bg: 'bg-amber-700/15', bar: 'from-amber-800 to-amber-500' },
  silver: { text: 'text-zinc-200',  border: 'border-zinc-300/60', bg: 'bg-zinc-300/10', bar: 'from-zinc-500 to-zinc-200' },
  gold:   { text: 'text-yellow-300', border: 'border-yellow-400/70', bg: 'bg-yellow-400/15', bar: 'from-yellow-600 to-yellow-300' },
};

// ISO 8601 week key (e.g., '2026-W06'). Deterministic per UTC week.
export const getWeekKey = (d = new Date()) => {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
};

export const getChallengeForWeek = (weekKey) => {
  let h = 0;
  for (let i = 0; i < weekKey.length; i++) h = ((h << 5) - h + weekKey.charCodeAt(i)) | 0;
  return WEEKLY_CHALLENGES[Math.abs(h) % WEEKLY_CHALLENGES.length];
};

// Returns next ISO Monday 00:00 UTC; for countdown rendering
export const msUntilNextWeek = (now = new Date()) => {
  const d = new Date(now);
  d.setUTCHours(0, 0, 0, 0);
  const day = d.getUTCDay() || 7;
  const daysUntilMonday = (8 - day) % 7 || 7;
  d.setUTCDate(d.getUTCDate() + daysUntilMonday);
  return d.getTime() - now.getTime();
};

// Get the highest tier achieved given progress
export const getEarnedWeeklyTier = (progress, thresholds) => {
  if (progress >= thresholds.gold) return 'gold';
  if (progress >= thresholds.silver) return 'silver';
  if (progress >= thresholds.bronze) return 'bronze';
  return null;
};
