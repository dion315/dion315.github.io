// ─── Constants ────────────────────────────────────────────────────────────────
const CELL_W     = 16;
const CELL_H     = 13;
const LABEL_W    = 28;
const CANVAS_W   = LABEL_W + 16 * CELL_W;   // 284
const CANVAS_H   = 12 * CELL_H;             // 156
const NOTE_NAMES = ['B','A#','A','G#','G','F#','F','E','D#','D','C#','C'];
const WAVE_TYPES = ['sawtooth','square','sine','triangle'];
const WAVE_LBLS  = ['SAW','SQR','SIN','TRI'];
const TRACK_COLORS = ['#00e5ff','#7c4dff','#ff6b35','#00e676','#ff4081','#ffd740'];

// ─── State ────────────────────────────────────────────────────────────────────
const rack    = document.getElementById('rack');
const drumSec = document.getElementById('drum-section');
let   tracks  = [];
let   drawFns = [];
let   drumMachine;

// ─── Track factory ────────────────────────────────────────────────────────────
// Signal chain: track.output → [effects chain] → muteGain → analyser → master
function createTrack(idx) {
  const effectsIn = ctx.createGain();
  const muteGain  = ctx.createGain();
  const analyser  = ctx.createAnalyser();
  analyser.fftSize = 256;

  muteGain.connect(analyser);
  analyser.connect(master);

  // EffectsChain wires effectsIn → muteGain as bypass and manages inserts
  const chain = new EffectsChain(ctx, effectsIn, muteGain);

  return {
    grid:      createGrid(),
    volume:    0.7,
    pan:       0,
    cutoff:    4000,
    resonance: 1,
    attack:    0.01,
    decay:     0.2,
    sustain:   0.6,
    release:   0.3,
    pitch:     0,
    octave:    4,
    nudge:     0,
    waveType:  'sawtooth',
    color:    TRACK_COLORS[idx % TRACK_COLORS.length],
    output:   effectsIn,  // voice.js connects here
    muteGain,
    analyser,
    chain,
    muted:    false,
    _meterData: new Uint8Array(128),
    _peak: 0, _peakHold: 0,
  };
}

function createGrid() {
  return Array(12).fill().map(() =>
    Array(16).fill().map(() => ({ on: false, len: 1, vel: 0.8 }))
  );
}

// ─── Track management ─────────────────────────────────────────────────────────
function addTrack() {
  tracks.push(createTrack(tracks.length));
  render();
}

function removeTrack(i) {
  const t = tracks[i];
  t.chain.dispose();
  t.muteGain.disconnect();
  t.analyser.disconnect();
  tracks.splice(i, 1);
  render();
}

// ─── Render ───────────────────────────────────────────────────────────────────
function render() {
  rack.innerHTML = '';
  drawFns = [];
  tracks.forEach((t, i) => rack.appendChild(buildModule(t, i)));
}

// ─── Build a synth track module ───────────────────────────────────────────────
function buildModule(t, i) {
  const el = document.createElement('div');
  el.className = 'module';
  el.style.setProperty('--accent', t.color);

  // ── Header ──────────────────────────────────────────────────────────────────
  const hdr = document.createElement('div');
  hdr.className = 'mod-header';

  const nameEl = document.createElement('span');
  nameEl.className = 'mod-name';
  nameEl.textContent = `TRACK ${i + 1}`;
  hdr.appendChild(nameEl);

  // Wave selector
  const waveBtns = document.createElement('div');
  waveBtns.className = 'wave-btns';
  WAVE_TYPES.forEach((wt, wi) => {
    const b = document.createElement('button');
    b.className = 'wave-btn' + (t.waveType === wt ? ' active' : '');
    b.textContent = WAVE_LBLS[wi];
    b.onclick = () => {
      t.waveType = wt;
      waveBtns.querySelectorAll('.wave-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
    };
    waveBtns.appendChild(b);
  });
  hdr.appendChild(waveBtns);

  // Mute button
  const muteBtn = document.createElement('button');
  muteBtn.className = 'wave-btn mod-mute';
  muteBtn.textContent = 'MUTE';
  muteBtn.onclick = () => {
    t.muted = !t.muted;
    t.muteGain.gain.value = t.muted ? 0 : 1;
    muteBtn.classList.toggle('muted', t.muted);
  };
  hdr.appendChild(muteBtn);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'mod-close';
  closeBtn.textContent = '✕';
  closeBtn.onclick = () => removeTrack(i);
  hdr.appendChild(closeBtn);

  el.appendChild(hdr);

  // ── Body ────────────────────────────────────────────────────────────────────
  const body = document.createElement('div');
  body.className = 'mod-body';

  // Row 1: VOL / PAN / CUTOFF + VU meter
  const row1 = document.createElement('div');
  row1.className = 'knob-row';

  const volK = new Knob({ label:'VOL',    min:0,   max:1,    step:0.01, value:t.volume,    color:t.color,   size:48,
    onChange: v => { t.volume = v; } });
  const panK = new Knob({ label:'PAN',    min:-1,  max:1,    step:0.01, value:t.pan,       color:'#aaaaaa', size:48,
    onChange: v => { t.pan = v; } });
  const cutK = new Knob({ label:'CUTOFF', min:200, max:8000, step:10,   value:t.cutoff,    color:'#ff9500', size:48,
    onChange: v => { t.cutoff = v; } });
  const resK = new Knob({ label:'RES',    min:0.1, max:20,   step:0.1,  value:t.resonance, color:'#ff6600', size:48,
    onChange: v => { t.resonance = v; } });

  [volK, panK, cutK, resK].forEach(k => row1.appendChild(k.el));

  const meterCanvas = document.createElement('canvas');
  meterCanvas.width = 10; meterCanvas.height = 72;
  meterCanvas.className = 'vu-meter';
  t._meterCanvas = meterCanvas;
  row1.appendChild(meterCanvas);
  body.appendChild(row1);

  // Envelope section
  const envLbl = document.createElement('div');
  envLbl.className = 'section-lbl';
  envLbl.textContent = '— ENVELOPE —';
  body.appendChild(envLbl);

  const row2 = document.createElement('div');
  row2.className = 'knob-row';
  const atkK = new Knob({ label:'ATK', min:0.001,max:2,  step:0.001, value:t.attack,  color:'#88ff44', size:40, onChange: v=>{t.attack=v;} });
  const decK = new Knob({ label:'DEC', min:0.001,max:2,  step:0.001, value:t.decay,   color:'#ffcc00', size:40, onChange: v=>{t.decay=v;} });
  const susK = new Knob({ label:'SUS', min:0,    max:1,  step:0.01,  value:t.sustain, color:'#ff9900', size:40, onChange: v=>{t.sustain=v;} });
  const relK = new Knob({ label:'REL', min:0.01, max:4,  step:0.01,  value:t.release, color:'#ff5500', size:40, onChange: v=>{t.release=v;} });
  [atkK, decK, susK, relK].forEach(k => row2.appendChild(k.el));
  body.appendChild(row2);

  // Pitch / Octave section
  const pitchLbl = document.createElement('div');
  pitchLbl.className = 'section-lbl';
  pitchLbl.textContent = '— PITCH / OCT —';
  body.appendChild(pitchLbl);

  const pitchOctRow = document.createElement('div');
  pitchOctRow.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:4px;';

  const pitchK = new Knob({ label:'PITCH', min:-12, max:12, step:1, value:t.pitch,
    color:'#cc44ff', size:38,
    fmt: v => (v > 0 ? '+' : '') + Math.round(v),
    onChange: v => { t.pitch = Math.round(v); }
  });
  pitchK.el.style.flex = '0 0 auto';
  pitchOctRow.appendChild(pitchK.el);

  const nudgeK = new Knob({ label:'NUDGE', min:-50, max:50, step:1, value:t.nudge,
    color:'#44aaff', size:38,
    fmt: v => (v > 0 ? '+' : '') + Math.round(v) + 'ms',
    onChange: v => { t.nudge = Math.round(v); }
  });
  nudgeK.el.style.flex = '0 0 auto';
  pitchOctRow.appendChild(nudgeK.el);

  const octBtns = document.createElement('div');
  octBtns.className = 'oct-btns';
  for (let o = 1; o <= 7; o++) {
    const b = document.createElement('button');
    b.className = 'oct-btn' + (t.octave === o ? ' active' : '');
    b.textContent = o;
    b.onclick = () => {
      t.octave = o;
      octBtns.querySelectorAll('.oct-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
    };
    octBtns.appendChild(b);
  }
  pitchOctRow.appendChild(octBtns);
  body.appendChild(pitchOctRow);

  // Sequencer section
  const seqLbl = document.createElement('div');
  seqLbl.className = 'section-lbl';
  seqLbl.textContent = '— SEQUENCER —';
  body.appendChild(seqLbl);

  const { canvas, draw } = renderGrid(t);
  drawFns.push({ draw, t });
  body.appendChild(canvas);

  // ── Effects section (collapsible) ───────────────────────────────────────────
  const fxToggle = document.createElement('div');
  fxToggle.className = 'section-lbl fx-toggle';
  fxToggle.textContent = '— EFFECTS ▸ —';

  const fxPanel = document.createElement('div');
  fxPanel.className = 'fx-panel';

  // Effect type add-buttons
  const fxAdder = document.createElement('div');
  fxAdder.className = 'fx-adder';

  const fxRows = document.createElement('div');
  fxRows.className = 'fx-rows';

  EFFECT_DEFS.forEach(({ id, label }) => {
    const b = document.createElement('button');
    b.className = 'fx-add-btn';
    b.textContent = label;
    b.onclick = () => {
      const effect = EFFECT_DEFS.find(d => d.id === id).factory(ctx);
      t.chain.add(effect);
      fxRows.appendChild(buildFxRow(t, effect, fxRows));
    };
    fxAdder.appendChild(b);
  });

  fxPanel.appendChild(fxAdder);
  fxPanel.appendChild(fxRows);

  fxToggle.onclick = () => {
    const open = fxPanel.classList.toggle('open');
    fxToggle.textContent = open ? '— EFFECTS ▾ —' : '— EFFECTS ▸ —';
  };

  body.appendChild(fxToggle);
  body.appendChild(fxPanel);
  el.appendChild(body);
  return el;
}

// ─── Build an effect row inside the FX panel ─────────────────────────────────
function buildFxRow(track, effect, container) {
  const row = document.createElement('div');
  row.className = 'fx-row';

  const lbl = document.createElement('div');
  lbl.className = 'fx-name';
  lbl.textContent = effect.label;
  row.appendChild(lbl);

  const knobWrap = document.createElement('div');
  knobWrap.className = 'fx-knobs';
  Object.values(effect.params).forEach(p => {
    const k = new Knob({
      label: p.label, min: p.min, max: p.max, step: p.step, value: p.value,
      color: '#888888', size: 34,
      onChange: v => {
        if (p.node)    p.node.value = v;
        else if (p.set) p.set(v);
      }
    });
    knobWrap.appendChild(k.el);
  });
  row.appendChild(knobWrap);

  const rmBtn = document.createElement('button');
  rmBtn.className = 'fx-remove';
  rmBtn.textContent = '×';
  rmBtn.onclick = () => {
    const idx = [...container.querySelectorAll('.fx-row')].indexOf(row);
    if (idx >= 0) { track.chain.remove(idx); row.remove(); }
  };
  row.appendChild(rmBtn);
  return row;
}

// ─── Step sequencer grid ─────────────────────────────────────────────────────
function renderGrid(track) {
  const c = document.createElement('canvas');
  c.width  = CANVAS_W; c.height = CANVAS_H;
  c.className = 'seq-canvas';
  const g = c.getContext('2d');

  function draw() {
    g.clearRect(0, 0, CANVAS_W, CANVAS_H);

    const cs      = getComputedStyle(document.documentElement);
    const lblCol  = cs.getPropertyValue('--grid-lbl').trim()     || '#666666';
    const offCol  = cs.getPropertyValue('--grid-off').trim()     || '#141414';
    const offActC = cs.getPropertyValue('--grid-off-act').trim() || '#1e2a2a';

    g.fillStyle = lblCol; g.font = '9px monospace'; g.textAlign = 'right';
    NOTE_NAMES.forEach((name, r) => g.fillText(name, LABEL_W - 3, r * CELL_H + CELL_H - 2));

    track.grid.forEach((row, r) => {
      row.forEach((cell, cx) => {
        const active = isPlaying && cx === (step % 16);
        const x = LABEL_W + cx * CELL_W, y = r * CELL_H;
        if (cell.on) {
          g.fillStyle   = active ? '#ffffff' : track.color;
          g.shadowColor = active ? '#ffffff' : track.color;
          g.shadowBlur  = active ? 8 : 4;
        } else {
          g.fillStyle  = active ? offActC : offCol;
          g.shadowBlur = 0;
        }
        g.fillRect(x + 1, y + 1, CELL_W - 3, CELL_H - 3);
        g.shadowBlur = 0;
      });
    });

    if (isPlaying) {
      g.strokeStyle = 'rgba(255,255,255,0.12)';
      g.lineWidth   = 1;
      g.strokeRect(LABEL_W + (step % 16) * CELL_W + 0.5, 0.5, CELL_W - 1, CANVAS_H - 1);
    }
  }

  c.addEventListener('click', e => {
    const cx = Math.floor((e.offsetX - LABEL_W) / CELL_W);
    const r  = Math.floor(e.offsetY / CELL_H);
    if (r >= 0 && r < 12 && cx >= 0 && cx < 16) {
      track.grid[r][cx].on = !track.grid[r][cx].on;
      draw();
    }
  });

  draw();
  return { canvas: c, draw };
}

// ─── VU meter ─────────────────────────────────────────────────────────────────
function drawVU(t) {
  if (!t._meterCanvas) return;
  t.analyser.getByteTimeDomainData(t._meterData);
  let sum = 0;
  for (let i = 0; i < t._meterData.length; i++) {
    const v = (t._meterData[i] - 128) / 128;
    sum += v * v;
  }
  const rms = Math.min(1, Math.sqrt(sum / t._meterData.length) * 5);
  if (rms > t._peak) { t._peak = rms; t._peakHold = 50; }
  else if (t._peakHold > 0) t._peakHold--;
  else t._peak *= 0.93;

  const canvas = t._meterCanvas, W = canvas.width, H = canvas.height;
  const g = canvas.getContext('2d');
  const SEGS = 18, segH = Math.floor((H - (SEGS - 1)) / SEGS);
  g.clearRect(0, 0, W, H);

  const cs  = getComputedStyle(document.documentElement);
  const rOff = cs.getPropertyValue('--vu-r').trim() || '#200000';
  const yOff = cs.getPropertyValue('--vu-y').trim() || '#1a1000';
  const gOff = cs.getPropertyValue('--vu-g').trim() || '#001a08';

  for (let s = 0; s < SEGS; s++) {
    const pct = (SEGS - s - 1) / SEGS, y = s * (segH + 1), on = rms > pct;
    if      (pct > 0.88) g.fillStyle = on ? '#ff2200' : rOff;
    else if (pct > 0.65) g.fillStyle = on ? '#ffaa00' : yOff;
    else                 g.fillStyle = on ? '#00cc44' : gOff;
    g.fillRect(0, y, W, segH);
  }
  if (t._peak > 0.02) {
    const py = Math.floor((1 - t._peak) * SEGS) * (segH + 1);
    g.fillStyle = t._peak > 0.88 ? '#ff2200' : '#ffffff';
    g.fillRect(0, py, W, 2);
  }
}

// ─── Animation loop ───────────────────────────────────────────────────────────
function animLoop() {
  drawFns.forEach(({ draw, t }) => { draw(); drawVU(t); });
  if (drumMachine) { drumMachine.drawPlayhead(isPlaying); drumMachine.drawMeter(); }
  requestAnimationFrame(animLoop);
}

// ─── Theme toggle ─────────────────────────────────────────────────────────────
function toggleTheme() {
  const isLight = document.documentElement.classList.toggle('light-mode');
  const btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = isLight ? '◑ LIGHT' : '◐ DARK';
  localStorage.setItem('opensynth-theme', isLight ? 'light' : 'dark');
  Knob.redrawAll();
}

// ─── Init ─────────────────────────────────────────────────────────────────────
const masterKnob = new Knob({
  label: '', min: 0, max: 1, step: 0.01, value: 0.8,
  color: '#ffffff', size: 36,
  onChange: v => { master.gain.value = v; }
});
document.getElementById('master-vol-knob').appendChild(masterKnob.el);

drumMachine = new DrumMachine(ctx, master);
drumSec.appendChild(drumMachine.render());

addTrack();
animLoop();

// Sync theme button label with saved preference
(function() {
  const saved = localStorage.getItem('opensynth-theme');
  const btn = document.getElementById('theme-btn');
  if (btn && saved === 'light') btn.textContent = '◑ LIGHT';
})();
