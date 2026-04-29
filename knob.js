class Knob {
  // 270° sweep: starts at 7:30 (135° from 3-o'clock), ends at 4:30
  static S = 3 * Math.PI / 4;
  static W = 3 * Math.PI / 2;

  constructor({ label, min, max, value, step = 0.01, onChange, color = '#00e5ff', size = 48 }) {
    this.min = min;
    this.max = max;
    this.value = Math.max(min, Math.min(max, value));
    this.step = step;
    this.onChange = onChange;
    this.color = color;
    this.size = size;

    this.el = document.createElement('div');
    this.el.className = 'knob-wrap';

    this.canvas = document.createElement('canvas');
    this.canvas.width = size;
    this.canvas.height = size;
    this.canvas.style.cursor = 'ns-resize';
    this.canvas.style.display = 'block';
    this.ctx = this.canvas.getContext('2d');

    this.valEl = document.createElement('div');
    this.valEl.className = 'knob-val';

    this.lblEl = document.createElement('div');
    this.lblEl.className = 'knob-lbl';
    this.lblEl.textContent = label;

    this.el.appendChild(this.canvas);
    this.el.appendChild(this.valEl);
    this.el.appendChild(this.lblEl);

    this._listen();
    this.draw();
  }

  _listen() {
    let startY, startVal;
    const range = this.max - this.min;

    const onMove = e => {
      const dy = startY - (e.touches ? e.touches[0].clientY : e.clientY);
      let v = startVal + (dy / 130) * range;
      v = Math.round(v / this.step) * this.step;
      v = Math.max(this.min, Math.min(this.max, v));
      if (Math.abs(v - this.value) >= this.step * 0.5) {
        this.value = v;
        this.draw();
        this.onChange(v);
      }
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    this.canvas.addEventListener('mousedown', e => {
      e.preventDefault();
      startY = e.clientY;
      startVal = this.value;
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    this.canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const dir = e.deltaY < 0 ? 1 : -1;
      const v = Math.max(this.min, Math.min(this.max, this.value + dir * this.step));
      this.value = v;
      this.draw();
      this.onChange(v);
    }, { passive: false });
  }

  draw() {
    const c   = this.ctx;
    const sz  = this.size;
    const cx  = sz / 2, cy = sz / 2;
    const ro  = sz / 2 - 2;
    const rb  = ro - 5;
    const S   = Knob.S, W = Knob.W;
    const norm = (this.value - this.min) / (this.max - this.min);

    c.clearRect(0, 0, sz, sz);

    // Track ring
    c.beginPath();
    c.arc(cx, cy, ro, S, S + W);
    c.strokeStyle = '#1c1c1c';
    c.lineWidth = 3;
    c.lineCap = 'round';
    c.stroke();

    // Value arc (glow)
    if (norm > 0.001) {
      c.beginPath();
      c.arc(cx, cy, ro, S, S + norm * W);
      c.strokeStyle = this.color;
      c.lineWidth = 3;
      c.lineCap = 'round';
      c.shadowColor = this.color;
      c.shadowBlur = 4;
      c.stroke();
      c.shadowBlur = 0;
    }

    // Knob body with radial gradient (3D dome effect)
    const g = c.createRadialGradient(cx - rb * 0.3, cy - rb * 0.3, rb * 0.1, cx, cy, rb);
    g.addColorStop(0,   '#525252');
    g.addColorStop(0.4, '#2c2c2c');
    g.addColorStop(1,   '#0e0e0e');
    c.beginPath();
    c.arc(cx, cy, rb, 0, Math.PI * 2);
    c.fillStyle = g;
    c.fill();
    c.strokeStyle = '#3a3a3a';
    c.lineWidth = 1;
    c.stroke();

    // Indicator dot on knob rim
    const angle = S + norm * W;
    const dr = rb - 5;
    c.beginPath();
    c.arc(cx + dr * Math.cos(angle), cy + dr * Math.sin(angle), 2.5, 0, Math.PI * 2);
    c.fillStyle = '#ffffff';
    c.shadowColor = '#ffffff';
    c.shadowBlur = 3;
    c.fill();
    c.shadowBlur = 0;

    this.valEl.textContent = this._fmt();
  }

  _fmt() {
    const v = this.value, range = this.max - this.min;
    if (range <= 2)    return v.toFixed(2);
    if (range >= 500)  return Math.round(v);
    return v.toFixed(2);
  }

  setValue(v) {
    this.value = Math.max(this.min, Math.min(this.max, v));
    this.draw();
    return this;
  }
}
