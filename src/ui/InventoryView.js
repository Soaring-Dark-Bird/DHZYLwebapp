/**
 * InventoryView - 背包界面
 * Shows collected materials and items
 */

import { getInventory } from '../main.js';
import { getMaterial } from '../main.js';
import { showScreen } from '../main.js';

export class InventoryView {
  constructor(containerId = 'inventory-screen') {
    this.containerId = containerId;
    this.element = null;
  }

  /**
   * Show the inventory view
   */
  show() {
    this.render();
  }

  /**
   * Hide the inventory view
   */
  hide() {
    if (this.element) {
      this.element.classList.remove('active');
    }
  }

  /**
   * Render the inventory view
   */
  render() {
    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = this.containerId;
      container.className = 'screen';
      document.getElementById('app').appendChild(container);
    }

    const inventory = getInventory();
    const materials = Object.entries(inventory).filter(([id, qty]) => qty > 0);

    container.innerHTML = `
      <button id="back-button" class="icon-button" title="返回地图">
        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <div id="inventory-view-content">
        <div class="inventory-header">
          <span class="inventory-title-icon">🎒</span>
          <h2 id="inventory-title">背包</h2>
        </div>
        <p id="inventory-description">已收集的材料和物品</p>
        <div id="inventory-list">
          ${materials.length === 0 ? '<p class="empty-message">背包空空如也，去采集一些材料吧！</p>' :
            materials.map(([id, qty]) => {
              const material = getMaterial(id);
              const name = material?.name || id;
              const description = material?.description || '';
              return `
                <div class="inventory-item">
                  <div class="item-quantity">x${qty}</div>
                  <div class="item-name">${name}</div>
                  <div class="item-description">${description}</div>
                </div>
              `;
            }).join('')}
        </div>
      </div>
    `;

    this.element = container;

    // Add event listeners
    const backBtn = container.querySelector('#back-button');
    backBtn.addEventListener('click', () => {
      showScreen('map');
    });

    // Show the screen
    container.classList.add('active');
  }
}

/**
 * Show inventory panel
 */
export function showInventory() {
  // Import dynamically to avoid circular dependency
  import('../ui/InventoryView.js').then(module => {
    const view = new module.InventoryView('inventory-screen');
    view.show();
  });
}
