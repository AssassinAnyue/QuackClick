import { GameState, GameAction, MultiplierEffect } from './types';
import { UPGRADE_COSTS, STAGE_ORDER, SPECIAL_ITEMS, getMaxDuckPower, getClickerUpgradeCost, getAutoUpgradeCost, getClickerValue, getAutoValue } from './gameData';
import { saveGameState } from './utils';

const COMBO_TIMEOUT = 2000; // 2秒内未点击则重置连击

export const INITIAL_STATE: GameState = {
  quack: 0,
  duckPower: 0,
  stage: '鴨蛋',
  stageLevel: 0,
  
  // 可升级道具
  clickerLevel: 0,
  autoLevel: 0,
  
  // 特殊道具
  purchasedItems: new Set(),
  
  // 计算缓存（初始至少有基础点击+1）
  totalClickPower: 1,
  totalAutoProduction: 0,
  
  // 特殊机制状态
  consecutiveClicks: 0,
  lastClickTime: 0,
  activeMultiplier: 1,
  multiplierTimer: 0,
  
  // 定时器状态
  periodicTimers: {},
  
  // 主动技能状态
  activeSkills: {},
  
  // 特殊模式状态
  bouncyModeActive: false,
  bouncyModeTimer: 0,
  
  // 连击系统
  comboCount: 0,
  
  // Game status
  gameOver: false,
  gameWon: false,
  lastClickQuack: 0,
};

// 计算总点击力量
function calculateClickPower(state: GameState): number {
  // 基础点击力量来自鸭点击器（level 0时至少+1基础点击）
  let baseQuack = Math.max(1, getClickerValue(state.clickerLevel));
  
  // 加上特殊道具的点击加成
  SPECIAL_ITEMS.forEach(item => {
    if (state.purchasedItems.has(item.id)) {
      const effect = item.effect;
      
      // clickBonus效果
      if (effect.type === 'clickBonus') {
        baseQuack += effect.value;
      }
      
      // combo效果的clickBonus
      if (effect.type === 'combo' && effect.clickBonus) {
        baseQuack += effect.clickBonus;
      }
      
      // hybrid效果中的clickBonus
      if (effect.type === 'hybrid') {
        effect.effects.forEach(subEffect => {
          if (subEffect.type === 'clickBonus') {
            baseQuack += subEffect.value;
          }
        });
      }
    }
  });
  
  // 应用全局倍率加成（包括弹射模式）
  let multiplier = state.activeMultiplier;
  if (state.bouncyModeActive) {
    multiplier *= 3; // 弹射模式 ×3
  }
  
  SPECIAL_ITEMS.forEach(item => {
    if (state.purchasedItems.has(item.id)) {
      const effect = item.effect;
      if (effect.type === 'multiplier') {
        if (effect.target === 'click' || effect.target === 'all') {
          // 检查是否在持续时间内（主动技能）
          const skill = state.activeSkills[item.id];
          if (skill && skill.durationRemaining && skill.durationRemaining > 0) {
            multiplier *= effect.multiplier;
          } else if (!effect.duration) {
            // 永久倍率
            multiplier *= effect.multiplier;
          }
        }
      } else if (effect.type === 'hybrid') {
        effect.effects.forEach(subEffect => {
          if (subEffect.type === 'multiplier' && 
              (subEffect.target === 'click' || subEffect.target === 'all')) {
            const skill = state.activeSkills[item.id];
            if (skill && skill.durationRemaining && skill.durationRemaining > 0) {
              multiplier *= subEffect.multiplier;
            } else if (!subEffect.duration) {
              multiplier *= subEffect.multiplier;
            }
          }
        });
      }
    }
  });
  
  // 道具效果加成（鸭之皇冠）
  let itemMultiplier = 1;
  if (state.purchasedItems.has(15)) { // 鸭之皇冠
    SPECIAL_ITEMS.forEach(item => {
      if (state.purchasedItems.has(item.id) && item.id !== 15) {
        itemMultiplier *= 1.1; // 所有其他道具效果+10%
      }
    });
  }
  
  return Math.floor(baseQuack * multiplier * itemMultiplier);
}

// 计算自动产量
function calculateAutoProduction(state: GameState): number {
  // 基础自动产量来自鸭自动机
  let total = getAutoValue(state.autoLevel);
  
  // 加上特殊道具的自动产量
  SPECIAL_ITEMS.forEach(item => {
    if (state.purchasedItems.has(item.id)) {
      const effect = item.effect;
      
      if (effect.type === 'autoProduction') {
        total += effect.value;
      } else if (effect.type === 'hybrid') {
        effect.effects.forEach(subEffect => {
          if (subEffect.type === 'autoProduction') {
            total += subEffect.value;
          }
        });
      }
    }
  });
  
  // 应用自动道具倍率加成
  let multiplier = 1;
  SPECIAL_ITEMS.forEach(item => {
    if (state.purchasedItems.has(item.id)) {
      const effect = item.effect;
      
      if (effect.type === 'multiplier') {
        if (effect.target === 'auto' || effect.target === 'all') {
          const skill = state.activeSkills[item.id];
          if (skill && skill.durationRemaining && skill.durationRemaining > 0) {
            multiplier *= effect.multiplier;
          } else if (!effect.duration) {
            multiplier *= effect.multiplier;
          }
        }
      } else if (effect.type === 'hybrid') {
        effect.effects.forEach(subEffect => {
          if (subEffect.type === 'multiplier' && 
              (subEffect.target === 'auto' || subEffect.target === 'all')) {
            const skill = state.activeSkills[item.id];
            if (skill && skill.durationRemaining && skill.durationRemaining > 0) {
              multiplier *= subEffect.multiplier;
            } else if (!subEffect.duration) {
              multiplier *= subEffect.multiplier;
            }
          }
        });
      }
    }
  });
  
  // 道具效果加成（鸭之皇冠）
  if (state.purchasedItems.has(15)) {
    multiplier *= 1.1;
  }
  
  // 全局倍率（主动技能）
  if (state.activeMultiplier > 1) {
    multiplier *= state.activeMultiplier;
  }
  
  return Math.floor(total * multiplier);
}

// 处理点击时的机率效果
function handleClickChanceEffects(state: GameState, purchasedItems: number[]): number {
  let bonus = 0;
  
  purchasedItems.forEach(itemId => {
    const item = SPECIAL_ITEMS.find(i => i.id === itemId);
    if (!item || item.effect.type !== 'clickChance') return;
    
    const effect = item.effect;
    const probability = effect.probability || 0;
    
    if (Math.random() < probability) {
      if (effect.bonus === 'percentage' && effect.bonusPercent) {
        // 百分比加成（黄金鸭蛋）
        bonus += Math.floor(state.quack * effect.bonusPercent);
      } else if (typeof effect.bonus === 'number') {
        bonus += effect.bonus;
      }
    }
  });
  
  return bonus;
}

// 检查连击奖励
function checkComboBonus(state: GameState): { bonus: number; triggerBouncyMode: boolean } {
  let bonus = 0;
  let triggerBouncyMode = false;
  
  SPECIAL_ITEMS.forEach(item => {
    if (state.purchasedItems.has(item.id) && item.effect.type === 'combo') {
      const effect = item.effect;
      if (effect.comboThreshold && state.comboCount >= effect.comboThreshold) {
        if (effect.comboBonus) {
          bonus += effect.comboBonus;
        }
        // 检查是否触发弹射模式
        if (effect.comboEffect === 'bouncyMode') {
          triggerBouncyMode = true;
        }
      }
    }
  });
  
  return { bonus, triggerBouncyMode };
}

// 计算鸭力值增长速率
function calculateDuckPowerRate(state: GameState): number {
  let rate = 1; // 每秒增加1点
  
  SPECIAL_ITEMS.forEach(item => {
    if (state.purchasedItems.has(item.id)) {
      const effect = item.effect;
      
      if (effect.type === 'staminaReduction') {
        rate *= effect.multiplier;
      } else if (effect.type === 'hybrid') {
        effect.effects.forEach(subEffect => {
          if (subEffect.type === 'staminaReduction') {
            rate *= subEffect.multiplier;
          }
        });
      }
    }
  });
  
  return rate;
}

// 计算总暴击率
function calculateTotalCritRate(state: GameState): number {
  let critRate = 0;
  
  SPECIAL_ITEMS.forEach(item => {
    if (state.purchasedItems.has(item.id)) {
      const effect = item.effect;
      
      if (effect.type === 'critRate') {
        critRate += effect.value;
      } else if (effect.type === 'hybrid') {
        effect.effects.forEach(subEffect => {
          if (subEffect.type === 'critRate') {
            critRate += subEffect.value;
          }
        });
      }
    }
  });
  
  return critRate;
}

// 计算暴击伤害倍率
function calculateCritDamageMultiplier(state: GameState): number {
  let multiplier = 2; // 基础暴击×2
  
  SPECIAL_ITEMS.forEach(item => {
    if (state.purchasedItems.has(item.id)) {
      const effect = item.effect;
      
      if (effect.type === 'critDamage') {
        multiplier *= effect.multiplier;
      } else if (effect.type === 'hybrid') {
        effect.effects.forEach(subEffect => {
          if (subEffect.type === 'critDamage') {
            multiplier *= subEffect.multiplier;
          }
        });
      }
    }
  });
  
  return multiplier;
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
      
      // 处理连击系统（2秒内未点击则重置）
      const now = Date.now();
      if (newState.lastClickTime > 0 && now - newState.lastClickTime > COMBO_TIMEOUT) {
        newState.comboCount = 1; // 重置为1（当前点击）
      } else {
        newState.comboCount++;
      }
      newState.lastClickTime = now;
      newState.consecutiveClicks = newState.comboCount; // 兼容旧字段
      
      // 计算基础点击Quack
      let clickQuack = calculateClickPower(newState);
      
      // 处理机率效果
      const chanceBonus = handleClickChanceEffects(newState, Array.from(newState.purchasedItems));
      clickQuack += chanceBonus;
      
      // 检查连击奖励
      const comboResult = checkComboBonus(newState);
      clickQuack += comboResult.bonus;
      
      // 触发弹射模式
      if (comboResult.triggerBouncyMode && !newState.bouncyModeActive) {
        newState.bouncyModeActive = true;
        newState.bouncyModeTimer = 10 * 60; // 10秒（60fps）
        clickQuack = calculateClickPower(newState); // 重新计算包含弹射模式倍率
      }
      
      // 检查暴击
      const critRate = calculateTotalCritRate(newState);
      let critMultiplier = 1;
      if (critRate > 0 && Math.random() < critRate) {
        critMultiplier = calculateCritDamageMultiplier(newState);
      }
      clickQuack = Math.floor(clickQuack * critMultiplier);
      
      // 检查立即升级（鸭神之杖）
      let instantUpgrade = false;
      SPECIAL_ITEMS.forEach(item => {
        if (newState.purchasedItems.has(item.id)) {
          const effect = item.effect;
          if (effect.type === 'instantUpgrade') {
            if (Math.random() < effect.probability) {
              instantUpgrade = true;
            }
          } else if (effect.type === 'hybrid') {
            effect.effects.forEach(subEffect => {
              if (subEffect.type === 'instantUpgrade') {
                if (Math.random() < subEffect.probability) {
                  instantUpgrade = true;
                }
              }
            });
          }
        }
      });
      
      newState.quack += clickQuack;
      newState.lastClickQuack = clickQuack;
      
      // 更新计算缓存
      newState.totalClickPower = calculateClickPower(newState);
      
      // 如果触发立即升级
      if (instantUpgrade && newState.stageLevel < UPGRADE_COSTS[newState.stage].length) {
        newState.stageLevel++;
        if (newState.stageLevel >= UPGRADE_COSTS[newState.stage].length) {
          // 进入下一阶段
          const currentIndex = STAGE_ORDER.indexOf(newState.stage);
          if (currentIndex < STAGE_ORDER.length - 1) {
            newState.stage = STAGE_ORDER[currentIndex + 1];
            newState.stageLevel = 0;
            newState.duckPower = 0;
            
            if (newState.stage === '絕對鴨') {
              newState.gameWon = true;
            }
          }
        }
      }
      
      break;
    }
    
    case 'TICK': {
      newState = { ...state };
      
      // 自动Quack生产
      const autoProduction = calculateAutoProduction(newState);
      newState.quack += autoProduction / 60; // Per frame (60fps)
      
      // 鸭力值增长
      const duckPowerRate = calculateDuckPowerRate(newState);
      newState.duckPower += (duckPowerRate / 60);
      
      const maxDuckPower = getMaxDuckPower(newState.stage);
      if (newState.duckPower >= maxDuckPower) {
        newState.gameOver = true;
      }
      
      // 处理定时增益倒计时
      if (newState.multiplierTimer > 0) {
        newState.multiplierTimer--;
        if (newState.multiplierTimer === 0) {
          newState.activeMultiplier = 1;
        }
      }
      
      // 处理弹射模式倒计时
      if (newState.bouncyModeTimer > 0) {
        newState.bouncyModeTimer--;
        if (newState.bouncyModeTimer === 0) {
          newState.bouncyModeActive = false;
        }
      }
      
      // 处理主动技能倒计时
      Object.keys(newState.activeSkills).forEach(itemIdStr => {
        const itemId = parseInt(itemIdStr);
        const skill = newState.activeSkills[itemId];
        
        if (skill.durationRemaining !== undefined && skill.durationRemaining > 0) {
          skill.durationRemaining--;
          if (skill.durationRemaining === 0) {
            // 技能结束，重新计算倍率
            newState.activeMultiplier = 1;
            skill.cooldownRemaining = 0; // 重置冷却为0，开始计算
            delete skill.durationRemaining;
          }
        }
        
        // 更新冷却时间（使用帧数）
        if (skill.durationRemaining === undefined && skill.cooldownRemaining > 0) {
          skill.cooldownRemaining--;
        }
      });
      
      // 处理周期性奖励
      SPECIAL_ITEMS.forEach(item => {
        if (newState.purchasedItems.has(item.id) && item.effect.type === 'periodic') {
          const effect = item.effect;
          const timer = newState.periodicTimers[item.id] || 0;
          
          if (timer >= effect.interval * 60) { // 转换为帧数
            let bonus: number;
            if (Array.isArray(effect.bonus)) {
              // 随机范围
              const [min, max] = effect.bonus;
              bonus = Math.floor(Math.random() * (max - min + 1)) + min;
            } else {
              bonus = effect.bonus;
            }
            
            newState.quack += bonus;
            newState.periodicTimers = { ...newState.periodicTimers, [item.id]: 0 };
          } else {
            newState.periodicTimers = { 
              ...newState.periodicTimers, 
              [item.id]: timer + 1 
            };
          }
        } else if (newState.purchasedItems.has(item.id) && item.effect.type === 'hybrid') {
          // 处理hybrid中的periodic效果
          item.effect.effects.forEach(subEffect => {
            if (subEffect.type === 'periodic') {
              const timer = newState.periodicTimers[item.id] || 0;
              
              if (timer >= subEffect.interval * 60) {
                let bonus: number;
                if (Array.isArray(subEffect.bonus)) {
                  const [min, max] = subEffect.bonus;
                  bonus = Math.floor(Math.random() * (max - min + 1)) + min;
                } else {
                  bonus = subEffect.bonus;
                }
                
                newState.quack += bonus;
                newState.periodicTimers = { ...newState.periodicTimers, [item.id]: 0 };
              } else {
                newState.periodicTimers = { 
                  ...newState.periodicTimers, 
                  [item.id]: timer + 1 
                };
              }
            }
          });
        }
      });
      
      // 更新计算缓存
      newState.totalAutoProduction = calculateAutoProduction(newState);
      
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
          
          if (newState.stage === '絕對鴨') {
            newState.gameWon = true;
          }
        } else {
          return state;
        }
      } else {
        let cost = costs[state.stageLevel];
        
        // 应用升级折扣
        let discount = 1;
        SPECIAL_ITEMS.forEach(item => {
          if (state.purchasedItems.has(item.id)) {
            const effect = item.effect;
            if (effect.type === 'upgradeDiscount') {
              discount *= effect.discount;
            } else if (effect.type === 'hybrid') {
              effect.effects.forEach(subEffect => {
                if (subEffect.type === 'upgradeDiscount') {
                  discount *= subEffect.discount;
                }
              });
            }
          }
        });
        cost = Math.floor(cost * discount);
        
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
    
    case 'UPGRADE_CLICKER': {
      const cost = getClickerUpgradeCost(state.clickerLevel + 1);
      if (state.quack >= cost) {
        newState = {
          ...state,
          quack: state.quack - cost,
          clickerLevel: state.clickerLevel + 1,
        };
        newState.totalClickPower = calculateClickPower(newState);
      } else {
        return state;
      }
      break;
    }
    
    case 'UPGRADE_AUTO': {
      const cost = getAutoUpgradeCost(state.autoLevel + 1);
      if (state.quack >= cost) {
        newState = {
          ...state,
          quack: state.quack - cost,
          autoLevel: state.autoLevel + 1,
        };
        newState.totalAutoProduction = calculateAutoProduction(newState);
      } else {
        return state;
      }
      break;
    }
    
    case 'PURCHASE_ITEM': {
      const item = SPECIAL_ITEMS.find(i => i.id === action.itemId);
      if (!item || state.purchasedItems.has(action.itemId) || state.quack < item.cost) {
        return state;
      }
      
      newState = {
        ...state,
        quack: state.quack - item.cost,
        purchasedItems: new Set(state.purchasedItems).add(action.itemId),
      };
      
      // 初始化主动技能状态（如果有duration和cooldown，说明是主动技能）
      if (item.effect.type === 'multiplier' && item.effect.duration && item.effect.cooldown) {
        newState.activeSkills[action.itemId] = {
          lastUsed: 0,
          cooldownRemaining: 0,
        };
      } else if (item.effect.type === 'hybrid') {
        // 检查hybrid中是否有主动技能
        const hasActiveSkill = item.effect.effects.some(e => 
          e.type === 'multiplier' && e.duration && e.cooldown
        );
        if (hasActiveSkill) {
          newState.activeSkills[action.itemId] = {
            lastUsed: 0,
            cooldownRemaining: 0,
          };
        }
      }
      
      // 更新计算缓存
      newState.totalClickPower = calculateClickPower(newState);
      newState.totalAutoProduction = calculateAutoProduction(newState);
      
      break;
    }
    
    case 'USE_ACTIVE_SKILL': {
      const item = SPECIAL_ITEMS.find(i => i.id === action.itemId);
      if (!item || !state.purchasedItems.has(action.itemId)) {
        return state;
      }
      
      // 检查是否是主动技能
      let skillEffect: MultiplierEffect | null = null;
      if (item.effect.type === 'multiplier' && item.effect.duration && item.effect.cooldown) {
        skillEffect = item.effect;
      } else if (item.effect.type === 'hybrid') {
        const found = item.effect.effects.find(e => 
          e.type === 'multiplier' && e.duration && e.cooldown
        );
        if (found) skillEffect = found;
      }
      
      if (!skillEffect) return state;
      
      const skill = state.activeSkills[action.itemId];
      
      // 检查冷却时间（使用帧数）
      if (skill && skill.cooldownRemaining > 0) {
        return state; // 还在冷却中
      }
      
      // 如果技能正在激活中，不能重复使用
      if (skill && skill.durationRemaining && skill.durationRemaining > 0) {
        return state;
      }
      
      // 激活技能
      newState = { ...state };
      newState.activeMultiplier = skillEffect.multiplier;
      newState.multiplierTimer = (skillEffect.duration || 0) * 60;
      
      newState.activeSkills[action.itemId] = {
        lastUsed: Date.now(),
        cooldownRemaining: (skillEffect.cooldown || 0) * 60, // 转换为帧数
        durationRemaining: (skillEffect.duration || 0) * 60,
      };
      
      // 更新计算缓存
      newState.totalClickPower = calculateClickPower(newState);
      newState.totalAutoProduction = calculateAutoProduction(newState);
      
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
        periodicTimers: loadedState.periodicTimers || {},
        activeSkills: loadedState.activeSkills || {},
      };
      // Recalculate
      newState.totalClickPower = calculateClickPower(newState);
      newState.totalAutoProduction = calculateAutoProduction(newState);
      break;
    }
    
    default:
      return state;
  }
  
  // Save state after each action
  saveGameState(newState);
  
  return newState;
}
