import { useState, useEffect, useRef } from 'react';
import { GameState } from '../types';
import { formatNumber } from '../utils';

interface DuckAreaProps {
  state: GameState;
  onDuckClick: () => void;
  clickQuackGained?: number;
}

interface FloatingNumber {
  id: number;
  value: number;
  x: number;
  y: number;
}

export default function DuckArea({ state, onDuckClick, clickQuackGained = 0 }: DuckAreaProps) {
  const [isClicking, setIsClicking] = useState(false);
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const floatingIdRef = useRef(0);
  const lastClickQuackRef = useRef(0);

  useEffect(() => {
    if (clickQuackGained > 0 && clickQuackGained !== lastClickQuackRef.current) {
      const duckElement = document.getElementById('duck');
      if (duckElement) {
        const rect = duckElement.getBoundingClientRect();
        setFloatingNumbers(prev => [...prev, {
          id: floatingIdRef.current++,
          value: clickQuackGained,
          x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 80,
          y: rect.top + rect.height / 2 + (Math.random() - 0.5) * 80,
        }]);
      }
      lastClickQuackRef.current = clickQuackGained;
    }
  }, [clickQuackGained]);

  useEffect(() => {
    const timers = floatingNumbers.map(num => {
      return setTimeout(() => {
        setFloatingNumbers(prev => prev.filter(n => n.id !== num.id));
      }, 1000);
    });
    return () => timers.forEach(clearTimeout);
  }, [floatingNumbers]);

  const handleMouseDown = () => {
    setIsClicking(true);
    onDuckClick();
  };

  const handleMouseUp = () => {
    setIsClicking(false);
  };

  const handleMouseLeave = () => {
    setIsClicking(false);
  };

  const getDuckEmoji = () => {
    switch (state.stage) {
      case '鴨蛋': return '🥚';
      case '黃鴨': return '🐥';
      case '白鴨': return '🦆';
      case '成年鴨': return '🦆';
      case '至聖先鴨': return '✨';
      case '天啟鴨': return '⚡';
      case '星界鴨': return '🌟';
      case '混沌鴨': return '🌀';
      case '永恆鴨': return '⏳';
      case '超鴨神體': return '💎';
      case '鴨界意志': return '🌌';
      case '原初之鴨': return '🔮';
      case '鴨神皇': return '👑';
      case '多元鴨體': return '🌐';
      case '絕對鴨': return '∞';
      default: return '🦆';
    }
  };

  return (
    <div className="relative">
      <button
        id="duck"
        onClick={onDuckClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        disabled={state.gameOver || state.gameWon}
        className={`
          text-8xl md:text-9xl transition-transform duration-100 select-none
          ${isClicking ? 'scale-90 rotate-12' : 'scale-100 rotate-0'}
          ${state.gameOver || state.gameWon ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
          active:scale-90
        `}
        style={{ userSelect: 'none' }}
      >
        {getDuckEmoji()}
      </button>

      {/* Floating numbers */}
      {floatingNumbers.map(num => (
        <div
          key={num.id}
          className="absolute pointer-events-none text-2xl font-bold text-green-600 animate-float"
          style={{
            left: `${num.x}px`,
            top: `${num.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          +{formatNumber(num.value)}
        </div>
      ))}

      {/* Stage indicator */}
      <div className="mt-4 text-center">
        <p className="text-xl font-semibold text-gray-700">
          點擊{getDuckEmoji()}獲得 Quack！
        </p>
      </div>
    </div>
  );
}

