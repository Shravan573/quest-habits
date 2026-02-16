import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthContext } from '../contexts/AuthContext';
import { CLASSES, CLASS_ORDER } from '../data/classes';
import PixelButton from '../components/ui/PixelButton';
import PixelCard from '../components/ui/PixelCard';
import { COLORS, FONTS, SIZES, PIXEL_BORDER } from '../styles/theme';

export default function ClassSelectPage() {
  const { user } = useAuthContext();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selected || !user) return;
    setLoading(true);
    const classDef = CLASSES[selected];
    await updateDoc(doc(db, 'users', user.uid), {
      class: selected,
      hp: classDef.baseStats.hp,
      maxHp: classDef.baseStats.maxHp,
      skills: {},
      skillPoints: 1,
      equipment: { weapon: null, armor: null, accessory: null },
    });
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: COLORS.bgDarkest,
      padding: SIZES.spacing * 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{ fontSize: 48, marginTop: SIZES.spacing * 4 }}>⚔️</div>
      <h1 style={{
        fontFamily: FONTS.pixel,
        fontSize: SIZES.fontLg,
        color: COLORS.gold,
        marginBottom: 4,
        textAlign: 'center',
      }}>
        CHOOSE YOUR CLASS
      </h1>
      <p style={{
        fontFamily: FONTS.pixel,
        fontSize: SIZES.fontXs,
        color: COLORS.textMuted,
        marginBottom: SIZES.spacing * 3,
        textAlign: 'center',
      }}>
        This defines your skills and playstyle
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: SIZES.spacing,
        maxWidth: 500,
        width: '100%',
        marginBottom: SIZES.spacing * 3,
      }}>
        {CLASS_ORDER.map((key) => {
          const cls = CLASSES[key];
          const isSelected = selected === key;
          return (
            <div
              key={key}
              onClick={() => setSelected(key)}
              style={{
                ...PIXEL_BORDER,
                backgroundColor: isSelected ? `${cls.color}15` : COLORS.bgDark,
                borderColor: isSelected ? cls.color : COLORS.border,
                padding: SIZES.spacing * 2,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{ fontSize: 36, marginBottom: SIZES.spacing }}>
                {cls.emoji}
              </div>
              <div style={{
                fontFamily: FONTS.pixel,
                fontSize: SIZES.fontMd,
                color: isSelected ? cls.color : COLORS.textPrimary,
                marginBottom: 4,
              }}>
                {cls.name}
              </div>
              <div style={{
                fontFamily: FONTS.pixel,
                fontSize: SIZES.fontXs,
                color: COLORS.textMuted,
                lineHeight: 1.6,
                marginBottom: SIZES.spacing,
              }}>
                {cls.description}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: SIZES.spacing * 2 }}>
                <div>
                  <div style={{ fontFamily: FONTS.pixel, fontSize: SIZES.fontXs, color: COLORS.fireRed }}>
                    ❤️ {cls.baseStats.hp}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: FONTS.pixel, fontSize: SIZES.fontXs, color: COLORS.neonGreen }}>
                    ⚔️ {cls.baseStats.attack}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected class detail */}
      {selected && (
        <PixelCard style={{ maxWidth: 500, width: '100%', marginBottom: SIZES.spacing * 2 }}>
          <div style={{
            fontFamily: FONTS.pixel,
            fontSize: SIZES.fontSm,
            color: CLASSES[selected].color,
            marginBottom: SIZES.spacing,
            textAlign: 'center',
          }}>
            {CLASSES[selected].emoji} {CLASSES[selected].name.toUpperCase()} SKILLS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {CLASSES[selected].skills.map((skill) => (
              <div key={skill.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: SIZES.spacing,
                padding: 4,
                backgroundColor: COLORS.bgDarkest,
                border: `1px solid ${COLORS.border}`,
              }}>
                <span style={{ fontSize: 16, width: 24, textAlign: 'center' }}>{skill.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONTS.pixel, fontSize: SIZES.fontXs, color: COLORS.textPrimary }}>
                    {skill.name}
                  </div>
                  <div style={{ fontFamily: FONTS.pixel, fontSize: SIZES.fontXs, color: COLORS.textMuted }}>
                    {skill.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PixelCard>
      )}

      <PixelButton
        variant="gold"
        disabled={!selected || loading}
        onClick={handleConfirm}
        style={{
          maxWidth: 500,
          width: '100%',
          padding: `${SIZES.spacing * 2}px 0`,
          fontSize: SIZES.fontMd,
        }}
      >
        {loading ? 'FORGING...' : selected ? `BECOME ${CLASSES[selected].name.toUpperCase()}` : 'SELECT A CLASS'}
      </PixelButton>
    </div>
  );
}
