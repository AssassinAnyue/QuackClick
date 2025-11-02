export function formatNumber(num: number): string {
  // Use locale string to format with thousand separators
  return Math.floor(num).toLocaleString('zh-TW');
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
    };
    localStorage.setItem('duckClickerGame', JSON.stringify(stateToSave));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}


