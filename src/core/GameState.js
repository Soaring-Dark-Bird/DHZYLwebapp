/**
 * GameState - Game state management module
 * Handles all game state with localStorage persistence
 */

const SAVE_KEY = 'dahuang-save';
const VERSION = '1.0.0';

// Default game state
const defaultState = {
  currentBlade: {
    id: 'blade-10',
    level: 10,
    name: '山铁樵刀',
    description: '凡器，无灵无韵。刀形短直，木柄缠粗麻绳。',
    image: '/assets/images/knives/knife-10.png',
    unlocked: true
  },
  inventory: {},
  unlockedBlades: ['blade-10'],
  settings: {
    sound: true,
    volume: 50,
    screenShake: true,
    oneHitKill: false
  },
  currentScreen: 'intro',
  currentRegion: null,
  version: VERSION,
  lastSaved: Date.now()
};

// 导航历史（不保存到localStorage，每次重新开始时清空）
const navHistory = [];
const maxHistoryLength = 20;

// Private state storage
let state = { ...defaultState };

/**
 * Get the current game state
 * @returns {Object} The current state
 */
export function getState() {
  return { ...state };
}

/**
 * Update the game state with partial changes
 * @param {Object} updates - Partial state updates
 */
export function update(updates) {
  state = { ...state, ...updates };
}

/**
 * Get current blade
 * @returns {Object} Current blade info
 */
export function getCurrentBlade() {
  return { ...state.currentBlade };
}

/**
 * Set current blade
 * @param {Object} blade - Blade info
 */
export function setCurrentBlade(blade) {
  state.currentBlade = { ...blade };
}

/**
 * Get inventory
 * @returns {Object} Inventory with material counts
 */
export function getInventory() {
  return { ...state.inventory };
}

/**
 * Add materials to inventory
 * @param {string} materialId - Material ID
 * @param {number} quantity - Quantity to add
 */
export function addMaterial(materialId, quantity = 1) {
  if (!state.inventory[materialId]) {
    state.inventory[materialId] = 0;
  }
  state.inventory[materialId] += quantity;
}

/**
 * Remove materials from inventory
 * @param {string} materialId - Material ID
 * @param {number} quantity - Quantity to remove
 * @returns {boolean} True if had enough materials
 */
export function removeMaterial(materialId, quantity = 1) {
  if (!state.inventory[materialId] || state.inventory[materialId] < quantity) {
    return false;
  }
  state.inventory[materialId] -= quantity;
  if (state.inventory[materialId] <= 0) {
    delete state.inventory[materialId];
  }
  return true;
}

/**
 * Get material count
 * @param {string} materialId - Material ID
 * @returns {number} Material count
 */
export function getMaterialCount(materialId) {
  return state.inventory[materialId] || 0;
}

/**
 * Check if blade is unlocked
 * @param {string} bladeId - Blade ID
 * @returns {boolean} True if unlocked
 */
export function isBladeUnlocked(bladeId) {
  return state.unlockedBlades.includes(bladeId);
}

/**
 * Unlock a blade
 * @param {string} bladeId - Blade ID to unlock
 */
export function unlockBlade(bladeId) {
  if (!state.unlockedBlades.includes(bladeId)) {
    state.unlockedBlades.push(bladeId);
  }
}

/**
 * Get settings
 * @returns {Object} Settings
 */
export function getSettings() {
  return { ...state.settings };
}

/**
 * Update settings
 * @param {Object} newSettings - Partial settings updates
 */
export function updateSettings(newSettings) {
  state.settings = { ...state.settings, ...newSettings };
}

/**
 * Get current screen
 * @returns {string} Current screen name
 */
export function getCurrentScreen() {
  return state.currentScreen;
}

/**
 * Set current screen
 * @param {string} screen - Screen name
 */
export function setCurrentScreen(screen) {
  state.currentScreen = screen;
}

/**
 * Get current region
 * @returns {string|null} Current region ID
 */
export function getCurrentRegion() {
  return state.currentRegion;
}

/**
 * Set current region
 * @param {string|null} region - Region ID
 */
export function setCurrentRegion(region) {
  state.currentRegion = region;
}

/**
 * Save game state to localStorage
 */
export function save() {
  state.lastSaved = Date.now();
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save game state:', e);
  }
}

/**
 * Load game state from localStorage
 * @returns {Object|null} Loaded state or null if no save
 */
export function load() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with default to handle version upgrades
      state = {
        ...defaultState,
        ...parsed,
        settings: { ...defaultState.settings, ...parsed.settings }
      };
      return { ...state };
    }
  } catch (e) {
    console.warn('Failed to load game state:', e);
  }
  return null;
}

/**
 * Reset game state to default
 */
export function reset() {
  state = { ...defaultState };
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (e) {
    console.warn('Failed to clear save:', e);
  }
}

/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage works
 */
export function isStorageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// Initialize by trying to load saved state
if (isStorageAvailable()) {
  load();
}

/* ========================================
   导航历史管理 / Navigation History
   ======================================== */

/**
 * 推入导航历史
 * @param {string} screen - 屏幕名称
 * @param {Object} data - 屏幕数据
 */
export function pushHistory(screen, data = {}) {
  navHistory.push({ screen, data });
  // 限制历史记录长度
  if (navHistory.length > maxHistoryLength) {
    navHistory.shift();
  }
}

/**
 * 返回上一个屏幕
 * @returns {Object|null} 上一个屏幕信息 {screen, data} 或 null
 */
export function goBack() {
  if (navHistory.length === 0) {
    return null;
  }
  return navHistory.pop();
}

/**
 * 获取上一个屏幕（不移除）
 * @returns {Object|null} 上一个屏幕信息或 null
 */
export function peekHistory() {
  if (navHistory.length === 0) {
    return null;
  }
  return navHistory[navHistory.length - 1];
}

/**
 * 清空导航历史
 */
export function clearHistory() {
  navHistory.length = 0;
}

/**
 * 检查是否有历史记录
 * @returns {boolean}
 */
export function hasHistory() {
  return navHistory.length > 0;
}
