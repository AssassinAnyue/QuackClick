export type DuckStage = 
  | '鴨蛋' 
  | '黃鴨' 
  | '白鴨' 
  | '成年鴨' 
  | '至聖先鴨'
  | '天啟鴨'
  | '星界鴨'
  | '混沌鴨'
  | '永恆鴨'
  | '超鴨神體'
  | '鴨界意志'
  | '原初之鴨'
  | '鴨神皇'
  | '多元鴨體'
  | '絕對鴨';

export interface UpgradeCost {
  stage: DuckStage;
  costs: number[];
}

// 道具类型
export type ItemType = 'click' | 'auto' | 'boost' | 'special';

// 升级道具接口
export interface UpgradeableItem {
  id: number;
  name: string;
  type: ItemType;
  description: string;
  baseCost: number;           // 初始成本
  costMultiplier: number;     // 成本倍增
  baseEffect: number;         // 基础效果值
  effectGrowth: number;       // 每级效果成长
  maxLevel: number;           // 最大等级
  icon: string;               // 图标（emoji或图片路径）
  effectType: string;         // 效果类型描述（用于计算）
  unlockStage: DuckStage;     // 解锁所需的鸭子阶段
}

export interface SpecialItem {
  id: number;
  name: string;
  description: string;
  cost: number;
  effect: ItemEffect;
  tier: 'early' | 'mid' | 'late' | 'endgame';
  icon: string;
}

// 特殊道具效果类型
export type ItemEffectType = 
  | 'clickChance'
  | 'autoProduction'
  | 'combo'
  | 'multiplier'
  | 'periodic'
  | 'hybrid'
  | 'upgradeDiscount'
  | 'clickBonus'
  | 'critRate'
  | 'critDamage'
  | 'instantUpgrade'
  | 'staminaReduction'
  | 'sacredResonance';

export interface ClickChanceEffect {
  type: 'clickChance';
  probability: number;
  bonus: number | 'percentage';
  bonusPercent?: number;
}

export interface AutoProductionEffect {
  type: 'autoProduction';
  value: number;
}

export interface ComboEffect {
  type: 'combo';
  clickBonus: number;
  comboThreshold: number;
  comboBonus: number;
  comboEffect?: string;
  duration?: number;
  multiplier?: number;
}

export interface MultiplierEffect {
  type: 'multiplier';
  target: 'auto' | 'click' | 'all' | 'items';
  multiplier: number;
  duration?: number;
  cooldown?: number;
}

export interface PeriodicEffect {
  type: 'periodic';
  interval: number;
  bonus: number | [number, number];
  effectName?: string;
}

export interface UpgradeDiscountEffect {
  type: 'upgradeDiscount';
  target: 'all';
  discount: number;
}

export interface ClickBonusEffect {
  type: 'clickBonus';
  value: number;
}

export interface CritRateEffect {
  type: 'critRate';
  value: number;
}

export interface CritDamageEffect {
  type: 'critDamage';
  multiplier: number;
}

export interface InstantUpgradeEffect {
  type: 'instantUpgrade';
  probability: number;
  target: 'duckStage';
}

export interface StaminaReductionEffect {
  type: 'staminaReduction';
  multiplier: number;
}

export interface SacredResonanceEffect {
  type: 'sacredResonance';
  probability: number;
  multiplier: number;
  duration: number;
}

export interface HybridEffect {
  type: 'hybrid';
  effects: Array<
    | AutoProductionEffect
    | ClickBonusEffect
    | MultiplierEffect
    | UpgradeDiscountEffect
    | CritRateEffect
    | CritDamageEffect
    | InstantUpgradeEffect
    | StaminaReductionEffect
    | PeriodicEffect
    | SacredResonanceEffect
  >;
}

export type ItemEffect = 
  | ClickChanceEffect
  | AutoProductionEffect
  | ComboEffect
  | MultiplierEffect
  | PeriodicEffect
  | HybridEffect
  | UpgradeDiscountEffect
  | ClickBonusEffect
  | CritRateEffect
  | CritDamageEffect
  | InstantUpgradeEffect
  | StaminaReductionEffect
  | SacredResonanceEffect;

export interface GameState {
  quack: number;
  duckPower: number;
  stage: DuckStage;
  stageLevel: number; // 0-4, current upgrade level within stage
  
  // 可升级道具等级
  itemLevels: Record<number, number>; // itemId -> level
  
  // 特殊道具（已购买列表，保留兼容）
  purchasedItems: Set<number>;  // 已购买的道具 ID
  
  // 计算缓存
  totalClickPower: number;   // 总点击力量
  totalAutoProduction: number; // 总自动产量/秒
  
  // 特殊机制状态
  consecutiveClicks: number;
  lastClickTime: number;
  activeMultiplier: number;
  multiplierTimer: number;
  
  // 定时器状态
  periodicTimers: Record<number, number>; // itemId -> timer
  
  // 主动技能状态
  activeSkills: Record<number, {
    lastUsed: number;
    cooldownRemaining: number;
    durationRemaining?: number;
  }>;
  
  // 特殊模式状态
  bouncyModeActive: boolean;
  bouncyModeTimer: number;
  
  // 神圣共鸣状态
  sacredResonanceActive: boolean;
  sacredResonanceTimer: number;
  
  // 閃電鴨核状态（点击时暂时提升自动生产）
  lightningBoostActive: boolean;
  lightningBoostTimer: number;
  lightningBoostMultiplier: number;
  
  // 時空鴨儀状态（暂停鸭力值增长）
  timeFreezeActive: boolean;
  timeFreezeTimer: number;
  
  // 连击系统
  comboCount: number;
  
  // Game status
  gameOver: boolean;
  gameWon: boolean;
  lastClickQuack: number; // Track last click quack gained for UI feedback
}

export type GameAction =
  | { type: 'CLICK' }
  | { type: 'TICK' }
  | { type: 'UPGRADE' }
  | { type: 'UPGRADE_ITEM'; itemId: number }
  | { type: 'USE_ACTIVE_SKILL'; itemId: number }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_GAME'; state: GameState };
