import { useMemo } from 'react';
import { BOSSES } from '../../data/bosses';

function generateBoxShadow(pixels, scale) {
  if (!pixels || pixels.length === 0) return 'none';
  return pixels.map(([x, y, color]) =>
    `${x * scale}px ${y * scale}px 0 0 ${color}`
  ).join(', ');
}

export default function BossSprite({ bossKey, scale = 6, animate = true, hit = false }) {
  const boss = BOSSES[bossKey];

  const boxShadow = useMemo(() => {
    if (!boss?.pixels) return 'none';
    return generateBoxShadow(boss.pixels, scale);
  }, [boss, scale]);

  if (!boss) {
    return (
      <div style={{ fontSize: 64, textAlign: 'center' }}>
        🐉
      </div>
    );
  }

  // Calculate total size for centering
  const maxX = Math.max(...boss.pixels.map(([x]) => x));
  const maxY = Math.max(...boss.pixels.map(([, y]) => y));
  const totalWidth = (maxX + 1) * scale;
  const totalHeight = (maxY + 1) * scale;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: scale * 2,
    }}>
      <div style={{
        width: totalWidth,
        height: totalHeight,
        position: 'relative',
      }}>
        <div style={{
          width: scale,
          height: scale,
          boxShadow,
          animation: hit
            ? 'bossHit 0.3s ease'
            : animate
              ? 'bossBob 1.5s ease-in-out infinite'
              : 'none',
          filter: hit ? 'brightness(2)' : 'none',
          transition: 'filter 0.1s',
        }} />
        {/* Glow effect under the boss */}
        <div style={{
          position: 'absolute',
          bottom: -scale,
          left: '50%',
          transform: 'translateX(-50%)',
          width: totalWidth * 0.8,
          height: scale * 2,
          background: `radial-gradient(ellipse, ${boss.glowColor}33 0%, transparent 70%)`,
          borderRadius: '50%',
        }} />
      </div>
    </div>
  );
}
