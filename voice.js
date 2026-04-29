class Voice {
  constructor(ctx, track, freq, vel, time, len){
    this.ctx = ctx;
    this.finished = false;

    this.osc1 = ctx.createOscillator();
    this.osc2 = ctx.createOscillator();

    this.osc1.type = track.waveType || "sawtooth";
    this.osc2.type = track.waveType || "sawtooth";

    this.osc1.frequency.setValueAtTime(freq, time);
    this.osc2.frequency.setValueAtTime(freq * 1.01, time);

    this.filter = ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.setValueAtTime(track.cutoff, time);

    this.gain = ctx.createGain();
    this.pan = ctx.createStereoPanner();

    this.pan.pan.value = track.pan;

    // ADSR
    const A = track.attack, D = track.decay, S = track.sustain, R = track.release;
    const peak = vel * track.volume;

    this.gain.gain.setValueAtTime(0, time);
    this.gain.gain.linearRampToValueAtTime(peak, time + A);
    this.gain.gain.linearRampToValueAtTime(peak*S, time + A + D);
    this.gain.gain.setValueAtTime(peak*S, time + len);
    this.gain.gain.linearRampToValueAtTime(0, time + len + R);

    // routing
    this.osc1.connect(this.filter);
    this.osc2.connect(this.filter);
    this.filter.connect(this.gain);
    this.gain.connect(this.pan);
    this.pan.connect(track.output);

    this.osc1.start(time);
    this.osc2.start(time);

    const stopTime = time + len + R + 0.1;

    this.osc1.stop(stopTime);
    this.osc2.stop(stopTime);

    setTimeout(()=>{
      this.disconnect();
      this.finished = true;
    }, (stopTime - ctx.currentTime) * 1000);
  }

  stopEarly(){
    try{
      const t = this.ctx.currentTime;
      this.gain.gain.cancelScheduledValues(t);
      this.gain.gain.linearRampToValueAtTime(0, t + 0.05);
      this.osc1.stop(t + 0.05);
      this.osc2.stop(t + 0.05);
    }catch(e){}
  }

  disconnect(){
    try{
      this.osc1.disconnect();
      this.osc2.disconnect();
      this.filter.disconnect();
      this.gain.disconnect();
      this.pan.disconnect();
    }catch(e){}
  }
}