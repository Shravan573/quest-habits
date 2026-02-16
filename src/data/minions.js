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

// --- Frost Lich minions ---
const ICE_WRAITH = [
  [2,0,'#aaddff'],[3,0,'#aaddff'],
  [1,1,'#88ccff'],[2,1,'#ffffff'],[3,1,'#ffffff'],[4,1,'#88ccff'],
  [1,2,'#66aadd'],[2,2,'#88ccff'],[3,2,'#88ccff'],[4,2,'#66aadd'],
  [0,3,'#aaddff'],[1,3,'#66aadd'],[2,3,'#88ccff'],[3,3,'#88ccff'],[4,3,'#66aadd'],[5,3,'#aaddff'],
  [1,4,'#4488bb'],[2,4,'#66aadd'],[3,4,'#66aadd'],[4,4,'#4488bb'],
  [1,5,'#4488bb'],[4,5,'#4488bb'],
];

const FROST_GOLEM = [
  [1,0,'#446688'],[2,0,'#88ccff'],[3,0,'#88ccff'],[4,0,'#446688'],
  [1,1,'#88ccff'],[2,1,'#00ccff'],[3,1,'#00ccff'],[4,1,'#88ccff'],
  [0,2,'#446688'],[1,2,'#88ccff'],[2,2,'#446688'],[3,2,'#446688'],[4,2,'#88ccff'],[5,2,'#446688'],
  [0,3,'#88ccff'],[1,3,'#446688'],[2,3,'#88ccff'],[3,3,'#88ccff'],[4,3,'#446688'],[5,3,'#88ccff'],
  [1,4,'#446688'],[2,4,'#88ccff'],[3,4,'#88ccff'],[4,4,'#446688'],
  [1,5,'#446688'],[2,5,'#446688'],[3,5,'#446688'],[4,5,'#446688'],
];

const BLIZZARD_DRAKE = [
  [0,0,'#aaddff'],[5,0,'#aaddff'],
  [1,1,'#88ccff'],[2,1,'#ffffff'],[3,1,'#ffffff'],[4,1,'#88ccff'],
  [0,2,'#66aadd'],[1,2,'#88ccff'],[2,2,'#00ccff'],[3,2,'#00ccff'],[4,2,'#88ccff'],[5,2,'#66aadd'],
  [1,3,'#88ccff'],[2,3,'#66aadd'],[3,3,'#66aadd'],[4,3,'#88ccff'],
  [0,4,'#aaddff'],[1,4,'#66aadd'],[2,4,'#88ccff'],[3,4,'#88ccff'],[4,4,'#66aadd'],[5,4,'#aaddff'],
  [2,5,'#446688'],[3,5,'#446688'],
];

// --- Abyssal Kraken minions ---
const TENTACLE_HORROR = [
  [1,0,'#226688'],[4,0,'#226688'],
  [1,1,'#0066cc'],[2,1,'#004488'],[3,1,'#004488'],[4,1,'#0066cc'],
  [0,2,'#226688'],[1,2,'#004488'],[2,2,'#00ffcc'],[3,2,'#00ffcc'],[4,2,'#004488'],[5,2,'#226688'],
  [1,3,'#0066cc'],[2,3,'#004488'],[3,3,'#004488'],[4,3,'#0066cc'],
  [0,4,'#226688'],[2,4,'#0066cc'],[3,4,'#0066cc'],[5,4,'#226688'],
  [0,5,'#004488'],[1,5,'#226688'],[4,5,'#226688'],[5,5,'#004488'],
];

const DEEP_ONE = [
  [2,0,'#003366'],[3,0,'#003366'],
  [1,1,'#004488'],[2,1,'#ffcc00'],[3,1,'#ffcc00'],[4,1,'#004488'],
  [0,2,'#003366'],[1,2,'#006699'],[2,2,'#004488'],[3,2,'#004488'],[4,2,'#006699'],[5,2,'#003366'],
  [1,3,'#006699'],[2,3,'#004488'],[3,3,'#004488'],[4,3,'#006699'],
  [1,4,'#003366'],[2,4,'#006699'],[3,4,'#006699'],[4,4,'#003366'],
  [1,5,'#003366'],[4,5,'#003366'],
];

const TIDAL_ELEMENTAL = [
  [2,0,'#00ccff'],[3,0,'#00ccff'],
  [1,1,'#0099cc'],[2,1,'#ffffff'],[3,1,'#ffffff'],[4,1,'#0099cc'],
  [0,2,'#0066cc'],[1,2,'#0099cc'],[2,2,'#00ccff'],[3,2,'#00ccff'],[4,2,'#0099cc'],[5,2,'#0066cc'],
  [0,3,'#00ccff'],[1,3,'#0066cc'],[2,3,'#0099cc'],[3,3,'#0099cc'],[4,3,'#0066cc'],[5,3,'#00ccff'],
  [1,4,'#0066cc'],[2,4,'#0099cc'],[3,4,'#0099cc'],[4,4,'#0066cc'],
  [0,5,'#0099cc'],[5,5,'#0099cc'],
];

const LEVIATHAN_SPAWN = [
  [0,0,'#003355'],[5,0,'#003355'],
  [0,1,'#004488'],[1,1,'#006699'],[2,1,'#ff4444'],[3,1,'#ff4444'],[4,1,'#006699'],[5,1,'#004488'],
  [1,2,'#006699'],[2,2,'#004488'],[3,2,'#004488'],[4,2,'#006699'],
  [0,3,'#003355'],[1,3,'#006699'],[2,3,'#006699'],[3,3,'#006699'],[4,3,'#006699'],[5,3,'#003355'],
  [0,4,'#004488'],[1,4,'#003355'],[2,4,'#006699'],[3,4,'#006699'],[4,4,'#003355'],[5,4,'#004488'],
  [0,5,'#003355'],[2,5,'#004488'],[3,5,'#004488'],[5,5,'#003355'],
];

// --- Eternal Dragon minions ---
const DRAGONKIN = [
  [2,0,'#cc6600'],[3,0,'#cc6600'],
  [1,1,'#ff8800'],[2,1,'#ffaa00'],[3,1,'#ffaa00'],[4,1,'#ff8800'],
  [0,2,'#cc6600'],[1,2,'#ff8800'],[2,2,'#ffffff'],[3,2,'#ffffff'],[4,2,'#ff8800'],[5,2,'#cc6600'],
  [1,3,'#ff8800'],[2,3,'#cc6600'],[3,3,'#cc6600'],[4,3,'#ff8800'],
  [1,4,'#cc6600'],[2,4,'#ff8800'],[3,4,'#ff8800'],[4,4,'#cc6600'],
  [1,5,'#993300'],[4,5,'#993300'],
];

const ELDER_WYRM = [
  [0,0,'#ffaa00'],[5,0,'#ffaa00'],
  [1,1,'#cc6600'],[2,1,'#ffcc00'],[3,1,'#ffcc00'],[4,1,'#cc6600'],
  [0,2,'#993300'],[1,2,'#cc6600'],[2,2,'#ff4444'],[3,2,'#ff4444'],[4,2,'#cc6600'],[5,2,'#993300'],
  [0,3,'#cc6600'],[1,3,'#993300'],[2,3,'#cc6600'],[3,3,'#cc6600'],[4,3,'#993300'],[5,3,'#cc6600'],
  [1,4,'#993300'],[2,4,'#cc6600'],[3,4,'#cc6600'],[4,4,'#993300'],
  [0,5,'#ffaa00'],[5,5,'#ffaa00'],
];

const CELESTIAL_SERPENT = [
  [2,0,'#ffdd44'],[3,0,'#ffdd44'],
  [1,1,'#ffaa00'],[2,1,'#ffffff'],[3,1,'#ffffff'],[4,1,'#ffaa00'],
  [0,2,'#ffdd44'],[1,2,'#ffaa00'],[2,2,'#ffdd44'],[3,2,'#ffdd44'],[4,2,'#ffaa00'],[5,2,'#ffdd44'],
  [1,3,'#ffaa00'],[2,3,'#cc8800'],[3,3,'#cc8800'],[4,3,'#ffaa00'],
  [0,4,'#ffdd44'],[1,4,'#cc8800'],[2,4,'#ffaa00'],[3,4,'#ffaa00'],[4,4,'#cc8800'],[5,4,'#ffdd44'],
  [2,5,'#cc8800'],[3,5,'#cc8800'],
];

const DRAGON_ASPECT = [
  [0,0,'#ff4400'],[1,0,'#ffaa00'],[4,0,'#ffaa00'],[5,0,'#ff4400'],
  [1,1,'#ff6600'],[2,1,'#ffcc00'],[3,1,'#ffcc00'],[4,1,'#ff6600'],
  [0,2,'#ff4400'],[1,2,'#ff6600'],[2,2,'#ffffff'],[3,2,'#ffffff'],[4,2,'#ff6600'],[5,2,'#ff4400'],
  [1,3,'#ff6600'],[2,3,'#ffaa00'],[3,3,'#ffaa00'],[4,3,'#ff6600'],
  [0,4,'#ff4400'],[1,4,'#cc3300'],[2,4,'#ff6600'],[3,4,'#ff6600'],[4,4,'#cc3300'],[5,4,'#ff4400'],
  [1,5,'#cc3300'],[4,5,'#cc3300'],
];

const ANCIENT_FLAME = [
  [1,0,'#ffff00'],[2,0,'#ffcc00'],[3,0,'#ffcc00'],[4,0,'#ffff00'],
  [0,1,'#ff6600'],[1,1,'#ffcc00'],[2,1,'#ffffff'],[3,1,'#ffffff'],[4,1,'#ffcc00'],[5,1,'#ff6600'],
  [0,2,'#ff4400'],[1,2,'#ff6600'],[2,2,'#ffcc00'],[3,2,'#ffcc00'],[4,2,'#ff6600'],[5,2,'#ff4400'],
  [0,3,'#cc3300'],[1,3,'#ff4400'],[2,3,'#ff6600'],[3,3,'#ff6600'],[4,3,'#ff4400'],[5,3,'#cc3300'],
  [1,4,'#cc3300'],[2,4,'#ff4400'],[3,4,'#ff4400'],[4,4,'#cc3300'],
  [2,5,'#993300'],[3,5,'#993300'],
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
  frost_lich: [
    { key: 'ice_wraith', name: 'Ice Wraith', maxHp: 130, xp: 55, gold: 40, emoji: '👻', glowColor: '#aaddff', pixels: ICE_WRAITH },
    { key: 'frost_golem', name: 'Frost Golem', maxHp: 140, xp: 60, gold: 45, emoji: '🧊', glowColor: '#88ccff', pixels: FROST_GOLEM },
    { key: 'blizzard_drake', name: 'Blizzard Drake', maxHp: 150, xp: 65, gold: 50, emoji: '🐉', glowColor: '#66aadd', pixels: BLIZZARD_DRAKE },
  ],
  abyssal_kraken: [
    { key: 'tentacle_horror', name: 'Tentacle Horror', maxHp: 140, xp: 60, gold: 45, emoji: '🦑', glowColor: '#226688', pixels: TENTACLE_HORROR },
    { key: 'deep_one', name: 'Deep One', maxHp: 160, xp: 68, gold: 52, emoji: '🐟', glowColor: '#004488', pixels: DEEP_ONE },
    { key: 'tidal_elemental', name: 'Tidal Elemental', maxHp: 180, xp: 75, gold: 58, emoji: '🌊', glowColor: '#00ccff', pixels: TIDAL_ELEMENTAL },
    { key: 'leviathan_spawn', name: 'Leviathan Spawn', maxHp: 200, xp: 85, gold: 65, emoji: '🐋', glowColor: '#006699', pixels: LEVIATHAN_SPAWN },
  ],
  eternal_dragon: [
    { key: 'dragonkin', name: 'Dragonkin', maxHp: 180, xp: 75, gold: 55, emoji: '🦎', glowColor: '#ff8800', pixels: DRAGONKIN },
    { key: 'elder_wyrm', name: 'Elder Wyrm', maxHp: 200, xp: 85, gold: 65, emoji: '🐲', glowColor: '#cc6600', pixels: ELDER_WYRM },
    { key: 'celestial_serpent', name: 'Celestial Serpent', maxHp: 220, xp: 95, gold: 75, emoji: '🐍', glowColor: '#ffdd44', pixels: CELESTIAL_SERPENT },
    { key: 'dragon_aspect', name: 'Dragon Aspect', maxHp: 250, xp: 110, gold: 85, emoji: '🔥', glowColor: '#ff6600', pixels: DRAGON_ASPECT },
    { key: 'ancient_flame', name: 'Ancient Flame', maxHp: 280, xp: 125, gold: 100, emoji: '☀️', glowColor: '#ffcc00', pixels: ANCIENT_FLAME },
  ],
};
