/**
 * Main entry point for 大荒斩妖录
 * Coordinates all UI components and handles screen navigation
 */

import * as GameState from './core/GameState.js';
import { pushHistory, goBack, hasHistory } from './core/GameState.js';
import { IntroScreen } from './ui/IntroScreen.js';
import { DialogView } from './ui/DialogView.js';
import { MapView } from './ui/MapView.js';
import { RegionView } from './ui/RegionView.js';
import { BattleView } from './ui/BattleView.js';
import { BladeGallery } from './ui/BladeGallery.js';
import { SettingsPanel } from './ui/SettingsPanel.js';
import { InfoPanel } from './ui/InfoPanel.js';
import { InventoryView } from './ui/InventoryView.js';

// Data storage
let bladesData = null;
let monstersData = null;
let materialsData = null;
let regionsData = null;
let recipesData = null;

// Screen instances cache
const screens = {
  intro: null,
  dialog: null,
  map: null,
  region: null,
  battle: null,
  gallery: null,
  inventory: null
};

/**
 * Load all game data
 */
async function loadData() {
  try {
    const [blades, monsters, materials, regions, recipes] = await Promise.all([
      fetch('/assets/data/blades.json').then(r => {
        if (!r.ok) throw new Error(`Failed to load blades.json: ${r.status}`);
        return r.json();
      }).catch(e => {
        console.warn('Using fallback blades data', e);
        return { blades: getDefaultBlades() };
      }),
      fetch('/assets/data/monsters.json').then(r => {
        if (!r.ok) throw new Error(`Failed to load monsters.json: ${r.status}`);
        return r.json();
      }).catch(e => {
        console.warn('Using fallback monsters data', e);
        return { monsters: getDefaultMonsters() };
      }),
      fetch('/assets/data/materials.json').then(r => {
        if (!r.ok) throw new Error(`Failed to load materials.json: ${r.status}`);
        return r.json();
      }).catch(e => {
        console.warn('Using fallback materials data', e);
        return { materials: getDefaultMaterials() };
      }),
      fetch('/assets/data/regions.json').then(r => {
        if (!r.ok) throw new Error(`Failed to load regions.json: ${r.status}`);
        return r.json();
      }).catch(e => {
        console.warn('Using fallback regions data', e);
        return { regions: getDefaultRegions() };
      }),
      fetch('/assets/data/recipes.json').then(r => {
        if (!r.ok) throw new Error(`Failed to load recipes.json: ${r.status}`);
        return r.json();
      }).catch(e => {
        console.warn('Using fallback recipes data', e);
        return { recipes: getDefaultRecipes() };
      })
    ]);

    bladesData = blades;
    monstersData = monsters;
    materialsData = materials;
    regionsData = regions;
    recipesData = recipes;

    return true;
  } catch (e) {
    console.error('Failed to load game data:', e);
    return false;
  }
}

// Fallback data in case JSON files fail to load
function getDefaultMaterials() {
  return [
    { id: 'mat-10-1', level: 10, name: '山铁碎片', description: '山铁经山野铁匠粗锻而成的碎片', image: '/assets/images/items/mat-10-1.png', type: 'drop', usedFor: ['blade-9'] },
    { id: 'mat-10-2', level: 10, name: '狌狌皮毛', description: '狌狌的皮毛，可用于制作刀柄', image: '/assets/images/items/mat-10-2.png', type: 'drop', usedFor: ['blade-9'] },
    { id: 'mat-9-1', level: 9, name: '桂木纤维', description: '桂木的纤维，用于制作刀柄', image: '/assets/images/items/mat-9-1.png', type: 'drop', usedFor: ['blade-9', 'blade-8'] },
    { id: 'mat-9-2', level: 9, name: '鹿蜀尾毛', description: '鹿蜀的尾毛，用于装饰', image: '/assets/images/items/mat-9-2.png', type: 'drop', usedFor: ['blade-8'] },
    { id: 'mat-9-3', level: 9, name: '青兕骨', description: '青兕的骨头，坚韧异常', image: '/assets/images/items/mat-9-3.png', type: 'drop', usedFor: ['blade-9'] },
    { id: 'mat-9-4', level: 9, name: '精铁', description: '精炼的铁，用于锻造刀身', image: '/assets/images/items/mat-9-4.png', type: 'drop', usedFor: ['blade-9', 'blade-8'] },
    { id: 'mat-8-1', level: 8, name: '灵犀藤种子', description: '灵犀藤的种子，蕴含灵气', image: '/assets/images/items/mat-8-1.png', type: 'drop', usedFor: ['blade-8'] },
    { id: 'mat-8-2', level: 8, name: '朏朏皮毛', description: '朏朏的皮毛，柔软坚韧', image: '/assets/images/items/mat-8-2.png', type: 'drop', usedFor: ['blade-8'] },
    { id: 'mat-8-3', level: 8, name: '蠪蚳之角', description: '蠪蚳的角，坚硬锋利', image: '/assets/images/items/mat-8-3.png', type: 'drop', usedFor: ['blade-8'] },
    { id: 'mat-8-4', level: 8, name: '赤铜矿石', description: '赤铜的原矿石', image: '/assets/images/items/mat-8-4.png', type: 'drop', usedFor: ['blade-8'] }
  ];
}

function getDefaultBlades() {
  return [
    { id: 'blade-10', level: 10, name: '山铁樵刀', description: '凡器，无灵无韵。刀形短直，木柄缠粗麻绳。', image: '/assets/images/knives/knife-10.png', attackPower: 10 },
    { id: 'blade-9', level: 9, name: '青骨短刀', description: '镶青兕之骨，具百兽之气。刀形窄细微弯，苍青色骨柄。', image: '/assets/images/knives/knife-9.png', attackPower: 20 },
    { id: 'blade-8', level: 8, name: '庖丁解牛刀', description: '缠灵犀藤，刃薄如翼。长一尺五，深褐色藤柄。', image: '/assets/images/knives/knife-8.png', attackPower: 35 }
  ];
}

function getDefaultMonsters() {
  return [
    { id: 'monster-10-1', level: 10, name: '狌狌', description: '《南山经·招摇山》：状如禺而白耳，伏行人走', image: '/assets/images/monsters/monster-10-1.png', region: 'south', hp: 100, attackPower: 5, drops: [{ materialId: 'mat-10-1', quantity: [1, 2] }, { materialId: 'mat-10-2', quantity: [1, 1] }] },
    { id: 'monster-9-1', level: 9, name: '鹿蜀', description: '《南山经·杻阳山》：状如马而白首，其文如虎而赤尾', image: '/assets/images/monsters/monster-9-1.png', region: 'south', hp: 100, attackPower: 5, drops: [{ materialId: 'mat-9-1', quantity: [1, 2] }, { materialId: 'mat-9-2', quantity: [1, 1] }] },
    { id: 'monster-9-2', level: 9, name: '青兕', description: '《南山经·祷过山》：其状如牛，苍黑，一角', image: '/assets/images/monsters/monster-9-2.png', region: 'south', hp: 100, attackPower: 5, drops: [{ materialId: 'mat-9-3', quantity: [1, 1] }, { materialId: 'mat-9-4', quantity: [1, 2] }] },
    { id: 'monster-8-1', level: 8, name: '朏朏', description: '《中山经·霍山》：其状如狸，白尾，有鬣', image: '/assets/images/monsters/monster-8-1.png', region: 'central', hp: 100, attackPower: 5, drops: [{ materialId: 'mat-8-1', quantity: [1, 2] }, { materialId: 'mat-8-2', quantity: [1, 1] }] },
    { id: 'monster-8-2', level: 8, name: '蠪蚳', description: '《中山经·昆吾山》：其状如彘而有角', image: '/assets/images/monsters/monster-8-2.png', region: 'central', hp: 100, attackPower: 5, drops: [{ materialId: 'mat-8-3', quantity: [1, 1] }, { materialId: 'mat-8-4', quantity: [1, 2] }] }
  ];
}

function getDefaultRegions() {
  return [
    { id: 'south', name: '南部区块', description: '南山经·招摇山一带，新手起步区域', image: '', levelRange: [10, 9], monsters: ['monster-10-1', 'monster-9-1', 'monster-9-2'], gatherables: [] },
    { id: 'central', name: '中部区块', description: '中山经·霍山一带，进阶区域', image: '', levelRange: [9, 8], monsters: ['monster-9-1', 'monster-9-2', 'monster-8-1', 'monster-8-2'], gatherables: [] },
    { id: 'north', name: '北部区块', description: '未探索区域', image: '', levelRange: [1, 1], monsters: [], gatherables: [] },
    { id: 'east', name: '东部区块', description: '未探索区域', image: '', levelRange: [1, 1], monsters: [], gatherables: [] },
    { id: 'west', name: '西部区块', description: '未探索区域', image: '', levelRange: [1, 1], monsters: [], gatherables: [] }
  ];
}

function getDefaultRecipes() {
  return [
    { from: 'blade-10', to: 'blade-9', materials: [{ materialId: 'mat-10-1', quantity: 2 }, { materialId: 'mat-9-3', quantity: 2 }, { materialId: 'mat-9-4', quantity: 1 }] },
    { from: 'blade-9', to: 'blade-8', materials: [{ materialId: 'mat-9-2', quantity: 2 }, { materialId: 'mat-8-1', quantity: 2 }, { materialId: 'mat-8-4', quantity: 1 }] }
  ];
}

/**
 * Get blade by ID
 */
export function getBlade(id) {
  return bladesData?.blades?.find(b => b.id === id);
}

/**
 * Get all blades
 */
export function getAllBlades() {
  return bladesData?.blades || [];
}

/**
 * Get monster by ID
 */
export function getMonster(id) {
  return monstersData?.monsters?.find(m => m.id === id);
}

/**
 * Get monsters by region
 */
export function getMonstersByRegion(regionId) {
  const region = regionsData?.regions?.find(r => r.id === regionId);
  if (!region) return [];
  return monstersData?.monsters?.filter(m => region.monsters?.includes(m.id)) || [];
}

/**
 * Get region by ID
 */
export function getRegion(id) {
  return regionsData?.regions?.find(r => r.id === id);
}

/**
 * Get all regions
 */
export function getAllRegions() {
  return regionsData?.regions || [];
}

/**
 * Get material by ID
 */
export function getMaterial(id) {
  return materialsData?.materials?.find(m => m.id === id);
}

/**
 * Get recipe for blade upgrade
 */
export function getRecipe(fromBladeId) {
  return recipesData?.recipes?.find(r => r.from === fromBladeId);
}

/**
 * Get recipe for target blade
 */
export function getRecipeTo(targetBladeId) {
  return recipesData?.recipes?.find(r => r.to === targetBladeId);
}

/**
 * Show a specific screen
 * @param {string} screenName - 目标屏幕名称
 * @param {Object} data - 传递给屏幕的数据
 * @param {boolean} skipHistory - 是否跳过历史记录（用于返回操作）
 */
export function showScreen(screenName, data = {}, skipHistory = false) {
  // 获取当前屏幕（用于记录历史）
  const currentScreen = GameState.getCurrentScreen();

  // 如果不是返回操作，且不是intro屏幕，则记录历史
  if (!skipHistory && currentScreen && currentScreen !== screenName && currentScreen !== 'intro') {
    pushHistory(currentScreen, {});
  }

  // Hide all active screens
  Object.values(screens).forEach(screen => {
    if (screen && screen.hide) screen.hide();
  });

  // Update game state
  try {
    GameState.setCurrentScreen(screenName);
  } catch (e) {
    console.warn('Failed to update screen state:', e);
  }

  // Show requested screen
  switch (screenName) {
    case 'intro':
      if (!screens.intro) {
        screens.intro = new IntroScreen('intro-screen');
      }
      screens.intro.show(() => showScreen('dialog'));
      break;

    case 'dialog':
      if (!screens.dialog) {
        screens.dialog = new DialogView('dialog-screen');
      }
      screens.dialog.show(() => showScreen('map'));
      break;

    case 'map':
      if (!screens.map) {
        screens.map = new MapView('map-screen');
      }
      screens.map.show();
      break;

    case 'region':
      if (!screens.region) {
        screens.region = new RegionView('region-screen');
      }
      screens.region.show(data.regionId);
      break;

    case 'battle':
      if (!screens.battle) {
        screens.battle = new BattleView('battle-screen');
      }
      screens.battle.show(data.monsterId, data.isRisky || false);
      break;

    case 'gallery':
      if (!screens.gallery) {
        screens.gallery = new BladeGallery('gallery-screen');
      }
      screens.gallery.show();
      break;

    case 'inventory':
      if (!screens.inventory) {
        screens.inventory = new InventoryView('inventory-screen');
      }
      screens.inventory.show();
      break;

    default:
      console.warn(`Unknown screen: ${screenName}`);
  }

  // 更新返回按钮状态
  updateBackButton();
}

/**
 * 返回到地图界面
 */
export function goBackScreen() {
  showScreen('map', {}, true);
}

/**
 * Show settings panel
 */
export function showSettings() {
  SettingsPanel.show();
}

/**
 * Show info panel
 */
export function showInfoPanel(regionId) {
  InfoPanel.show(regionId);
}

/**
 * Create global icon buttons (gallery, settings, inventory, back)
 */
function createGlobalButtons() {
  // Remove existing buttons if any
  const existingGallery = document.getElementById('gallery-button');
  const existingSettings = document.getElementById('settings-button');
  const existingInventory = document.getElementById('inventory-button');
  const existingBack = document.getElementById('global-back-button');
  if (existingGallery) existingGallery.remove();
  if (existingSettings) existingSettings.remove();
  if (existingInventory) existingInventory.remove();
  if (existingBack) existingBack.remove();

  // Back button (top left)
  const backBtn = document.createElement('button');
  backBtn.id = 'global-back-button';
  backBtn.className = 'icon-button global-back-button';
  backBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>`;
  backBtn.title = '返回';
  backBtn.setAttribute('aria-label', '返回');
  backBtn.addEventListener('click', goBackScreen);
  document.body.appendChild(backBtn);

  // Gallery button
  const galleryBtn = document.createElement('button');
  galleryBtn.id = 'gallery-button';
  galleryBtn.className = 'icon-button';
  galleryBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/></svg>`;
  galleryBtn.title = '神兵图鉴';
  galleryBtn.setAttribute('aria-label', '神兵图鉴');
  galleryBtn.addEventListener('click', () => showScreen('gallery'));
  document.body.appendChild(galleryBtn);

  // Settings button
  const settingsBtn = document.createElement('button');
  settingsBtn.id = 'settings-button';
  settingsBtn.className = 'icon-button';
  settingsBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 8a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0-2a6 6 0 0 0-6 6 6 6 0 0 0 6 6 6 6 0 0 0 6-6 6 6 0 0 0-6-6m9 5a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1m-3.36-8a1 1 0 0 1 .71.29 1 1 0 0 1 0 1.42l-1.41 1.41a8.03 8.03 0 0 1 2.18 4.07l2.15-.29a1 1 0 0 1 1.13.87 1 1 0 0 1-.87 1.13l-2.15.29c-.18.93-.5 1.82-.94 2.63l1.71 1.37a1 1 0 0 1 .17 1.4 1 1 0 0 1-1.4.17l-1.71-1.37a8.03 8.03 0 0 1-3.8 1.94l-.29 2.15a1 1 0 0 1-1.13.87 1 1 0 0 1-1.13-.87l.29-2.15a8.03 8.03 0 0 1-3.8-1.94L4.54 19.3a1 1 0 0 1-1.4-.17 1 1 0 0 1 .17-1.4l1.71-1.37a8.03 8.03 0 0 1-.94-2.63l-2.15-.29a1 1 0 0 1-.87-1.13 1 1 0 0 1 1.13-.87l2.15.29a8.03 8.03 0 0 1 2.18-4.07L5.12 5.71a1 1 0 0 1 0-1.42 1 1 0 0 1 .71-.29"/></svg>`;
  settingsBtn.title = '设置';
  settingsBtn.setAttribute('aria-label', '设置');
  settingsBtn.addEventListener('click', showSettings);
  document.body.appendChild(settingsBtn);

  // Inventory button (bottom center)
  const inventoryBtn = document.createElement('button');
  inventoryBtn.id = 'inventory-button';
  inventoryBtn.className = 'icon-button inventory-button';
  inventoryBtn.innerHTML = `<span class="inventory-icon">🎒</span>`;
  inventoryBtn.title = '背包';
  inventoryBtn.setAttribute('aria-label', '背包');
  inventoryBtn.addEventListener('click', () => showScreen('inventory'));
  document.body.appendChild(inventoryBtn);
}

/**
 * 更新返回按钮状态
 */
function updateBackButton() {
  const backBtn = document.getElementById('global-back-button');
  if (backBtn) {
    const currentScreen = GameState.getCurrentScreen();

    // 在地图上时，禁用返回按钮
    if (currentScreen === 'map') {
      backBtn.style.opacity = '0.3';
      backBtn.style.pointerEvents = 'none';
    } else {
      backBtn.style.opacity = '1';
      backBtn.style.pointerEvents = 'auto';
    }
  }
}

/**
 * Initialize the application
 */
export async function init() {
  console.log('初始化 大荒斩妖录...');

  // Load game data
  const dataLoaded = await loadData();
  if (!dataLoaded) {
    console.warn('Some game data failed to load, using fallbacks');
  }

  // Check for storage support
  if (!GameState.isStorageAvailable()) {
    console.warn('localStorage not available, game progress will not be saved');
    // Show warning to user
    const warning = document.createElement('div');
    warning.style.cssText = 'position:fixed;top:0;left:0;right:0;background:rgba(196,30,58,0.9);color:white;padding:8px;text-align:center;font-size:12px;';
    warning.textContent = '警告：浏览器不支持本地存储，游戏进度将不会保存';
    document.body.appendChild(warning);
    setTimeout(() => warning.remove(), 5000);
  }

  // Create global icon buttons
  createGlobalButtons();

  // Show initial screen
  const currentScreen = GameState.getCurrentScreen();
  if (currentScreen === 'intro') {
    showScreen('intro');
  } else {
    showScreen('map');
  }

  // 更新返回按钮初始状态
  setTimeout(() => updateBackButton(), 100);

  console.log('大荒斩妖录 初始化完成');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export GameState functions for other modules
export const getCurrentBlade = GameState.getCurrentBlade;
export const setCurrentBlade = GameState.setCurrentBlade;
export const addMaterial = GameState.addMaterial;
export const removeMaterial = GameState.removeMaterial;
export const getMaterialCount = GameState.getMaterialCount;
export const isBladeUnlocked = GameState.isBladeUnlocked;
export const unlockBlade = GameState.unlockBlade;
export const getSettings = GameState.getSettings;
export const updateSettings = GameState.updateSettings;
export const getCurrentScreen = GameState.getCurrentScreen;
export const setCurrentScreen = GameState.setCurrentScreen;
export const getCurrentRegion = GameState.getCurrentRegion;
export const setCurrentRegion = GameState.setCurrentRegion;
export const save = GameState.save;
export const load = GameState.load;
export const reset = GameState.reset;
export const isStorageAvailable = GameState.isStorageAvailable;
export const getInventory = GameState.getInventory;
export const getState = GameState.getState;
export const update = GameState.update;

// Export navigation history functions
export { pushHistory, goBack, hasHistory, clearHistory, peekHistory } from './core/GameState.js';

// Export for testing
export { GameState };
