import { useNavigate } from 'react-router-dom';
import { BOSSES } from '../../data/bosses';
import { COLORS, FONTS, SIZES, PIXEL_BORDER } from '../../styles/theme';

export default function BossPreview({ boss, minion, encounterInfo }) {
  const navigate = useNavigate();

  const isMinion = !!minion;
  const target = isMinion ? minion : boss;
  const bossDef = !isMinion && boss ? BOSSES[boss.bossKey] : null;

  if (!target) return null;

  const currentHp = target.currentHp;
  const maxHp = target.maxHp;
  const percentage = Math.max(0, currentHp / maxHp);
  const barColor = percentage > 0.5 ? COLORS.neonGreen : percentage > 0.25 ? COLORS.gold : COLORS.fireRed;
  const glowColor = isMinion ? (target.glowColor || COLORS.neonGreen) : (bossDef?.glowColor || COLORS.border);

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
      <div style={{
        width: 40,
        height: 40,
        backgroundColor: COLORS.bgDarkest,
        border: `2px solid ${glowColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        flexShrink: 0,
        boxShadow: `0 0 8px ${glowColor}44`,
      }}>
        {isMinion ? (target.emoji || '👾') : (bossDef?.emoji || '🐉')}
      </div>

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
            {isMinion ? target.name : (boss?.name || 'Boss')}
          </span>
          <span style={{
            fontFamily: FONTS.pixel,
            fontSize: 7,
            color: barColor,
          }}>
            {currentHp}/{maxHp}
          </span>
        </div>
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
        {encounterInfo && (
          <div style={{
            fontFamily: FONTS.pixel,
            fontSize: 7,
            color: COLORS.textMuted,
            marginTop: 2,
          }}>
            {isMinion
              ? `MINION ${encounterInfo.total - encounterInfo.remaining + 1}/${encounterInfo.total}`
              : 'BOSS PHASE'}
          </div>
        )}
      </div>

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
