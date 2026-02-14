export const EQUIPMENT = {
  // --- WEAPONS ---
  wooden_sword: {
    id: 'wooden_sword',
    name: 'Wooden Sword',
    emoji: '🗡️',
    slot: 'weapon',
    tier: 1,
    cost: 20,
    stats: { attack: 1 },
    description: 'A simple wooden training sword.',
  },
  iron_sword: {
    id: 'iron_sword',
    name: 'Iron Sword',
    emoji: '⚔️',
    slot: 'weapon',
    tier: 2,
    cost: 75,
    stats: { attack: 3 },
    description: 'Sturdy iron blade, battle-tested.',
  },
  fire_blade: {
    id: 'fire_blade',
    name: 'Fire Blade',
    emoji: '🔥',
    slot: 'weapon',
    tier: 3,
    cost: 200,
    stats: { attack: 5, minionDamage: 2 },
    description: 'Burns with an eternal flame.',
  },
  void_slayer: {
    id: 'void_slayer',
    name: 'Void Slayer',
    emoji: '🌑',
    slot: 'weapon',
    tier: 4,
    cost: 500,
    stats: { attack: 8 },
    description: 'Forged in the abyss. Cuts through reality.',
  },

  // --- ARMOR ---
  leather_vest: {
    id: 'leather_vest',
    name: 'Leather Vest',
    emoji: '🧥',
    slot: 'armor',
    tier: 1,
    cost: 15,
    stats: { maxHp: 5 },
    description: 'Basic leather protection.',
  },
  chain_mail: {
    id: 'chain_mail',
    name: 'Chain Mail',
    emoji: '🛡️',
    slot: 'armor',
    tier: 2,
    cost: 60,
    stats: { maxHp: 12 },
    description: 'Interlocking iron rings.',
  },
  plate_armor: {
    id: 'plate_armor',
    name: 'Plate Armor',
    emoji: '🏰',
    slot: 'armor',
    tier: 3,
    cost: 180,
    stats: { maxHp: 22, damageReduction: 5 },
    description: 'Heavy plates of forged steel.',
  },
  adamantine_armor: {
    id: 'adamantine_armor',
    name: 'Adamantine Armor',
    emoji: '💎',
    slot: 'armor',
    tier: 4,
    cost: 450,
    stats: { maxHp: 35, damageReduction: 10 },
    description: 'Unbreakable. Legends are made of this.',
  },

  // --- ACCESSORIES ---
  lucky_charm: {
    id: 'lucky_charm',
    name: 'Lucky Charm',
    emoji: '🍀',
    slot: 'accessory',
    tier: 1,
    cost: 25,
    stats: { goldBonus: 15 },
    description: 'Find 15% more gold.',
  },
  xp_amulet: {
    id: 'xp_amulet',
    name: 'XP Amulet',
    emoji: '📿',
    slot: 'accessory',
    tier: 2,
    cost: 80,
    stats: { xpBonus: 20 },
    description: 'Gain 20% more experience.',
  },
  ring_of_power: {
    id: 'ring_of_power',
    name: 'Ring of Power',
    emoji: '💍',
    slot: 'accessory',
    tier: 3,
    cost: 250,
    stats: { attack: 3, maxHp: 10 },
    description: 'One ring to rule your habits.',
  },
  crown_of_wisdom: {
    id: 'crown_of_wisdom',
    name: 'Crown of Wisdom',
    emoji: '👑',
    slot: 'accessory',
    tier: 4,
    cost: 600,
    stats: { xpBonus: 30, goldBonus: 25, attack: 2 },
    description: 'Ultimate reward for the dedicated.',
  },
};

export const EQUIPMENT_BY_SLOT = {
  weapon: Object.values(EQUIPMENT).filter((e) => e.slot === 'weapon'),
  armor: Object.values(EQUIPMENT).filter((e) => e.slot === 'armor'),
  accessory: Object.values(EQUIPMENT).filter((e) => e.slot === 'accessory'),
};

export function getEquipmentStats(equipment) {
  const totals = { attack: 0, maxHp: 0, goldBonus: 0, xpBonus: 0, damageReduction: 0, minionDamage: 0 };
  for (const slot of ['weapon', 'armor', 'accessory']) {
    const itemId = equipment?.[slot];
    if (itemId && EQUIPMENT[itemId]) {
      const stats = EQUIPMENT[itemId].stats;
      for (const [key, val] of Object.entries(stats)) {
        totals[key] = (totals[key] || 0) + val;
      }
    }
  }
  return totals;
}
