// =============================================
// BLOCK DROP – TRAY
// Tray management & block generation
// =============================================

(function() {

  let tray = [null, null, null];
  let refillAnim = 0; // 0 = no anim, >0 = animating (counts down from 1)
  let refillTime = 0;

  function randomShape() {
    const pool = BD.weightedShapePool;
    const shape = pool[Math.floor(Math.random() * pool.length)];
    const theme = BD.Themes ? BD.Themes.current() : null;
    const palettes = theme ? theme.palettes : BD.DEFAULT_PALETTES;
    const colorIdx = Math.floor(Math.random() * palettes.length);
    return { shape, colorIndex: colorIdx };
  }

  function fillIfEmpty() {
    const allUsed = tray.every(t => t === null);
    if (allUsed) {
      for (let i = 0; i < BD.TRAY_SLOTS; i++) {
        tray[i] = randomShape();
      }
      refillAnim = 1.0; // start slide-in
      refillTime = 0;
      return true;
    }
    return false;
  }

  function getTraySlotCenter(index) {
    const slotW = (BD.W - 60) / BD.TRAY_SLOTS;
    const cx = 30 + slotW * index + slotW / 2;
    const cy = BD.TRAY_TOP + BD.TRAY_HEIGHT / 2;
    return { x: cx, y: cy };
  }

  function hitTest(px, py) {
    if (refillAnim > 0.3) return -1; // don't allow picking during anim
    for (let i = 0; i < BD.TRAY_SLOTS; i++) {
      if (!tray[i]) continue;
      const { x: cx, y: cy } = getTraySlotCenter(i);
      const bounds = BD.getShapeBounds(tray[i].shape.cells);
      const bw = bounds.w * (BD.CELL_SIZE + BD.CELL_GAP) * BD.TRAY_BLOCK_SCALE;
      const bh = bounds.h * (BD.CELL_SIZE + BD.CELL_GAP) * BD.TRAY_BLOCK_SCALE;
      const pad = 25;
      if (px >= cx - bw/2 - pad && px <= cx + bw/2 + pad &&
          py >= cy - bh/2 - pad && py <= cy + bh/2 + pad) {
        return i;
      }
    }
    return -1;
  }

  function checkAnyCanPlace() {
    for (const piece of tray) {
      if (piece && BD.Grid.canPlaceAnywhere(piece)) return true;
    }
    return false;
  }

  BD.Tray = {
    get data() { return tray; },
    set data(v) { tray = v; },
    get refillAnim() { return refillAnim; },
    get refillTime() { return refillTime; },
    randomShape,
    fillIfEmpty,
    getTraySlotCenter,
    hitTest,
    checkAnyCanPlace,
    update(dt) {
      if (refillAnim > 0) {
        refillTime += dt;
        refillAnim -= dt * 2.5;
        if (refillAnim <= 0) refillAnim = 0;
      }
    },
    reset() {
      tray = [null, null, null];
      refillAnim = 0;
      refillTime = 0;
      this.fillIfEmpty();
    },
    remove(index) {
      tray[index] = null;
    },
  };

})();
