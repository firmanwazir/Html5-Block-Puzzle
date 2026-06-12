// =============================================
// BLOCK DROP – PARTICLES
// Particle system, floating texts, animations
// =============================================

(function() {

  let particles = [];
  let starParticles = [];
  let floatingTexts = [];
  let confetti = [];
  let bgShapes = [];
  let cellAnims = []; // { r, c, type, progress, duration, ... }

  // Background floating shapes
  function initBgShapes() {
    bgShapes = [];
    for (let i = 0; i < 15; i++) {
      bgShapes.push({
        x: Math.random() * BD.W,
        y: Math.random() * BD.H,
        size: 6 + Math.random() * 14,
        speed: 8 + Math.random() * 20,
        drift: (Math.random() - 0.5) * 15,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.5,
        type: ['heart', 'star', 'circle', 'diamond'][Math.floor(Math.random() * 4)],
        alpha: 0.04 + Math.random() * 0.06,
      });
    }
  }
  initBgShapes();

  BD.Particles = {
    get particles() { return particles; },
    get cellAnims() { return cellAnims; },

    reset() {
      particles = [];
      starParticles = [];
      floatingTexts = [];
      confetti = [];
      cellAnims = [];
    },

    // ---- CLEAR PARTICLES ----
    spawnClearParticles(cx, cy, colorIdx) {
      const theme = BD.Themes ? BD.Themes.current() : null;
      const palettes = theme ? theme.palettes : BD.DEFAULT_PALETTES;
      const palette = palettes[colorIdx] || palettes[0];
      for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 100 + Math.random() * 250;
        particles.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          size: 4 + Math.random() * 7,
          color: Math.random() > 0.5 ? palette.fill : palette.glow,
          shape: Math.random() > 0.5 ? 'circle' : 'square',
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 8,
        });
      }
    },

    // ---- PLACE PARTICLES ----
    spawnPlaceParticles(cx, cy, colorIdx) {
      const theme = BD.Themes ? BD.Themes.current() : null;
      const palettes = theme ? theme.palettes : BD.DEFAULT_PALETTES;
      const palette = palettes[colorIdx] || palettes[0];
      for (let i = 0; i < 4; i++) {
        particles.push({
          x: cx, y: cy,
          vx: (Math.random() - 0.5) * 120,
          vy: (Math.random() - 0.5) * 120,
          life: 0.6,
          size: 3 + Math.random() * 4,
          color: palette.glow,
          shape: 'circle',
          rotation: 0, rotSpeed: 0,
        });
      }
    },

    // ---- STAR BURST ----
    spawnStarBurst(cx, cy, count) {
      const theme = BD.Themes ? BD.Themes.current() : null;
      const palettes = theme ? theme.palettes : BD.DEFAULT_PALETTES;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i + Math.random() * 0.3;
        starParticles.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * (200 + Math.random() * 180),
          vy: Math.sin(angle) * (200 + Math.random() * 180),
          life: 1.0,
          size: 8 + Math.random() * 12,
          color: palettes[Math.floor(Math.random() * palettes.length)].fill,
          rotation: Math.random() * Math.PI * 2,
        });
      }
    },

    // ---- CONFETTI ----
    spawnConfetti(cx, cy, count) {
      const colors = ['#FF6B9D','#7C5CFC','#00C9A7','#FFB347','#4FC3F7','#FF8A80','#AED581','#FFD700'];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 150 + Math.random() * 350;
        confetti.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 200,
          life: 1.5,
          w: 6 + Math.random() * 8,
          h: 3 + Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 12,
          sway: Math.random() * Math.PI * 2,
        });
      }
    },

    // ---- FLOATING TEXT ----
    addFloatingText(x, y, text, color, size) {
      floatingTexts.push({ x, y, text, life: 1.2, color: color || '#7C5CFC', size: size || 48 });
    },

    // ---- CELL ANIMATIONS ----
    addCellAnim(r, c, type, duration, data) {
      cellAnims.push({ r, c, type, progress: 0, duration: duration || 0.3, data: data || {} });
    },

    // Bounce-in when placing block
    addBounceIn(r, c) {
      this.addCellAnim(r, c, 'bounceIn', 0.3);
    },

    // Wave-clear animation
    addWaveClear(cells, delayPerCell) {
      cells.forEach(({ r, c }, idx) => {
        this.addCellAnim(r, c, 'waveClear', 0.4, { delay: idx * (delayPerCell || 0.03) });
      });
    },

    // ---- UPDATE ----
    update(dt) {
      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt * 1.8;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 350 * dt;
        p.vx *= 0.98;
        p.rotation += p.rotSpeed * dt;
      }

      // Stars
      for (let i = starParticles.length - 1; i >= 0; i--) {
        const s = starParticles[i];
        s.life -= dt * 1.2;
        if (s.life <= 0) { starParticles.splice(i, 1); continue; }
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vy += 200 * dt;
        s.rotation += 4 * dt;
      }

      // Floating texts
      for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.life -= dt * 0.7;
        if (ft.life <= 0) { floatingTexts.splice(i, 1); continue; }
        ft.y -= 70 * dt;
      }

      // Confetti
      for (let i = confetti.length - 1; i >= 0; i--) {
        const c = confetti[i];
        c.life -= dt * 0.6;
        if (c.life <= 0) { confetti.splice(i, 1); continue; }
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        c.vy += 400 * dt;
        c.vx *= 0.99;
        c.rotation += c.rotSpeed * dt;
        c.sway += 3 * dt;
        c.x += Math.sin(c.sway) * 30 * dt;
      }

      // Background shapes
      for (const s of bgShapes) {
        s.y -= s.speed * dt;
        s.x += s.drift * dt;
        s.rotation += s.rotSpeed * dt;
        if (s.y < -30) { s.y = BD.H + 30; s.x = Math.random() * BD.W; }
        if (s.x < -30) s.x = BD.W + 30;
        if (s.x > BD.W + 30) s.x = -30;
      }

      // Cell anims
      for (let i = cellAnims.length - 1; i >= 0; i--) {
        const a = cellAnims[i];
        const delay = a.data.delay || 0;
        a.progress += dt;
        if (a.progress - delay >= a.duration) {
          cellAnims.splice(i, 1);
        }
      }
    },

    // ---- DRAW ----
    drawBgShapes(ctx) {
      const theme = BD.Themes ? BD.Themes.current() : null;
      const accentColor = theme ? theme.accent : '#FF6B9D';
      
      for (const s of bgShapes) {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = accentColor;

        if (s.type === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, s.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (s.type === 'star') {
          BD.drawStar(ctx, 0, 0, s.size, 5);
          ctx.fill();
        } else if (s.type === 'heart') {
          drawHeart(ctx, 0, 0, s.size);
        } else if (s.type === 'diamond') {
          ctx.beginPath();
          ctx.moveTo(0, -s.size);
          ctx.lineTo(s.size * 0.6, 0);
          ctx.lineTo(0, s.size);
          ctx.lineTo(-s.size * 0.6, 0);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }
      ctx.globalAlpha = 1;
    },

    drawParticles(ctx) {
      for (const p of particles) {
        const alpha = p.life;
        const size = p.size * p.life;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-size/2, -size/2, size, size);
        }
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    },

    drawStars(ctx) {
      for (const s of starParticles) {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.globalAlpha = s.life;
        ctx.fillStyle = s.color;
        BD.drawStar(ctx, 0, 0, s.size * s.life, 5);
        ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    },

    drawFloatingTexts(ctx) {
      for (const ft of floatingTexts) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, ft.life);
        ctx.fillStyle = ft.color;
        ctx.font = `900 ${ft.size}px Nunito, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 8;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.shadowBlur = 0;
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
    },

    drawConfetti(ctx) {
      for (const c of confetti) {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        ctx.globalAlpha = Math.min(1, c.life);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.w/2, -c.h/2, c.w, c.h);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    },

    // Get cell animation state
    getCellAnim(r, c) {
      for (const a of cellAnims) {
        if (a.r === r && a.c === c) {
          const delay = a.data.delay || 0;
          const t = BD.clamp((a.progress - delay) / a.duration, 0, 1);
          if (t <= 0) return null;
          return { type: a.type, t };
        }
      }
      return null;
    },

    reinitBg() { initBgShapes(); },
  };

  // ---- Helper: draw heart shape ----
  function drawHeart(ctx, cx, cy, size) {
    ctx.beginPath();
    const s = size * 0.6;
    ctx.moveTo(cx, cy + s * 0.3);
    ctx.bezierCurveTo(cx, cy - s * 0.3, cx - s, cy - s * 0.3, cx - s, cy + s * 0.1);
    ctx.bezierCurveTo(cx - s, cy + s * 0.6, cx, cy + s, cx, cy + s);
    ctx.bezierCurveTo(cx, cy + s, cx + s, cy + s * 0.6, cx + s, cy + s * 0.1);
    ctx.bezierCurveTo(cx + s, cy - s * 0.3, cx, cy - s * 0.3, cx, cy + s * 0.3);
    ctx.closePath();
    ctx.fill();
  }

})();
