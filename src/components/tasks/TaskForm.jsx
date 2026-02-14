import { useState, useEffect } from 'react';
import PixelModal from '../ui/PixelModal';
import PixelButton from '../ui/PixelButton';
import PixelInput from '../ui/PixelInput';
import { COLORS, FONTS, SIZES } from '../../styles/theme';
import { DIFFICULTY_COLORS, DAYS_OF_WEEK } from '../../utils/constants';

export default function TaskForm({ task, taskType, onSave, onDelete, onClose }) {
  const isEditing = !!task;
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [positive, setPositive] = useState(true);
  const [negative, setNegative] = useState(true);
  const [frequency, setFrequency] = useState('daily');
  const [daysOfWeek, setDaysOfWeek] = useState([0, 1, 2, 3, 4, 5, 6]);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setNotes(task.notes || '');
      setDifficulty(task.difficulty || 'easy');
      setPositive(task.positive !== false);
      setNegative(task.negative !== false);
      setFrequency(task.frequency || 'daily');
      setDaysOfWeek(task.daysOfWeek || [0, 1, 2, 3, 4, 5, 6]);
    }
  }, [task]);

  const type = task?.type || taskType;

  const handleSave = () => {
    if (!title.trim()) return;

    const data = {
      type,
      title: title.trim(),
      notes: notes.trim(),
      difficulty,
    };

    if (type === 'habit') {
      data.positive = positive;
      data.negative = negative;
      if (!isEditing) {
        data.counterUp = 0;
        data.counterDown = 0;
      }
    }

    if (type === 'daily') {
      data.frequency = frequency;
      data.daysOfWeek = frequency === 'weekly' ? daysOfWeek : [0, 1, 2, 3, 4, 5, 6];
      if (!isEditing) {
        data.streak = 0;
        data.completed = false;
      }
    }

    if (type === 'todo') {
      if (!isEditing) {
        data.completed = false;
      }
    }

    onSave(data, task?.id);
  };

  const toggleDay = (day) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <PixelModal
      onClose={onClose}
      title={isEditing ? 'EDIT QUEST' : 'NEW QUEST'}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: SIZES.spacing * 2 }}>
        {/* Title */}
        <div>
          <label style={{
            fontFamily: FONTS.pixel,
            fontSize: SIZES.fontXs,
            color: COLORS.textSecondary,
            display: 'block',
            marginBottom: 4,
          }}>TITLE</label>
          <PixelInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter quest name..."
          />
        </div>

        {/* Notes */}
        <div>
          <label style={{
            fontFamily: FONTS.pixel,
            fontSize: SIZES.fontXs,
            color: COLORS.textSecondary,
            display: 'block',
            marginBottom: 4,
          }}>NOTES</label>
          <PixelInput
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional details..."
          />
        </div>

        {/* Difficulty */}
        <div>
          <label style={{
            fontFamily: FONTS.pixel,
            fontSize: SIZES.fontXs,
            color: COLORS.textSecondary,
            display: 'block',
            marginBottom: 4,
          }}>DIFFICULTY</label>
          <div style={{ display: 'flex', gap: 4 }}>
            {['trivial', 'easy', 'medium', 'hard'].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                style={{
                  flex: 1,
                  padding: `${SIZES.spacing}px 4px`,
                  fontFamily: FONTS.pixel,
                  fontSize: 7,
                  backgroundColor: difficulty === d ? `${DIFFICULTY_COLORS[d]}20` : COLORS.bgDarkest,
                  color: difficulty === d ? DIFFICULTY_COLORS[d] : COLORS.textMuted,
                  border: `2px solid ${difficulty === d ? DIFFICULTY_COLORS[d] : COLORS.border}`,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Habit-specific: positive/negative */}
        {type === 'habit' && (
          <div>
            <label style={{
              fontFamily: FONTS.pixel,
              fontSize: SIZES.fontXs,
              color: COLORS.textSecondary,
              display: 'block',
              marginBottom: 4,
            }}>DIRECTIONS</label>
            <div style={{ display: 'flex', gap: SIZES.spacing }}>
              <button
                onClick={() => setPositive(!positive)}
                style={{
                  flex: 1,
                  padding: SIZES.spacing,
                  fontFamily: FONTS.pixel,
                  fontSize: SIZES.fontXs,
                  backgroundColor: positive ? 'rgba(57, 255, 20, 0.15)' : COLORS.bgDarkest,
                  color: positive ? COLORS.neonGreen : COLORS.textMuted,
                  border: `2px solid ${positive ? COLORS.neonGreen : COLORS.border}`,
                  cursor: 'pointer',
                }}
              >
                + POSITIVE
              </button>
              <button
                onClick={() => setNegative(!negative)}
                style={{
                  flex: 1,
                  padding: SIZES.spacing,
                  fontFamily: FONTS.pixel,
                  fontSize: SIZES.fontXs,
                  backgroundColor: negative ? 'rgba(255, 68, 68, 0.15)' : COLORS.bgDarkest,
                  color: negative ? COLORS.fireRed : COLORS.textMuted,
                  border: `2px solid ${negative ? COLORS.fireRed : COLORS.border}`,
                  cursor: 'pointer',
                }}
              >
                - NEGATIVE
              </button>
            </div>
          </div>
        )}

        {/* Daily-specific: frequency and days */}
        {type === 'daily' && (
          <>
            <div>
              <label style={{
                fontFamily: FONTS.pixel,
                fontSize: SIZES.fontXs,
                color: COLORS.textSecondary,
                display: 'block',
                marginBottom: 4,
              }}>FREQUENCY</label>
              <div style={{ display: 'flex', gap: 4 }}>
                {['daily', 'weekly'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFrequency(f)}
                    style={{
                      flex: 1,
                      padding: SIZES.spacing,
                      fontFamily: FONTS.pixel,
                      fontSize: SIZES.fontXs,
                      backgroundColor: frequency === f ? 'rgba(0, 191, 255, 0.15)' : COLORS.bgDarkest,
                      color: frequency === f ? COLORS.neonBlue : COLORS.textMuted,
                      border: `2px solid ${frequency === f ? COLORS.neonBlue : COLORS.border}`,
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {frequency === 'weekly' && (
              <div>
                <label style={{
                  fontFamily: FONTS.pixel,
                  fontSize: SIZES.fontXs,
                  color: COLORS.textSecondary,
                  display: 'block',
                  marginBottom: 4,
                }}>ACTIVE DAYS</label>
                <div style={{ display: 'flex', gap: 3 }}>
                  {DAYS_OF_WEEK.map((day, i) => (
                    <button
                      key={i}
                      onClick={() => toggleDay(i)}
                      style={{
                        flex: 1,
                        padding: `${SIZES.spacing}px 2px`,
                        fontFamily: FONTS.pixel,
                        fontSize: 7,
                        backgroundColor: daysOfWeek.includes(i) ? 'rgba(0, 255, 204, 0.15)' : COLORS.bgDarkest,
                        color: daysOfWeek.includes(i) ? COLORS.neonCyan : COLORS.textMuted,
                        border: `2px solid ${daysOfWeek.includes(i) ? COLORS.neonCyan : COLORS.border}`,
                        cursor: 'pointer',
                      }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: SIZES.spacing, marginTop: SIZES.spacing }}>
          {isEditing && onDelete && (
            <PixelButton variant="danger" onClick={() => onDelete(task.id)} style={{ flex: 1 }}>
              DELETE
            </PixelButton>
          )}
          <PixelButton variant="ghost" onClick={onClose} style={{ flex: 1 }}>
            CANCEL
          </PixelButton>
          <PixelButton variant="gold" onClick={handleSave} style={{ flex: 2 }}>
            {isEditing ? 'SAVE' : 'CREATE'}
          </PixelButton>
        </div>
      </div>
    </PixelModal>
  );
}
