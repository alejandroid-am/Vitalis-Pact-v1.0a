// Generates a shareable hero card as a PNG using the Canvas API.
// Pure client-side — no server roundtrip required.

const TIER_NAMES = { I: 'COMMON', II: 'EPIC', L: 'LEGENDARY' };

const drawPixelText = (ctx, text, x, y, size, color, align = 'left') => {
  ctx.fillStyle = color;
  ctx.font = `${size}px "Press Start 2P", monospace`;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
};

export const generateHeroCard = async (gameData, effStats) => {
  const W = 720;
  const H = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas-unavailable');

  // Background gradient (forge metal)
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#18181B');
  bg.addColorStop(0.5, '#09090B');
  bg.addColorStop(1, '#0a0a0d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Border
  ctx.strokeStyle = '#FF4500';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, W - 8, H - 8);

  // Header bar
  ctx.fillStyle = '#27272A';
  ctx.fillRect(8, 8, W - 16, 80);
  ctx.fillStyle = '#FF4500';
  ctx.fillRect(8, 88, W - 16, 4);
  drawPixelText(ctx, 'VITALIS PACT', W / 2, 58, 28, '#FF4500', 'center');

  // Character name
  drawPixelText(ctx, gameData.name.toUpperCase(), W / 2, 170, 36, '#F4F4F5', 'center');

  // Class + Level
  const klass = gameData.characterClass === 'warrior' ? 'WARRIOR' : 'ROGUE';
  drawPixelText(ctx, `${klass} · LEVEL ${gameData.level}`, W / 2, 220, 16, '#A1A1AA', 'center');

  // Stat block
  const stats = effStats || gameData.stats;
  const baseStats = gameData.stats;
  const sx = 80;
  let sy = 320;
  drawPixelText(ctx, 'ATTRIBUTES', sx, sy, 14, '#71717A');
  sy += 35;
  const drawStat = (label, val, base) => {
    drawPixelText(ctx, label, sx, sy, 20, '#E4E4E7');
    drawPixelText(ctx, String(val), W - sx, sy, 24, '#FF4500', 'right');
    if (val > base) drawPixelText(ctx, `(+${val - base})`, W - sx - 80, sy, 14, '#10B981', 'right');
    sy += 50;
  };
  drawStat('STRENGTH', stats.strength, baseStats.strength);
  drawStat('AGILITY',  stats.agility,  baseStats.agility);
  drawStat('ENDURANCE',stats.endurance,baseStats.endurance);

  // Lifetime stats
  sy += 30;
  drawPixelText(ctx, 'LIFETIME', sx, sy, 14, '#71717A');
  sy += 35;
  const lifetime = gameData.lifetime || {};
  const drawKV = (label, val) => {
    drawPixelText(ctx, label, sx, sy, 16, '#E4E4E7');
    drawPixelText(ctx, String(val), W - sx, sy, 16, '#FF8C00', 'right');
    sy += 36;
  };
  drawKV('Minutes Trained', lifetime.totalMinutes || 0);
  drawKV('Enemies Defeated', lifetime.enemiesDefeated || 0);
  drawKV('Gold Earned', lifetime.goldEarned || 0);
  drawKV('Chests Opened', lifetime.chestsOpened || 0);
  drawKV('Longest Streak', `${gameData.streak?.longest || 0}d`);

  // Achievements counter
  sy += 20;
  drawPixelText(ctx, 'ACHIEVEMENTS', sx, sy, 14, '#71717A');
  sy += 35;
  // Count seen tiers
  const seen = gameData.seenAchievementTiers || {};
  let bronze = 0, silver = 0, gold = 0;
  Object.values(seen).forEach(t => { if (t === 'bronze') bronze++; if (t === 'silver') { bronze++; silver++; } if (t === 'gold') { bronze++; silver++; gold++; } });
  drawPixelText(ctx, `B ${bronze}`, sx, sy, 22, '#D97706');
  drawPixelText(ctx, `S ${silver}`, sx + 200, sy, 22, '#E4E4E7');
  drawPixelText(ctx, `G ${gold}`, sx + 400, sy, 22, '#FDE047');

  // Footer
  ctx.fillStyle = '#27272A';
  ctx.fillRect(8, H - 80, W - 16, 72);
  drawPixelText(ctx, 'TRAIN. FORGE. CONQUER.', W / 2, H - 38, 14, '#A1A1AA', 'center');

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('blob-failed'));
      resolve(blob);
    }, 'image/png');
  });
};

export const downloadHeroCard = async (gameData, effStats) => {
  const blob = await generateHeroCard(gameData, effStats);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vitalis-pact-${(gameData.name || 'hero').toLowerCase()}-lv${gameData.level || 1}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Try Web Share API on mobile, otherwise fall back to download.
export const shareHeroCard = async (gameData, effStats) => {
  const blob = await generateHeroCard(gameData, effStats);
  const file = new File([blob], `vitalis-pact-${gameData.name || 'hero'}.png`, { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'My Vitalis Pact Hero',
        text: `${gameData.name} the ${gameData.characterClass} — Level ${gameData.level}. Train your body, forge your hero.`,
      });
      return { ok: true, method: 'share' };
    } catch (err) {
      if (err?.name === 'AbortError') return { ok: false, reason: 'cancelled' };
      console.error('[share] navigator.share failed:', err);
    }
  }
  // Fallback: download
  await downloadHeroCard(gameData, effStats);
  return { ok: true, method: 'download' };
};
