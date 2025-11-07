export function formatNumber(num: number): string {
  // Use locale string to format with thousand separators
  return Math.floor(num).toLocaleString('zh-TW');
}

// 获取正确的图片路径（支持相对路径和绝对路径）
export function getImagePath(path: string): string {
  // 如果路径已经是相对路径，直接返回
  if (path.startsWith('./') || path.startsWith('../')) {
    return path;
  }
  // 如果是绝对路径，转换为相对路径（因为 base 设置为 './'）
  if (path.startsWith('/')) {
    return path.slice(1); // 移除前导斜杠，使其成为相对路径
  }
  return path;
}

export function loadGameState(): any | null {
  try {
    const saved = localStorage.getItem('duckClickerGame');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function saveGameState(state: any): void {
  try {
    // Convert Set to Array for JSON storage
    const stateToSave = {
      ...state,
      purchasedItems: Array.from(state.purchasedItems || []),
      periodicTimers: state.periodicTimers || {},
      activeSkills: state.activeSkills || {},
      itemLevels: state.itemLevels || {},
    };
    localStorage.setItem('duckClickerGame', JSON.stringify(stateToSave));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}


