// Vector props for the clip. Paper-cut style: flat fills from the palette,
// a soft inner highlight and a contact shadow handled by the stage (not here).
// Every prop is drawn in its own viewBox so it can be scaled freely.
const C = {
  purple: '#7E5499', purpleDeep: '#4E2F63', purpleSoft: '#B79BC9',
  yellow: '#FCCD59', yellowDeep: '#E8AE2E', cream: '#FFF8F2', pink: '#FFE6F3',
  pinkDeep: '#F4B8D4', crust: '#C98A4B', crumb: '#F6D9A3', crumbLight: '#FBE9C6',
  ink: '#3A2547', drop: '#9CC3E6', dropDeep: '#6E9FCF',
};

const ASSETS = {
  plate: `<svg viewBox="0 0 400 140" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="200" cy="70" rx="196" ry="64" fill="${C.purpleSoft}"/>
    <ellipse cx="200" cy="64" rx="196" ry="62" fill="${C.cream}"/>
    <ellipse cx="200" cy="66" rx="150" ry="44" fill="#F3E8EE"/>
    <ellipse cx="200" cy="64" rx="140" ry="40" fill="${C.cream}"/>
    <path d="M60 52 Q200 6 340 52" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".8"/>
  </svg>`,

  bread: `<svg viewBox="0 0 240 250" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 240 L40 110 C10 100 4 52 40 30 C80 4 160 4 200 30 C236 52 230 100 200 110 L200 240 Z" fill="${C.crust}"/>
    <path d="M58 226 L58 104 C34 94 30 60 56 44 C92 22 148 22 184 44 C210 60 206 94 182 104 L182 226 Z" fill="${C.crumb}"/>
    <g fill="${C.crumbLight}" opacity=".9">
      <ellipse cx="96" cy="90" rx="8" ry="5"/><ellipse cx="140" cy="120" rx="6" ry="4"/>
      <ellipse cx="110" cy="160" rx="7" ry="4"/><ellipse cx="152" cy="190" rx="5" ry="3"/>
      <ellipse cx="88" cy="200" rx="5" ry="3"/><ellipse cx="150" cy="70" rx="6" ry="4"/>
    </g>
    <path d="M70 60 C100 40 140 40 170 56" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".55"/>
  </svg>`,

  // A simple speech bubble. Tail points down-right; flip with scaleX(-1) as needed.
  bubble: `<svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 20 H460 Q500 20 500 60 V200 Q500 240 460 240 H380 L420 290 L310 240 H60 Q20 240 20 200 V60 Q20 20 60 20 Z" fill="#fff" stroke="${C.purple}" stroke-width="8" stroke-linejoin="round"/>
  </svg>`,

  drop: `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 6 C50 6 92 64 92 92 C92 118 73 134 50 134 C27 134 8 118 8 92 C8 64 50 6 50 6 Z" fill="${C.drop}"/>
    <path d="M30 92 C30 76 40 62 44 56" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".8"/>
  </svg>`,

  // House outline used as the "choice" frame. Roof + walls as one stroke so it can draw on.
  house: `<svg viewBox="0 0 600 520" xmlns="http://www.w3.org/2000/svg">
    <path class="draw" d="M60 220 L300 30 L540 220 M100 190 L100 490 L500 490 L500 190" fill="none" stroke="${C.purple}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  spotlight: `<svg viewBox="0 0 800 900" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="spg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${C.yellow}" stop-opacity=".0"/>
        <stop offset=".35" stop-color="${C.yellow}" stop-opacity=".35"/>
        <stop offset="1" stop-color="${C.yellow}" stop-opacity=".55"/>
      </linearGradient>
      <radialGradient id="spp" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="${C.yellow}" stop-opacity=".75"/>
        <stop offset="1" stop-color="${C.yellow}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <path d="M340 0 H460 L760 820 H40 Z" fill="url(#spg)"/>
    <ellipse cx="400" cy="820" rx="380" ry="70" fill="url(#spp)"/>
  </svg>`,

  hanger: `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
    <path d="M150 52 C150 30 170 26 172 14 C174 0 150 -4 140 8" fill="none" stroke="${C.purpleDeep}" stroke-width="8" stroke-linecap="round"/>
    <path d="M150 52 L18 140 H282 Z" fill="none" stroke="${C.purpleDeep}" stroke-width="9" stroke-linejoin="round"/>
  </svg>`,

  // Modest dress: long sleeves, high neckline, midi-length skirt.
  dress: (fill = C.purple, trim = C.yellow) => `<svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg">
    <path d="M112 20 Q150 44 188 20 L250 50 L292 230 L254 240 L222 118 L232 404 H68 L78 118 L46 240 L8 230 L50 50 Z" fill="${fill}"/>
    <path d="M112 20 Q150 44 188 20" fill="none" stroke="${trim}" stroke-width="10" stroke-linecap="round"/>
    <path d="M80 160 H220" stroke="${trim}" stroke-width="10" stroke-linecap="round"/>
    <path d="M98 40 Q100 120 92 200" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".25"/>
  </svg>`,

  tissue: `<svg viewBox="0 0 260 220" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="96" width="220" height="110" rx="18" fill="${C.pinkDeep}"/>
    <rect x="20" y="96" width="220" height="30" rx="14" fill="${C.purpleSoft}"/>
    <path d="M86 112 C70 70 100 40 130 20 C150 50 190 60 172 112 Z" fill="#fff"/>
    <path d="M120 40 C128 64 138 80 150 96" fill="none" stroke="#EADFF0" stroke-width="5" stroke-linecap="round"/>
  </svg>`,

  heart: `<svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 170 C40 124 6 92 6 52 C6 24 28 6 54 6 C76 6 92 20 100 36 C108 20 124 6 146 6 C172 6 194 24 194 52 C194 92 160 124 100 170 Z" fill="${C.yellow}"/>
  </svg>`,
};

if (typeof module !== 'undefined') module.exports = { ASSETS, C };
