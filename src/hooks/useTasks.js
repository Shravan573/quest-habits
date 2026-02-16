import { useState, useEffect } from 'react';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { calculateDamage, calculateNegativeHabitDamage, calculateTaskRewards, checkLevelUp } from '../utils/damage';
import { getSkillEffect } from '../data/classes';
import { useAuthContext } from '../contexts/AuthContext';

export function useTasks() {
  const { user, profile } = useAuthContext();
  const [tasks, setTasks] = useState({ habits: [], dailies: [], todos: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    const unsub = onSnapshot(tasksRef, (snapshot) => {
      const habits = [];
      const dailies = [];
      const todos = [];
      snapshot.forEach((d) => {
        const task = { id: d.id, ...d.data() };
        if (task.type === 'habit') habits.push(task);
        else if (task.type === 'daily') dailies.push(task);
        else if (task.type === 'todo') todos.push(task);
      });
      setTasks({ habits, dailies, todos });
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const addTask = async (taskData) => {
    if (!user) return;
    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    await addDoc(tasksRef, {
      ...taskData,
      createdAt: new Date().toISOString(),
    });
  };

  const updateTask = async (taskId, updates) => {
    if (!user) return;
    const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
    await updateDoc(taskRef, updates);
  };

  const deleteTask = async (taskId) => {
    if (!user) return;
    const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
    await deleteDoc(taskRef);
  };

  const applyRewards = async (xp, gold, levelUp) => {
    const userRef = doc(db, 'users', user.uid);
    if (levelUp) {
      await updateDoc(userRef, {
        xp: levelUp.remainingXp,
        gold: profile.gold + gold,
        level: profile.level + 1,
        maxHp: profile.maxHp + 5,
        hp: profile.maxHp + 5,
        skillPoints: (profile.skillPoints || 0) + 1,
      });
    } else {
      await updateDoc(userRef, {
        xp: profile.xp + xp,
        gold: profile.gold + gold,
      });
    }
  };

  const scoreHabit = async (task, direction, targetType, activeBoss) => {
    if (!user || !profile) return null;

    const updates = {};
    if (direction === 'up') {
      updates.counterUp = (task.counterUp || 0) + 1;
    } else {
      updates.counterDown = (task.counterDown || 0) + 1;
    }
    await updateTask(task.id, updates);

    if (direction === 'up') {
      const damage = calculateDamage(task, profile, targetType || 'boss');
      const { xp, gold } = calculateTaskRewards(task, profile);
      const newXp = profile.xp + xp;
      const levelUp = checkLevelUp(newXp, profile.level);
      await applyRewards(xp, gold, levelUp);
      await applySkillHeal('heal_on_habit');
      return { damage, xp, gold, levelUp: !!levelUp };
    }

    // Negative habit — boss attacks the player
    return await applyNegativeHabit(task, activeBoss);
  };

  const completeDaily = async (task, targetType) => {
    if (!user || !profile) return null;
    if (task.completed) return null;

    const newStreak = (task.streak || 0) + 1;
    await updateTask(task.id, { completed: true, streak: newStreak });

    const damage = calculateDamage({ ...task, streak: newStreak }, profile, targetType || 'boss');
    const { xp, gold } = calculateTaskRewards(task, profile);
    const newXp = profile.xp + xp;
    const levelUp = checkLevelUp(newXp, profile.level);
    await applyRewards(xp, gold, levelUp);
    await applySkillHeal('heal_on_daily');
    return { damage, xp, gold, levelUp: !!levelUp };
  };

  const completeTodo = async (task, targetType) => {
    if (!user || !profile) return null;
    if (task.completed) return null;

    await updateTask(task.id, { completed: true });

    const damage = calculateDamage(task, profile, targetType || 'boss');
    const { xp, gold } = calculateTaskRewards(task, profile);
    const newXp = profile.xp + xp;
    const levelUp = checkLevelUp(newXp, profile.level);
    await applyRewards(xp, gold, levelUp);
    await applySkillHeal('heal_on_todo');
    return { damage, xp, gold, levelUp: !!levelUp };
  };

  const applyNegativeHabit = async (task, activeBoss) => {
    if (!user || !profile) return null;
    const bossAtk = activeBoss?.attackPower || 5; // fallback if no boss
    const bossDamage = calculateNegativeHabitDamage(task, bossAtk, profile);
    const newHp = Math.max(0, profile.hp - bossDamage);

    const userRef = doc(db, 'users', user.uid);
    if (newHp <= 0) {
      // Death penalty: lose a level (min 1), restore HP, lose gold
      const newLevel = Math.max(1, profile.level - 1);
      const newMaxHp = 50 + (newLevel * 5);
      await updateDoc(userRef, {
        hp: newMaxHp,
        maxHp: newMaxHp,
        level: newLevel,
        gold: Math.max(0, profile.gold - 10),
      });
      return { bossDamage, hpLost: profile.hp, died: true };
    } else {
      await updateDoc(userRef, { hp: newHp });
      return { bossDamage, hpLost: bossDamage, died: false };
    }
  };

  const applySkillHeal = async (effectType) => {
    if (!user || !profile) return;
    const skills = profile.skills || {};
    const healAmount = getSkillEffect(skills, effectType);
    if (healAmount <= 0) return;
    const newHp = Math.min(profile.hp + healAmount, profile.maxHp);
    if (newHp > profile.hp) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { hp: newHp });
    }
  };

  return { tasks, loading, addTask, updateTask, deleteTask, scoreHabit, completeDaily, completeTodo };
}
