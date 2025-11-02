import { useState, useEffect, useRef } from 'react';
import { GameState } from '../types';
import { formatNumber } from '../utils';
import { STAGE_ORDER } from '../gameData';

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
  const quackAudioRef = useRef<HTMLAudioElement | null>(null);

  // 初始化音频对象
  useEffect(() => {
    quackAudioRef.current = new Audio('/SFX/Quack.wav');
    quackAudioRef.current.volume = 0.3; // 设置音量（0-1）
    quackAudioRef.current.preload = 'auto'; // 预加载音频
    
    return () => {
      if (quackAudioRef.current) {
        quackAudioRef.current.pause();
        quackAudioRef.current = null;
      }
    };
  }, []);

  // 播放音效函数
  const playQuackSound = () => {
    if (quackAudioRef.current && !state.gameOver && !state.gameWon) {
      // 重置音频到开始位置，以便可以重复播放
      quackAudioRef.current.currentTime = 0;
      quackAudioRef.current.play().catch(error => {
        // 处理自动播放策略限制（浏览器可能阻止自动播放）
        console.log('Audio play failed:', error);
      });
    }
  };

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

  const handleClick = () => {
    playQuackSound(); // 播放音效
    onDuckClick();
  };

  const handleMouseDown = () => {
    setIsClicking(true);
  };

  const handleMouseUp = () => {
    setIsClicking(false);
  };

  const handleMouseLeave = () => {
    setIsClicking(false);
  };

  // 获取鸭子图片路径
  const getDuckImage = () => {
    const stageIndex = STAGE_ORDER.indexOf(state.stage);
    // 图片编号从1开始，有12张图片
    // 如果阶段超过12，使用第12张图片（最后一幅）
    const imageNumber = Math.min(stageIndex + 1, 12);
    return `/Image/Duck/${imageNumber}.png`;
  };

  return (
    <div className="relative">
      <button
        id="duck"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        disabled={state.gameOver || state.gameWon}
        className={`
          transition-transform duration-100 select-none
          ${isClicking ? 'scale-90 rotate-12' : 'scale-100 rotate-0'}
          ${state.gameOver || state.gameWon ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
          active:scale-90
        `}
        style={{ userSelect: 'none' }}
      >
        <img
          src={getDuckImage()}
          alt={state.stage}
          className="w-48 h-48 md:w-64 md:h-64 object-contain"
          draggable={false}
          onError={(e) => {
            // 如果图片加载失败，显示默认emoji
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.textContent = '🦆';
              parent.className += ' text-8xl md:text-9xl';
            }
          }}
        />
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
          點擊獲得 Quack！
        </p>
      </div>
    </div>
  );
}

