import { COLORS, FONTS, SIZES } from '../../styles/theme';

export default function StatBar({ label, value, max, icon, color = COLORS.neonCyan }) {
  const percentage = max ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: SIZES.spacing }}>
      {icon && <span style={{ fontSize: SIZES.fontLg }}>{icon}</span>}
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontXs,
          color: COLORS.textSecondary,
          marginBottom: 2,
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span>{label}</span>
          <span style={{ color }}>{value}{max ? `/${max}` : ''}</span>
        </div>
        {max && (
          <div style={{ height: 8, backgroundColor: COLORS.barEmpty, border: `1px solid ${COLORS.barBorder}` }}>
            <div style={{
              height: '100%',
              width: `${percentage}%`,
              backgroundColor: color,
              transition: 'width 0.3s',
            }} />
          </div>
        )}
      </div>
    </div>
  );
}
