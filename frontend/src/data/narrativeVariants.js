// Narrative variants — randomized success/fail/lore lines for every mission.
// Used by App.handleAttemptMission to overlay onto the base mission object so
// each attempt feels different. Themed lines are pooled by mission tag (combat / chase / endurance).

// Pull randomly from arrays.
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Determine a "flavor" tag from the stat requirement so the lines fit the action.
const flavorForStat = (stat) =>
  stat === 'strength' ? 'combat'
  : stat === 'agility' ? 'chase'
  : 'endurance';

const LORE_VARIANTS = {
  combat: [
    'The brute does not wait. Neither should you.',
    'Steel meets steel. Only one of you walks out.',
    'You have trained for this exact moment. It does not feel like it.',
    'Bones tell the truth. Test theirs.',
    'There are no rematches. Only first kills.',
  ],
  chase: [
    'It bolts the moment your foot lands. So do you.',
    'You are not faster than fear — only more committed.',
    'Three breaths. Three steps. Three feints. Then you strike.',
    'The terrain remembers your footfalls. Make them quiet.',
    'It will tire. The question is whether you will first.',
  ],
  endurance: [
    'The night does not blink. You must not either.',
    'Pain is information. Receive it. Continue.',
    'Every breath costs. Every breath is paid.',
    'Stillness is a weapon. Wield it longer than they can.',
    'Outlast. Outlast. Outlast.',
  ],
};

const SUCCESS_VARIANTS = {
  combat: [
    'You stand over the kill. Your hands still hum from the impact.',
    'The blow lands clean. There is no second exchange.',
    'You did not flinch. It did. That settled the matter.',
    'It falls. The forge in your chest does not.',
    'A bone-deep silence after the strike. You earned it.',
  ],
  chase: [
    'You vanish before it turns. By the time it understands, you are already gone.',
    'Three feints, one true cut. Textbook.',
    'You moved before it could decide. That is what speed is.',
    'You catch its shadow before it catches you. Done.',
    'A breathless arc, a clean withdrawal. The road is yours again.',
  ],
  endurance: [
    'Dawn finds you upright. That is the only requirement that mattered.',
    'You wore them out. They drift away first. You walk out second.',
    'The cold loses interest. You do not.',
    'Hours pass. Then more hours. Then morning.',
    'You did not break. Few things in this world can claim that today.',
  ],
};

const FAIL_VARIANTS = {
  combat: [
    'You raise your blade a heartbeat late. That is all it takes.',
    'It was stronger. Eat. Lift. Return.',
    'Your arms gave. They will not, next time.',
    'A clean miss. A clean punishment.',
    'You walked into the strike you were warned about.',
  ],
  chase: [
    'It heard you. The Glassdust never forgives a footfall.',
    'You stopped to breathe and lost the line. Train cardio. Return.',
    'A half-step too slow. A whole reckoning too costly.',
    'Your lungs failed before your legs. Train cardio. Try again.',
    'You were quick. Not quick enough. Yet.',
  ],
  endurance: [
    'You sat. They closed. Endurance must be tempered in the real world.',
    'The storm wore you down before sunrise. Try again with stronger nights.',
    'Your willpower buckled an hour before help would have come.',
    'You blinked. The whisperers walked through.',
    'You stepped back. The mountain dismisses what cannot stand its silence.',
  ],
};

// Returns a mission object with name/lore/successText/failText overlaid with random variants.
// Always preserves enemy, requirement, loot, id and isSpecial (so the original wiring keeps working).
export const applyNarrativeVariants = (mission) => {
  if (!mission) return mission;
  const flavor = flavorForStat(mission.requirement?.stat);
  return {
    ...mission,
    lore: pick(LORE_VARIANTS[flavor]),
    successText: pick(SUCCESS_VARIANTS[flavor]),
    failText: pick(FAIL_VARIANTS[flavor]),
  };
};
