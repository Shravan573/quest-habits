import HabitItem from './HabitItem';
import DailyItem from './DailyItem';
import TodoItem from './TodoItem';
import { COLORS, FONTS, SIZES } from '../../styles/theme';

export default function TaskList({ tasks, type, onScore, onComplete, onDelete, onEdit }) {
  if (tasks.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: SIZES.spacing * 4,
        fontFamily: FONTS.pixel,
        fontSize: SIZES.fontXs,
        color: COLORS.textMuted,
      }}>
        No {type} yet. Create one!
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {tasks.map((task) => {
        if (type === 'habits') {
          return <HabitItem key={task.id} task={task} onScore={onScore} onEdit={onEdit} />;
        }
        if (type === 'dailies') {
          return <DailyItem key={task.id} task={task} onComplete={onComplete} onEdit={onEdit} />;
        }
        return <TodoItem key={task.id} task={task} onComplete={onComplete} onDelete={onDelete} onEdit={onEdit} />;
      })}
    </div>
  );
}
