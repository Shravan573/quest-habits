import { useState, useCallback } from 'react';
import { useTasks } from '../hooks/useTasks';
import { usePartyContext } from '../contexts/PartyContext';
import { useEncounter } from '../hooks/useEncounter';
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
  const { dealDamageToEncounter, getCurrentTarget } = useEncounter(party);

  const [activeTab, setActiveTab] = useState('habits');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [damagePopup, setDamagePopup] = useState(null);

  const target = getCurrentTarget();
  const targetType = target?.type || 'boss';

  const showDamagePopup = useCallback((result) => {
    if (!result) return;
    setDamagePopup(result);
    setTimeout(() => setDamagePopup(null), 1500);
  }, []);

  const handleDealDamage = useCallback(async (result, task) => {
    if (!result || !party?.encounter) return;
    await dealDamageToEncounter(result.damage, task, user.uid, profile.displayName);
  }, [dealDamageToEncounter, party, user, profile]);

  const handleScore = useCallback(async (task, direction) => {
    const activeBoss = party?.encounter?.boss || party?.activeBoss;
    const result = await scoreHabit(task, direction, targetType, activeBoss);
    if (result && direction === 'up' && party?.encounter) {
      await handleDealDamage(result, task);
    }
    showDamagePopup(result);
  }, [scoreHabit, handleDealDamage, party, targetType, showDamagePopup]);

  const handleCompleteDaily = useCallback(async (task) => {
    const result = await completeDaily(task, targetType);
    if (result && party?.encounter) {
      await handleDealDamage(result, task);
    }
    showDamagePopup(result);
  }, [completeDaily, handleDealDamage, party, targetType, showDamagePopup]);

  const handleCompleteTodo = useCallback(async (task) => {
    const result = await completeTodo(task, targetType);
    if (result && party?.encounter) {
      await handleDealDamage(result, task);
    }
    showDamagePopup(result);
  }, [completeTodo, handleDealDamage, party, targetType, showDamagePopup]);

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
      {/* Damage popup — positive (green) or negative habit (red) */}
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
          {damagePopup.bossDamage ? (
            <>
              <div style={{
                fontFamily: FONTS.pixel,
                fontSize: SIZES.fontXl,
                color: COLORS.fireRed,
                textShadow: `0 0 10px ${COLORS.fireRed}`,
              }}>
                BOSS HIT! -{damagePopup.bossDamage} HP
              </div>
              {damagePopup.died && (
                <div style={{
                  fontFamily: FONTS.pixel,
                  fontSize: SIZES.fontLg,
                  color: COLORS.fireRed,
                  textShadow: `0 0 15px ${COLORS.fireRed}`,
                  marginTop: 4,
                }}>
                  YOU DIED! -1 LEVEL -10 GOLD
                </div>
              )}
            </>
          ) : (
            <>
              {damagePopup.damage > 0 && (
                <div style={{
                  fontFamily: FONTS.pixel,
                  fontSize: SIZES.fontXl,
                  color: COLORS.neonGreen,
                  textShadow: `0 0 10px ${COLORS.neonGreen}`,
                }}>
                  -{damagePopup.damage}
                </div>
              )}
              <div style={{
                fontFamily: FONTS.pixel,
                fontSize: SIZES.fontSm,
                color: COLORS.gold,
                marginTop: 4,
              }}>
                +{damagePopup.xp} XP  +{damagePopup.gold}G
              </div>
              {damagePopup.levelUp && (
                <div style={{
                  fontFamily: FONTS.pixel,
                  fontSize: SIZES.fontLg,
                  color: COLORS.gold,
                  textShadow: `0 0 15px ${COLORS.gold}`,
                  marginTop: 4,
                }}>
                  LEVEL UP! +1 SKILL POINT
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Encounter Preview */}
      {party?.encounter && target && (
        <BossPreview boss={target.type === 'boss' ? target.data : null} minion={target.type === 'minion' ? target.data : null} encounterInfo={target} />
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
