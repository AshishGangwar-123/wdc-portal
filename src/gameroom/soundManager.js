/* ==========================================================================
   Code City Explorer — Advanced Procedural Sound Engine v2
   Uses Web Audio API for zero-dependency dynamic engine revving, drift screeches,
   nitro whooshes, UI chimes, and procedural Cyber Synthwave BGM!
   ========================================================================== */

class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.musicEnabled = true;
    this.masterGain = null;

    // Dynamic Engine Sound Nodes
    this.engineOsc = null;
    this.engineGain = null;
    this.engineFilter = null;
    this.isEngineRunning = false;

    // Procedural Synthwave BGM Nodes
    this.bgmOsc1 = null;
    this.bgmOsc2 = null;
    this.bgmGain = null;
    this.bgmTimer = null;
    this.isMusicPlaying = false;

    this._initialized = false;
  }

  init() {
    if (this._initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
      this._initialized = true;

      // Initialize Engine Sound
      this._initEngine();
    } catch (e) {
      console.warn('SoundManager: Web Audio API not available', e);
      this.enabled = false;
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(v) {
    if (this.masterGain) this.masterGain.gain.value = Math.max(0, Math.min(1, v));
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.masterGain) {
      this.masterGain.gain.value = this.enabled ? 0.3 : 0;
    }
    if (!this.enabled) {
      this.stopEngine();
      this.stopMusic();
    }
    return this.enabled;
  }

  // ── Procedural Car Engine Rev Sound ──────────────────────────────────────
  _initEngine() {
    if (!this.ctx || this.engineOsc) return;
    try {
      this.engineOsc = this.ctx.createOscillator();
      this.engineGain = this.ctx.createGain();
      this.engineFilter = this.ctx.createBiquadFilter();

      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.value = 65; // Idle pitch Hz

      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.value = 250;

      this.engineGain.gain.value = 0.05; // Gentle volume

      this.engineOsc.connect(this.engineFilter);
      this.engineFilter.connect(this.engineGain);
      this.engineGain.connect(this.masterGain);

      this.engineOsc.start();
      this.isEngineRunning = true;
    } catch (e) {
      // Ignore if auto-play restricted
    }
  }

  updateEngine(speedRatio = 0, isAccelerating = false) {
    if (!this.enabled || !this.ctx || !this.engineOsc) return;
    this.resume();

    const now = this.ctx.currentTime;
    // Map speed ratio (0 to 1) to frequency (65Hz to 260Hz)
    const targetFreq = 65 + speedRatio * 185 + (isAccelerating ? 30 : 0);
    const targetCutoff = 250 + speedRatio * 800;
    const targetVol = 0.04 + speedRatio * 0.08;

    this.engineOsc.frequency.setTargetAtTime(targetFreq, now, 0.08);
    this.engineFilter.frequency.setTargetAtTime(targetCutoff, now, 0.08);
    this.engineGain.gain.setTargetAtTime(targetVol, now, 0.1);
  }

  stopEngine() {
    if (this.engineGain && this.ctx) {
      this.engineGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
    }
  }

  // ── Procedural Cyber Synthwave BGM Loop ──────────────────────────────────
  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicEnabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
    return this.musicEnabled;
  }

  startMusic() {
    if (!this.enabled || !this.musicEnabled || !this.ctx || this.isMusicPlaying) return;
    this.resume();
    this.isMusicPlaying = true;

    // Rhythmic Cyber Bass Chords Pattern
    const chords = [
      [110, 164.81], // A2, E3
      [130.81, 196], // C3, G3
      [87.31, 130.81], // F2, C3
      [98, 146.83], // G2, D3
    ];
    let step = 0;

    this.bgmTimer = setInterval(() => {
      if (!this.enabled || !this.musicEnabled || !this.ctx) return;
      const now = this.ctx.currentTime;
      const pair = chords[step % chords.length];

      pair.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

        osc.connect(gain).connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 1.5);
      });

      step++;
    }, 1600);
  }

  stopMusic() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.isMusicPlaying = false;
  }

  // ── Tire Drift Screech Sound ─────────────────────────────────────────────
  playDrift() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 4;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    noise.connect(filter).connect(gain).connect(this.masterGain);
    noise.start(now);
    noise.stop(now + 0.15);
  }

  // ── Nitro / Turbo Boost Sound ───────────────────────────────────────────
  playNitro() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.connect(gain).connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  // ── Correct Block Collection Sound ──────────────────────────────────────
  playCorrect() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523, now);
    osc1.frequency.exponentialRampToValueAtTime(1047, now + 0.15);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc1.connect(gain1).connect(this.masterGain);
    osc1.start(now);
    osc1.stop(now + 0.3);

    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(784, now + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(1568, now + 0.2);
    gain2.gain.setValueAtTime(0.15, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc2.connect(gain2).connect(this.masterGain);
    osc2.start(now + 0.05);
    osc2.stop(now + 0.35);
  }

  // ── Wrong Answer Sound ──────────────────────────────────────────────────
  playWrong() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(300, now);
    osc1.frequency.exponentialRampToValueAtTime(100, now + 0.3);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc1.connect(gain1).connect(this.masterGain);
    osc1.start(now);
    osc1.stop(now + 0.35);
  }

  // ── Speed Boost Whoosh ──────────────────────────────────────────────────
  playBoost() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(3500, now + 0.15);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.35);
    filter.Q.value = 2;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    noise.connect(filter).connect(gain).connect(this.masterGain);
    noise.start(now);
    noise.stop(now + 0.4);
  }

  // ── Combo Arpeggio SFX ──────────────────────────────────────────────────
  playCombo(level) {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;
    const notes = [523, 659, 784, 1047, 1318];
    const count = Math.min(level, 5);

    for (let i = 0; i < count; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = notes[i];
      gain.gain.setValueAtTime(0.12, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.15);
      osc.connect(gain).connect(this.masterGain);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.2);
    }
  }

  // ── Level Up Fanfare SFX ───────────────────────────────────────────────
  playLevelUp() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.3);
      osc.connect(gain).connect(this.masterGain);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.35);
    });
  }

  // ── UI Click Tick ───────────────────────────────────────────────────────
  playClick() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 850;
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain).connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  destroy() {
    this.stopMusic();
    this.stopEngine();
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
    this._initialized = false;
  }
}

const soundManager = new SoundManager();
export default soundManager;

