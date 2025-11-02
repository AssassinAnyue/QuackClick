import { GameState, GameAction } from './types';
import { UPGRADE_COSTS, STAGE_ORDER, getMaxDuckPower } from './gameData';
import { UPGRADE_ITEMS, getItemUpgradeCost, getItemEffectValue, getItemNextEffectValue } from './upgradeItems';
import { saveGameState } from './utils';

const COMBO_TIMEOUT = 2000; // 2秒内未点击则重置连击

export const INITIAL_STATE: GameState = {
  quack: 0,
  duckPower: 0,
  stage: '鴨蛋',
  stageLevel: 0,
  
  // 可升级道具等级（所有道具初始为0）
  itemLevels: {},
  
  // 特殊道具（保留兼容）
  purchasedItems: new Set(),
  
  // 计算缓存
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
  
  // 神圣共鸣状态
  sacredResonanceActive: false,
  sacredResonanceTimer: 0,
  
  // 閃電鴨核状态
  lightningBoostActive: false,
  lightningBoostTimer: 0,
  lightningBoostMultiplier: 1,
  
  // 時空鴨儀状态
  timeFreezeActive: false,
  timeFreezeTimer: 0,
  
  // 连击系统
  comboCount: 0,
  lastClickTime: 0,
  
  // Game status
  gameOver: false,
  gameWon: false,
  lastClickQuack: 0,
};

// 计算总点击力量
function calculateClickPower(state: GameState): number {
  let baseQuack = 0; // 基础点击力量
  
  // 道具1: 鴨點擊器 - 每级+1点击，基础+2
  const clickerLevel = state.itemLevels[1] || 0;
  if (clickerLevel > 0) {
    baseQuack += getItemEffectValue(UPGRADE_ITEMS[0], clickerLevel);
  } else {
    baseQuack = 1; // 至少基础+1
  }
  
  // 应用点击倍率（道具3: 超級鴨點擊器）
  const superClickerLevel = state.itemLevels[3] || 0;
  let clickMultiplier = 1;
  if (superClickerLevel > 0) {
    clickMultiplier += getItemEffectValue(UPGRADE_ITEMS[2], superClickerLevel);
  }
  
  // 应用全局倍率加成
  let multiplier = state.activeMultiplier;
  
  // 神圣共鸣
  if (state.sacredResonanceActive) {
    multiplier *= 4; // 神圣共鸣 ×4 (+300%)
  }
  
  // 道具9: 鴨之專注 - 点击与自动生产加成
  const focusLevel = state.itemLevels[9] || 0;
  if (focusLevel > 0) {
    multiplier += getItemEffectValue(UPGRADE_ITEMS[8], focusLevel);
  }
  
  // 道具10: 鴨之祝福 - 所有获得 Quack 值倍率 (×1.1 = +0.1)
  const blessingLevel = state.itemLevels[10] || 0;
  if (blessingLevel > 0) {
    multiplier += getItemEffectValue(UPGRADE_ITEMS[9], blessingLevel);
  }
  
  // 道具19: 鴨鳴鐘 - 提升所有道具效果
  const bellLevel = state.itemLevels[19] || 0;
  if (bellLevel > 0) {
    multiplier += getItemEffectValue(UPGRADE_ITEMS[18], bellLevel);
  }
  
  // 道具20: 鴨靈核心 - 所有加成类道具效果（只影响加成系道具）
  const coreLevel = state.itemLevels[20] || 0;
  if (coreLevel > 0) {
    const coreBoost = getItemEffectValue(UPGRADE_ITEMS[19], coreLevel);
    // 只影响加成系道具（9, 10, 13, 16, 19, 20）
    const boostItems = [9, 10, 13, 16, 19, 20];
    const hasBoostItems = boostItems.some(id => (state.itemLevels[id] || 0) > 0);
    if (hasBoostItems) {
      multiplier += coreBoost;
    }
  }
  
  // 道具11: 彩羽共鳴 - 检查是否激活（10秒内产出翻倍）
  const rainbowLevel = state.itemLevels[11] || 0;
  if (rainbowLevel > 0) {
    // 检查activeSkills中是否有彩虹共鸣激活
    const rainbowSkill = state.activeSkills[11];
    if (rainbowSkill && rainbowSkill.durationRemaining && rainbowSkill.durationRemaining > 0) {
      multiplier *= 2; // 产出翻倍
    }
  }
  
  // 道具18: 鴨界之門 - 超鸭维度（所有收益×3）
  const dimensionLevel = state.itemLevels[18] || 0;
  if (dimensionLevel > 0) {
    const dimensionSkill = state.activeSkills[18];
    if (dimensionSkill && dimensionSkill.durationRemaining && dimensionSkill.durationRemaining > 0) {
      const dimensionMultiplier = getItemEffectValue(UPGRADE_ITEMS[17], dimensionLevel);
      multiplier *= dimensionMultiplier;
    }
  }
  
  return Math.floor(baseQuack * clickMultiplier * multiplier);
}

// 计算自动产量
function calculateAutoProduction(state: GameState): number {
  let baseProduction = 0;
  
  // 道具2: 鴨自動機 - 每级+1自动，基础+1
  const autoLevel = state.itemLevels[2] || 0;
  if (autoLevel > 0) {
    baseProduction += getItemEffectValue(UPGRADE_ITEMS[1], autoLevel);
  }
  
  // 应用自动倍率
  let autoMultiplier = 1;
  
  // 道具6: 鴨時間加速器 - 全自动产出速度
  const timeAcceleratorLevel = state.itemLevels[6] || 0;
  if (timeAcceleratorLevel > 0) {
    autoMultiplier += getItemEffectValue(UPGRADE_ITEMS[5], timeAcceleratorLevel);
  }
  
  // 道具7: 鴨燃引擎 - 每升级增加 +10% 自动Quack
  const engineLevel = state.itemLevels[7] || 0;
  if (engineLevel > 0) {
    autoMultiplier += getItemEffectValue(UPGRADE_ITEMS[6], engineLevel);
  }
  
  // 道具8: 閃電鴨核 - 每次点击增加自动生产暂时 +2倍
  if (state.lightningBoostActive) {
    autoMultiplier += state.lightningBoostMultiplier; // +2倍（即×3）
  }
  
  // 道具9: 鴨之專注 - 点击与自动生产加成
  const focusLevel = state.itemLevels[9] || 0;
  if (focusLevel > 0) {
    autoMultiplier += getItemEffectValue(UPGRADE_ITEMS[8], focusLevel);
  }
  
  // 道具10: 鴨之祝福
  const blessingLevel = state.itemLevels[10] || 0;
  if (blessingLevel > 0) {
    autoMultiplier += getItemEffectValue(UPGRADE_ITEMS[9], blessingLevel);
  }
  
  // 道具14: 聰鴨晶片 - 自动机效率
  const chipLevel = state.itemLevels[14] || 0;
  if (chipLevel > 0) {
    autoMultiplier += getItemEffectValue(UPGRADE_ITEMS[13], chipLevel);
  }
  
  // 全局倍率
  let multiplier = state.activeMultiplier;
  if (state.sacredResonanceActive) {
    multiplier *= 4;
  }
  
  // 加成系道具（复用之前声明的focusLevel和blessingLevel）
  const bellLevel = state.itemLevels[19] || 0;
  const coreLevel = state.itemLevels[20] || 0;
  
  // focusLevel和blessingLevel已经在上面声明过了，直接使用
  // 它们既影响autoMultiplier也影响multiplier
  if (focusLevel > 0) {
    multiplier += getItemEffectValue(UPGRADE_ITEMS[8], focusLevel);
  }
  if (blessingLevel > 0) {
    multiplier += getItemEffectValue(UPGRADE_ITEMS[9], blessingLevel);
  }
  if (bellLevel > 0) {
    multiplier += getItemEffectValue(UPGRADE_ITEMS[18], bellLevel);
  }
  if (coreLevel > 0) {
    const boostItems = [9, 10, 13, 16, 19, 20];
    const hasBoostItems = boostItems.some(id => (state.itemLevels[id] || 0) > 0);
    if (hasBoostItems) {
      multiplier += getItemEffectValue(UPGRADE_ITEMS[19], coreLevel);
    }
  }
  
  // 道具11: 彩羽共鳴
  const rainbowLevel = state.itemLevels[11] || 0;
  if (rainbowLevel > 0) {
    const rainbowSkill = state.activeSkills[11];
    if (rainbowSkill && rainbowSkill.durationRemaining && rainbowSkill.durationRemaining > 0) {
      multiplier *= 2;
    }
  }
  
  // 道具18: 鴨界之門
  const dimensionLevel = state.itemLevels[18] || 0;
  if (dimensionLevel > 0) {
    const dimensionSkill = state.activeSkills[18];
    if (dimensionSkill && dimensionSkill.durationRemaining && dimensionSkill.durationRemaining > 0) {
      const dimensionMultiplier = getItemEffectValue(UPGRADE_ITEMS[17], dimensionLevel);
      multiplier *= dimensionMultiplier;
    }
  }
  
  return Math.floor(baseProduction * autoMultiplier * multiplier);
}

// 处理连击奖励（道具4: 鴨式連擊模組）
function checkComboBonus(state: GameState): { bonus: number; triggerBouncyMode: boolean } {
  let bonus = 0;
  const comboModuleLevel = state.itemLevels[4] || 0;
  
  if (comboModuleLevel > 0 && state.comboCount >= 5) {
    const comboBonus = getItemEffectValue(UPGRADE_ITEMS[3], comboModuleLevel);
    bonus = Math.floor(state.totalClickPower * comboBonus);
  }
  
  return { bonus, triggerBouncyMode: false };
}

// 计算鸭力值增长速率
function calculateDuckPowerRate(state: GameState): number {
  let rate = 1; // 每秒增加1点
  
  // 道具17: 時空鴨儀 - 暂停鸭力值累积（需要在TICK中特殊处理）
  
  return rate;
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
      
      // 处理连击系统
      const now = Date.now();
      if (newState.lastClickTime > 0 && now - newState.lastClickTime > COMBO_TIMEOUT) {
        newState.comboCount = 1;
      } else {
        newState.comboCount++;
      }
      newState.lastClickTime = now;
      newState.consecutiveClicks = newState.comboCount;
      
      // 检查神圣共鸣触发（道具12: 鴨神之杖）
      const staffLevel = newState.itemLevels[12] || 0;
      if (staffLevel > 0) {
        const probability = 0.1; // 10%机率
        if (Math.random() < probability) {
          const baseDuration = 5; // 基础5秒
          const duration = baseDuration + getItemEffectValue(UPGRADE_ITEMS[11], staffLevel) - baseDuration;
          newState.sacredResonanceActive = true;
          newState.sacredResonanceTimer = duration * 60; // 转换为帧数
        }
      }
      
      // 检查閃電鴨核触发（道具8）- 每次点击增加自动生产暂时 +2倍
      const lightningLevel = newState.itemLevels[8] || 0;
      if (lightningLevel > 0) {
        const baseDuration = 2; // 基础2秒
        const duration = baseDuration + (getItemEffectValue(UPGRADE_ITEMS[7], lightningLevel) - baseDuration);
        const multiplier = 2; // +2倍（即×3）
        newState.lightningBoostActive = true;
        newState.lightningBoostTimer = duration * 60;
        newState.lightningBoostMultiplier = multiplier;
      }
      
      // 计算点击Quack
      let clickQuack = calculateClickPower(newState);
      
      // 检查连击奖励
      const comboResult = checkComboBonus(newState);
      clickQuack += comboResult.bonus;
      
      newState.quack += clickQuack;
      newState.lastClickQuack = clickQuack;
      
      // 更新计算缓存
      newState.totalClickPower = calculateClickPower(newState);
      
      break;
    }
    
    case 'TICK': {
      newState = { ...state };
      
      // 自动Quack生产
      const autoProduction = calculateAutoProduction(newState);
      newState.quack += autoProduction / 60; // Per frame (60fps)
      
      // 鸭力值增长（道具17: 時空鴨儀 - 暂停鸭力值累积）
      let duckPowerRate = 1;
      if (newState.timeFreezeActive) {
        duckPowerRate = 0; // 暂停增长
      }
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
      
      // 处理神圣共鸣倒计时
      if (newState.sacredResonanceTimer > 0) {
        newState.sacredResonanceTimer--;
        if (newState.sacredResonanceTimer === 0) {
          newState.sacredResonanceActive = false;
        }
      }
      
      // 处理閃電鴨核倒计时
      if (newState.lightningBoostTimer > 0) {
        newState.lightningBoostTimer--;
        if (newState.lightningBoostTimer === 0) {
          newState.lightningBoostActive = false;
          newState.lightningBoostMultiplier = 1;
        }
      }
      
      // 处理時空鴨儀倒计时
      if (newState.timeFreezeTimer > 0) {
        newState.timeFreezeTimer--;
        if (newState.timeFreezeTimer === 0) {
          newState.timeFreezeActive = false;
        }
      }
      
      // 处理周期性奖励
      // 道具13: 鴨之信仰池
      const faithPoolLevel = newState.itemLevels[13] || 0;
      if (faithPoolLevel > 0) {
        const timer = newState.periodicTimers[13] || 0;
        if (timer >= 10 * 60) {
          const faithBonus = getItemEffectValue(UPGRADE_ITEMS[12], faithPoolLevel);
          newState.quack += Math.floor(newState.quack * faithBonus);
          newState.periodicTimers = { ...newState.periodicTimers, [13]: 0 };
        } else {
          newState.periodicTimers = { ...newState.periodicTimers, [13]: timer + 1 };
        }
      }
      
      // 道具15: 鴨運轉輪
      const wheelLevel = newState.itemLevels[15] || 0;
      if (wheelLevel > 0) {
        const timer = newState.periodicTimers[15] || 0;
        if (timer >= 60 * 60) {
          const probability = 0.05 + getItemEffectValue(UPGRADE_ITEMS[14], wheelLevel);
          if (Math.random() < probability) {
            // 触发黄金鸭雨（10秒×2倍）
            newState.activeMultiplier *= 2;
            newState.multiplierTimer = 10 * 60;
          }
          newState.periodicTimers = { ...newState.periodicTimers, [15]: 0 };
        } else {
          newState.periodicTimers = { ...newState.periodicTimers, [15]: timer + 1 };
        }
      }
      
      // 道具11: 彩羽共鳴 - 处理CD（需要在点击时或主动技能系统中处理）
      
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
        
        // 应用升级折扣（道具16: 鴨學研究所）
        const researchLevel = state.itemLevels[16] || 0;
        if (researchLevel > 0) {
          const discount = getItemEffectValue(UPGRADE_ITEMS[15], researchLevel);
          cost = Math.floor(cost * (1 - discount));
        }
        
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
    
    case 'UPGRADE_ITEM': {
      const item = UPGRADE_ITEMS.find(i => i.id === action.itemId);
      if (!item) return state;
      
      const currentLevel = state.itemLevels[action.itemId] || 0;
      if (currentLevel >= item.maxLevel) return state;
      
      let cost = getItemUpgradeCost(item, currentLevel);
      
      // 应用升级折扣（道具16: 鴨學研究所）
      const researchLevel = state.itemLevels[16] || 0;
      if (researchLevel > 0) {
        const discount = getItemEffectValue(UPGRADE_ITEMS[15], researchLevel);
        cost = Math.floor(cost * (1 - discount));
      }
      
      if (state.quack >= cost) {
        newState = {
          ...state,
          quack: state.quack - cost,
          itemLevels: {
            ...state.itemLevels,
            [action.itemId]: currentLevel + 1
          }
        };
        
        // 如果购买主动技能道具，初始化技能状态
        if (action.itemId === 11 || action.itemId === 17 || action.itemId === 18) {
          if (!newState.activeSkills[action.itemId]) {
            newState.activeSkills[action.itemId] = {
              lastUsed: 0,
              cooldownRemaining: 0,
            };
          }
        }
        
        // 更新计算缓存
        newState.totalClickPower = calculateClickPower(newState);
        newState.totalAutoProduction = calculateAutoProduction(newState);
      } else {
        return state;
      }
      break;
    }
    
    case 'USE_ACTIVE_SKILL': {
      const item = UPGRADE_ITEMS.find(i => i.id === action.itemId);
      if (!item || (state.itemLevels[action.itemId] || 0) === 0) {
        return state;
      }
      
      const level = state.itemLevels[action.itemId] || 0;
      const skill = state.activeSkills[action.itemId];
      const now = Date.now();
      
      // 道具11: 彩羽共鳴 - 10秒内产出翻倍，CD 60秒
      if (action.itemId === 11) {
        const baseCD = 60;
        const currentCDValue = getItemEffectValue(UPGRADE_ITEMS[10], level); // 这个值是60, 57, 54...
        const cdReduction = baseCD - currentCDValue; // 计算减少了多少秒
        const cooldown = Math.max(currentCDValue, 10); // 最少10秒CD
        const duration = 10; // 10秒持续
        
        if (skill) {
          const timeSinceLastUse = skill.lastUsed > 0 ? (now - skill.lastUsed) / 1000 : Infinity;
          if (timeSinceLastUse < cooldown) {
            return state; // 还在冷却中
          }
        }
        
        newState = { ...state };
        newState.activeMultiplier *= 2;
        newState.multiplierTimer = duration * 60;
        
        if (!newState.activeSkills[action.itemId]) {
          newState.activeSkills[action.itemId] = {
            lastUsed: now,
            cooldownRemaining: cooldown * 60,
            durationRemaining: duration * 60,
          };
        } else {
          newState.activeSkills[action.itemId] = {
            ...newState.activeSkills[action.itemId],
            lastUsed: now,
            cooldownRemaining: cooldown * 60,
            durationRemaining: duration * 60,
          };
        }
        
        newState.totalClickPower = calculateClickPower(newState);
        newState.totalAutoProduction = calculateAutoProduction(newState);
      }
      
      // 道具17: 時空鴨儀 - 暂停鸭力值累积
      if (action.itemId === 17) {
        const duration = getItemEffectValue(UPGRADE_ITEMS[16], level);
        const cooldown = 300; // 假设5分钟CD
        
        if (skill && skill.durationRemaining && skill.durationRemaining > 0) {
          return state; // 正在激活中
        }
        
        if (skill) {
          const timeSinceLastUse = skill.lastUsed > 0 ? (now - skill.lastUsed) / 1000 : Infinity;
          if (timeSinceLastUse < cooldown) {
            return state; // 还在冷却中
          }
        }
        
        newState = { ...state };
        newState.timeFreezeActive = true;
        newState.timeFreezeTimer = duration * 60;
        
        if (!newState.activeSkills[action.itemId]) {
          newState.activeSkills[action.itemId] = {
            lastUsed: now,
            cooldownRemaining: cooldown * 60,
            durationRemaining: duration * 60,
          };
        } else {
          newState.activeSkills[action.itemId] = {
            ...newState.activeSkills[action.itemId],
            lastUsed: now,
            cooldownRemaining: cooldown * 60,
            durationRemaining: duration * 60,
          };
        }
        
        newState.totalClickPower = calculateClickPower(newState);
        newState.totalAutoProduction = calculateAutoProduction(newState);
      }
      
      // 道具18: 鴨界之門 - 进入超鸭维度，暂时所有收益×3
      if (action.itemId === 18) {
        const multiplier = getItemEffectValue(UPGRADE_ITEMS[17], level);
        const duration = 30; // 假设30秒持续
        const cooldown = 120; // 假设120秒CD
        
        if (skill && skill.durationRemaining && skill.durationRemaining > 0) {
          return state; // 正在激活中
        }
        
        if (skill) {
          const timeSinceLastUse = skill.lastUsed > 0 ? (now - skill.lastUsed) / 1000 : Infinity;
          if (timeSinceLastUse < cooldown) {
            return state; // 还在冷却中
          }
        }
        
        newState = { ...state };
        newState.activeMultiplier *= multiplier;
        newState.multiplierTimer = duration * 60;
        
        if (!newState.activeSkills[action.itemId]) {
          newState.activeSkills[action.itemId] = {
            lastUsed: now,
            cooldownRemaining: cooldown * 60,
            durationRemaining: duration * 60,
          };
        } else {
          newState.activeSkills[action.itemId] = {
            ...newState.activeSkills[action.itemId],
            lastUsed: now,
            cooldownRemaining: cooldown * 60,
            durationRemaining: duration * 60,
          };
        }
        
        newState.totalClickPower = calculateClickPower(newState);
        newState.totalAutoProduction = calculateAutoProduction(newState);
      }
      
      // 道具17: 時空鴨儀 - 暂停鸭力值累积
      if (action.itemId === 17) {
        const duration = getItemEffectValue(UPGRADE_ITEMS[16], level);
        const cooldown = 300; // 假设5分钟CD
        
        if (skill && skill.durationRemaining && skill.durationRemaining > 0) {
          return state; // 正在激活中
        }
        
        if (skill) {
          const timeSinceLastUse = skill.lastUsed > 0 ? (now - skill.lastUsed) / 1000 : Infinity;
          if (timeSinceLastUse < cooldown) {
            return state; // 还在冷却中
          }
        }
        
        newState = { ...state };
        newState.timeFreezeActive = true;
        newState.timeFreezeTimer = duration * 60;
        
        if (!newState.activeSkills[action.itemId]) {
          newState.activeSkills[action.itemId] = {
            lastUsed: now,
            cooldownRemaining: cooldown * 60,
            durationRemaining: duration * 60,
          };
        } else {
          newState.activeSkills[action.itemId] = {
            ...newState.activeSkills[action.itemId],
            lastUsed: now,
            cooldownRemaining: cooldown * 60,
            durationRemaining: duration * 60,
          };
        }
        
        newState.totalClickPower = calculateClickPower(newState);
        newState.totalAutoProduction = calculateAutoProduction(newState);
      }
      
      break;
    }
    
    case 'RESET_GAME': {
      newState = { ...INITIAL_STATE };
      break;
    }
    
    case 'LOAD_GAME': {
      const loadedState = action.state;
      newState = {
        ...loadedState,
        purchasedItems: new Set(loadedState.purchasedItems || []),
        periodicTimers: loadedState.periodicTimers || {},
        activeSkills: loadedState.activeSkills || {},
        itemLevels: loadedState.itemLevels || {},
      };
      // Recalculate
      newState.totalClickPower = calculateClickPower(newState);
      newState.totalAutoProduction = calculateAutoProduction(newState);
      break;
    }
    
    default:
      return state;
  }
  
  // Auto-save game state
  if (action.type !== 'LOAD_GAME' && action.type !== 'RESET_GAME') {
    saveGameState(newState);
  }
  
  return newState;
}
