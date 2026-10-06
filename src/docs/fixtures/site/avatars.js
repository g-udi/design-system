// Deterministic illustrated avatars for Storybook demo people. A seed always yields the same
// abstract face, drawn from the gradient artwork palettes so portraits match the example art.
// `node scripts/generate-avatars.mjs` writes the shared files under .storybook/public/avatars/.

const palettes = [
  ['#e9e4fb', '#f3effd', '#a5b4fc', '#f0abfc', '#4338ca'],
  ['#fdeee8', '#fbe7f0', '#fda4af', '#fdba74', '#9f1239'],
  ['#e3f4f7', '#e8eefc', '#67e8f9', '#93c5fd', '#0e7490'],
  ['#eaf7ec', '#f2f8e6', '#86efac', '#d9f99d', '#166534'],
  ['#fdf0e6', '#fdeaea', '#fca5a5', '#fcd34d', '#9a3412'],
  ['#e8e8fb', '#efe9fb', '#818cf8', '#c4b5fd', '#4c1d95'],
  ['#fdeef3', '#f7ecfb', '#f9a8d4', '#e9d5ff', '#9d174d'],
  ['#e6f3fd', '#eef0fc', '#7dd3fc', '#a5b4fc', '#1e40af'],
  ['#fbf3e6', '#f7efe9', '#fcd34d', '#fbcfe8', '#92400e'],
  ['#e8f7f1', '#eeeafb', '#6ee7b7', '#c4b5fd', '#065f46'],
  ['#fef0e7', '#e9f1fd', '#fdba74', '#93c5fd', '#c2410c'],
  ['#eceef5', '#efeaf8', '#a5b4fc', '#cbd5e1', '#334155']
];
const faces = ['#fff3e6', '#fde4cf', '#f4cba8', '#dba57f', '#b47b55', '#83563a'];
const hairs = ['#1f2937', '#3f2a1d', '#6b3f22', '#a16207', '#57534e', '#7c2d12', '#312e81'];
const ink = '#1e293b';

function hash(seed) {
  let value = 2166136261;
  for (const character of String(seed)) value = Math.imul(value ^ character.codePointAt(0), 16777619);
  return value >>> 0;
}

function random(seed) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let next = Math.imul(state ^ (state >>> 15), state | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

const paint = (name, color, property = 'fill') => `style="${property}:var(--avatar-${name},${color})"`;

const heads = [
  (face) => `<circle cx="32" cy="29" r="13" ${face}/>`,
  (face) => `<rect x="19" y="15" width="26" height="28" rx="11" ${face}/>`,
  (face) => `<ellipse cx="32" cy="29" rx="12.5" ry="14.5" ${face}/>`
];
const hairstyles = [
  () => '',
  (hair) => `<path d="M18.5 28a13.5 13.5 0 0 1 27 0c-4-5-10-7.5-13.5-7.5S22.5 23 18.5 28z" ${hair}/>`,
  (hair) => `<path d="M18 30c-1-11 7-17 15-17 8 0 14 6 13 15-6-1-13-4-16-9-2 5-6 9-12 11z" ${hair}/>`,
  (hair) => `<circle cx="32" cy="12.5" r="5.5" ${hair}/><path d="M18.5 27a13.5 13.5 0 0 1 27 0c-5-4-9.5-5.5-13.5-5.5S23.5 23 18.5 27z" ${hair}/>`,
  (hair) => `<path d="M17 47V29a15 15 0 0 1 30 0v18h-6V30c-3-4-6-6-9-6s-6 2-9 6v17z" ${hair}/>`,
  (hair) => [ [20, 21], [25, 16.5], [32, 15], [39, 16.5], [44, 21] ].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" ${hair}/>`).join('')
];
const eyesets = [
  () => `<circle cx="27" cy="29" r="1.6" ${paint('ink', ink)}/><circle cx="37" cy="29" r="1.6" ${paint('ink', ink)}/>`,
  () => `<path d="M25 29.5q2-2.4 4 0M35 29.5q2-2.4 4 0" fill="none" stroke-width="1.5" stroke-linecap="round" ${paint('ink', ink, 'stroke')}/>`,
  () => `<ellipse cx="27" cy="29" rx="1.3" ry="2" ${paint('ink', ink)}/><ellipse cx="37" cy="29" rx="1.3" ry="2" ${paint('ink', ink)}/>`,
  () => `<path d="M25 29h4M35 29h4" stroke-width="1.6" stroke-linecap="round" ${paint('ink', ink, 'stroke')}/>`
];
const mouths = [
  () => `<path d="M28.5 35q3.5 3 7 0" fill="none" stroke-width="1.5" stroke-linecap="round" ${paint('ink', ink, 'stroke')}/>`,
  () => `<path d="M29.5 36h5" stroke-width="1.5" stroke-linecap="round" ${paint('ink', ink, 'stroke')}/>`,
  () => `<ellipse cx="32" cy="36" rx="1.8" ry="1.4" ${paint('ink', ink)}/>`,
  () => `<path d="M29 35.5q3.5 1.8 6.5-.8" fill="none" stroke-width="1.5" stroke-linecap="round" ${paint('ink', ink, 'stroke')}/>`
];

const pick = (next, list) => list[Math.floor(next() * list.length)];

/** Returns a 64×64 SVG string for `seed`. Colors read `--avatar-*` custom properties when inlined. */
export function createAvatarSvg(seed) {
  const key = hash(seed);
  const next = random(key);
  const id = `avatar-${key.toString(36)}`;
  const [ start, end, bloom, glow, body ] = pick(next, palettes);
  const face = paint('face', pick(next, faces));
  const hair = paint('hair', pick(next, hairs));
  const parts = [
    `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" ${paint('start', start, 'stop-color')}/><stop offset="1" ${paint('end', end, 'stop-color')}/></linearGradient></defs>`,
    `<rect width="64" height="64" fill="url(#${id})"/>`,
    `<circle cx="${8 + Math.round(next() * 12)}" cy="${8 + Math.round(next() * 10)}" r="18" opacity="0.55" ${paint('bloom', bloom)}/>`,
    `<circle cx="${46 + Math.round(next() * 10)}" cy="${40 + Math.round(next() * 14)}" r="20" opacity="0.5" ${paint('glow', glow)}/>`
  ];
  const hairstyle = pick(next, hairstyles);
  const long = hairstyle === hairstyles[4];
  parts.push('<g transform="matrix(1.22 0 0 1.22 -7 -5.7)">');
  if (long) parts.push(hairstyle(hair));
  parts.push(`<path d="M11 64c0-11 9-19 21-19s21 8 21 19z" ${paint('body', body)}/>`);
  parts.push(pick(next, heads)(face));
  if (!long) parts.push(hairstyle(hair));
  if (next() < 0.4) parts.push(`<circle cx="24" cy="34" r="2.2" opacity="0.35" ${paint('blush', '#f43f5e')}/><circle cx="40" cy="34" r="2.2" opacity="0.35" ${paint('blush', '#f43f5e')}/>`);
  parts.push(pick(next, eyesets)());
  if (next() < 0.22) parts.push(`<g fill="none" stroke-width="1.2" ${paint('ink', ink, 'stroke')}><circle cx="27" cy="29" r="3.6"/><circle cx="37" cy="29" r="3.6"/><path d="M30.6 29h2.8"/></g>`);
  parts.push(pick(next, mouths)(), '</g>');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">${parts.join('')}</svg>\n`;
}
