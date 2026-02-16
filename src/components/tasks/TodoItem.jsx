import { useState } from 'react';
import { COLORS, FONTS, SIZES, PIXEL_BORDER } from '../../styles/theme';
import { DIFFICULTY_COLORS } from '../../utils/constants';

export default function TodoItem({ task, onComplete, onDelete, onEdit }) {
  const [animating, setAnimating] = useState(false);

  const handleComplete = async () => {
    if (task.completed) return;
    setAnimating(true);
    await onComplete(task);
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <div style={{
      ...PIXEL_BORDER,
      backgroundColor: task.completed ? 'rgba(57, 255, 20, 0.05)' : COLORS.bgDark,
      padding: SIZES.spacing,
      display: 'flex',
      alignItems: 'center',
      gap: SIZES.spacing,
      opacity: task.completed ? 0.6 : 1,
      animation: animating ? 'taskComplete 0.3s ease' : undefined,
    }}>
      {/* Checkbox */}
      <button
        onClick={handleComplete}
        style={{
          width: 28,
          height: 28,
          backgroundColor: task.completed ? COLORS.neonGreen : 'transparent',
          border: `2px solid ${task.completed ? COLORS.neonGreen : COLORS.border}`,
          color: task.completed ? COLORS.bgDarkest : 'transparent',
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontSm,
          cursor: task.completed ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {task.completed ? '✓' : ''}
      </button>

      {/* Task Info */}
      <div
        style={{ flex: 1, cursor: 'pointer' }}
        onClick={() => onEdit(task)}
      >
        <div style={{
          fontFamily: FONTS.pixel,
          fontSize: SIZES.fontSm,
          color: COLORS.textPrimary,
          textDecoration: task.completed ? 'line-through' : 'none',
          marginBottom: 2,
        }}>
          {task.title}
        </div>
        <div style={{ display: 'flex', gap: SIZES.spacing, alignItems: 'center' }}>
          <span style={{
            fontFamily: FONTS.pixel,
            fontSize: SIZES.fontXs,
            color: DIFFICULTY_COLORS[task.difficulty],
            textTransform: 'uppercase',
          }}>
            {task.difficulty}
          </span>
          {task.dueDate && (
            <span style={{ fontFamily: FONTS.pixel, fontSize: SIZES.fontXs, color: COLORS.textMuted }}>
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Delete */}
      {task.completed && (
        <button
          onClick={() => onDelete(task.id)}
          style={{
            background: 'none',
            border: 'none',
            color: COLORS.fireRed,
            cursor: 'pointer',
            fontSize: 14,
            padding: 4,
          }}
        >
          🗑️
        </button>
      )}
    </div>
  );
}
