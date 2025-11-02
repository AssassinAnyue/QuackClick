import { DuckStage, SpecialItem } from './types';

// 15个阶段的升级成本（每阶段5次升级，成本×1.6）
export const UPGRADE_COSTS: Record<DuckStage, number[]> = {
  '鴨蛋': [15, 24, 38, 61, 98],
  '黃鴨': [150, 240, 384, 614, 983],
  '白鴨': [1200, 1920, 3072, 4915, 7864],
  '成年鴨': [9000, 14400, 23040, 36864, 58982],
  '至聖先鴨': [60000, 96000, 153600, 245760, 393216],
  '天啟鴨': [350000, 560000, 896000, 1433600, 2293760],
  '星界鴨': [2000000, 3200000, 5120000, 8192000, 13107200],
  '混沌鴨': [12000000, 19200000, 30720000, 49152000, 78643200],
  '永恆鴨': [70000000, 112000000, 179200000, 286720000, 458752000],
  '超鴨神體': [400000000, 640000000, 1024000000, 1638400000, 2621440000],
  '鴨界意志': [2300000000, 3680000000, 5888000000, 9420800000, 15073280000],
  '原初之鴨': [12000000000, 19200000000, 30720000000, 49152000000, 78643200000],
  '鴨神皇': [65000000000, 104000000000, 166400000000, 266240000000, 425984000000],
  '多元鴨體': [350000000000, 560000000000, 896000000000, 1433600000000, 2293760000000],
  '絕對鴨': [2000000000000, 3200000000000, 5120000000000, 8192000000000, 13107200000000]
};

export const STAGE_ORDER: DuckStage[] = [
  '鴨蛋',
  '黃鴨',
  '白鴨',
  '成年鴨',
  '至聖先鴨',
  '天啟鴨',
  '星界鴨',
  '混沌鴨',
  '永恆鴨',
  '超鴨神體',
  '鴨界意志',
  '原初之鴨',
  '鴨神皇',
  '多元鴨體',
  '絕對鴨'
];

export function getMaxDuckPower(stage: DuckStage): number {
  const stageIndex = STAGE_ORDER.indexOf(stage);
  // 初始60，每过一個階段减少10，最低30
  const maxPower = Math.max(60 - (stageIndex * 10), 30);
  return maxPower;
}

// 获取阶段图标
export function getStageIcon(stage: DuckStage): string {
  const icons: Record<DuckStage, string> = {
    '鴨蛋': '🥚',
    '黃鴨': '🐥',
    '白鴨': '🦆',
    '成年鴨': '🦆',
    '至聖先鴨': '✨',
    '天啟鴨': '⚡',
    '星界鴨': '🌟',
    '混沌鴨': '🌀',
    '永恆鴨': '⏳',
    '超鴨神體': '💎',
    '鴨界意志': '🌌',
    '原初之鴨': '🔮',
    '鴨神皇': '👑',
    '多元鴨體': '🌐',
    '絕對鴨': '∞'
  };
  return icons[stage] || '🦆';
}

// 获取阶段描述
export function getStageDescription(stage: DuckStage): string {
  const descriptions: Record<DuckStage, string> = {
    '鴨蛋': '生命的起點，蘊含無限可能',
    '黃鴨': '剛孵化的小鴨，充滿好奇心',
    '白鴨': '純白的羽毛，優雅的姿態',
    '成年鴨': '成熟的鴨子，掌握了飛翔的技巧',
    '至聖先鴨': '超越凡鴨的存在，散發神聖光輝',
    '天啟鴨': '帶來天啟的預言者，羽翼閃耀雷光',
    '星界鴨': '遨遊星海的旅者，身披星辰之光',
    '混沌鴨': '掌握混沌之力，創造與毀滅的化身',
    '永恆鴨': '超越時間的存在，見證萬物輪迴',
    '超鴨神體': '突破神之極限，達到超神境界',
    '鴨界意志': '化身為整個鴨界的意志本身',
    '原初之鴨': '萬物起源，最初的鴨之概念',
    '鴨神皇': '統御所有鴨神的至高皇者',
    '多元鴨體': '存在於所有平行宇宙的超越體',
    '絕對鴨': '超越一切概念的終極存在'
  };
  return descriptions[stage] || '';
}

// 可升级道具数值计算
// 鸭点击器：value = prevValue × 1.5 + 2
export function getClickerValue(level: number): number {
  if (level <= 0) return 0;
  if (level === 1) return 1;
  
  let value = 1;
  for (let i = 2; i <= level; i++) {
    value = Math.floor(value * 1.5 + 2);
  }
  return value;
}

// 鸭点击器成本：cost = prevCost × 1.6 + 15
export function getClickerUpgradeCost(level: number): number {
  if (level <= 0) return 0;
  if (level === 1) return 10; // 初始成本
  
  let cost = 10;
  for (let i = 2; i <= level; i++) {
    cost = Math.floor(cost * 1.6 + 15);
  }
  return cost;
}

// 鸭自动机：value = prevValue × 1.7 + 3
export function getAutoValue(level: number): number {
  if (level <= 0) return 0;
  if (level === 1) return 1;
  
  let value = 1;
  for (let i = 2; i <= level; i++) {
    value = Math.floor(value * 1.7 + 3);
  }
  return value;
}

// 鸭自动机成本：cost = prevCost × 1.5 + 20
export function getAutoUpgradeCost(level: number): number {
  if (level <= 0) return 0;
  if (level === 1) return 30; // 初始成本
  
  let cost = 30;
  for (let i = 2; i <= level; i++) {
    cost = Math.floor(cost * 1.5 + 20);
  }
  return cost;
}

// 特殊道具列表（强化版）
export const SPECIAL_ITEMS: SpecialItem[] = [
  // 🟢 初期道具
  {
    id: 1,
    name: '小黃鴨餅乾',
    description: '點擊時 25% 機率額外 +5 Quack',
    cost: 100,
    tier: 'early',
    icon: '🍪',
    effect: {
      type: 'clickChance',
      probability: 0.25,
      bonus: 5
    }
  },
  {
    id: 2,
    name: '鴨蛋加速器',
    description: '每秒自動 +10 Quack',
    cost: 250,
    tier: 'early',
    icon: '🥚',
    effect: {
      type: 'autoProduction',
      value: 10
    }
  },
  {
    id: 3,
    name: '雞毛撲打器',
    description: '點擊 +10 Quack，連續 5 次無中斷額外 +30',
    cost: 600,
    tier: 'early',
    icon: '🪶',
    effect: {
      type: 'combo',
      clickBonus: 10,
      comboThreshold: 5,
      comboBonus: 30
    }
  },
  {
    id: 4,
    name: '黃鴨助力',
    description: '所有自動產出 +20%',
    cost: 1000,
    tier: 'early',
    icon: '🦆',
    effect: {
      type: 'multiplier',
      target: 'auto',
      multiplier: 1.2
    }
  },
  {
    id: 5,
    name: '白鴨能量棒',
    description: '點擊時 15% 機率額外 +100 Quack',
    cost: 1500,
    tier: 'early',
    icon: '⚡',
    effect: {
      type: 'clickChance',
      probability: 0.15,
      bonus: 100
    }
  },
  {
    id: 6,
    name: '成年鴨火箭',
    description: '每秒 +50 Quack，升級成本減少 10%',
    cost: 2500,
    tier: 'early',
    icon: '🚀',
    effect: {
      type: 'hybrid',
      effects: [
        { type: 'autoProduction', value: 50 },
        { type: 'upgradeDiscount', target: 'all', discount: 0.9 }
      ]
    }
  },
  
  // 🟡 中期道具
  {
    id: 7,
    name: '鴨鴨超級彈簧',
    description: '點擊 5 連擊後觸發「彈射模式」：10 秒內點擊 +200%',
    cost: 4000,
    tier: 'mid',
    icon: '🌀',
    effect: {
      type: 'combo',
      clickBonus: 0,
      comboThreshold: 5,
      comboBonus: 0,
      comboEffect: 'bouncyMode',
      duration: 10,
      multiplier: 3
    }
  },
  {
    id: 8,
    name: '至聖鴨法杖',
    description: '每秒 +200 Quack，點擊 +25 Quack',
    cost: 6500,
    tier: 'mid',
    icon: '🪄',
    effect: {
      type: 'hybrid',
      effects: [
        { type: 'autoProduction', value: 200 },
        { type: 'clickBonus', value: 25 }
      ]
    }
  },
  {
    id: 9,
    name: '鴨力能量飲',
    description: '30 秒內所有 Quack 倍率 ×2（冷卻 60 秒）',
    cost: 9000,
    tier: 'mid',
    icon: '🥤',
    effect: {
      type: 'multiplier',
      target: 'all',
      multiplier: 2,
      duration: 30,
      cooldown: 60
    }
  },
  {
    id: 10,
    name: '鴨神祝福',
    description: '每秒 +300 Quack，自動機效果 +50%',
    cost: 12000,
    tier: 'mid',
    icon: '✨',
    effect: {
      type: 'hybrid',
      effects: [
        { type: 'autoProduction', value: 300 },
        { type: 'multiplier', target: 'auto', multiplier: 1.5 }
      ]
    }
  },
  {
    id: 11,
    name: '黃金鴨蛋',
    description: '點擊時 10% 機率獲得當前 Quack 值的 +2%',
    cost: 15000,
    tier: 'mid',
    icon: '🥇',
    effect: {
      type: 'clickChance',
      probability: 0.1,
      bonus: 'percentage',
      bonusPercent: 0.02
    }
  },
  {
    id: 12,
    name: '魔法鴨羽毛',
    description: '每 10 秒觸發「魔法風暴」：一次性獲得 +2000 Quack',
    cost: 20000,
    tier: 'mid',
    icon: '🪶',
    effect: {
      type: 'periodic',
      interval: 10,
      bonus: 2000,
      effectName: 'magicStorm'
    }
  },
  {
    id: 13,
    name: '鴨鴨烈焰槍',
    description: '點擊 +300 Quack，暴擊機率 +10%',
    cost: 28000,
    tier: 'mid',
    icon: '🔥',
    effect: {
      type: 'hybrid',
      effects: [
        { type: 'clickBonus', value: 300 },
        { type: 'critRate', value: 0.1 }
      ]
    }
  },
  {
    id: 14,
    name: '神秘鴨寶箱',
    description: '每 30 秒隨機給 +5000~10000 Quack',
    cost: 40000,
    tier: 'mid',
    icon: '📦',
    effect: {
      type: 'periodic',
      interval: 30,
      bonus: [5000, 10000],
      effectName: 'mysteryBox'
    }
  },
  
  // 🔴 後期道具
  {
    id: 15,
    name: '鴨之皇冠',
    description: '點擊 +500 Quack，所有道具效果 +10%',
    cost: 60000,
    tier: 'late',
    icon: '👑',
    effect: {
      type: 'hybrid',
      effects: [
        { type: 'clickBonus', value: 500 },
        { type: 'multiplier', target: 'items', multiplier: 1.1 }
      ]
    }
  },
  {
    id: 16,
    name: '超級鴨羽翼',
    description: '每秒 +1000 Quack，暴擊傷害 ×2',
    cost: 90000,
    tier: 'late',
    icon: '🪽',
    effect: {
      type: 'hybrid',
      effects: [
        { type: 'autoProduction', value: 1000 },
        { type: 'critDamage', multiplier: 2 }
      ]
    }
  },
  {
    id: 17,
    name: '鴨神之杖',
    description: '點擊 +2000 Quack，10% 機率立即升級鴨子',
    cost: 120000,
    tier: 'late',
    icon: '🔱',
    effect: {
      type: 'hybrid',
      effects: [
        { type: 'clickBonus', value: 2000 },
        { type: 'instantUpgrade', probability: 0.1, target: 'duckStage' }
      ]
    }
  },
  {
    id: 18,
    name: '天鴨之盾',
    description: '每秒 +1500 Quack，鴨力值增長速度減少 20%',
    cost: 160000,
    tier: 'late',
    icon: '🛡️',
    effect: {
      type: 'hybrid',
      effects: [
        { type: 'autoProduction', value: 1500 },
        { type: 'staminaReduction', multiplier: 0.8 }
      ]
    }
  },
  
  // ⚫ 終極道具
  {
    id: 19,
    name: '鴨皇寶座',
    description: '點擊 +3000 Quack，啟動「雙倍模式」15 秒',
    cost: 250000,
    tier: 'endgame',
    icon: '🪑',
    effect: {
      type: 'hybrid',
      effects: [
        { type: 'clickBonus', value: 3000 },
        {
          type: 'multiplier',
          target: 'all',
          multiplier: 2,
          duration: 15,
          cooldown: 45
        }
      ]
    }
  },
  {
    id: 20,
    name: '至高鴨之神器',
    description: '每秒 +5000 Quack，每 3 分鐘觸發「鴨神降臨」：全局 +50,000 Quack',
    cost: 400000,
    tier: 'endgame',
    icon: '⚜️',
    effect: {
      type: 'hybrid',
      effects: [
        { type: 'autoProduction', value: 5000 },
        {
          type: 'periodic',
          interval: 180,
          bonus: 50000,
          effectName: 'godDescend'
        }
      ]
    }
  }
];
