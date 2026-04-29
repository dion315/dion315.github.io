// ─── Effects Chain ────────────────────────────────────────────────────────────
// Manages a series of audio effects inserted between source and dest nodes.
// Each effect is { label, input, output, params, dispose? }.

class EffectsChain {
  constructor(ctx, source, dest) {
    this.ctx    = ctx;
    this.source = source;
    this.dest   = dest;
    this.chain  = [];
    source.connect(dest); // bypass by default
  }

  add(effect) {
    const prevOut = this.chain.length
      ? this.chain[this.chain.length - 1].output
      : this.source;
    prevOut.disconnect(this.dest);
    prevOut.connect(effect.input);
    effect.output.connect(this.dest);
    this.chain.push(effect);
  }

  remove(idx) {
    const e       = this.chain[idx];
    const prevOut = idx === 0 ? this.source : this.chain[idx - 1].output;
    const nextIn  = idx === this.chain.length - 1 ? this.dest : this.chain[idx + 1].input;
    prevOut.disconnect(e.input);
    e.output.disconnect(nextIn);
    prevOut.connect(nextIn);
    if (e.dispose) e.dispose();
    this.chain.splice(idx, 1);
  }

  dispose() {
    // Remove all effects and restore the bypass connection
    while (this.chain.length) this.remove(0);
  }
}

// ─── Effect factories ─────────────────────────────────────────────────────────
// Each returns: { label, input, output, params }
// params: { key: { label, node?, set?, min, max, step, value } }
//   node  → AudioParam  (set via .value)
//   set   → custom fn   (called with new value)

function createReverb(ctx) {
  const input = ctx.createGain();
  const output = ctx.createGain();
  const conv = ctx.createConvolver();
  const wet = ctx.createGain();
  const dry = ctx.createGain();

  function buildIR(decaySecs) {
    const sr  = ctx.sampleRate;
    const len = Math.floor(sr * decaySecs);
    const buf = ctx.createBuffer(2, len, sr);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++)
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
    }
    return buf;
  }

  let decaySecs = 2;
  conv.buffer   = buildIR(decaySecs);
  wet.gain.value = 0.35;
  dry.gain.value = 1.0;

  input.connect(dry); input.connect(conv);
  conv.connect(wet);
  dry.connect(output); wet.connect(output);

  return {
    label: 'REVERB', input, output,
    params: {
      size: {
        label: 'SIZE', min: 0.3, max: 6, step: 0.1, value: decaySecs,
        set: v => { decaySecs = v; conv.buffer = buildIR(v); }
      },
      wet:  { label: 'WET', node: wet.gain, min: 0, max: 1, step: 0.01, value: 0.35 },
      dry:  { label: 'DRY', node: dry.gain, min: 0, max: 1, step: 0.01, value: 1.0 },
    }
  };
}

function createDelay(ctx) {
  const input    = ctx.createGain();
  const output   = ctx.createGain();
  const delay    = ctx.createDelay(2.0);
  const feedback = ctx.createGain();
  const wet      = ctx.createGain();
  const dry      = ctx.createGain();

  delay.delayTime.value = 0.25;
  feedback.gain.value   = 0.35;
  wet.gain.value        = 0.4;
  dry.gain.value        = 1.0;

  input.connect(dry); input.connect(delay);
  delay.connect(feedback); delay.connect(wet);
  feedback.connect(delay);
  dry.connect(output); wet.connect(output);

  return {
    label: 'DELAY', input, output,
    params: {
      time:     { label: 'TIME', node: delay.delayTime, min: 0.01, max: 1.5,  step: 0.01, value: 0.25 },
      feedback: { label: 'FDBK', node: feedback.gain,   min: 0,    max: 0.95, step: 0.01, value: 0.35 },
      wet:      { label: 'WET',  node: wet.gain,        min: 0,    max: 1,    step: 0.01, value: 0.4  },
    }
  };
}

function createDistortion(ctx) {
  const input  = ctx.createGain();
  const output = ctx.createGain();
  const shaper = ctx.createWaveShaper();
  const wet    = ctx.createGain();
  const dry    = ctx.createGain();

  shaper.oversample = '4x';

  function makeCurve(amount) {
    const n    = 256;
    const curve = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x   = (i * 2) / n - 1;
      curve[i]  = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }

  let drive = 150;
  shaper.curve   = makeCurve(drive);
  wet.gain.value = 0.6;
  dry.gain.value = 0.4;

  input.connect(dry); input.connect(shaper);
  shaper.connect(wet);
  dry.connect(output); wet.connect(output);

  return {
    label: 'DIST', input, output,
    params: {
      drive: { label: 'DRIVE', min: 1, max: 400, step: 1, value: drive,
               set: v => { drive = v; shaper.curve = makeCurve(v); } },
      wet:   { label: 'WET',   node: wet.gain, min: 0, max: 1, step: 0.01, value: 0.6 },
    }
  };
}

function createWah(ctx) {
  const input   = ctx.createGain();
  const output  = ctx.createGain();
  const filter  = ctx.createBiquadFilter();
  const lfo     = ctx.createOscillator();
  const lfoGain = ctx.createGain();

  filter.type            = 'bandpass';
  filter.frequency.value = 1000;
  filter.Q.value         = 6;
  lfo.type               = 'sine';
  lfo.frequency.value    = 2;
  lfoGain.gain.value     = 700;

  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  input.connect(filter); filter.connect(output);

  return {
    label: 'WAH', input, output,
    dispose: () => { try { lfo.stop(); } catch (e) {} },
    params: {
      rate:  { label: 'RATE',  node: lfo.frequency,    min: 0.1, max: 12,   step: 0.1, value: 2    },
      depth: { label: 'DEPTH', node: lfoGain.gain,     min: 50,  max: 1500, step: 10,  value: 700  },
      freq:  { label: 'FREQ',  node: filter.frequency, min: 200, max: 3000, step: 10,  value: 1000 },
    }
  };
}

function createChorus(ctx) {
  const input   = ctx.createGain();
  const output  = ctx.createGain();
  const delay   = ctx.createDelay(0.05);
  const lfo     = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  const wet     = ctx.createGain();
  const dry     = ctx.createGain();

  delay.delayTime.value = 0.02;
  lfo.type              = 'sine';
  lfo.frequency.value   = 1.5;
  lfoGain.gain.value    = 0.005;
  wet.gain.value        = 0.5;
  dry.gain.value        = 1.0;

  lfo.connect(lfoGain);
  lfoGain.connect(delay.delayTime);
  lfo.start();

  input.connect(dry); input.connect(delay);
  delay.connect(wet);
  dry.connect(output); wet.connect(output);

  return {
    label: 'CHORUS', input, output,
    dispose: () => { try { lfo.stop(); } catch (e) {} },
    params: {
      rate:  { label: 'RATE',  node: lfo.frequency, min: 0.1,  max: 8,    step: 0.1,   value: 1.5   },
      depth: { label: 'DEPTH', node: lfoGain.gain,  min: 0.001,max: 0.02, step: 0.001, value: 0.005 },
      wet:   { label: 'WET',   node: wet.gain,      min: 0,    max: 1,    step: 0.01,  value: 0.5   },
    }
  };
}

function createBitcrush(ctx) {
  const input      = ctx.createGain();
  const output     = ctx.createGain();
  const processor  = ctx.createScriptProcessor(512, 1, 1);

  let bits = 8, reduction = 2, phase = 0, last = 0;

  processor.onaudioprocess = e => {
    const inp = e.inputBuffer.getChannelData(0);
    const out = e.outputBuffer.getChannelData(0);
    const step = Math.pow(0.5, bits - 1);
    for (let i = 0; i < inp.length; i++) {
      if ((phase += 1) >= reduction) { phase = 0; last = step * Math.round(inp[i] / step); }
      out[i] = last;
    }
  };

  input.connect(processor); processor.connect(output);

  return {
    label: 'CRUSH', input, output,
    dispose: () => { processor.disconnect(); },
    params: {
      bits:  { label: 'BITS', min: 1, max: 16, step: 1, value: bits,
               set: v => { bits = Math.round(v); } },
      redux: { label: 'REDUX', min: 1, max: 16, step: 1, value: reduction,
               set: v => { reduction = Math.round(v); } },
    }
  };
}

// ─── Registry ─────────────────────────────────────────────────────────────────

const EFFECT_DEFS = [
  { id: 'reverb',  label: 'REVERB',  factory: createReverb      },
  { id: 'delay',   label: 'DELAY',   factory: createDelay       },
  { id: 'dist',    label: 'DIST',    factory: createDistortion  },
  { id: 'wah',     label: 'WAH',     factory: createWah         },
  { id: 'chorus',  label: 'CHORUS',  factory: createChorus      },
  { id: 'crush',   label: 'CRUSH',   factory: createBitcrush    },
];
