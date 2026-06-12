// =============================================
// BLOCK DROP – AUDIO
// Web Audio API synthesizer – no external files
// =============================================

(function() {
  let audioCtx = null;
  let musicGain = null;
  let sfxGain = null;
  let musicPlaying = false;
  let musicInterval = null;

  function ensureCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      sfxGain = audioCtx.createGain();
      sfxGain.gain.value = 0.4;
      sfxGain.connect(audioCtx.destination);
      musicGain = audioCtx.createGain();
      musicGain.gain.value = 0.3; // Increased from 0.12 so it's audible
      musicGain.connect(audioCtx.destination);
    }
    return audioCtx;
  }

  function playNote(freq, duration, type, gainNode, volume, delay) {
    const ctx = ensureCtx();
    if (ctx.state !== 'running') return; // Prevent scheduling backlog if suspended
    
    const g = gainNode || sfxGain;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    
    const now = ctx.currentTime + (delay || 0);
    env.gain.setValueAtTime(0.001, now);
    env.gain.linearRampToValueAtTime(volume || 0.3, now + 0.01);
    env.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    osc.connect(env);
    env.connect(g);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  function playNoise(duration, gainNode, volume, delay) {
    const ctx = ensureCtx();
    if (ctx.state !== 'running') return;

    const g = gainNode || sfxGain;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const env = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 1;
    
    const now = ctx.currentTime + (delay || 0);
    env.gain.setValueAtTime(volume || 0.1, now);
    env.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    noise.connect(filter);
    filter.connect(env);
    env.connect(g);
    noise.start(now);
    noise.stop(now + duration + 0.05);
  }

  BD.Audio = {
    settings: { soundOn: true, musicOn: true },
    wantsMusic: false,

    init() {
      const s = BD.Storage.getSettings();
      this.settings.soundOn = s.soundOn;
      this.settings.musicOn = s.musicOn;
      this.wantsMusic = s.musicOn;
    },

    unlock() {
      const ctx = ensureCtx();
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
          if (this.wantsMusic && !musicPlaying && this.settings.musicOn) {
            this.startMusic();
          }
        });
      }
    },

    // --- SFX ---
    playPlace() {
      if (!this.settings.soundOn) return;
      playNote(520, 0.08, 'sine', sfxGain, 0.25);
      playNote(780, 0.06, 'sine', sfxGain, 0.15, 0.03);
    },

    playPickup() {
      if (!this.settings.soundOn) return;
      playNote(400, 0.06, 'sine', sfxGain, 0.15);
    },

    playClear(lineCount) {
      if (!this.settings.soundOn) return;
      playNoise(0.15, sfxGain, 0.12);
      const baseFreq = 600 + lineCount * 100;
      playNote(baseFreq, 0.15, 'triangle', sfxGain, 0.2, 0.05);
      playNote(baseFreq * 1.25, 0.12, 'triangle', sfxGain, 0.18, 0.1);
      playNote(baseFreq * 1.5, 0.15, 'triangle', sfxGain, 0.2, 0.15);
    },

    playCombo(comboCount) {
      if (!this.settings.soundOn) return;
      const base = 400 + comboCount * 50;
      playNote(base, 0.2, 'triangle', sfxGain, 0.2);
      playNote(base * 1.25, 0.2, 'triangle', sfxGain, 0.18, 0.08);
      playNote(base * 1.5, 0.25, 'triangle', sfxGain, 0.2, 0.16);
      playNote(base * 2, 0.3, 'sine', sfxGain, 0.15, 0.24);
    },

    playGameOver() {
      if (!this.settings.soundOn) return;
      playNote(400, 0.3, 'triangle', sfxGain, 0.2);
      playNote(350, 0.3, 'triangle', sfxGain, 0.18, 0.2);
      playNote(300, 0.3, 'triangle', sfxGain, 0.15, 0.4);
      playNote(250, 0.5, 'sine', sfxGain, 0.2, 0.6);
    },

    playTap() {
      if (!this.settings.soundOn) return;
      playNote(800, 0.04, 'square', sfxGain, 0.08);
    },

    playInvalid() {
      if (!this.settings.soundOn) return;
      playNote(200, 0.08, 'square', sfxGain, 0.1);
      playNote(180, 0.08, 'square', sfxGain, 0.08, 0.06);
    },

    playLevelUp() {
      if (!this.settings.soundOn) return;
      const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
      notes.forEach((f, i) => {
        playNote(f, 0.2, 'triangle', sfxGain, 0.22, i * 0.1);
      });
      playNote(1047, 0.4, 'sine', sfxGain, 0.15, 0.45);
    },

    playPowerup() {
      if (!this.settings.soundOn) return;
      playNote(300, 0.1, 'sawtooth', sfxGain, 0.12);
      playNote(600, 0.15, 'sine', sfxGain, 0.2, 0.05);
      playNote(900, 0.2, 'sine', sfxGain, 0.15, 0.12);
      playNoise(0.2, sfxGain, 0.08, 0.05);
    },

    playAchievement() {
      if (!this.settings.soundOn) return;
      playNote(880, 0.1, 'sine', sfxGain, 0.2);
      playNote(1100, 0.1, 'sine', sfxGain, 0.18, 0.1);
      playNote(1320, 0.2, 'triangle', sfxGain, 0.22, 0.2);
    },

    // --- BACKGROUND MUSIC ---
    startMusic() {
      this.wantsMusic = true;
      if (!this.settings.musicOn || musicPlaying) return;
      
      const ctx = ensureCtx();
      if (ctx.state !== 'running') return; // Wait for unlock()
      
      musicPlaying = true;
      
      const scale = [262, 294, 330, 349, 392, 440, 494, 523]; // C major
      const pattern = [0, 2, 4, 5, 4, 2, 3, 1];
      let step = 0;

      const playStep = () => {
        if (!musicPlaying || !this.settings.musicOn) return;
        const freq = scale[pattern[step % pattern.length]];
        
        // Brighter chill loop
        playNote(freq, 0.6, 'sine', musicGain, 0.25);
        playNote(freq * 1.5, 0.8, 'triangle', musicGain, 0.08); // overtone
        
        if (step % 4 === 0) {
          playNote(freq * 0.5, 1.2, 'sine', musicGain, 0.2); // bass
        }

        step++;
      };

      playStep();
      musicInterval = setInterval(playStep, 800);
    },

    stopMusic() {
      this.wantsMusic = false;
      musicPlaying = false;
      if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
      }
    },

    toggleSound() {
      this.settings.soundOn = !this.settings.soundOn;
      const s = BD.Storage.getSettings();
      s.soundOn = this.settings.soundOn;
      BD.Storage.setSettings(s);
      
      const ctx = ensureCtx();
      if (ctx.state === 'suspended') ctx.resume();
      
      if (this.settings.soundOn) this.playTap();
    },

    toggleMusic() {
      this.settings.musicOn = !this.settings.musicOn;
      const s = BD.Storage.getSettings();
      s.musicOn = this.settings.musicOn;
      BD.Storage.setSettings(s);
      
      const ctx = ensureCtx();
      if (ctx.state === 'suspended') ctx.resume();

      if (this.settings.musicOn) {
        this.wantsMusic = true;
        this.startMusic();
      } else {
        this.stopMusic();
      }
    },
  };
})();
