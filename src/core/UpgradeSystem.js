/**
 * UpgradeSystem - Blade upgrade mechanics
 * Handles material checks, recipe validation, blade upgrades
 */

import { getMaterialCount, removeMaterial, getCurrentBlade, unlockBlade, setCurrentBlade } from './GameState.js';
import { getRecipe, getBlade, save } from '../main.js';

/**
 * Check if current blade can be upgraded
 * @param {string} bladeId - Current blade ID
 * @returns {boolean} True if upgradeable
 */
export function canUpgrade(bladeId) {
  const recipe = getRecipe(bladeId);
  if (!recipe) return false;

  // Check if we have all required materials
  for (const material of recipe.materials) {
    if (getMaterialCount(material.materialId) < material.quantity) {
      return false;
    }
  }

  return true;
}

/**
 * Get required materials for upgrade
 * @param {string} bladeId - Current blade ID
 * @returns {Array|null} Required materials or null if no recipe
 */
export function getRequiredMaterials(bladeId) {
  const recipe = getRecipe(bladeId);
  if (!recipe) return null;

  const materials = recipe.materials.map(m => {
    return {
      id: m.materialId,
      required: m.quantity,
      have: getMaterialCount(m.materialId)
    };
  });

  return materials;
}

/**
 * Perform blade upgrade
 * @param {string} bladeId - Current blade ID
 * @returns {Object} Upgrade result
 */
export function upgrade(bladeId) {
  const recipe = getRecipe(bladeId);
  if (!recipe) {
    return { success: false, message: '无法升级：没有升级配方' };
  }

  // Check materials
  for (const material of recipe.materials) {
    if (!removeMaterial(material.materialId, material.quantity)) {
      return { success: false, message: '材料不足' };
    }
  }

  // Unlock new blade
  unlockBlade(recipe.to);

  // Set as current blade
  const newBlade = getBlade(recipe.to);
  if (newBlade) {
    setCurrentBlade({
      id: newBlade.id,
      level: newBlade.level,
      unlocked: true
    });
  }

  save();

  return { success: true, newBladeId: recipe.to };
}

/**
 * Get recipe for current blade (wrapper for compatibility)
 */
export function getRecipeForCurrentBlade() {
  const blade = getCurrentBlade();
  return getRecipe(blade?.id);
}

export default {
  canUpgrade,
  getRequiredMaterials,
  upgrade,
  getRecipeForCurrentBlade
};
