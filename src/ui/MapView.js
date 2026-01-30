/**
 * MapView - 五域地图视图
 * Shows the fullmap.png with interactive hotspots for monsters and resources
 */

import { showScreen, getMonster, addMaterial, getMaterial, save, getCurrentBlade } from '../main.js';
import * as BattleSystem from '../core/BattleSystem.js';

// Map configuration cache
let mapConfig = null;

/**
 * Load map configuration
 */
async function loadMapConfig() {
  if (mapConfig) return mapConfig;

  try {
    const response = await fetch('/assets/data/map-config.json');
    if (!response.ok) throw new Error(`Failed to load map-config.json: ${response.status}`);
    const config = await response.json();
    mapConfig = config;
    return config;
  } catch (e) {
    console.warn('Using fallback map config', e);
    mapConfig = {
      monsters: [
        { id: 'monster-10-1', name: '狌狌', level: 10, position: { x: 39.7, y: 75 }, hitboxRadius: 4.6 },
        { id: 'monster-9-1', name: '鹿蜀', level: 9, position: { x: 33.2, y: 83.5 }, hitboxRadius: 4.3 },
        { id: 'monster-9-2', name: '青兕', level: 9, position: { x: 60.1, y: 76.6 }, hitboxRadius: 4.1 },
        { id: 'monster-9-3', name: '瞿如', level: 9, position: { x: 60.5, y: 86.8 }, hitboxRadius: 4.2 },
        { id: 'monster-9-4', name: '蚩尤残魂', level: 9, position: { x: 74.2, y: 79.4 }, hitboxRadius: 4.8 }
      ],
      resources: [
        { id: 'res-10-1', materialId: 'mat-10-1', name: '山铁', position: { x: 67.5, y: 90.7 }, hitboxRadius: 2 },
        { id: 'res-9-1', materialId: 'mat-9-4', name: '精铁', position: { x: 71.8, y: 91 }, hitboxRadius: 2 },
        { id: 'res-9-2', materialId: 'mat-9-1', name: '桂木', position: { x: 75.9, y: 91.1 }, hitboxRadius: 2 }
      ]
    };
    return mapConfig;
  }
}

export class MapView {
  constructor(containerId = 'map-screen') {
    this.containerId = containerId;
    this.element = null;
    this.clickCooldown = false;
    this.debugMode = false; // Set to true to show hotspot circles
  }

  /**
   * Toggle debug mode
   */
  setDebugMode(enabled) {
    this.debugMode = enabled;
    if (this.element) {
      this.render();
    }
  }

  /**
   * Show the map view
   */
  async show() {
    await this.render();
  }

  /**
   * Hide the map view
   */
  hide() {
    if (this.element) {
      this.element.classList.remove('active');
    }
  }

  /**
   * Render the map view
   */
  async render() {
    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = this.containerId;
      container.className = 'screen';
      document.getElementById('app').appendChild(container);
    }

    const config = await loadMapConfig();

    container.innerHTML = `
      <div id="map-view">
        <div id="map-container">
          <div id="image-wrapper">
            <img id="fullmap" src="/assets/images/maps/fullmap.png" alt="大荒地图" class="map-background">
            <div id="hotspot-layer" class="hotspot-layer"></div>
          </div>
        </div>
      </div>
    `;

    this.element = container;

    // Render hotspots
    this.renderHotspotElements(container.querySelector('#hotspot-layer'), config);

    // Add event listeners
    this.attachEventListeners(container, config);

    // Show the screen
    container.classList.add('active');
  }

  /**
   * Render hotspots as HTML div elements
   */
  renderHotspotElements(layer, config) {
    layer.innerHTML = '';

    // Monsters
    (config.monsters || []).forEach(m => {
      const el = this.createHotspotElement(m, 'monster', '#ff6b6b');
      layer.appendChild(el);
    });

    // Resources
    (config.resources || []).forEach(r => {
      const el = this.createHotspotElement(r, 'resource', '#4ecdc4');
      layer.appendChild(el);
    });
  }

  /**
   * Create a hotspot element
   */
  createHotspotElement(hotspot, type, color) {
    const el = document.createElement('div');
    el.className = `hotspot-marker hotspot-${type}`;
    el.dataset.id = hotspot.id;
    el.dataset.type = type;

    // 如果是调试模式，显示明显的圆圈；否则完全透明（但仍可点击）
    if (this.debugMode) {
      el.style.cssText = `
        position: absolute;
        left: ${hotspot.position.x}%;
        top: ${hotspot.position.y}%;
        width: ${hotspot.hitboxRadius * 2}%;
        height: ${hotspot.hitboxRadius * 2}%;
        border: 2px solid ${color};
        border-radius: 50%;
        background: ${color}33;
        transform: translate(-50%, -50%);
        cursor: pointer;
        pointer-events: auto;
        transition: all 0.2s ease;
      `;
    } else {
      // 完全透明，但保持可点击
      el.style.cssText = `
        position: absolute;
        left: ${hotspot.position.x}%;
        top: ${hotspot.position.y}%;
        width: ${hotspot.hitboxRadius * 2}%;
        height: ${hotspot.hitboxRadius * 2}%;
        border: none;
        border-radius: 50%;
        background: transparent;
        transform: translate(-50%, -50%);
        cursor: pointer;
        pointer-events: auto;
      `;
    }

    return el;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners(container, config) {
    const mapContainer = container.querySelector('#map-container');
    const mapImage = container.querySelector('#fullmap');

    // Click handler
    mapContainer.addEventListener('click', (e) => {
      // Cooldown
      if (this.clickCooldown) return;
      this.clickCooldown = true;
      setTimeout(() => { this.clickCooldown = false; }, 100);

      // Get coordinates relative to the image
      const rect = mapImage.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      // Check if clicked on hotspot element
      const hotspotEl = e.target.closest('.hotspot-marker');
      if (hotspotEl) {
        const id = hotspotEl.dataset.id;
        const type = hotspotEl.dataset.type;
        const hotspot = this.findHotspotById(id, type, config);
        if (hotspot) {
          this.handleHotspotClick(hotspot);
        }
      }

      // Create ripple
      this.createRipple(mapContainer, x, y);
    });
  }

  /**
   * Find hotspot by id and type
   */
  findHotspotById(id, type, config) {
    let list;
    if (type === 'monster') list = config.monsters || [];
    else if (type === 'resource') list = config.resources || [];
    else list = config.landmarks || [];
    return list.find(h => h.id === id);
  }

  /**
   * Handle hotspot click
   */
  handleHotspotClick(hotspot) {
    // Check if this is a resource (has materialId or comes from resources array)
    if (hotspot.materialId || hotspot.type === 'resource') {
      this.handleResourceClick(hotspot);
    } else {
      this.handleMonsterClick(hotspot);
    }
  }

  /**
   * Handle monster click
   */
  handleMonsterClick(hotspot) {
    const monster = getMonster(hotspot.id);
    if (!monster) {
      console.warn('Monster not found:', hotspot.id);
      this.showToast(`未找到怪物数据: ${hotspot.name}`);
      return;
    }

    const blade = getCurrentBlade();
    const bladeLevel = blade?.level || 10;

    const outcome = BattleSystem.calculateOutcome(bladeLevel, monster.level);

    if (outcome.type === 'instant_kill') {
      // 刀更强（等级更低），直接秒杀
      BattleSystem.processInstantKill(monster);
    } else if (outcome.type === 'battle') {
      // 同等级，进入战斗
      showScreen('battle', { monsterId: monster.id, isRisky: false });
    } else if (outcome.type === 'risk_battle') {
      // 低级刀打高一级怪，冒险战斗
      showScreen('battle', { monsterId: monster.id, isRisky: true });
    } else if (outcome.type === 'disadvantage') {
      // 刀太弱（等级更高超过1级），无法挑战
      this.showToast(`你的刀太弱了！需要先升级到${monster.level}级刀才能挑战${monster.name}`);
    }
  }

  /**
   * Handle resource click
   */
  handleResourceClick(hotspot) {
    const materialId = hotspot.materialId;
    if (materialId) {
      const material = getMaterial(materialId);
      if (material) {
        const quantity = Math.floor(Math.random() * 2) + 1;
        addMaterial(materialId, quantity);
        save();
        this.showToast(`采集成功！获得 ${material.name} x${quantity}`);
      } else {
        // Fallback: use hotspot name
        this.showToast(`采集成功！获得 ${hotspot.name} x1`);
      }
    } else {
      this.showToast(`采集成功！获得 ${hotspot.name} x1`);
    }
  }

  /**
   * Create ripple effect at position
   */
  createRipple(container, x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'map-ripple';
    ripple.style.left = x + '%';
    ripple.style.top = y + '%';
    container.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  /**
   * Show toast notification
   */
  showToast(message) {
    const existing = document.querySelector('.map-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'map-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }
}
