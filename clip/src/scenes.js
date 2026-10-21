// Scene direction. Every function reads only `t` (seconds into the song).
const FORMAT = new URLSearchParams(location.search).get('format') || '16x9';
if (FORMAT === '9x16') document.body.classList.add('f9x16');
const W = FORMAT === '9x16' ? 1080 : 1920, H = FORMAT === '9x16' ? 1920 : 1080;
// Layout anchors: compositions are placed from these so 9:16 can be re-laid out
// by changing numbers, not choreography.
const LAYOUT = {
  '16x9': { cx: 960, cy: 500, tableY: 915, lyricY: 950, spread: 340, houseY: 470 },
  '9x16': { cx: 540, cy: 820, tableY: 1600, lyricY: 1560, spread: 250, houseY: 800 },
}[FORMAT];

const world = document.getElementById('world');
const wash = document.getElementById('wash');
const front = document.getElementById('front');

function mk(id, w, h, html = '', cls = 'a', parent = world) {
  const d = document.createElement('div');
  d.id = id; d.className = cls; d.style.width = w + 'px'; d.style.height = h + 'px';
  d.innerHTML = html;
  parent.appendChild(d);
  return d;
}

// ---------- props ----------
// the same slice, cut diagonally: half the drama, same bread
const breadTriangles = `<svg viewBox="0 0 240 250" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="cutA"><path d="M-10 -10 H250 L-10 260 Z"/></clipPath><clipPath id="cutB"><path d="M250 -10 V260 H-10 Z"/></clipPath></defs>
  <g clip-path="url(#cutA)" transform="translate(-16 -10) rotate(-4 120 125)">${ASSETS.bread.replace(/<\/?svg[^>]*>/g, '')}</g>
  <g clip-path="url(#cutB)" transform="translate(16 10) rotate(4 120 125)">${ASSETS.bread.replace(/<\/?svg[^>]*>/g, '')}</g>
</svg>`;
const option = bread => `<div style="position:absolute;left:0;bottom:0;width:100%;height:36%">${ASSETS.plate}</div>
  <div style="position:absolute;left:24%;bottom:17%;width:52%;height:58%">${bread}</div>`;

mk('table', 2200, 330, '', 'a');
mk('sh_plate', 460, 70, '', 'a shadow');
mk('plate', 420, 147, ASSETS.plate, 'a prop');
mk('bread', 230, 240, ASSETS.bread, 'a prop');
mk('bubble1', 470, 271, ASSETS.bubble + `<div class="bubbleText" style="font-size:78px">לא רוצה</div>`, 'a prop');

mk('ring2', 100, 100, '', 'a');
mk('ring', 100, 100, '', 'a');
mk('drop', 92, 129, ASSETS.drop, 'a prop');

mk('houseLight', 426, 320, '', 'a');
mk('house', 640, 555, ASSETS.house, 'a');
mk('sh_optA', 240, 40, '', 'a shadow');
mk('sh_optB', 240, 40, '', 'a shadow');
mk('optA', 230, 240, option(ASSETS.bread), 'a prop');
mk('optB', 230, 240, option(breadTriangles), 'a prop');

mk('dim', W, H, '', 'a', front);
mk('bigNo', 1500, 865, ASSETS.bubble + `<div class="bubbleText" style="font-size:430px;color:${C.purple}">לא!</div>`, 'a prop', front);

$('ring').style.cssText += `border-radius:50%;border:7px solid ${C.purpleSoft};background:radial-gradient(closest-side, rgba(255,230,243,.0) 60%, rgba(255,230,243,.9));box-sizing:border-box`;
$('ring2').style.cssText += `border-radius:50%;border:4px solid ${C.pinkDeep};box-sizing:border-box`;
$('houseLight').style.cssText += `background:linear-gradient(180deg, ${C.yellow} 0%, #FDE3A0 70%, ${C.cream} 100%);border-radius:10px`;
$('dim').style.background = C.pink;

const housePath = document.querySelector('#house path.draw');
const houseLen = housePath.getTotalLength();
housePath.style.strokeDasharray = houseLen;

// ---------- lyrics ----------
const lyricEls = {};
for (const l of LINES) {
  const el = mk('ly_' + l.id, 1800, 90, '', 'a lyric', front);
  el.style.width = 'auto';
  const words = l.text.split(' ');
  el.innerHTML = words.map((w, i) => {
    const f = l.focus && l.focus[w] !== undefined;
    return `<span class="w${f ? ' focus' : ''}" data-i="${i}">${f ? `<span class="pillbg"></span>` : ''}<span class="tx">${w}</span></span>`;
  }).join('');
  lyricEls[l.id] = { el, words, spans: [...el.querySelectorAll('.w')] };
}
const st = document.createElement('style');
st.textContent = `.w.focus{position:relative;isolation:isolate;margin-left:.22em}.w.focus+.w,.w+.w.focus{margin-right:.48em}
  .w.focus .pillbg{position:absolute;inset:.1em -.26em 0 -.26em;background:${C.yellow};border-radius:999px;z-index:-1;transform:scaleX(0)}`;
document.head.appendChild(st);

// Default line behaviour: words rise in with a stagger, leave together.
function lyric(t, id, { y = LAYOUT.lyricY, x = LAYOUT.cx, out, wordStyle } = {}) {
  const l = T[id], { el, spans } = lyricEls[id];
  const tIn = l.t0 - .14;
  const tOut = out !== undefined ? out : l.t1 + .5;
  if (t < tIn - .01 || t > tOut + .3) { put(el.id, { o: 0 }); return; }
  const ko = prog(t, tOut, tOut + .28);
  put(el.id, { x, y: y - 16 * E.inCubic(ko), o: 1 - ko });
  spans.forEach((s, i) => {
    const k = E.outCubic(prog(t, tIn + i * .07, tIn + i * .07 + .38));
    let st = { y: 28 * (1 - k), o: k, s: 1 };
    if (wordStyle) st = wordStyle(t, i, s, st) || st;
    s.style.transform = `translateY(${st.y}px) scale(${st.s})`;
    s.style.opacity = st.o;
  });
}

// ---------- scene helpers ----------
function plateWithBread(t, x, y, { s = 1, breadR = 0, breadHop = 0, o = 1 } = {}) {
  put('sh_plate', { x, y: y + 52 * s, s, o: o * .9 });
  put('plate', { x, y, s, o });
  put('bread', { x, y: y - 96 * s + breadHop, s, r: breadR, o });
}

// ================== SCENES ==================

// pre-chorus tail: two wills pushing for the same spot
function sceneTwoWills(t) {
  if (t > 56.6) return;
  const { cx } = LAYOUT;
  const rel = tw(t, 52.44, 53.7, 0, 1, E.inOutCubic);        // release on "מנעי"
  // beat nudges: each will leans in on the beat, the other is pushed back
  const nudge = [50.81, 51.22, 51.62, 52.01].reduce((a, b, i) => a + (i % 2 ? -1 : 1) * 16 * Math.max(0, E.spring(prog(t, b, b + .38)) - prog(t, b, b + .38)), 0);
  const pressA = (1 - rel) * (nudge);
  let px = lerp(cx + 150, cx + 560, rel) + pressA + tw(t, 55.5, 56.4, 0, 700, E.inCubic);
  const sigh = hop(t, 54.33, .7, 18) + tw(t, 54.6, 55.4, 0, 6, E.inOutSine);
  const [ssx, ssy] = squash(t, 54.95, .06);
  plateWithBread(t, px - tw(t, 53.7, 55.4, 0, 60, E.inOutSine), 690 + tw(t, 53.7, 55.4, 0, 14, E.inOutSine), {
    s: lerp(1, .78, rel),
    breadR: lerp(-7, 0, rel) + idle(t, 1.5, 2.4) * (1 - rel) + tw(t, 54.33, 55.0, 0, -4, E.outBack),
    breadHop: sigh,
  });
  put('bubble1', {
    x: lerp(cx - 190, cx - 640, rel) + pressA * .8, y: lerp(420, 360, rel) + idle(t, 4, 2.8),
    r: lerp(5, -4, rel), s: lerp(1, .7, rel), o: 1 - prog(t, 53.0, 53.6),
  });
}

// chorus: a tear falls and becomes a circle that holds space
function sceneDrop(t) {
  if (t < 55.9 || t > 59.9) return;
  const { cx } = LAYOUT, cy = 540;
  const appear = E.outBack(prog(t, 55.99, 56.32));
  const fall = E.inCubic(prog(t, 56.38, 57.19));
  const land = 57.19;
  const [sx, sy] = squash(t, land - .02, .28);
  const dy = lerp(150, cy, fall) + (t < 56.38 ? idle(t, 3, .9) : 0);
  put('drop', { x: cx, y: dy, s: 1.35 * appear * (1 - prog(t, land + .05, land + .22)), sx, sy, o: 1 - prog(t, land + .1, land + .22) });
  // ripple: grows fast, then keeps breathing slowly
  const r = t < land ? 0 : tw(t, land, 58.9, 24, 520, E.outCubic) + tw(t, 58.9, 59.6, 0, 40, E.lin);
  const fade = 1 - prog(t, 59.1, 59.8);
  put('ring', { x: cx, y: cy, s: r / 100, o: (t < land ? 0 : 1) * fade });
  const r2 = t < land + .25 ? 0 : tw(t, land + .25, 59.3, 24, 760, E.outCubic);
  put('ring2', { x: cx, y: cy, s: r2 / 100, o: (t < land + .25 ? 0 : .7 * (1 - prog(t, 58.0, 59.3))) });
}

// "כי יש בחירה כאן בביתי": the house opens, two equal options
function sceneHouse(t) {
  if (t < 59.0) return;
  const { cx, houseY } = LAYOUT;
  // camera push used by the "לא!" moment (scale world from 1.22 back to 1)
  const draw = E.inOutCubic(prog(t, 59.1, 59.95));
  housePath.style.strokeDashoffset = houseLen * (1 - draw);
  const breathe = 1 + .006 * Math.sin((t - 60) / 2.6 * Math.PI * 2);
  put('house', { x: cx, y: houseY + idle(t, 1.5, 4), s: breathe, o: 1 });
  // the light opens like two doors from the centre on "בחירה"
  const open = E.inOutCubic(prog(t, T.c1c.focus['בחירה'] - .08, T.c1c.focus['בחירה'] + .55));
  const hl = $('houseLight');
  hl.style.clipPath = `inset(0 ${50 - 50 * open}% 0 ${50 - 50 * open}%)`;
  put('houseLight', { x: cx, y: houseY + 85, o: open > 0 ? .95 : 0, s: breathe });
  // two options land on consecutive beats, same size
  const opts = [['optA', cx + 112, 60.07, 0], ['optB', cx - 112, 60.46, .5]];
  for (const [id, x, tb, ph] of opts) {
    const k = prog(t, tb, tb + .5);
    const s = t < tb ? 0 : E.outBack(k, 2.2);
    const y = houseY + 140 + hop(t, tb, .45, 70) + idle(t, 3, 3.4, ph) * prog(t, tb + .5, tb + 1.2);
    put(id, { x, y, s: s * .9, o: t < tb ? 0 : 1 });
    put('sh_' + id, { x, y: houseY + 238, s: s * .8 * (1 + hop(t, tb, .45, 70) / 300), o: t < tb ? 0 : .8 });
  }
}

// "ולא כל לא! זו מלחמה": a giant NO, then the camera pulls back to a tiny bubble
function sceneNo(t) {
  const f = T.c1d.focus, tNo = f['לא!'], tBack = f['זו'];
  if (t < tNo - .01 || t > 70) { put('bigNo', { o: 0 }); put('dim', { o: 0 }); return; }
  const { cx, cy } = LAYOUT;
  const pop = E.outBack(prog(t, tNo, tNo + .3), 1.9);
  const back = E.inOutCubic(prog(t, tBack, tBack + .85));
  const tx = cx + 300, ty = 300;           // where the bubble really lives
  const s = lerp(lerp(.72, 1, pop), .19, back);
  put('bigNo', {
    x: lerp(cx, tx, back), y: lerp(cy + 20, ty, back) + idle(t, 6, 2.2) * back,
    s, r: lerp(-3, 4, back) + (1 - back) * 1.5 * Math.sin((t - tNo) * 9) * (1 - prog(t, tNo, tNo + .5)),
  });
  put('dim', { x: W / 2, y: H / 2, o: .88 * (1 - back) });
  world.style.transform = `scale(${lerp(1.18, 1, back)})`;
}

function renderAt(t) {
  world.style.transform = 'none';
  world.style.transformOrigin = `${LAYOUT.cx}px 470px`;
  for (const el of [...world.children, ...front.children]) { el.style.opacity = 0; el.style.visibility = 'hidden'; }

  // background: tension tints the room pink, release clears it
  const tension = 1 - tw(t, 52.44, 54.2, 0, 1, E.inOutSine);
  wash.style.background = `radial-gradient(ellipse at 50% 40%, ${C.cream} 30%, rgba(255,230,243,${.35 + .65 * tension}) 100%), ${C.cream}`;
  put('table', { x: LAYOUT.cx, y: LAYOUT.tableY + 160 });

  sceneTwoWills(t);
  sceneDrop(t);
  sceneHouse(t);
  sceneNo(t);

  lyric(t, 'p1b', { out: 52.2 });
  lyric(t, 'c1a', { out: 55.75 });
  lyric(t, 'c1b', { out: 58.85 });
  lyric(t, 'c1c', {
    out: 61.78,
    wordStyle: (t, i, s, st) => {
      if (!s.classList.contains('focus')) return st;
      const tf = T.c1c.focus['בחירה'];
      s.querySelector('.pillbg').style.transform = `scaleX(${E.outCubic(prog(t, tf, tf + .45))})`;
      return { ...st, s: 1 + .18 * E.spring(prog(t, tf, tf + .9)) };
    },
  });
  lyric(t, 'c1d', {
    wordStyle: (t, i, s, st) => {
      const f = T.c1d.focus;
      if (i >= 2) {               // "לא!" "זו" "מלחמה" arrive after the pull-back
        const t0 = i === 2 ? f['זו'] + .1 : i === 3 ? f['זו'] + .28 : f['מלחמה'] + .2;
        const k = E.outCubic(prog(t, t0, t0 + .4));
        return { y: 20 * (1 - k), o: k, s: 1 };
      }
      return st;
    },
  });
}
window.renderAt = renderAt;
renderAt(+(new URLSearchParams(location.search).get('t') || 0));
