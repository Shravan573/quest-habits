import { doc, updateDoc, runTransaction } from 'firebase/firestore';
import { db } from '../firebase';
import { BOSSES, BOSS_ORDER } from '../data/bosses';
import { BOSS_MINIONS } from '../data/minions';

export function useEncounter(party) {

  const startEncounter = async () => {
    if (!party?.id) return;
    const bossIndex = Math.min(party.bossLevel || 0, BOSS_ORDER.length - 1);
    const bossKey = BOSS_ORDER[bossIndex];
    const bossDef = BOSSES[bossKey];
    const minionDefs = BOSS_MINIONS[bossKey] || [];

    const minions = minionDefs.map((m, i) => ({
      ...m,
      currentHp: m.maxHp,
      defeated: false,
      index: i,
    }));

    const partyRef = doc(db, 'parties', party.id);
    await updateDoc(partyRef, {
      encounter: {
        phase: 'minions',
        currentMinionIndex: 0,
        minions,
        boss: {
          bossKey: bossDef.key,
          name: bossDef.name,
          currentHp: bossDef.maxHp,
          maxHp: bossDef.maxHp,
          attackPower: bossDef.attackPower,
          level: bossDef.level,
          rewards: bossDef.rewards,
        },
      },
      activeBoss: {
        bossKey: bossDef.key,
        name: bossDef.name,
        currentHp: bossDef.maxHp,
        maxHp: bossDef.maxHp,
        attackPower: bossDef.attackPower,
        level: bossDef.level,
        rewards: bossDef.rewards,
      },
      damageFeed: [],
    });
  };

  const dealDamageToEncounter = async (damage, task, userId, displayName) => {
    if (!party?.encounter) return 0;

    const partyRef = doc(db, 'parties', party.id);
    const encounter = party.encounter;

    const feedEntry = {
      userId,
      displayName,
      damage,
      taskTitle: task.title,
      timestamp: new Date().toISOString(),
      type: 'dealt',
    };
    const newFeed = [...(party.damageFeed || []), feedEntry].slice(-20);

    if (encounter.phase === 'minions') {
      // Damage current minion
      const minionIdx = encounter.currentMinionIndex;
      const minions = [...encounter.minions];
      const minion = { ...minions[minionIdx] };
      minion.currentHp = Math.max(0, minion.currentHp - damage);

      feedEntry.targetName = minion.name;

      if (minion.currentHp <= 0) {
        // Minion defeated
        minion.defeated = true;
        minion.currentHp = 0;
        minions[minionIdx] = minion;

        // Award minion XP/gold to the player
        const userRef = doc(db, 'users', userId);
        const { getDoc } = await import('firebase/firestore');
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const newXp = userData.xp + minion.xp;
          const newGold = userData.gold + minion.gold;

          // Check level up
          const xpNeeded = 100 * userData.level;
          if (newXp >= xpNeeded) {
            await updateDoc(userRef, {
              xp: newXp - xpNeeded,
              gold: newGold,
              level: userData.level + 1,
              maxHp: userData.maxHp + 5,
              hp: userData.maxHp + 5,
              skillPoints: (userData.skillPoints || 0) + 1,
            });
          } else {
            await updateDoc(userRef, { xp: newXp, gold: newGold });
          }
        }

        // Check if all minions defeated
        const nextAlive = minions.findIndex((m, i) => i > minionIdx && !m.defeated);
        if (nextAlive === -1) {
          // All minions dead — move to boss phase
          await updateDoc(partyRef, {
            encounter: { ...encounter, minions, phase: 'boss', currentMinionIndex: minionIdx },
            damageFeed: newFeed,
          });
        } else {
          await updateDoc(partyRef, {
            encounter: { ...encounter, minions, currentMinionIndex: nextAlive },
            damageFeed: newFeed,
          });
        }
      } else {
        minions[minionIdx] = minion;
        await updateDoc(partyRef, {
          encounter: { ...encounter, minions },
          damageFeed: newFeed,
        });
      }

      return damage;
    }

    if (encounter.phase === 'boss') {
      // Damage the boss
      const boss = { ...encounter.boss };
      boss.currentHp = Math.max(0, boss.currentHp - damage);

      feedEntry.targetName = boss.name;

      await updateDoc(partyRef, {
        encounter: { ...encounter, boss },
        'activeBoss.currentHp': boss.currentHp,
        damageFeed: newFeed,
      });

      if (boss.currentHp <= 0) {
        await defeatBoss(party.id);
      }

      return damage;
    }

    return 0;
  };

  const defeatBoss = async (partyId) => {
    const partyRef = doc(db, 'parties', partyId);

    await runTransaction(db, async (transaction) => {
      const partySnap = await transaction.get(partyRef);
      const data = partySnap.data();
      if (!data.encounter?.boss || data.encounter.boss.currentHp > 0) return;

      const rewards = data.encounter.boss.rewards;

      for (const memberId of data.memberIds) {
        const userRef = doc(db, 'users', memberId);
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) continue;
        const userData = userSnap.data();

        const newXp = userData.xp + rewards.xp;
        const xpNeeded = 100 * userData.level;
        if (newXp >= xpNeeded) {
          transaction.update(userRef, {
            xp: newXp - xpNeeded,
            gold: userData.gold + rewards.gold,
            level: userData.level + 1,
            maxHp: userData.maxHp + 5,
            hp: userData.maxHp + 5,
            skillPoints: (userData.skillPoints || 0) + 1,
          });
        } else {
          transaction.update(userRef, {
            xp: newXp,
            gold: userData.gold + rewards.gold,
          });
        }
      }

      transaction.update(partyRef, {
        encounter: { ...data.encounter, phase: 'victory' },
        activeBoss: null,
        bossLevel: data.bossLevel + 1,
      });
    });
  };

  const getCurrentTarget = () => {
    if (!party?.encounter) return null;
    const enc = party.encounter;
    if (enc.phase === 'minions') {
      return {
        type: 'minion',
        data: enc.minions[enc.currentMinionIndex],
        remaining: enc.minions.filter((m) => !m.defeated).length,
        total: enc.minions.length,
      };
    }
    if (enc.phase === 'boss') {
      return { type: 'boss', data: enc.boss };
    }
    return null;
  };

  return { startEncounter, dealDamageToEncounter, getCurrentTarget, defeatBoss };
}
