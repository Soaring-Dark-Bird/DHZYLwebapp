/**
 * BattleSystem - Combat mechanics
 * Handles level suppression, damage calculation, combat outcomes
 */

import { getMonster, addMaterial, getMaterial, save, getBlade, setCurrentBlade } from '../main.js';
import { getSettings } from './GameState.js';

/**
 * Calculate battle outcome based on level suppression
 * @param {number} bladeLevel - Player's blade level
 * @param {number} monsterLevel - Monster's level
 * @returns {Object} Battle outcome
 */
export function calculateOutcome(bladeLevel, monsterLevel) {
  const settings = getSettings();

  // One-hit kill mode
  if (settings.oneHitKill) {
    return { type: 'instant_kill', winner: 'player' };
  }

  // Level suppression rules
  // Note: Lower level = stronger (10 is weakest, 1 is strongest)
  if (bladeLevel < monsterLevel) {
    // Player blade is stronger (lower level) = instant kill
    return { type: 'instant_kill', winner: 'player' };
  } else if (bladeLevel === monsterLevel) {
    // Same level = enter battle
    return { type: 'battle', winner: null };
  } else if (bladeLevel === monsterLevel + 1) {
    // Blade is weaker by 1 level = risky battle (50% lose, win with 1-2% hp left)
    return { type: 'risk_battle', winner: null };
  } else {
    // Blade is too weak (difference >= 2) = cannot challenge
    return { type: 'disadvantage', winner: null };
  }
}

/**
 * Process instant kill (no battle screen)
 * @param {Object} monster - Monster data
 */
export function processInstantKill(monster) {
  if (!monster?.drops) return;

  const drops = [];

  monster.drops.forEach(drop => {
    const quantity = Math.floor(Math.random() * (drop.quantity[1] - drop.quantity[0] + 1)) + drop.quantity[0];
    if (quantity > 0) {
      addMaterial(drop.materialId, quantity);
      const material = getMaterial(drop.materialId);
      if (material) {
        drops.push(`${material.name} x${quantity}`);
      }
    }
  });

  save();

  // Show drops
  if (drops.length > 0) {
    showDropNotification('秒杀！获得: ' + drops.join(', '));
  } else {
    showDropNotification('秒杀！');
  }

  // Screen flash effect
  document.body.classList.add('screen-flash');
  setTimeout(() => document.body.classList.remove('screen-flash'), 300);
}

/**
 * Show drop notification
 */
function showDropNotification(text) {
  // Remove existing notification
  const existing = document.getElementById('material-drop');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.id = 'material-drop';
  notification.textContent = text;
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 2000);
}

/**
 * Get recipe for current blade
 */
export function getRecipeForCurrentBlade() {
  // This will be handled by UpgradeSystem
  return null;
}

export default {
  calculateOutcome,
  processInstantKill,
  getRecipeForCurrentBlade
};
