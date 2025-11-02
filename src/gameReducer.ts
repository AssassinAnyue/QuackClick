import { GameState, GameAction } from './types';
import { UPGRADE_COSTS, STAGE_ORDER, ITEMS } from './gameData';
import { saveGameState } from './utils';

export const INITIAL_STATE: GameState = {
  quack: 0,
  duckPower: 0,
  stage: '鴨蛋',
  stageLevel: 0,
  purchasedItems: new Set(),
  clickMultiplier: 1,
  autoQuackPerSecond: 0,
  quackBonusPercent: 0,
  critChance: 0,
  duckPowerReduction: 0,
  doubleQuackActive: false,
  doubleQuackTimer: 0,
  energyDrinkTimer: 0,
  magicFeatherTimer: 0,
  throneTimer: 0,
  artifactTimer: 0,
  consecutiveClicks: 0,
  gameOver: false,
  gameWon: false,
  lastClickQuack: 0,
};

function calculateClickQuack(state: GameState): number {
  let baseQuack = 1;
  
  // Apply item bonuses
  if (state.purchasedItems.has('cookie')) baseQuack += 2;
  if (state.purchasedItems.has('feather')) baseQuack += 5;
  if (state.purchasedItems.has('staff')) baseQuack += 1;
  if (state.purchasedItems.has('flame')) baseQuack += 20;
  if (state.purchasedItems.has('crown')) baseQuack += 30;
  if (state.purchasedItems.has('godstaff')) baseQuack += 50;
  if (state.purchasedItems.has('throne')) baseQuack += 100;
  
  if (state.purchasedItems.has('drink')) baseQuack += 10;
  
  // Apply multiplier
  let totalQuack = baseQuack * state.clickMultiplier;
  
  // Double quack mode
  if (state.doubleQuackActive || state.throneTimer > 0) {
    totalQuack *= 2;
  }
  
  // Apply percentage bonus
  totalQuack = Math.floor(totalQuack * (1 + state.quackBonusPercent / 100));
  
  // Golden egg bonus (5% of current quack)
  if (state.purchasedItems.has('golden')) {
    totalQuack += Math.floor(state.quack * 0.05);
  }
  
  return totalQuack;
}

function calculateAutoQuack(state: GameState): number {
  let autoQuack = 0;
  
  if (state.purchasedItems.has('accelerator')) autoQuack += 1;
  if (state.purchasedItems.has('boost')) autoQuack += 2;
  if (state.purchasedItems.has('rocket')) autoQuack += 5;
  if (state.purchasedItems.has('staff')) autoQuack += 10;
  if (state.purchasedItems.has('blessing')) autoQuack += 20;
  if (state.purchasedItems.has('magic')) autoQuack += 30;
  if (state.purchasedItems.has('chest')) autoQuack += 50;
  if (state.purchasedItems.has('wings')) autoQuack += 80;
  if (state.purchasedItems.has('shield')) autoQuack += 120;
  if (state.purchasedItems.has('artifact')) autoQuack += 250;
  
  // Crown bonus (10% increase to auto gain)
  if (state.purchasedItems.has('crown')) {
    autoQuack = Math.floor(autoQuack * 1.1);
  }
  
  return autoQuack;
}

function calculateQuackBonusPercent(state: GameState): number {
  let bonus = 0;
  if (state.purchasedItems.has('boost')) bonus += 10;
  return bonus;
}

function calculateCritChance(state: GameState): number {
  let crit = 0;
  if (state.purchasedItems.has('wings')) crit += 5;
  return crit;
}

function calculateDuckPowerReduction(state: GameState): number {
  let reduction = 0;
  if (state.purchasedItems.has('shield')) reduction += 5;
  return reduction;
}

function processItemEffects(state: GameState): GameState {
  let newState = { ...state };
  
  // Magic feather: every 60 seconds +50 quack
  if (newState.purchasedItems.has('magic')) {
    newState.magicFeatherTimer += 1;
    if (newState.magicFeatherTimer >= 60) {
      newState.quack += 50;
      newState.magicFeatherTimer = 0;
    }
  }
  
  // Artifact: every 5 minutes (300 seconds) +1000 quack
  if (newState.purchasedItems.has('artifact')) {
    newState.artifactTimer += 1;
    if (newState.artifactTimer >= 300) {
      newState.quack += 1000;
      newState.artifactTimer = 0;
    }
  }
  
  // Throne: 10 seconds double quack
  if (newState.throneTimer > 0) {
    newState.throneTimer -= 1;
    if (newState.throneTimer === 0) {
      newState.doubleQuackActive = false;
    }
  }
  
  // Energy drink: 30 seconds double click
  if (newState.energyDrinkTimer > 0) {
    newState.energyDrinkTimer -= 1;
    if (newState.energyDrinkTimer === 0) {
      newState.doubleQuackActive = false;
    }
  }
  
  return newState;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (state.gameOver || state.gameWon) {
    if (action.type === 'RESET_GAME' || action.type === 'LOAD_GAME') {
      // Allow reset/load even if game is over
    } else {
      return state;
    }
  }
  
  let newState: GameState;
  
  switch (action.type) {
    case 'CLICK': {
      newState = { ...state };
      newState.consecutiveClicks += 1;
      
      let clickQuack = calculateClickQuack(newState);
      
      // Energy bar: 20% chance +10
      if (newState.purchasedItems.has('energy') && Math.random() < 0.2) {
        clickQuack += 10;
      }
      
      // Spring: 15% chance combo
      if (newState.purchasedItems.has('spring') && Math.random() < 0.15) {
        clickQuack += 3;
      }
      
      // Crit chance
      if (Math.random() * 100 < calculateCritChance(newState)) {
        clickQuack *= 2;
      }
      
      // Flame gun: 10 consecutive clicks = +50
      if (newState.purchasedItems.has('flame') && newState.consecutiveClicks >= 10) {
        clickQuack += 50;
        newState.consecutiveClicks = 0;
      }
      
      // Chest: 5% chance random item (simplified as + bonus quack)
      if (newState.purchasedItems.has('chest') && Math.random() < 0.05) {
        clickQuack += 100; // Simplified bonus
      }
      
      newState.quack += clickQuack;
      newState.lastClickQuack = clickQuack;
      
      break;
    }
    
    case 'TICK': {
      newState = processItemEffects(state);
      
      // Auto quack generation
      const autoQuack = calculateAutoQuack(newState);
      newState.quack += autoQuack / 60; // Per frame (60fps = 1 second)
      
      // Duck power increase (with reduction)
      const duckPowerIncrease = (1 - calculateDuckPowerReduction(newState) / 100) / 60;
      newState.duckPower += duckPowerIncrease;
      
      if (newState.duckPower >= 60) {
        newState.gameOver = true;
      }
      
      // Update calculated values
      newState.autoQuackPerSecond = calculateAutoQuack(newState);
      newState.quackBonusPercent = calculateQuackBonusPercent(newState);
      newState.critChance = calculateCritChance(newState);
      newState.duckPowerReduction = calculateDuckPowerReduction(newState);
      
      break;
    }
    
    case 'UPGRADE': {
      const costs = UPGRADE_COSTS[state.stage];
      if (state.stageLevel >= costs.length) {
        // Move to next stage
        const currentIndex = STAGE_ORDER.indexOf(state.stage);
        if (currentIndex < STAGE_ORDER.length - 1) {
          newState = {
            ...state,
            stage: STAGE_ORDER[currentIndex + 1],
            stageLevel: 0,
            duckPower: 0,
          };
          
          if (newState.stage === '至聖先鴨') {
            newState.gameWon = true;
          }
        } else {
          return state;
        }
      } else {
        const cost = costs[state.stageLevel];
        if (state.quack >= cost) {
          newState = {
            ...state,
            quack: state.quack - cost,
            stageLevel: state.stageLevel + 1,
            duckPower: 0,
          };
        } else {
          return state;
        }
      }
      break;
    }
    
    case 'PURCHASE_ITEM': {
      const item = ITEMS.find(i => i.id === action.itemId);
      if (!item || state.purchasedItems.has(action.itemId) || state.quack < item.cost) {
        return state;
      }
      
      newState = {
        ...state,
        quack: state.quack - item.cost,
        purchasedItems: new Set(state.purchasedItems).add(action.itemId),
      };
      
      // Special item activations
      if (action.itemId === 'drink') {
        newState.doubleQuackActive = true;
        newState.energyDrinkTimer = 30 * 60; // 30 seconds at 60fps
      }
      
      if (action.itemId === 'throne') {
        newState.doubleQuackActive = true;
        newState.throneTimer = 10 * 60; // 10 seconds at 60fps
      }
      
      // Update calculated values
      newState.autoQuackPerSecond = calculateAutoQuack(newState);
      newState.quackBonusPercent = calculateQuackBonusPercent(newState);
      newState.critChance = calculateCritChance(newState);
      newState.duckPowerReduction = calculateDuckPowerReduction(newState);
      
      break;
    }
    
    case 'RESET_GAME': {
      newState = { ...INITIAL_STATE };
      break;
    }
    
    case 'LOAD_GAME': {
      const loadedState = action.state;
      // Convert array back to Set
      newState = {
        ...loadedState,
        purchasedItems: new Set(loadedState.purchasedItems || []),
      };
      // Recalculate all derived values
      newState.autoQuackPerSecond = calculateAutoQuack(newState);
      newState.quackBonusPercent = calculateQuackBonusPercent(newState);
      newState.critChance = calculateCritChance(newState);
      newState.duckPowerReduction = calculateDuckPowerReduction(newState);
      break;
    }
    
    default:
      return state;
  }
  
  // Save state after each action
  saveGameState(newState);
  
  return newState;
}

