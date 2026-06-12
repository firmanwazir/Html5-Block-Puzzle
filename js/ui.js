// =============================================
// BLOCK DROP – UI
// All canvas drawing: menu, header, grid, tray, modals
// =============================================

(function() {

  let showModal = null; // null | 'stats' | 'themes' | 'settings' | 'achievements'
  let displayScore = 0;
  let scoreVelocity = 0;
  let menuAnimTimer = 0;

  BD.UI = {
    get showModal() { return showModal; },
    set showModal(v) { showModal = v; },

    update(dt, actualScore) {
      if (displayScore < actualScore) {
        const diff = actualScore - displayScore;
        scoreVelocity = Math.max(scoreVelocity, diff * 3);
        displayScore += Math.ceil(scoreVelocity * dt);
        if (displayScore >= actualScore) {
          displayScore = actualScore;
          scoreVelocity = 0;
        }
      } else {
        displayScore = actualScore;
      }
      menuAnimTimer += dt;
    },

    resetScore() {
      displayScore = 0;
      scoreVelocity = 0;
    },

    // ============ BACKGROUND ============
    drawBackground(ctx) {
      const theme = BD.Themes.current();
      const grad = ctx.createLinearGradient(0, 0, 0, BD.H);
      grad.addColorStop(0, theme.bg1);
      grad.addColorStop(0.5, theme.bg2);
      grad.addColorStop(1, theme.bg3);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, BD.W, BD.H);

      ctx.fillStyle = theme.dotColor;
      for (let y = 0; y < BD.H; y += 40) {
        for (let x = 0; x < BD.W; x += 40) {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },

    // ============ LANGUAGE SELECT ============
    drawLanguageSelect(ctx, animTimer) {
      const theme = BD.Themes.current();
      
      this.drawBackground(ctx);
      
      ctx.fillStyle = theme.textDark;
      ctx.font = '800 40px Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(BD.i18n.t('select_language'), BD.W / 2, BD.H / 2 - 100);

      const btnW = 340;
      const btnH = 80;
      const btnX = BD.W / 2 - btnW / 2;
      
      // English
      BD.drawRoundRect(ctx, btnX, BD.H / 2 - 20, btnW, btnH, 20);
      ctx.fillStyle = `${theme.accent}15`;
      ctx.fill();
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = theme.textDark;
      ctx.font = '700 28px Nunito, sans-serif';
      ctx.fillText('🇺🇸 ' + BD.i18n.t('lang_en'), BD.W / 2, BD.H / 2 + 32);

      // ID
      BD.drawRoundRect(ctx, btnX, BD.H / 2 + 80, btnW, btnH, 20);
      ctx.fillStyle = `${theme.accent}15`;
      ctx.fill();
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = theme.textDark;
      ctx.font = '700 28px Nunito, sans-serif';
      ctx.fillText('🇮🇩 ' + BD.i18n.t('lang_id'), BD.W / 2, BD.H / 2 + 132);
      
      ctx.textAlign = 'left';
    },

    hitTestLanguageSelect(px, py) {
      const btnW = 340;
      const btnH = 80;
      const btnX = BD.W / 2 - btnW / 2;
      
      if (px >= btnX && px <= btnX + btnW) {
        if (py >= BD.H / 2 - 20 && py <= BD.H / 2 - 20 + btnH) return 'en';
        if (py >= BD.H / 2 + 80 && py <= BD.H / 2 + 80 + btnH) return 'id';
      }
      return null;
    },

    // ============ MAIN MENU ============
    drawMainMenu(ctx, highScore, animTimer) {
      const theme = BD.Themes.current();
      const t = animTimer || menuAnimTimer;

      const logoY = 220;
      const bounce = Math.sin(t * 1.5) * 8;

      ctx.font = '100px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🧩', BD.W / 2, logoY + bounce);

      ctx.fillStyle = theme.textDark;
      ctx.font = '900 72px Nunito, sans-serif';
      ctx.fillText('Block', BD.W / 2, logoY + 95);

      const dropGrad = ctx.createLinearGradient(BD.W/2 - 100, 0, BD.W/2 + 100, 0);
      dropGrad.addColorStop(0, theme.accent);
      dropGrad.addColorStop(1, theme.palettes[1] ? theme.palettes[1].fill : theme.accent);
      ctx.fillStyle = dropGrad;
      ctx.font = '900 72px Nunito, sans-serif';
      ctx.fillText('Drop', BD.W / 2, logoY + 165);

      ctx.fillStyle = theme.textLight;
      ctx.font = '600 26px Nunito, sans-serif';
      ctx.fillText(BD.i18n.t('subtitle'), BD.W / 2, logoY + 210);

      const palettes = theme.palettes;
      const decoBlocks = [
        { x: 90, y: 160, size: 35, ci: 0, rot: t * 0.3 },
        { x: BD.W - 90, y: 180, size: 30, ci: 1, rot: -t * 0.4 },
        { x: 70, y: 380, size: 25, ci: 2, rot: t * 0.5 },
        { x: BD.W - 70, y: 400, size: 28, ci: 3, rot: -t * 0.35 },
        { x: 130, y: 280, size: 20, ci: 4, rot: t * 0.6 },
        { x: BD.W - 130, y: 300, size: 22, ci: 5, rot: -t * 0.45 },
      ];
      for (const db of decoBlocks) {
        ctx.save();
        ctx.translate(db.x, db.y + Math.sin(t * 1.2 + db.ci) * 6);
        ctx.rotate(db.rot);
        ctx.globalAlpha = 0.6;
        BD.drawRoundRect(ctx, -db.size/2, -db.size/2, db.size, db.size, 6);
        const g = ctx.createLinearGradient(-db.size/2, -db.size/2, db.size/2, db.size/2);
        const p = palettes[db.ci % palettes.length];
        g.addColorStop(0, p.glow);
        g.addColorStop(1, p.fill);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      // PLAY BUTTON
      const btnW = 340, btnH = 90, btnX = BD.W / 2 - btnW / 2, btnY = 560;
      const btnPulse = 1 + Math.sin(t * 3) * 0.015;

      ctx.save();
      ctx.translate(BD.W/2, btnY + btnH/2);
      ctx.scale(btnPulse, btnPulse);
      ctx.translate(-BD.W/2, -(btnY + btnH/2));

      BD.drawRoundRect(ctx, btnX, btnY, btnW, btnH, 45);
      const btnGrad = ctx.createLinearGradient(btnX, btnY, btnX + btnW, btnY + btnH);
      btnGrad.addColorStop(0, theme.accent);
      btnGrad.addColorStop(1, theme.palettes[1] ? theme.palettes[1].fill : theme.accent);
      ctx.fillStyle = btnGrad;
      ctx.shadowColor = `${theme.accent}60`;
      ctx.shadowBlur = 25;
      ctx.shadowOffsetY = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 36px Nunito, sans-serif';
      ctx.fillText(BD.i18n.t('play'), BD.W / 2, btnY + 57);
      ctx.restore();

      // Stats row
      const statsY = 700;
      BD.drawRoundRect(ctx, 60, statsY, 280, 80, 16);
      ctx.fillStyle = `${theme.headerBg}`;
      ctx.fill();

      ctx.fillStyle = theme.textLight;
      ctx.font = '600 18px Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(BD.i18n.t('best_score_title'), 200, statsY + 30);
      ctx.fillStyle = theme.textDark;
      ctx.font = '800 32px Nunito, sans-serif';
      ctx.fillText(highScore.toLocaleString(), 200, statsY + 65);

      BD.drawRoundRect(ctx, BD.W - 340, statsY, 280, 80, 16);
      ctx.fillStyle = `${theme.headerBg}`;
      ctx.fill();

      ctx.fillStyle = theme.textLight;
      ctx.font = '600 18px Nunito, sans-serif';
      ctx.fillText(BD.i18n.t('achievements_title'), BD.W - 200, statsY + 30);
      ctx.fillStyle = theme.textDark;
      ctx.font = '800 32px Nunito, sans-serif';
      ctx.fillText(BD.Achievements.getProgress(), BD.W - 200, statsY + 65);

      // Bottom buttons
      const rowY = 830, smallBtnW = 180, smallBtnH = 60;

      BD.drawRoundRect(ctx, 60, rowY, smallBtnW, smallBtnH, 14);
      ctx.fillStyle = `${theme.accent}12`;
      ctx.fill();
      ctx.strokeStyle = `${theme.accent}40`;
      ctx.lineWidth = 2;
      BD.drawRoundRect(ctx, 60, rowY, smallBtnW, smallBtnH, 14);
      ctx.stroke();
      ctx.fillStyle = theme.textDark;
      ctx.font = '700 22px Nunito, sans-serif';
      ctx.fillText(BD.i18n.t('stats'), 60 + smallBtnW/2, rowY + 38);

      BD.drawRoundRect(ctx, BD.W/2 - smallBtnW/2, rowY, smallBtnW, smallBtnH, 14);
      ctx.fillStyle = `${theme.accent}12`;
      ctx.fill();
      ctx.strokeStyle = `${theme.accent}40`;
      ctx.lineWidth = 2;
      BD.drawRoundRect(ctx, BD.W/2 - smallBtnW/2, rowY, smallBtnW, smallBtnH, 14);
      ctx.stroke();
      ctx.fillStyle = theme.textDark;
      ctx.font = '700 22px Nunito, sans-serif';
      ctx.fillText(BD.i18n.t('themes'), BD.W/2, rowY + 38);

      BD.drawRoundRect(ctx, BD.W - 60 - smallBtnW, rowY, smallBtnW, smallBtnH, 14);
      ctx.fillStyle = `${theme.accent}12`;
      ctx.fill();
      ctx.strokeStyle = `${theme.accent}40`;
      ctx.lineWidth = 2;
      BD.drawRoundRect(ctx, BD.W - 60 - smallBtnW, rowY, smallBtnW, smallBtnH, 14);
      ctx.stroke();
      ctx.fillStyle = theme.textDark;
      ctx.font = '700 22px Nunito, sans-serif';
      ctx.fillText(BD.i18n.t('settings'), BD.W - 60 - smallBtnW/2, rowY + 38);

      // Sound toggles
      const toggleY = 940;
      ctx.font = '32px sans-serif';
      const soundEmoji = BD.Audio.settings.soundOn ? '🔊' : '🔇';
      const musicEmoji = BD.Audio.settings.musicOn ? '🎵' : '🔕';
      ctx.fillText(soundEmoji, BD.W / 2 - 40, toggleY);
      ctx.globalAlpha = BD.Audio.settings.musicOn ? 1 : 0.4;
      ctx.fillText(musicEmoji, BD.W / 2 + 40, toggleY);
      ctx.globalAlpha = 1;

      ctx.fillStyle = theme.textLight;
      ctx.font = '600 16px Nunito, sans-serif';
      ctx.globalAlpha = 0.5;
      ctx.fillText('v2.0 ✨', BD.W / 2, 1000);
      ctx.globalAlpha = 1;

      ctx.textAlign = 'left';
    },

    hitTestMainMenu(px, py) {
      const btnW = 340, btnH = 90, btnX = BD.W/2 - btnW/2, btnY = 560;
      if (px >= btnX && px <= btnX + btnW && py >= btnY && py <= btnY + btnH) return 'play';

      const rowY = 830, smallBtnW = 180, smallBtnH = 60;
      if (px >= 60 && px <= 60 + smallBtnW && py >= rowY && py <= rowY + smallBtnH) return 'stats';
      if (px >= BD.W/2 - smallBtnW/2 && px <= BD.W/2 + smallBtnW/2 && py >= rowY && py <= rowY + smallBtnH) return 'themes';
      if (px >= BD.W - 60 - smallBtnW && px <= BD.W - 60 && py >= rowY && py <= rowY + smallBtnH) return 'settings';

      const toggleY = 940;
      if (px >= BD.W/2 - 65 && px <= BD.W/2 - 15 && py >= toggleY - 25 && py <= toggleY + 15) return 'sound';
      if (px >= BD.W/2 + 15 && px <= BD.W/2 + 65 && py >= toggleY - 25 && py <= toggleY + 15) return 'music';

      return null;
    },

    // ============ HEADER ============
    drawHeader(ctx, score, highScore, level, animFrame) {
      const theme = BD.Themes.current();

      BD.drawRoundRect(ctx, 20, 18, BD.W - 40, 78, 18);
      ctx.fillStyle = theme.headerBg;
      ctx.shadowColor = `${theme.accent}22`;
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = theme.textLight;
      ctx.font = '600 20px Nunito, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(BD.i18n.t('score'), 46, 44);

      ctx.fillStyle = theme.textDark;
      ctx.font = '900 34px Nunito, sans-serif';
      ctx.fillText(Math.floor(displayScore).toLocaleString(), 46, 80);

      ctx.textAlign = 'center';
      const lvlBadgeX = BD.W / 2;

      const prog = BD.Levels.progressPercent();
      const ringR = 22;
      ctx.beginPath();
      ctx.arc(lvlBadgeX, 57, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = `${theme.accent}30`;
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(lvlBadgeX, 57, ringR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * prog);
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = theme.textDark;
      ctx.font = '800 22px Nunito, sans-serif';
      ctx.fillText(level, lvlBadgeX, 64);

      ctx.fillStyle = theme.textLight;
      ctx.font = '600 13px Nunito, sans-serif';
      ctx.fillText(BD.i18n.t('lvl'), lvlBadgeX, 45);

      ctx.textAlign = 'right';
      ctx.fillStyle = theme.textLight;
      ctx.font = '600 20px Nunito, sans-serif';
      ctx.fillText(BD.i18n.t('best'), BD.W - 46, 44);

      ctx.fillStyle = theme.accent;
      ctx.font = '800 30px Nunito, sans-serif';
      ctx.fillText(highScore.toLocaleString(), BD.W - 46, 80);

      ctx.textAlign = 'left';
    },

    // ============ ICON BUTTONS ============
    drawIconBar(ctx, soundOn, musicOn, animFrame) {
      const y = 108;
      const iconSize = 36;
      const icons = [
        { emoji: soundOn ? '🔊' : '🔇', x: 35, id: 'sound' },
        { emoji: musicOn ? '🎵' : '🎵', x: 85, id: 'music', alpha: musicOn ? 1 : 0.4 },
        { emoji: '📊', x: BD.W - 240, id: 'stats' },
        { emoji: '🏆', x: BD.W - 185, id: 'achievements' },
        { emoji: '🎨', x: BD.W - 130, id: 'themes' },
        { emoji: '⚙️', x: BD.W - 75, id: 'settings' },
      ];

      for (const icon of icons) {
        ctx.globalAlpha = icon.alpha || 1;
        ctx.font = `${iconSize - 6}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(icon.emoji, icon.x, y + iconSize / 2 + 4);
      }
      ctx.globalAlpha = 1;
      ctx.textAlign = 'left';
    },

    hitTestIconBar(px, py) {
      const y = 108, h = 40;
      if (py < y || py > y + h) return null;

      if (px >= 15 && px <= 60) return 'sound';
      if (px >= 65 && px <= 110) return 'music';
      if (px >= BD.W - 260 && px <= BD.W - 215) return 'stats';
      if (px >= BD.W - 205 && px <= BD.W - 160) return 'achievements';
      if (px >= BD.W - 150 && px <= BD.W - 105) return 'themes';
      if (px >= BD.W - 95 && px <= BD.W - 50) return 'settings';
      return null;
    },

    // ============ TITLE ============
    drawTitle(ctx) {
      const theme = BD.Themes.current();
      ctx.fillStyle = theme.textDark;
      ctx.font = '800 32px Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ Block Drop ✨', BD.W / 2, 175);

      ctx.fillStyle = theme.textLight;
      ctx.font = '600 18px Nunito, sans-serif';
      const target = BD.Levels.currentTarget().toLocaleString();
      ctx.fillText(`${BD.i18n.t('target')}: ${target} ${BD.i18n.t('pts')}`, BD.W / 2, 200);
      ctx.textAlign = 'left';
    },

    // ============ GRID ============
    drawGrid(ctx, dragging, animFrame, gameOverFade) {
      const theme = BD.Themes.current();

      BD.drawRoundRect(ctx, BD.GRID_LEFT - 6, BD.GRID_TOP - 6, BD.GRID_WIDTH + 12, BD.GRID_WIDTH + 12, 16);
      ctx.fillStyle = theme.gridBg;
      ctx.fill();
      ctx.strokeStyle = theme.gridBorder;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.shadowColor = `${theme.accent}10`;
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 6;
      BD.drawRoundRect(ctx, BD.GRID_LEFT - 6, BD.GRID_TOP - 6, BD.GRID_WIDTH + 12, BD.GRID_WIDTH + 12, 16);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      let highlights = new Set();
      if (dragging) {
        const cells = dragging.shape.cells;
        const bounds = BD.getShapeBounds(cells);
        const bx = dragging.x + dragging.offsetX;
        const by = dragging.y + dragging.offsetY;
        const ax = bx - (bounds.w * (BD.CELL_SIZE + BD.CELL_GAP) - BD.CELL_GAP) / 2 + BD.CELL_SIZE / 2;
        const ay = by - (bounds.h * (BD.CELL_SIZE + BD.CELL_GAP) - BD.CELL_GAP) / 2 + BD.CELL_SIZE / 2;
        const snap = BD.Grid.snapToGrid(ax, ay);

        if (snap.row >= 0 && snap.col >= 0 && BD.Grid.canPlace(cells, snap.row, snap.col)) {
          highlights = BD.Grid.previewClear(cells, snap.row, snap.col, dragging.colorIndex);
        }
      }

      const grid = BD.Grid.data;
      const palettes = theme.palettes;

      for (let r = 0; r < BD.GRID_SIZE; r++) {
        for (let c = 0; c < BD.GRID_SIZE; c++) {
          const x = BD.cellX(c);
          const y = BD.cellY(r);
          const val = grid[r][c];

          const anim = BD.Particles.getCellAnim(r, c);

          let goFade = 1;
          if (gameOverFade > 0 && val !== -1) {
            const cellDelay = (r + c) * 0.04;
            const fadeT = BD.clamp((gameOverFade - cellDelay) / 0.3, 0, 1);
            goFade = 1 - BD.easeOut(fadeT);
          }

          if (val === -1) {
            BD.drawRoundRect(ctx, x, y, BD.CELL_SIZE, BD.CELL_SIZE, 8);
            const isHL = highlights.has(`${r},${c}`);
            ctx.fillStyle = isHL ? `${theme.accent}25` : theme.cellEmpty;
            ctx.fill();
          } else {
            const palette = palettes[val % palettes.length];
            const isHL = highlights.has(`${r},${c}`);

            let scale = 1;
            let alphaOverride = goFade;

            if (anim && anim.type === 'bounceIn') {
              const t = anim.t;
              if (t < 0.4) scale = BD.lerp(1.25, 0.93, t / 0.4);
              else scale = BD.lerp(0.93, 1.0, (t - 0.4) / 0.6);
            }

            if (anim && anim.type === 'waveClear') {
              scale = BD.lerp(1.0, 0.0, BD.easeInOut(anim.t));
              alphaOverride = (1 - anim.t) * goFade;
            }

            if (gameOverFade > 0) {
              const cellDelay = (r + c) * 0.04;
              const fadeT = BD.clamp((gameOverFade - cellDelay) / 0.3, 0, 1);
              scale *= (1 - fadeT * 0.3);
            }

            if (isHL) {
              ctx.shadowColor = palette.fill;
              ctx.shadowBlur = 15;
            }

            ctx.save();
            const cx = x + BD.CELL_SIZE / 2;
            const cy = y + BD.CELL_SIZE / 2;
            ctx.translate(cx, cy);
            ctx.scale(scale, scale);
            ctx.translate(-cx, -cy);
            ctx.globalAlpha = alphaOverride;

            BD.drawRoundRect(ctx, x, y, BD.CELL_SIZE, BD.CELL_SIZE, 10);
            const cellGrad = ctx.createLinearGradient(x, y, x, y + BD.CELL_SIZE);
            cellGrad.addColorStop(0, palette.glow);
            cellGrad.addColorStop(0.4, palette.fill);
            cellGrad.addColorStop(1, palette.stroke);
            ctx.fillStyle = cellGrad;
            ctx.fill();

            ctx.shadowBlur = 0;

            BD.drawRoundRect(ctx, x + 4, y + 4, BD.CELL_SIZE - 8, BD.CELL_SIZE * 0.42, 6);
            ctx.fillStyle = 'rgba(255,255,255,0.35)';
            ctx.fill();

            if (isHL) {
              const pulse = Math.sin(animFrame * 0.1) * 0.15 + 0.15;
              BD.drawRoundRect(ctx, x, y, BD.CELL_SIZE, BD.CELL_SIZE, 10);
              ctx.fillStyle = `rgba(255,255,255,${pulse})`;
              ctx.fill();
            }

            ctx.restore();
            ctx.globalAlpha = 1;
          }
        }
      }
    },

    // ============ POWERUP BAR ============
    drawPowerupBar(ctx, animFrame) {
      const theme = BD.Themes.current();
      const layout = BD.Powerups.getBarLayout();

      BD.drawRoundRect(ctx, 30, BD.POWERUP_BAR_Y, BD.W - 60, BD.POWERUP_BAR_H, 14);
      ctx.fillStyle = theme.headerBg;
      ctx.fill();

      for (const btn of layout) {
        const isActive = BD.Powerups.activeMode === btn.type;
        const canUse = BD.Powerups.canUse(btn.type);

        BD.drawRoundRect(ctx, btn.x, btn.y, btn.size, btn.size, 12);
        if (isActive) {
          ctx.fillStyle = `${theme.accent}40`;
          ctx.strokeStyle = theme.accent;
          ctx.lineWidth = 2;
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.fillStyle = canUse ? `${theme.accent}15` : `${theme.textLight}10`;
          ctx.fill();
        }

        ctx.globalAlpha = canUse ? 1 : 0.55;
        ctx.fillStyle = theme.textDark; 
        ctx.font = '28px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(btn.emoji, btn.x + btn.size / 2, btn.y + btn.size / 2 + 10);

        if (btn.count > 0) {
          const badgeX = btn.x + btn.size - 10;
          const badgeY = btn.y + 2;
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(badgeX, badgeY + 10, 12, 0, Math.PI * 2);
          ctx.fillStyle = theme.accent;
          ctx.fill();
          ctx.fillStyle = '#FFF';
          ctx.font = '700 14px Nunito, sans-serif';
          ctx.fillText(btn.count, badgeX, badgeY + 15);
        } else {
          const badgeX = btn.x + btn.size - 10;
          const badgeY = btn.y + 2;
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(badgeX, badgeY + 10, 10, 0, Math.PI * 2);
          ctx.fillStyle = theme.textLight;
          ctx.fill();
          ctx.fillStyle = '#FFF';
          ctx.font = '700 12px Nunito, sans-serif';
          ctx.fillText('?', badgeX, badgeY + 14);
        }

        ctx.globalAlpha = 1;
      }

      if (BD.Powerups.colorBlastChoosing) {
        const colors = BD.Grid.getColorsOnBoard();
        if (colors.length > 0) {
          const popupW = colors.length * 65 + 20;
          const popupX = BD.W / 2 - popupW / 2;
          const popupY = BD.POWERUP_BAR_Y - 80;

          BD.drawRoundRect(ctx, popupX, popupY, popupW, 65, 14);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = 'rgba(0,0,0,0.15)';
          ctx.shadowBlur = 15;
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.fillStyle = theme.textLight;
          ctx.font = '600 14px Nunito, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(BD.i18n.t('pick_color'), BD.W / 2, popupY - 8);

          const palettes = theme.palettes;
          for (let i = 0; i < colors.length; i++) {
            const ci = colors[i];
            const chipX = popupX + 10 + i * 65 + 7;
            const chipY = popupY + 8;
            BD.drawRoundRect(ctx, chipX, chipY, 50, 50, 10);
            const p = palettes[ci % palettes.length];
            ctx.fillStyle = p.fill;
            ctx.fill();
            BD.drawRoundRect(ctx, chipX + 4, chipY + 4, 42, 20, 6);
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.fill();
          }
        }
      }

      ctx.textAlign = 'left';
    },

    // ============ TRAY ============
    drawTray(ctx, dragging) {
      const theme = BD.Themes.current();
      const tray = BD.Tray.data;

      BD.drawRoundRect(ctx, 20, BD.TRAY_TOP - 12, BD.W - 40, BD.TRAY_HEIGHT + 12, 18);
      ctx.fillStyle = `${theme.headerBg}`;
      ctx.fill();

      ctx.fillStyle = theme.textLight;
      ctx.font = '600 18px Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(BD.i18n.t('drag_blocks'), BD.W / 2, BD.TRAY_TOP + 10);
      ctx.textAlign = 'left';

      const palettes = theme.palettes;
      const refillAnim = BD.Tray.refillAnim;

      for (let i = 0; i < BD.TRAY_SLOTS; i++) {
        if (!tray[i]) continue;
        if (dragging && dragging.slotIndex === i) continue;

        const piece = tray[i];
        const { x: cx, y: cy } = BD.Tray.getTraySlotCenter(i);
        const canPl = BD.Grid.canPlaceAnywhere(piece);
        let alpha = canPl ? 1.0 : 0.35;

        let offsetY = 0;
        let scaleAnim = 1;
        if (refillAnim > 0) {
          const stagger = i * 0.08;
          const t = BD.clamp((1 - refillAnim - stagger) / 0.35, 0, 1);
          const eased = BD.easeOut(t);
          offsetY = (1 - eased) * 120;
          scaleAnim = 0.5 + eased * 0.5;
          alpha *= eased;
        }

        this.drawBlockShape(ctx, piece.shape.cells, piece.colorIndex, cx, cy + 15 + offsetY, BD.TRAY_BLOCK_SCALE * scaleAnim, alpha, palettes);
      }
    },

    drawBlockShape(ctx, cells, colorIndex, cx, cy, scale, alpha, palettes) {
      palettes = palettes || BD.Themes.current().palettes;
      const palette = palettes[colorIndex % palettes.length];
      const bounds = BD.getShapeBounds(cells);
      const totalW = bounds.w * (BD.CELL_SIZE + BD.CELL_GAP) - BD.CELL_GAP;
      const totalH = bounds.h * (BD.CELL_SIZE + BD.CELL_GAP) - BD.CELL_GAP;
      const startX = cx - (totalW * scale) / 2;
      const startY = cy - (totalH * scale) / 2;

      ctx.globalAlpha = alpha;
      for (const [dc, dr] of cells) {
        const bx = startX + dc * (BD.CELL_SIZE + BD.CELL_GAP) * scale;
        const by = startY + dr * (BD.CELL_SIZE + BD.CELL_GAP) * scale;
        const bs = BD.CELL_SIZE * scale;

        ctx.shadowColor = 'rgba(0,0,0,0.12)';
        ctx.shadowBlur = 8 * scale;
        ctx.shadowOffsetY = 4 * scale;

        BD.drawRoundRect(ctx, bx, by, bs, bs, 8 * scale);
        const grad = ctx.createLinearGradient(bx, by, bx, by + bs);
        grad.addColorStop(0, palette.glow);
        grad.addColorStop(0.4, palette.fill);
        grad.addColorStop(1, palette.stroke);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        BD.drawRoundRect(ctx, bx + 3 * scale, by + 3 * scale, bs - 6 * scale, bs * 0.4, 5 * scale);
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    },

    drawDragging(ctx, dragging) {
      if (!dragging) return;

      const cells = dragging.shape.cells;
      const bounds = BD.getShapeBounds(cells);
      const bx = dragging.x + dragging.offsetX;
      const by = dragging.y + dragging.offsetY;

      const ax = bx - (bounds.w * (BD.CELL_SIZE + BD.CELL_GAP) - BD.CELL_GAP) / 2 + BD.CELL_SIZE / 2;
      const ay = by - (bounds.h * (BD.CELL_SIZE + BD.CELL_GAP) - BD.CELL_GAP) / 2 + BD.CELL_SIZE / 2;
      const snap = BD.Grid.snapToGrid(ax, ay);
      const theme = BD.Themes.current();

      if (snap.row >= 0 && snap.col >= 0) {
        const valid = BD.Grid.canPlace(cells, snap.row, snap.col);
        for (const [dc, dr] of cells) {
          const r = snap.row + dr;
          const c = snap.col + dc;
          if (r < 0 || r >= BD.GRID_SIZE || c < 0 || c >= BD.GRID_SIZE) continue;
          const gx = BD.cellX(c);
          const gy = BD.cellY(r);
          BD.drawRoundRect(ctx, gx, gy, BD.CELL_SIZE, BD.CELL_SIZE, 8);
          ctx.fillStyle = valid ? `${theme.accent}35` : 'rgba(255,80,80,0.2)';
          ctx.fill();
          if (valid) {
            ctx.strokeStyle = `${theme.accent}70`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      }

      this.drawBlockShape(ctx, cells, dragging.colorIndex, bx, by, 1.0, 0.85);
    },

    // ============ GAME OVER ============
    drawGameOver(ctx, score, highScore, level, isNewBest, gameOverTimer) {
      const theme = BD.Themes.current();
      const t = BD.clamp((gameOverTimer - 0.8) / 0.5, 0, 1);
      if (t <= 0) return;
      const alpha = BD.easeOut(t);

      ctx.fillStyle = `${theme.bg1}E8`;
      ctx.globalAlpha = alpha;
      ctx.fillRect(0, 0, BD.W, BD.H);

      const cardW = 440, cardH = 520;
      const cardX = BD.W / 2 - cardW / 2;
      const cardY = BD.H / 2 - cardH / 2 - 20 * (1 - alpha);

      ctx.shadowColor = `${theme.accent}25`;
      ctx.shadowBlur = 40;
      BD.drawRoundRect(ctx, cardX, cardY, cardW, cardH, 28);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font = '64px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(isNewBest ? '🎉' : '🌟', BD.W / 2, cardY + 70);

      ctx.fillStyle = theme.textDark;
      ctx.font = '900 44px Nunito, sans-serif';
      ctx.fillText(BD.i18n.t('game_over'), BD.W / 2, cardY + 130);

      ctx.fillStyle = theme.textLight;
      ctx.font = '700 24px Nunito, sans-serif';
      ctx.fillText(`${BD.i18n.t('level')} ${level}`, BD.W / 2, cardY + 165);

      ctx.fillStyle = theme.textLight;
      ctx.font = '600 24px Nunito, sans-serif';
      ctx.fillText(BD.i18n.t('final_score'), BD.W / 2, cardY + 210);

      ctx.fillStyle = theme.accent;
      ctx.font = '900 52px Nunito, sans-serif';
      ctx.fillText(score.toLocaleString(), BD.W / 2, cardY + 265);

      if (isNewBest) {
        ctx.fillStyle = '#FFB347';
        ctx.font = '700 24px Nunito, sans-serif';
        ctx.fillText(BD.i18n.t('new_best'), BD.W / 2, cardY + 300);
      }

      ctx.fillStyle = theme.textLight;
      ctx.font = '600 18px Nunito, sans-serif';
      ctx.fillText(`${BD.i18n.t('achievements')}: ${BD.Achievements.getProgress()}`, BD.W / 2, cardY + 340);

      const btnW = 260, btnH = 70;
      const btnX = BD.W / 2 - btnW / 2;
      const btnY = cardY + 365;

      BD.drawRoundRect(ctx, btnX, btnY, btnW, btnH, 35);
      const btnGrad = ctx.createLinearGradient(btnX, btnY, btnX + btnW, btnY + btnH);
      btnGrad.addColorStop(0, theme.accent);
      btnGrad.addColorStop(1, theme.palettes[5] ? theme.palettes[5].fill : theme.accent);
      ctx.fillStyle = btnGrad;
      ctx.shadowColor = `${theme.accent}50`;
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 4;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 26px Nunito, sans-serif';
      ctx.fillText(BD.i18n.t('play_again'), BD.W / 2, btnY + 44);

      const shareBtnY = btnY + btnH + 14;
      BD.drawRoundRect(ctx, btnX, shareBtnY, btnW, 50, 25);
      ctx.fillStyle = `${theme.accent}15`;
      ctx.fill();
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 2;
      BD.drawRoundRect(ctx, btnX, shareBtnY, btnW, 50, 25);
      ctx.stroke();

      ctx.fillStyle = theme.accent;
      ctx.font = '700 20px Nunito, sans-serif';
      ctx.fillText(BD.i18n.t('share_score'), BD.W / 2, shareBtnY + 32);

      const menuBtnY = shareBtnY + 64;
      ctx.fillStyle = theme.textLight;
      ctx.font = '700 20px Nunito, sans-serif';
      ctx.fillText(BD.i18n.t('main_menu'), BD.W / 2, menuBtnY);

      ctx.textAlign = 'left';
      ctx.globalAlpha = 1;
    },

    hitTestGameOver(px, py, gameOverTimer) {
      if ((gameOverTimer || 0) < 1.0) return null;
      const cardW = 440, cardH = 520;
      const cardY = BD.H / 2 - cardH / 2;
      const btnW = 260, btnX = BD.W / 2 - btnW / 2;
      const btnY = cardY + 365;

      if (px >= btnX && px <= btnX + btnW && py >= btnY && py <= btnY + 70) return 'restart';
      if (px >= btnX && px <= btnX + btnW && py >= btnY + 84 && py <= btnY + 134) return 'share';
      if (px >= btnX && px <= btnX + btnW && py >= btnY + 140 && py <= btnY + 180) return 'menu';
      return null;
    },

    // ============ MODALS ============
    drawModal(ctx) {
      if (!showModal) return;

      const theme = BD.Themes.current();

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, BD.W, BD.H);

      const modalW = 600, modalH = 900;
      const mx = BD.W / 2 - modalW / 2;
      const my = BD.H / 2 - modalH / 2;

      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 40;
      BD.drawRoundRect(ctx, mx, my, modalW, modalH, 24);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.shadowBlur = 0;

      BD.drawRoundRect(ctx, mx + modalW - 55, my + 12, 42, 42, 21);
      ctx.fillStyle = '#F0F0F0';
      ctx.fill();
      ctx.fillStyle = '#999';
      ctx.font = '700 24px Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✕', mx + modalW - 34, my + 40);

      if (showModal === 'stats') this.drawStatsModal(ctx, mx, my, modalW, modalH, theme);
      else if (showModal === 'achievements') this.drawAchievementsModal(ctx, mx, my, modalW, modalH, theme);
      else if (showModal === 'themes') this.drawThemesModal(ctx, mx, my, modalW, modalH, theme);
      else if (showModal === 'settings') this.drawSettingsModal(ctx, mx, my, modalW, modalH, theme);

      ctx.textAlign = 'left';
    },

    drawStatsModal(ctx, mx, my, mw, mh, theme) {
      ctx.textAlign = 'center';
      ctx.fillStyle = theme.textDark;
      ctx.font = '900 34px Nunito, sans-serif';
      ctx.fillText(BD.i18n.t('stats_title'), mx + mw / 2, my + 65);

      const stats = BD.Stats.getDisplayStats(); // We need to localize these in stats.js or here
      const cardW = 240, cardH = 90, gap = 20, cols = 2;
      const startX = mx + (mw - cols * cardW - gap) / 2;
      let startY = my + 100;

      stats.forEach((stat, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = startX + col * (cardW + gap);
        const cy = startY + row * (cardH + gap);

        BD.drawRoundRect(ctx, cx, cy, cardW, cardH, 14);
        ctx.fillStyle = `${theme.accent}08`;
        ctx.fill();
        ctx.strokeStyle = `${theme.accent}20`;
        ctx.lineWidth = 1;
        BD.drawRoundRect(ctx, cx, cy, cardW, cardH, 14);
        ctx.stroke();

        ctx.fillStyle = theme.textLight;
        ctx.font = '600 18px Nunito, sans-serif';
        // stat.label requires i18n
        ctx.fillText(`${stat.icon} ${stat.label}`, cx + cardW / 2, cy + 35);

        ctx.fillStyle = theme.textDark;
        ctx.font = '800 28px Nunito, sans-serif';
        ctx.fillText(stat.value, cx + cardW / 2, cy + 70);
      });
    },

    drawAchievementsModal(ctx, mx, my, mw, mh, theme) {
      ctx.textAlign = 'center';
      ctx.fillStyle = theme.textDark;
      ctx.font = '900 34px Nunito, sans-serif';
      ctx.fillText(`${BD.i18n.t('achievements_modal_title')} (${BD.Achievements.getProgress()})`, mx + mw / 2, my + 65);

      const defs = BD.Achievements.DEFS;
      const itemH = 64;
      let y = my + 95;

      for (const def of defs) {
        if (y + itemH > my + mh - 20) break;

        const isUnlocked = BD.Achievements.isUnlocked(def.id);

        BD.drawRoundRect(ctx, mx + 20, y, mw - 40, itemH - 6, 12);
        ctx.fillStyle = isUnlocked ? `${theme.accent}10` : '#F8F8F8';
        ctx.fill();

        if (isUnlocked) {
          ctx.strokeStyle = `${theme.accent}30`;
          ctx.lineWidth = 1;
          BD.drawRoundRect(ctx, mx + 20, y, mw - 40, itemH - 6, 12);
          ctx.stroke();
        }

        ctx.globalAlpha = isUnlocked ? 1 : 0.3;
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(def.icon, mx + 38, y + 40);

        ctx.fillStyle = isUnlocked ? theme.textDark : theme.textLight;
        ctx.font = '700 20px Nunito, sans-serif';
        ctx.fillText(BD.i18n.t(def.nameKey), mx + 80, y + 28);

        ctx.fillStyle = theme.textLight;
        ctx.font = '600 16px Nunito, sans-serif';
        ctx.fillText(BD.i18n.t(def.descKey), mx + 80, y + 50);

        if (isUnlocked) {
          ctx.textAlign = 'right';
          ctx.fillStyle = '#4CAF50';
          ctx.font = '24px sans-serif';
          ctx.fillText('✅', mx + mw - 40, y + 38);
          ctx.textAlign = 'left';
        }

        ctx.globalAlpha = 1;
        y += itemH;
      }
      ctx.textAlign = 'left';
    },

    drawThemesModal(ctx, mx, my, mw, mh, theme) {
      ctx.textAlign = 'center';
      ctx.fillStyle = theme.textDark;
      ctx.font = '900 34px Nunito, sans-serif';
      ctx.fillText(BD.i18n.t('themes_modal_title'), mx + mw / 2, my + 65);

      const themes = BD.Themes.getAllThemes();
      const itemH = 120;
      let y = my + 95;

      for (const t of themes) {
        if (y + itemH > my + mh - 20) break;

        const isUnlocked = BD.Themes.isUnlocked(t.id);
        const isCurrent = BD.Themes.currentId() === t.id;

        BD.drawRoundRect(ctx, mx + 20, y, mw - 40, itemH - 10, 16);
        ctx.fillStyle = isCurrent ? `${t.accent}18` : '#F8F8F8';
        ctx.fill();

        if (isCurrent) {
          ctx.strokeStyle = t.accent;
          ctx.lineWidth = 2;
          BD.drawRoundRect(ctx, mx + 20, y, mw - 40, itemH - 10, 16);
          ctx.stroke();
        }

        ctx.globalAlpha = isUnlocked ? 1 : 0.4;

        ctx.fillStyle = theme.textDark;
        ctx.font = '800 24px Nunito, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(BD.i18n.t('theme_' + t.id + '_name') || t.name, mx + 40, y + 32);

        ctx.fillStyle = theme.textLight;
        ctx.font = '600 16px Nunito, sans-serif';
        ctx.fillText(isUnlocked ? (BD.i18n.t('theme_' + t.id + '_desc') || t.desc) : BD.i18n.t('locked', { req: BD.i18n.t('theme_' + t.id + '_unlock') || t.unlock }), mx + 40, y + 55);

        const swatchY = y + 68;
        for (let i = 0; i < Math.min(t.palettes.length, 7); i++) {
          const sx = mx + 40 + i * 40;
          BD.drawRoundRect(ctx, sx, swatchY, 30, 30, 8);
          ctx.fillStyle = t.palettes[i].fill;
          ctx.fill();
        }

        if (isCurrent) {
          ctx.textAlign = 'right';
          ctx.fillStyle = t.accent;
          ctx.font = '700 18px Nunito, sans-serif';
          ctx.fillText(BD.i18n.t('active'), mx + mw - 40, y + 60);
        }

        ctx.globalAlpha = 1;
        ctx.textAlign = 'left';
        y += itemH;
      }
    },

    drawSettingsModal(ctx, mx, my, mw, mh, theme) {
      ctx.textAlign = 'center';
      ctx.fillStyle = theme.textDark;
      ctx.font = '900 34px Nunito, sans-serif';
      ctx.fillText(BD.i18n.t('settings_modal_title'), mx + mw / 2, my + 65);

      const itemH = 80;
      let y = my + 100;
      const padX = mx + 30;
      const contentW = mw - 60;

      const toggleItems = [
        { label: BD.i18n.t('sound_fx'), key: 'sound', on: BD.Audio.settings.soundOn },
        { label: BD.i18n.t('bg_music'), key: 'music', on: BD.Audio.settings.musicOn },
        { label: BD.i18n.t('vibration'), key: 'vibration', on: BD.Input.isVibrationOn() },
      ];

      for (const item of toggleItems) {
        BD.drawRoundRect(ctx, padX, y, contentW, itemH - 10, 14);
        ctx.fillStyle = `${theme.accent}06`;
        ctx.fill();

        ctx.textAlign = 'left';
        ctx.fillStyle = theme.textDark;
        ctx.font = '700 24px Nunito, sans-serif';
        ctx.fillText(item.label, padX + 20, y + 45);

        const toggleX = padX + contentW - 80;
        const toggleY2 = y + 22;
        const toggleW = 56;
        const toggleH = 30;

        BD.drawRoundRect(ctx, toggleX, toggleY2, toggleW, toggleH, toggleH / 2);
        ctx.fillStyle = item.on ? theme.accent : '#D0D0D0';
        ctx.fill();

        const knobX = item.on ? toggleX + toggleW - toggleH + 4 : toggleX + 4;
        ctx.beginPath();
        ctx.arc(knobX + (toggleH - 8) / 2, toggleY2 + toggleH / 2, (toggleH - 8) / 2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;

        y += itemH;
      }

      // Language Select
      BD.drawRoundRect(ctx, padX, y, contentW, itemH - 10, 14);
      ctx.fillStyle = `${theme.accent}06`;
      ctx.fill();
      ctx.textAlign = 'left';
      ctx.fillStyle = theme.textDark;
      ctx.font = '700 24px Nunito, sans-serif';
      ctx.fillText(BD.i18n.t('language'), padX + 20, y + 45);

      const langBtnW = 100;
      const langBtnX = padX + contentW - langBtnW - 10;
      BD.drawRoundRect(ctx, langBtnX, y + 15, langBtnW, 40, 10);
      ctx.fillStyle = `${theme.accent}20`;
      ctx.fill();
      ctx.fillStyle = theme.accent;
      ctx.textAlign = 'center';
      ctx.font = '700 18px Nunito, sans-serif';
      ctx.fillText(BD.i18n.getLang() === 'id' ? '🇮🇩 ID' : '🇺🇸 EN', langBtnX + langBtnW / 2, y + 42);

      y += itemH;

      y += 10;
      ctx.fillStyle = '#F0F0F0';
      ctx.fillRect(padX + 20, y, contentW - 40, 2);
      y += 30;

      BD.drawRoundRect(ctx, padX + 60, y, contentW - 120, 65, 14);
      ctx.fillStyle = '#FFF0F0';
      ctx.fill();
      ctx.strokeStyle = '#FF6B6B';
      ctx.lineWidth = 2;
      BD.drawRoundRect(ctx, padX + 60, y, contentW - 120, 65, 14);
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#FF4444';
      ctx.font = '700 22px Nunito, sans-serif';
      ctx.fillText(BD.i18n.t('reset_progress'), mx + mw / 2, y + 40);

      y += 85;
      ctx.fillStyle = theme.textLight;
      ctx.font = '600 16px Nunito, sans-serif';
      ctx.fillText(BD.i18n.t('reset_warning_1'), mx + mw / 2, y);
      ctx.fillText(BD.i18n.t('reset_warning_2'), mx + mw / 2, y + 22);

      ctx.textAlign = 'left';
    },

    hitTestModal(px, py) {
      if (!showModal) return null;

      const modalW = 600, modalH = 900;
      const mx = BD.W / 2 - modalW / 2;
      const my = BD.H / 2 - modalH / 2;

      if (px >= mx + modalW - 55 && px <= mx + modalW - 13 &&
          py >= my + 12 && py <= my + 54) {
        return { action: 'close' };
      }

      if (showModal === 'themes') {
        const themes = BD.Themes.getAllThemes();
        const itemH = 120;
        let y = my + 95;
        for (const t of themes) {
          if (px >= mx + 20 && px <= mx + modalW - 20 &&
              py >= y && py <= y + itemH - 10) {
            return { action: 'selectTheme', themeId: t.id };
          }
          y += itemH;
        }
      }

      if (showModal === 'settings') {
        const padX = mx + 30;
        const contentW = modalW - 60;
        const itemH = 80;
        let y = my + 100;

        const keys = ['sound', 'music', 'vibration'];
        for (const key of keys) {
          if (px >= padX && px <= padX + contentW && py >= y && py <= y + itemH - 10) {
            return { action: 'toggleSetting', key };
          }
          y += itemH;
        }
        
        // Language Toggle
        if (px >= padX && px <= padX + contentW && py >= y && py <= y + itemH - 10) {
          return { action: 'toggleLanguage' };
        }
        y += itemH;

        y += 40;
        if (px >= padX + 60 && px <= padX + contentW - 60 && py >= y && py <= y + 65) {
          return { action: 'resetProgress' };
        }
      }

      return null;
    },
  };

})();
