import { useState, useCallback } from 'react';
import { useTasks } from '../hooks/useTasks';
import { usePartyContext } from '../contexts/PartyContext';
import { useBoss } from '../hooks/useBoss';
import { useAuthContext } from '../contexts/AuthContext';
import TaskTabs from '../components/tasks/TaskTabs';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import BossPreview from '../components/boss/BossPreview';
import PixelButton from '../components/ui/PixelButton';
import { COLORS, FONTS, SIZES } from '../styles/theme';

export default function DashboardPage() {
  const { user, profile } = useAuthContext();
  const { tasks, loading, addTask, updateTask, deleteTask, scoreHabit, completeDaily, completeTodo } = useTasks();
  const { party } = usePartyContext();
  const { dealDamage } = useBoss(party);

  const [activeTab, setActiveTab] = useState('habits');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [damagePopup, setDamagePopup] = useState(null);

  const showDamagePopup = useCallback((result) => {
    if (!result) return;
    setDamagePopup(result);
    setTimeout(() => setDamagePopup(null), 1500);
  }, []);

  const handleScore = useCallback(async (task, direction) => {
    const result = await scoreHabit(task, direction);
    if (result && party?.activeBoss && direction === 'up') {
      await dealDamage(result.damage, task, user.uid, profile.displayName);
    }
    showDamagePopup(result);
  }, [scoreHabit, dealDamage, party, user, profile, showDamagePopup]);

  const handleCompleteDaily = useCallback(async (task) => {
    const result = await completeDaily(task);
    if (result && party?.activeBoss) {
      await dealDamage(result.damage, task, user.uid, profile.displayName);
    }
    showDamagePopup(result);
  }, [completeDaily, dealDamage, party, user, profile, showDamagePopup]);

  const handleCompleteTodo = useCallback(async (task) => {
    const result = await completeTodo(task);
    if (result && party?.activeBoss) {
      await dealDamage(result.damage, task, user.uid, profile.displayName);
    }
    showDamagePopup(result);
  }, [completeTodo, dealDamage, party, user, profile, showDamagePopup]);

  const handleSaveTask = async (data, taskId) => {
    if (taskId) {
      await updateTask(taskId, data);
    } else {
      await addTask(data);
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    setShowForm(false);
    setEditingTask(null);
  };

  const currentTasks = activeTab === 'habits' ? tasks.habits
    : activeTab === 'dailies' ? tasks.dailies
    : tasks.todos;

  const taskTypeForForm = activeTab === 'habits' ? 'habit'
    : activeTab === 'dailies' ? 'daily'
    : 'todo';

  if (loading) {
    return (
      <div style={{
        padding: SIZES.spacing * 4,
        textAlign: 'center',
        fontFamily: FONTS.pixel,
        fontSize: SIZES.fontSm,
        color: COLORS.textMuted,
      }}>
        LOADING QUESTS...
      </div>
    );
  }

  return (
    <div style={{ padding: SIZES.spacing * 2, position: 'relative' }}>
      {/* Damage popup */}
      {damagePopup && (
        <div style={{
          position: 'fixed',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 200,
          textAlign: 'center',
          animation: 'damageFloat 1.5s ease-out forwards',
          pointerEvents: 'none',
        }}>
          {damagePopup.damage > 0 && (
            <div style={{
              fontFamily: FONTS.pixel,
              fontSize: SIZES.fontXl,
              color: COLORS.neonGreen,
              textShadow: `0 0 10px ${COLORS.neonGreen}`,
            }}>
              ⚔️ -{damagePopup.damage}
            </div>
          )}
          <div style={{
            fontFamily: FONTS.pixel,
            fontSize: SIZES.fontSm,
            color: COLORS.gold,
            marginTop: 4,
          }}>
            +{damagePopup.xp} XP  +{damagePopup.gold} 🪙
          </div>
          {damagePopup.levelUp && (
            <div style={{
              fontFamily: FONTS.pixel,
              fontSize: SIZES.fontLg,
              color: COLORS.gold,
              textShadow: `0 0 15px ${COLORS.gold}`,
              marginTop: 4,
            }}>
              LEVEL UP!
            </div>
          )}
        </div>
      )}

      {/* Boss Preview */}
      {party?.activeBoss && (
        <BossPreview boss={party.activeBoss} />
      )}

      {/* Task Tabs */}
      <TaskTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Add Task Button */}
      <div style={{ marginBottom: SIZES.spacing * 2 }}>
        <PixelButton
          variant="gold"
          onClick={() => { setEditingTask(null); setShowForm(true); }}
          style={{ width: '100%', padding: `${SIZES.spacing * 1.5}px 0` }}
        >
          + NEW {taskTypeForForm.toUpperCase()}
        </PixelButton>
      </div>

      {/* Task List */}
      <TaskList
        tasks={currentTasks}
        type={activeTab}
        onScore={handleScore}
        onComplete={activeTab === 'dailies' ? handleCompleteDaily : handleCompleteTodo}
        onDelete={handleDeleteTask}
        onEdit={handleEditTask}
      />

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          taskType={taskTypeForForm}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          onClose={() => { setShowForm(false); setEditingTask(null); }}
        />
      )}
    </div>
  );
}
