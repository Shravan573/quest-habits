import { useState, useEffect } from 'react';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { calculateDamageToBoss, calculateTaskRewards, checkLevelUp } from '../utils/damage';
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

  const scoreHabit = async (task, direction) => {
    if (!user || !profile) return null;

    const updates = {};
    if (direction === 'up') {
      updates.counterUp = (task.counterUp || 0) + 1;
    } else {
      updates.counterDown = (task.counterDown || 0) + 1;
    }

    await updateTask(task.id, updates);

    if (direction === 'up') {
      const damage = calculateDamageToBoss(task, profile.level);
      const { xp, gold } = calculateTaskRewards(task, profile.level);

      const userRef = doc(db, 'users', user.uid);
      const newXp = profile.xp + xp;
      const levelUp = checkLevelUp(newXp, profile.level);

      if (levelUp) {
        await updateDoc(userRef, {
          xp: levelUp.remainingXp,
          gold: profile.gold + gold,
          level: profile.level + 1,
          maxHp: levelUp.newMaxHp,
          hp: levelUp.newMaxHp,
        });
      } else {
        await updateDoc(userRef, {
          xp: newXp,
          gold: profile.gold + gold,
        });
      }

      return { damage, xp, gold, levelUp: !!levelUp };
    }

    return null;
  };

  const completeDaily = async (task) => {
    if (!user || !profile) return null;
    if (task.completed) return null;

    const newStreak = (task.streak || 0) + 1;
    await updateTask(task.id, { completed: true, streak: newStreak });

    const damage = calculateDamageToBoss({ ...task, streak: newStreak }, profile.level);
    const { xp, gold } = calculateTaskRewards(task, profile.level);

    const userRef = doc(db, 'users', user.uid);
    const newXp = profile.xp + xp;
    const levelUp = checkLevelUp(newXp, profile.level);

    if (levelUp) {
      await updateDoc(userRef, {
        xp: levelUp.remainingXp,
        gold: profile.gold + gold,
        level: profile.level + 1,
        maxHp: levelUp.newMaxHp,
        hp: levelUp.newMaxHp,
      });
    } else {
      await updateDoc(userRef, {
        xp: newXp,
        gold: profile.gold + gold,
      });
    }

    return { damage, xp, gold, levelUp: !!levelUp };
  };

  const completeTodo = async (task) => {
    if (!user || !profile) return null;
    if (task.completed) return null;

    await updateTask(task.id, { completed: true });

    const damage = calculateDamageToBoss(task, profile.level);
    const { xp, gold } = calculateTaskRewards(task, profile.level);

    const userRef = doc(db, 'users', user.uid);
    const newXp = profile.xp + xp;
    const levelUp = checkLevelUp(newXp, profile.level);

    if (levelUp) {
      await updateDoc(userRef, {
        xp: levelUp.remainingXp,
        gold: profile.gold + gold,
        level: profile.level + 1,
        maxHp: levelUp.newMaxHp,
        hp: levelUp.newMaxHp,
      });
    } else {
      await updateDoc(userRef, {
        xp: newXp,
        gold: profile.gold + gold,
      });
    }

    return { damage, xp, gold, levelUp: !!levelUp };
  };

  return { tasks, loading, addTask, updateTask, deleteTask, scoreHabit, completeDaily, completeTodo };
}
