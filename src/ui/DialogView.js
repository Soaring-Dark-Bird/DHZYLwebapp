/**
 * DialogView - Opening story dialogue screen
 * Shows the prologue story in a dialogue format
 */

export class DialogView {
  constructor(containerId = 'dialog-screen') {
    this.containerId = containerId;
    this.element = null;
    this.onCompleteCallback = null;
    this.currentDialogIndex = 0;
    this.currentCharIndex = 0;
    this.typingTimer = null;
    this.isTyping = false;
    this.dialogs = [];
    this.handleKeyPress = null;
    this.notificationShown = false;

    // 山铁樵刀图片路径
    this.bladeImage = '/assets/images/knives/knife-10.png';

    // 对话数据
    this.storyDialogs = [
      {
        speaker: '旁白',
        text: '玄雾漫卷的青丘泽畔，少年是被砭骨的荒风刮醒的。',
        background: '/assets/images/background/background.png'
      },
      {
        speaker: '旁白',
        text: '他记得前一瞬还在旧屋翻捡祖父留下的《山海经》古卷，指尖刚触到卷中"青丘之山，有兽焉，其状如狐而九尾"的墨迹，天旋地转间，周身的市井烟火便被腥涩的草木气、远处凶兽的低吼彻底取代——他跌进了卷中记载的大荒，这片《山海经》里的蛮荒天地。',
      },
      {
        speaker: '旁白',
        text: '脚下是没踝的苍苔，周遭古木如鬼，枝桠间垂着不知名的赤果，风过处，林莽深处传来"呦——"的清啸，那声响不似凡兽，脆如裂玉，却藏着野戾之气。少年攥紧空拳，茫然四顾，只觉这天地浩大如渊，自己如蜉蝣般渺小，连方向都辨不清。',
      },
      {
        speaker: '老樵夫',
        text: '外来的生人，莫往林深走。',
        portrait: 'oldman'
      },
      {
        speaker: '旁白',
        text: '苍老的嗓音自侧后方传来，少年惊然回头，见一樵夫负薪而立。樵夫身量佝偻，面如皴木，腰间别着柄豁口的短斧，草鞋上沾着昆吾山的赤铁砂，肩头的薪柴里，竟混着一截泛着青黑的凶兽骨节——那骨节上的齿痕，狰狞得吓人。',
      },
      {
        speaker: '老樵夫',
        text: '此地是青丘东泽，离招摇山不过百里，狌狌常在此处结群，善走善匿，虽不似驳兽嗜杀，却也能轻易撕碎生人。',
        portrait: 'oldman'
      },
      {
        speaker: '老樵夫',
        text: '大荒之中，无刃者，走不出三里便成了兽饵。',
        portrait: 'oldman'
      },
      {
        speaker: '旁白',
        text: '樵夫放下薪柴，目光落在少年空空的双手上，叹了口气。说罢，樵夫自薪柴后拖出一柄大刀：刀身阔尺许，以昆吾山的山铁锻铸，沉实厚重，刃口虽无锋芒，却隐隐泛着墨色的铁光，刀柄缠以坚韧的兕皮，握处已被磨得温润。这便是山铁大刀，是樵夫年轻时入昆吾山采铁，耗三年才锻成的物件。',
      },
      {
        speaker: '老樵夫',
        text: '这刀赠你。',
        portrait: 'oldman'
      },
      {
        speaker: '旁白',
        text: '樵夫将刀塞到少年手中，沉坠的重量让少年踉跄了一下，却也莫名生出几分踏实，"昆吾山的山铁，最能吸大荒凶兽的魂气——你若想在这大荒活下去，甚至想寻回你来时的路，便用这刀斩兽。"',
      },
      {
        speaker: '少年',
        text: '斩兽？',
        portrait: 'youth'
      },
      {
        speaker: '老樵夫',
        text: '大荒的兽，皆蕴山海之灵。狌狌的髓、驳的血、蜚的鳞，皆能淬进山铁里。',
        portrait: 'oldman'
      },
      {
        speaker: '旁白',
        text: '樵夫指向刀身，那墨色铁光中似有微芒闪动。',
      },
      {
        speaker: '老樵夫',
        text: '此刀如今只是粗坯，你斩的兽越多，吸的灵越盛，刀便越利、越沉、越有魂。待刀身淬满百兽之灵，便能熔锻为"大荒斩"——唯有铸成这般神兵，你才够得着这大荒的"道"，要么寻得归途，要么，便做这荒泽的镇兽之人。',
        portrait: 'oldman'
      },
      {
        speaker: '老樵夫',
        text: '先去斩些浅泽的狌狌吧——那兽状如禺而白耳，伏行人走，捷如惊风，虽凶性稍缓，却最练你挥刀的准头与步法。记住，刀随人走，人随刀强，大荒的路，唯有刀锋能趟出来。',
        portrait: 'oldman'
      },
      {
        speaker: '旁白',
        text: '樵夫的身影没入青丘的雾霭中，只留下一句"莫贪多，先淬刃，再锻心"。',
      },
      {
        speaker: '旁白',
        text: '少年立在泽畔，握着山铁大刀，刀身的寒意顺着掌心漫进四肢，却压下了心底的茫然。他望向西南，那片藏着狌狌的荒林里，兽啸仍在回荡，却不再让他恐惧——',
      },
      {
        speaker: '旁白',
        text: '他知道，这柄山铁大刀，是他在大荒的唯一凭依；而那些盘踞在《山海经》字页里的凶兽，不再是纸上的墨痕，而是他淬刀的砺石。',
      },
      {
        speaker: '旁白',
        text: '少年抬手，将大刀横在身前，刀身映着青丘泽的残阳，墨光灼灼。他没有回头，也没有迟疑，一步步踏入西南的雾林，脚步踩碎苍苔，刀风劈开漫卷的玄雾。',
      },
      {
        speaker: '旁白',
        text: '他的目标清晰如刃：先斩狌狌，再猎驳，逐次深入大荒的腹地，从青丘到招摇，从昆吾到昆仑，斩尽沿途的凶兽，让每一次挥刀都为山铁吸灵。',
      },
      {
        speaker: '旁白',
        text: '他要让这柄粗朴的山铁大刀，在百兽之血、百兽之魂的淬炼下，褪去凡铁之相，铸成能斩开大荒迷雾、甚至能劈开时空壁垒的神兵。',
      },
      {
        speaker: '旁白',
        text: '而这一切的开端，都在他挥起山铁大刀，斩向第一头狌狌的那一刻。',
      }
    ];
  }

  /**
   * Show the dialog screen
   * @param {Function} onComplete - Callback when dialog completes
   */
  show(onComplete) {
    this.onCompleteCallback = onComplete;
    this.currentDialogIndex = 0;
    this.dialogs = this.storyDialogs;
    this.notificationShown = false;
    this.render();
  }

  /**
   * Hide the dialog screen
   */
  hide() {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
      this.typingTimer = null;
    }
    // Remove keyboard listener
    if (this.handleKeyPress) {
      document.removeEventListener('keydown', this.handleKeyPress);
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
   * Render the dialog screen
   */
  render() {
    let container = document.getElementById(this.containerId);

    // Remove existing container to prevent duplicates
    if (container) {
      container.remove();
    }

    container = document.createElement('div');
    container.id = this.containerId;
    container.className = 'screen';
    document.getElementById('app').appendChild(container);

    // Clear any existing notifications
    const existingNotification = document.getElementById('blade-acquisition-notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    container.innerHTML = `
      <div id="dialog-container">
        <div id="dialog-background">
          <img src="/assets/images/background/background.png" alt="大荒背景">
        </div>
        <div id="dialog-overlay"></div>

        <div id="dialog-content">
          <div id="dialog-header">
            <div id="dialog-speaker"></div>
            <div id="dialog-progress">1 / ${this.dialogs.length}</div>
          </div>

          <div id="dialog-text-container">
            <div id="dialog-text"></div>
            <div id="dialog-continue-hint">点击继续 ▼</div>
          </div>
        </div>

        <button id="dialog-skip" class="dialog-skip-btn">跳过剧情 [ESC]</button>
      </div>
    `;

    this.element = container;

    // Add event listeners
    const containerEl = container.querySelector('#dialog-container');
    const skipBtn = container.querySelector('#dialog-skip');

    containerEl.addEventListener('click', () => this.advance());
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.skipToEnd();
    });

    // Keyboard support
    this.handleKeyPress = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.advance();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.skipToEnd();
      }
    };
    document.addEventListener('keydown', this.handleKeyPress);

    // Show the screen
    container.classList.add('active');

    // Start first dialog
    this.showCurrentDialog();
  }

  /**
   * Show current dialog with typing effect
   */
  showCurrentDialog() {
    if (this.currentDialogIndex >= this.dialogs.length) {
      this.complete();
      return;
    }

    const dialog = this.dialogs[this.currentDialogIndex];
    const speakerEl = document.querySelector('#dialog-speaker');
    const textEl = document.querySelector('#dialog-text');
    const progressEl = document.querySelector('#dialog-progress');
    const hintEl = document.querySelector('#dialog-continue-hint');

    if (!speakerEl || !textEl || !progressEl || !hintEl) {
      return;
    }

    // Update speaker
    speakerEl.textContent = dialog.speaker;
    speakerEl.className = 'speaker-' + (dialog.portrait || 'narrator');

    // Update progress
    progressEl.textContent = `${this.currentDialogIndex + 1} / ${this.dialogs.length}`;

    // Clear previous text
    textEl.textContent = '';
    hintEl.style.opacity = '0';

    // Typing effect
    this.isTyping = true;
    this.currentCharIndex = 0;
    this.typeText(dialog.text, textEl, hintEl);
  }

  /**
   * Type text with animation
   */
  typeText(text, element, hintElement) {
    if (this.currentCharIndex < text.length) {
      element.textContent += text.charAt(this.currentCharIndex);
      this.currentCharIndex++;
      this.typingTimer = setTimeout(() => {
        this.typeText(text, element, hintElement);
      }, 40); // Typing speed
    } else {
      this.isTyping = false;
      hintElement.style.opacity = '1';
    }
  }

  /**
   * Advance to next dialog or complete if typing finished
   */
  advance() {
    if (this.isTyping) {
      // Instant complete current typing
      clearTimeout(this.typingTimer);
      const dialog = this.dialogs[this.currentDialogIndex];
      const textEl = document.querySelector('#dialog-text');
      const hintEl = document.querySelector('#dialog-continue-hint');
      if (textEl && hintEl) {
        textEl.textContent = dialog.text;
        this.isTyping = false;
        hintEl.style.opacity = '1';
      }
      return;
    }

    this.currentDialogIndex++;
    this.showCurrentDialog();
  }

  /**
   * Skip to end and show blade notification
   */
  skipToEnd() {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
    this.currentDialogIndex = this.dialogs.length;
    this.complete();
  }

  /**
   * Complete the dialog and show blade acquisition notification
   */
  complete() {
    // Prevent showing notification multiple times
    if (this.notificationShown) {
      return;
    }
    this.notificationShown = true;

    // Remove keyboard listener
    if (this.handleKeyPress) {
      document.removeEventListener('keydown', this.handleKeyPress);
    }

    // Show blade acquisition notification
    this.showBladeNotification();
  }

  /**
   * Show blade acquisition notification
   */
  showBladeNotification() {
    // Remove any existing notification first
    const existingNotification = document.getElementById('blade-acquisition-notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    const container = document.querySelector('#dialog-container');
    if (!container) {
      if (this.onCompleteCallback) {
        this.onCompleteCallback();
      }
      return;
    }

    // Create notification overlay
    const notification = document.createElement('div');
    notification.id = 'blade-acquisition-notification';
    notification.innerHTML = `
      <div class="blade-notification-content">
        <img class="blade-notification-icon" src="${this.bladeImage}" alt="山铁樵刀">
        <div class="blade-notification-title">恭喜玩家</div>
        <div class="blade-notification-blade-name">获得「山铁樵刀」</div>
        <div class="blade-notification-desc">昆吾山山铁锻铸，沉实厚重</div>
        <button class="blade-notification-btn">踏上大荒之路</button>
      </div>
    `;

    container.appendChild(notification);

    // Add animation class
    setTimeout(() => {
      notification.classList.add('show');
    }, 50);

    // Handle button click
    const btn = notification.querySelector('.blade-notification-btn');
    const handleClick = () => {
      notification.classList.add('hide');
      setTimeout(() => {
        this.hide();
        if (this.onCompleteCallback) {
          this.onCompleteCallback();
        }
      }, 500);
    };

    btn.addEventListener('click', handleClick);

    // Also allow clicking notification content to proceed
    notification.addEventListener('click', (e) => {
      if (e.target !== btn && !btn.contains(e.target)) {
        handleClick();
      }
    });
  }
}
