// =============================================
// BLOCK DROP – INPUT
// Touch/mouse handling + haptic vibration
// =============================================

(function() {

  let vibrationEnabled = true;

  function vibrate(pattern) {
    if (!vibrationEnabled) return;
    try {
      if (navigator.vibrate) navigator.vibrate(pattern);
    } catch(e) {}
  }

  function getCanvasPos(canvas, clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = BD.W / rect.width;
    const scaleY = BD.H / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  BD.Input = {
    vibrate,

    init(canvas, game) {
      const s = BD.Storage.getSettings();
      vibrationEnabled = s.vibrationOn;

      // ---- TOUCH ----
      canvas.addEventListener('touchstart', e => {
        e.preventDefault();
        BD.Audio.unlock();
        const t = e.touches[0];
        const p = getCanvasPos(canvas, t.clientX, t.clientY);
        game.onPointerDown(p.x, p.y);
      }, { passive: false });

      canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        const t = e.touches[0];
        const p = getCanvasPos(canvas, t.clientX, t.clientY);
        game.onPointerMove(p.x, p.y);
      }, { passive: false });

      canvas.addEventListener('touchend', e => {
        e.preventDefault();
        const t = e.changedTouches[0];
        const p = getCanvasPos(canvas, t.clientX, t.clientY);
        game.onPointerUp(p.x, p.y);
      }, { passive: false });

      // ---- MOUSE ----
      canvas.addEventListener('mousedown', e => {
        BD.Audio.unlock();
        const p = getCanvasPos(canvas, e.clientX, e.clientY);
        game.onPointerDown(p.x, p.y);
      });
      canvas.addEventListener('mousemove', e => {
        const p = getCanvasPos(canvas, e.clientX, e.clientY);
        game.onPointerMove(p.x, p.y);
      });
      canvas.addEventListener('mouseup', e => {
        const p = getCanvasPos(canvas, e.clientX, e.clientY);
        game.onPointerUp(p.x, p.y);
      });
    },

    setVibration(on) {
      vibrationEnabled = on;
      const s = BD.Storage.getSettings();
      s.vibrationOn = on;
      BD.Storage.setSettings(s);
    },

    toggleVibration() {
      vibrationEnabled = !vibrationEnabled;
      const s = BD.Storage.getSettings();
      s.vibrationOn = vibrationEnabled;
      BD.Storage.setSettings(s);
    },

    isVibrationOn() {
      return vibrationEnabled;
    },
  };

})();
