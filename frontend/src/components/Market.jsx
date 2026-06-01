import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Package, FlaskConical, Gift, Sparkles, X, Shield, Sword, Gem } from 'lucide-react';
import { SHOP_ITEMS, TIER_STYLES, SLOT_LABEL } from '../data/shop';
import { sfx } from '../utils/sounds';

const SLOT_ICON = { weapon: Sword, armor: Shield, trinket: Gem };

const formatBonus = (b) => {
  if (!b) return null;
  const parts = [];
  if (b.strength)  parts.push(`+${b.strength} STR`);
  if (b.agility)   parts.push(`+${b.agility} AGI`);
  if (b.endurance) parts.push(`+${b.endurance} END`);
  return parts.join(' · ');
};

const GoldPill = ({ amount }) => (
  <div className="flex items-center gap-1.5 bg-[#27272A] border-2 border-[#FF8C00]/50 px-2.5 py-1">
    <Coins size={12} className="text-[#FF8C00]" />
    <span data-testid="gold-display" className="font-pixel text-[10px] text-[#FF8C00]">{amount}G</span>
  </div>
);

const ShopRow = ({ item, gold, onBuy, onOpenChest, chestLocked }) => {
  const canAfford = gold >= item.price;
  const tier = TIER_STYLES[item.tier] || TIER_STYLES.I;

  const Icon =
    item.type === 'potion' ? FlaskConical :
    item.type === 'chest'  ? Gift :
    item.tier === 'II'     ? Shield :
    Sword;

  const isChest = item.type === 'chest';

  return (
    <div className={`border-2 ${tier.border} ${tier.bg} p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)]`}>
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 border-2 ${tier.border} bg-[#09090B] flex items-center justify-center flex-shrink-0`}>
          <Icon size={20} className={tier.text} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <p className={`font-pixel text-[10px] ${tier.text} truncate`}>{item.name}</p>
            <span className={`font-pixel text-[6px] border px-1 py-0.5 ${tier.border} ${tier.text}`}>
              {tier.label}
            </span>
          </div>
          <p className="font-plex text-[11px] text-zinc-400 leading-snug">{item.description}</p>
          {item.bonus && (
            <p className="font-pixel text-[7px] text-emerald-300 mt-1">{formatBonus(item.bonus)}</p>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Coins size={11} className="text-[#FF8C00]" />
          <span className="font-pixel text-[10px] text-[#FF8C00]">{item.price}G</span>
        </div>
        <button
          data-testid={isChest ? 'open-chest-btn' : `buy-${item.id}-btn`}
          onClick={() => (isChest ? onOpenChest() : onBuy(item))}
          disabled={!canAfford || (isChest && chestLocked)}
          className={`font-pixel text-[9px] px-3 py-2 border-2 transition-all ${
            canAfford && !(isChest && chestLocked)
              ? isChest
                ? 'bg-[#FF4500] hover:bg-[#DC2626] border-[#FF8C00] text-white shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.4),_2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px]'
                : 'bg-zinc-200 hover:bg-white text-[#09090B] border-zinc-400 shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.2),_2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px]'
              : 'bg-[#27272A] border-[#3F3F46] text-zinc-600 cursor-not-allowed'
          }`}
        >
          {isChest ? 'OPEN' : 'BUY'}
        </button>
      </div>
    </div>
  );
};

const ChestRevealModal = ({ drop, onClose }) => {
  const kindToTier = { potion: 'I', common: 'I', epic: 'II', legendary: 'L' };
  const tier = TIER_STYLES[kindToTier[drop.kind]] || TIER_STYLES.I;
  const Icon = drop.kind === 'potion' ? FlaskConical : drop.kind === 'legendary' ? Sparkles : Package;

  const kindLabel = {
    potion: 'HEALTH POTION',
    common: 'COMMON GEAR',
    epic: 'EPIC GEAR',
    legendary: 'LEGENDARY GEAR',
  }[drop.kind];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[10100] flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -3 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 14, stiffness: 220 }}
        className={`bg-[#18181B] border-4 ${tier.border} w-full max-w-sm p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center relative overflow-hidden`}
      >
        {/* Shine effect for legendary */}
        {drop.kind === 'legendary' && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-purple-300/20 to-transparent pointer-events-none"
          />
        )}

        <p className="font-pixel text-[8px] text-zinc-500 mb-2">MYSTERY CHEST</p>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', damping: 10 }}
          className={`w-20 h-20 mx-auto mb-3 border-2 ${tier.border} ${tier.bg} flex items-center justify-center`}
        >
          <Icon size={36} className={tier.text} />
        </motion.div>
        <p className={`font-pixel text-[9px] ${tier.text} mb-1`}>{kindLabel}</p>
        <p data-testid="chest-drop-name" className="font-pixel text-sm text-zinc-100 mb-4">{drop.name}</p>

        <button
          data-testid="chest-close-btn"
          onClick={onClose}
          className="w-full bg-[#27272A] hover:bg-[#3F3F46] text-zinc-200 font-pixel text-[10px] py-3 border-2 border-[#52525B] transition-all"
        >
          CLAIM
        </button>
      </motion.div>
    </div>
  );
};

const Market = ({ gameData, initialTab = 'shop', onBuyPotion, onBuyGear, onOpenChest, onSellGear, onEquipGear, onUnequipGear }) => {
  const { gold, potions, gear, equippedGearIds } = gameData;
  const equippedSet = new Set(Object.values(equippedGearIds || {}).filter(Boolean));
  const [tab, setTab] = useState(initialTab);
  const [drop, setDrop] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 2200);
  };

  const handleBuyPotion = () => {
    const res = onBuyPotion(25);
    if (res.ok) { sfx.purchase(); showToast('Potion added to bag.', 'ok'); }
    else showToast('Not enough gold.', 'err');
  };

  const handleBuyGear = (item) => {
    const res = onBuyGear(item);
    if (res.ok) { sfx.purchase(); showToast(`${item.name} purchased.`, 'ok'); }
    else showToast('Not enough gold.', 'err');
  };

  const handleOpenChest = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 100, 100, 400]);
    }
    const res = onOpenChest(100);
    if (!res.ok) {
      showToast('Not enough gold.', 'err');
      return;
    }
    sfx.chestOpen();
    setDrop(res.drop);
  };

  const handleSell = (g) => {
    sfx.coin();
    onSellGear(g.id);
    showToast(`Sold ${g.name} for ${g.sellValue}G.`, 'ok');
  };

  const handleEquip = (g) => {
    sfx.equip();
    onEquipGear(g.id);
    showToast(`${g.name} equipped.`, 'ok');
  };

  const handleUnequip = (g) => {
    sfx.click();
    onUnequipGear(g.id);
    showToast(`${g.name} unequipped.`, 'info');
  };

  return (
    <div className="bg-[#09090B] min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="bg-[#18181B] border-b-2 border-[#3F3F46] px-4 py-3 flex items-center justify-between">
        <span className="font-pixel text-[#FF4500] text-[11px]">FITNESS QUEST</span>
        <div className="flex items-center gap-2">
          <GoldPill amount={gold} />
          <span className="font-pixel text-[9px] text-zinc-500">MARKET</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 border-b-2 border-[#3F3F46] bg-[#18181B]">
        {[
          { id: 'shop', label: 'SHOP' },
          { id: 'bag',  label: `BAG · ${potions + gear.length}` },
        ].map(t => (
          <button
            key={t.id}
            data-testid={`market-tab-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`font-pixel text-[10px] py-3 transition-all border-b-2 ${
              tab === t.id ? 'text-[#FF4500] border-[#FF4500] bg-[#27272A]' : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 p-4 space-y-3 overflow-y-auto pb-4">
        {/* Header info */}
        <div className="bg-[#18181B] border-2 border-[#3F3F46] p-3">
          <p className="font-pixel text-[9px] text-zinc-300 leading-loose">
            {tab === 'shop' ? 'The Market of Emberstone' : 'Your Adventurer Bag'}
          </p>
          <p className="font-plex text-xs text-zinc-500 mt-1">
            {tab === 'shop'
              ? 'Defeat enemies to earn gold. Spend it on gear or roll the Mystery Chest.'
              : 'Sell unwanted gear back for 30% of its value. Drink potions to heal anywhere.'}
          </p>
        </div>

        {/* ─── SHOP ─── */}
        {tab === 'shop' && (
          <div className="space-y-3">
            {SHOP_ITEMS.map((it, i) => (
              <motion.div
                key={it.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <ShopRow
                  item={it}
                  gold={gold}
                  chestLocked={!!drop}
                  onBuy={(item) => {
                    if (item.type === 'potion') handleBuyPotion();
                    else handleBuyGear(item);
                  }}
                  onOpenChest={handleOpenChest}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* ─── BAG ─── */}
        {tab === 'bag' && (
          <div className="space-y-3">
            {/* Potions row */}
            <div className="bg-[#18181B] border-2 border-[#3F3F46] p-3 flex items-center gap-3">
              <div className="w-12 h-12 border-2 border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center">
                <FlaskConical size={20} className="text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="font-pixel text-[10px] text-emerald-300">Health Potion</p>
                <p className="font-plex text-[11px] text-zinc-500">Restores 30% of max HP.</p>
              </div>
              <span data-testid="bag-potion-count" className="font-pixel text-xl text-zinc-100">x{potions}</span>
            </div>

            {/* Gear */}
            <p className="font-pixel text-[9px] text-zinc-400 mt-3 mb-1">GEAR ({gear.length})</p>
            {gear.length === 0 ? (
              <div className="bg-[#18181B] border-2 border-[#3F3F46] border-dashed p-6 text-center">
                <Package size={20} className="text-zinc-600 mx-auto mb-2" />
                <p className="font-pixel text-[9px] text-zinc-600">No gear yet.</p>
                <p className="font-plex text-xs text-zinc-600 mt-1">Buy from the Shop or roll a Mystery Chest.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {gear.map((g) => {
                  const tier = TIER_STYLES[g.tier] || TIER_STYLES.I;
                  const SlotIcon = SLOT_ICON[g.slot] || Sword;
                  const isEquipped = equippedSet.has(g.id);
                  const bonusStr = formatBonus(g.bonus);
                  return (
                    <div
                      key={g.id}
                      data-testid={`bag-gear-${g.id}`}
                      className={`bg-[#18181B] border-2 ${isEquipped ? 'border-emerald-500/70' : tier.border} p-3 flex items-center gap-3`}
                    >
                      <div className={`w-10 h-10 border-2 ${tier.border} ${tier.bg} flex items-center justify-center`}>
                        <SlotIcon size={16} className={tier.text} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className={`font-pixel text-[10px] ${tier.text} truncate`}>{g.name}</p>
                          {isEquipped && (
                            <span className="font-pixel text-[6px] border border-emerald-500/60 text-emerald-300 bg-emerald-500/15 px-1 py-0.5">
                              EQUIPPED
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="font-pixel text-[7px] text-zinc-500">{tier.label}</p>
                          {g.slot && <p className="font-pixel text-[7px] text-zinc-500">· {SLOT_LABEL[g.slot]}</p>}
                        </div>
                        {bonusStr && (
                          <p className="font-pixel text-[7px] text-emerald-300 mt-0.5">{bonusStr}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        {g.slot && (isEquipped ? (
                          <button
                            data-testid={`unequip-gear-${g.id}-btn`}
                            onClick={() => handleUnequip(g)}
                            className="font-pixel text-[8px] bg-emerald-700 hover:bg-emerald-600 text-white px-2.5 py-1.5 border-2 border-emerald-500 active:translate-y-[1px] transition-all"
                          >
                            UNEQUIP
                          </button>
                        ) : (
                          <button
                            data-testid={`equip-gear-${g.id}-btn`}
                            onClick={() => handleEquip(g)}
                            className="font-pixel text-[8px] bg-[#FF4500] hover:bg-[#DC2626] text-white px-2.5 py-1.5 border-2 border-[#FF8C00] active:translate-y-[1px] transition-all"
                          >
                            EQUIP
                          </button>
                        ))}
                        <button
                          data-testid={`sell-gear-${g.id}-btn`}
                          onClick={() => handleSell(g)}
                          disabled={isEquipped}
                          className={`font-pixel text-[8px] px-2.5 py-1.5 border-2 transition-all flex items-center gap-1 ${
                            isEquipped
                              ? 'bg-[#27272A] border-[#3F3F46] text-zinc-600 cursor-not-allowed'
                              : 'bg-[#27272A] hover:bg-[#3F3F46] text-zinc-200 border-[#52525B] active:translate-y-[1px]'
                          }`}
                        >
                          <Coins size={10} className={isEquipped ? 'text-zinc-600' : 'text-[#FF8C00]'} />
                          {g.sellValue}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[10050]"
          >
            <div
              data-testid="market-toast"
              className={`font-pixel text-[9px] px-3 py-2 border-2 ${
                toast.type === 'ok'
                  ? 'bg-emerald-900/80 border-emerald-500 text-emerald-200'
                  : toast.type === 'err'
                  ? 'bg-red-900/80 border-red-500 text-red-200'
                  : 'bg-[#27272A] border-[#52525B] text-zinc-200'
              }`}
            >
              {toast.msg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chest reveal */}
      {drop && <ChestRevealModal drop={drop} onClose={() => setDrop(null)} />}
    </div>
  );
};

export default Market;
