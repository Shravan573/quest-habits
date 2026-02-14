import { useState, useEffect } from 'react';
import {
  doc, onSnapshot, addDoc, updateDoc, collection,
  query, where, getDocs, arrayUnion, arrayRemove, deleteField,
} from 'firebase/firestore';
import { db } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import { BOSSES, BOSS_ORDER } from '../data/bosses';

function generateInviteCode() {
  return uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
}

export function useParty(partyId) {
  const [party, setParty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!partyId) {
      setParty(null);
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(doc(db, 'parties', partyId), (snap) => {
      setParty(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      setLoading(false);
    });
    return unsub;
  }, [partyId]);

  const createParty = async (userId, displayName, partyName, level, hp, maxHp) => {
    const inviteCode = generateInviteCode();
    const partyRef = await addDoc(collection(db, 'parties'), {
      name: partyName,
      inviteCode,
      leaderId: userId,
      memberIds: [userId],
      members: {
        [userId]: { displayName, level, hp, maxHp },
      },
      activeBoss: null,
      bossLevel: 0,
      damageFeed: [],
      createdAt: new Date().toISOString(),
    });
    await updateDoc(doc(db, 'users', userId), { partyId: partyRef.id });
    return partyRef.id;
  };

  const joinParty = async (userId, displayName, level, hp, maxHp, inviteCode) => {
    const q = query(collection(db, 'parties'), where('inviteCode', '==', inviteCode.toUpperCase()));
    const snapshot = await getDocs(q);
    if (snapshot.empty) throw new Error('Invalid invite code');

    const partyDoc = snapshot.docs[0];
    const partyData = partyDoc.data();

    if (partyData.memberIds.includes(userId)) {
      throw new Error('Already in this party');
    }

    await updateDoc(partyDoc.ref, {
      memberIds: arrayUnion(userId),
      [`members.${userId}`]: { displayName, level, hp, maxHp },
    });
    await updateDoc(doc(db, 'users', userId), { partyId: partyDoc.id });
    return partyDoc.id;
  };

  const leaveParty = async (userId) => {
    if (!party) return;
    const partyRef = doc(db, 'parties', party.id);

    await updateDoc(partyRef, {
      memberIds: arrayRemove(userId),
      [`members.${userId}`]: deleteField(),
    });
    await updateDoc(doc(db, 'users', userId), { partyId: null });
  };

  const startBoss = async () => {
    if (!party) return;
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

  return { party, loading, createParty, joinParty, leaveParty, startBoss };
}
