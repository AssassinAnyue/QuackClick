import { UpgradeableItem } from './types';

// 20个可升级道具数据
export const UPGRADE_ITEMS: UpgradeableItem[] = [
  {
    id: 1,
    name: '🪶 鴨點擊器',
    type: 'click',
    description: '每次點擊 +2 → 每級 +1',
    baseCost: 30,
    costMultiplier: 1.75,
    baseEffect: 2,
    effectGrowth: 1,
    maxLevel: 50,
    icon: '🪶',
    effectType: 'clickBonus',
    unlockStage: '鴨蛋'
  },
  {
    id: 2,
    name: '⚙️ 鴨自動機',
    type: 'auto',
    description: '每秒 +1 → 每級 +1',
    baseCost: 75,
    costMultiplier: 2.0,
    baseEffect: 1,
    effectGrowth: 1,
    maxLevel: 40,
    icon: '⚙️',
    effectType: 'autoProduction',
    unlockStage: '鴨蛋'
  },
  {
    id: 3,
    name: '💥 超級鴨點擊器',
    type: 'click',
    description: '點擊時額外 +10% 當前點擊獲得',
    baseCost: 1500,
    costMultiplier: 2.2,
    baseEffect: 0.1,
    effectGrowth: 0.05,
    maxLevel: 25,
    icon: '💥',
    effectType: 'clickMultiplier',
    unlockStage: '黃鴨'
  },
  {
    id: 4,
    name: '🧩 鴨式連擊模組',
    type: 'click',
    description: '每連續點擊5次額外 +50% Quack',
    baseCost: 2250,
    costMultiplier: 2.1,
    baseEffect: 0.5,
    effectGrowth: 0.1,
    maxLevel: 20,
    icon: '🧩',
    effectType: 'comboBonus',
    unlockStage: '黃鴨'
  },
  {
    id: 5,
    name: '💨 鴨之風暴',
    type: 'click',
    description: '點擊速度加成(減少點擊CD)5%',
    baseCost: 3600,
    costMultiplier: 2.3,
    baseEffect: 0.05,
    effectGrowth: 0.03,
    maxLevel: 15,
    icon: '💨',
    effectType: 'clickSpeed',
    unlockStage: '白鴨'
  },
  {
    id: 6,
    name: '⏱️ 鴨時間加速器',
    type: 'auto',
    description: '全自動產出速度 +5%',
    baseCost: 6000,
    costMultiplier: 2.4,
    baseEffect: 0.05,
    effectGrowth: 0.05,
    maxLevel: 30,
    icon: '⏱️',
    effectType: 'autoSpeed',
    unlockStage: '白鴨'
  },
  {
    id: 7,
    name: '🔥 鴨燃引擎',
    type: 'auto',
    description: '每升級增加 +10% 自動Quack',
    baseCost: 10500,
    costMultiplier: 2.5,
    baseEffect: 0.1,
    effectGrowth: 0.1,
    maxLevel: 20,
    icon: '🔥',
    effectType: 'autoMultiplier',
    unlockStage: '成年鴨'
  },
  {
    id: 8,
    name: '⚡ 閃電鴨核',
    type: 'auto',
    description: '每次點擊增加自動生產暫時 +2倍(持續2秒)',
    baseCost: 15000,
    costMultiplier: 2.5,
    baseEffect: 2,
    effectGrowth: 0.5,
    maxLevel: 10,
    icon: '⚡',
    effectType: 'lightningBoost',
    unlockStage: '成年鴨'
  },
  {
    id: 9,
    name: '🎯 鴨之專注',
    type: 'boost',
    description: '點擊與自動生產加成 +2%',
    baseCost: 24000,
    costMultiplier: 2.6,
    baseEffect: 0.02,
    effectGrowth: 0.02,
    maxLevel: 40,
    icon: '🎯',
    effectType: 'allMultiplier',
    unlockStage: '至聖先鴨'
  },
  {
    id: 10,
    name: '🕊️ 鴨之祝福',
    type: 'boost',
    description: '所有獲得 Quack 值 ×1.1',
    baseCost: 36000,
    costMultiplier: 3.0,
    baseEffect: 0.1,
    effectGrowth: 0.05,
    maxLevel: 30,
    icon: '🕊️',
    effectType: 'globalMultiplier',
    unlockStage: '至聖先鴨'
  },
  {
    id: 11,
    name: '🌈 彩羽共鳴',
    type: 'special',
    description: '10 秒內產出翻倍,CD 60 秒',
    baseCost: 60000,
    costMultiplier: 2.8,
    baseEffect: 60,
    effectGrowth: -3,
    maxLevel: 15,
    icon: '🌈',
    effectType: 'rainbowResonance',
    unlockStage: '天啟鴨'
  },
  {
    id: 12,
    name: '🔮 鴨神之杖',
    type: 'special',
    description: '點擊10% 機率觸發「神聖共鳴」(5秒×4倍)',
    baseCost: 750000,
    costMultiplier: 2.5,
    baseEffect: 5,
    effectGrowth: 0.5,
    maxLevel: 10,
    icon: '🔮',
    effectType: 'sacredResonance',
    unlockStage: '星界鴨'
  },
  {
    id: 13,
    name: '🪙 鴨之信仰池',
    type: 'boost',
    description: '每10秒獲得「信仰值」→ +1% Quack',
    baseCost: 150000,
    costMultiplier: 2.7,
    baseEffect: 0.01,
    effectGrowth: 0.005,
    maxLevel: 20,
    icon: '🪙',
    effectType: 'faithPool',
    unlockStage: '天啟鴨'
  },
  {
    id: 14,
    name: '🧠 聰鴨晶片',
    type: 'auto',
    description: '每次升級自動機效率 +3%',
    baseCost: 120000,
    costMultiplier: 2.6,
    baseEffect: 0.03,
    effectGrowth: 0.03,
    maxLevel: 30,
    icon: '🧠',
    effectType: 'autoEfficiency',
    unlockStage: '星界鴨'
  },
  {
    id: 15,
    name: '🎁 鴨運轉輪',
    type: 'special',
    description: '每60秒有5% 機率觸發「黃金鴨雨」(10秒x2倍)',
    baseCost: 300000,
    costMultiplier: 2.8,
    baseEffect: 0.05,
    effectGrowth: 0.01,
    maxLevel: 15,
    icon: '🎁',
    effectType: 'goldenRain',
    unlockStage: '混沌鴨'
  },
  {
    id: 16,
    name: '🪶 鴨學研究所',
    type: 'boost',
    description: '所有升級成本 -2%',
    baseCost: 360000,
    costMultiplier: 3.0,
    baseEffect: 0.02,
    effectGrowth: 0.01,
    maxLevel: 10,
    icon: '🪶',
    effectType: 'costReduction',
    unlockStage: '混沌鴨'
  },
  {
    id: 17,
    name: '🕰️ 時空鴨儀',
    type: 'special',
    description: '暫停鴨力值累積5秒',
    baseCost: 600000,
    costMultiplier: 2.9,
    baseEffect: 5,
    effectGrowth: 1,
    maxLevel: 10,
    icon: '🕰️',
    effectType: 'timeFreeze',
    unlockStage: '永恆鴨'
  },
  {
    id: 18,
    name: '🌌 鴨界之門',
    type: 'special',
    description: '進入「超鴨維度」,暫時所有收益×3',
    baseCost: 1500000,
    costMultiplier: 3.5,
    baseEffect: 3,
    effectGrowth: 0.5,
    maxLevel: 5,
    icon: '🌌',
    effectType: 'dimensionGate',
    unlockStage: '超鴨神體'
  },
  {
    id: 19,
    name: '🔔 鴨鳴鐘',
    type: 'boost',
    description: '提升所有道具效果 +5%',
    baseCost: 750000,
    costMultiplier: 3.2,
    baseEffect: 0.05,
    effectGrowth: 0.02,
    maxLevel: 20,
    icon: '🔔',
    effectType: 'itemBoost',
    unlockStage: '永恆鴨'
  },
  {
    id: 20,
    name: '💎 鴨靈核心',
    type: 'boost',
    description: '所有加成類道具效果 +10%',
    baseCost: 3000000,
    costMultiplier: 3.8,
    baseEffect: 0.1,
    effectGrowth: 0.05,
    maxLevel: 10,
    icon: '💎',
    effectType: 'coreBoost',
    unlockStage: '超鴨神體'
  }
];

// 计算道具升级成本
export function getItemUpgradeCost(item: UpgradeableItem, currentLevel: number): number {
  if (currentLevel >= item.maxLevel) return Infinity;
  if (currentLevel === 0) return item.baseCost;
  return Math.floor(item.baseCost * Math.pow(item.costMultiplier, currentLevel));
}

// 计算道具当前效果值
export function getItemEffectValue(item: UpgradeableItem, level: number): number {
  if (level === 0) return 0;
  return item.baseEffect + (item.effectGrowth * (level - 1));
}

// 计算道具下一级效果值
export function getItemNextEffectValue(item: UpgradeableItem, level: number): number {
  if (level >= item.maxLevel) return getItemEffectValue(item, item.maxLevel);
  return item.baseEffect + (item.effectGrowth * level);
}

