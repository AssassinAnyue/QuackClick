import { DuckStage, Item } from './types';

export const UPGRADE_COSTS: Record<DuckStage, number[]> = {
  '鴨蛋': [15, 25, 40, 65, 100],
  '黃鴨': [150, 230, 350, 530, 800],
  '白鴨': [1200, 1800, 2700, 4000, 6000],
  '成年鴨': [9000, 13500, 20000, 30000, 45000],
  '至聖先鴨': []
};

export const STAGE_ORDER: DuckStage[] = ['鴨蛋', '黃鴨', '白鴨', '成年鴨', '至聖先鴨'];

export const ITEMS: Item[] = [
  { id: 'cookie', name: '小黃鴨餅乾', description: '點擊時 +2 Quack', cost: 15 },
  { id: 'accelerator', name: '鴨蛋加速器', description: '每秒自動增加 +1 Quack', cost: 50 },
  { id: 'feather', name: '雞毛撲打器', description: '點擊一次增加 +5 Quack', cost: 120 },
  { id: 'boost', name: '黃鴨助力', description: '每秒自動增加 +2 Quack，並提升 Quack 獲取 10%', cost: 250 },
  { id: 'energy', name: '白鴨能量棒', description: '點擊時有 20% 機率立即獲得 +10 Quack', cost: 450 },
  { id: 'rocket', name: '成年鴨火箭', description: '每秒自動增加 +5 Quack', cost: 700 },
  { id: 'spring', name: '鴨鴨超級彈簧', description: '點擊時有 15% 機率觸發連擊，每次額外 +3 Quack', cost: 1100 },
  { id: 'staff', name: '至聖鴨法杖', description: '每秒自動增加 +10 Quack，並提升點擊 Quack +1', cost: 1800 },
  { id: 'drink', name: '鴨力能量飲', description: '點擊一次增加 +10 Quack，使用後 30 秒內點擊增益翻倍', cost: 2800 },
  { id: 'blessing', name: '鴨神祝福', description: '每秒自動增加 +20 Quack', cost: 4500 },
  { id: 'golden', name: '黃金鴨蛋', description: '點擊時獲得額外 5% 當前 Quack 值', cost: 7000 },
  { id: 'magic', name: '魔法鴨羽毛', description: '每秒自動增加 +30 Quack，每 60 秒觸發一次全局 +50 Quack', cost: 10500 },
  { id: 'flame', name: '鴨鴨烈焰槍', description: '點擊增加 +20 Quack，連續點擊 10 次會觸發小型爆擊 +50', cost: 15000 },
  { id: 'chest', name: '神秘鴨寶箱', description: '每秒自動增加 +50 Quack，並有 5% 機率掉落隨機道具', cost: 22000 },
  { id: 'crown', name: '鴨之皇冠', description: '點擊增加 +30 Quack，並提升自動增益道具效果 10%', cost: 33000 },
  { id: 'wings', name: '超級鴨羽翼', description: '每秒自動增加 +80 Quack，並增加點擊暴擊率 5%', cost: 50000 },
  { id: 'godstaff', name: '鴨神之杖', description: '點擊增加 +50 Quack', cost: 75000 },
  { id: 'shield', name: '天鴨之盾', description: '每秒自動增加 +120 Quack，並減少鴨力值增加速度 5%', cost: 120000 },
  { id: 'throne', name: '鴨皇寶座', description: '點擊增加 +100 Quack，並啟動「雙倍 Quack」模式 10 秒', cost: 200000 },
  { id: 'artifact', name: '至高鴨之神器', description: '每秒自動增加 +250 Quack，並每 5 分鐘觸發全局 Quack 大爆發 +1000', cost: 350000 },
];


