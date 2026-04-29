class VoiceManager {
  constructor(maxVoices = 24){
    this.maxVoices = maxVoices;
    this.active = [];
  }

  play(ctx, track, freq, vel, time, len){

    this.active = this.active.filter(v => !v.finished);

    if(this.active.length >= this.maxVoices){
      this.active.shift().stopEarly();
    }

    const v = new Voice(ctx, track, freq, vel, time, len);
    this.active.push(v);
  }
}