import { doc, updateDoc, runTransaction } from 'firebase/firestore';
import { db } from '../firebase';
import { BOSSES, BOSS_ORDER } from '../data/bosses';

export function useBoss(party) {
  const dealDamage = async (damage, task, userId, displayName) => {
    if (!party?.activeBoss || !party?.id) return;

    const partyRef = doc(db, 'parties', party.id);
    const newHp = Math.max(0, party.activeBoss.currentHp - damage);

    const feedEntry = {
      userId,
      displayName,
      damage,
      taskTitle: task.title,
      timestamp: new Date().toISOString(),
      type: 'dealt',
    };

    const newFeed = [...(party.damageFeed || []), feedEntry].slice(-20);

    await updateDoc(partyRef, {
      'activeBoss.currentHp': newHp,
      damageFeed: newFeed,
    });

    if (newHp <= 0) {
      await defeatBoss(party.id);
    }

    return damage;
  };

  const defeatBoss = async (partyId) => {
    const partyRef = doc(db, 'parties', partyId);

    await runTransaction(db, async (transaction) => {
      const partySnap = await transaction.get(partyRef);
      const data = partySnap.data();
      if (!data.activeBoss || data.activeBoss.currentHp > 0) return;

      const rewards = data.activeBoss.rewards;

      for (const memberId of data.memberIds) {
        const userRef = doc(db, 'users', memberId);
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) continue;
        const userData = userSnap.data();
        transaction.update(userRef, {
          xp: userData.xp + rewards.xp,
          gold: userData.gold + rewards.gold,
        });
      }

      transaction.update(partyRef, {
        activeBoss: null,
        bossLevel: data.bossLevel + 1,
      });
    });
  };

  const startNextBoss = async () => {
    if (!party?.id) return;
    const bossIndex = Math.min(party.bossLevel, BOSS_ORDER.length - 1);
    const bossKey = BOSS_ORDER[bossIndex];
    const bossDef = BOSSES[bossKey];

    const partyRef = doc(db, 'parties', party.id);
    await updateDoc(partyRef, {
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

  return { dealDamage, defeatBoss, startNextBoss };
}
