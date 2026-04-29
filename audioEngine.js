const ctx = new (window.AudioContext || window.webkitAudioContext)();

// Master bus
const master = ctx.createGain();
master.gain.value = 0.8;
master.connect(ctx.destination);

// Master analyser for metering (optional future use)
const masterAnalyser = ctx.createAnalyser();
masterAnalyser.fftSize = 256;
master.connect(masterAnalyser);

const voiceManager = new VoiceManager(32);

// Shared transport state
let step      = 0;
let nextTime  = 0;
let isPlaying = false;

function stepDuration() {
  const bpm = parseFloat(document.getElementById('bpm').value) || 120;
  return (60 / bpm) / 4;
}
