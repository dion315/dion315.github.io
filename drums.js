// ─── Drum kits ────────────────────────────────────────────────────────────────
// Each kit defines synthesis parameters per voice type.

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
    kick:  { startFreq:100, endFreq:32,  pitchDec:0.15, decay:0.9 },  // deep sub
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
    kick:  { startFreq:260, endFreq:28, pitchDec:0.04, decay:0.28 }, // short, punchy
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
};

// ─── Synthesis-based drum voices (kit-parameterised) ──────────────────────────

class DrumVoice {
  constructor(ctx, type) {
    this.ctx  = ctx;
    this.type = type;
  }

  trigger(output, time, vel, kit) {
    const c = this.ctx;
    const p = kit[this.type] || {};
    switch (this.type) {
      case 'kick':  this._kick(c, output, time, vel, p);  break;
      case 'snare': this._snare(c, output, time, vel, p); break;
      case 'chh':   this._hat(c, output, time, vel, p);   break;
      case 'ohh':   this._hat(c, output, time, vel, p);   break;
      case 'clap':  this._clap(c, output, time, vel, p);  break;
      case 'htom':  this._tom(c, output, time, vel, p);   break;
      case 'ltom':  this._tom(c, output, time, vel, p);   break;
      case 'crash': this._crash(c, output, time, vel, p); break;
    }
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
  { id: 'kick',  label: 'KICK',  color: '#ff4444', defaultBeat: [0,4,8,12] },
  { id: 'snare', label: 'SNARE', color: '#ffaa00', defaultBeat: [4,12] },
  { id: 'chh',   label: 'C.HH',  color: '#44aaff', defaultBeat: [0,2,4,6,8,10,12,14] },
  { id: 'ohh',   label: 'O.HH',  color: '#66ccff', defaultBeat: [] },
  { id: 'clap',  label: 'CLAP',  color: '#ff44cc', defaultBeat: [4,12] },
  { id: 'htom',  label: 'HTOM',  color: '#88ff44', defaultBeat: [] },
  { id: 'ltom',  label: 'LTOM',  color: '#44ff88', defaultBeat: [] },
  { id: 'crash', label: 'CRASH', color: '#ffff44', defaultBeat: [] },
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
      const row = Array(16).fill(false);
      d.defaultBeat.forEach(i => { row[i] = true; });
      return row;
    });
    this.volumes   = DRUM_DEFS.map(() => 0.8);
    this.voices    = DRUM_DEFS.map(d => new DrumVoice(audioCtx, d.id));
    this.chanGains = DRUM_DEFS.map(() => {
      const g = audioCtx.createGain();
      g.connect(this.output);
      return g;
    });

    this.currentKitId  = 'default';
    this.currentKit    = DRUM_KITS.default;

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
        this.voices[i].trigger(this.chanGains[i], time, 1.0, this.currentKit);
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

    // Kit selector buttons
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
    for (let s = 0; s < 16; s++) {
      const n = document.createElement('div');
      n.className = 'drum-ruler-num' + (s % 4 === 0 ? ' group-start' : '');
      n.textContent = s % 4 === 0 ? s + 1 : '';
      rSteps.appendChild(n);
    }
    ruler.appendChild(rSteps);
    panel.appendChild(ruler);

    // ── Channel rows ──────────────────────────────────────────────────────────
    DRUM_DEFS.forEach((def, di) => {
      const rowBtns = Array(16);
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

      const stepsDiv = document.createElement('div');
      stepsDiv.className = 'drum-steps';
      for (let s = 0; s < 16; s++) {
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
