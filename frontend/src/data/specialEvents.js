// Special Dynamic Event zones — separate from regular missions.
// Enemies dynamically scale to player stats × SCALE. Rewards are guaranteed epic + bonus gold.
// One event is "active" at a time, rotating every 12 hours deterministically.

export const SPECIAL_SCALE = 1.2;
export const ROTATION_MS = 12 * 60 * 60 * 1000; // 12 hours

export const SPECIAL_EVENTS = [
  {
    id: 'astral_rift',
    name: 'The Astral Rift',
    subtitle: 'A Tear in Reality',
    climate: 'Astral',
    gradient: 'from-indigo-950 via-purple-950 to-violet-900',
    accent: 'text-purple-300',
    accentBorder: 'border-purple-400/60',
    icon: 'Sparkles',
    lore: 'Stars bleed through a wound in the sky. What crawls out has no name in any tongue.',
    enemy: {
      name: 'Voidwoven Apparition',
      description: 'Born from impossible geometry. It folds the air to strike.',
      tier: 'III',
    },
    rewardGold: { min: 75, max: 100 },
    rewardLoot: 'Astral Shard',
  },
  {
    id: 'bloodmoon_coliseum',
    name: 'Bloodmoon Coliseum',
    subtitle: 'Where Ghosts Cheer',
    climate: 'Cursed',
    gradient: 'from-red-950 via-rose-950 to-black',
    accent: 'text-red-300',
    accentBorder: 'border-red-500/60',
    icon: 'Flame',
    lore: 'A crimson moon hangs over a ruined arena. The dead remember every contender.',
    enemy: {
      name: 'Ghostflame Gladiator',
      description: 'A burning silhouette in tarnished armor. It will not die again easily.',
      tier: 'III',
    },
    rewardGold: { min: 80, max: 100 },
    rewardLoot: 'Bloodmoon Sigil',
  },
  {
    id: 'forgotten_vault',
    name: "Forgotten God's Vault",
    subtitle: 'Gold Without a Master',
    climate: 'Sanctum',
    gradient: 'from-yellow-900 via-amber-950 to-zinc-950',
    accent: 'text-yellow-300',
    accentBorder: 'border-yellow-500/60',
    icon: 'Crown',
    lore: 'A tomb of a deity no one remembers. The treasury is still guarded.',
    enemy: {
      name: 'Gilded Sentinel',
      description: 'Cast in old gold and zealotry. Its strikes ring like bells.',
      tier: 'III',
    },
    rewardGold: { min: 85, max: 100 },
    rewardLoot: 'Gilded Relic',
  },
  {
    id: 'mirror_maw',
    name: 'The Mirror Maw',
    subtitle: 'Your Reflection Bites',
    climate: 'Mirror',
    gradient: 'from-cyan-900 via-slate-900 to-zinc-950',
    accent: 'text-cyan-300',
    accentBorder: 'border-cyan-400/60',
    icon: 'Sword',
    lore: 'A still lake that reflects something behind you, then steps out.',
    enemy: {
      name: 'Mirrorborn Twin',
      description: 'It moves a half-beat after you — and that is exactly how it lands the blow.',
      tier: 'III',
    },
    rewardGold: { min: 75, max: 95 },
    rewardLoot: 'Shard of Self',
  },
  {
    id: 'verdant_pyre',
    name: 'The Verdant Pyre',
    subtitle: 'Where Flowers Burn',
    climate: 'Wildfire',
    gradient: 'from-emerald-900 via-lime-900 to-orange-950',
    accent: 'text-lime-300',
    accentBorder: 'border-lime-400/60',
    icon: 'Flame',
    lore: 'The forest is on fire and yet still green. Something wants you to stay and watch.',
    enemy: {
      name: 'Smouldering Dryad',
      description: 'Bark burns slow. Her wrath does not.',
      tier: 'III',
    },
    rewardGold: { min: 80, max: 100 },
    rewardLoot: 'Charred Bloom',
  },
  {
    id: 'hollow_choir',
    name: 'The Hollow Choir',
    subtitle: 'Silence That Sings',
    climate: 'Sepulchral',
    gradient: 'from-slate-800 via-indigo-900 to-black',
    accent: 'text-indigo-300',
    accentBorder: 'border-indigo-400/60',
    icon: 'Sparkles',
    lore: 'An empty cathedral hums with the voices of those who never left.',
    enemy: {
      name: 'Chorister of Ash',
      description: 'A robe without a body. Each note it sings cracks bone.',
      tier: 'III',
    },
    rewardGold: { min: 78, max: 98 },
    rewardLoot: 'Hymn Fragment',
  },
  {
    id: 'tidewreck',
    name: 'Tidewreck Hollow',
    subtitle: 'A Sea That Climbs',
    climate: 'Tidal',
    gradient: 'from-cyan-950 via-teal-900 to-blue-950',
    accent: 'text-teal-300',
    accentBorder: 'border-teal-400/60',
    icon: 'Sword',
    lore: 'A ruined harbor where the sea forgot how to recede. It rises up the steps.',
    enemy: {
      name: 'Brinekin Reaver',
      description: 'Half-corpse, half-current. Strikes like a wave that learned cruelty.',
      tier: 'III',
    },
    rewardGold: { min: 75, max: 100 },
    rewardLoot: 'Sea-glass Tooth',
  },
  {
    id: 'duneborn_thrones',
    name: "Duneborn Thrones",
    subtitle: 'Kings Buried Standing',
    climate: 'Sands',
    gradient: 'from-yellow-800 via-orange-900 to-amber-950',
    accent: 'text-orange-300',
    accentBorder: 'border-orange-400/60',
    icon: 'Crown',
    lore: 'Beneath the dunes, monarchs sit upright in golden chairs. They notice visitors.',
    enemy: {
      name: 'Dust King Revenant',
      description: 'A crown of bone. A blade of glass. A patience of centuries.',
      tier: 'III',
    },
    rewardGold: { min: 82, max: 100 },
    rewardLoot: 'Dustborn Coin',
  },
  {
    id: 'nightmare_rookery',
    name: 'The Nightmare Rookery',
    subtitle: 'Where Dreams Roost',
    climate: 'Oneiric',
    gradient: 'from-fuchsia-950 via-purple-900 to-slate-950',
    accent: 'text-fuchsia-300',
    accentBorder: 'border-fuchsia-400/60',
    icon: 'Sparkles',
    lore: 'A cliff face hollow with nests. The eggs hatch into other people\'s fears.',
    enemy: {
      name: 'Fearfeather Stalker',
      description: 'Wings of woven dread. It knows what you avoid thinking about.',
      tier: 'III',
    },
    rewardGold: { min: 78, max: 100 },
    rewardLoot: 'Dreamfeather',
  },
  {
    id: 'iron_garden',
    name: 'The Iron Garden',
    subtitle: 'Steel That Grows',
    climate: 'Ferrous',
    gradient: 'from-zinc-800 via-stone-900 to-neutral-950',
    accent: 'text-zinc-200',
    accentBorder: 'border-zinc-300/60',
    icon: 'Sword',
    lore: 'Rows of weapons sprouted from the soil, polished by no hand. They tilt toward visitors.',
    enemy: {
      name: 'Bladegrown Sentinel',
      description: 'Pruned into a person-shape by an architect long dead.',
      tier: 'III',
    },
    rewardGold: { min: 80, max: 100 },
    rewardLoot: 'Sapling Edge',
  },
  {
    id: 'broken_constellation',
    name: 'The Broken Constellation',
    subtitle: 'A Sky That Forgot Itself',
    climate: 'Stellar',
    gradient: 'from-violet-950 via-blue-950 to-black',
    accent: 'text-violet-300',
    accentBorder: 'border-violet-400/60',
    icon: 'Sparkles',
    lore: 'A meadow where pieces of a fallen star still pulse. Something walks between them.',
    enemy: {
      name: 'Starshorn Pilgrim',
      description: 'A figure of cooling light. Its grief lashes like solar wind.',
      tier: 'III',
    },
    rewardGold: { min: 85, max: 100 },
    rewardLoot: 'Starshorn Tear',
  },
];

// Deterministic active event for the current 12h window
export const getActiveSpecialEvent = (now = Date.now()) => {
  const idx = Math.floor(now / ROTATION_MS) % SPECIAL_EVENTS.length;
  return { event: SPECIAL_EVENTS[idx], expiresAt: (Math.floor(now / ROTATION_MS) + 1) * ROTATION_MS };
};

// Build a mission-shaped object for an event tailored to the player's stats
export const buildSpecialMission = (event, stats) => {
  const baseHP = 10 + (stats.endurance || 1) * 5;
  const baseATK = (stats.strength || 1) * 2;
  const baseDodge = Math.min((stats.agility || 1) * 10, 60);

  return {
    id: `special_${event.id}`,
    name: event.name,
    lore: event.lore,
    requirement: { stat: 'endurance', value: 1 }, // always attemptable; difficulty is in stats
    loot: event.rewardLoot,
    successText: 'The Rift seals behind you. For now.',
    failText: 'The event pushes you back. Recover, train, and return before it vanishes.',
    enemy: {
      ...event.enemy,
      hp: Math.ceil(baseHP * SPECIAL_SCALE),
      attack: Math.ceil(baseATK * SPECIAL_SCALE) + 1,
      dodge: Math.floor(baseDodge / 2),
    },
    isSpecial: true,
    rewardGold: event.rewardGold,
    epicGuaranteed: true,
    eventId: event.id,
  };
};
