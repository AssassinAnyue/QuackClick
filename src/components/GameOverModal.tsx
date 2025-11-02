import { GameState } from '../types';

interface GameOverModalProps {
  state: GameState;
  onReset: () => void;
}

export default function GameOverModal({ state, onReset }: GameOverModalProps) {
  if (state.gameWon) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl animate-bounce">
          <div className="text-6xl mb-4">🎉👑🎉</div>
          <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            至聖先鴨誕生！
          </h2>
          <p className="text-xl text-white mb-6">
            恭喜你成功將鴨子培養成至聖先鴨！
          </p>
          <button
            onClick={onReset}
            className="px-6 py-3 bg-white text-orange-600 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
          >
            重新開始
          </button>
        </div>
      </div>
    );
  }

  if (state.gameOver) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl">
          <div className="text-6xl mb-4">💀</div>
          <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            鴨力耗盡
          </h2>
          <p className="text-xl text-white mb-6">
            鴨力值達到上限，遊戲結束...
          </p>
          <button
            onClick={onReset}
            className="px-6 py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
          >
            重新開始
          </button>
        </div>
      </div>
    );
  }

  return null;
}


