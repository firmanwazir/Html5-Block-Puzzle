// =============================================
// BLOCK DROP – STATS
// Statistics tracking
// =============================================

(function() {

  let stats = {};
  let sessionStart = 0;

  BD.Stats = {
    get data() { return stats; },

    init() {
      stats = BD.Storage.getStats();
      sessionStart = Date.now();
    },

    save() {
      BD.Storage.setStats(stats);
    },

    // Called when a game starts
    onGameStart() {
      stats.totalGames = (stats.totalGames || 0) + 1;
      sessionStart = Date.now();
      BD.Storage.updateDailyStreak();
      this.save();
    },

    // Called when a game ends
    onGameEnd(finalScore) {
      const elapsed = Date.now() - sessionStart;
      stats.totalPlayTimeMs = (stats.totalPlayTimeMs || 0) + elapsed;
      if (finalScore > (stats.bestScore || 0)) {
        stats.bestScore = finalScore;
      }
      stats.totalScore = (stats.totalScore || 0) + finalScore;
      this.save();
    },

    // Called when lines are cleared
    onLinesClear(count) {
      stats.totalLinesCleared = (stats.totalLinesCleared || 0) + count;
      this.save();
    },

    // Called when combo happens
    onCombo(comboCount) {
      if (comboCount > (stats.bestCombo || 0)) {
        stats.bestCombo = comboCount;
      }
      this.save();
    },

    // Called when block is placed
    onBlockPlaced() {
      stats.totalBlocksPlaced = (stats.totalBlocksPlaced || 0) + 1;
      this.save();
    },

    // Update level in stats (for theme unlock checks)
    setLevel(lvl) {
      stats.level = lvl;
      this.save();
    },

    // Update streak in stats
    updateStreak() {
      stats.streak = BD.Storage.getStreak();
    },

    // Get average score per game
    averageScore() {
      if (!stats.totalGames || stats.totalGames === 0) return 0;
      return Math.round((stats.totalScore || 0) / stats.totalGames);
    },

    // Get formatted play time
    formatPlayTime() {
      const ms = stats.totalPlayTimeMs || 0;
      const totalSec = Math.floor(ms / 1000);
      const hours = Math.floor(totalSec / 3600);
      const mins = Math.floor((totalSec % 3600) / 60);
      if (hours > 0) return `${hours}${BD.i18n.t('time_h')} ${mins}${BD.i18n.t('time_m')}`;
      return `${mins}${BD.i18n.t('time_m')}`;
    },

    // Get all stats as display-ready array
    getDisplayStats() {
      return [
        { label: BD.i18n.t('stat_games'), value: (stats.totalGames || 0).toLocaleString(), icon: '🎮' },
        { label: BD.i18n.t('stat_best'), value: (stats.bestScore || 0).toLocaleString(), icon: '🏆' },
        { label: BD.i18n.t('stat_avg'), value: this.averageScore().toLocaleString(), icon: '📊' },
        { label: BD.i18n.t('stat_lines'), value: (stats.totalLinesCleared || 0).toLocaleString(), icon: '✨' },
        { label: BD.i18n.t('stat_combo'), value: `x${stats.bestCombo || 0}`, icon: '🔥' },
        { label: BD.i18n.t('stat_blocks'), value: (stats.totalBlocksPlaced || 0).toLocaleString(), icon: '🧱' },
        { label: BD.i18n.t('stat_streak'), value: `${BD.Storage.getStreak()} ${BD.i18n.t('days')}`, icon: '📅' },
        { label: BD.i18n.t('stat_time'), value: this.formatPlayTime(), icon: '⏱️' },
      ];
    },

    reset() {
      stats = {
        totalGames: 0, bestScore: 0, totalLinesCleared: 0,
        bestCombo: 0, totalBlocksPlaced: 0, totalScore: 0, totalPlayTimeMs: 0,
      };
      this.save();
    },
  };

})();
