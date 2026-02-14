import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthContext } from '../contexts/AuthContext';
import { EQUIPMENT, EQUIPMENT_BY_SLOT, getEquipmentStats } from '../data/equipment';
import PixelButton from '../components/ui/PixelButton';
import PixelCard from '../components/ui/PixelCard';
import { COLORS, FONTS, SIZES, PIXEL_BORDER } from '../styles/theme';

const SLOT_LABELS = {
  weapon: { label: 'WEAPONS', icon: '⚔️' },
  armor: { label: 'ARMOR', icon: '🛡️' },
  accessory: { label: 'ACCESSORIES', icon: '💍' },
};

export default function ShopPage() {
  const { user, profile } = useAuthContext();
  const [activeSlot, setActiveSlot] = useState('weapon');
  const [buying, setBuying] = useState(null);

  if (!profile) return null;

  const equipment = profile.equipment || { weapon: null, armor: null, accessory: null };
  const gold = profile.gold || 0;
  const eqStats = getEquipmentStats(equipment);

  const handleBuy = async (item) => {
    if (gold < item.cost) return;
    setBuying(item.id);

    const newEquipment = { ...equipment, [item.slot]: item.id };
    const oldItem = equipment[item.slot] ? EQUIPMENT[equipment[item.slot]] : null;

    // Adjust maxHp if armor changed
    let hpUpdate = {};
    if (item.stats.maxHp || oldItem?.stats?.maxHp) {
      const oldHpBonus = oldItem?.stats?.maxHp || 0;
      const newHpBonus = item.stats.maxHp || 0;
      const diff = newHpBonus - oldHpBonus;
      if (diff !== 0) {
        const newMaxHp = profile.maxHp + diff;
        hpUpdate = {
          maxHp: newMaxHp,
          hp: Math.min(profile.hp + Math.max(0, diff), newMaxHp),
        };
      }
    }

    await updateDoc(doc(db, 'users', user.uid), {
      equipment: newEquipment,
      gold: gold - item.cost,
      ...hpUpdate,
    });
    setBuying(null);
  };

  const isEquipped = (itemId) => {
    return Object.values(equipment).includes(itemId);
  };

  return (
    <div style={{ padding: SIZES.spacing * 2 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: SIZES.spacing * 2 }}>
        <div style={{ fontSize: 36 }}>🏪</div>
        <div style={{
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontLg,
          color: COLORS.gold,
          marginBottom: 4,
        }}>
          EQUIPMENT SHOP
        </div>
        <div style={{
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontSm,
          color: COLORS.gold,
        }}>
          🪙 {gold} GOLD
        </div>
      </div>

      {/* Current Equipment Summary */}
      <PixelCard style={{ marginBottom: SIZES.spacing * 2, padding: SIZES.spacing }}>
        <div style={{
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontXs,
          color: COLORS.textSecondary,
          marginBottom: SIZES.spacing,
        }}>
          EQUIPPED
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {['weapon', 'armor', 'accessory'].map((slot) => {
            const itemId = equipment[slot];
            const item = itemId ? EQUIPMENT[itemId] : null;
            return (
              <div key={slot} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 36,
                  height: 36,
                  backgroundColor: COLORS.bgDarkest,
                  border: `2px solid ${item ? COLORS.gold : COLORS.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  margin: '0 auto 4px',
                }}>
                  {item ? item.emoji : SLOT_LABELS[slot].icon}
                </div>
                <div style={{
                  fontFamily: FONTS.pixel,
                  fontSize: 7,
                  color: item ? COLORS.textPrimary : COLORS.textMuted,
                }}>
                  {item ? item.name : 'Empty'}
                </div>
              </div>
            );
          })}
        </div>
        {/* Total stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: SIZES.spacing * 2,
          marginTop: SIZES.spacing,
          paddingTop: SIZES.spacing,
          borderTop: `1px solid ${COLORS.border}`,
        }}>
          {eqStats.attack > 0 && (
            <span style={{ fontFamily: FONTS.pixel, fontSize: 7, color: COLORS.fireRed }}>
              +{eqStats.attack} ATK
            </span>
          )}
          {eqStats.maxHp > 0 && (
            <span style={{ fontFamily: FONTS.pixel, fontSize: 7, color: COLORS.neonGreen }}>
              +{eqStats.maxHp} HP
            </span>
          )}
          {eqStats.goldBonus > 0 && (
            <span style={{ fontFamily: FONTS.pixel, fontSize: 7, color: COLORS.gold }}>
              +{eqStats.goldBonus}% GOLD
            </span>
          )}
          {eqStats.xpBonus > 0 && (
            <span style={{ fontFamily: FONTS.pixel, fontSize: 7, color: COLORS.neonCyan }}>
              +{eqStats.xpBonus}% XP
            </span>
          )}
        </div>
      </PixelCard>

      {/* Slot Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: SIZES.spacing * 2 }}>
        {Object.entries(SLOT_LABELS).map(([slot, { label, icon }]) => (
          <button
            key={slot}
            onClick={() => setActiveSlot(slot)}
            style={{
              flex: 1,
              padding: `${SIZES.spacing}px 0`,
              fontFamily: FONTS.pixel,
              fontSize: 7,
              border: `${SIZES.borderWidth}px solid ${activeSlot === slot ? COLORS.gold : COLORS.border}`,
              backgroundColor: activeSlot === slot ? 'rgba(255, 215, 0, 0.1)' : COLORS.bgDark,
              color: activeSlot === slot ? COLORS.gold : COLORS.textMuted,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <span style={{ fontSize: 14 }}>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: SIZES.spacing }}>
        {EQUIPMENT_BY_SLOT[activeSlot].map((item) => {
          const equipped = isEquipped(item.id);
          const canAfford = gold >= item.cost;

          return (
            <PixelCard key={item.id} style={{
              padding: SIZES.spacing,
              borderColor: equipped ? COLORS.gold : COLORS.border,
              backgroundColor: equipped ? `${COLORS.gold}08` : COLORS.bgDark,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: SIZES.spacing }}>
                {/* Item icon */}
                <div style={{
                  width: 40,
                  height: 40,
                  backgroundColor: COLORS.bgDarkest,
                  border: `2px solid ${equipped ? COLORS.gold : COLORS.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  flexShrink: 0,
                }}>
                  {item.emoji}
                </div>

                {/* Item info */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: FONTS.pixel,
                    fontSize: SIZES.fontSm,
                    color: equipped ? COLORS.gold : COLORS.textPrimary,
                    marginBottom: 2,
                  }}>
                    {item.name}
                  </div>
                  <div style={{
                    fontFamily: FONTS.pixel,
                    fontSize: 7,
                    color: COLORS.textMuted,
                    marginBottom: 4,
                  }}>
                    {item.description}
                  </div>
                  {/* Stats */}
                  <div style={{ display: 'flex', gap: SIZES.spacing, flexWrap: 'wrap' }}>
                    {Object.entries(item.stats).map(([stat, val]) => {
                      const labels = {
                        attack: { label: 'ATK', color: COLORS.fireRed },
                        maxHp: { label: 'HP', color: COLORS.neonGreen },
                        goldBonus: { label: '% GOLD', color: COLORS.gold },
                        xpBonus: { label: '% XP', color: COLORS.neonCyan },
                        damageReduction: { label: '% DEF', color: COLORS.neonBlue },
                        minionDamage: { label: 'MOB DMG', color: COLORS.fireOrange },
                      };
                      const l = labels[stat] || { label: stat, color: COLORS.textSecondary };
                      return (
                        <span key={stat} style={{
                          fontFamily: FONTS.pixel,
                          fontSize: 7,
                          color: l.color,
                        }}>
                          +{val} {l.label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Buy/Equipped button */}
                <div style={{ flexShrink: 0, textAlign: 'center' }}>
                  {equipped ? (
                    <div style={{
                      fontFamily: FONTS.pixel,
                      fontSize: SIZES.fontXs,
                      color: COLORS.gold,
                    }}>
                      EQUIPPED
                    </div>
                  ) : (
                    <PixelButton
                      variant={canAfford ? 'gold' : 'ghost'}
                      disabled={!canAfford || buying === item.id}
                      onClick={() => handleBuy(item)}
                      style={{ padding: '6px 10px' }}
                    >
                      <div>
                        <div style={{ fontSize: SIZES.fontXs }}>BUY</div>
                        <div style={{ fontSize: 7 }}>🪙{item.cost}</div>
                      </div>
                    </PixelButton>
                  )}
                </div>
              </div>
            </PixelCard>
          );
        })}
      </div>
    </div>
  );
}
