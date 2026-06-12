// =============================================
// BLOCK DROP – ACHIEVEMENTS
// Achievement definitions & tracking
// =============================================

(function() {

  const DEFS = [
    // Score milestones
    { id: 'score_1k',   cat: 'score', icon: '🥉', nameKey: 'ach_1_name', descKey: 'ach_1_desc', check: s => s.bestScore >= 1000 },
    { id: 'score_5k',   cat: 'score', icon: '🎖️', nameKey: 'ach_2_name', descKey: 'ach_2_desc', check: s => s.bestScore >= 5000 },
    { id: 'score_10k',  cat: 'score', icon: '🥈', nameKey: 'ach_3_name', descKey: 'ach_3_desc', check: s => s.bestScore >= 10000 },
    { id: 'score_25k',  cat: 'score', icon: '🏅', nameKey: 'ach_4_name', descKey: 'ach_4_desc', check: s => s.bestScore >= 25000 },
    { id: 'score_50k',  cat: 'score', icon: '🥇', nameKey: 'ach_5_name', descKey: 'ach_5_desc', check: s => s.bestScore >= 50000 },
    { id: 'score_100k', cat: 'score', icon: '💎', nameKey: 'ach_6_name', descKey: 'ach_6_desc', check: s => s.bestScore >= 100000 },

    // Gameplay
    { id: 'first_clear',  cat: 'play', icon: '✅', nameKey: 'ach_7_name', descKey: 'ach_7_desc', check: s => s.totalLinesCleared >= 1 },
    { id: 'combo_2',      cat: 'play', icon: '🔥', nameKey: 'ach_8_name', descKey: 'ach_8_desc', check: s => s.bestCombo >= 2 },
    { id: 'combo_3',      cat: 'play', icon: '⚡', nameKey: 'ach_9_name', descKey: 'ach_9_desc', check: s => s.bestCombo >= 3 },
    { id: 'combo_5',      cat: 'play', icon: '💥', nameKey: 'ach_10_name', descKey: 'ach_10_desc', check: s => s.bestCombo >= 5 },
    { id: 'combo_8',      cat: 'play', icon: '🌪️', nameKey: 'ach_11_name', descKey: 'ach_11_desc', check: s => s.bestCombo >= 8 },
    { id: 'lines_50',     cat: 'play', icon: '🌊', nameKey: 'ach_12_name', descKey: 'ach_12_desc', check: s => s.totalLinesCleared >= 50 },
    { id: 'lines_200',    cat: 'play', icon: '🌊', nameKey: 'ach_13_name', descKey: 'ach_13_desc', check: s => s.totalLinesCleared >= 200 },
    { id: 'blocks_100',   cat: 'play', icon: '🧱', nameKey: 'ach_14_name', descKey: 'ach_14_desc', check: s => s.totalBlocksPlaced >= 100 },
    { id: 'blocks_500',   cat: 'play', icon: '🏗️', nameKey: 'ach_15_name', descKey: 'ach_15_desc', check: s => s.totalBlocksPlaced >= 500 },

    // Consistency
    { id: 'games_1',      cat: 'streak', icon: '📅', nameKey: 'ach_16_name', descKey: 'ach_16_desc', check: s => s.totalGames >= 1 },
    { id: 'games_10',     cat: 'streak', icon: '🎮', nameKey: 'ach_17_name', descKey: 'ach_17_desc', check: s => s.totalGames >= 10 },
    { id: 'games_50',     cat: 'streak', icon: '🕹️', nameKey: 'ach_18_name', descKey: 'ach_18_desc', check: s => s.totalGames >= 50 },
    { id: 'streak_3',     cat: 'streak', icon: '🔥', nameKey: 'ach_19_name', descKey: 'ach_19_desc', check: s => (s.streak || 0) >= 3 },
    { id: 'streak_7',     cat: 'streak', icon: '⭐', nameKey: 'ach_20_name', descKey: 'ach_20_desc', check: s => (s.streak || 0) >= 7 },

    // Special
    { id: 'level_5',      cat: 'special', icon: '🏔️', nameKey: 'ach_21_name', descKey: 'ach_21_desc', check: s => (s.level || 1) >= 5 },
    { id: 'level_10',     cat: 'special', icon: '🗻', nameKey: 'ach_22_name', descKey: 'ach_22_desc', check: s => (s.level || 1) >= 10 },
    { id: 'level_20',     cat: 'special', icon: '🚀', nameKey: 'ach_23_name', descKey: 'ach_23_desc', check: s => (s.level || 1) >= 20 },
  ];

  let unlocked = {};
  let pendingToasts = []; // achievements to show as toasts
  let toastTimer = 0;
  let currentToast = null;

  BD.Achievements = {
    DEFS,
    get unlocked() { return unlocked; },
    get currentToast() { return currentToast; },

    init() {
      unlocked = BD.Storage.getAchievements();
    },

    // Check all achievements against current stats
    // Returns array of newly unlocked achievements
    check(stats) {
      const newlyUnlocked = [];
      for (const def of DEFS) {
        if (!unlocked[def.id] && def.check(stats)) {
          unlocked[def.id] = { unlockedAt: Date.now() };
          newlyUnlocked.push(def);
          pendingToasts.push(def);
        }
      }
      if (newlyUnlocked.length > 0) {
        BD.Storage.setAchievements(unlocked);
      }
      return newlyUnlocked;
    },

    isUnlocked(id) {
      return !!unlocked[id];
    },

    getUnlockedCount() {
      return Object.keys(unlocked).length;
    },

    getTotalCount() {
      return DEFS.length;
    },

    getProgress() {
      return `${this.getUnlockedCount()}/${this.getTotalCount()}`;
    },

    // Toast system
    update(dt) {
      if (currentToast) {
        toastTimer -= dt;
        if (toastTimer <= 0) {
          currentToast = null;
        }
      }

      if (!currentToast && pendingToasts.length > 0) {
        currentToast = pendingToasts.shift();
        toastTimer = 3.0; // show for 3 seconds
        BD.Audio.playAchievement();
      }
    },

    drawToast(ctx) {
      if (!currentToast) return;

      const theme = BD.Themes.current();
      const t = BD.clamp(toastTimer, 0, 1); // fade
      const enterT = BD.clamp((3.0 - toastTimer) / 0.3, 0, 1); // slide in

      const toastW = 500;
      const toastH = 80;
      const toastX = BD.W / 2 - toastW / 2;
      const slideOffset = (1 - BD.easeOut(enterT)) * -100;
      const toastY = 130 + slideOffset;

      ctx.save();
      ctx.globalAlpha = Math.min(t, BD.easeOut(enterT));

      // Background
      ctx.shadowColor = 'rgba(255,215,0,0.3)';
      ctx.shadowBlur = 20;
      BD.drawRoundRect(ctx, toastX, toastY, toastW, toastH, 16);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Gold border
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      BD.drawRoundRect(ctx, toastX, toastY, toastW, toastH, 16);
      ctx.stroke();

      // Icon
      ctx.font = '36px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(currentToast.icon, toastX + 18, toastY + 52);

      // Text
      ctx.fillStyle = theme.textDark;
      ctx.font = '800 24px Nunito, sans-serif';
      ctx.fillText(BD.i18n.t('achievement_unlocked'), toastX + 68, toastY + 32);

      ctx.fillStyle = theme.textLight;
      ctx.font = '600 20px Nunito, sans-serif';
      ctx.fillText(`${BD.i18n.t(currentToast.nameKey)} – ${BD.i18n.t(currentToast.descKey)}`, toastX + 68, toastY + 60);

      ctx.restore();
      ctx.globalAlpha = 1;
      ctx.textAlign = 'left';
    },

    reset() {
      unlocked = {};
      pendingToasts = [];
      currentToast = null;
      BD.Storage.setAchievements({});
    },
  };

})();
