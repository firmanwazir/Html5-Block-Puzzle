// =============================================
// BLOCK DROP – GRID
// Grid logic: place, clear, canPlace, undo
// =============================================

(function() {

  let grid = [];
  let undoStack = []; // stores { grid, score, combo, tray } snapshots

  function init() {
    grid = [];
    for (let r = 0; r < BD.GRID_SIZE; r++) {
      grid[r] = [];
      for (let c = 0; c < BD.GRID_SIZE; c++) {
        grid[r][c] = -1;
      }
    }
    undoStack = [];
  }

  function clone() {
    return grid.map(row => [...row]);
  }

  function canPlace(cells, gridR, gridC) {
    for (const [dc, dr] of cells) {
      const r = gridR + dr;
      const c = gridC + dc;
      if (r < 0 || r >= BD.GRID_SIZE || c < 0 || c >= BD.GRID_SIZE) return false;
      if (grid[r][c] !== -1) return false;
    }
    return true;
  }

  function canPlaceAnywhere(piece) {
    if (!piece) return false;
    for (let r = 0; r < BD.GRID_SIZE; r++) {
      for (let c = 0; c < BD.GRID_SIZE; c++) {
        if (canPlace(piece.shape.cells, r, c)) return true;
      }
    }
    return false;
  }

  // Save state before placing (for undo)
  function saveState(gameState) {
    undoStack.push({
      grid: clone(),
      score: gameState.score,
      combo: gameState.combo,
      tray: gameState.tray.map(t => t ? { ...t } : null),
      slotIndex: gameState.lastSlotIndex,
    });
    // Keep max 3 undo levels
    if (undoStack.length > 3) undoStack.shift();
  }

  function placeBlock(cells, gridR, gridC, colorIndex) {
    for (const [dc, dr] of cells) {
      grid[gridR + dr][gridC + dc] = colorIndex;
      // Bounce-in animation
      BD.Particles.addBounceIn(gridR + dr, gridC + dc);
    }
  }

  // Check and clear completed rows/columns
  // Returns { linesCleared, cellsCleared: [{r,c,colorIdx}], rowsToClear, colsToClear }
  function checkAndClear() {
    let rowsToClear = [];
    let colsToClear = [];

    for (let r = 0; r < BD.GRID_SIZE; r++) {
      let full = true;
      for (let c = 0; c < BD.GRID_SIZE; c++) {
        if (grid[r][c] === -1) { full = false; break; }
      }
      if (full) rowsToClear.push(r);
    }

    for (let c = 0; c < BD.GRID_SIZE; c++) {
      let full = true;
      for (let r = 0; r < BD.GRID_SIZE; r++) {
        if (grid[r][c] === -1) { full = false; break; }
      }
      if (full) colsToClear.push(c);
    }

    if (rowsToClear.length === 0 && colsToClear.length === 0) {
      return { linesCleared: 0, cellsCleared: [], rowsToClear: [], colsToClear: [] };
    }

    let cellSet = new Set();
    let cellsCleared = [];

    for (const r of rowsToClear) {
      for (let c = 0; c < BD.GRID_SIZE; c++) {
        const key = `${r},${c}`;
        if (!cellSet.has(key)) {
          cellSet.add(key);
          cellsCleared.push({ r, c, colorIdx: grid[r][c] });
        }
      }
    }
    for (const c of colsToClear) {
      for (let r = 0; r < BD.GRID_SIZE; r++) {
        const key = `${r},${c}`;
        if (!cellSet.has(key)) {
          cellSet.add(key);
          cellsCleared.push({ r, c, colorIdx: grid[r][c] });
        }
      }
    }

    // Wave-clear animation
    BD.Particles.addWaveClear(cellsCleared, 0.025);

    // Spawn particles per cleared cell
    for (const { r, c, colorIdx } of cellsCleared) {
      const cx = BD.cellX(c) + BD.CELL_SIZE / 2;
      const cy = BD.cellY(r) + BD.CELL_SIZE / 2;
      BD.Particles.spawnClearParticles(cx, cy, colorIdx);
      grid[r][c] = -1;
    }

    return {
      linesCleared: rowsToClear.length + colsToClear.length,
      cellsCleared,
      rowsToClear,
      colsToClear,
    };
  }

  // Find all cells of a specific color
  function findCellsByColor(colorIdx) {
    const cells = [];
    for (let r = 0; r < BD.GRID_SIZE; r++) {
      for (let c = 0; c < BD.GRID_SIZE; c++) {
        if (grid[r][c] === colorIdx) cells.push({ r, c });
      }
    }
    return cells;
  }

  // Clear an area (for bomb)
  function clearArea(centerR, centerC, radius) {
    const cleared = [];
    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        const r = centerR + dr;
        const c = centerC + dc;
        if (r >= 0 && r < BD.GRID_SIZE && c >= 0 && c < BD.GRID_SIZE && grid[r][c] !== -1) {
          cleared.push({ r, c, colorIdx: grid[r][c] });
          const cx = BD.cellX(c) + BD.CELL_SIZE / 2;
          const cy = BD.cellY(r) + BD.CELL_SIZE / 2;
          BD.Particles.spawnClearParticles(cx, cy, grid[r][c]);
          grid[r][c] = -1;
        }
      }
    }
    return cleared;
  }

  // Clear all cells of a color (for color blast)
  function clearColor(colorIdx) {
    const cells = findCellsByColor(colorIdx);
    for (const { r, c } of cells) {
      const cx = BD.cellX(c) + BD.CELL_SIZE / 2;
      const cy = BD.cellY(r) + BD.CELL_SIZE / 2;
      BD.Particles.spawnClearParticles(cx, cy, colorIdx);
      grid[r][c] = -1;
    }
    return cells;
  }

  // Count filled cells
  function filledCount() {
    let count = 0;
    for (let r = 0; r < BD.GRID_SIZE; r++) {
      for (let c = 0; c < BD.GRID_SIZE; c++) {
        if (grid[r][c] !== -1) count++;
      }
    }
    return count;
  }

  // Check if board is completely empty
  function isEmpty() {
    return filledCount() === 0;
  }

  // Snap world coordinates to grid cell
  function snapToGrid(px, py) {
    let bestR = -1, bestC = -1, bestDist = Infinity;
    for (let r = 0; r < BD.GRID_SIZE; r++) {
      for (let c = 0; c < BD.GRID_SIZE; c++) {
        const gx = BD.cellX(c) + BD.CELL_SIZE / 2;
        const gy = BD.cellY(r) + BD.CELL_SIZE / 2;
        const dist = (px - gx) ** 2 + (py - gy) ** 2;
        if (dist < bestDist) {
          bestDist = dist;
          bestR = r;
          bestC = c;
        }
      }
    }
    return { row: bestR, col: bestC };
  }

  // Get which rows/cols would clear if we simulate placing a piece
  function previewClear(cells, gridR, gridC, colorIndex) {
    const temp = clone();
    for (const [dc, dr] of cells) {
      temp[gridR + dr][gridC + dc] = colorIndex;
    }
    let highlights = new Set();
    for (let r = 0; r < BD.GRID_SIZE; r++) {
      let full = true;
      for (let c = 0; c < BD.GRID_SIZE; c++) {
        if (temp[r][c] === -1) { full = false; break; }
      }
      if (full) {
        for (let c = 0; c < BD.GRID_SIZE; c++) highlights.add(`${r},${c}`);
      }
    }
    for (let c = 0; c < BD.GRID_SIZE; c++) {
      let full = true;
      for (let r = 0; r < BD.GRID_SIZE; r++) {
        if (temp[r][c] === -1) { full = false; break; }
      }
      if (full) {
        for (let r = 0; r < BD.GRID_SIZE; r++) highlights.add(`${r},${c}`);
      }
    }
    return highlights;
  }

  // Undo last placement
  function undo() {
    if (undoStack.length === 0) return null;
    return undoStack.pop();
  }

  function canUndo() {
    return undoStack.length > 0;
  }

  // Get unique colors present on board
  function getColorsOnBoard() {
    const colors = new Set();
    for (let r = 0; r < BD.GRID_SIZE; r++) {
      for (let c = 0; c < BD.GRID_SIZE; c++) {
        if (grid[r][c] !== -1) colors.add(grid[r][c]);
      }
    }
    return [...colors];
  }

  BD.Grid = {
    get data() { return grid; },
    set data(v) { grid = v; },
    init,
    clone,
    canPlace,
    canPlaceAnywhere,
    saveState,
    placeBlock,
    checkAndClear,
    findCellsByColor,
    clearArea,
    clearColor,
    filledCount,
    isEmpty,
    snapToGrid,
    previewClear,
    undo,
    canUndo,
    getColorsOnBoard,
  };

})();
