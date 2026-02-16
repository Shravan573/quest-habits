import { COLORS, FONTS, SIZES, PIXEL_BORDER } from '../../styles/theme';

export default function DamageFeed({ feed }) {
  if (!feed || feed.length === 0) {
    return (
      <div style={{
        fontFamily: FONTS.pixel,
        fontSize: SIZES.fontXs,
        color: COLORS.textMuted,
        textAlign: 'center',
        padding: SIZES.spacing * 2,
      }}>
        No damage dealt yet...
      </div>
    );
  }

  return (
    <div style={{
      maxHeight: 200,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}>
      {[...feed].reverse().map((entry, i) => {
        const isDealt = entry.type === 'dealt';
        return (
          <div key={i} style={{
            padding: `4px ${SIZES.spacing}px`,
            backgroundColor: isDealt ? 'rgba(57, 255, 20, 0.05)' : 'rgba(255, 68, 68, 0.05)',
            borderLeft: `3px solid ${isDealt ? COLORS.neonGreen : COLORS.fireRed}`,
            fontFamily: FONTS.pixel,
            fontSize: SIZES.fontXs,
            color: COLORS.textSecondary,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>
              <span style={{ color: COLORS.textPrimary }}>{entry.displayName}</span>
              {isDealt ? ' dealt ' : ' took '}
              <span style={{ color: isDealt ? COLORS.neonGreen : COLORS.fireRed }}>
                {entry.damage}
              </span>
              {' dmg'}
              {entry.taskTitle && (
                <span style={{ color: COLORS.textMuted }}> ({entry.taskTitle})</span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
