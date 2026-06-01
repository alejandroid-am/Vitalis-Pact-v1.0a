// Shop catalog and gear pools for chest drops.
// Economy designed so 1 workout day ≈ 100G income.

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
    name: 'Iron Adept Set',
    description: 'Basic forged gear. Common quality.',
    price: 250,
    tier: 'I',
    sellValue: 75,
  },
  {
    id: 'gear_tier2',
    type: 'gear',
    name: 'Steelborn Set',
    description: 'Advanced battle gear. Refined quality.',
    price: 600,
    tier: 'II',
    sellValue: 180,
  },
];

// Pool of gear names per tier for chest drops.
export const GEAR_POOL = {
  common: [
    { name: 'Iron Shortsword', tier: 'I', sellValue: 75 },
    { name: 'Leather Bracers', tier: 'I', sellValue: 75 },
    { name: 'Forged Buckler', tier: 'I', sellValue: 75 },
    { name: 'Hunters Cloak', tier: 'I', sellValue: 75 },
  ],
  epic: [
    { name: 'Emberforged Blade', tier: 'II', sellValue: 180 },
    { name: 'Steelborn Gauntlets', tier: 'II', sellValue: 180 },
    { name: 'Ironpeak Pauldrons', tier: 'II', sellValue: 180 },
    { name: 'Wraithsilk Mantle', tier: 'II', sellValue: 180 },
  ],
  legendary: [
    { name: 'Ashen Crown', tier: 'L', sellValue: 600 },
    { name: 'Obsidian Reaver', tier: 'L', sellValue: 600 },
    { name: 'Summit Heart Amulet', tier: 'L', sellValue: 600 },
  ],
};

export const TIER_STYLES = {
  I: { text: 'text-amber-400', border: 'border-amber-600/60', bg: 'bg-amber-600/10', label: 'COMMON' },
  II: { text: 'text-zinc-200', border: 'border-zinc-300/60', bg: 'bg-zinc-300/10', label: 'EPIC' },
  L: { text: 'text-purple-300', border: 'border-purple-500/70', bg: 'bg-purple-500/15', label: 'LEGENDARY' },
  '?': { text: 'text-[#FF4500]', border: 'border-[#FF4500]/60', bg: 'bg-[#FF4500]/10', label: 'MYSTERY' },
};
