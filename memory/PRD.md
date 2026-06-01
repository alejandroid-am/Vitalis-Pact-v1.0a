# Fitness Quest - Product Requirements Document

## Original Problem Statement
A fitness app powered by RPG mechanics. The user flow is:
1. Exercise in real life
2. Open the app and log it manually
3. Earn XP and level up
4. Spend skill points and do "playable missions"

## Architecture
- **Frontend**: React (pure frontend, no backend)
- **State Persistence**: Browser LocalStorage (key: `fitness_quest_v1`)
- **Styling**: Tailwind CSS + framer-motion
- **Fonts**: Press Start 2P (pixel/headings), IBM Plex Sans (body)
- **Theme**: Dark mode, forge/iron/fire aesthetic (#09090B bg, #FF4500 accents)

## Implemented Features (MVP - June 2026)

### Onboarding Screen
- Hero name input (max 20 chars)
- Class selection: Warrior (+20% XP on Strength Training) or Rogue (+20% XP on Cardio)
- Validation and error messages
- Framer-motion entrance animation

### Camp Screen (Dashboard)
- Character banner with zone background image, class icon, name, level
- Animated XP bar (gradient, CSS transition)
- Stats summary row (STR, AGI, END)
- Class bonus indicator
- LOG WORKOUT button (primary CTA)

### Log Workout Modal
- Duration input (minutes)
- Activity type toggle: CARDIO or STRENGTH
- Real-time XP preview (3 XP/min, +20% class bonus)
- EARN XP submit button

### Level Up System
- 3 XP per minute of exercise
- +20% bonus for class-matching activity
- XP cap: starts at 100, scales +20% per level
- Gaining a level: +1 Skill Point (SP)
- Level Up modal with celebration animation

### Hero Screen (Skill Tree)
- Character summary with SP counter
- Stats upgrade: Strength, Agility, Endurance (spend 1 SP per +1 stat)
- Upgrade buttons disabled when SP = 0, highlighted when SP > 0
- Inventory section showing collected loot

### Exploration Screen (Quest Map)
- 3 climate zones: Emberwood (Forest), Ironpeak (Mountain), Ashveil (Desert)
- Each zone has background image + dark overlay
- Collapsible zone cards showing 3 missions each
- Mission cards: name, lore, requirement badge (green/red), loot, ATTEMPT button
- Mission result modal: SUCCESS (+ loot) or FAILED (+ motivational message)

### 9 Missions (Diablo 2 / Monster Hunter style chain)
**Emberwood**: Scout the Ashwood Trail (STR≥1), Hunt the Blazehound Pack (AGI≥2), Seal the Ember Shrine (END≥2)
**Ironpeak**: Clear the Rockslide (STR≥3), Cross the Shattered Cliffs (AGI≥3), Hold the Summit (END≥4)
**Ashveil**: March the Bone Road (END≥5), Hunt the Sand Wraith (AGI≥5), Break the Obsidian Spire (STR≥6)

### Data Model (LocalStorage)
```json
{
  "name": "string",
  "characterClass": "warrior|rogue",
  "level": 1,
  "xp": 0,
  "xpMax": 100,
  "sp": 0,
  "stats": { "strength": 1, "agility": 1, "endurance": 1 },
  "inventory": [{ "item": "...", "from": "...", "date": "..." }]
}
```

## Implemented - V2 (June 2026)

### Anti-Cheat System
- Session limit: 120 min max per log entry
- Daily limit: 240 min total per day (tracked in localStorage `fq_daily_workout`)
- Progress bar shows daily usage in real-time
- RPG-style error messages: "Even legendary warriors must rest" / "The forge is built during rest"

### Turn-Based Combat System (CombatModal)
- Replaced instant mission result with 3-phase modal: intro → combat → victory/defeat
- Player stats directly affect combat: STR=ATK damage, AGI=dodge%, END=max HP
- Mission Briefing intro: shows Hero vs Enemy stats comparison with tier badges
- Combat phase: live HP bars, animated combat log, ATTACK + FLEE actions
- 9 unique enemies across 3 tiers: Tier I (Emberwood), Tier II (Ironpeak), Tier III (Ashveil)
- Victory: loot claimed and added to inventory; Defeat: motivational RPG message

### Mindmap Roadmap (for future iterations)
- V3: Auto-sync with Apple Health / Strava / Garmin (X2 EXP for verified workouts)
- V4: Equipment system (armor, weapons, potions from loot); Coins/Gems economy
- V5: Full ARPG movement on mission map (incremental Option C) + Monster Hunter mission loops
- V6: Season Pass monetization + Weekly/Seasonal Challenges

## Implemented - V3 (Feb 2026) — Persistent HP & Economy/Market

### Persistent HP & Recovery System
- HP now persists across battles via `gameData.hp` in LocalStorage (no auto-heal at combat start)
- HP max scales with endurance: 10 base + 5 per END point
- Passive regen: 10% of max HP per hour (computed from `lastRegenAt` timestamp)
- Daily midnight full heal: triggered when `lastDailyHealDate` differs from today
- Auto-applied on app load + every 60s via interval
- "Too Weak To Fight" modal shown if attempting mission with HP=0
- Enemy stats buffed +17% (HP & ATK) to compensate persistent HP, via `ENEMY_BUFF=1.17` in App.js

### Economy / Market / Gacha Chest
- New `Market` screen wired into BottomNav (4 tabs total: Camp, Hero, Market, Explore)
- Gold (G) drops at end of combat: Tier I 15-20G, Tier II 18-25G, Tier III 22-30G
- Shop catalog:
  - Health Potion — 25G (restores 30% of max HP)
  - Mystery Chest — 100G (Gacha with `navigator.vibrate([100,100,100,400])` haptic)
  - Iron Adept Set (Tier I Common) — 250G (sell 75G)
  - Steelborn Set (Tier II Epic) — 600G (sell 180G)
- Mystery Chest drop rates: 60% Potion / 30% Common / 9% Epic / 1% Legendary
- Resale at 30% of price (gear sell value)
- Bag tab in Market shows potion count + gear with SELL buttons
- POTION action in CombatModal (between ATK and FLEE) — heals 30% max HP, enemy gets free hit after
- Use Potion from Camp and Hero screens too

### Visual & UX
- Gold pill (orange #FF8C00) in Camp, Hero, and Market headers
- HP bar with low-HP red state (<40%) in Camp and Hero
- Screen-shake animation on enemy hit (framer-motion)
- Chest reveal modal with tier-coloured glow (legendary has shine sweep)
- Toast notifications for purchases/sales in Market

### Updated Data Model
```json
{
  "name": "string",
  "characterClass": "warrior|rogue",
  "level": 1, "xp": 0, "xpMax": 100, "sp": 0,
  "stats": { "strength": 1, "agility": 1, "endurance": 1 },
  "inventory": [],            // quest trophies (read-only)
  "hp": 15,                   // persistent current HP
  "gold": 0,
  "potions": 0,
  "gear": [{ "id", "name", "tier", "sellValue" }],
  "lastRegenAt": "ISO",
  "lastDailyHealDate": "YYYY-MM-DD"
}
```

## Prioritized Backlog

## Implemented - V3.1 (Feb 2026) — Achievements, Daily Boost, Locked Zones, Stiffness, Special Events

### Apple Activity-style Achievements (30 medals)
- 10 progressive achievements × 3 tiers (Bronze/Silver/Gold)
- Iron Discipline (lifetime minutes), Long Road (longest streak), Hunter (enemies defeated), Treasure Hoarder (lifetime gold), Chest Gambler (chests opened), Mighty/Swift/Unyielding (stat tiers), Apothecary (potions drunk), Champion (special events)
- Live progress bars in Hero with tier badges and threshold dots
- Medal counter summary (🥉🥈🥇) at panel header
- Tracked via `gameData.lifetime` and `gameData.streak` objects

### Daily Gold Boost (progressive 7-day streak)
- Day 1 +25G → Day 2 +50G → ... → Day 7 +200G + free Mystery Chest
- Popup `DailyBoostModal` shows once per day with day chain D1-D7 and reward preview
- Auto-claimed when player logs ≥20 min workout that day
- Streak resets if a day is missed (gap > 1)
- Toast notification on claim

### OPEN BAG shortcut
- Hero screen has direct button to navigate to Market → BAG tab
- "Quest Relics" replaces former "Trophies" label

### New Zones Locked by Level
- Frostbite Tundra (Tundra) — unlocks at Level 6, 3 missions with Tier III enemies (Frostfang Reaver, Glassdust Stalker, Hollow Cold Sentinel)
- Caldera Volcano (Volcano) — unlocks at Level 9, 3 missions with Tier III enemies (Magma Constrictor, Cinderborn Marauder, Crater Watcher)
- Locked zones render grayscale with "UNLOCKS AT LEVEL X" badge
- Existing zones also have unlockLevel: Emberwood 1, Ironpeak 3, Ashveil 5

### Stiffness Debuff (Entumecido)
- Tracks `lastWorkoutAt` ISO timestamp; computed via `isStiff()` helper
- After 48h inactive: -30% damage dealt / +30% damage taken
- Red banner shown on Camp and Hero with "STIFFNESS — ENTUMECIDO"
- Combat intro shows debuff alert; multipliers applied in `CombatModal` (`STIFF_OUT=0.7`, `STIFF_IN=1.3`)
- Cured automatically on next workout

### Special Dynamic Events (separate fantastical zones)
- ⚡ SPECIAL EVENT card pinned to top of Exploration
- 4 unique events rotate every 12h deterministically: The Astral Rift, Bloodmoon Coliseum, Forgotten God's Vault, The Mirror Maw
- Live countdown timer to next rotation
- Enemy stats scale to player stats × 1.2 (HP, ATK, dodge halved)
- Rewards: 75-100G + **guaranteed epic gear** drop
- Defeating a special event increments `lifetime.specialEventsCompleted` (Champion achievement)
- Custom gradient backgrounds per event (no shared zone art)

### Updated Data Model (additions)
```json
{
  "lifetime": { "totalMinutes": 0, "enemiesDefeated": 0, "goldEarned": 0, "chestsOpened": 0, "potionsDrunk": 0, "specialEventsCompleted": 0 },
  "streak": { "current": 0, "longest": 0, "lastWorkoutDate": "YYYY-MM-DD" },
  "dailyBoost": { "currentStreak": 0, "lastClaimedDate": "YYYY-MM-DD" },
  "lastWorkoutAt": "ISO"
}
```

## Prioritized Backlog

## Implemented - V3.2 (Feb 2026) — Tutorial, Sound FX, Functional Gear

### Onboarding Tutorial Carousel
- 5-slide overlay on first launch after name/class selection
- Slides: Welcome → HP & Recovery → Market & Mystery Chests → Stiffness Debuff → Special Events
- Progress dots + SKIP button + final "BEGIN THE QUEST" CTA
- Persists via `localStorage.fq_tutorial_completed = '1'` (does not reappear)

### Sound FX System (Web Audio API, zero assets)
- Programmatic chiptune synthesizer in `/utils/sounds.js`
- 13 sound effects: click, hover, coin, potion, hit, critical, dodge, levelUp, chestOpen, victory, defeat, equip, purchase, achievement
- Lazy AudioContext (browser autoplay policy compliant); unlocked on first pointerdown
- Mute toggle in Camp header (Volume2/VolumeX icons); persisted to `localStorage.fq_sound_muted`
- Sounds wired throughout: combat, navigation, market, hero, daily boost, level up

### Functional Gear System
- Every gear item carries `slot` (weapon/armor/trinket) + `bonus` (STR/AGI/END)
- 3 equip slots, 1 item per slot; equipping replaces the slot's prior item
- Effective stats = base stats + sum of equipped gear bonuses
- Effective endurance feeds max HP calculation
- Effective STR/AGI/END drive combat (playerAttack, dodge, max HP)
- Hero shows Equipped section + per-attribute `base +bonus` emerald label
- Market BAG renders slot label + bonus text; EQUIP/UNEQUIP buttons; SELL disabled while equipped
- SHOP_ITEMS and GEAR_POOL (common/epic/legendary) all carry slot + bonus
- Bug fix: `buyGear`, `openMysteryChest`, `grantFreeChest` now persist `slot` + `bonus` on every gear entry
- Chest OPEN button is locked while reveal modal is on-screen (prevents race-condition double-opens)

### Data Model Additions
```json
{
  "equippedGearIds": { "weapon": null, "armor": null, "trinket": null }
}
```
Each gear entry now also includes: `{ slot: 'weapon'|'armor'|'trinket', bonus: { strength, agility, endurance } }`

## Prioritized Backlog

## Implemented - V3.3 (Feb 2026) — Weekly Challenges, History, Settings, Friends Prototype

### Weekly Challenge System
- 1 challenge per ISO week with 3 tiers (Bronze/Silver/Gold)
- 5 challenge templates rotate deterministically: Iron Will (minutes), Bloodletter (kills), Treasure Run (gold), Lucky Streak (chests), Potion Master (potions)
- Bronze 100G · Silver Mystery Chest · Gold Legendary gear guaranteed
- Live countdown to next reset (UTC week boundary)
- Progress bar with tier markers; CLAIM buttons unlock as thresholds are hit
- Tracked via `gameData.weekly` with auto-reset on week change (via `ensureWeekly` helper)

### Workout History
- New `workoutHistory` array in gameData (last 30 entries cap)
- Camp screen renders last 5 sessions with date (Today/Yesterday/MMM dd), type (STR/CARDIO/MOBILITY), minutes, XP gained, +20% bonus badge for class-bonus matches

### Settings Screen (full)
- Accessed via gear icon in Camp header (replaces previous mute toggle)
- Sections: Feedback (sound/haptic switches + theme lock), Lifetime Stats (6 chips), Save Data (export JSON, import JSON, reset tutorial, reset game), Community (Friends preview), About (version, privacy, terms)
- Reset Game flow: confirmation modal with case-insensitive 'RESET' input (accepts 'reset', 'Reset', 'RESET')
- BottomNav hidden on Settings/Friends screens (back-button navigation)
- Haptic feedback toggle persisted to `fq_haptic_muted`, respected by `Market` chest open vibrate

### Friends Prototype
- Static demo screen showing 5 mock friends ranked by total minutes
- Class icons, online dots, level, streak, minutes, gold, achievement counts
- Banner "PROTOTYPE PREVIEW — backend coming soon"

### Data Model Additions
```json
{
  "workoutHistory": [{ "id", "date", "minutes", "type", "xp", "bonus" }],
  "weekly": {
    "weekKey": "YYYY-Www",
    "challengeId": "iron_will|bloodletter|...",
    "progress": { "minutes", "enemiesDefeated", "goldEarned", "chestsOpened", "potionsDrunk" },
    "claimedTiers": { "bronze", "silver", "gold" }
  }
}
```

### Bug Fixes
- Settings ↔ Friends navigation loop: only main-tab screens (camp/hero/market/exploration) are tracked as `prevScreen`
- Nested `<button>` HTML warning in Settings rows with Switch right-slot: Row renders as `<div role="button">` when right-slot is interactive

## Prioritized Backlog

### P0 - Next Sprint (P2 polish)
- [ ] Confetti + modal on Achievement tier unlock ("🥇 GOLD UNLOCKED")
- [ ] Floating damage/heal numbers in combat (+9 / -5 floating up)
- [ ] More Special Events (expand from 4 to 12 for weekly variety)
- [ ] Share progress (canvas screenshot export of character card)
- [ ] Repeatable mission narrative variants

### P1 - High Value
- [ ] Workout history log (last 5 sessions on Camp screen)
- [ ] Daily streak tracker
- [ ] More mission zones (e.g., Frozen Tundra, Volcanic Caverns)
- [ ] Character level cap indicator

### P2 - Nice to Have
- [ ] Sound effects (pixel art sound on level up, mission success)
- [ ] Achievement system (first workout, level 10, etc.)
- [ ] Share progress button (screenshot of character card)
- [ ] Repeatable mission quest chain narrative (different text each attempt)

## Tech Constraints
- Pure frontend app (no backend, no auth)
- Mobile-first (max-w-md container)
- LocalStorage only (no cloud sync)
