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
  | 'staminaReduction';

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
  comboEffect?: string; // 'bouncyMode' 等
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
  bonus: number | [number, number]; // 固定值或随机范围
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
  | StaminaReductionEffect;

export interface SpecialItem {
  id: number;
  name: string;
  description: string;
  cost: number;
  effect: ItemEffect;
  tier: 'early' | 'mid' | 'late' | 'endgame';
  icon: string;
}

export interface GameState {
  quack: number;
  duckPower: number;
  stage: DuckStage;
  stageLevel: number; // 0-4, current upgrade level within stage
  
  // 可升级道具
  clickerLevel: number;      // 鸭点击器等级
  autoLevel: number;         // 鸭自动机等级
  
  // 特殊道具（已购买列表）
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
  
  // 连击系统
  comboCount: number;
  lastClickTime: number;
  
  // Game status
  gameOver: boolean;
  gameWon: boolean;
  lastClickQuack: number; // Track last click quack gained for UI feedback
}

export type GameAction =
  | { type: 'CLICK' }
  | { type: 'TICK' }
  | { type: 'UPGRADE' }
  | { type: 'UPGRADE_CLICKER' }
  | { type: 'UPGRADE_AUTO' }
  | { type: 'PURCHASE_ITEM'; itemId: number }
  | { type: 'USE_ACTIVE_SKILL'; itemId: number }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_GAME'; state: GameState };

