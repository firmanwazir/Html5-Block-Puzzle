// =============================================
// BLOCK DROP – i18n (Localization)
// =============================================

window.BD = window.BD || {};

(function() {
  const dictionary = {
    en: {
      // General & UI
      "score": "SCORE",
      "best": "BEST",
      "lvl": "LVL",
      "target": "Target",
      "pts": "pts",
      "game_over": "Game Over",
      "level": "Level",
      "final_score": "Final Score",
      "new_best": "🎉 New Best! 🎉",
      "achievements": "Achievements",
      "play_again": "Play Again ✨",
      "share_score": "📱 Share Score",
      "main_menu": "🏠 Main Menu",
      "stats": "📊 Stats",
      "themes": "🎨 Themes",
      "settings": "⚙️ Settings",
      "play": "▶  PLAY",
      "best_score_title": "🏆 Best Score",
      "achievements_title": "⭐ Achievements",
      "subtitle": "Match • Clear • Conquer",
      "copied": "📋 Copied!",
      "share_text": "🎮 I scored {score} in Block Drop! Level {level} 🌟 Can you beat me?",

      // Powerups
      "pu_bomb": "Bomb",
      "pu_color": "Color",
      "pu_undo": "Undo",
      "pick_color": "Pick a color to clear",
      "drag_blocks": "Drag blocks to the grid",
      
      // Powerup info popups
      "info_bomb": "Clear 3+ lines to get Bombs! 💣",
      "info_color": "Reach Combo x3 for Color Blast! 🌈",
      "info_undo": "Level Up to get Undo! ↩️",

      // Floating Texts
      "combo": "COMBO x{count}!",
      "award_bomb": "💣 +1 Bomb!",
      "award_color": "🌈 +1 Color Blast!",
      "board_clear": "🧹 Board Clear! +500",

      // Modals
      "stats_title": "📊 Statistics",
      "achievements_modal_title": "🏆 Achievements",
      "themes_modal_title": "🎨 Themes",
      "settings_modal_title": "⚙️ Settings",
      "active": "✓ Active",
      "locked": "🔒 {req}",

      // Settings
      "sound_fx": "🔊 Sound Effects",
      "bg_music": "🎵 Background Music",
      "vibration": "📳 Vibration",
      "language": "🌐 Language",
      "reset_progress": "🗑️ Reset All Progress",
      "reset_warning_1": "This will clear all scores, stats,",
      "reset_warning_2": "achievements, and unlocked themes.",
      "reset_confirm": "Are you sure you want to reset all progress? This cannot be undone.",

      // Language Select
      "select_language": "Select Language",
      "lang_en": "English",
      "lang_id": "Bahasa Indonesia",

      // Stats labels
      stat_games: 'Total Games', stat_best: 'Best Score', stat_avg: 'Avg Score', stat_lines: 'Lines Cleared',
      stat_combo: 'Best Combo', stat_blocks: 'Blocks Placed', stat_streak: 'Daily Streak', stat_time: 'Play Time',
      time_h: 'h', time_m: 'm', days: 'days',

      // Themes
      theme_sakura_name: '🌸 Sakura', theme_sakura_desc: 'Warm & sweet', theme_sakura_unlock: 'Free',
      theme_midnight_name: '🌙 Midnight', theme_midnight_desc: 'Dark & cool', theme_midnight_unlock: 'Reach Level 5',
      theme_ocean_name: '🌊 Ocean', theme_ocean_desc: 'Deep sea calm', theme_ocean_unlock: 'Reach Level 10',
      theme_candy_name: '🍬 Candy', theme_candy_desc: 'Pastel rainbow', theme_candy_unlock: 'Score 20,000',
      theme_forest_name: '🌿 Forest', theme_forest_desc: 'Natural earth', theme_forest_unlock: 'Play 50 games',
      theme_neon_name: '✨ Neon', theme_neon_desc: 'Electric glow', theme_neon_unlock: 'Get Combo x5',

      // Tutorial
      "tut_skip": "Skip",
      "tut_1_title": "Welcome to Block Drop! ✨",
      "tut_1_desc": "A fun puzzle game where you place blocks to clear rows & columns!",
      "tut_2_title": "Your Block Pieces",
      "tut_2_desc": "These are your blocks. You get 3 at a time!",
      "tut_3_title": "Drag & Drop",
      "tut_3_desc": "Drag a block from here onto the grid above!",
      "tut_4_title": "Fill Lines to Clear",
      "tut_4_desc": "Complete a full row or column to clear it and score points!",
      "tut_5_title": "Combos = Big Points!",
      "tut_5_desc": "Clear lines back-to-back for combo multipliers!",
      "tut_6_title": "Power-Ups",
      "tut_6_desc": "Use 💣 Bomb, 🌈 Color Blast, and ↩️ Undo to help you!",
      "tut_7_title": "Ready? Let's Play!",
      "tut_7_desc": "Have fun and try to beat your high score!",

      // Achievements
      "achievement_unlocked": "Achievement Unlocked!",
      "ach_1_name": "Beginner", "ach_1_desc": "Score 1,000 points",
      "ach_2_name": "Getting Good", "ach_2_desc": "Score 5,000 points",
      "ach_3_name": "Pro Player", "ach_3_desc": "Score 10,000 points",
      "ach_4_name": "Expert", "ach_4_desc": "Score 25,000 points",
      "ach_5_name": "Master", "ach_5_desc": "Score 50,000 points",
      "ach_6_name": "Legend", "ach_6_desc": "Score 100,000 points",
      "ach_7_name": "First Clear", "ach_7_desc": "Clear your first line",
      "ach_8_name": "First Combo", "ach_8_desc": "Get combo x2",
      "ach_9_name": "Combo Pro", "ach_9_desc": "Get combo x3",
      "ach_10_name": "Combo King", "ach_10_desc": "Get combo x5",
      "ach_11_name": "Combo GOD", "ach_11_desc": "Get combo x8",
      "ach_12_name": "Line Storm", "ach_12_desc": "Clear 50 lines total",
      "ach_13_name": "Line Tsunami", "ach_13_desc": "Clear 200 lines total",
      "ach_14_name": "Builder", "ach_14_desc": "Place 100 blocks",
      "ach_15_name": "Architect", "ach_15_desc": "Place 500 blocks",
      "ach_16_name": "Day 1", "ach_16_desc": "Play your first game",
      "ach_17_name": "Dedicated", "ach_17_desc": "Play 10 games",
      "ach_18_name": "Addicted", "ach_18_desc": "Play 50 games",
      "ach_19_name": "3-Day Streak", "ach_19_desc": "Play 3 days in a row",
      "ach_20_name": "Weekly Star", "ach_20_desc": "Play 7 days in a row",
      "ach_21_name": "Climber", "ach_21_desc": "Reach level 5",
      "ach_22_name": "Mountaineer", "ach_22_desc": "Reach level 10",
      "ach_23_name": "Rocket", "ach_23_desc": "Reach level 20"
    },
    id: {
      // General & UI
      "score": "SKOR",
      "best": "TERBAIK",
      "lvl": "LVL",
      "target": "Target",
      "pts": "poin",
      "game_over": "Game Over",
      "level": "Level",
      "final_score": "Skor Akhir",
      "new_best": "🎉 Rekor Baru! 🎉",
      "achievements": "Pencapaian",
      "play_again": "Main Lagi ✨",
      "share_score": "📱 Bagikan Skor",
      "main_menu": "🏠 Menu Utama",
      "stats": "📊 Statistik",
      "themes": "🎨 Tema",
      "settings": "⚙️ Pengaturan",
      "play": "▶  MAIN",
      "best_score_title": "🏆 Skor Terbaik",
      "achievements_title": "⭐ Pencapaian",
      "subtitle": "Susun • Hancurkan • Taklukkan",
      "copied": "📋 Disalin!",
      "share_text": "🎮 Saya mencetak {score} di Block Drop! Level {level} 🌟 Bisa kalahkan saya?",

      // Powerups
      "pu_bomb": "Bom",
      "pu_color": "Warna",
      "pu_undo": "Batal",
      "pick_color": "Pilih warna untuk dihancurkan",
      "drag_blocks": "Tarik balok ke dalam kotak",
      
      // Powerup info popups
      "info_bomb": "Hancurkan 3+ baris untuk dapat Bom! 💣",
      "info_color": "Capai Combo x3 untuk Color Blast! 🌈",
      "info_undo": "Naik Level untuk dapat Undo! ↩️",

      // Floating Texts
      "combo": "COMBO x{count}!",
      "award_bomb": "💣 +1 Bom!",
      "award_color": "🌈 +1 Color Blast!",
      "board_clear": "🧹 Papan Bersih! +500",

      // Modals
      "stats_title": "📊 Statistik",
      "achievements_modal_title": "🏆 Pencapaian",
      "themes_modal_title": "🎨 Tema",
      "settings_modal_title": "⚙️ Pengaturan",
      "active": "✓ Aktif",
      "locked": "🔒 Syarat: {req}",

      // Settings
      "sound_fx": "🔊 Efek Suara",
      "bg_music": "🎵 Musik Latar",
      "vibration": "📳 Getaran",
      "language": "🌐 Bahasa",
      "reset_progress": "🗑️ Hapus Semua Data",
      "reset_warning_1": "Ini akan menghapus skor, statistik,",
      "reset_warning_2": "pencapaian, dan tema yang terbuka.",
      "reset_confirm": "Yakin ingin menghapus semua data? Ini tidak bisa dibatalkan.",

      // Language Select
      "select_language": "Pilih Bahasa",
      "lang_en": "English",
      "lang_id": "Bahasa Indonesia",

      // Stats labels
      stat_games: 'Total Main', stat_best: 'Skor Terbaik', stat_avg: 'Rata-rata Skor', stat_lines: 'Baris Hancur',
      stat_combo: 'Kombo Terbaik', stat_blocks: 'Balok Ditaruh', stat_streak: 'Main Harian', stat_time: 'Waktu Main',
      time_h: 'j', time_m: 'm', days: 'hari',

      // Themes
      theme_sakura_name: '🌸 Sakura', theme_sakura_desc: 'Hangat & manis', theme_sakura_unlock: 'Gratis',
      theme_midnight_name: '🌙 Midnight', theme_midnight_desc: 'Gelap & keren', theme_midnight_unlock: 'Capai Level 5',
      theme_ocean_name: '🌊 Ocean', theme_ocean_desc: 'Tenang samudera', theme_ocean_unlock: 'Capai Level 10',
      theme_candy_name: '🍬 Candy', theme_candy_desc: 'Pelangi pastel', theme_candy_unlock: 'Cetak 20.000',
      theme_forest_name: '🌿 Forest', theme_forest_desc: 'Alam bumi', theme_forest_unlock: 'Main 50 kali',
      theme_neon_name: '✨ Neon', theme_neon_desc: 'Cahaya elektrik', theme_neon_unlock: 'Dapat Kombo x5',

      // Tutorial
      "tut_skip": "Lewati",
      "tut_1_title": "Selamat datang di Block Drop! ✨",
      "tut_1_desc": "Game teka-teki seru di mana kamu menaruh balok untuk menghancurkan baris & kolom!",
      "tut_2_title": "Kepingan Balokmu",
      "tut_2_desc": "Ini balok milikmu. Kamu dapat 3 sekaligus!",
      "tut_3_title": "Tarik & Taruh",
      "tut_3_desc": "Tarik balok dari sini ke papan di atas!",
      "tut_4_title": "Penuhi Baris",
      "tut_4_desc": "Lengkapi satu baris atau kolom untuk menghancurkannya dan dapat skor!",
      "tut_5_title": "Kombo = Skor Besar!",
      "tut_5_desc": "Hancurkan baris berturut-turut untuk kali lipat kombo!",
      "tut_6_title": "Bantuan (Power-Ups)",
      "tut_6_desc": "Gunakan 💣 Bom, 🌈 Color Blast, dan ↩️ Undo untuk membantumu!",
      "tut_7_title": "Siap Bermain?",
      "tut_7_desc": "Selamat bersenang-senang dan coba kalahkan rekor tertinggimu!",

      // Achievements
      "achievement_unlocked": "Pencapaian Terbuka!",
      "ach_1_name": "Pemula", "ach_1_desc": "Cetak 1.000 poin",
      "ach_2_name": "Makin Jago", "ach_2_desc": "Cetak 5.000 poin",
      "ach_3_name": "Pemain Pro", "ach_3_desc": "Cetak 10.000 poin",
      "ach_4_name": "Ahli", "ach_4_desc": "Cetak 25.000 poin",
      "ach_5_name": "Master", "ach_5_desc": "Cetak 50.000 poin",
      "ach_6_name": "Legenda", "ach_6_desc": "Cetak 100.000 poin",
      "ach_7_name": "Hancuran Pertama", "ach_7_desc": "Hancurkan baris pertamamu",
      "ach_8_name": "Kombo Pertama", "ach_8_desc": "Dapatkan kombo x2",
      "ach_9_name": "Pro Kombo", "ach_9_desc": "Dapatkan kombo x3",
      "ach_10_name": "Raja Kombo", "ach_10_desc": "Dapatkan kombo x5",
      "ach_11_name": "Dewa Kombo", "ach_11_desc": "Dapatkan kombo x8",
      "ach_12_name": "Badai Baris", "ach_12_desc": "Hancurkan 50 baris total",
      "ach_13_name": "Tsunami Baris", "ach_13_desc": "Hancurkan 200 baris total",
      "ach_14_name": "Pembangun", "ach_14_desc": "Taruh 100 balok",
      "ach_15_name": "Arsitek", "ach_15_desc": "Taruh 500 balok",
      "ach_16_name": "Hari 1", "ach_16_desc": "Mainkan game pertamamu",
      "ach_17_name": "Berdedikasi", "ach_17_desc": "Main 10 kali",
      "ach_18_name": "Kecanduan", "ach_18_desc": "Main 50 kali",
      "ach_19_name": "3 Hari Berturut", "ach_19_desc": "Main 3 hari berturut-turut",
      "ach_20_name": "Bintang Minggu", "ach_20_desc": "Main 7 hari berturut-turut",
      "ach_21_name": "Pendaki", "ach_21_desc": "Capai level 5",
      "ach_22_name": "Pendaki Gunung", "ach_22_desc": "Capai level 10",
      "ach_23_name": "Roket", "ach_23_desc": "Capai level 20"
    }
  };

  let currentLang = 'en';

  BD.i18n = {
    init() {
      const saved = BD.Storage.getLanguage();
      if (saved) {
        currentLang = saved;
      } else {
        // Auto-detect browser language if possible, fallback to English
        const navLang = navigator.language || navigator.userLanguage;
        if (navLang && navLang.toLowerCase().startsWith('id')) {
          currentLang = 'id';
        } else {
          currentLang = 'en';
        }
      }
    },
    
    setLang(lang) {
      if (dictionary[lang]) {
        currentLang = lang;
        BD.Storage.setLanguage(lang);
      }
    },

    getLang() {
      return currentLang;
    },

    t(key, params) {
      const str = dictionary[currentLang][key] || dictionary['en'][key] || key;
      if (!params) return str;
      
      let result = str;
      for (const [k, v] of Object.entries(params)) {
        result = result.replace(`{${k}}`, v);
      }
      return result;
    }
  };

})();
