import { useId } from 'react';
import { cn } from '../../../utilities/cn/index.js';
import { createVariants } from '../../../utilities/variants/index.js';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { ChatActivityIndicator } from '../ChatActivityIndicator/ChatActivityIndicator.jsx';

const agentMarkVariants = createVariants({
  base: 'ds-part-agent-mark relative inline-grid shrink-0 place-items-center rounded-(--ds-radius-card) font-semibold select-none',
  variants: {
    size: {
      xs: 'size-5 text-xs [--ds-activity-badge-size:5px] [&>svg]:size-3',
      sm: 'size-6 text-xs [--ds-activity-badge-size:6px] [&>svg]:size-3.5',
      md: 'size-8 text-sm [--ds-activity-badge-size:8px] [&>svg]:size-4',
      lg: 'size-10 text-base [--ds-activity-badge-size:10px] [&>svg]:size-5',
      xl: 'size-14 text-lg [--ds-activity-badge-size:12px] [&>svg]:size-8'
    },
    tone: {
      accent: 'bg-accent-subtle text-accent',
      discovery: 'bg-discovery-subtle text-discovery',
      neutral: 'bg-surface-muted text-text border',
      solid: 'bg-accent text-accent-foreground'
    }
  },
  defaultVariants: { size: 'md', tone: 'accent' }
});

/*
 * Motifs drawn from Antoni Gaudí's architecture, on a 24-unit grid in currentColor. Lighter layers use
 * opacity so one hue reads as glazed ceramic, and masked cuts read as mortar between tiles.
 */
const point = (radius, degrees, cx = 12, cy = 12) => {
  const angle = ((degrees - 90) * Math.PI) / 180;
  return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)].map((value) => Number(value.toFixed(2)));
};
const sector = (inner, outer, from, to) => {
  const [a, b] = [point(outer, from), point(outer, to)];
  const large = to - from > 180 ? 1 : 0;
  if (!inner) return `M12 12 L${a} A${outer} ${outer} 0 ${large} 1 ${b}Z`;
  const [c, d] = [point(inner, to), point(inner, from)];
  return `M${a} A${outer} ${outer} 0 ${large} 1 ${b} L${c} A${inner} ${inner} 0 ${large} 0 ${d}Z`;
};
// Trencadís: irregular shards in an inner disc and an outer ring, at uneven angles.
const innerCuts = [0, 70, 150, 235, 300];
const outerCuts = [20, 85, 130, 200, 255, 320];
const shards = [
  ...innerCuts.map((from, index) => ({ d: sector(0, 4.6, from, innerCuts[index + 1] ?? 360), opacity: [1, 0.7, 0.85, 0.55, 0.75][index] })),
  ...outerCuts.map((from, index) => ({ d: sector(5.4, 10.5, from, outerCuts[index + 1] ?? 380), opacity: [0.6, 0.9, 0.45, 0.8, 0.65, 0.95][index] }))
];
const spiral = (() => {
  const points = [];
  for (let step = 0; step <= 120; step += 1) points.push(point(0.8 + (step / 120) * 8.6, (step / 120) * 2.6 * 360));
  return `M${points.join(' L')}`;
})();

const AGENT_MOTIFS = {
  trencadis: {
    label: 'Trencadís mosaic',
    draw: () => shards.map((shard) => <path key={shard.d} d={shard.d} opacity={shard.opacity} />),
    cracks: true
  },
  spire: {
    label: 'Basilica spires',
    draw: () => (
      <>
        <path d='M5.5 22 C5.5 15 6 10.5 7 8 C8 10.5 8.5 15 8.5 22Z' opacity='.55' />
        <path d='M15.5 22 C15.5 15 16 10.5 17 8 C18 10.5 18.5 15 18.5 22Z' opacity='.55' />
        <path d='M9.5 22 C9.5 12 10.5 6.5 12 4 C13.5 6.5 14.5 12 14.5 22Z' />
        <circle cx='12' cy='2.4' r='1.4' />
      </>
    ),
    cutouts: () => ['M11.4 9h1.2v2.2h-1.2Z', 'M11.4 13h1.2v2.2h-1.2Z', 'M11.4 17h1.2v2.2h-1.2Z'].map((d) => <path key={d} d={d} />)
  },
  ironwork: {
    label: 'Wrought-iron spiral',
    draw: () => (
      <>
        <path d={spiral} fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
        <circle cx='12' cy='12' r='1.6' />
      </>
    )
  },
  rose: {
    label: 'Rose window',
    // Eight petals around a pierced centre, like the basilica's rose windows.
    draw: () => (
      <>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
          <ellipse key={angle} cx='12' cy='5.6' rx='2.5' ry='4.4' transform={`rotate(${angle} 12 12)`} opacity={index % 2 ? 0.55 : 1} />
        ))}
        <circle cx='12' cy='12' r='3.4' />
      </>
    ),
    cutouts: () => <circle cx='12' cy='12' r='1.5' />
  },
  palmetto: {
    label: 'Palmetto gate',
    // A fan of palm leaves rising from one stem, after the cast-iron gate of Casa Vicens.
    draw: () => (
      <>
        {[-50, -33, -16, 0, 16, 33, 50].map((angle, index) => {
          // Outer leaves are shorter, so the fan curves inside the frame.
          const top = 21 - [11.5, 14.5, 16.8, 18, 16.8, 14.5, 11.5][index];
          const mid = (21 + top) / 2;
          return <path key={angle} d={`M12 21 C10.5 ${mid + 2} 10.7 ${mid - 3} 12 ${top} C13.3 ${mid - 3} 13.5 ${mid + 2} 12 21Z`} transform={`rotate(${angle} 12 21)`} opacity={[0.5, 0.7, 0.85, 1, 0.85, 0.7, 0.5][index]} />;
        })}
        <path d='M8.8 21.5 A3.2 3.2 0 0 1 15.2 21.5Z' />
      </>
    )
  },
  panot: {
    label: 'Flower paving tile',
    // The Barcelona flower tile: quarter circles in the corners and a four-petal flower at the centre.
    draw: () => (
      <>
        <path d='M2 2h5.5A5.5 5.5 0 0 1 2 7.5Z M22 2v5.5A5.5 5.5 0 0 1 16.5 2Z M22 22h-5.5A5.5 5.5 0 0 1 22 16.5Z M2 22v-5.5A5.5 5.5 0 0 1 7.5 22Z' opacity='.5' />
        {[0, 90, 180, 270].map((angle) => <ellipse key={angle} cx='12' cy='7.2' rx='2.6' ry='4' transform={`rotate(${angle} 12 12)`} opacity='.85' />)}
        {[45, 135, 225, 315].map((angle) => <ellipse key={angle} cx='12' cy='8.6' rx='1.3' ry='2.4' transform={`rotate(${angle} 12 12)`} opacity='.55' />)}
        <circle cx='12' cy='12' r='2' />
      </>
    ),
    clip: true
  },
  helicoid: {
    label: 'Twisted chimney',
    // Four blades turning about the centre, like the helicoid chimneys on the rooftop of La Pedrera.
    draw: () => (
      <>
        {[0, 90, 180, 270].map((angle, index) => (
          <path key={angle} d='M12 12 C11.5 6.5 14.5 2.5 20.5 2.5 C18.5 6.5 16.5 10 12 12Z' transform={`rotate(${angle} 12 12)`} opacity={index % 2 ? 0.6 : 1} />
        ))}
        <circle cx='12' cy='12' r='2.2' />
      </>
    ),
    cutouts: () => <circle cx='12' cy='12' r='0.9' />
  },
  sun: {
    label: 'Sun medallion',
    // A ceramic sun from the market-hall ceiling: a glazed disc ringed by broken-tile rays.
    draw: () => (
      <>
        {Array.from({ length: 12 }, (_, index) => {
          const angle = index * 30;
          const [l, r, tip] = [point(5.6, angle - 11), point(5.6, angle + 11), point(index % 2 ? 9.2 : 10.8, angle)];
          return <path key={angle} d={`M${l} L${tip} L${r}Z`} opacity={index % 2 ? 0.55 : 0.9} />;
        })}
        <circle cx='12' cy='12' r='4.4' />
      </>
    ),
    cutouts: () => <circle cx='12' cy='12' r='2.4' fill='none' stroke='black' strokeWidth='0.9' />
  },
  star: {
    label: 'Nativity star',
    // A long four-point star over a shorter one, with a pierced heart, from the Nativity facade.
    draw: () => (
      <>
        <path d='M12 1 L14.2 9.8 L23 12 L14.2 14.2 L12 23 L9.8 14.2 L1 12 L9.8 9.8Z' />
        <path d='M12 1 L14.2 9.8 L23 12 L14.2 14.2 L12 23 L9.8 14.2 L1 12 L9.8 9.8Z' transform='rotate(45 12 12) translate(12 12) scale(0.62) translate(-12 -12)' opacity='.55' />
        {[[4.5, 4.5], [19.5, 4.5], [19.5, 19.5], [4.5, 19.5]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r='1.1' opacity='.7' />)}
      </>
    ),
    cutouts: () => <circle cx='12' cy='12' r='1.4' />
  }
};

// Glazed hues from the palette: a deep glaze on light surfaces and a bright one on dark.
const AGENT_HUES = {
  teal: 'text-teal-600 dark:text-teal-300',
  blue: 'text-blue-600 dark:text-blue-300',
  amber: 'text-amber-600 dark:text-amber-300',
  rose: 'text-rose-600 dark:text-rose-300',
  green: 'text-green-600 dark:text-green-300',
  indigo: 'text-indigo-600 dark:text-indigo-300',
  red: 'text-red-600 dark:text-red-300',
  yellow: 'text-yellow-700 dark:text-yellow-300'
};
const motifNames = Object.keys(AGENT_MOTIFS);
const hueNames = Object.keys(AGENT_HUES);

// FNV-1a with a final mix, so similar ids still land on different marks.
function hashSeed(seed = '') {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) hash = Math.imul(hash ^ seed.charCodeAt(index), 16777619);
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;
  return hash >>> 0;
}

/** The motif and hue a seed resolves to, for legends and tests. */
function resolveAgentMark(seed, { motif = 'auto', hue = 'auto' } = {}) {
  const hash = hashSeed(String(seed ?? ''));
  return {
    motif: motif !== 'auto' && AGENT_MOTIFS[motif] ? motif : motifNames[hash % motifNames.length],
    hue: hue !== 'auto' && AGENT_HUES[hue] ? hue : hueNames[(hash >>> 8) % hueNames.length]
  };
}

function AgentMotif({ motif }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const { draw, cracks, cutouts, clip } = AGENT_MOTIFS[motif];
  const masked = cracks || cutouts;
  return (
    <svg aria-hidden='true' focusable='false' viewBox='0 0 24 24' fill='currentColor' data-agent-motif={motif}>
      {masked || clip ? (
        <defs>
          {masked ? (
            <mask id={`${id}-mask`}>
              <rect width='24' height='24' fill='white' />
              {cracks ? (
                <g fill='none' stroke='black' strokeWidth='0.9'>
                  <circle cx='12' cy='12' r='5' />
                  {innerCuts.map((angle) => <line key={`i${angle}`} x1='12' y1='12' x2={point(5, angle)[0]} y2={point(5, angle)[1]} />)}
                  {outerCuts.map((angle) => <line key={`o${angle}`} x1={point(5, angle)[0]} y1={point(5, angle)[1]} x2={point(11, angle)[0]} y2={point(11, angle)[1]} />)}
                </g>
              ) : null}
              {cutouts ? <g fill='black'>{cutouts()}</g> : null}
            </mask>
          ) : null}
          {clip ? <clipPath id={`${id}-clip`}><rect x='1.5' y='1.5' width='21' height='21' rx='3' /></clipPath> : null}
        </defs>
      ) : null}
      <g mask={masked ? `url(#${id}-mask)` : undefined} clipPath={clip ? `url(#${id}-clip)` : undefined}>{draw()}</g>
    </svg>
  );
}

const initials = (name = '') => name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase();

/**
 * The assistant's mark. By default it draws a Gaudí-inspired motif (trencadís mosaic, basilica spires,
 * ironwork spiral, rose window, palmetto gate, flower paving tile, twisted chimney, sun medallion or
 * nativity star), drawn bare
 * in a glazed hue chosen from `seed` (or `name`), so every agent keeps a stable, recognisable mark. Pass `motif` or
 * `hue` to pin either one, or `icon`, `image` or `monogram` to show those on a `tone` tile instead.
 * `state` adds a small ChatActivityIndicator badge at the corner.
 *
 * The mark is named (`role='img'`) unless `decorative` is set, for example when a visible name sits
 * beside it.
 */
function ChatAgentMark({ name = 'Gaudi', seed, motif = 'auto', hue = 'auto', icon, image, monogram = false, size = 'md', tone = 'accent', state, decorative = false, labels, className, ...props }) {
  const resolved = !icon && !image && !monogram ? resolveAgentMark(seed ?? name, { motif, hue }) : null;
  const content = image
    ? <img src={image} alt='' className='size-full rounded-[inherit] object-cover' />
    : monogram
      ? <span aria-hidden='true'>{initials(name)}</span>
      : icon
        ? <RegistryIcon lucide={icon} />
        : <AgentMotif motif={resolved.motif} />;
  return (
    <span
      data-slot='agent-mark'
      data-state={state || undefined}
      data-agent-motif={resolved?.motif}
      data-agent-hue={resolved?.hue}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative ? true : undefined}
      className={cn(agentMarkVariants({ size, tone }), resolved && ['border-0 bg-transparent [&>svg]:size-full!', AGENT_HUES[resolved.hue]], className)}
      {...props}
    >
      {content}
      {state && state !== 'idle' ? (
        <ChatActivityIndicator
          state={state}
          variant='badge'
          labels={labels}
          decorative={decorative}
          className='absolute end-0 bottom-0 translate-x-1/4 translate-y-1/4 rtl:-translate-x-1/4'
        />
      ) : null}
    </span>
  );
}

const agentMotifs = Object.fromEntries(Object.entries(AGENT_MOTIFS).map(([key, value]) => [key, value.label]));

export { ChatAgentMark, agentMarkVariants, agentMotifs, hueNames as agentHues, resolveAgentMark };
