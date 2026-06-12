// =============================================
// BLOCK DROP – TUTORIAL
// Interactive step-by-step tutorial
// =============================================

(function() {

  let active = false;
  let step = 0;
  let animTimer = 0;

  const STEPS = [
    { tk: 'tut_1_title', dk: 'tut_1_desc', spotlight: null, emoji: '🎮' },
    { tk: 'tut_2_title', dk: 'tut_2_desc', spotlight: 'tray', emoji: '👆', showHand: true },
    { tk: 'tut_3_title', dk: 'tut_3_desc', spotlight: 'grid', emoji: '⭐' },
    { tk: 'tut_4_title', dk: 'tut_4_desc', spotlight: 'grid', emoji: '🔥' },
    { tk: 'tut_5_title', dk: 'tut_5_desc', spotlight: 'powerups', emoji: '💪' },
    { tk: 'tut_6_title', dk: 'tut_6_desc', spotlight: null, emoji: '🌟' },
    { tk: 'tut_7_title', dk: 'tut_7_desc', spotlight: null, emoji: '🚀' },
  ];

  BD.Tutorial = {
    get active() { return active; },
    get step() { return step; },

    shouldShow() {
      return !BD.Storage.isTutorialDone();
    },

    start() {
      active = true;
      step = 0;
      animTimer = 0;
    },

    next() {
      step++;
      animTimer = 0;
      if (step >= STEPS.length) {
        this.finish();
      }
    },

    skip() {
      this.finish();
    },

    finish() {
      active = false;
      step = 0;
      BD.Storage.setTutorialDone(true);
    },

    update(dt) {
      if (!active) return;
      animTimer += dt;
    },

    // Hit test: tap anywhere to proceed, or skip button
    handleTap(px, py) {
      if (!active) return false;

      // Skip button
      const skipX = BD.W - 130;
      const skipY = 40;
      if (px >= skipX && px <= skipX + 100 && py >= skipY && py <= skipY + 45) {
        this.skip();
        return true;
      }

      // Tap to continue
      this.next();
      return true;
    },

    draw(ctx) {
      if (!active) return;
      const s = STEPS[step];
      if (!s) return;

      const theme = BD.Themes.current();
      const enterT = BD.clamp(animTimer / 0.3, 0, 1);
      const alpha = BD.easeOut(enterT);

      // Semi-transparent overlay
      ctx.fillStyle = `rgba(0,0,0,${0.55 * alpha})`;
      ctx.fillRect(0, 0, BD.W, BD.H);

      // Spotlight cutout
      ctx.save();
      if (s.spotlight && alpha > 0.5) {
        let spotX, spotY, spotW, spotH;
        if (s.spotlight === 'tray') {
          spotX = 15; spotY = BD.TRAY_TOP - 20;
          spotW = BD.W - 30; spotH = BD.TRAY_HEIGHT + 25;
        } else if (s.spotlight === 'grid') {
          spotX = BD.GRID_LEFT - 10; spotY = BD.GRID_TOP - 10;
          spotW = BD.GRID_WIDTH + 20; spotH = BD.GRID_WIDTH + 20;
        } else if (s.spotlight === 'powerups') {
          spotX = 40; spotY = BD.POWERUP_BAR_Y;
          spotW = BD.W - 80; spotH = BD.POWERUP_BAR_H + 10;
        }

        if (spotX !== undefined) {
          // Clear the spotlight area
          ctx.globalCompositeOperation = 'destination-out';
          BD.drawRoundRect(ctx, spotX, spotY, spotW, spotH, 16);
          ctx.fillStyle = 'rgba(0,0,0,1)';
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';

          // Spotlight border glow
          ctx.strokeStyle = `rgba(255,215,0,${0.5 * alpha})`;
          ctx.lineWidth = 3;
          BD.drawRoundRect(ctx, spotX, spotY, spotW, spotH, 16);
          ctx.stroke();
        }
      }
      ctx.restore();

      // Content card
      ctx.globalAlpha = alpha;
      const cardW = 480;
      const cardH = 200;
      const cardX = BD.W / 2 - cardW / 2;
      const cardY = s.spotlight === 'tray' ? 300 : BD.H / 2 - cardH / 2 + 50;

      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 30;
      BD.drawRoundRect(ctx, cardX, cardY, cardW, cardH, 22);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Emoji
      ctx.font = '48px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(s.emoji, BD.W / 2, cardY + 55);

      // Title
      ctx.fillStyle = theme.textDark;
      ctx.font = '800 28px Nunito, sans-serif';
      ctx.fillText(BD.i18n.t(s.tk), BD.W / 2, cardY + 100);

      // Description (multiline)
      ctx.fillStyle = theme.textLight;
      ctx.font = '600 22px Nunito, sans-serif';
      
      const descText = BD.i18n.t(s.dk);
      const words = descText.split(' ');
      let lines = [];
      let currentLine = '';
      for (const w of words) {
        const testLine = currentLine + w + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > cardW - 40 && currentLine.length > 0) {
          lines.push(currentLine);
          currentLine = w + ' ';
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine);

      lines.forEach((line, i) => {
        ctx.fillText(line, BD.W / 2, cardY + 135 + i * 28);
      });

      // "Tap to continue" with pulsing
      const pulse = Math.sin(animTimer * 3) * 0.2 + 0.8;
      ctx.globalAlpha = alpha * pulse;
      ctx.fillStyle = theme.accent;
      ctx.font = '600 20px Nunito, sans-serif';
      ctx.fillText('Tap to continue →', BD.W / 2, cardY + cardH + 35);

      // Step indicator dots
      ctx.globalAlpha = alpha;
      for (let i = 0; i < STEPS.length; i++) {
        ctx.beginPath();
        ctx.arc(BD.W / 2 - (STEPS.length * 12) + i * 24 + 12, cardY + cardH + 65, 5, 0, Math.PI * 2);
        ctx.fillStyle = i === step ? theme.accent : 'rgba(255,255,255,0.3)';
        ctx.fill();
      }

      // Skip button
      const skipX = BD.W - 130;
      const skipY = 40;
      BD.drawRoundRect(ctx, skipX, skipY, 100, 45, 22);
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = '700 22px Nunito, sans-serif';
      ctx.fillText(BD.i18n.t('tut_skip'), skipX + 50, skipY + 30);

      // Animated hand gesture
      if (s.showHand) {
        const handY = BD.TRAY_TOP + BD.TRAY_HEIGHT / 2 + Math.sin(animTimer * 2) * 15;
        ctx.font = '40px sans-serif';
        ctx.fillText('👆', BD.W / 2, handY);
      }

      ctx.textAlign = 'left';
      ctx.globalAlpha = 1;
    },

    reset() {
      active = false;
      step = 0;
    },
  };

})();
