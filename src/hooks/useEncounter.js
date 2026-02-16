import { doc, updateDoc, runTransaction, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { BOSSES, BOSS_ORDER } from '../data/bosses';
import { BOSS_MINIONS } from '../data/minions';
import { getSkillEffect } from '../data/classes';

export function useEncounter(party) {

  const startEncounter = async () => {
    if (!party?.id) {
      return { success: false, error: 'No party ID found' };
    }
    const bossIndex = Math.min(party.bossLevel || 0, BOSS_ORDER.length - 1);
    const bossKey = BOSS_ORDER[bossIndex];
    const bossDef = BOSSES[bossKey];

    if (!bossDef) {
      return { success: false, error: `Boss "${bossKey}" not found (index ${bossIndex})` };
    }

    const minionDefs = BOSS_MINIONS[bossKey] || [];

    // Only store essential data in Firestore — NOT pixel art arrays
    const minions = minionDefs.map((m, i) => ({
      key: m.key,
      name: m.name,
      maxHp: m.maxHp,
      currentHp: m.maxHp,
      xp: m.xp,
      gold: m.gold,
      emoji: m.emoji,
      glowColor: m.glowColor || null,
      defeated: false,
      index: i,
    }));

    const partyRef = doc(db, 'parties', party.id);
    try {
      await updateDoc(partyRef, {
        encounter: {
          phase: minions.length > 0 ? 'minions' : 'boss',
          currentMinionIndex: 0,
          bossKey,
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
      return { success: true };
    } catch (err) {
      console.error('startEncounter failed:', err);
      return { success: false, error: err.message || 'Firestore write failed' };
    }
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

    try {
      if (encounter.phase === 'minions') {
        const minionIdx = encounter.currentMinionIndex;
        const minions = [...encounter.minions];
        const minion = { ...minions[minionIdx] };
        minion.currentHp = Math.max(0, minion.currentHp - damage);

        feedEntry.targetName = minion.name;

        if (minion.currentHp <= 0) {
          minion.defeated = true;
          minion.currentHp = 0;
          minions[minionIdx] = minion;

          // Award minion XP/gold to the player
          const userRef = doc(db, 'users', userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const minionGoldBonus = getSkillEffect(userData.skills || {}, 'minion_gold_percent');
            const bonusGold = Math.round(minion.gold * (1 + minionGoldBonus / 100));
            const newXp = userData.xp + minion.xp;
            const newGold = userData.gold + bonusGold;

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
    } catch (err) {
      console.error('dealDamageToEncounter failed:', err);
    }

    return 0;
  };

  // Only updates the party doc — no cross-user writes (security rules block those)
  const defeatBoss = async (partyId) => {
    const partyRef = doc(db, 'parties', partyId);

    try {
      await runTransaction(db, async (transaction) => {
        const partySnap = await transaction.get(partyRef);
        const data = partySnap.data();
        if (!data.encounter?.boss || data.encounter.boss.currentHp > 0) return;
        if (data.encounter.phase === 'victory') return; // already defeated

        transaction.update(partyRef, {
          encounter: { ...data.encounter, phase: 'victory', rewardsClaimedBy: [] },
          activeBoss: null,
          bossLevel: (data.bossLevel || 0) + 1,
        });
      });
    } catch (err) {
      console.error('defeatBoss failed:', err);
    }
  };

  // Each user claims their own boss rewards (respects security rules)
  const claimBossRewards = async (userId) => {
    if (!party?.encounter?.boss?.rewards) return;
    if (party.encounter.phase !== 'victory') return;
    if (party.encounter.rewardsClaimedBy?.includes(userId)) return;

    const rewards = party.encounter.boss.rewards;
    const partyRef = doc(db, 'parties', party.id);
    const userRef = doc(db, 'users', userId);

    try {
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;
      const userData = userSnap.data();

      const newXp = userData.xp + rewards.xp;
      const xpNeeded = 100 * userData.level;
      if (newXp >= xpNeeded) {
        await updateDoc(userRef, {
          xp: newXp - xpNeeded,
          gold: userData.gold + rewards.gold,
          level: userData.level + 1,
          maxHp: userData.maxHp + 5,
          hp: userData.maxHp + 5,
          skillPoints: (userData.skillPoints || 0) + 1,
        });
      } else {
        await updateDoc(userRef, { xp: newXp, gold: userData.gold + rewards.gold });
      }

      // Mark rewards as claimed for this user
      const claimedBy = [...(party.encounter.rewardsClaimedBy || []), userId];
      await updateDoc(partyRef, { 'encounter.rewardsClaimedBy': claimedBy });
    } catch (err) {
      console.error('claimBossRewards failed:', err);
    }
  };

  // Look up pixel art from local data files (not stored in Firestore)
  const getMinionPixels = (minionData) => {
    if (!party?.encounter?.bossKey) return null;
    const minionDefs = BOSS_MINIONS[party.encounter.bossKey] || [];
    const def = minionDefs.find((m) => m.key === minionData.key);
    return def?.pixels || null;
  };

  const getCurrentTarget = () => {
    if (!party?.encounter) return null;
    const enc = party.encounter;
    if (enc.phase === 'minions') {
      const minionData = enc.minions[enc.currentMinionIndex];
      // Attach pixels from local data (not stored in Firestore)
      const pixels = getMinionPixels(minionData);
      return {
        type: 'minion',
        data: { ...minionData, pixels },
        remaining: enc.minions.filter((m) => !m.defeated).length,
        total: enc.minions.length,
      };
    }
    if (enc.phase === 'boss') {
      return { type: 'boss', data: enc.boss };
    }
    return null;
  };

  // Force-clear a stuck boss (old data with activeBoss at 0 HP but no encounter)
  const forceResetBoss = async () => {
    if (!party?.id) return { success: false, error: 'No party ID' };
    const partyRef = doc(db, 'parties', party.id);
    try {
      await updateDoc(partyRef, {
        activeBoss: null,
        encounter: null,
        bossLevel: (party.bossLevel || 0) + 1,
      });
      return { success: true };
    } catch (err) {
      console.error('forceResetBoss failed:', err);
      return { success: false, error: err.message };
    }
  };

  // Clear finished encounter from Firestore (after victory is dismissed)
  const clearEncounter = async () => {
    if (!party?.id) return;
    const partyRef = doc(db, 'parties', party.id);
    try {
      await updateDoc(partyRef, { encounter: null });
    } catch (err) {
      console.error('clearEncounter failed:', err);
    }
  };

  return { startEncounter, dealDamageToEncounter, getCurrentTarget, defeatBoss, forceResetBoss, claimBossRewards, clearEncounter };
}
