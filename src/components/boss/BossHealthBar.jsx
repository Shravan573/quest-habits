import { COLORS, FONTS, SIZES } from '../../styles/theme';

export default function BossHealthBar({ currentHp, maxHp }) {
  const SEGMENTS = 20;
  const percentage = Math.max(0, currentHp / maxHp);
  const filled = Math.ceil(percentage * SEGMENTS);
  const color = percentage > 0.5 ? COLORS.neonGreen : percentage > 0.25 ? COLORS.gold : COLORS.fireRed;

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 4,
        fontFamily: FONTS.pixel,
        fontSize: SIZES.fontXs,
      }}>
        <span style={{ color: COLORS.textSecondary }}>BOSS HP</span>
        <span style={{ color }}>
          {currentHp} / {maxHp}
        </span>
      </div>
      <div style={{
        display: 'flex',
        gap: 2,
        padding: 3,
        backgroundColor: '#111',
        border: `2px solid ${COLORS.border}`,
      }}>
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <div key={i} style={{
            flex: 1,
            height: 20,
            backgroundColor: i < filled ? color : '#1a1a1a',
            border: '1px solid #0a0a0a',
            transition: 'background-color 0.3s',
            boxShadow: i < filled ? `0 0 4px ${color}44` : 'none',
          }} />
        ))}
      </div>
    </div>
  );
}
