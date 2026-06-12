// =============================================
// BLOCK DROP – POWER-UPS
// Bomb, Color Blast, Undo
// =============================================

(function() {

  let counts = { bomb: 1, colorBlast: 0, undo: 1 };
  let activeMode = null; // null | 'bomb' | 'colorBlast'
  let colorBlastChoosing = false;

  BD.Powerups = {
    get counts() { return counts; },
    get activeMode() { return activeMode; },
    get colorBlastChoosing() { return colorBlastChoosing; },

    init() {
      counts = BD.Storage.getPowerups();
      activeMode = null;
      colorBlastChoosing = false;
    },

    save() {
      BD.Storage.setPowerups(counts);
    },

    // Award power-up
    award(type, amount) {
      amount = amount || 1;
      if (counts[type] !== undefined) {
        counts[type] += amount;
        this.save();
      }
    },

    // Check if player can use a specific power-up
    canUse(type) {
      if (type === 'undo') return counts.undo > 0 && BD.Grid.canUndo();
      return counts[type] > 0;
    },

    // Activate bomb mode (player taps grid to target)
    activateBomb() {
      if (counts.bomb <= 0) return false;
      if (activeMode === 'bomb') {
        activeMode = null; // toggle off
        return false;
      }
      activeMode = 'bomb';
      colorBlastChoosing = false;
      return true;
    },

    // Activate color blast mode (show color chooser)
    activateColorBlast() {
      if (counts.colorBlast <= 0) return false;
      if (activeMode === 'colorBlast') {
        activeMode = null;
        colorBlastChoosing = false;
        return false;
      }
      activeMode = 'colorBlast';
      colorBlastChoosing = true;
      return true;
    },

    // Execute bomb at grid position
    executeBomb(row, col) {
      if (activeMode !== 'bomb' || counts.bomb <= 0) return null;
      counts.bomb--;
      activeMode = null;
      this.save();
      
      BD.Audio.playPowerup();
      BD.Particles.spawnStarBurst(
        BD.cellX(col) + BD.CELL_SIZE / 2,
        BD.cellY(row) + BD.CELL_SIZE / 2,
        16
      );

      const cleared = BD.Grid.clearArea(row, col, 1); // 3x3 area
      return cleared;
    },

    // Execute color blast
    executeColorBlast(colorIdx) {
      if (activeMode !== 'colorBlast' || counts.colorBlast <= 0) return null;
      counts.colorBlast--;
      activeMode = null;
      colorBlastChoosing = false;
      this.save();

      BD.Audio.playPowerup();
      BD.Particles.spawnStarBurst(BD.W / 2, BD.GRID_TOP + BD.GRID_WIDTH / 2, 20);

      const cleared = BD.Grid.clearColor(colorIdx);
      return cleared;
    },

    // Execute undo
    executeUndo() {
      if (counts.undo <= 0) return null;
      const state = BD.Grid.undo();
      if (!state) return null;
      
      counts.undo--;
      this.save();
      BD.Audio.playTap();

      return state;
    },

    cancelActive() {
      activeMode = null;
      colorBlastChoosing = false;
    },

    // Get powerup bar layout (for rendering)
    getBarLayout() {
      const y = BD.POWERUP_BAR_Y;
      const h = BD.POWERUP_BAR_H;
      const btnSize = 54;
      const gap = 30;
      const totalW = 3 * btnSize + 2 * gap;
      const startX = BD.W / 2 - totalW / 2;

      return [
        { type: 'bomb', emoji: '💣', label: 'Bomb', x: startX, y: y + 6, size: btnSize, count: counts.bomb },
        { type: 'colorBlast', emoji: '🌈', label: 'Color', x: startX + btnSize + gap, y: y + 6, size: btnSize, count: counts.colorBlast },
        { type: 'undo', emoji: '↩️', label: 'Undo', x: startX + 2 * (btnSize + gap), y: y + 6, size: btnSize, count: counts.undo },
      ];
    },

    // Hit test powerup buttons
    hitTestBar(px, py) {
      const layout = this.getBarLayout();
      for (const btn of layout) {
        if (px >= btn.x && px <= btn.x + btn.size &&
            py >= btn.y && py <= btn.y + btn.size) {
          return btn.type;
        }
      }
      return null;
    },

    // Hit test color chooser popup
    hitTestColorChooser(px, py) {
      if (!colorBlastChoosing) return -1;
      const colors = BD.Grid.getColorsOnBoard();
      if (colors.length === 0) return -1;

      const popupW = colors.length * 65;
      const popupX = BD.W / 2 - popupW / 2;
      const popupY = BD.POWERUP_BAR_Y - 75;
      const chipSize = 50;

      for (let i = 0; i < colors.length; i++) {
        const cx = popupX + i * 65 + 7;
        if (px >= cx && px <= cx + chipSize && py >= popupY && py <= popupY + chipSize) {
          return colors[i];
        }
      }
      return -1;
    },

    reset() {
      counts = { bomb: 1, colorBlast: 0, undo: 1 };
      activeMode = null;
      colorBlastChoosing = false;
      this.save();
    },
  };

})();
