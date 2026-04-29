// ─── Drum kits ────────────────────────────────────────────────────────────────

const DRUM_KITS = {
  default: {
    name: 'DEFAULT',
    kick:  { startFreq:180, endFreq:38,  pitchDec:0.08, decay:0.55 },
    snare: { noiseHp:900,  noiseDec:0.25, noiseVol:0.7,  toneFreq:200, toneDec:0.09, toneVol:0.6 },
    chh:   { hp:7500, decay:0.06 },
    ohh:   { hp:7500, decay:0.40 },
    clap:  { bp:1100, bpQ:0.6, decay:0.18 },
    htom:  { baseFreq:220, decay:0.45 },
    ltom:  { baseFreq:100, decay:0.45 },
    crash: { hp:5000, decay:1.8 },
  },

  edm: {
    name: 'EDM 808',
    kick:  { startFreq:100, endFreq:32,  pitchDec:0.15, decay:0.9 },
    snare: { noiseHp:1500, noiseDec:0.14, noiseVol:0.5,  toneFreq:300, toneDec:0.05, toneVol:0.75 },
    chh:   { hp:10000, decay:0.03 },
    ohh:   { hp:9000,  decay:0.22 },
    clap:  { bp:1600,  bpQ:1.2, decay:0.10 },
    htom:  { baseFreq:350, decay:0.25 },
    ltom:  { baseFreq:145, decay:0.38 },
    crash: { hp:7000,  decay:2.5 },
  },

  industrial: {
    name: 'INDUSTRL',
    kick:  { startFreq:260, endFreq:28, pitchDec:0.04, decay:0.28 },
    snare: { noiseHp:380,  noiseDec:0.38, noiseVol:0.9,  toneFreq:115, toneDec:0.15, toneVol:0.35 },
    chh:   { hp:4800, decay:0.10 },
    ohh:   { hp:3800, decay:0.65 },
    clap:  { bp:700,  bpQ:0.28, decay:0.30 },
    htom:  { baseFreq:135, decay:0.60 },
    ltom:  { baseFreq:62,  decay:0.70 },
    crash: { hp:3000, decay:3.0 },
  },

  lofi: {
    name: 'LO-FI',
    kick:  { startFreq:155, endFreq:52, pitchDec:0.07, decay:0.42 },
    snare: { noiseHp:620,  noiseDec:0.22, noiseVol:0.65, toneFreq:170, toneDec:0.11, toneVol:0.55 },
    chh:   { hp:5800, decay:0.055 },
    ohh:   { hp:5200, decay:0.32 },
    clap:  { bp:880,  bpQ:0.38, decay:0.20 },
    htom:  { baseFreq:195, decay:0.42 },
    ltom:  { baseFreq:88,  decay:0.52 },
    crash: { hp:3800, decay:1.6 },
  },

  tr909: {
    name: 'TR-909',
    kick:  { startFreq:90,  endFreq:35,  pitchDec:0.12, decay:0.92 },
    snare: { noiseHp:1100, noiseDec:0.19, noiseVol:0.60, toneFreq:270, toneDec:0.06, toneVol:0.72 },
    chh:   { hp:9500, decay:0.022 },
    ohh:   { hp:9000, decay:0.26 },
    clap:  { bp:1450, bpQ:1.1,  decay:0.10 },
    htom:  { baseFreq:315, decay:0.26 },
    ltom:  { baseFreq:140, decay:0.38 },
    crash: { hp:6800, decay:2.4 },
  },

  tr606: {
    name: 'TR-606',
    kick:  { startFreq:115, endFreq:58,  pitchDec:0.035, decay:0.24 },
    snare: { noiseHp:2200, noiseDec:0.11, noiseVol:0.85, toneFreq:175, toneDec:0.03, toneVol:0.25 },
    chh:   { hp:11500, decay:0.022 },
    ohh:   { hp:10500, decay:0.14 },
    clap:  { bp:1900, bpQ:0.35, decay:0.07 },
    htom:  { baseFreq:420, decay:0.18 },
    ltom:  { baseFreq:200, decay:0.22 },
    crash: { hp:8200, decay:1.4 },
  },

  linndrum: {
    name: 'LINNDRUM',
    kick:  { startFreq:200, endFreq:62,  pitchDec:0.025, decay:0.32 },
    snare: { noiseHp:780,  noiseDec:0.14, noiseVol:0.48, toneFreq:295, toneDec:0.09, toneVol:0.85 },
    chh:   { hp:6200, decay:0.038 },
    ohh:   { hp:5700, decay:0.25 },
    clap:  { bp:960,  bpQ:0.45, decay:0.14 },
    htom:  { baseFreq:265, decay:0.32 },
    ltom:  { baseFreq:118, decay:0.42 },
    crash: { hp:4600, decay:1.85 },
  },

  rz1: {
    name: 'RZ-1',
    kick:  { startFreq:140, endFreq:48,  pitchDec:0.06, decay:0.36 },
    snare: { noiseHp:680,  noiseDec:0.21, noiseVol:0.72, toneFreq:178, toneDec:0.10, toneVol:0.48 },
    chh:   { hp:5400, decay:0.052 },
    ohh:   { hp:4900, decay:0.30 },
    clap:  { bp:820,  bpQ:0.32, decay:0.22 },
    htom:  { baseFreq:188, decay:0.41 },
    ltom:  { baseFreq:84,  decay:0.52 },
    crash: { hp:3600, decay:1.65 },
  },

  rx5: {
    name: 'RX5',
    kick:  { startFreq:160, endFreq:46,  pitchDec:0.07, decay:0.50 },
    snare: { noiseHp:980,  noiseDec:0.17, noiseVol:0.58, toneFreq:215, toneDec:0.07, toneVol:0.68 },
    chh:   { hp:8600, decay:0.042 },
    ohh:   { hp:8100, decay:0.33 },
    clap:  { bp:1200, bpQ:0.72, decay:0.13 },
    htom:  { baseFreq:245, decay:0.36 },
    ltom:  { baseFreq:108, decay:0.46 },
    crash: { hp:5600, decay:1.95 },
  },

  mpc60: {
    name: 'MPC60',
    kick:  { startFreq:130, endFreq:38,  pitchDec:0.10, decay:0.68 },
    snare: { noiseHp:1050, noiseDec:0.16, noiseVol:0.54, toneFreq:255, toneDec:0.06, toneVol:0.78 },
    chh:   { hp:8900, decay:0.032 },
    ohh:   { hp:8300, decay:0.30 },
    clap:  { bp:1280, bpQ:0.85, decay:0.12 },
    htom:  { baseFreq:328, decay:0.26 },
    ltom:  { baseFreq:148, decay:0.34 },
    crash: { hp:6100, decay:2.2 },
  },

  studio440: {
    name: 'STD 440',
    kick:  { startFreq:165, endFreq:44,  pitchDec:0.05, decay:0.42 },
    snare: { noiseHp:840,  noiseDec:0.22, noiseVol:0.68, toneFreq:192, toneDec:0.08, toneVol:0.58 },
    chh:   { hp:7100, decay:0.044 },
    ohh:   { hp:6600, decay:0.28 },
    clap:  { bp:1020, bpQ:0.50, decay:0.17 },
    htom:  { baseFreq:215, decay:0.40 },
    ltom:  { baseFreq:96,  decay:0.50 },
    crash: { hp:4300, decay:1.85 },
  },

  sp1200: {
    name: 'SP-1200',
    kick:  { startFreq:148, endFreq:37,  pitchDec:0.08, decay:0.52 },
    snare: { noiseHp:740,  noiseDec:0.24, noiseVol:0.78, toneFreq:183, toneDec:0.09, toneVol:0.52 },
    chh:   { hp:6300, decay:0.056 },
    ohh:   { hp:5900, decay:0.33 },
    clap:  { bp:890,  bpQ:0.40, decay:0.19 },
    htom:  { baseFreq:198, decay:0.44 },
    ltom:  { baseFreq:90,  decay:0.56 },
    crash: { hp:4000, decay:1.55 },
  },

  r8mk2: {
    name: 'R8 MK2',
    kick:  { startFreq:118, endFreq:34,  pitchDec:0.09, decay:0.58 },
    snare: { noiseHp:930,  noiseDec:0.19, noiseVol:0.58, toneFreq:235, toneDec:0.07, toneVol:0.72 },
    chh:   { hp:9600, decay:0.028 },
    ohh:   { hp:9100, decay:0.26 },
    clap:  { bp:1520, bpQ:1.05, decay:0.09 },
    htom:  { baseFreq:285, decay:0.30 },
    ltom:  { baseFreq:125, decay:0.40 },
    crash: { hp:7600, decay:2.05 },
  },
};

// ─── Synthesis-based drum voices ──────────────────────────────────────────────

class DrumVoice {
  constructor(ctx) {
    this.ctx = ctx;
  }

  trigger(output, time, vel, kit, type, tune, tone) {
    const c  = this.ctx;
    const tm = Math.pow(2, (tune || 0) / 12);
    const tn = tone !== undefined ? tone : 0.5;
    const p  = this._applyModifiers(kit[type] || {}, type, tm, tn);
    switch (type) {
      case 'kick':  this._kick(c, output, time, vel, p);  break;
      case 'snare': this._snare(c, output, time, vel, p); break;
      case 'chh':
      case 'ohh':   this._hat(c, output, time, vel, p);   break;
      case 'clap':  this._clap(c, output, time, vel, p);  break;
      case 'htom':
      case 'ltom':  this._tom(c, output, time, vel, p);   break;
      case 'crash': this._crash(c, output, time, vel, p); break;
    }
  }

  _applyModifiers(p, type, tm, tn) {
    const r = Object.assign({}, p);
    switch (type) {
      case 'kick':
        if (r.startFreq !== undefined) r.startFreq *= tm;
        if (r.endFreq   !== undefined) r.endFreq   *= tm;
        if (r.decay     !== undefined) r.decay     *= (0.4 + tn * 1.2);
        break;
      case 'snare':
        if (r.toneFreq !== undefined) r.toneFreq *= tm;
        if (r.noiseHp  !== undefined) r.noiseHp  *= tm;
        if (r.noiseVol !== undefined) r.noiseVol *= (1.1 - tn * 0.8);
        if (r.toneVol  !== undefined) r.toneVol  *= (0.2 + tn * 1.6);
        break;
      case 'chh': case 'ohh':
        if (r.hp    !== undefined) r.hp    *= tm;
        if (r.decay !== undefined) r.decay *= (0.15 + tn * 1.7);
        break;
      case 'clap':
        if (r.bp    !== undefined) r.bp    *= tm;
        if (r.bpQ   !== undefined) r.bpQ   *= (0.1 + tn * 4);
        if (r.decay !== undefined) r.decay *= (0.3 + tn * 1.4);
        break;
      case 'htom': case 'ltom':
        if (r.baseFreq !== undefined) r.baseFreq *= tm;
        if (r.decay    !== undefined) r.decay    *= (0.4 + tn * 1.2);
        break;
      case 'crash':
        if (r.hp    !== undefined) r.hp    *= tm;
        if (r.decay !== undefined) r.decay *= (0.4 + tn * 1.2);
        break;
    }
    return r;
  }

  _kick(c, out, t, vel, p) {
    const osc  = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(p.startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(p.endFreq, t + p.pitchDec);
    gain.gain.setValueAtTime(vel, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + p.decay);
    osc.connect(gain); gain.connect(out);
    osc.start(t); osc.stop(t + p.decay + 0.05);
  }

  _snare(c, out, t, vel, p) {
    const nLen = p.noiseDec + 0.04;
    const buf  = c.createBuffer(1, Math.ceil(c.sampleRate * nLen), c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    const noise = c.createBufferSource(); noise.buffer = buf;
    const hp    = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = p.noiseHp;
    const ng    = c.createGain();
    ng.gain.setValueAtTime(vel * p.noiseVol, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + p.noiseDec);
    noise.connect(hp); hp.connect(ng); ng.connect(out);
    noise.start(t); noise.stop(t + nLen);

    const osc = c.createOscillator(); osc.type = 'triangle'; osc.frequency.value = p.toneFreq;
    const og  = c.createGain();
    og.gain.setValueAtTime(vel * p.toneVol, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + p.toneDec);
    osc.connect(og); og.connect(out);
    osc.start(t); osc.stop(t + p.toneDec + 0.02);
  }

  _hat(c, out, t, vel, p) {
    const len  = p.decay + 0.02;
    const buf  = c.createBuffer(1, Math.ceil(c.sampleRate * len), c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = c.createBufferSource(); noise.buffer = buf;
    const hp    = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = p.hp;
    const gain  = c.createGain();
    gain.gain.setValueAtTime(vel * 0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + p.decay);
    noise.connect(hp); hp.connect(gain); gain.connect(out);
    noise.start(t); noise.stop(t + len);
  }

  _clap(c, out, t, vel, p) {
    for (let i = 0; i < 3; i++) {
      const offset = i * 0.011;
      const isLast = i === 2;
      const decay  = isLast ? p.decay : 0.035;
      const len    = decay + 0.02;
      const buf    = c.createBuffer(1, Math.ceil(c.sampleRate * len), c.sampleRate);
      const data   = buf.getChannelData(0);
      for (let j = 0; j < data.length; j++) data[j] = Math.random() * 2 - 1;
      const noise = c.createBufferSource(); noise.buffer = buf;
      const bp    = c.createBiquadFilter();
      bp.type = 'bandpass'; bp.frequency.value = p.bp; bp.Q.value = p.bpQ;
      const gain  = c.createGain();
      gain.gain.setValueAtTime(vel * (isLast ? 0.8 : 0.35), t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + decay);
      noise.connect(bp); bp.connect(gain); gain.connect(out);
      noise.start(t + offset); noise.stop(t + offset + len);
    }
  }

  _tom(c, out, t, vel, p) {
    const osc  = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(p.baseFreq * 2.2, t);
    osc.frequency.exponentialRampToValueAtTime(p.baseFreq, t + 0.1);
    gain.gain.setValueAtTime(vel, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + p.decay);
    osc.connect(gain); gain.connect(out);
    osc.start(t); osc.stop(t + p.decay + 0.05);
  }

  _crash(c, out, t, vel, p) {
    const len  = p.decay + 0.05;
    const buf  = c.createBuffer(1, Math.ceil(c.sampleRate * len), c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = c.createBufferSource(); noise.buffer = buf;
    const hp    = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = p.hp;
    const gain  = c.createGain();
    gain.gain.setValueAtTime(vel * 0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + p.decay);
    noise.connect(hp); hp.connect(gain); gain.connect(out);
    noise.start(t); noise.stop(t + len);
  }
}

// ─── Drum channel definitions ─────────────────────────────────────────────────

const DRUM_DEFS = [
  { id: 'kick',  label: 'KICK',  color: '#ff4444',
    defaultBeat: [0,4,8,12,16,20,24,28] },
  { id: 'snare', label: 'SNARE', color: '#ffaa00',
    defaultBeat: [4,12,20,28] },
  { id: 'chh',   label: 'C.HH',  color: '#44aaff',
    defaultBeat: [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30] },
  { id: 'ohh',   label: 'O.HH',  color: '#66ccff',
    defaultBeat: [] },
  { id: 'clap',  label: 'CLAP',  color: '#ff44cc',
    defaultBeat: [4,12,20,28] },
  { id: 'htom',  label: 'HTOM',  color: '#88ff44',
    defaultBeat: [] },
  { id: 'ltom',  label: 'LTOM',  color: '#44ff88',
    defaultBeat: [] },
  { id: 'crash', label: 'CRASH', color: '#ffff44',
    defaultBeat: [] },
];

// ─── DrumMachine ──────────────────────────────────────────────────────────────

class DrumMachine {
  constructor(audioCtx, masterNode) {
    this.ctx = audioCtx;

    this.output = audioCtx.createGain();
    this.output.gain.value = 1.0;
    this.output.connect(masterNode);

    this.analyser = audioCtx.createAnalyser();
    this.analyser.fftSize = 256;
    this.output.connect(this.analyser);

    this.patterns  = DRUM_DEFS.map(d => {
      const row = Array(32).fill(false);
      d.defaultBeat.forEach(i => { row[i] = true; });
      return row;
    });
    this.volumes   = DRUM_DEFS.map(() => 0.8);
    this.chanTypes  = DRUM_DEFS.map(d => d.id);
    this.chanTunes  = DRUM_DEFS.map(() => 0);
    this.chanTones  = DRUM_DEFS.map(() => 0.5);
    this.chanNudges = DRUM_DEFS.map(() => 0);
    this.voices    = DRUM_DEFS.map(() => new DrumVoice(audioCtx));
    this.chanGains = DRUM_DEFS.map(() => {
      const g = audioCtx.createGain();
      g.connect(this.output);
      return g;
    });

    this.currentKitId = 'default';
    this.currentKit   = DRUM_KITS.default;

    this._stepBtns  = [];
    this._kitBtns   = {};
    this._lastStep  = -1;
    this._meterData = new Uint8Array(this.analyser.frequencyBinCount);
  }

  // ── Playback ─────────────────────────────────────────────────────────────────

  step(stepIndex, time) {
    DRUM_DEFS.forEach((_, i) => {
      if (this.patterns[i][stepIndex]) {
        this.chanGains[i].gain.value = this.volumes[i];
        const noteTime = Math.max(
          this.ctx.currentTime + 0.001,
          time + (this.chanNudges[i] || 0) / 1000
        );
        this.voices[i].trigger(
          this.chanGains[i], noteTime, 1.0, this.currentKit,
          this.chanTypes[i], this.chanTunes[i], this.chanTones[i]
        );
      }
    });
  }

  setKit(kitId) {
    this.currentKitId = kitId;
    this.currentKit   = DRUM_KITS[kitId];
    Object.entries(this._kitBtns).forEach(([id, btn]) =>
      btn.classList.toggle('active', id === kitId)
    );
  }

  // ── Playhead ─────────────────────────────────────────────────────────────────

  drawPlayhead(playing) {
    if (!playing) {
      if (this._lastStep !== -1) { this._clearPlayhead(this._lastStep); this._lastStep = -1; }
      return;
    }
    if (step !== this._lastStep) {
      if (this._lastStep !== -1) this._clearPlayhead(this._lastStep);
      this._setPlayhead(step);
      this._lastStep = step;
    }
  }

  _setPlayhead(s)   { this._stepBtns.forEach(row => row[s]?.classList.add('playing')); }
  _clearPlayhead(s) { this._stepBtns.forEach(row => row[s]?.classList.remove('playing')); }

  // ── Level meter ──────────────────────────────────────────────────────────────

  drawMeter() {
    if (!this._meterCanvas) return;
    this.analyser.getByteTimeDomainData(this._meterData);
    let sum = 0;
    for (let i = 0; i < this._meterData.length; i++) {
      const v = (this._meterData[i] - 128) / 128;
      sum += v * v;
    }
    const rms  = Math.min(1, Math.sqrt(sum / this._meterData.length) * 4);
    const c    = this._meterCanvas.getContext('2d');
    const W    = this._meterCanvas.width, H = this._meterCanvas.height;
    c.clearRect(0, 0, W, H);
    c.fillStyle = '#111'; c.fillRect(0, 0, W, H);
    const barW = Math.floor(rms * W);
    const grad = c.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, '#00cc44'); grad.addColorStop(0.7, '#cccc00');
    grad.addColorStop(0.9, '#ff6600'); grad.addColorStop(1, '#ff2200');
    c.fillStyle = grad; c.fillRect(0, 0, barW, H);
  }

  // ── DOM render ───────────────────────────────────────────────────────────────

  render() {
    this._stepBtns = [];

    const panel = document.createElement('div');
    panel.className = 'drum-machine';

    // ── Header ────────────────────────────────────────────────────────────────
    const hdr = document.createElement('div');
    hdr.className = 'drum-header';

    const titleEl = document.createElement('span');
    titleEl.className = 'drum-title-text';
    titleEl.textContent = 'DRUM MACHINE';
    hdr.appendChild(titleEl);

    const kitBtns = document.createElement('div');
    kitBtns.className = 'kit-btns';
    Object.entries(DRUM_KITS).forEach(([id, kit]) => {
      const b = document.createElement('button');
      b.className = 'kit-btn' + (id === this.currentKitId ? ' active' : '');
      b.textContent = kit.name;
      b.onclick = () => this.setKit(id);
      kitBtns.appendChild(b);
      this._kitBtns[id] = b;
    });
    hdr.appendChild(kitBtns);

    const meterCanvas = document.createElement('canvas');
    meterCanvas.className = 'drum-master-meter';
    meterCanvas.width = 100; meterCanvas.height = 10;
    this._meterCanvas = meterCanvas;
    hdr.appendChild(meterCanvas);

    panel.appendChild(hdr);

    // ── Ruler ────────────────────────────────────────────────────────────────
    const ruler   = document.createElement('div');
    ruler.className = 'drum-ruler';
    const rSpacer = document.createElement('div');
    rSpacer.className = 'drum-row-spacer';
    ruler.appendChild(rSpacer);
    const rSteps  = document.createElement('div');
    rSteps.className = 'drum-steps';
    for (let s = 0; s < 32; s++) {
      const n = document.createElement('div');
      n.className = 'drum-ruler-num' + (s % 4 === 0 ? ' group-start' : '');
      n.textContent = s % 4 === 0 ? s + 1 : '';
      rSteps.appendChild(n);
    }
    ruler.appendChild(rSteps);
    panel.appendChild(ruler);

    // ── Channel rows ──────────────────────────────────────────────────────────
    DRUM_DEFS.forEach((def, di) => {
      const rowBtns = Array(32);
      this._stepBtns.push(rowBtns);

      const row = document.createElement('div');
      row.className = 'drum-row';

      const lbl = document.createElement('div');
      lbl.className = 'drum-ch-label';
      lbl.textContent = def.label;
      lbl.style.color = def.color;
      row.appendChild(lbl);

      const volKnob = new Knob({
        label: '', min: 0, max: 1, step: 0.01, value: this.volumes[di],
        color: def.color, size: 28,
        onChange: v => { this.volumes[di] = v; }
      });
      volKnob.el.classList.add('drum-vol-knob');
      row.appendChild(volKnob.el);

      // Voice type selector
      const typeSelect = document.createElement('select');
      typeSelect.className = 'drum-type-select';
      DRUM_DEFS.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = d.label;
        if (d.id === this.chanTypes[di]) opt.selected = true;
        typeSelect.appendChild(opt);
      });
      typeSelect.addEventListener('change', () => {
        const newType = typeSelect.value;
        this.chanTypes[di] = newType;
        const newDef = DRUM_DEFS.find(d => d.id === newType);
        lbl.textContent = newDef.label;
        lbl.style.color  = newDef.color;
        rowBtns.forEach(btn => btn && btn.style.setProperty('--col', newDef.color));
      });
      row.appendChild(typeSelect);

      // Tune knob (±12 semitones)
      const tuneK = new Knob({
        label: 'TUNE', min: -12, max: 12, step: 1, value: this.chanTunes[di],
        color: '#aaaaaa', size: 28,
        fmt: v => (v > 0 ? '+' : '') + Math.round(v),
        onChange: v => { this.chanTunes[di] = Math.round(v); }
      });
      tuneK.el.classList.add('drum-tune-knob');
      row.appendChild(tuneK.el);

      // Tone knob (timbre)
      const toneK = new Knob({
        label: 'TONE', min: 0, max: 1, step: 0.01, value: this.chanTones[di],
        color: '#cc8800', size: 28,
        onChange: v => { this.chanTones[di] = v; }
      });
      toneK.el.classList.add('drum-tone-knob');
      row.appendChild(toneK.el);

      // Nudge knob (timing offset ±50 ms)
      const nudgeK = new Knob({
        label: 'NUDGE', min: -50, max: 50, step: 1, value: this.chanNudges[di],
        color: '#44aaff', size: 28,
        fmt: v => (v > 0 ? '+' : '') + Math.round(v),
        onChange: v => { this.chanNudges[di] = Math.round(v); }
      });
      nudgeK.el.classList.add('drum-nudge-knob');
      row.appendChild(nudgeK.el);

      // 32 step buttons
      const stepsDiv = document.createElement('div');
      stepsDiv.className = 'drum-steps';
      for (let s = 0; s < 32; s++) {
        const btn = document.createElement('button');
        btn.className = 'drum-step' + (this.patterns[di][s] ? ' active' : '');
        btn.style.setProperty('--col', def.color);
        if (s % 4 === 0) btn.classList.add('group-start');
        btn.addEventListener('click', () => {
          this.patterns[di][s] = !this.patterns[di][s];
          btn.classList.toggle('active', this.patterns[di][s]);
        });
        stepsDiv.appendChild(btn);
        rowBtns[s] = btn;
      }
      row.appendChild(stepsDiv);
      panel.appendChild(row);
    });

    return panel;
  }
}
