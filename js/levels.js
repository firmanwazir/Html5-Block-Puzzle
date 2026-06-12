// =============================================
// BLOCK DROP – LEVELS
// Level / target system & progression
// =============================================

(function() {

  let level = 1;
  let levelScore = 0;  // score accumulated in current level
  let showingLevelUp = false;
  let levelUpTimer = 0;
  let levelUpAnimProgress = 0;

  function targetForLevel(lvl) {
    // Progressive curve: 500, 800, 1200, 1700, 2300, 3000, ...
    return Math.floor(500 + (lvl - 1) * 300 + (lvl - 1) * (lvl - 1) * 50);
  }

  function progressPercent() {
    const target = targetForLevel(level);
    return BD.clamp(levelScore / target, 0, 1);
  }

  BD.Levels = {
    get level() { return level; },
    get levelScore() { return levelScore; },
    get showingLevelUp() { return showingLevelUp; },
    get levelUpAnimProgress() { return levelUpAnimProgress; },

    init() {
      level = 1;
      levelScore = 0;
      showingLevelUp = false;
      levelUpTimer = 0;
      levelUpAnimProgress = 0;
    },

    targetForLevel,
    progressPercent,

    currentTarget() {
      return targetForLevel(level);
    },

    // Add score and check for level up
    // Returns: { leveledUp: bool, newLevel: number, reward: string|null }
    addScore(points) {
      levelScore += points;
      const target = targetForLevel(level);

      if (levelScore >= target) {
        levelScore -= target;
        level++;
        showingLevelUp = true;
        levelUpTimer = 2.5; // show for 2.5 seconds
        levelUpAnimProgress = 0;

        // Determine reward
        let reward = null;
        if (level % 5 === 0) {
          // Every 5 levels: give undo power-up
          reward = 'undo';
        } else if (level % 3 === 0) {
          // Every 3 levels: give bomb
          reward = 'bomb';
        }

        return { leveledUp: true, newLevel: level, reward };
      }

      return { leveledUp: false, newLevel: level, reward: null };
    },

    update(dt) {
      if (showingLevelUp) {
        levelUpTimer -= dt;
        levelUpAnimProgress += dt;
        if (levelUpTimer <= 0) {
          showingLevelUp = false;
        }
      }
    },

    dismissLevelUp() {
      showingLevelUp = false;
      levelUpTimer = 0;
    },

    // Draw level up celebration
    draw(ctx) {
      if (!showingLevelUp) return;

      const t = BD.clamp(levelUpAnimProgress / 0.5, 0, 1); // entrance anim
      const fadeOut = BD.clamp(levelUpTimer / 0.5, 0, 1); // exit fade
      const alpha = Math.min(BD.easeOut(t), fadeOut);

      // Overlay
      ctx.fillStyle = `rgba(0,0,0,${0.3 * alpha})`;
      ctx.fillRect(0, 0, BD.W, BD.H);

      // Card
      const cardW = 350;
      const cardH = 250;
      const cardX = BD.W / 2 - cardW / 2;
      const cardY = BD.H / 2 - cardH / 2 - 30 * (1 - BD.easeOut(t));

      ctx.globalAlpha = alpha;

      // Card shadow
      ctx.shadowColor = 'rgba(255,215,0,0.3)';
      ctx.shadowBlur = 40;
      BD.drawRoundRect(ctx, cardX, cardY, cardW, cardH, 25);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Gold ring pulse
      const pulse = Math.sin(levelUpAnimProgress * 6) * 5;
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 4;
      BD.drawRoundRect(ctx, cardX - 4 - pulse, cardY - 4 - pulse,
                        cardW + 8 + pulse*2, cardH + 8 + pulse*2, 28);
      ctx.stroke();

      // Star emoji
      ctx.font = '64px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⭐', BD.W / 2, cardY + 65);

      // Level Up text
      const theme = BD.Themes.current();
      ctx.fillStyle = theme.accent;
      ctx.font = '900 42px Nunito, sans-serif';
      ctx.fillText('LEVEL UP!', BD.W / 2, cardY + 125);

      // Level number
      ctx.fillStyle = theme.textDark;
      ctx.font = '900 64px Nunito, sans-serif';
      ctx.fillText(`Level ${level}`, BD.W / 2, cardY + 195);

      // Target
      ctx.fillStyle = theme.textLight;
      ctx.font = '600 22px Nunito, sans-serif';
      ctx.fillText(`Next: ${targetForLevel(level).toLocaleString()} pts`, BD.W / 2, cardY + 230);

      ctx.textAlign = 'left';
      ctx.globalAlpha = 1;
    },
  };

})();
