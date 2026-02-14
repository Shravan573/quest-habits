import { DIFFICULTY_MULTIPLIERS, TASK_BASE_DAMAGE } from './constants';
import { getSkillEffect } from '../data/classes';
import { getEquipmentStats } from '../data/equipment';

/**
 * Calculate damage dealt to the current target (minion or boss).
 * Now factors in: class skills, equipment, and target type.
 *
 * @param {object} task - The completed task
 * @param {object} profile - Player profile (level, skills, equipment, class, hp, maxHp)
 * @param {string} targetType - 'minion' or 'boss'
 */
export function calculateDamage(task, profile, targetType = 'boss') {
  const base = TASK_BASE_DAMAGE[task.type] || 2;
  const difficulty = DIFFICULTY_MULTIPLIERS[task.difficulty] || 1.0;
  const skills = profile.skills || {};
  const equipment = profile.equipment || {};

  // Streak bonus (dailies only)
  let streakBonus = 1.0;
  if (task.type === 'daily' && task.streak) {
    const streakMultiplier = 1 + (getSkillEffect(skills, 'streak_bonus_multiplier') / 100);
    streakBonus = Math.min(1 + task.streak * 0.05 * streakMultiplier, 2.5);
  }

  // Level bonus
  const levelBonus = 1 + (profile.level * 0.02);

  // Equipment attack bonus
  const eqStats = getEquipmentStats(equipment);
  const flatAttack = eqStats.attack || 0;

  // Skill flat damage bonus
  const skillFlatDamage = getSkillEffect(skills, 'flat_damage');

  // Skill percentage bonuses per task type
  let skillPercent = 0;
  if (task.type === 'daily') skillPercent += getSkillEffect(skills, 'daily_damage_percent');
  if (task.type === 'habit') skillPercent += getSkillEffect(skills, 'habit_damage_percent');
  if (task.type === 'todo') skillPercent += getSkillEffect(skills, 'todo_damage_percent');

  // Minion-specific bonuses
  let minionBonus = 0;
  if (targetType === 'minion') {
    minionBonus += getSkillEffect(skills, 'minion_damage_percent');
    minionBonus += (eqStats.minionDamage || 0);
  }

  // Low HP berserker bonus
  let lowHpBonus = 0;
  if (profile.hp && profile.maxHp && profile.hp < profile.maxHp * 0.5) {
    lowHpBonus = getSkillEffect(skills, 'low_hp_damage_percent');
  }

  // Calculate total
  let totalDamage = (base + flatAttack + skillFlatDamage) * difficulty * streakBonus * levelBonus;
  totalDamage *= (1 + (skillPercent + minionBonus + lowHpBonus) / 100);

  return Math.round(totalDamage * 10) / 10;
}

// Backward-compatible alias
export function calculateDamageToBoss(task, playerLevel) {
  return calculateDamage(task, { level: playerLevel, skills: {}, equipment: {} }, 'boss');
}

export function calculateBossAttack(missedDailyCount, bossAttackPower, profile) {
  const skills = profile?.skills || {};
  const equipment = profile?.equipment || {};

  const baseDamage = missedDailyCount * bossAttackPower * 0.5;

  // Damage reduction from skills
  const damageReduction = getSkillEffect(skills, 'damage_reduction_percent');
  const eqStats = getEquipmentStats(equipment);
  const eqReduction = eqStats.damageReduction || 0;

  const totalReduction = Math.min(damageReduction + eqReduction, 75); // Cap at 75%
  const finalDamage = baseDamage * (1 - totalReduction / 100);

  return Math.round(finalDamage * 10) / 10;
}

export function calculateTaskRewards(task, profile) {
  const playerLevel = profile?.level || 1;
  const skills = profile?.skills || {};
  const equipment = profile?.equipment || {};
  const diffMult = DIFFICULTY_MULTIPLIERS[task.difficulty] || 1.0;

  // Base XP and gold
  let xp = Math.round(5 * diffMult * (1 + playerLevel * 0.01));
  let gold = Math.round(2 * diffMult);

  // Skill XP bonus
  const xpPercent = getSkillEffect(skills, 'xp_percent');
  const eqStats = getEquipmentStats(equipment);
  const eqXpBonus = eqStats.xpBonus || 0;
  xp = Math.round(xp * (1 + (xpPercent + eqXpBonus) / 100));

  // Skill/equipment gold bonus
  const goldPercent = getSkillEffect(skills, 'gold_percent');
  const eqGoldBonus = eqStats.goldBonus || 0;
  gold = Math.round(gold * (1 + (goldPercent + eqGoldBonus) / 100));

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
