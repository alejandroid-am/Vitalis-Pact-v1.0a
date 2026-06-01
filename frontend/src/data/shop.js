// Shop catalog and gear pools for chest drops.
// V3.2: each gear item has a slot (weapon/armor/trinket) and a bonus to base stats.
// Players can equip ONE item per slot; bonuses sum into effective combat stats.

export const SLOTS = ['weapon', 'armor', 'trinket'];

export const SLOT_LABEL = {
  weapon: 'WEAPON',
  armor:  'ARMOR',
  trinket:'TRINKET',
};

export const SHOP_ITEMS = [
  {
    id: 'potion_hp',
    type: 'potion',
    name: 'Health Potion',
    description: 'Restores 30% of max HP. Usable anywhere.',
    price: 25,
    tier: 'I',
  },
  {
    id: 'mystery_chest',
    type: 'chest',
    name: 'Mystery Chest',
    description: 'Random drop. 60% Potion · 30% Common · 9% Epic · 1% Legendary.',
    price: 100,
    tier: '?',
  },
  {
    id: 'gear_tier1',
    type: 'gear',
    name: 'Iron Adept Plate',
    description: 'Basic forged armor. +1 Endurance.',
    price: 250,
    tier: 'I',
    sellValue: 75,
    slot: 'armor',
    bonus: { strength: 0, agility: 0, endurance: 1 },
  },
  {
    id: 'gear_tier2',
    type: 'gear',
    name: 'Steelborn Cuirass',
    description: 'Advanced battle armor. +1 STR, +2 END.',
    price: 600,
    tier: 'II',
    sellValue: 180,
    slot: 'armor',
    bonus: { strength: 1, agility: 0, endurance: 2 },
  },
];

// Gear pools for Mystery Chest drops. All include slot + bonus.
export const GEAR_POOL = {
  common: [
    { name: 'Iron Shortsword', tier: 'I', sellValue: 75, slot: 'weapon',  bonus: { strength: 1, agility: 0, endurance: 0 } },
    { name: 'Leather Bracers', tier: 'I', sellValue: 75, slot: 'armor',   bonus: { strength: 0, agility: 0, endurance: 1 } },
    { name: 'Forged Buckler',  tier: 'I', sellValue: 75, slot: 'armor',   bonus: { strength: 0, agility: 0, endurance: 1 } },
    { name: 'Hunters Cloak',   tier: 'I', sellValue: 75, slot: 'trinket', bonus: { strength: 0, agility: 1, endurance: 0 } },
  ],
  epic: [
    { name: 'Emberforged Blade',    tier: 'II', sellValue: 180, slot: 'weapon',  bonus: { strength: 2, agility: 0, endurance: 0 } },
    { name: 'Steelborn Gauntlets',  tier: 'II', sellValue: 180, slot: 'weapon',  bonus: { strength: 1, agility: 0, endurance: 1 } },
    { name: 'Ironpeak Pauldrons',   tier: 'II', sellValue: 180, slot: 'armor',   bonus: { strength: 0, agility: 0, endurance: 2 } },
    { name: 'Wraithsilk Mantle',    tier: 'II', sellValue: 180, slot: 'trinket', bonus: { strength: 0, agility: 2, endurance: 0 } },
  ],
  legendary: [
    { name: 'Ashen Crown',          tier: 'L',  sellValue: 600, slot: 'trinket', bonus: { strength: 1, agility: 1, endurance: 1 } },
    { name: 'Obsidian Reaver',      tier: 'L',  sellValue: 600, slot: 'weapon',  bonus: { strength: 3, agility: 0, endurance: 0 } },
    { name: 'Summit Heart Amulet',  tier: 'L',  sellValue: 600, slot: 'trinket', bonus: { strength: 0, agility: 1, endurance: 2 } },
  ],
};

export const TIER_STYLES = {
  I: { text: 'text-amber-400', border: 'border-amber-600/60', bg: 'bg-amber-600/10', label: 'COMMON' },
  II: { text: 'text-zinc-200', border: 'border-zinc-300/60', bg: 'bg-zinc-300/10', label: 'EPIC' },
  L: { text: 'text-purple-300', border: 'border-purple-500/70', bg: 'bg-purple-500/15', label: 'LEGENDARY' },
  '?': { text: 'text-[#FF4500]', border: 'border-[#FF4500]/60', bg: 'bg-[#FF4500]/10', label: 'MYSTERY' },
};
