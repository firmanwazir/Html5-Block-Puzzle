// =============================================
// BLOCK DROP – THEMES
// Theme system with unlock conditions
// =============================================

(function() {

  const THEME_DEFS = {
    sakura: {
      id: 'sakura',
      name: '🌸 Sakura',
      desc: 'Warm & sweet',
      unlock: 'Free',
      condition: () => true,
      bg1: '#FFF5F0', bg2: '#FFF0EA', bg3: '#FFE8DD',
      gridBg: 'rgba(255,255,255,0.7)',
      gridBorder: 'rgba(240,200,180,0.3)',
      cellEmpty: '#FAE8E0',
      headerBg: 'rgba(255,255,255,0.9)',
      textDark: '#3D2B1F',
      textLight: '#A08070',
      accent: '#FF6B9D',
      dotColor: 'rgba(255,180,160,0.08)',
      palettes: [
        { fill: '#FF6B9D', stroke: '#E5558A', glow: '#FFB3CC', name: 'pink' },
        { fill: '#7C5CFC', stroke: '#6545E0', glow: '#B8A8FF', name: 'purple' },
        { fill: '#00C9A7', stroke: '#00A88D', glow: '#80FFE5', name: 'teal' },
        { fill: '#FFB347', stroke: '#E09830', glow: '#FFD699', name: 'orange' },
        { fill: '#4FC3F7', stroke: '#3AA8DB', glow: '#A8E4FF', name: 'sky' },
        { fill: '#FF8A80', stroke: '#E07068', glow: '#FFB8B0', name: 'coral' },
        { fill: '#AED581', stroke: '#8BC34A', glow: '#D4F0A8', name: 'lime' },
      ],
    },
    midnight: {
      id: 'midnight',
      name: '🌙 Midnight',
      desc: 'Dark & cool',
      unlock: 'Reach Level 5',
      condition: (stats) => (stats.level || 1) >= 5,
      bg1: '#0F0F23', bg2: '#151530', bg3: '#1A1A3E',
      gridBg: 'rgba(30,30,60,0.8)',
      gridBorder: 'rgba(80,80,150,0.3)',
      cellEmpty: '#1E1E3F',
      headerBg: 'rgba(20,20,50,0.9)',
      textDark: '#E0E0FF',
      textLight: '#8080B0',
      accent: '#7C5CFC',
      dotColor: 'rgba(100,80,200,0.06)',
      palettes: [
        { fill: '#FF6B9D', stroke: '#CC4477', glow: '#FF9DBF', name: 'pink' },
        { fill: '#7C5CFC', stroke: '#5A3AD0', glow: '#A99CFF', name: 'purple' },
        { fill: '#00E5C3', stroke: '#00B89D', glow: '#66FFE5', name: 'teal' },
        { fill: '#FFC857', stroke: '#DDA832', glow: '#FFE099', name: 'gold' },
        { fill: '#64B5F6', stroke: '#4090D0', glow: '#9DCFFF', name: 'blue' },
        { fill: '#EF5350', stroke: '#C63030', glow: '#FF8A88', name: 'red' },
        { fill: '#66BB6A', stroke: '#45904A', glow: '#99DD9D', name: 'green' },
      ],
    },
    ocean: {
      id: 'ocean',
      name: '🌊 Ocean',
      desc: 'Deep sea calm',
      unlock: 'Reach Level 10',
      condition: (stats) => (stats.level || 1) >= 10,
      bg1: '#E3F2FD', bg2: '#BBDEFB', bg3: '#90CAF9',
      gridBg: 'rgba(255,255,255,0.6)',
      gridBorder: 'rgba(100,180,230,0.3)',
      cellEmpty: '#D4ECFC',
      headerBg: 'rgba(255,255,255,0.85)',
      textDark: '#1A3A5C',
      textLight: '#6090B0',
      accent: '#039BE5',
      dotColor: 'rgba(3,155,229,0.06)',
      palettes: [
        { fill: '#039BE5', stroke: '#0277BD', glow: '#4FC3F7', name: 'blue' },
        { fill: '#00BCD4', stroke: '#0097A7', glow: '#4DD0E1', name: 'cyan' },
        { fill: '#26A69A', stroke: '#00897B', glow: '#80CBC4', name: 'teal' },
        { fill: '#5C6BC0', stroke: '#3F51B5', glow: '#9FA8DA', name: 'indigo' },
        { fill: '#FF7043', stroke: '#E64A19', glow: '#FFAB91', name: 'coral' },
        { fill: '#FFA726', stroke: '#F57C00', glow: '#FFD54F', name: 'amber' },
        { fill: '#EC407A', stroke: '#C2185B', glow: '#F48FB1', name: 'rose' },
      ],
    },
    candy: {
      id: 'candy',
      name: '🍬 Candy',
      desc: 'Pastel rainbow',
      unlock: 'Score 20,000',
      condition: (stats) => (stats.bestScore || 0) >= 20000,
      bg1: '#FFF0F5', bg2: '#F0F0FF', bg3: '#F0FFF0',
      gridBg: 'rgba(255,255,255,0.75)',
      gridBorder: 'rgba(220,180,220,0.3)',
      cellEmpty: '#F5E6F0',
      headerBg: 'rgba(255,255,255,0.9)',
      textDark: '#5A3D5A',
      textLight: '#B090B0',
      accent: '#E040FB',
      dotColor: 'rgba(224,64,251,0.05)',
      palettes: [
        { fill: '#F48FB1', stroke: '#E06090', glow: '#F8BBD0', name: 'pink' },
        { fill: '#CE93D8', stroke: '#AB60C0', glow: '#E1BEE7', name: 'lavender' },
        { fill: '#90CAF9', stroke: '#60A0D0', glow: '#BBDEFB', name: 'baby blue' },
        { fill: '#A5D6A7', stroke: '#70B070', glow: '#C8E6C9', name: 'mint' },
        { fill: '#FFF59D', stroke: '#E0D060', glow: '#FFF9C4', name: 'lemon' },
        { fill: '#FFAB91', stroke: '#E08060', glow: '#FFCCBC', name: 'peach' },
        { fill: '#80DEEA', stroke: '#50B0C0', glow: '#B2EBF2', name: 'aqua' },
      ],
    },
    forest: {
      id: 'forest',
      name: '🌿 Forest',
      desc: 'Natural earth',
      unlock: 'Play 50 games',
      condition: (stats) => (stats.totalGames || 0) >= 50,
      bg1: '#F1F8E9', bg2: '#E8F5E9', bg3: '#DCEDC8',
      gridBg: 'rgba(255,255,255,0.65)',
      gridBorder: 'rgba(150,200,100,0.3)',
      cellEmpty: '#E8F0DA',
      headerBg: 'rgba(255,255,255,0.88)',
      textDark: '#33691E',
      textLight: '#7DA050',
      accent: '#689F38',
      dotColor: 'rgba(104,159,56,0.06)',
      palettes: [
        { fill: '#8BC34A', stroke: '#689F38', glow: '#C5E1A5', name: 'green' },
        { fill: '#FF8A65', stroke: '#E06040', glow: '#FFAB91', name: 'terracotta' },
        { fill: '#A1887F', stroke: '#806050', glow: '#BCAAA4', name: 'bark' },
        { fill: '#FFD54F', stroke: '#E0B020', glow: '#FFE082', name: 'sunlight' },
        { fill: '#4DB6AC', stroke: '#30908A', glow: '#80CBC4', name: 'moss' },
        { fill: '#FF7043', stroke: '#D84020', glow: '#FFAB91', name: 'berry' },
        { fill: '#7986CB', stroke: '#5060A0', glow: '#9FA8DA', name: 'wildflower' },
      ],
    },
    neon: {
      id: 'neon',
      name: '✨ Neon',
      desc: 'Electric glow',
      unlock: 'Get Combo x5',
      condition: (stats) => (stats.bestCombo || 0) >= 5,
      bg1: '#0A0A0F', bg2: '#0D0D18', bg3: '#101025',
      gridBg: 'rgba(15,15,30,0.9)',
      gridBorder: 'rgba(0,255,200,0.15)',
      cellEmpty: '#12122A',
      headerBg: 'rgba(10,10,25,0.95)',
      textDark: '#F0F0FF',
      textLight: '#6080A0',
      accent: '#00FF88',
      dotColor: 'rgba(0,255,136,0.04)',
      palettes: [
        { fill: '#FF0080', stroke: '#CC0066', glow: '#FF66B2', name: 'hotpink' },
        { fill: '#8B5CF6', stroke: '#6D3DD0', glow: '#B794FF', name: 'violet' },
        { fill: '#00FF88', stroke: '#00CC6A', glow: '#66FFBB', name: 'neongreen' },
        { fill: '#00D4FF', stroke: '#00A8CC', glow: '#66E5FF', name: 'cyan' },
        { fill: '#FFD600', stroke: '#CCAB00', glow: '#FFE866', name: 'yellow' },
        { fill: '#FF4444', stroke: '#CC2222', glow: '#FF8888', name: 'red' },
        { fill: '#FF6600', stroke: '#CC5200', glow: '#FF9944', name: 'orange' },
      ],
    },
  };

  let currentThemeId = 'sakura';

  BD.Themes = {
    DEFS: THEME_DEFS,

    init() {
      currentThemeId = BD.Storage.getTheme();
      if (!THEME_DEFS[currentThemeId]) currentThemeId = 'sakura';
    },

    current() {
      return THEME_DEFS[currentThemeId];
    },

    currentId() {
      return currentThemeId;
    },

    setTheme(id) {
      if (THEME_DEFS[id]) {
        currentThemeId = id;
        BD.Storage.setTheme(id);
        BD.Particles.reinitBg();
      }
    },

    // Check which themes should be unlocked based on current stats
    checkUnlocks(stats) {
      const unlocked = BD.Storage.getUnlockedThemes();
      let newUnlocks = [];
      for (const [id, theme] of Object.entries(THEME_DEFS)) {
        if (!unlocked.includes(id) && theme.condition(stats)) {
          unlocked.push(id);
          newUnlocks.push(theme);
        }
      }
      if (newUnlocks.length > 0) {
        BD.Storage.setUnlockedThemes(unlocked);
      }
      return newUnlocks;
    },

    isUnlocked(id) {
      return BD.Storage.getUnlockedThemes().includes(id);
    },

    getAllThemes() {
      return Object.values(THEME_DEFS);
    },
  };

})();
