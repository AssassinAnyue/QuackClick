import { GameState, GameAction, MultiplierEffect } from '../types';
import { SPECIAL_ITEMS, getClickerUpgradeCost, getAutoUpgradeCost, getClickerValue, getAutoValue } from '../gameData';
import { formatNumber } from '../utils';
import { useState } from 'react';

interface ItemShopProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function ItemShop({ state, dispatch }: ItemShopProps) {
  const [expandedTiers, setExpandedTiers] = useState<Set<string>>(new Set(['early']));

  const handleUpgradeClicker = () => {
    dispatch({ type: 'UPGRADE_CLICKER' });
  };

  const handleUpgradeAuto = () => {
    dispatch({ type: 'UPGRADE_AUTO' });
  };

  const handlePurchase = (itemId: number) => {
    dispatch({ type: 'PURCHASE_ITEM', itemId });
  };

  const handleUseSkill = (itemId: number) => {
    dispatch({ type: 'USE_ACTIVE_SKILL', itemId });
  };

  const currentClickerValue = getClickerValue(state.clickerLevel);
  const nextClickerValue = getClickerValue(state.clickerLevel + 1);
  const clickerCost = getClickerUpgradeCost(state.clickerLevel + 1);
  const canUpgradeClicker = state.quack >= clickerCost;
  
  const currentAutoValue = getAutoValue(state.autoLevel);
  const nextAutoValue = getAutoValue(state.autoLevel + 1);
  const autoCost = getAutoUpgradeCost(state.autoLevel + 1);
  const canUpgradeAuto = state.quack >= autoCost;

  // 检查是否是主动技能
  const isActiveSkill = (itemId: number): boolean => {
    const item = SPECIAL_ITEMS.find(i => i.id === itemId);
    if (!item) return false;
    
    if (item.effect.type === 'multiplier' && item.effect.duration && item.effect.cooldown) {
      return true;
    }
    if (item.effect.type === 'hybrid') {
      return item.effect.effects.some(e => 
        e.type === 'multiplier' && (e as MultiplierEffect).duration && (e as MultiplierEffect).cooldown
      );
    }
    return false;
  };

  // 获取技能状态
  const getSkillStatus = (itemId: number) => {
    const skill = state.activeSkills[itemId];
    if (!skill) return null;
    
    // 检查是否正在激活
    if (skill.durationRemaining && skill.durationRemaining > 0) {
      return {
        active: true,
        remaining: Math.ceil(skill.durationRemaining / 60),
        type: 'active'
      };
    }
    
    // 检查冷却时间（使用帧数）
    if (skill.cooldownRemaining > 0) {
      return {
        active: false,
        cooldownRemaining: Math.ceil(skill.cooldownRemaining / 60),
        type: 'cooldown'
      };
    }
    
    return {
      active: false,
      available: true,
      type: 'ready'
    };
  };

  // 按tier分组道具
  const itemsByTier = SPECIAL_ITEMS.reduce((acc, item) => {
    if (!acc[item.tier]) acc[item.tier] = [];
    acc[item.tier].push(item);
    return acc;
  }, {} as Record<string, typeof SPECIAL_ITEMS>);

  const tierConfig = {
    early: { name: '🟢 初期道具', color: 'green' },
    mid: { name: '🟡 中期道具', color: 'yellow' },
    late: { name: '🔴 後期道具', color: 'red' },
    endgame: { name: '⚫ 終極道具', color: 'purple' },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-fit max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-center mb-4 text-yellow-700 border-b-2 border-yellow-300 pb-2">
        道具商店
      </h2>
      
      {/* 可升级道具区域 */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3 text-orange-600">🎯 可升級道具</h3>
        
        {/* 鸭点击器 */}
        <div className="mb-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300">
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-lg">🟡 鴨點擊器</div>
            <div className="text-sm bg-yellow-200 px-2 py-1 rounded">Lv.{state.clickerLevel}</div>
          </div>
          <div className="text-base font-semibold text-gray-800 mb-1">
            當前效果：點擊 +{formatNumber(currentClickerValue)} Quack
          </div>
          <div className="text-xs text-gray-600 mb-2 flex items-center gap-1">
            <span>▼</span>
            <span>升級後：點擊 +{formatNumber(nextClickerValue)} Quack</span>
          </div>
          <button
            onClick={handleUpgradeClicker}
            disabled={!canUpgradeClicker}
            className={`
              w-full px-3 py-2 rounded-lg font-bold transition-all text-sm
              ${canUpgradeClicker
                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            🔼 {canUpgradeClicker ? `升級 ${formatNumber(clickerCost)} Quack` : `需要 ${formatNumber(clickerCost)} Quack`}
          </button>
          <div className="text-xs text-gray-500 mt-2">
            💡 提示：主動收益核心
          </div>
        </div>

        {/* 鸭自动机 */}
        <div className="mb-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300">
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-lg">⚙️ 鴨自動機</div>
            <div className="text-sm bg-blue-200 px-2 py-1 rounded">Lv.{state.autoLevel}</div>
          </div>
          <div className="text-base font-semibold text-gray-800 mb-1">
            當前效果：每秒 +{formatNumber(currentAutoValue)} Quack
          </div>
          <div className="text-xs text-gray-600 mb-2 flex items-center gap-1">
            <span>▼</span>
            <span>升級後：每秒 +{formatNumber(nextAutoValue)} Quack</span>
          </div>
          <button
            onClick={handleUpgradeAuto}
            disabled={!canUpgradeAuto}
            className={`
              w-full px-3 py-2 rounded-lg font-bold transition-all text-sm
              ${canUpgradeAuto
                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            🔼 {canUpgradeAuto ? `升級 ${formatNumber(autoCost)} Quack` : `需要 ${formatNumber(autoCost)} Quack`}
          </button>
          <div className="text-xs text-gray-500 mt-2">
            💡 提示：放置收益核心
          </div>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="mb-4 p-2 bg-gray-50 rounded-lg text-sm">
        <div className="text-gray-700 mb-1">
          <span className="font-semibold">總點擊力量:</span> {formatNumber(state.totalClickPower)} Quack/點擊
        </div>
        <div className="text-gray-700">
          <span className="font-semibold">總自動產量:</span> {formatNumber(state.totalAutoProduction)} Quack/秒
        </div>
      </div>

      {/* 特殊道具区域 */}
      <div>
        <h3 className="text-lg font-bold mb-3 text-purple-600">⭐ 特殊道具</h3>
        
        {/* 按tier显示道具 */}
        {Object.entries(itemsByTier).map(([tier, items]) => {
          const config = tierConfig[tier as keyof typeof tierConfig];
          const isExpanded = expandedTiers.has(tier);
          
          return (
            <div key={tier} className="mb-4">
              <button
                onClick={() => {
                  const newSet = new Set(expandedTiers);
                  if (isExpanded) {
                    newSet.delete(tier);
                  } else {
                    newSet.add(tier);
                  }
                  setExpandedTiers(newSet);
                }}
                className="w-full text-left mb-2 font-bold text-lg flex items-center justify-between p-2 rounded hover:bg-gray-100"
                style={{ 
                  borderLeft: `4px solid ${
                    config.color === 'green' ? '#22c55e' :
                    config.color === 'yellow' ? '#eab308' :
                    config.color === 'red' ? '#ef4444' : '#8b5cf6'
                  }`
                }}
              >
                <span>{config.name}</span>
                <span>{isExpanded ? '▼' : '▶'}</span>
              </button>
              
              {isExpanded && (
                <div className="space-y-2 ml-4">
                  {items.map(item => {
                    const isPurchased = state.purchasedItems.has(item.id);
                    const canAfford = state.quack >= item.cost;
                    const isAvailable = !isPurchased && canAfford;
                    const hasActiveSkill = isPurchased && isActiveSkill(item.id);
                    const skillStatus = hasActiveSkill ? getSkillStatus(item.id) : null;

                    return (
                      <div
                        key={item.id}
                        className={`
                          rounded-lg border-2 p-3 transition-all
                          ${isPurchased
                            ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-500'
                            : isAvailable
                            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 hover:border-yellow-500 shadow-md hover:shadow-lg'
                            : 'bg-gray-50 border-gray-200 opacity-75'
                          }
                        `}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-xl">{item.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-base">{item.name}</span>
                                {isPurchased && (
                                  <span className="text-green-600 font-bold">✓</span>
                                )}
                              </div>
                              <p className="text-xs mt-1 text-gray-600">{item.description}</p>
                            </div>
                          </div>
                          {!isPurchased && (
                            <div className={`
                              font-bold whitespace-nowrap ml-2 text-sm
                              ${canAfford ? 'text-orange-600' : 'text-gray-400'}
                            `}>
                              {formatNumber(item.cost)}
                            </div>
                          )}
                        </div>
                        
                        {/* 主动技能按钮 */}
                        {hasActiveSkill && skillStatus && (
                          <div className="mt-2">
                            {skillStatus.type === 'active' && (
                              <div className="p-2 bg-purple-100 rounded text-xs text-center">
                                ⚡ 激活中！剩餘 {skillStatus.remaining} 秒
                              </div>
                            )}
                            {skillStatus.type === 'cooldown' && (
                              <div className="p-2 bg-gray-200 rounded text-xs text-center">
                                ⏰ 冷卻中 {skillStatus.cooldownRemaining} 秒
                              </div>
                            )}
                            {skillStatus.type === 'ready' && (
                              <button
                                onClick={() => handleUseSkill(item.id)}
                                className="w-full px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-bold text-sm transition-all"
                              >
                                ⚡ 使用技能
                              </button>
                            )}
                          </div>
                        )}
                        
                        {/* 购买按钮 */}
                        {!isPurchased && (
                          <button
                            onClick={() => handlePurchase(item.id)}
                            disabled={!canAfford}
                            className={`
                              w-full mt-2 px-3 py-2 rounded-lg font-bold transition-all text-sm
                              ${canAfford
                                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              }
                            `}
                          >
                            {canAfford ? `購買 ${formatNumber(item.cost)} Quack` : `需要 ${formatNumber(item.cost)} Quack`}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 已购买道具统计 */}
      {state.purchasedItems.size > 0 && (
        <div className="mt-6 pt-4 border-t-2 border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            已購買道具: {state.purchasedItems.size}/{SPECIAL_ITEMS.length}
          </p>
        </div>
      )}
    </div>
  );
}
