// =============================================
// BLOCK DROP – CONFIG
// Global constants, shapes, design tokens
// =============================================

window.BD = window.BD || {};

// ---- CANVAS ----
BD.W = 750;
BD.H = 1334;

// ---- GRID ----
BD.GRID_SIZE = 8;
BD.GRID_PADDING = 30;
BD.GRID_TOP = 230;
BD.CELL_GAP = 4;
BD.GRID_WIDTH = BD.W - BD.GRID_PADDING * 2;
BD.CELL_SIZE = (BD.GRID_WIDTH - (BD.GRID_SIZE + 1) * BD.CELL_GAP) / BD.GRID_SIZE;
BD.GRID_LEFT = BD.GRID_PADDING;
BD.GRID_BOTTOM = BD.GRID_TOP + BD.GRID_WIDTH;

// ---- TRAY ----
BD.TRAY_TOP = BD.GRID_BOTTOM + 100; // extra space for powerup bar
BD.TRAY_HEIGHT = BD.H - BD.TRAY_TOP - 30;
BD.TRAY_SLOTS = 3;
BD.TRAY_BLOCK_SCALE = 0.55;

// ---- POWERUP BAR ----
BD.POWERUP_BAR_Y = BD.GRID_BOTTOM + 20;
BD.POWERUP_BAR_H = 65;

// ---- TETROMINO SHAPES ----
BD.SHAPES = [
  // Monominoes
  { cells: [[0,0]], name: 'dot', weight: 3 },
  // Dominoes
  { cells: [[0,0],[1,0]], name: 'h2', weight: 4 },
  { cells: [[0,0],[0,1]], name: 'v2', weight: 4 },
  // Triominoes
  { cells: [[0,0],[1,0],[2,0]], name: 'h3', weight: 5 },
  { cells: [[0,0],[0,1],[0,2]], name: 'v3', weight: 5 },
  { cells: [[0,0],[1,0],[0,1]], name: 'L3a', weight: 4 },
  { cells: [[0,0],[1,0],[1,1]], name: 'L3b', weight: 4 },
  { cells: [[0,0],[0,1],[1,1]], name: 'L3c', weight: 4 },
  { cells: [[1,0],[0,1],[1,1]], name: 'L3d', weight: 4 },
  // Tetrominoes
  { cells: [[0,0],[1,0],[2,0],[3,0]], name: 'h4', weight: 3 },
  { cells: [[0,0],[0,1],[0,2],[0,3]], name: 'v4', weight: 3 },
  { cells: [[0,0],[1,0],[0,1],[1,1]], name: 'square', weight: 5 },
  { cells: [[0,0],[1,0],[2,0],[0,1]], name: 'La', weight: 3 },
  { cells: [[0,0],[1,0],[2,0],[2,1]], name: 'Lb', weight: 3 },
  { cells: [[0,0],[0,1],[0,2],[1,2]], name: 'Lc', weight: 3 },
  { cells: [[0,0],[1,0],[1,1],[1,2]], name: 'Ld', weight: 3 },
  { cells: [[0,0],[1,0],[2,0],[1,1]], name: 'T', weight: 3 },
  { cells: [[0,0],[0,1],[1,1],[0,2]], name: 'S', weight: 3 },
  { cells: [[1,0],[0,1],[1,1],[0,2]], name: 'Z', weight: 3 },
  // Pentominoes
  { cells: [[0,0],[1,0],[2,0],[3,0],[4,0]], name: 'h5', weight: 1 },
  { cells: [[0,0],[0,1],[0,2],[0,3],[0,4]], name: 'v5', weight: 1 },
  // Big L
  { cells: [[0,0],[0,1],[0,2],[1,2],[2,2]], name: 'bigL', weight: 2 },
  // Big square
  { cells: [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]], name: 'big3x3', weight: 1 },
];

// Weighted random shape selection
BD.weightedShapePool = [];
(function buildPool() {
  for (const s of BD.SHAPES) {
    for (let i = 0; i < (s.weight || 1); i++) {
      BD.weightedShapePool.push(s);
    }
  }
})();

// ---- DEFAULT BLOCK PALETTES ----
BD.DEFAULT_PALETTES = [
  { fill: '#FF6B9D', stroke: '#E5558A', glow: '#FFB3CC', name: 'pink' },
  { fill: '#7C5CFC', stroke: '#6545E0', glow: '#B8A8FF', name: 'purple' },
  { fill: '#00C9A7', stroke: '#00A88D', glow: '#80FFE5', name: 'teal' },
  { fill: '#FFB347', stroke: '#E09830', glow: '#FFD699', name: 'orange' },
  { fill: '#4FC3F7', stroke: '#3AA8DB', glow: '#A8E4FF', name: 'sky' },
  { fill: '#FF8A80', stroke: '#E07068', glow: '#FFB8B0', name: 'coral' },
  { fill: '#AED581', stroke: '#8BC34A', glow: '#D4F0A8', name: 'lime' },
];

// ---- UTILITY FUNCTIONS ----
BD.getShapeBounds = function(cells) {
  let maxR = 0, maxC = 0;
  for (const [c, r] of cells) {
    if (c > maxC) maxC = c;
    if (r > maxR) maxR = r;
  }
  return { w: maxC + 1, h: maxR + 1 };
};

BD.cellX = function(c) {
  return BD.GRID_LEFT + BD.CELL_GAP + c * (BD.CELL_SIZE + BD.CELL_GAP);
};

BD.cellY = function(r) {
  return BD.GRID_TOP + BD.CELL_GAP + r * (BD.CELL_SIZE + BD.CELL_GAP);
};

BD.drawRoundRect = function(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

BD.drawStar = function(ctx, cx, cy, r, points) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const dist = i % 2 === 0 ? r : r * 0.45;
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
};

BD.lerp = function(a, b, t) { return a + (b - a) * t; };
BD.easeOut = function(t) { return 1 - Math.pow(1 - t, 3); };
BD.easeInOut = function(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2; };
BD.clamp = function(v, min, max) { return Math.max(min, Math.min(max, v)); };
