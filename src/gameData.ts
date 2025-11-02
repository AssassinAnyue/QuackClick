import { DuckStage, SpecialItem } from './types';

// 15个阶段的升级成本（每阶段5次升级，成本×1.6，全部×0.3）
export const UPGRADE_COSTS: Record<DuckStage, number[]> = {
  '鴨蛋': [5, 8, 13, 20, 32],
  '黃鴨': [50, 80, 128, 205, 328],
  '白鴨': [400, 640, 1024, 1638, 2621],
  '成年鴨': [3000, 4800, 7680, 12288, 19661],
  '至聖先鴨': [20000, 32000, 51200, 81920, 131072],
  '天啟鴨': [116667, 186667, 298667, 477867, 764587],
  '星界鴨': [666667, 1066667, 1706667, 2730667, 4369067],
  '混沌鴨': [4000000, 6400000, 10240000, 16384000, 26214400],
  '永恆鴨': [23333333, 37333333, 59733333, 95573333, 152917333],
  '超鴨神體': [133333333, 213333333, 341333333, 546133333, 873813333],
  '鴨界意志': [766666667, 1226666667, 1962666667, 3140266667, 5024426667],
  '原初之鴨': [4000000000, 6400000000, 10240000000, 16384000000, 26214400000],
  '鴨神皇': [21666666667, 34666666667, 55466666667, 88746666667, 141994666667],
  '多元鴨體': [116666666667, 186666666667, 298666666667, 477866666667, 764586666667],
  '絕對鴨': [666666666667, 1066666666667, 1706666666667, 2730666666667, 4369066666667]
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
// 获取阶段对应的图片路径
export function getStageImage(stage: DuckStage): string {
  const stageIndex = STAGE_ORDER.indexOf(stage);
  // 图片编号从1开始，有12张图片
  // 如果阶段超过12，使用第12张图片（最后一幅）
  const imageNumber = Math.min(stageIndex + 1, 12);
  return `/Image/Duck/${imageNumber}.png`;
}

// 保留旧函数用于兼容（返回图片路径而不是emoji）
export function getStageIcon(stage: DuckStage): string {
  // 为了兼容性，返回图片路径
  return getStageImage(stage);
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

// 获取道具图标（如果有图片则使用图片，否则使用emoji）
export function getItemIcon(itemName: string, defaultIcon: string): string {
  // 检查是否有对应的图片文件
  const imagePath = `/Image/Item/${itemName}.png`;
  // 注意：这里返回路径，组件需要检查图片是否存在
  // 为了简化，我们可以假设图片都存在，实际显示时组件会处理加载失败的情况
  return imagePath;
}

// 检查道具是否有对应的图片
export function hasItemImage(itemName: string): boolean {
  const imageFiles = [
    '天鴨之盾',
    '小黃鴨餅乾',
    '白鴨能量棒',
    '神秘鴨寶箱',
    '至聖鴨法杖',
    '超級鴨羽翼',
    '雞毛撲打器',
    '魔法鴨羽毛',
    '鴨之皇冠',
    '鴨蛋加速器',
    '黃金鴨蛋',
    '黃鴨助力'
  ];
  return imageFiles.includes(itemName);
}

// 可升级道具数值计算（简化版）
// 鸭点击器：固定每级 +1，Lv.1 = +2, Lv.2 = +3, ..., Lv.n = +(n+1)
export function getClickerValue(level: number): number {
  if (level <= 0) return 0;
  return 2 + (level - 1); // Lv.1 = 2, Lv.2 = 3, ...
}

// 鸭点击器成本：Lv.1 = 100, 之后每级 ×1.75
export function getClickerUpgradeCost(level: number): number {
  if (level <= 0) return 0;
  if (level === 1) return 100; // 初始成本
  
  return Math.floor(100 * Math.pow(1.75, level - 1));
}

// 鸭自动机：固定每级 +1，Lv.1 = +1, Lv.2 = +2, ..., Lv.n = +n
export function getAutoValue(level: number): number {
  if (level <= 0) return 0;
  return level; // Lv.1 = 1, Lv.2 = 2, ...
}

// 鸭自动机成本：Lv.1 = 250, 之后每级 ×2.0
export function getAutoUpgradeCost(level: number): number {
  if (level <= 0) return 0;
  if (level === 1) return 250; // 初始成本
  
  return Math.floor(250 * Math.pow(2.0, level - 1));
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
    icon: '/Image/Item/小黃鴨餅乾.png',
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
    icon: '/Image/Item/鴨蛋加速器.png',
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
    icon: '/Image/Item/雞毛撲打器.png',
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
    icon: '/Image/Item/黃鴨助力.png',
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
    icon: '/Image/Item/白鴨能量棒.png',
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
    icon: '/Image/Item/至聖鴨法杖.png',
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
    icon: '/Image/Item/黃金鴨蛋.png',
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
    icon: '/Image/Item/魔法鴨羽毛.png',
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
    icon: '/Image/Item/神秘鴨寶箱.png',
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
    icon: '/Image/Item/鴨之皇冠.png',
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
    icon: '/Image/Item/超級鴨羽翼.png',
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
    description: '點擊 +2000 Quack，10% 機率觸發「神聖共鳴」：5 秒內所有 Quack +300%',
    cost: 120000,
    tier: 'late',
    icon: '🔱',
    effect: {
      type: 'hybrid',
      effects: [
        { type: 'clickBonus', value: 2000 },
        { type: 'sacredResonance', probability: 0.1, multiplier: 4.0, duration: 5 }
      ]
    }
  },
  {
    id: 18,
    name: '天鴨之盾',
    description: '每秒 +1500 Quack，鴨力值增長速度減少 20%',
    cost: 160000,
    tier: 'late',
    icon: '/Image/Item/天鴨之盾.png',
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
