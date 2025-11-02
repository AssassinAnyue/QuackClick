import { useReducer, useEffect, useState } from 'react';
import { gameReducer, INITIAL_STATE } from './gameReducer';
import { GameState } from './types';
import { loadGameState } from './utils';
import Header from './components/Header';
import DuckArea from './components/DuckArea';
import ItemShop from './components/ItemShop';
import GameOverModal from './components/GameOverModal';

function App() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load saved game state
    const saved = loadGameState();
    if (saved) {
      dispatch({ type: 'LOAD_GAME', state: saved });
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    // Game loop: 60 FPS
    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [isLoaded]);

  const handleClick = () => {
    if (!state.gameOver && !state.gameWon) {
      dispatch({ type: 'CLICK' });
    }
  };

  const handleUpgrade = () => {
    dispatch({ type: 'UPGRADE' });
  };

  const handleReset = () => {
    if (confirm('確定要重置遊戲嗎？所有進度將被清除。')) {
      dispatch({ type: 'RESET_GAME' });
      localStorage.removeItem('duckClickerGame');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50">
      <Header state={state} onUpgrade={handleUpgrade} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ItemShop state={state} dispatch={dispatch} />
          </div>
          
          <div className="lg:col-span-3 flex items-center justify-center">
            <DuckArea 
              state={state} 
              onDuckClick={handleClick}
              clickQuackGained={state.lastClickQuack}
            />
          </div>
        </div>
      </div>

      {(state.gameOver || state.gameWon) && (
        <GameOverModal 
          state={state} 
          onReset={handleReset}
        />
      )}

      {/* Reset button */}
      <button
        onClick={handleReset}
        className="fixed bottom-4 right-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
      >
        重置遊戲
      </button>
    </div>
  );
}

export default App;

