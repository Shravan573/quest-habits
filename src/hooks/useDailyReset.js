import { useEffect, useRef } from 'react';
import {
  collection, getDocs, getDoc, doc, updateDoc, writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthContext } from '../contexts/AuthContext';
import { shouldRunCron, isDailyDueToday } from '../utils/dailyReset';
import { calculateBossAttack } from '../utils/damage';

export function useDailyReset() {
  const { user, profile } = useAuthContext();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!user || !profile || hasRun.current) return;
    if (!shouldRunCron(profile.lastCron)) return;

    hasRun.current = true;
    runCron(user.uid, profile);
  }, [user, profile]);
}

async function runCron(userId, profile) {
  try {
    const tasksRef = collection(db, 'users', userId, 'tasks');
    const snapshot = await getDocs(tasksRef);

    const dailies = [];
    snapshot.forEach((d) => {
      const task = { id: d.id, ...d.data() };
      if (task.type === 'daily') {
        dailies.push(task);
      }
    });

    // Count missed dailies (were due but not completed)
    let missedCount = 0;
    const batch = writeBatch(db);

    for (const daily of dailies) {
      const wasDue = isDailyDueToday(daily); // Checking against yesterday's schedule is complex; simplified here
      const taskRef = doc(db, 'users', userId, 'tasks', daily.id);

      if (daily.completed) {
        // Was completed — keep streak, reset for today
        batch.update(taskRef, { completed: false });
      } else if (wasDue) {
        // Was due but not completed — reset streak, count as missed
        missedCount++;
        batch.update(taskRef, { completed: false, streak: 0 });
      }
    }

    await batch.commit();

    // Apply boss damage if player is in a party with an active boss
    if (missedCount > 0 && profile.partyId) {
      await applyBossAttack(userId, profile, missedCount);
    }

    // Update lastCron
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { lastCron: new Date().toISOString() });
  } catch (err) {
    console.error('Daily reset failed:', err);
  }
}

async function applyBossAttack(userId, profile, missedCount) {
  try {
    const partyRef = doc(db, 'parties', profile.partyId);
    const partySnap = await getDoc(partyRef);
    if (!partySnap.exists()) return;

    const party = partySnap.data();
    if (!party.activeBoss) return;

    const damage = calculateBossAttack(missedCount, party.activeBoss.attackPower, profile);

    // Apply damage to ALL party members
    const updates = {};
    for (const memberId of party.memberIds) {
      const memberData = party.members[memberId];
      if (!memberData) continue;

      const newHp = Math.max(0, memberData.hp - damage);
      updates[`members.${memberId}.hp`] = newHp;

      // Also update the user doc
      const memberRef = doc(db, 'users', memberId);
      const memberSnap = await getDoc(memberRef);
      if (memberSnap.exists()) {
        const userData = memberSnap.data();
        let memberNewHp = Math.max(0, userData.hp - damage);
        const memberUpdates = { hp: memberNewHp };

        // If HP hits 0, penalize: lose a level (min 1), restore HP, lose some gold
        if (memberNewHp <= 0) {
          const newLevel = Math.max(1, userData.level - 1);
          const newMaxHp = 50 + (newLevel * 5);
          memberUpdates.hp = newMaxHp;
          memberUpdates.level = newLevel;
          memberUpdates.maxHp = newMaxHp;
          memberUpdates.gold = Math.max(0, userData.gold - 10);
          updates[`members.${memberId}.hp`] = newMaxHp;
          updates[`members.${memberId}.level`] = newLevel;
          updates[`members.${memberId}.maxHp`] = newMaxHp;
        }

        await updateDoc(memberRef, memberUpdates);
      }
    }

    // Add boss attack to damage feed
    const feedEntry = {
      userId,
      displayName: profile.displayName,
      damage,
      taskTitle: `${missedCount} missed daily${missedCount > 1 ? 's' : ''}`,
      timestamp: new Date().toISOString(),
      type: 'received',
    };

    const newFeed = [...(party.damageFeed || []), feedEntry].slice(-20);
    updates.damageFeed = newFeed;

    await updateDoc(partyRef, updates);
  } catch (err) {
    console.error('Boss attack failed:', err);
  }
}
