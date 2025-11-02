# 🦆 鴨子點擊遊戲 - Duck Clicker

一個 Cookie Clicker 風格的放置點擊遊戲，主題為可愛的鴨子養成。

## 🎮 遊戲概述

玩家通過點擊鴨子獲得 Quack 值，購買道具提升效率，並升級鴨子階段。遊戲目標是將鴨子從鴨蛋養成至聖先鴨，同時避免鴨力值耗盡導致遊戲結束。

## 🚀 快速開始

### 安裝依賴

```bash
npm install
```

### 運行開發伺服器

```bash
npm run dev
```

遊戲將在 `http:# Cookie Clicker 鴨子遊戲 - 強化版升級系統 Prompt

## 核心可升級道具重新設計

### 🟡 鴨點擊器（主動成長核心）

**設計理念**：
- 前期平滑成長，讓新手玩家能快速感受到進步
- 後期爆發成長，點擊一次可獲得數百甚至數千 Quack
- 作為主動玩法的核心，獎勵積極點擊的玩家

**完整升級數據表**：

| 等級 | 每點擊增加 Quack | 升級成本（Quack） |
|------|-----------------|------------------|
| 1    | +1              | 10               |
| 2    | +3              | 25               |
| 3    | +6              | 60               |
| 4    | +10             | 120              |
| 5    | +15             | 200              |
| 6    | +25             | 350              |
| 7    | +40             | 600              |
| 8    | +60             | 950              |
| 9    | +90             | 1450             |
| 10   | +130            | 2200             |
| 11   | +197            | 3335             |
| 12   | +297            | 5351             |
| 13   | +447            | 8577             |
| 14   | +672            | 13738            |
| 15   | +1010           | 21996            |
| 16   | +1517           | 35208            |
| 17   | +2277           | 56347            |
| 18   | +3417           | 90170            |
| 19   | +5127           | 144287           |
| 20   | +7692           | 230874           |

**升級公式**：
```typescript
// 數值成長公式
function calculateClickerValue(level: number): number {
  if (level === 1) return 1;
  const prevValue = calculateClickerValue(level - 1);
  return Math.floor(prevValue * 1.5 + 2);
}

// 成本成長公式
function calculateClickerCost(level: number): number {
  if (level === 1) return 10;
  const prevCost = calculateClickerCost(level - 1);
  return Math.floor(prevCost * 1.6 + 15);
}
```

**實作範例**：
```typescript
interface ClickerUpgrade {
  level: number;
  clickPower: number;
  nextClickPower: number;
  upgradeCost: number;
}

class DuckClicker {
  level: number = 1;
  
  get clickPower(): number {
    return this.calculateValue(this.level);
  }
  
  get nextClickPower(): number {
    return this.calculateValue(this.level + 1);
  }
  
  get upgradeCost(): number {
    return this.calculateCost(this.level + 1);
  }
  
  private calculateValue(level: number): number {
    if (level === 1) return 1;
    let value = 1;
    for (let i = 2; i <= level; i++) {
      value = Math.floor(value * 1.5 + 2);
    }
    return value;
  }
  
  private calculateCost(level: number): number {
    if (level === 1) return 10;
    let cost = 10;
    for (let i = 2; i <= level; i++) {
      cost = Math.floor(cost * 1.6 + 15);
    }
    return cost;
  }
  
  upgrade(): boolean {
    // 在主遊戲邏輯中檢查 Quack 是否足夠
    this.level++;
    return true;
  }
}
```

---

### ⚙️ 鴨自動機（放置收益核心）

**設計理念**：
- 提供穩定的被動收入，適合放置玩法
- 後期每秒產出可達數千 Quack
- 與鴨點擊器配合：「放著也爽，點擊更爽」
- 成本較高，但長期收益巨大

**完整升級數據表**：

| 等級 | 每秒自動增加 Quack | 升級成本（Quack） |
|------|-------------------|------------------|
| 1    | +1                | 30               |
| 2    | +4                | 60               |
| 3    | +10               | 120              |
| 4    | +20               | 220              |
| 5    | +35               | 400              |
| 6    | +60               | 700              |
| 7    | +100              | 1200             |
| 8    | +160              | 2000             |
| 9    | +250              | 3200             |
| 10   | +400              | 5000             |
| 11   | +683              | 7820             |
| 12   | +1164             | 11750            |
| 13   | +1981             | 17645            |
| 14   | +3370             | 26488            |
| 15   | +5732             | 39752            |
| 16   | +9747             | 59648            |
| 17   | +16573            | 89492            |
| 18   | +28177            | 134258           |
| 19   | +47904            | 201407           |
| 20   | +81440            | 302130           |

**升級公式**：
```typescript
// 數值成長公式
function calculateAutoValue(level: number): number {
  if (level === 1) return 1;
  const prevValue = calculateAutoValue(level - 1);
  return Math.floor(prevValue * 1.7 + 3);
}

// 成本成長公式
function calculateAutoCost(level: number): number {
  if (level === 1) return 30;
  const prevCost = calculateAutoCost(level - 1);
  return Math.floor(prevCost * 1.5 + 20);
}
```

**實作範例**：
```typescript
interface AutoUpgrade {
  level: number;
  productionRate: number;
  nextProductionRate: number;
  upgradeCost: number;
}

class DuckAuto {
  level: number = 0; // 初始等級為 0（未購買）
  
  get productionRate(): number {
    if (this.level === 0) return 0;
    return this.calculateValue(this.level);
  }
  
  get nextProductionRate(): number {
    return this.calculateValue(this.level + 1);
  }
  
  get upgradeCost(): number {
    return this.calculateCost(this.level + 1);
  }
  
  private calculateValue(level: number): number {
    if (level === 1) return 1;
    let value = 1;
    for (let i = 2; i <= level; i++) {
      value = Math.floor(value * 1.7 + 3);
    }
    return value;
  }
  
  private calculateCost(level: number): number {
    if (level === 1) return 30;
    let cost = 30;
    for (let i = 2; i <= level; i++) {
      cost = Math.floor(cost * 1.5 + 20);
    }
    return cost;
  }
  
  upgrade(): boolean {
    // 在主遊戲邏輯中檢查 Quack 是否足夠
    this.level++;
    return true;
  }
}
```

---

## 整合遊戲邏輯

### 完整狀態管理
```typescript
interface GameState {
  quack: number;                    // 當前 Quack 值
  duckClicker: DuckClicker;         // 鴨點擊器實例
  duckAuto: DuckAuto;               // 鴨自動機實例
  specialItems: Set<number>;        // 已購買的特殊道具 ID
  totalClickPower: number;          // 緩存：總點擊力量
  totalAutoProduction: number;      // 緩存：總自動產量
}
```

### 點擊事件處理
```typescript
function handleDuckClick(state: GameState): number {
  // 基礎點擊力量 = 鴨點擊器等級數值
  let clickQuack = state.duckClicker.clickPower;
  
  // 加上特殊道具的點擊加成
  state.specialItems.forEach(itemId => {
    const item = getItemById(itemId);
    if (item.effect.type.includes('clickBonus')) {
      clickQuack += item.effect.clickBonus;
    }
  });
  
  // 處理機率觸發效果
  state.specialItems.forEach(itemId => {
    const item = getItemById(itemId);
    if (item.effect.type === 'clickChance') {
      if (Math.random() < item.effect.probability) {
        clickQuack += item.effect.bonus;
        showBonusPopup(item.effect.bonus); // 顯示觸發動畫
      }
    }
  });
  
  // 應用全局倍率
  let multiplier = 1;
  state.specialItems.forEach(itemId => {
    const item = getItemById(itemId);
    if (item.effect.type.includes('GlobalBoost')) {
      multiplier *= item.effect.globalMultiplier;
    }
  });
  
  const finalQuack = Math.floor(clickQuack * multiplier);
  
  // 更新 Quack 值
  state.quack += finalQuack;
  
  // 顯示獲得動畫
  showClickAnimation(finalQuack);
  
  return finalQuack;
}
```

### 自動生產系統
```typescript
function setupAutoProduction(state: GameState) {
  // 每秒執行一次
  setInterval(() => {
    let autoQuack = state.duckAuto.productionRate;
    
    // 加上特殊道具的自動產量
    state.specialItems.forEach(itemId => {
      const item = getItemById(itemId);
      if (item.effect.type.includes('autoProduction')) {
        autoQuack += item.effect.autoValue;
      }
    });
    
    // 應用自動產量倍率
    let multiplier = 1;
    state.specialItems.forEach(itemId => {
      const item = getItemById(itemId);
      if (item.effect.type.includes('AutoBoost')) {
        multiplier *= item.effect.autoMultiplier;
      }
    });
    
    const finalAutoQuack = Math.floor(autoQuack * multiplier);
    
    // 更新 Quack 值
    state.quack += finalAutoQuack;
    
    // 更新緩存
    state.totalAutoProduction = finalAutoQuack;
    
    // 可選：顯示自動收益提示
    if (finalAutoQuack > 0) {
      showAutoProductionIndicator(finalAutoQuack);
    }
  }, 1000);
}
```

### 升級處理邏輯
```typescript
function upgradeDuckClicker(state: GameState): boolean {
  const cost = state.duckClicker.upgradeCost;
  
  if (state.quack >= cost) {
    state.quack -= cost;
    state.duckClicker.upgrade();
    
    // 更新緩存
    updateTotalClickPower(state);
    
    // 播放升級動畫
    playUpgradeAnimation('clicker');
    
    // 音效
    playSound('upgrade');
    
    return true;
  }
  
  // Quack 不足提示
  showInsufficientQuackWarning(cost - state.quack);
  return false;
}

function upgradeDuckAuto(state: GameState): boolean {
  const cost = state.duckAuto.upgradeCost;
  
  if (state.quack >= cost) {
    state.quack -= cost;
    state.duckAuto.upgrade();
    
    // 更新緩存
    updateTotalAutoProduction(state);
    
    // 播放升級動畫
    playUpgradeAnimation('auto');
    
    // 音效
    playSound('upgrade');
    
    return true;
  }
  
  // Quack 不足提示
  showInsufficientQuackWarning(cost - state.quack);
  return false;
}
```

---

## UI 設計要求

### 鴨點擊器展示卡片
```
┌─────────────────────────────────┐
│ 🟡 鴨點擊器                 Lv.5 │
├─────────────────────────────────┤
│ 當前效果：點擊 +15 Quack         │
│ ▼ 升級後：點擊 +25 Quack         │
│                                 │
│ [升級] 需要 200 Quack           │
│                                 │
│ 💡 提示：主動收益核心           │
└─────────────────────────────────┘
```

**設計細節**：
- 使用黃色/金色漸層背景
- 等級徽章顯示在右上角
- 當前效果用大字體顯示
- 升級預覽用向下箭頭 ▼ 標示
- 升級按鈕在 Quack 不足時變灰並禁用
- 懸停時顯示詳細統計（總點擊次數、總獲得 Quack 等）

### 鴨自動機展示卡片
```
┌─────────────────────────────────┐
│ ⚙️ 鴨自動機                 Lv.3 │
├─────────────────────────────────┤
│ 當前效果：每秒 +10 Quack         │
│ ▼ 升級後：每秒 +20 Quack         │
│                                 │
│ [升級] 需要 220 Quack           │
│                                 │
│ 💡 提示：放置收益核心           │
│ 📊 已累積：12,450 Quack         │
└─────────────────────────────────┘
```

**設計細節**：
- 使用藍色/青色漸層背景
- 顯示「已累積 Quack」統計（該道具總產出）
- 可加入呼吸燈效果表示持續運作
- 升級按鈕樣式與鴨點擊器保持一致

### 統計面板
```
┌─────────────────────────────────┐
│ 📊 生產統計                      │
├─────────────────────────────────┤
│ 點擊力量：+25 Quack/次          │
│ 自動產量：+60 Quack/秒          │
│ 總收益：  +85 Quack/秒*         │
│                                 │
│ * 假設每秒點擊 1 次             │
└─────────────────────────────────┘
```

---

## 數值平衡設計說明

### 為什麼使用這些公式？

**鴨點擊器 (×1.5 + 2)**：
- 成長速度：中快速
- 適合主動玩法，獎勵勤奮點擊
- 每 3-4 級提升約 2.5 倍效果
- 20 級時點擊力量達到 7692，配合連點非常強大

**鴨自動機 (×1.7 + 3)**：
- 成長速度：較快速
- 放置玩法核心，長期收益巨大
- 每 3 級提升約 4-5 倍效果
- 20 級時每秒產出 81440，即使不點擊也能快速進展

**成本曲線**：
- 鴨點擊器：×1.6 + 15（較陡）
- 鴨自動機：×1.5 + 20（較緩）
- 設計意圖：讓玩家在前期需要平衡兩者投資，不會過早專精單一路線

### 遊戲階段節奏

**前期（1-5 級）**：
- 玩家主要依靠點擊
- 自動機剛開始運作
- 總產出：約 10-20 Quack/秒

**中期（6-12 級）**：
- 自動機開始發力
- 點擊仍有明顯收益
- 總產出：約 100-1000 Quack/秒

**後期（13-20 級）**：
- 自動機成為主力
- 點擊提供爆發輸出
- 總產出：約 5000-80000+ Quack/秒

---

## 性能優化建議

### 計算緩存
```typescript
// 避免重複計算，使用緩存
class UpgradeCache {
  private clickerCache: Map<number, number> = new Map();
  private autoCache: Map<number, number> = new Map();
  
  getClickerValue(level: number): number {
    if (!this.clickerCache.has(level)) {
      this.clickerCache.set(level, this.calculateClickerValue(level));
    }
    return this.clickerCache.get(level)!;
  }
  
  getAutoValue(level: number): number {
    if (!this.autoCache.has(level)) {
      this.autoCache.set(level, this.calculateAutoValue(level));
    }
    return this.autoCache.get(level)!;
  }
  
  // 預計算常用等級
  precompute(maxLevel: number = 50) {
    for (let i = 1; i <= maxLevel; i++) {
      this.getClickerValue(i);
      this.getAutoValue(i);
    }
  }
}
```

### 數值格式化
```typescript
function formatQuack(value: number): string {
  if (value < 1000) return value.toString();
  if (value < 1000000) return (value / 1000).toFixed(1) + 'K';
  if (value < 1000000000) return (value / 1000000).toFixed(1) + 'M';
  return (value / 1000000000).toFixed(1) + 'B';
}

// 範例：
// 150 → "150"
// 15420 → "15.4K"
// 7692000 → "7.7M"
```

---

## 測試數據參考

### 升級路徑模擬（平衡投資）
```
時間點    鴨點擊器    鴨自動機    總 Quack
0分鐘     Lv.1       Lv.0        0
2分鐘     Lv.2       Lv.1        50
5分鐘     Lv.3       Lv.2        200
10分鐘    Lv.5       Lv.3        800
20分鐘    Lv.7       Lv.5        5000
40分鐘    Lv.10      Lv.7        35000
60分鐘    Lv.12      Lv.9        150000
```

這樣的設計能確保玩家在 1 小時內達到中期階段，體驗到數值快速成長的樂趣！//localhost:5173` 啟動。

### 構建生產版本

```bash
npm run build
```

## 🎯 遊戲機制

### 核心數值系統

- **Quack 值**：遊戲主要貨幣，無上限，顯示在畫面最上方
- **鴨力值**：初始 0 點，每秒自動增加 1 點，達到 60 點時遊戲結束
- **點擊獲得**：基礎點擊 +1 Quack，可透過道具提升

### 鴨子階段系統

鴨子共有 5 個成長階段，每個階段需升級 5 次才能進入下一階段：

- **鴨蛋** → **黃鴨** → **白鴨** → **成年鴨** → **至聖先鴨**

升級時鴨力值會歸零，達到「至聖先鴨」階段即勝利。

### 道具商店系統

左側顯示可購買道具，每個道具僅能購買一次。道具提供各種增益效果，包括：
- 點擊增益
- 自動 Quack 生產
- 特殊效果（暴擊、連擊、雙倍等）

## 🛠️ 技術棧

- **React 18** - UI 框架
- **TypeScript** - 類型安全
- **Tailwind CSS** - 樣式設計
- **Vite** - 構建工具

## 📁 項目結構

```
src/
├── components/          # React 組件
│   ├── Header.tsx       # 頂部信息欄
│   ├── DuckArea.tsx    # 鴨子點擊區域
│   ├── ItemShop.tsx    # 道具商店
│   └── GameOverModal.tsx # 遊戲結束模態框
├── types.ts            # TypeScript 類型定義
├── gameData.ts         # 遊戲數據（升級費用、道具列表）
├── gameReducer.ts      # 遊戲狀態管理邏輯
├── utils.ts            # 工具函數（數字格式化、持久化）
├── App.tsx             # 主應用組件
├── main.tsx            # 應用入口
└── index.css           # 全局樣式
```

## 💾 數據持久化

遊戲狀態自動保存到 `localStorage`，刷新頁面後會自動恢復進度。

## 🎨 特色功能

- ✅ 完整的點擊和自動生產系統
- ✅ 20 種不同的道具效果
- ✅ 5 個鴨子成長階段
- ✅ 遊戲勝利/失敗判定
- ✅ 點擊動畫和浮動數字特效
- ✅ 響應式設計，適配不同螢幕尺寸
- ✅ 數據持久化

## 📝 開發說明

遊戲循環以 60 FPS 運行，每秒執行一次 TICK 操作來更新自動 Quack 生產和鴨力值。

狀態管理使用 `useReducer` 集中處理所有遊戲邏輯，確保狀態更新的可預測性。

## 🐛 已知問題

- 連續點擊計數器在火焰槍道具中需要改進（應在停止點擊一段時間後重置）

## 📄 許可證

MIT


