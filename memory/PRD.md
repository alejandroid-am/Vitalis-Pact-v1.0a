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

## Prioritized Backlog

### P0 - Critical for next iteration
- [ ] Fill empty space on Camp screen with recent workout history
- [ ] Add reset game / new character option

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
