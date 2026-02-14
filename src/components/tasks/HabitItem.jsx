import { useState } from 'react';
import { COLORS, FONTS, SIZES, PIXEL_BORDER } from '../../styles/theme';
import { DIFFICULTY_COLORS } from '../../utils/constants';

export default function HabitItem({ task, onScore, onEdit }) {
  const [animating, setAnimating] = useState(null);

  const handleScore = async (direction) => {
    setAnimating(direction);
    await onScore(task, direction);
    setTimeout(() => setAnimating(null), 300);
  };

  return (
    <div style={{
      ...PIXEL_BORDER,
      backgroundColor: COLORS.bgDark,
      padding: SIZES.spacing,
      display: 'flex',
      alignItems: 'center',
      gap: SIZES.spacing,
      animation: animating ? 'taskComplete 0.3s ease' : undefined,
    }}>
      {/* + Button */}
      {task.positive !== false && (
        <button
          onClick={() => handleScore('up')}
          style={{
            width: 36,
            height: 36,
            backgroundColor: 'rgba(57, 255, 20, 0.15)',
            border: `2px solid ${COLORS.neonGreen}`,
            color: COLORS.neonGreen,
            fontFamily: FONTS.pixel,
            fontSize: SIZES.fontLg,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          +
        </button>
      )}

      {/* Task Info */}
      <div
        style={{ flex: 1, cursor: 'pointer' }}
        onClick={() => onEdit(task)}
      >
        <div style={{
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontSm,
          color: COLORS.textPrimary,
          marginBottom: 2,
        }}>
          {task.title}
        </div>
        <div style={{ display: 'flex', gap: SIZES.spacing, alignItems: 'center' }}>
          <span style={{
            fontFamily: FONTS.pixel,
            fontSize: 7,
            color: DIFFICULTY_COLORS[task.difficulty],
            textTransform: 'uppercase',
          }}>
            {task.difficulty}
          </span>
          {(task.counterUp > 0 || task.counterDown > 0) && (
            <span style={{
              fontFamily: FONTS.pixel,
              fontSize: 7,
              color: COLORS.textMuted,
            }}>
              +{task.counterUp || 0} / -{task.counterDown || 0}
            </span>
          )}
        </div>
      </div>

      {/* - Button */}
      {task.negative !== false && (
        <button
          onClick={() => handleScore('down')}
          style={{
            width: 36,
            height: 36,
            backgroundColor: 'rgba(255, 68, 68, 0.15)',
            border: `2px solid ${COLORS.fireRed}`,
            color: COLORS.fireRed,
            fontFamily: FONTS.pixel,
            fontSize: SIZES.fontLg,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          -
        </button>
      )}
    </div>
  );
}
