/**
 * BattleView - Battle screen component
 * Shows monster, health bar, handles combat
 */

import { getMonster, showScreen, getCurrentBlade, addMaterial, getMaterial, save } from '../main.js';
import * as BattleSystem from '../core/BattleSystem.js';
import { getSettings } from '../core/GameState.js';

export class BattleView {
  constructor(containerId = 'battle-screen') {
    this.containerId = containerId;
    this.element = null;
    this.monster = null;
    this.blade = null;
    this.monsterHp = 100;
    this.playerHealth = 100;
    this.lastAttackTime = 0;
    this.battleActive = false;
    this.isRisky = false; // 冒险战斗：低级刀打高一级怪
  }

  /**
   * Show the battle view
   * @param {string} monsterId - Monster to fight
   * @param {boolean} isRisky - Whether this is a risky battle (low blade vs high monster)
   */
  show(monsterId, isRisky = false) {
    this.monster = getMonster(monsterId);
    this.blade = getCurrentBlade();
    this.monsterHp = 100;
    this.playerHealth = 100;
    this.battleActive = true;
    this.isRisky = isRisky;

    this.render();
  }

  /**
   * Hide the battle view
   */
  hide() {
    this.battleActive = false;
    if (this.element) {
      this.element.classList.remove('active');
    }
  }

  /**
   * Render the battle view
   */
  render() {
    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = this.containerId;
      container.className = 'screen';
      document.getElementById('app').appendChild(container);
    }

    const settings = getSettings();

    // 冒险战斗警告
    const riskWarning = this.isRisky
      ? `<div id="risk-warning">⚠ 冒险挑战：刀意值消耗巨大！有50%概率失败！</div>`
      : '';

    container.innerHTML = `
      <div id="battle-container">
        <button id="battle-back-button" class="icon-button" style="top: 16px; left: 16px;" title="逃跑">
          <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>

        ${riskWarning}

        <div id="health-label">刀意值</div>
        <div id="health-bar-container">
          <div id="health-bar" style="width: ${this.playerHealth}%">100%</div>
        </div>

        <div id="battle-monster">
          <h2 id="battle-monster-name">${this.monster?.name || '未知怪物'}</h2>
          <div id="battle-monster-level">${this.monster?.level}级</div>
          <img id="battle-monster-image" src="${this.monster?.image || ''}" alt="${this.monster?.name}"
            onerror="this.src='data:image/svg+xml,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 100 100&quot;><rect fill=&quot;#333&quot; width=&quot;100&quot; height=&quot;100&quot;/><text fill=&quot;#ccc&quot; x=&quot;50&quot; y=&quot;55&quot; text-anchor=&quot;middle&quot; font-size=&quot;20&quot;>怪</text></svg>'">
        </div>

        <div id="battle-blade-display">
          <div class="battle-blade-label">当前神兵</div>
          <img id="battle-blade-image" src="${this.blade?.image || ''}" alt="${this.blade?.name}">
          <div class="battle-blade-name">${this.blade?.name || '未知神兵'}</div>
          <div class="battle-blade-level">${this.blade?.level || 10}级</div>
        </div>

        <p style="opacity: 0.7;">点击怪物进行攻击</p>
      </div>
    `;

    this.element = container;

    // Add click handler to monster - pass event for click position
    const monsterImg = container.querySelector('#battle-monster');
    monsterImg.addEventListener('click', (e) => this.onAttack(e));

    // Back button - return to map
    const backBtn = container.querySelector('#battle-back-button');
    backBtn.addEventListener('click', () => {
      showScreen('map');
    });

    // Show the screen
    container.classList.add('active');
  }

  /**
   * Handle player attack
   */
  onAttack(event) {
    if (!this.battleActive) return;

    // Debounce (100ms)
    const now = Date.now();
    if (now - this.lastAttackTime < 100) return;
    this.lastAttackTime = now;

    // Get click position from event
    const clickX = event?.clientX || window.innerWidth / 2;
    const clickY = event?.clientY || window.innerHeight / 2;

    const settings = getSettings();

    // One-hit kill mode
    if (settings.oneHitKill) {
      this.onVictory();
      return;
    }

    // Normal combat with random damage
    // Player damage: 8-12% (avg 10%)
    const playerDamage = Math.floor(Math.random() * 5) + 8; // 8-12%

    // Monster counter-attack damage varies by battle type
    let monsterDamage;
    if (this.isRisky) {
      // 冒险战斗：刀意值消耗巨大，怪物反伤 8-15%
      monsterDamage = Math.floor(Math.random() * 8) + 8; // 8-15%
    } else {
      // 正常战斗：怪物反伤 2-4%
      monsterDamage = Math.floor(Math.random() * 3) + 2; // 2-4%
    }

    this.monsterHp -= playerDamage;

    // Apply attack effect based on blade level at click position
    this.applyAttackEffect(this.blade?.level || 10, clickX, clickY);

    // Show damage text at click position
    this.showDamageTextAtPosition(playerDamage, clickX, clickY);

    // Monster counter-attack
    if (this.monsterHp > 0) {
      this.playerHealth -= monsterDamage;
      this.updateHealthBar();

      if (this.playerHealth <= 0) {
        this.onDefeat();
        return;
      }
    } else {
      this.onVictory();
      return;
    }
  }

  /**
   * Apply attack effect based on blade level at click position
   */
  applyAttackEffect(bladeLevel, clickX, clickY) {
    const monsterImg = document.querySelector('#battle-monster-image');
    const battleContainer = document.querySelector('#battle-container');
    if (!monsterImg || !battleContainer) return;

    // Remove existing effect classes
    monsterImg.classList.remove('hit', 'monster-shake', 'slash-effect', 'thunder-effect', 'void-effect');
    battleContainer.querySelectorAll('.attack-effect').forEach(el => el.remove());

    // Get blade effect class
    const effectClass = this.getBladeEffectClass(bladeLevel);

    // Apply hit effect to monster
    monsterImg.classList.add('hit', 'monster-shake', effectClass);
    setTimeout(() => {
      monsterImg.classList.remove('hit', 'monster-shake', effectClass);
    }, 300);

    // Create additional visual effects based on blade level at click position
    this.createBladeVisualEffect(bladeLevel, battleContainer, monsterImg, clickX, clickY);
  }

  /**
   * Get blade effect CSS class based on level
   */
  getBladeEffectClass(level) {
    switch (level) {
      case 10:
        return 'blade-lv10-effect';
      case 9:
        return 'blade-lv9-effect';
      case 8:
        return 'blade-lv8-effect';
      default:
        return 'blade-lv10-effect';
    }
  }

  /**
   * Create visual effects based on blade level at click position
   */
  createBladeVisualEffect(level, container, monsterImg, clickX, clickY) {
    switch (level) {
      case 10:
        // 10级刀 - 简朴的白色闪光
        this.createSimpleSlash(container, clickX, clickY);
        break;
      case 9:
        // 9级刀 - 青色光芒 + 剑气
        this.createGreenSlash(container, clickX, clickY);
        this.createParticleEffect(container, '#4a8a7a', 5, clickX, clickY);
        break;
      case 8:
        // 8级刀 - 绚丽的金色剑光 + 粒子爆炸
        this.createGoldenSlash(container, clickX, clickY);
        this.createParticleEffect(container, '#d4a017', 15, clickX, clickY);
        this.createLightRays(container, clickX, clickY);
        this.createScreenFlash(container);
        break;
    }
  }

  /**
   * 10级刀 - 简单的白色闪光
   */
  createSimpleSlash(container, clickX, clickY) {
    const slash = document.createElement('div');
    slash.className = 'attack-effect simple-slash';
    slash.style.cssText = `
      position: fixed;
      left: ${clickX}px;
      top: ${clickY}px;
      width: 100px;
      height: 4px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
      transform: translate(-50%, -50%) rotate(-30deg);
      animation: simpleSlashAnim 0.2s ease-out forwards;
      pointer-events: none;
      z-index: 200;
    `;
    container.appendChild(slash);
    setTimeout(() => slash.remove(), 200);
  }

  /**
   * 9级刀 - 青色剑气
   */
  createGreenSlash(container, clickX, clickY) {
    const slash = document.createElement('div');
    slash.className = 'attack-effect green-slash';
    slash.style.cssText = `
      position: fixed;
      left: ${clickX}px;
      top: ${clickY}px;
      width: 200px;
      height: 60px;
      background: linear-gradient(90deg, transparent, rgba(74,138,122,0.6), rgba(74,138,122,0.9), rgba(74,138,122,0.6), transparent);
      clip-path: polygon(0% 50%, 70% 0%, 80% 50%, 70% 100%);
      transform: translate(-50%, -50%);
      animation: greenSlashAnim 0.3s ease-out forwards;
      pointer-events: none;
      z-index: 200;
    `;
    container.appendChild(slash);
    setTimeout(() => slash.remove(), 300);
  }

  /**
   * 8级刀 - 金色剑光
   */
  createGoldenSlash(container, clickX, clickY) {
    const slash = document.createElement('div');
    slash.className = 'attack-effect golden-slash';
    slash.style.cssText = `
      position: fixed;
      left: ${clickX}px;
      top: ${clickY}px;
      width: 300px;
      height: 80px;
      background: linear-gradient(90deg,
        transparent,
        rgba(212,160,23,0.4),
        rgba(255,215,0,0.9),
        rgba(255,255,255,1),
        rgba(255,215,0,0.9),
        rgba(212,160,23,0.4),
        transparent
      );
      clip-path: polygon(0% 50%, 80% 0%, 85% 50%, 80% 100%);
      transform: translate(-50%, -50%);
      filter: blur(2px);
      animation: goldenSlashAnim 0.4s ease-out forwards;
      pointer-events: none;
      z-index: 200;
    `;
    container.appendChild(slash);
    setTimeout(() => slash.remove(), 400);

    // Secondary slash
    setTimeout(() => {
      const slash2 = document.createElement('div');
      slash2.className = 'attack-effect golden-slash-secondary';
      slash2.style.cssText = `
        position: fixed;
        left: ${clickX}px;
        top: ${clickY}px;
        width: 250px;
        height: 60px;
        background: linear-gradient(90deg, transparent, rgba(255,215,0,0.7), rgba(255,255,255,0.8), transparent);
        clip-path: polygon(0% 50%, 75% 0%, 80% 50%, 75% 100%);
        transform: translate(-50%, -50%) rotate(10deg);
        animation: goldenSlashAnim 0.3s ease-out forwards;
        pointer-events: none;
        z-index: 201;
      `;
      container.appendChild(slash2);
      setTimeout(() => slash2.remove(), 300);
    }, 50);
  }

  /**
   * 粒子效果
   */
  createParticleEffect(container, color, count, clickX, clickY) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'attack-effect particle';
      const angle = (Math.random() * 360) * (Math.PI / 180);
      const distance = 50 + Math.random() * 100;
      const duration = 0.3 + Math.random() * 0.3;
      const size = 3 + Math.random() * 6;

      particle.style.cssText = `
        position: fixed;
        left: ${clickX}px;
        top: ${clickY}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        box-shadow: 0 0 ${size}px ${color};
        transform: translate(-50%, -50%);
        animation: particleAnim ${duration}s ease-out forwards;
        --tx: ${Math.cos(angle) * distance}px;
        --ty: ${Math.sin(angle) * distance}px;
        pointer-events: none;
        z-index: 200;
      `;
      container.appendChild(particle);
      setTimeout(() => particle.remove(), duration * 1000);
    }
  }

  /**
   * 光芒射线（8级刀）
   */
  createLightRays(container, clickX, clickY) {
    for (let i = 0; i < 8; i++) {
      const ray = document.createElement('div');
      ray.className = 'attack-effect light-ray';
      const rotation = i * 45;

      ray.style.cssText = `
        position: fixed;
        left: ${clickX}px;
        top: ${clickY}px;
        width: 150px;
        height: 3px;
        background: linear-gradient(90deg, rgba(255,215,0,0.8), transparent);
        transform-origin: left center;
        transform: translate(-50%, -50%) rotate(${rotation}deg);
        animation: rayAnim 0.4s ease-out forwards;
        pointer-events: none;
        z-index: 199;
      `;
      container.appendChild(ray);
      setTimeout(() => ray.remove(), 400);
    }
  }

  /**
   * 屏幕闪光（8级刀）
   */
  createScreenFlash(container) {
    const flash = document.createElement('div');
    flash.className = 'attack-effect screen-flash-effect';
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at center, rgba(255,215,0,0.3) 0%, transparent 70%);
      animation: flashAnim 0.2s ease-out forwards;
      pointer-events: none;
      z-index: 198;
    `;
    container.appendChild(flash);
    setTimeout(() => flash.remove(), 200);
  }

  /**
   * Update health bar display
   */
  updateHealthBar() {
    const healthBar = document.querySelector('#health-bar');
    if (healthBar) {
      this.playerHealth = Math.max(0, this.playerHealth);
      healthBar.style.width = this.playerHealth + '%';
      healthBar.textContent = Math.ceil(this.playerHealth) + '%';
    }
  }

  /**
   * Show floating damage text at click position
   */
  showDamageTextAtPosition(damage, clickX, clickY) {
    const text = document.createElement('div');
    text.className = 'damage-text';
    text.textContent = damage;
    text.style.cssText = `
      position: fixed;
      left: ${clickX}px;
      top: ${clickY}px;
      transform: translate(-50%, -50%);
      color: #ff4444;
      font-size: 24px;
      font-weight: bold;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
      animation: damageFloatAnim 0.8s ease-out forwards;
      pointer-events: none;
      z-index: 300;
    `;
    document.body.appendChild(text);

    setTimeout(() => text.remove(), 800);
  }

  /**
   * Show floating damage text (legacy method for compatibility)
   */
  showDamageText(damage, type) {
    const text = document.createElement('div');
    text.className = `damage-text ${type}`;
    text.textContent = damage;
    text.style.left = '50%';
    text.style.top = '40%';
    document.body.appendChild(text);

    setTimeout(() => text.remove(), 1000);
  }

  /**
   * Handle victory
   */
  onVictory() {
    this.battleActive = false;

    // Show victory animation
    const monsterImg = document.querySelector('#battle-monster-image');
    if (monsterImg) {
      monsterImg.classList.add('defeated');
    }

    // 处理冒险战斗结果
    if (this.isRisky) {
      // 50%概率打输
      if (Math.random() < 0.5) {
        setTimeout(() => {
          this.onDefeat();
        }, 500);
        return;
      }
      // 赢了，但血量只剩1-2%
      this.playerHealth = 1 + Math.floor(Math.random() * 2); // 1-2%
      this.updateHealthBar();
    }

    // Process drops
    this.processDrops();

    // Show victory message
    setTimeout(() => {
      showScreen('map');
    }, 1500);
  }

  /**
   * Handle defeat
   */
  onDefeat() {
    this.battleActive = false;

    // Show defeat message
    const container = document.querySelector('#battle-container');
    if (container) {
      container.classList.add('shake');
    }

    setTimeout(() => {
      alert('战斗失败！刀意值耗尽。');
      showScreen('map');
    }, 500);
  }

  /**
   * Process monster drops
   */
  processDrops() {
    if (!this.monster?.drops) return;

    const drops = [];

    this.monster.drops.forEach(drop => {
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
      this.showDropNotification(drops.join(', '));
    }
  }

  /**
   * Show drop notification
   */
  showDropNotification(text) {
    const notification = document.createElement('div');
    notification.id = 'material-drop';
    notification.textContent = '获得: ' + text;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 2000);
  }
}
