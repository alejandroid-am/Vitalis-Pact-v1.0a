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

### P0 - Next Sprint (remaining V3 features)
- [ ] **Stiffness Debuff (Entumecido)**: track `lastWorkoutTimestamp`; if >48h inactive apply -30% dmg dealt / +30% dmg taken; visible status on Hero; cured on next workout
- [ ] **Special Dynamic Events**: highlighted section atop Exploration; enemies dynamically scale to PlayerStats+20%; reward 75-100G + epic drops; intensified screen-shake on critical hits

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
