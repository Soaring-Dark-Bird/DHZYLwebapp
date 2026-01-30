/**
 * RegionView - Region detail screen with monster list
 * Shows monsters in the selected region, allows clicking to battle
 */

import { getRegion, getMonstersByRegion, getMonster, showScreen, getCurrentBlade } from '../main.js';
import { InfoPanel } from './InfoPanel.js';
import * as BattleSystem from '../core/BattleSystem.js';
import * as UpgradeSystem from '../core/UpgradeSystem.js';

export class RegionView {
  constructor(containerId = 'region-screen') {
    this.containerId = containerId;
    this.element = null;
    this.currentRegionId = null;
  }

  /**
   * Show the region view
   * @param {string} regionId - The region ID to display
   */
  show(regionId) {
    this.currentRegionId = regionId;
    this.render();
  }

  /**
   * Hide the region view
   */
  hide() {
    if (this.element) {
      this.element.classList.remove('active');
    }
  }

  /**
   * Render the region view HTML
   */
  render() {
    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = this.containerId;
      container.className = 'screen';
      document.getElementById('app').appendChild(container);
    }

    const region = getRegion(this.currentRegionId);
    const monsters = getMonstersByRegion(this.currentRegionId);

    container.innerHTML = `
      <button id="back-button" class="icon-button" title="返回地图">
        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <button id="region-info-button" class="icon-button" title="区域信息">
        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
      </button>
      <div id="region-view-content">
        <h2 id="region-title">${region?.name || '未知区域'}</h2>
        <p id="region-description">${region?.description || ''}</p>
        <div id="monster-list">
          ${monsters.map(m => this.renderMonsterCard(m)).join('')}
        </div>
      </div>
      <div id="blade-display">
        ${this.renderBladeDisplay()}
      </div>
    `;

    this.element = container;

    // Add event listeners
    this.attachEventListeners(container, monsters);

    // Show the screen
    container.classList.add('active');
  }

  /**
   * Render a monster card
   */
  renderMonsterCard(monster) {
    return `
      <div class="monster-card" data-monster-id="${monster.id}">
        <div class="monster-level">${monster.level}级</div>
        <div class="monster-name">${monster.name}</div>
        <img class="monster-image" src="${monster.image}" alt="${monster.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 100 100&quot;><rect fill=&quot;#333&quot; width=&quot;100&quot; height=&quot;100&quot;/><text fill=&quot;#ccc&quot; x=&quot;50&quot; y=&quot;55&quot; text-anchor=&quot;middle&quot; font-size=&quot;20&quot;>${monster.name}</text></svg>'">
        <p class="monster-description">${monster.description}</p>
      </div>
    `;
  }

  /**
   * Render the current blade display
   */
  renderBladeDisplay() {
    const blade = getCurrentBlade();
    const recipe = UpgradeSystem.getRecipeForCurrentBlade();

    // Check if upgrade is available
    const canUpgrade = recipe && UpgradeSystem.canUpgrade(blade.id);

    return `
      <img class="blade-image" src="${blade.image || ''}" alt="${blade.name}" onerror="this.style.display='none'">
      <div class="blade-info">
        <div class="blade-name">${blade.name}</div>
        <div class="blade-level">${blade.level}级</div>
      </div>
      <button id="upgrade-button" class="button" ${canUpgrade ? '' : 'disabled'}>
        升级
      </button>
    `;
  }

  /**
   * Attach event listeners to the region view
   */
  attachEventListeners(container, monsters) {
    // Back button
    const backBtn = container.querySelector('#back-button');
    backBtn.addEventListener('click', () => {
      showScreen('map');
    });

    // Info button
    const infoBtn = container.querySelector('#region-info-button');
    infoBtn.addEventListener('click', () => {
      InfoPanel.show(this.currentRegionId);
    });

    // Monster cards
    container.querySelectorAll('.monster-card').forEach(card => {
      card.addEventListener('click', () => {
        const monsterId = card.dataset.monsterId;
        this.onMonsterClick(monsterId);
      });
    });

    // Upgrade button
    const upgradeBtn = container.querySelector('#upgrade-button');
    upgradeBtn.addEventListener('click', () => {
      this.onUpgradeClick();
    });
  }

  /**
   * Handle monster card click
   */
  onMonsterClick(monsterId) {
    // Determine battle outcome based on levels
    const blade = getCurrentBlade();
    const monster = getMonster(monsterId);

    if (!monster) return;

    const outcome = BattleSystem.calculateOutcome(blade.level, monster.level);

    if (outcome.type === 'instant_kill') {
      // Instant kill - no battle screen, just give rewards
      BattleSystem.processInstantKill(monster);
      this.refresh();
    } else {
      // Enter battle
      showScreen('battle', { monsterId });
    }
  }

  /**
   * Handle upgrade button click
   */
  onUpgradeClick() {
    const blade = getCurrentBlade();
    const result = UpgradeSystem.upgrade(blade.id);

    if (result.success) {
      // Play upgrade animation
      const bladeDisplay = document.querySelector('#blade-display');
      if (bladeDisplay) {
        bladeDisplay.classList.add('upgrade-effect');
        setTimeout(() => bladeDisplay.classList.remove('upgrade-effect'), 1000);
      }

      // Refresh display
      this.refresh();
    }
  }

  /**
   * Refresh the region view (after battle/upgrade)
   */
  refresh() {
    this.render();
  }
}
