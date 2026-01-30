/**
 * BladeGallery - Blade collection gallery with all 10 blades
 * Shows all blades, upgrade section for next level only
 */

import {
  getAllBlades,
  showScreen,
  isBladeUnlocked,
  getCurrentBlade,
  getRecipe,
  getMaterial,
  getMaterialCount,
  removeMaterial,
  save,
  setCurrentBlade,
  unlockBlade
} from '../main.js';

export class BladeGallery {
  constructor(containerId = 'gallery-screen') {
    this.containerId = containerId;
    this.element = null;
  }

  /**
   * Show the gallery
   */
  show() {
    this.render();
  }

  /**
   * Hide the gallery
   */
  hide() {
    if (this.element) {
      this.element.classList.remove('active');
    }
  }

  /**
   * Render the gallery
   */
  render() {
    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = this.containerId;
      container.className = 'screen';
      document.getElementById('app').appendChild(container);
    }

    const blades = getAllBlades();
    const currentBlade = getCurrentBlade();

    // Find next blade (lower level = stronger)
    const nextBlade = blades
      .filter(b => b.level < currentBlade.level)
      .sort((a, b) => b.level - a.level)[0];

    const recipe = nextBlade ? getRecipe(currentBlade.id) : null;

    // Check if can upgrade
    let canUpgrade = false;
    let materialsProgress = [];

    if (recipe) {
      canUpgrade = true;
      for (let mat of recipe.materials) {
        const currentCount = getMaterialCount(mat.materialId);
        const material = getMaterial(mat.materialId);
        const hasEnough = currentCount >= mat.quantity;
        if (!hasEnough) canUpgrade = false;

        materialsProgress.push({
          materialId: mat.materialId,
          name: material?.name || mat.materialId,
          current: currentCount,
          required: mat.quantity,
          hasEnough: hasEnough
        });
      }
    }

    container.innerHTML = `
      <button id="gallery-back-button" class="icon-button" style="top: 16px; left: 16px;" title="返回">
        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <div id="gallery-view">
        <h2 id="gallery-title">神兵图鉴</h2>
        <div id="gallery-content">
          <!-- All 10 blades grid -->
          <div class="all-blades-grid">
            ${blades.map(blade => this.renderBladeCard(blade, currentBlade)).join('')}
          </div>
          ${nextBlade ? this.renderUpgradeSection(nextBlade, materialsProgress, canUpgrade, recipe) : ''}
        </div>
      </div>
    `;

    this.element = container;

    // Add back button handler
    const backBtn = container.querySelector('#gallery-back-button');
    backBtn.addEventListener('click', () => {
      showScreen('map');
    });

    // Add upgrade button handler
    const upgradeBtn = container.querySelector('#upgrade-button');
    if (upgradeBtn) {
      if (canUpgrade) {
        upgradeBtn.addEventListener('click', () => this.performUpgrade(currentBlade, nextBlade, recipe));
      }
    }

    // Show the screen
    container.classList.add('active');
  }

  /**
   * Render a blade card in the grid
   */
  renderBladeCard(blade, currentBlade) {
    const unlocked = isBladeUnlocked(blade.id);
    const isCurrent = blade.id === currentBlade.id;

    if (unlocked) {
      // Unlocked blade - show full info
      return `
        <div class="blade-grid-card ${isCurrent ? 'current' : ''}">
          <img class="blade-grid-image" src="${blade.image}" alt="${blade.name}">
          <div class="blade-grid-level">${blade.level}级</div>
          <div class="blade-grid-name">${blade.name}</div>
          ${isCurrent ? '<div class="current-badge">当前</div>' : ''}
        </div>
      `;
    } else {
      // Locked blade - show question mark only
      return `
        <div class="blade-grid-card locked">
          <div class="blade-grid-placeholder">?</div>
          <div class="blade-grid-level">${blade.level}级</div>
          <div class="blade-grid-name">神兵未解锁</div>
        </div>
      `;
    }
  }

  /**
   * Render upgrade section for next blade
   */
  renderUpgradeSection(blade, materialsProgress, canUpgrade, recipe) {
    const materialsHtml = materialsProgress.map(mat => `
      <div class="material-item ${mat.hasEnough ? 'has-enough' : 'not-enough'}">
        <span class="material-name">${mat.name}</span>
        <span class="material-count">${mat.current}/${mat.required}</span>
      </div>
    `).join('');

    return `
      <div class="upgrade-section-full">
        <h3 class="section-title">升级至 ${blade.level}级神兵</h3>
        <div class="materials-list">
          ${materialsHtml}
        </div>
        <button id="upgrade-button" class="upgrade-button ${canUpgrade ? 'can-upgrade' : 'cannot-upgrade'}" ${canUpgrade ? '' : 'disabled'}>
          ${canUpgrade ? '✦ 立即升级 ✦' : '材料不足'}
        </button>
      </div>
    `;
  }

  /**
   * Perform the upgrade
   */
  performUpgrade(currentBlade, nextBlade, recipe) {
    // Remove materials
    for (let mat of recipe.materials) {
      removeMaterial(mat.materialId, mat.quantity);
    }

    // Unlock and equip new blade
    unlockBlade(nextBlade.id);
    setCurrentBlade(nextBlade);
    save();

    // Re-render
    this.render();

    // Show success message
    this.showUpgradeNotification(nextBlade);
  }

  /**
   * Show upgrade success notification
   */
  showUpgradeNotification(blade) {
    const notification = document.createElement('div');
    notification.className = 'upgrade-notification';
    notification.innerHTML = `
      <div class="upgrade-success">✦ 升级成功 ✦</div>
      <div class="new-blade-name">获得：${blade.name}</div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}
