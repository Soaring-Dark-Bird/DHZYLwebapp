/**
 * InfoPanel - Region info modal
 * Shows drops and collectibles for a region
 */

import { getRegion, getMaterial, getMonster } from '../main.js';
import { getInventory } from '../core/GameState.js';

export class InfoPanel {
  constructor() {
    this.element = null;
    this.overlay = null;
  }

  /**
   * Show the info panel
   * @param {string} regionId - Region ID
   */
  static show(regionId) {
    const panel = new InfoPanel();
    panel.render(regionId);
  }

  /**
   * Hide the info panel
   */
  static hide() {
    const panel = document.getElementById('info-panel');
    const overlay = document.getElementById('overlay');
    panel?.classList.remove('active');
    overlay?.classList.remove('active');
  }

  /**
   * Render the info panel
   */
  render(regionId) {
    const region = getRegion(regionId);
    if (!region) {
      console.warn(`Region not found: ${regionId}`);
      return;
    }

    // Create overlay if it doesn't exist
    let overlay = document.getElementById('overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'overlay';
      document.body.appendChild(overlay);
    }
    // Remove old listeners by replacing
    const newOverlay = overlay.cloneNode(false);
    overlay.parentNode?.replaceChild(newOverlay, overlay);
    this.overlay = newOverlay;
    this.overlay.addEventListener('click', () => InfoPanel.hide());

    // Create panel if it doesn't exist
    let panel = document.getElementById('info-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'info-panel';
      document.body.appendChild(panel);
    }

    const inventory = getInventory();

    // Build HTML content
    let dropsHtml = '';
    if (region.monsters && region.monsters.length > 0) {
      const drops = this.getMonsterDrops(region.monsters);
      if (drops.length > 0) {
        dropsHtml = `
          <div class="section">
            <h4>怪物掉落</h4>
            <ul class="item-list">
              ${drops.map(drop => `
                <li>${drop.name} ${inventory[drop.id] ? `(拥有: ${inventory[drop.id]})` : ''}</li>
              `).join('')}
            </ul>
          </div>
        `;
      }
    }

    let gatherablesHtml = '';
    if (region.gatherables && region.gatherables.length > 0) {
      gatherablesHtml = `
        <div class="section">
          <h4>采集物</h4>
          <ul class="item-list">
            ${region.gatherables.map(g => `
              <li>${g.name}</li>
            `).join('')}
          </ul>
        </div>
      `;
    }

    panel.innerHTML = `
      <button class="close-button" aria-label="关闭">×</button>
      <h3>${region.name}</h3>
      <p style="opacity: 0.7; margin-bottom: 16px;">${region.description}</p>
      ${dropsHtml}
      ${gatherablesHtml}
      <div class="section">
        <h4>等级范围</h4>
        <p>${region.levelRange[0]} - ${region.levelRange[1]} 级</p>
      </div>
    `;

    // Add close handler
    const closeBtn = panel.querySelector('.close-button');
    closeBtn.addEventListener('click', () => InfoPanel.hide());

    // Show panel and overlay
    panel.classList.add('active');
    this.overlay.classList.add('active');
  }

  /**
   * Get all monster drops for a region
   */
  getMonsterDrops(monsterIds) {
    const drops = new Map(); // Use Map to avoid duplicates

    monsterIds.forEach(monsterId => {
      const monster = getMonster(monsterId);
      if (monster?.drops) {
        monster.drops.forEach(drop => {
          const material = getMaterial(drop.materialId);
          if (material && !drops.has(drop.materialId)) {
            drops.set(drop.materialId, {
              id: drop.materialId,
              name: material.name
            });
          }
        });
      }
    });

    return Array.from(drops.values());
  }
}

export default InfoPanel;
