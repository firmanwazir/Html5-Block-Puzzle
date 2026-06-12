// =============================================
// BLOCK DROP – GAME
// Main game loop, state machine, orchestration
// =============================================

(function() {

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  // ---- STATE ----
  let state = 'MENU'; // 'MENU', 'PLAYING', 'GAME_OVER', 'LANGUAGE_SELECT'
  let score = 0;
  let highScore = BD.Storage.getHighScore();
  let combo = 0;
  let dragging = null;
  let gameOver = false;
  let isNewBest = false;

  let shakeTimer = 0;
  let gameOverTimer = 0;
  let menuTimer = 0;
  let globalTime = 0;
  let lastTime = 0;

  // ---- RESPONSIVE ----
  function resize() {
    const wrapper = document.getElementById('gameWrapper');
    const scaleX = window.innerWidth / 375;
    const scaleY = window.innerHeight / 667;
    const scale = Math.min(scaleX, scaleY);
    wrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }
  window.addEventListener('resize', resize);
  resize();

  // ---- INIT SYSTEMS ----
  BD.Themes.init();
  BD.Audio.init();
  BD.Stats.init();
  BD.Achievements.init();
  BD.Powerups.init();
  BD.Levels.init();
  BD.i18n.init();

  highScore = BD.Storage.getHighScore();
  state = BD.Storage.getLanguage() ? 'MENU' : 'LANGUAGE_SELECT';

  function startNewGame() {
    BD.Grid.init();
    BD.Tray.reset();
    BD.Particles.reset();
    BD.Levels.init();
    BD.UI.resetScore();

    score = 0;
    combo = 0;
    dragging = null;
    gameOver = false;
    gameOverTimer = 0;
    shakeTimer = 0;
    isNewBest = false;
    state = 'PLAYING';

    BD.Powerups.init();
    BD.Stats.onGameStart();
    BD.Audio.startMusic();

    if (BD.Tutorial.shouldShow()) {
      BD.Tutorial.start();
    }

    checkAchievementsAndThemes();
  }

  function goToMenu() {
    state = 'MENU';
    gameOver = false;
    menuTimer = 0;
    highScore = BD.Storage.getHighScore();
    BD.Themes.checkUnlocks(BD.Stats.data);
    BD.Audio.startMusic(); // Play music on main menu
  }

  function resetAllProgress() {
    if (confirm(BD.i18n.t('reset_confirm'))) {
      BD.Storage.resetAll();
      BD.Stats.init();
      BD.Achievements.init();
      BD.Themes.init();
      BD.Powerups.init();
      highScore = 0;
      BD.UI.showModal = null;
      BD.Audio.playTap();
      goToMenu();
    }
  }

  // ---- POINTER HANDLERS ----
  function onPointerDown(px, py) {
    if (state === 'LANGUAGE_SELECT') {
      const lang = BD.UI.hitTestLanguageSelect(px, py);
      if (lang) {
        BD.Audio.playTap();
        BD.i18n.setLang(lang);
        goToMenu();
      }
      return;
    }

    if (state === 'MENU') {
      if (BD.UI.showModal) return handleModalHit(px, py);

      const hit = BD.UI.hitTestMainMenu(px, py);
      if (hit) {
        BD.Audio.playTap();
        if (hit === 'play') startNewGame();
        else if (hit === 'stats') BD.UI.showModal = 'stats';
        else if (hit === 'themes') BD.UI.showModal = 'themes';
        else if (hit === 'settings') BD.UI.showModal = 'settings';
        else if (hit === 'sound') BD.Audio.toggleSound();
        else if (hit === 'music') BD.Audio.toggleMusic();
      }
      return;
    }

    if (state !== 'PLAYING' && state !== 'GAME_OVER') return;

    if (BD.Tutorial.active) {
      BD.Tutorial.handleTap(px, py);
      BD.Audio.playTap();
      return;
    }

    if (BD.UI.showModal) return handleModalHit(px, py);

    if (BD.Levels.showingLevelUp) {
      BD.Levels.dismissLevelUp();
      BD.Audio.playTap();
      return;
    }

    if (gameOver) {
      const hit = BD.UI.hitTestGameOver(px, py, gameOverTimer);
      if (hit === 'restart') {
        BD.Audio.playTap();
        startNewGame();
      } else if (hit === 'share') {
        shareScore();
      } else if (hit === 'menu') {
        BD.Audio.playTap();
        goToMenu();
      }
      return;
    }

    const icon = BD.UI.hitTestIconBar(px, py);
    if (icon) {
      BD.Audio.playTap();
      if (icon === 'sound') BD.Audio.toggleSound();
      else if (icon === 'music') BD.Audio.toggleMusic();
      else if (icon === 'stats') BD.UI.showModal = 'stats';
      else if (icon === 'achievements') BD.UI.showModal = 'achievements';
      else if (icon === 'themes') BD.UI.showModal = 'themes';
      else if (icon === 'settings') BD.UI.showModal = 'settings';
      return;
    }

    if (BD.Powerups.colorBlastChoosing) {
      const colorIdx = BD.Powerups.hitTestColorChooser(px, py);
      if (colorIdx >= 0) {
        const cleared = BD.Powerups.executeColorBlast(colorIdx);
        if (cleared && cleared.length > 0) {
          score += cleared.length * 5;
          BD.Input.vibrate(40);
          checkAchievementsAndThemes();
        }
        return;
      }
      BD.Powerups.cancelActive();
      return;
    }

    const pu = BD.Powerups.hitTestBar(px, py);
    if (pu) {
      BD.Audio.playTap();
      
      if (!BD.Powerups.canUse(pu)) {
        // Show info on how to get it
        if (pu === 'bomb') {
          BD.Particles.addFloatingText(BD.W / 2, BD.POWERUP_BAR_Y - 20, BD.i18n.t('info_bomb'), '#FFB347', 22);
        } else if (pu === 'colorBlast') {
          BD.Particles.addFloatingText(BD.W / 2, BD.POWERUP_BAR_Y - 20, BD.i18n.t('info_color'), '#7C5CFC', 22);
        } else if (pu === 'undo') {
          BD.Particles.addFloatingText(BD.W / 2, BD.POWERUP_BAR_Y - 20, BD.i18n.t('info_undo'), '#00C9A7', 22);
        }
        return;
      }

      if (pu === 'bomb') {
        BD.Powerups.activateBomb();
      } else if (pu === 'colorBlast') {
        BD.Powerups.activateColorBlast();
      } else if (pu === 'undo') {
        const undoState = BD.Powerups.executeUndo();
        if (undoState) {
          BD.Grid.data = undoState.grid;
          score = undoState.score;
          combo = undoState.combo;
          BD.Tray.data = undoState.tray;
          BD.Input.vibrate(15);
        } else {
          BD.Audio.playInvalid();
        }
      }
      return;
    }

    if (BD.Powerups.activeMode === 'bomb') {
      if (px >= BD.GRID_LEFT && px <= BD.GRID_LEFT + BD.GRID_WIDTH &&
          py >= BD.GRID_TOP && py <= BD.GRID_TOP + BD.GRID_WIDTH) {
        const snap = BD.Grid.snapToGrid(px, py);
        if (snap.row >= 0 && snap.col >= 0) {
          const cleared = BD.Powerups.executeBomb(snap.row, snap.col);
          if (cleared && cleared.length > 0) {
            score += cleared.length * 5;
            shakeTimer = 0.3;
            BD.Input.vibrate([20, 10, 40]);

            const result = BD.Grid.checkAndClear();
            if (result.linesCleared > 0) {
              const pts = result.cellsCleared.length * 10 * result.linesCleared;
              score += pts;
              BD.Particles.addFloatingText(BD.W / 2, BD.GRID_TOP + BD.GRID_WIDTH / 2, `+${pts}`, BD.Themes.current().accent);
              BD.Audio.playClear(result.linesCleared);
              BD.Stats.onLinesClear(result.linesCleared);
            }
            checkAchievementsAndThemes();
          }
        }
      } else {
        BD.Powerups.cancelActive();
      }
      return;
    }

    const slot = BD.Tray.hitTest(px, py);
    if (slot >= 0 && BD.Tray.data[slot]) {
      const piece = BD.Tray.data[slot];
      const bounds = BD.getShapeBounds(piece.shape.cells);
      dragging = {
        slotIndex: slot,
        shape: piece.shape,
        colorIndex: piece.colorIndex,
        offsetX: 0,
        offsetY: -(BD.CELL_SIZE * bounds.h / 2 + 100),
        x: px,
        y: py,
      };
      BD.Audio.playPickup();
      BD.Input.vibrate(10);
    }
  }

  function handleModalHit(px, py) {
    const action = BD.UI.hitTestModal(px, py);
    if (action) {
      if (action.action === 'close') {
        BD.UI.showModal = null;
        BD.Audio.playTap();
      } else if (action.action === 'selectTheme') {
        if (BD.Themes.isUnlocked(action.themeId)) {
          BD.Themes.setTheme(action.themeId);
          BD.Audio.playTap();
        } else {
          BD.Audio.playInvalid();
        }
      } else if (action.action === 'toggleSetting') {
        BD.Audio.playTap();
        if (action.key === 'sound') BD.Audio.toggleSound();
        else if (action.key === 'music') BD.Audio.toggleMusic();
        else if (action.key === 'vibration') BD.Input.toggleVibration();
      } else if (action.action === 'resetProgress') {
        resetAllProgress();
      } else if (action.action === 'toggleLanguage') {
        const newLang = BD.i18n.getLang() === 'en' ? 'id' : 'en';
        BD.i18n.setLang(newLang);
        return;
      }
    } else {
      BD.UI.showModal = null;
    }
  }

  function onPointerMove(px, py) {
    if (!dragging) return;
    dragging.x = px;
    dragging.y = py;
  }

  function onPointerUp(px, py) {
    if (!dragging) return;

    const cells = dragging.shape.cells;
    const bounds = BD.getShapeBounds(cells);
    const blockCenterX = dragging.x + dragging.offsetX;
    const blockCenterY = dragging.y + dragging.offsetY;

    const anchorX = blockCenterX - (bounds.w * (BD.CELL_SIZE + BD.CELL_GAP) - BD.CELL_GAP) / 2;
    const anchorY = blockCenterY - (bounds.h * (BD.CELL_SIZE + BD.CELL_GAP) - BD.CELL_GAP) / 2;
    const anchorCellX = anchorX + BD.CELL_SIZE / 2;
    const anchorCellY = anchorY + BD.CELL_SIZE / 2;
    const snap = BD.Grid.snapToGrid(anchorCellX, anchorCellY);

    if (snap.row >= 0 && snap.col >= 0 && BD.Grid.canPlace(cells, snap.row, snap.col)) {
      BD.Grid.saveState({
        score,
        combo,
        tray: BD.Tray.data,
        lastSlotIndex: dragging.slotIndex,
      });

      BD.Grid.placeBlock(cells, snap.row, snap.col, dragging.colorIndex);
      BD.Tray.remove(dragging.slotIndex);

      for (const [dc, dr] of cells) {
        const cx = BD.cellX(snap.col + dc) + BD.CELL_SIZE / 2;
        const cy = BD.cellY(snap.row + dr) + BD.CELL_SIZE / 2;
        BD.Particles.spawnPlaceParticles(cx, cy, dragging.colorIndex);
      }

      BD.Audio.playPlace();
      BD.Input.vibrate(15);
      BD.Stats.onBlockPlaced();

      const result = BD.Grid.checkAndClear();
      if (result.linesCleared > 0) {
        combo++;
        const pts = result.cellsCleared.length * 10 * result.linesCleared * combo;
        score += pts;

        BD.Audio.playClear(result.linesCleared);
        BD.Stats.onLinesClear(result.linesCleared);
        BD.Stats.onCombo(combo);
        BD.Input.vibrate(combo > 1 ? [20, 10, 20] : 30);

        const midX = BD.W / 2;
        const midY = BD.GRID_TOP + BD.GRID_WIDTH / 2;
        let text = `+${pts}`;
        if (combo > 1) text += ` ${BD.i18n.t('combo', {count: combo})}`;
        BD.Particles.addFloatingText(midX, midY, text, combo > 1 ? BD.Themes.current().accent : '#7C5CFC');

        shakeTimer = 0.2;

        if (combo > 1) {
          BD.Particles.spawnStarBurst(midX, midY, 12 + combo * 2);
          BD.Audio.playCombo(combo);
        }

        if (result.linesCleared >= 3) {
          BD.Powerups.award('bomb', 1);
          BD.Particles.addFloatingText(BD.W / 2, BD.GRID_TOP - 20, BD.i18n.t('award_bomb'), '#FFB347', 24);
        }
        if (combo >= 3) {
          BD.Powerups.award('colorBlast');
          BD.Particles.addFloatingText(midX, midY + 80, BD.i18n.t('award_color'), '#7C5CFC', 30);
        }

        if (BD.Grid.isEmpty()) {
          score += 500;
          BD.Particles.addFloatingText(midX, midY - 60, BD.i18n.t('board_clear'), '#00C9A7', 40);
          BD.Particles.spawnConfetti(midX, midY, 40);
          BD.Audio.playLevelUp();
        }
      } else {
        combo = 0;
      }

      if (score > 0) {
        const levelResult = BD.Levels.addScore(result.linesCleared > 0 ?
          result.cellsCleared.length * 10 * result.linesCleared * Math.max(1, combo) :
          cells.length * 2
        );

        if (levelResult.leveledUp) {
          BD.Audio.playLevelUp();
          BD.Particles.spawnConfetti(BD.W / 2, BD.H / 2, 60);
          BD.Input.vibrate([30, 15, 30, 15, 50]);
          BD.Stats.setLevel(levelResult.newLevel);

          if (levelResult.reward) {
            BD.Powerups.award(levelResult.reward);
          }
        }
      }

      if (score > highScore) {
        highScore = score;
        isNewBest = true;
        BD.Storage.setHighScore(highScore);
      }

      BD.Tray.fillIfEmpty();

      if (!BD.Tray.checkAnyCanPlace()) {
        triggerGameOver();
      }

      checkAchievementsAndThemes();
    } else {
      if (snap.row >= 0 && snap.col >= 0) {
        BD.Audio.playInvalid();
      }
    }

    dragging = null;
  }

  function triggerGameOver() {
    gameOver = true;
    gameOverTimer = 0;
    state = 'GAME_OVER';
    BD.Audio.stopMusic();
    BD.Audio.playGameOver();
    BD.Input.vibrate([50, 30, 100]);
    BD.Stats.onGameEnd(score);

    checkAchievementsAndThemes();
  }

  function checkAchievementsAndThemes() {
    BD.Stats.updateStreak();
    const statsData = {
      ...BD.Stats.data,
      level: BD.Levels.level,
      streak: BD.Storage.getStreak(),
    };
    BD.Achievements.check(statsData);
    BD.Themes.checkUnlocks(statsData);
  }

  function shareScore() {
    const text = BD.i18n.t('share_text', { score: score.toLocaleString(), level: BD.Levels.currentLevel });
    if (navigator.share) {
      navigator.share({
        title: 'Block Drop',
        text: text,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(text).then(() => {
          BD.Particles.addFloatingText(BD.W / 2, BD.H / 2, BD.i18n.t('copied'), '#4CAF50', 24);
        });
      });
    } else {
      navigator.clipboard.writeText(text).then(() => {
        BD.Particles.addFloatingText(BD.W / 2, BD.H / 2, BD.i18n.t('copied'), '#4CAF50', 24);
      });
    }
  }

  // ---- GAME LOOP ----
  function update(dt) {
    globalTime += dt;
    if (shakeTimer > 0) shakeTimer -= dt;
    if (gameOver) gameOverTimer += dt;
    if (state === 'MENU') menuTimer += dt;

    BD.Particles.update(dt);
    if (state === 'PLAYING') {
      BD.Levels.update(dt);
      BD.Achievements.update(dt);
      BD.Tutorial.update(dt);
      BD.Tray.update(dt);
    }
    BD.UI.update(dt, score);
  }

  function draw(dt) {
    ctx.save();

    if (shakeTimer > 0) {
      const intensity = shakeTimer * 35;
      ctx.translate(
        (Math.random() - 0.5) * intensity,
        (Math.random() - 0.5) * intensity
      );
    }

    BD.UI.drawBackground(ctx);

    if (state === 'LANGUAGE_SELECT') {
      BD.UI.drawLanguageSelect(ctx, globalTime);
    } else if (state === 'MENU') {
      BD.UI.drawMainMenu(ctx, highScore, globalTime);
      BD.UI.drawModal(ctx);
    } else {
      BD.Particles.drawBgShapes(ctx);
      BD.UI.drawHeader(ctx, score, highScore, BD.Levels.level, globalTime);
      BD.UI.drawIconBar(ctx, BD.Audio.settings.soundOn, BD.Audio.settings.musicOn, globalTime);
      BD.UI.drawTitle(ctx);
      BD.UI.drawGrid(ctx, dragging, globalTime, gameOver ? Math.max(0, gameOverTimer) : 0);
      BD.UI.drawPowerupBar(ctx, globalTime);
      BD.UI.drawTray(ctx, dragging);
      BD.UI.drawDragging(ctx, dragging);

      BD.Particles.drawParticles(ctx);
      BD.Particles.drawStars(ctx);
      BD.Particles.drawConfetti(ctx);
      BD.Particles.drawFloatingTexts(ctx);

      BD.Achievements.drawToast(ctx);
      BD.Levels.draw(ctx);

      if (gameOver) {
        BD.UI.drawGameOver(ctx, score, highScore, BD.Levels.level, isNewBest, gameOverTimer);
      }

      BD.UI.drawModal(ctx);
      BD.Tutorial.draw(ctx);
    }

    ctx.restore();
  }

  function gameLoop(time) {
    const dt = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    update(dt);
    draw(dt);
    requestAnimationFrame(gameLoop);
  }

  // ---- EXPOSE POINTER HANDLERS FOR INPUT MODULE ----
  const game = { onPointerDown, onPointerMove, onPointerUp };

  // ---- BOOT ----
  BD.Input.init(canvas, game);
  goToMenu();
  lastTime = performance.now();
  requestAnimationFrame(gameLoop);

})();
