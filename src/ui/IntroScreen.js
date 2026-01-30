/**
 * IntroScreen - Opening animation screen
 * Shows "大荒斩妖录" title with animation, can be skipped
 */

export class IntroScreen {
  constructor(containerId = 'intro-screen') {
    this.containerId = containerId;
    this.element = null;
    this.onCompleteCallback = null;
    this.skipped = false;
    this.timer = null;
  }

  /**
   * Create and show the intro screen
   * @param {Function} onComplete - Callback when intro completes
   */
  show(onComplete) {
    this.onCompleteCallback = onComplete;
    this.render();
    this.startAnimation();
  }

  /**
   * Hide the intro screen
   */
  hide() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.element) {
      this.element.classList.remove('active');
      setTimeout(() => {
        this.element?.remove();
        this.element = null;
      }, 300);
    }
  }

  /**
   * Render the intro screen HTML
   */
  render() {
    // Create container if it doesn't exist
    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = this.containerId;
      container.className = 'screen';
      document.getElementById('app').appendChild(container);
    }

    container.innerHTML = `
      <div class="intro-content">
        <h1 class="intro-title">大荒斩妖录</h1>
        <p class="intro-subtitle">山海经 · 点击式网页游戏</p>
        <button class="intro-skip button">跳过</button>
      </div>
    `;

    this.element = container;

    // Add skip button handler
    const skipBtn = container.querySelector('.intro-skip');
    skipBtn.addEventListener('click', () => this.skip());

    // Allow clicking anywhere to skip
    container.addEventListener('click', (e) => {
      if (e.target !== skipBtn) {
        this.skip();
      }
    });

    // Show the screen
    container.classList.add('active');
  }

  /**
   * Start the intro animation
   */
  startAnimation() {
    // Auto-complete after 6 seconds
    this.timer = setTimeout(() => {
      if (!this.skipped) {
        this.complete();
      }
    }, 6000);
  }

  /**
   * Skip the intro animation
   */
  skip() {
    if (this.skipped) return;
    this.skipped = true;
    this.complete();
  }

  /**
   * Complete the intro and call callback
   */
  complete() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    // Fade out
    if (this.element) {
      this.element.classList.add('screen-transition-exit');
    }

    setTimeout(() => {
      this.hide();
      if (this.onCompleteCallback) {
        this.onCompleteCallback();
      }
    }, 300);
  }
}
