import { COLORS, FONTS, SIZES } from '../../styles/theme';

export default function HealthBar({ current, max, height = 16, showLabel = true, label = 'HP' }) {
  const SEGMENTS = 20;
  const percentage = Math.max(0, current / max);
  const filled = Math.ceil(percentage * SEGMENTS);
  const color = percentage > 0.5 ? COLORS.neonGreen : percentage > 0.25 ? COLORS.gold : COLORS.fireRed;

  return (
    <div>
      {showLabel && (
        <div style={{
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontXs,
          color: COLORS.textSecondary,
          marginBottom: 2,
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span>{label}</span>
          <span style={{ color }}>{current}/{max}</span>
        </div>
      )}
      <div style={{ display: 'flex', gap: 1 }}>
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <div key={i} style={{
            flex: 1,
            height,
            backgroundColor: i < filled ? color : COLORS.barEmpty,
            border: `1px solid ${COLORS.barBorder}`,
            transition: 'background-color 0.3s',
          }} />
        ))}
      </div>
    </div>
  );
}
