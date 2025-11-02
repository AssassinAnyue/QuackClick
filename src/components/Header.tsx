import { GameState } from '../types';
import { formatNumber } from '../utils';
import { UPGRADE_COSTS, getMaxDuckPower, getStageIcon, getStageDescription } from '../gameData';

interface HeaderProps {
  state: GameState;
  onUpgrade: () => void;
}

export default function Header({ state, onUpgrade }: HeaderProps) {
  const costs = UPGRADE_COSTS[state.stage];
  const isStageComplete = state.stageLevel >= costs.length;
  const canUpgrade = isStageComplete || (state.stageLevel < costs.length && state.quack >= costs[state.stageLevel]);
  const isMaxStage = state.stage === '絕對鴨';

  const maxDuckPower = getMaxDuckPower(state.stage);
  const duckPowerFloor = Math.floor(state.duckPower);
  const duckPowerPercent = (duckPowerFloor / maxDuckPower) * 100;
  const isDangerZone = duckPowerPercent >= 80;

  return (
    <div className="bg-white shadow-lg rounded-b-lg p-4 mb-4">
      <div className="container mx-auto">
        <div className="flex flex-col gap-3">
          {/* Quack Value */}
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-orange-600">
              Quack 值: <span className="text-orange-800">{formatNumber(state.quack)}</span> quack
            </div>
          </div>

          {/* Duck Stage and Upgrade */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="text-3xl md:text-4xl">{getStageIcon(state.stage)}</span>
              <div className="text-xl md:text-2xl font-semibold text-yellow-700">
                {state.stage} {state.stageLevel > 0 && `(升級 ${state.stageLevel}/5)`}
              </div>
            </div>
            {getStageDescription(state.stage) && (
              <div className="text-sm text-gray-600 italic text-center">
                "{getStageDescription(state.stage)}"
              </div>
            )}
            {!isMaxStage && (
              <button
                onClick={onUpgrade}
                disabled={!canUpgrade}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                  canUpgrade
                    ? 'bg-green-500 hover:bg-green-600 text-white transform hover:scale-105 shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isStageComplete
                  ? '進入下一階段 →'
                  : canUpgrade 
                    ? `升級 (${formatNumber(costs[state.stageLevel])} Quack)` 
                    : `需要 ${formatNumber(costs[state.stageLevel])} Quack`}
              </button>
            )}
          </div>

          {/* Duck Power Bar */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">鴨力值:</span>
              <span className={`text-sm font-bold ${isDangerZone ? 'text-red-600' : 'text-gray-700'}`}>
                {duckPowerFloor}/{maxDuckPower}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isDangerZone
                    ? 'bg-gradient-to-r from-red-500 to-red-600'
                    : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                }`}
                style={{ width: `${Math.min(duckPowerPercent, 100)}%` }}
              />
            </div>
            {isDangerZone && (
              <div className="text-red-600 text-xs mt-1 text-center font-bold animate-pulse">
                ⚠️ 警告：鴨力值即將耗盡！
              </div>
            )}
          </div>

          {/* Auto Quack Info */}
          {state.totalAutoProduction > 0 && (
            <div className="text-center text-sm text-green-600">
              每秒自動獲得: {formatNumber(state.totalAutoProduction)} Quack
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


