let interval;

function scheduler() {
  const lookahead = 0.1;
  while (nextTime < ctx.currentTime + lookahead) {
    stepSequencer(nextTime);
    nextTime += stepDuration();
  }
}

function stepSequencer(time) {
  // Synth tracks
  tracks.forEach(t => {
    t.grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell.on && c === (step % 16)) {
          const freq = 220
            * Math.pow(2, (11 - r) / 12)
            * Math.pow(2, (t.octave !== undefined ? t.octave - 4 : 0))
            * Math.pow(2, (t.pitch  !== undefined ? t.pitch  / 12 : 0));
          const noteTime = Math.max(
            ctx.currentTime + 0.001,
            time + (t.nudge !== undefined ? t.nudge / 1000 : 0)
          );
          voiceManager.play(ctx, t, freq, cell.vel, noteTime, cell.len * stepDuration());
        }
      });
    });
  });

  // Drum machine
  if (typeof drumMachine !== 'undefined') {
    drumMachine.step(step, time);
  }

  step = (step + 1) % 32;
}

function startScheduler() { interval = setInterval(scheduler, 25); }
function stopScheduler()  { clearInterval(interval); }

function togglePlay() {
  if (!isPlaying) {
    ctx.resume();
    nextTime = ctx.currentTime;
    startScheduler();
  } else {
    stopScheduler();
    step = 0;
  }
  isPlaying = !isPlaying;
}

// Called by the Play button (updates button visual state too)
function handlePlay() {
  togglePlay();
  const btn = document.getElementById('play-btn');
  if (btn) {
    btn.classList.toggle('playing', isPlaying);
    btn.innerHTML = isPlaying ? '&#9646;&#9646; STOP' : '&#9654; PLAY';
  }
}
