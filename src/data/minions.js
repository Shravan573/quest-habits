// Minion pixel art: small 6x6 sprites
const SLIME_MINI = [
  [2,0,'#39ff14'],[3,0,'#39ff14'],
  [1,1,'#2bcc0e'],[2,1,'#006600'],[3,1,'#006600'],[4,1,'#2bcc0e'],
  [1,2,'#39ff14'],[2,2,'#2bcc0e'],[3,2,'#2bcc0e'],[4,2,'#39ff14'],
  [0,3,'#2bcc0e'],[1,3,'#2bcc0e'],[2,3,'#2bcc0e'],[3,3,'#2bcc0e'],[4,3,'#2bcc0e'],[5,3,'#2bcc0e'],
  [0,4,'#006600'],[1,4,'#006600'],[2,4,'#006600'],[3,4,'#006600'],[4,4,'#006600'],[5,4,'#006600'],
];

const SKELETON_MINI = [
  [2,0,'#f5f5dc'],[3,0,'#f5f5dc'],
  [1,1,'#8b0000'],[2,1,'#d4a574'],[3,1,'#d4a574'],[4,1,'#8b0000'],
  [2,2,'#f5f5dc'],[3,2,'#f5f5dc'],
  [1,3,'#d4a574'],[2,3,'#f5f5dc'],[3,3,'#f5f5dc'],[4,3,'#d4a574'],
  [2,4,'#f5f5dc'],[3,4,'#f5f5dc'],
  [1,5,'#d4a574'],[4,5,'#d4a574'],
];

const SHADOW_MINI = [
  [2,0,'#2d1b69'],[3,0,'#2d1b69'],
  [1,1,'#1a0a3e'],[2,1,'#ff4444'],[3,1,'#ff4444'],[4,1,'#1a0a3e'],
  [1,2,'#2d1b69'],[2,2,'#1a0a3e'],[3,2,'#1a0a3e'],[4,2,'#2d1b69'],
  [0,3,'#888888'],[1,3,'#2d1b69'],[2,3,'#2d1b69'],[3,3,'#2d1b69'],[4,3,'#2d1b69'],[5,3,'#888888'],
  [1,4,'#1a0a3e'],[2,4,'#2d1b69'],[3,4,'#2d1b69'],[4,4,'#1a0a3e'],
  [1,5,'#1a0a3e'],[4,5,'#1a0a3e'],
];

const FIRE_MINI = [
  [1,0,'#ffcc00'],[4,0,'#ffcc00'],
  [1,1,'#ff6600'],[2,1,'#cc3300'],[3,1,'#cc3300'],[4,1,'#ff6600'],
  [1,2,'#cc3300'],[2,2,'#ffffff'],[3,2,'#ffffff'],[4,2,'#cc3300'],
  [0,3,'#ff6600'],[1,3,'#cc3300'],[2,3,'#cc3300'],[3,3,'#cc3300'],[4,3,'#cc3300'],[5,3,'#ff6600'],
  [1,4,'#993300'],[2,4,'#cc3300'],[3,4,'#cc3300'],[4,4,'#993300'],
  [1,5,'#993300'],[4,5,'#993300'],
];

const UNDEAD_MINI = [
  [2,0,'#4a0080'],[3,0,'#4a0080'],
  [1,1,'#00ffcc'],[2,1,'#4a0080'],[3,1,'#4a0080'],[4,1,'#00ffcc'],
  [2,2,'#9900ff'],[3,2,'#9900ff'],
  [1,3,'#4a0080'],[2,3,'#9900ff'],[3,3,'#9900ff'],[4,3,'#4a0080'],
  [2,4,'#4a0080'],[3,4,'#4a0080'],
  [1,5,'#9900ff'],[4,5,'#9900ff'],
];

const VOID_MINI = [
  [2,0,'#ff00ff'],[3,0,'#ff00ff'],
  [1,1,'#0a0a2e'],[2,1,'#ffffff'],[3,1,'#ffffff'],[4,1,'#0a0a2e'],
  [1,2,'#000033'],[2,2,'#0a0a2e'],[3,2,'#0a0a2e'],[4,2,'#000033'],
  [0,3,'#ff00ff'],[1,3,'#0a0a2e'],[2,3,'#000033'],[3,3,'#000033'],[4,3,'#0a0a2e'],[5,3,'#ff00ff'],
  [1,4,'#0a0a2e'],[2,4,'#000033'],[3,4,'#000033'],[4,4,'#0a0a2e'],
  [1,5,'#ff00ff'],[4,5,'#ff00ff'],
];

const CHAOS_MINI = [
  [1,0,'#ffff00'],[4,0,'#ffff00'],
  [1,1,'#ff0000'],[2,1,'#ffffff'],[3,1,'#ffffff'],[4,1,'#ff0000'],
  [0,2,'#ff0000'],[1,2,'#000000'],[2,2,'#ff0000'],[3,2,'#ff0000'],[4,2,'#000000'],[5,2,'#ff0000'],
  [1,3,'#ff0000'],[2,3,'#ffff00'],[3,3,'#ffff00'],[4,3,'#ff0000'],
  [1,4,'#000000'],[2,4,'#ff0000'],[3,4,'#ff0000'],[4,4,'#000000'],
  [0,5,'#ffff00'],[5,5,'#ffff00'],
];

export const BOSS_MINIONS = {
  slime_king: [
    { key: 'slime_blob', name: 'Slime Blob', maxHp: 20, xp: 8, gold: 5, emoji: '🟢', glowColor: '#39ff14', pixels: SLIME_MINI },
    { key: 'slime_glob', name: 'Slime Glob', maxHp: 25, xp: 10, gold: 6, emoji: '🟩', glowColor: '#39ff14', pixels: SLIME_MINI },
  ],
  skeleton_lord: [
    { key: 'skeleton_grunt', name: 'Skeleton Grunt', maxHp: 25, xp: 10, gold: 7, emoji: '💀', glowColor: '#f5f5dc', pixels: SKELETON_MINI },
    { key: 'skeleton_archer', name: 'Skeleton Archer', maxHp: 30, xp: 12, gold: 8, emoji: '🏹', glowColor: '#f5f5dc', pixels: SKELETON_MINI },
    { key: 'skeleton_mage', name: 'Skeleton Mage', maxHp: 35, xp: 15, gold: 10, emoji: '☠️', glowColor: '#d4a574', pixels: SKELETON_MINI },
  ],
  shadow_knight: [
    { key: 'shadow_squire', name: 'Shadow Squire', maxHp: 35, xp: 15, gold: 10, emoji: '👤', glowColor: '#2d1b69', pixels: SHADOW_MINI },
    { key: 'shadow_assassin', name: 'Shadow Assassin', maxHp: 40, xp: 18, gold: 12, emoji: '🥷', glowColor: '#ff4444', pixels: SHADOW_MINI },
    { key: 'dark_hound', name: 'Dark Hound', maxHp: 45, xp: 20, gold: 14, emoji: '🐺', glowColor: '#1a0a3e', pixels: SHADOW_MINI },
  ],
  fire_wyrm: [
    { key: 'fire_imp', name: 'Fire Imp', maxHp: 40, xp: 18, gold: 12, emoji: '😈', glowColor: '#ff6600', pixels: FIRE_MINI },
    { key: 'lava_hound', name: 'Lava Hound', maxHp: 50, xp: 22, gold: 15, emoji: '🐕', glowColor: '#cc3300', pixels: FIRE_MINI },
    { key: 'flame_dancer', name: 'Flame Dancer', maxHp: 55, xp: 25, gold: 18, emoji: '💃', glowColor: '#ffcc00', pixels: FIRE_MINI },
    { key: 'ash_golem', name: 'Ash Golem', maxHp: 60, xp: 28, gold: 20, emoji: '🗿', glowColor: '#993300', pixels: FIRE_MINI },
  ],
  lich_emperor: [
    { key: 'zombie', name: 'Zombie', maxHp: 50, xp: 22, gold: 15, emoji: '🧟', glowColor: '#4a0080', pixels: UNDEAD_MINI },
    { key: 'wraith', name: 'Wraith', maxHp: 60, xp: 28, gold: 18, emoji: '👻', glowColor: '#9900ff', pixels: UNDEAD_MINI },
    { key: 'death_knight', name: 'Death Knight', maxHp: 70, xp: 32, gold: 22, emoji: '⚰️', glowColor: '#00ffcc', pixels: UNDEAD_MINI },
    { key: 'bone_dragon', name: 'Bone Dragon', maxHp: 80, xp: 38, gold: 28, emoji: '🐲', glowColor: '#f5f5dc', pixels: UNDEAD_MINI },
  ],
  void_titan: [
    { key: 'void_spawn', name: 'Void Spawn', maxHp: 60, xp: 28, gold: 20, emoji: '🌀', glowColor: '#ff00ff', pixels: VOID_MINI },
    { key: 'reality_shard', name: 'Reality Shard', maxHp: 70, xp: 32, gold: 24, emoji: '💠', glowColor: '#00bfff', pixels: VOID_MINI },
    { key: 'phase_walker', name: 'Phase Walker', maxHp: 80, xp: 38, gold: 28, emoji: '🌌', glowColor: '#9900ff', pixels: VOID_MINI },
    { key: 'null_beast', name: 'Null Beast', maxHp: 90, xp: 42, gold: 32, emoji: '🕳️', glowColor: '#000033', pixels: VOID_MINI },
    { key: 'entropy_wisp', name: 'Entropy Wisp', maxHp: 100, xp: 48, gold: 38, emoji: '✴️', glowColor: '#ff00ff', pixels: VOID_MINI },
  ],
  chaos_god: [
    { key: 'chaos_imp', name: 'Chaos Imp', maxHp: 80, xp: 38, gold: 28, emoji: '👹', glowColor: '#ff0000', pixels: CHAOS_MINI },
    { key: 'chaos_knight', name: 'Chaos Knight', maxHp: 90, xp: 42, gold: 32, emoji: '🤺', glowColor: '#ffff00', pixels: CHAOS_MINI },
    { key: 'chaos_hydra', name: 'Chaos Hydra', maxHp: 100, xp: 48, gold: 38, emoji: '🐍', glowColor: '#ff0000', pixels: CHAOS_MINI },
    { key: 'doom_herald', name: 'Doom Herald', maxHp: 110, xp: 55, gold: 45, emoji: '📯', glowColor: '#000000', pixels: CHAOS_MINI },
    { key: 'chaos_avatar', name: 'Chaos Avatar', maxHp: 120, xp: 60, gold: 50, emoji: '🌋', glowColor: '#ffff00', pixels: CHAOS_MINI },
  ],
};
