export type DuckStage = '鴨蛋' | '黃鴨' | '白鴨' | '成年鴨' | '至聖先鴨';

export interface UpgradeCost {
  stage: DuckStage;
  costs: number[];
}

export interface Item {
  id: string;
  name: string;
  description: string;
  cost: number;
  purchased: boolean;
}

export interface GameState {
  quack: number;
  duckPower: number;
  stage: DuckStage;
  stageLevel: number; // 0-4, current upgrade level within stage
  purchasedItems: Set<string>;
  
  // Special effects
  clickMultiplier: number;
  autoQuackPerSecond: number;
  quackBonusPercent: number;
  critChance: number;
  duckPowerReduction: number;
  doubleQuackActive: boolean;
  doubleQuackTimer: number;
  
  // Item-specific timers and states
  energyDrinkTimer: number;
  magicFeatherTimer: number;
  throneTimer: number;
  artifactTimer: number;
  consecutiveClicks: number;
  
  // Game status
  gameOver: boolean;
  gameWon: boolean;
  lastClickQuack: number; // Track last click quack gained for UI feedback
}

export type GameAction =
  | { type: 'CLICK' }
  | { type: 'TICK' }
  | { type: 'UPGRADE' }
  | { type: 'PURCHASE_ITEM'; itemId: string }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_GAME'; state: GameState };

