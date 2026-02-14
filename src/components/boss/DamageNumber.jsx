import { useEffect, useState } from 'react';
import { COLORS, FONTS, SIZES } from '../../styles/theme';

export default function DamageNumber({ amount, type = 'dealt', id }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const color = type === 'dealt' ? COLORS.neonGreen : COLORS.fireRed;
  const prefix = type === 'dealt' ? '-' : '+';
  const offsetX = Math.random() * 60 - 30;

  return (
    <div style={{
      position: 'absolute',
      top: '40%',
      left: `calc(50% + ${offsetX}px)`,
      transform: 'translateX(-50%)',
      fontFamily: FONTS.pixel,
      fontSize: SIZES.fontXl,
      color,
      textShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
      animation: 'damageFloat 1.5s ease-out forwards',
      pointerEvents: 'none',
      zIndex: 10,
    }}>
      {prefix}{amount}
    </div>
  );
}
