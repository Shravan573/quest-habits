import { useState } from 'react';
import { BUTTON_BASE, COLORS } from '../../styles/theme';

export default function PixelButton({ children, onClick, variant = 'default', disabled, style }) {
  const [hover, setHover] = useState(false);

  const variants = {
    default: { color: COLORS.neonGreen, bg: COLORS.bgMedium, hoverBg: COLORS.bgLight },
    danger: { color: COLORS.fireRed, bg: COLORS.bgMedium, hoverBg: '#3d1111' },
    gold: { color: COLORS.bgDarkest, bg: COLORS.gold, hoverBg: '#ffed4a' },
    ghost: { color: COLORS.textSecondary, bg: 'transparent', hoverBg: COLORS.bgDark },
  };

  const v = variants[variant] || variants.default;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...BUTTON_BASE,
        color: v.color,
        backgroundColor: hover && !disabled ? v.hoverBg : v.bg,
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
