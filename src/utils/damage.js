import { DIFFICULTY_MULTIPLIERS, TASK_BASE_DAMAGE } from './constants';

export function calculateDamageToBoss(task, playerLevel) {
  const base = TASK_BASE_DAMAGE[task.type] || 2;
  const difficulty = DIFFICULTY_MULTIPLIERS[task.difficulty] || 1.0;

  let streakBonus = 1.0;
  if (task.type === 'daily' && task.streak) {
    streakBonus = Math.min(1 + task.streak * 0.05, 2.0);
  }

  const levelBonus = 1 + (playerLevel * 0.02);
  const totalDamage = base * difficulty * streakBonus * levelBonus;
  return Math.round(totalDamage * 10) / 10;
}

export function calculateBossAttack(missedDailyCount, bossAttackPower) {
  return Math.round(missedDailyCount * bossAttackPower * 0.5 * 10) / 10;
}

export function calculateTaskRewards(task, playerLevel) {
  const diffMult = DIFFICULTY_MULTIPLIERS[task.difficulty] || 1.0;
  const xp = Math.round(5 * diffMult * (1 + playerLevel * 0.01));
  const gold = Math.round(2 * diffMult);
  return { xp, gold };
}

export function checkLevelUp(currentXp, currentLevel) {
  const xpNeeded = 100 * currentLevel;
  if (currentXp >= xpNeeded) {
    return {
      levelsGained: 1,
      remainingXp: currentXp - xpNeeded,
      newMaxHp: 50 + (currentLevel * 5),
    };
  }
  return null;
}
