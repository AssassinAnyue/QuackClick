import { GameState, GameAction } from '../types';
import { formatNumber } from '../utils';
import { UPGRADE_ITEMS, getItemUpgradeCost, getItemEffectValue, getItemNextEffectValue } from '../upgradeItems';
import { STAGE_ORDER } from '../gameData';

interface ItemShopProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function ItemShop({ state, dispatch }: ItemShopProps) {
  const handleUpgrade = (itemId: number) => {
    dispatch({ type: 'UPGRADE_ITEM', itemId });
  };

  // 按类型分组道具
  const itemsByType = {
    click: UPGRADE_ITEMS.filter(item => item.type === 'click'),
    auto: UPGRADE_ITEMS.filter(item => item.type === 'auto'),
    boost: UPGRADE_ITEMS.filter(item => item.type === 'boost'),
    special: UPGRADE_ITEMS.filter(item => item.type === 'special'),
  };

  const typeLabels = {
    click: '🖱️ 點擊系',
    auto: '⚙️ 自動系',
    boost: '📈 加成系',
    special: '✨ 特殊系',
  };

  const handleUseSkill = (itemId: number) => {
    dispatch({ type: 'USE_ACTIVE_SKILL', itemId });
  };

  // 检查是否是主动技能道具
  const isActiveSkill = (itemId: number): boolean => {
    return itemId === 11 || itemId === 17 || itemId === 18; // 彩羽共鳴、時空鴨儀、鴨界之門
  };

  // 获取技能状态
  const getSkillStatus = (itemId: number) => {
    const skill = state.activeSkills[itemId];
    if (!skill) return null;
    
    if (skill.durationRemaining && skill.durationRemaining > 0) {
      return {
        active: true,
        remaining: Math.ceil(skill.durationRemaining / 60),
        type: 'active'
      };
    }
    
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

  const renderItem = (item: typeof UPGRADE_ITEMS[0]) => {
    const currentLevel = state.itemLevels[item.id] || 0;
    const canUpgrade = currentLevel < item.maxLevel;
    
    // 检查道具是否解锁
    const currentStageIndex = STAGE_ORDER.indexOf(state.stage);
    const unlockStageIndex = STAGE_ORDER.indexOf(item.unlockStage);
    const isUnlocked = currentStageIndex >= unlockStageIndex;
    
    // 计算升级成本（考虑折扣）
    let upgradeCost = canUpgrade ? getItemUpgradeCost(item, currentLevel) : 0;
    const researchLevel = state.itemLevels[16] || 0;
    if (researchLevel > 0 && canUpgrade) {
      const discount = getItemEffectValue(UPGRADE_ITEMS[15], researchLevel);
      upgradeCost = Math.floor(upgradeCost * (1 - discount));
    }
    
    const canAfford = state.quack >= upgradeCost;
    const currentEffect = currentLevel > 0 ? getItemEffectValue(item, currentLevel) : 0;
    const nextEffect = canUpgrade ? getItemNextEffectValue(item, currentLevel) : currentEffect;

    // 格式化效果显示
    const formatEffect = (value: number, effectType: string): string => {
      if (effectType.includes('Multiplier') || effectType.includes('Speed') || effectType.includes('Bonus') || effectType.includes('Efficiency') || effectType.includes('Reduction')) {
        return `${(value * 100).toFixed(1)}%`;
      }
      if (effectType === 'clickBonus' || effectType === 'autoProduction') {
        return `+${formatNumber(value)}`;
      }
      if (effectType.includes('Duration') || effectType.includes('CD') || effectType.includes('秒')) {
        return `${formatNumber(value)}秒`;
      }
      if (effectType === 'rainbowResonance') {
        // 彩羽共鳴：显示CD减少
        return `CD: ${formatNumber(value)}秒`;
      }
      if (effectType === 'sacredResonance') {
        return `${formatNumber(value)}秒`;
      }
      return formatNumber(value);
    };

    const hasActiveSkill = isActiveSkill(item.id) && currentLevel > 0;
    const skillStatus = hasActiveSkill ? getSkillStatus(item.id) : null;

    // 如果未解锁，返回锁定状态
    if (!isUnlocked) {
      return (
        <div
          key={item.id}
          className="rounded-lg border-2 border-gray-300 bg-gray-50 p-4 opacity-50 relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl grayscale">{item.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-gray-500">{item.name}</span>
              </div>
              <p className="text-xs mt-1 text-gray-500 line-through">{item.description}</p>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <span className="text-sm font-bold text-white">🔒 需要 {item.unlockStage} 階段</span>
          </div>
        </div>
      );
    }

    return (
      <div
        key={item.id}
        className={`
          rounded-lg border-2 p-4 transition-all mb-3
          ${canAfford && canUpgrade && isUnlocked
            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 hover:border-yellow-500 shadow-md hover:shadow-lg'
            : 'bg-gray-50 border-gray-200 opacity-75'
          }
        `}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-2xl">{item.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base">{item.name}</span>
                <span className="text-xs bg-blue-200 px-2 py-1 rounded">
                  Lv.{currentLevel}/{item.maxLevel}
                </span>
              </div>
              <p className="text-xs mt-1 text-gray-600">{item.description}</p>
            </div>
          </div>
        </div>

        {currentLevel > 0 && (
          <div className="mb-2 text-sm">
            <div className="text-gray-700 font-semibold">
              當前效果: {formatEffect(currentEffect, item.effectType)}
            </div>
            {canUpgrade && (
              <div className="text-xs text-gray-600 flex items-center gap-1">
                <span>▼</span>
                <span>升級後: {formatEffect(nextEffect, item.effectType)}</span>
              </div>
            )}
          </div>
        )}

        {!canUpgrade && currentLevel === 0 && (
          <div className="mb-2 text-sm text-gray-700 font-semibold">
            購買後效果: {formatEffect(nextEffect, item.effectType)}
          </div>
        )}

        {canUpgrade && isUnlocked && (
          <button
            onClick={() => handleUpgrade(item.id)}
            disabled={!canAfford}
            className={`
              w-full px-4 py-2 rounded-lg font-bold transition-all text-sm
              ${canAfford
                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {currentLevel === 0 ? '購買' : '升級'} {canAfford ? `${formatNumber(upgradeCost)} Quack` : `需要 ${formatNumber(upgradeCost)} Quack`}
          </button>
        )}

        {!canUpgrade && currentLevel > 0 && (
          <div className="w-full px-4 py-2 bg-gray-200 rounded-lg text-center text-sm text-gray-600">
            已達最高等級
          </div>
        )}

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
                className="w-full px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-bold text-sm transition-all mt-2"
              >
                ⚡ 使用技能
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-fit max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-center mb-4 text-yellow-700 border-b-2 border-yellow-300 pb-2">
        道具商店
      </h2>

      {/* 统计信息 */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
        <div className="text-gray-700 mb-1">
          <span className="font-semibold">總點擊力量:</span> {formatNumber(state.totalClickPower)} Quack/點擊
        </div>
        <div className="text-gray-700">
          <span className="font-semibold">總自動產量:</span> {formatNumber(state.totalAutoProduction)} Quack/秒
        </div>
      </div>

      {/* 按类型显示道具 */}
      {(Object.keys(itemsByType) as Array<keyof typeof itemsByType>).map(type => (
        <div key={type} className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-purple-600">{typeLabels[type]}</h3>
          <div className="space-y-2">
            {itemsByType[type].map(renderItem)}
          </div>
        </div>
      ))}
    </div>
  );
}
