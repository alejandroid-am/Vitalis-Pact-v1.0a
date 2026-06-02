// SVG Pixel-art hero sprites — 32-bit style, fully inline, no external assets.
// Each class has an idle animation. Swap for real PNG/WebP sprites later.
import React from 'react';

// ─── Warrior ──────────────────────────────────────────────
const WarriorSVG = ({ size = 80, animate = true }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ imageRendering: 'pixelated' }}>
    {/* Helmet */}
    <rect x="11" y="2" width="10" height="3" fill="#9CA3AF"/>
    <rect x="10" y="4" width="12" height="2" fill="#6B7280"/>
    <rect x="10" y="3" width="1"  height="3" fill="#4B5563"/>
    <rect x="21" y="3" width="1"  height="3" fill="#4B5563"/>
    {/* Visor slot */}
    <rect x="12" y="5" width="8" height="1" fill="#1F2937"/>
    {/* Face */}
    <rect x="11" y="6" width="10" height="6" fill="#FCD34D"/>
    <rect x="12" y="7" width="2"  height="2" fill="#1F2937"/>
    <rect x="18" y="7" width="2"  height="2" fill="#1F2937"/>
    <rect x="13" y="10" width="6" height="1" fill="#92400E"/>
    {/* Body armor */}
    <rect x="9"  y="12" width="14" height="9" fill="#374151"/>
    <rect x="10" y="13" width="12" height="7" fill="#4B5563"/>
    <rect x="14" y="13" width="4"  height="7" fill="#374151"/>
    {/* Chest plate detail */}
    <rect x="11" y="14" width="3" height="2" fill="#FF4500" opacity="0.8"/>
    <rect x="18" y="14" width="3" height="2" fill="#FF4500" opacity="0.8"/>
    {/* Left arm + shield */}
    <rect x="5"  y="12" width="4" height="7" fill="#4B5563"/>
    <rect x="3"  y="11" width="4" height="9" fill="#9CA3AF"/>
    <rect x="4"  y="12" width="2" height="7" fill="#DC2626"/>
    <rect x="4"  y="15" width="2" height="1" fill="#FCD34D"/>
    {/* Right arm + sword */}
    <rect x="23" y="12" width="4" height="7" fill="#4B5563"/>
    <rect x="27" y="4"  width="2" height="14" fill="#9CA3AF"/>
    <rect x="26" y="5"  width="4" height="1"  fill="#6B7280"/>
    <rect x="28" y="4"  width="1" height="13" fill="#D1D5DB"/>
    {/* Legs */}
    <rect x="11" y="21" width="5" height="7" fill="#374151"/>
    <rect x="16" y="21" width="5" height="7" fill="#374151"/>
    <rect x="11" y="26" width="5" height="2" fill="#1F2937"/>
    <rect x="16" y="26" width="5" height="2" fill="#1F2937"/>
    {/* Boots */}
    <rect x="10" y="27" width="6" height="3" fill="#1F2937"/>
    <rect x="16" y="27" width="6" height="3" fill="#1F2937"/>
  </svg>
);

// ─── Rogue ────────────────────────────────────────────────
const RogueSVG = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ imageRendering: 'pixelated' }}>
    {/* Hood */}
    <rect x="11" y="1" width="10" height="4" fill="#1F2937"/>
    <rect x="10" y="4" width="12" height="3" fill="#111827"/>
    <rect x="9"  y="5" width="2"  height="4" fill="#111827"/>
    <rect x="21" y="5" width="2"  height="4" fill="#111827"/>
    {/* Face shadow */}
    <rect x="11" y="6" width="10" height="6" fill="#92400E"/>
    <rect x="11" y="6" width="10" height="2" fill="#111827" opacity="0.6"/>
    {/* Eyes — glowing */}
    <rect x="12" y="7" width="3" height="2" fill="#7C3AED"/>
    <rect x="17" y="7" width="3" height="2" fill="#7C3AED"/>
    <rect x="13" y="7" width="1" height="1" fill="#C4B5FD"/>
    <rect x="18" y="7" width="1" height="1" fill="#C4B5FD"/>
    {/* Scarf */}
    <rect x="10" y="11" width="12" height="2" fill="#4C1D95"/>
    {/* Body — dark tunic */}
    <rect x="10" y="13" width="12" height="9" fill="#1E1B4B"/>
    <rect x="11" y="14" width="10" height="7" fill="#312E81"/>
    {/* Belt */}
    <rect x="10" y="19" width="12" height="2" fill="#78350F"/>
    <rect x="14" y="19" width="4"  height="2" fill="#FCD34D"/>
    {/* Left arm + dagger */}
    <rect x="6"  y="13" width="4" height="7" fill="#312E81"/>
    <rect x="4"  y="18" width="2" height="6" fill="#9CA3AF"/>
    <rect x="3"  y="18" width="4" height="1" fill="#6B7280"/>
    <rect x="5"  y="19" width="1" height="5" fill="#D1D5DB"/>
    {/* Right arm */}
    <rect x="22" y="13" width="4" height="7" fill="#312E81"/>
    <rect x="26" y="16" width="2" height="7" fill="#9CA3AF"/>
    <rect x="25" y="16" width="4" height="1" fill="#6B7280"/>
    {/* Legs */}
    <rect x="11" y="22" width="4" height="7" fill="#1E1B4B"/>
    <rect x="17" y="22" width="4" height="7" fill="#1E1B4B"/>
    {/* Boots */}
    <rect x="10" y="26" width="6" height="4" fill="#111827"/>
    <rect x="16" y="26" width="6" height="4" fill="#111827"/>
    <rect x="10" y="29" width="7" height="1" fill="#1F2937"/>
    <rect x="15" y="29" width="7" height="1" fill="#1F2937"/>
  </svg>
);

// ─── Mage ─────────────────────────────────────────────────
const MageSVG = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ imageRendering: 'pixelated' }}>
    {/* Pointed hat */}
    <rect x="15" y="0"  width="2"  height="2"  fill="#1D4ED8"/>
    <rect x="14" y="2"  width="4"  height="2"  fill="#1D4ED8"/>
    <rect x="13" y="4"  width="6"  height="2"  fill="#2563EB"/>
    <rect x="12" y="6"  width="8"  height="2"  fill="#2563EB"/>
    <rect x="10" y="7"  width="12" height="2"  fill="#1D4ED8"/>
    {/* Star on hat */}
    <rect x="15" y="1"  width="2"  height="1"  fill="#FCD34D"/>
    <rect x="14" y="2"  width="1"  height="1"  fill="#FCD34D"/>
    <rect x="17" y="2"  width="1"  height="1"  fill="#FCD34D"/>
    {/* Face */}
    <rect x="11" y="8"  width="10" height="6"  fill="#FDE68A"/>
    <rect x="12" y="9"  width="2"  height="2"  fill="#1F2937"/>
    <rect x="18" y="9"  width="2"  height="2"  fill="#1F2937"/>
    <rect x="14" y="12" width="4"  height="1"  fill="#92400E"/>
    {/* Long beard */}
    <rect x="13" y="14" width="6"  height="4"  fill="#D1D5DB"/>
    <rect x="12" y="16" width="8"  height="3"  fill="#E5E7EB"/>
    {/* Robe */}
    <rect x="9"  y="14" width="14" height="12" fill="#1E3A8A"/>
    <rect x="10" y="15" width="12" height="10" fill="#1D4ED8"/>
    <rect x="14" y="15" width="4"  height="10" fill="#1E3A8A"/>
    {/* Robe details — runes */}
    <rect x="11" y="17" width="2"  height="3"  fill="#7C3AED" opacity="0.8"/>
    <rect x="19" y="17" width="2"  height="3"  fill="#7C3AED" opacity="0.8"/>
    {/* Staff arm */}
    <rect x="24" y="8"  width="2"  height="18" fill="#78350F"/>
    <rect x="23" y="6"  width="4"  height="3"  fill="#9CA3AF"/>
    <rect x="24" y="4"  width="2"  height="4"  fill="#60A5FA"/>
    <rect x="23" y="5"  width="4"  height="2"  fill="#93C5FD"/>
    {/* Orb glow */}
    <rect x="24" y="4"  width="2"  height="2"  fill="#DBEAFE"/>
    {/* Sleeves */}
    <rect x="5"  y="14" width="5"  height="8"  fill="#1D4ED8"/>
    <rect x="3"  y="19" width="4"  height="3"  fill="#FDE68A"/>
    {/* Legs / robe bottom */}
    <rect x="11" y="26" width="4"  height="4"  fill="#1E3A8A"/>
    <rect x="17" y="26" width="4"  height="4"  fill="#1E3A8A"/>
    <rect x="10" y="28" width="5"  height="2"  fill="#111827"/>
    <rect x="17" y="28" width="5"  height="2"  fill="#111827"/>
  </svg>
);

// ─── Ranger ───────────────────────────────────────────────
const RangerSVG = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ imageRendering: 'pixelated' }}>
    {/* Ranger hat */}
    <rect x="10" y="4"  width="12" height="2"  fill="#78350F"/>
    <rect x="11" y="2"  width="10" height="3"  fill="#92400E"/>
    <rect x="8"  y="5"  width="16" height="1"  fill="#78350F"/>
    {/* Feather */}
    <rect x="20" y="2"  width="1"  height="4"  fill="#16A34A"/>
    <rect x="21" y="1"  width="1"  height="3"  fill="#22C55E"/>
    {/* Face */}
    <rect x="11" y="6"  width="10" height="6"  fill="#D97706"/>
    <rect x="12" y="7"  width="2"  height="2"  fill="#1F2937"/>
    <rect x="18" y="7"  width="2"  height="2"  fill="#1F2937"/>
    <rect x="14" y="10" width="4"  height="1"  fill="#92400E"/>
    {/* Green hood/cloak */}
    <rect x="9"  y="6"  width="2"  height="4"  fill="#14532D"/>
    <rect x="21" y="6"  width="2"  height="4"  fill="#14532D"/>
    {/* Tunic */}
    <rect x="9"  y="12" width="14" height="10" fill="#166534"/>
    <rect x="10" y="13" width="12" height="8"  fill="#15803D"/>
    {/* Quiver on back */}
    <rect x="22" y="11" width="3"  height="8"  fill="#78350F"/>
    <rect x="22" y="11" width="3"  height="2"  fill="#92400E"/>
    <rect x="23" y="8"  width="1"  height="5"  fill="#9CA3AF"/>
    <rect x="24" y="7"  width="1"  height="6"  fill="#D1D5DB"/>
    {/* Left arm + bow */}
    <rect x="5"  y="12" width="4"  height="8"  fill="#15803D"/>
    <rect x="3"  y="9"  width="2"  height="16" fill="#78350F" rx="1"/>
    <rect x="3"  y="9"  width="2"  height="1"  fill="#9CA3AF"/>
    <rect x="3"  y="24" width="2"  height="1"  fill="#9CA3AF"/>
    <rect x="4"  y="9"  width="1"  height="16" fill="#6B7280" opacity="0.6"/>
    {/* Right arm */}
    <rect x="23" y="12" width="4"  height="8"  fill="#15803D"/>
    {/* Legs */}
    <rect x="11" y="22" width="4"  height="7"  fill="#166534"/>
    <rect x="17" y="22" width="4"  height="7"  fill="#166534"/>
    {/* Boots */}
    <rect x="10" y="26" width="6"  height="4"  fill="#78350F"/>
    <rect x="16" y="26" width="6"  height="4"  fill="#78350F"/>
    <rect x="9"  y="28" width="7"  height="2"  fill="#92400E"/>
    <rect x="16" y="28" width="7"  height="2"  fill="#92400E"/>
  </svg>
);

// ─── Enemy sprites ─────────────────────────────────────────
export const EnemySprite = ({ enemyName = '', tier = 'I', size = 64 }) => {
  const name = (enemyName || '').toLowerCase();
  
  // Tier color mapping
  const tierColors = {
    'I':  { primary: '#92400E', secondary: '#78350F', accent: '#FCD34D' },
    'II': { primary: '#374151', secondary: '#1F2937', accent: '#9CA3AF' },
    'III':{ primary: '#7F1D1D', secondary: '#450A0A', accent: '#FCA5A5' },
  };
  const c = tierColors[tier] || tierColors['I'];

  // Boss / special enemy
  if (name.includes('guardian') || name.includes('king') || name.includes('titan')) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" style={{ imageRendering: 'pixelated' }}>
        <rect x="10" y="2"  width="12" height="3"  fill={c.secondary}/>
        <rect x="8"  y="4"  width="16" height="2"  fill={c.primary}/>
        <rect x="6"  y="5"  width="20" height="10" fill={c.primary}/>
        <rect x="7"  y="6"  width="18" height="8"  fill={c.secondary}/>
        <rect x="9"  y="8"  width="4"  height="3"  fill="#DC2626"/>
        <rect x="19" y="8"  width="4"  height="3"  fill="#DC2626"/>
        <rect x="10" y="9"  width="2"  height="1"  fill="#FCA5A5"/>
        <rect x="20" y="9"  width="2"  height="1"  fill="#FCA5A5"/>
        <rect x="12" y="12" width="8"  height="1"  fill={c.accent}/>
        <rect x="6"  y="15" width="20" height="11" fill={c.primary}/>
        <rect x="7"  y="16" width="18" height="9"  fill={c.secondary}/>
        <rect x="3"  y="14" width="4"  height="13" fill={c.primary}/>
        <rect x="25" y="14" width="4"  height="13" fill={c.primary}/>
        <rect x="1"  y="10" width="4"  height="4"  fill={c.accent}/>
        <rect x="27" y="10" width="4"  height="4"  fill={c.accent}/>
        <rect x="11" y="26" width="4"  height="4"  fill={c.secondary}/>
        <rect x="17" y="26" width="4"  height="4"  fill={c.secondary}/>
      </svg>
    );
  }

  // Wolf / hound type
  if (name.includes('hound') || name.includes('wolf') || name.includes('boar') || name.includes('beast')) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" style={{ imageRendering: 'pixelated' }}>
        <rect x="2"  y="8"  width="4"  height="4"  fill={c.primary}/>
        <rect x="4"  y="5"  width="6"  height="6"  fill={c.secondary}/>
        <rect x="5"  y="6"  width="4"  height="4"  fill={c.primary}/>
        <rect x="6"  y="7"  width="2"  height="2"  fill="#DC2626"/>
        <rect x="4"  y="10" width="2"  height="1"  fill={c.accent}/>
        <rect x="7"  y="10" width="2"  height="1"  fill={c.accent}/>
        <rect x="4"  y="11" width="20" height="8"  fill={c.primary}/>
        <rect x="5"  y="12" width="18" height="6"  fill={c.secondary}/>
        <rect x="10" y="13" width="12" height="3"  fill={c.primary}/>
        <rect x="4"  y="19" width="5"  height="8"  fill={c.primary}/>
        <rect x="11" y="19" width="4"  height="8"  fill={c.primary}/>
        <rect x="17" y="19" width="4"  height="8"  fill={c.primary}/>
        <rect x="22" y="19" width="5"  height="8"  fill={c.primary}/>
        <rect x="24" y="11" width="6"  height="4"  fill={c.secondary}/>
        <rect x="26" y="8"  width="4"  height="6"  fill={c.primary}/>
      </svg>
    );
  }

  // Default humanoid enemy
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ imageRendering: 'pixelated' }}>
      <rect x="12" y="3"  width="8"  height="8"  fill={c.primary}/>
      <rect x="13" y="4"  width="6"  height="6"  fill={c.secondary}/>
      <rect x="13" y="5"  width="2"  height="2"  fill="#DC2626"/>
      <rect x="17" y="5"  width="2"  height="2"  fill="#DC2626"/>
      <rect x="14" y="8"  width="4"  height="1"  fill={c.accent}/>
      <rect x="10" y="11" width="12" height="9"  fill={c.primary}/>
      <rect x="11" y="12" width="10" height="7"  fill={c.secondary}/>
      <rect x="14" y="13" width="4"  height="4"  fill={c.primary}/>
      <rect x="6"  y="11" width="4"  height="8"  fill={c.primary}/>
      <rect x="22" y="11" width="4"  height="8"  fill={c.primary}/>
      <rect x="3"  y="15" width="4"  height="3"  fill={c.accent}/>
      <rect x="25" y="15" width="4"  height="3"  fill={c.accent}/>
      <rect x="12" y="20" width="4"  height="8"  fill={c.primary}/>
      <rect x="16" y="20" width="4"  height="8"  fill={c.primary}/>
      <rect x="11" y="26" width="5"  height="2"  fill={c.secondary}/>
      <rect x="16" y="26" width="5"  height="2"  fill={c.secondary}/>
    </svg>
  );
};

// ─── Main export ───────────────────────────────────────────
const SPRITE_MAP = {
  warrior: WarriorSVG,
  rogue:   RogueSVG,
  mage:    MageSVG,
  ranger:  RangerSVG,
};

const HeroSprite = ({ characterClass = 'warrior', size = 80, animate = true, className = '' }) => {
  const Sprite = SPRITE_MAP[characterClass] || WarriorSVG;
  return (
    <div
      className={`inline-block ${animate ? 'sprite-idle' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <Sprite size={size} />
    </div>
  );
};

export default HeroSprite;
