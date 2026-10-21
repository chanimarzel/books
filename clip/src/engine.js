// Tiny deterministic animation toolkit. Everything is a pure function of time t,
// so any frame can be rendered in isolation (needed for parallel rendering).
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const prog = (t, t0, t1) => clamp((t - t0) / (t1 - t0));

const E = {
  lin: k => k,
  outCubic: k => 1 - Math.pow(1 - k, 3),
  inCubic: k => k * k * k,
  inOutSine: k => -(Math.cos(Math.PI * k) - 1) / 2,
  inOutCubic: k => (k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
  // short hop that lands and settles softly
  outBack: (k, s = 1.6) => 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2),
  // damped spring, settles at 1
  spring: (k, f = 3.2, d = 5.5) => 1 - Math.exp(-d * k) * Math.cos(f * Math.PI * k),
};

// tween value from a to b between t0 and t1
const tw = (t, t0, t1, a, b, ease = E.outCubic) => lerp(a, b, ease(prog(t, t0, t1)));

// keyframe track: [[time, value, easeIntoThisKey?], ...]
function track(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1, ease = E.inOutCubic] = keys[i];
    const [t0, v0] = keys[i - 1];
    if (t <= t1) return lerp(v0, v1, ease(prog(t, t0, t1)));
  }
  return keys[keys.length - 1][1];
}

// small idle motion between accents (amplitude in px or deg)
const idle = (t, amp = 4, period = 3.2, phase = 0) => amp * Math.sin((t / period + phase) * Math.PI * 2);

// a hop: 0 before t0, quick rise and soft landing, ~0 after
function hop(t, t0, dur = .42, height = 40) {
  const k = prog(t, t0, t0 + dur);
  if (k <= 0 || k >= 1) return 0;
  return -height * Math.sin(Math.PI * k) * (1 - .35 * k);
}

// squash on landing: returns [sx, sy]
function squash(t, tLand, amt = .1) {
  const k = prog(t, tLand, tLand + .3);
  if (k <= 0 || k >= 1) return [1, 1];
  const s = amt * Math.sin(Math.PI * k) * (1 - k);
  return [1 + s, 1 - s];
}

const cache = {};
const $ = id => cache[id] || (cache[id] = document.getElementById(id));

// apply transform/opacity to an element; x,y are the element's centre in stage px
function put(id, { x = 0, y = 0, s = 1, sx = 1, sy = 1, r = 0, o = 1, z } = {}) {
  const el = $(id);
  if (!el) return;
  el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${r}deg) scale(${s * sx}, ${s * sy})`;
  el.style.opacity = o;
  el.style.visibility = o <= 0.001 ? 'hidden' : 'visible';
  if (z !== undefined) el.style.zIndex = z;
}

const hide = (...ids) => ids.forEach(id => put(id, { o: 0 }));

if (typeof module !== 'undefined') module.exports = { clamp, lerp, prog, E, tw, track, idle, hop, squash };
