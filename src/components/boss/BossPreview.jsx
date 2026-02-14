import { useNavigate } from 'react-router-dom';
import { BOSSES } from '../../data/bosses';
import { COLORS, FONTS, SIZES, PIXEL_BORDER } from '../../styles/theme';

export default function BossPreview({ boss }) {
  const navigate = useNavigate();
  const bossDef = BOSSES[boss?.bossKey];

  if (!boss) return null;

  const percentage = Math.max(0, boss.currentHp / boss.maxHp);
  const barColor = percentage > 0.5 ? COLORS.neonGreen : percentage > 0.25 ? COLORS.gold : COLORS.fireRed;

  return (
    <div
      onClick={() => navigate('/boss')}
      style={{
        ...PIXEL_BORDER,
        backgroundColor: COLORS.bgDark,
        padding: SIZES.spacing,
        marginBottom: SIZES.spacing * 2,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: SIZES.spacing,
      }}
    >
      {/* Boss emoji */}
      <div style={{
        width: 40,
        height: 40,
        backgroundColor: COLORS.bgDarkest,
        border: `2px solid ${bossDef?.glowColor || COLORS.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        flexShrink: 0,
        boxShadow: `0 0 8px ${bossDef?.glowColor || COLORS.border}44`,
      }}>
        {bossDef?.emoji || '🐉'}
      </div>

      {/* Info + HP bar */}
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}>
          <span style={{
            fontFamily: FONTS.pixel,
            fontSize: SIZES.fontXs,
            color: COLORS.textPrimary,
          }}>
            {boss.name}
          </span>
          <span style={{
            fontFamily: FONTS.pixel,
            fontSize: 7,
            color: barColor,
          }}>
            {boss.currentHp}/{boss.maxHp}
          </span>
        </div>
        {/* Mini HP bar */}
        <div style={{
          height: 8,
          backgroundColor: '#111',
          border: '1px solid #222',
        }}>
          <div style={{
            height: '100%',
            width: `${percentage * 100}%`,
            backgroundColor: barColor,
            transition: 'width 0.5s',
            boxShadow: `0 0 4px ${barColor}`,
          }} />
        </div>
      </div>

      {/* Arrow */}
      <span style={{
        fontFamily: FONTS.pixel,
        fontSize: SIZES.fontSm,
        color: COLORS.textMuted,
      }}>
        &gt;
      </span>
    </div>
  );
}
