// =============================================
// BLOCK DROP – STORAGE
// LocalStorage manager for all persistent data
// =============================================

(function() {
  const KEYS = {
    HIGH_SCORE: 'bd_high_score',
    LEVEL: 'bd_level',
    STATS: 'bd_stats',
    ACHIEVEMENTS: 'bd_achievements',
    SETTINGS: 'bd_settings',
    THEME: 'bd_theme',
    POWERUPS: 'bd_powerups',
    TUTORIAL_DONE: 'bd_tutorial_done',
    LAST_PLAY_DATE: 'bd_last_play',
    STREAK: 'bd_streak',
    UNLOCKED_THEMES: 'bd_unlocked_themes',
    LANGUAGE: 'bd_language',
  };

  function get(key, fallback) {
    try {
      const val = localStorage.getItem(key);
      if (val === null) return fallback;
      return JSON.parse(val);
    } catch(e) {
      return fallback;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch(e) { /* storage full or unavailable */ }
  }

  BD.Storage = {
    // High Score
    getHighScore() { return get(KEYS.HIGH_SCORE, 0); },
    setHighScore(v) { set(KEYS.HIGH_SCORE, v); },

    // Level
    getLevel() { return get(KEYS.LEVEL, 1); },
    setLevel(v) { set(KEYS.LEVEL, v); },

    // Stats
    getStats() {
      return get(KEYS.STATS, {
        totalGames: 0,
        bestScore: 0,
        totalLinesCleared: 0,
        bestCombo: 0,
        totalBlocksPlaced: 0,
        totalScore: 0,
        totalPlayTimeMs: 0,
      });
    },
    setStats(v) { set(KEYS.STATS, v); },

    // Achievements
    getAchievements() { return get(KEYS.ACHIEVEMENTS, {}); },
    setAchievements(v) { set(KEYS.ACHIEVEMENTS, v); },

    // Settings
    getSettings() {
      return get(KEYS.SETTINGS, {
        soundOn: true,
        musicOn: true,
        vibrationOn: true,
      });
    },
    setSettings(v) { set(KEYS.SETTINGS, v); },

    // Theme
    getTheme() { return get(KEYS.THEME, 'sakura'); },
    setTheme(v) { set(KEYS.THEME, v); },

    // Unlocked themes
    getUnlockedThemes() { return get(KEYS.UNLOCKED_THEMES, ['sakura']); },
    setUnlockedThemes(v) { set(KEYS.UNLOCKED_THEMES, v); },

    // Power-ups
    getPowerups() {
      return get(KEYS.POWERUPS, { bomb: 1, colorBlast: 0, undo: 1 });
    },
    setPowerups(v) { set(KEYS.POWERUPS, v); },

    // Tutorial
    isTutorialDone() { return get(KEYS.TUTORIAL_DONE, false); },
    setTutorialDone(v) { set(KEYS.TUTORIAL_DONE, v); },

    // Streak
    getStreak() { return get(KEYS.STREAK, 0); },
    setStreak(v) { set(KEYS.STREAK, v); },
    getLastPlayDate() { return get(KEYS.LAST_PLAY_DATE, null); },
    setLastPlayDate(v) { set(KEYS.LAST_PLAY_DATE, v); },

    // Update streak on game start
    updateDailyStreak() {
      const today = new Date().toISOString().slice(0, 10);
      const last = this.getLastPlayDate();
      if (last === today) return; // already played today

      if (last) {
        const lastDate = new Date(last);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          this.setStreak(this.getStreak() + 1);
        } else if (diffDays > 1) {
          this.setStreak(1);
        }
      } else {
        this.setStreak(1);
      }
      this.setLastPlayDate(today);
    },

    // Language
    getLanguage() { return get(KEYS.LANGUAGE, null); },
    setLanguage(v) { set(KEYS.LANGUAGE, v); },

    // Reset all
    resetAll() {
      Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    },
  };
})();
