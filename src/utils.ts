export function formatNumber(num: number): string {
  if (num < 1000) return Math.floor(num).toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
  if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B';
  return (num / 1000000000000).toFixed(1) + 'T';
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
      purchasedItems: Array.from(state.purchasedItems),
    };
    localStorage.setItem('duckClickerGame', JSON.stringify(stateToSave));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}


