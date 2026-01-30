/**
 * SettingsPanel - Game settings modal
 * Sound, screen shake, one-hit kill options
 */

import { getSettings, updateSettings, save, reset } from '../core/GameState.js';

export class SettingsPanel {
  constructor() {
    this.element = null;
    this.overlay = null;
  }

  /**
   * Show the settings panel
   */
  static show() {
    const panel = new SettingsPanel();
    panel.render();
  }

  /**
   * Hide the settings panel
   */
  static hide() {
    const panel = document.getElementById('settings-panel');
    const overlay = document.getElementById('overlay');
    panel?.classList.remove('active');
    overlay?.classList.remove('active');
  }

  /**
   * Render the settings panel
   */
  render() {
    const settings = getSettings();

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
    this.overlay.addEventListener('click', () => SettingsPanel.hide());

    // Create panel if it doesn't exist
    let panel = document.getElementById('settings-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'settings-panel';
      document.body.appendChild(panel);
    }

    panel.innerHTML = `
      <button id="settings-close" aria-label="关闭">×</button>
      <h3 id="settings-title">设置</h3>

      <div class="setting-row">
        <label for="setting-sound">音效</label>
        <input type="checkbox" id="setting-sound" ${settings.sound ? 'checked' : ''}>
      </div>

      <div class="setting-row">
        <label for="setting-volume">音量</label>
        <input type="range" id="setting-volume" min="0" max="100" value="${settings.volume}">
        <span id="volume-value">${settings.volume}%</span>
      </div>

      <div class="setting-row">
        <label for="setting-shake">屏幕抖动</label>
        <input type="checkbox" id="setting-shake" ${settings.screenShake ? 'checked' : ''}>
      </div>

      <div class="setting-row">
        <label for="setting-ohk">一键秒杀</label>
        <input type="checkbox" id="setting-ohk" ${settings.oneHitKill ? 'checked' : ''}>
      </div>

      <div style="margin-top: 24px; text-align: center;">
        <button id="reset-save" class="button">重置存档</button>
      </div>
    `;

    // Add event listeners
    this.attachEventListeners(panel);

    // Show panel and overlay
    panel.classList.add('active');
    this.overlay.classList.add('active');
  }

  /**
   * Attach event listeners
   */
  attachEventListeners(panel) {
    // Close button
    const closeBtn = panel.querySelector('#settings-close');
    closeBtn.addEventListener('click', () => SettingsPanel.hide());

    // Sound toggle
    const soundCheckbox = panel.querySelector('#setting-sound');
    soundCheckbox.addEventListener('change', (e) => {
      updateSettings({ sound: e.target.checked });
      save();
    });

    // Volume slider
    const volumeSlider = panel.querySelector('#setting-volume');
    const volumeValue = panel.querySelector('#volume-value');
    volumeSlider.addEventListener('input', (e) => {
      volumeValue.textContent = e.target.value + '%';
    });
    volumeSlider.addEventListener('change', (e) => {
      updateSettings({ volume: parseInt(e.target.value) });
      save();
    });

    // Screen shake toggle
    const shakeCheckbox = panel.querySelector('#setting-shake');
    shakeCheckbox.addEventListener('change', (e) => {
      updateSettings({ screenShake: e.target.checked });
      save();
    });

    // One-hit kill toggle
    const ohkCheckbox = panel.querySelector('#setting-ohk');
    ohkCheckbox.addEventListener('change', (e) => {
      updateSettings({ oneHitKill: e.target.checked });
      save();
    });

    // Reset save button
    const resetBtn = panel.querySelector('#reset-save');
    resetBtn.addEventListener('click', () => {
      if (confirm('确定要重置存档吗？所有进度将丢失！')) {
        reset();
        location.reload();
      }
    });
  }
}

export default SettingsPanel;
