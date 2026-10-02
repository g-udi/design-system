import { useId } from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { createVariants } from '../../../../utilities/variants/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { ActivityIndicator } from '../../ActivityIndicator/parts/activity-indicator.jsx';

const agentMarkVariants = createVariants({
  base: 'ds-part-agent-mark relative inline-grid shrink-0 place-items-center rounded-(--ds-radius-card) font-semibold select-none',
  variants: {
    size: {
      xs: 'size-5 text-xs [&_svg]:size-3',
      sm: 'size-6 text-xs [&_svg]:size-3.5',
      md: 'size-8 text-sm [&_svg]:size-4',
      lg: 'size-10 text-base [&_svg]:size-5',
      xl: 'size-14 text-lg [&_svg]:size-8'
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
const wave = (y, height) =>
  `M2 ${y} C6 ${y - 3} 8 ${y + 3} 12 ${y} S18 ${y - 3} 22 ${y} V${y + height} C18 ${y + height + 3} 16 ${y + height - 3} 12 ${y + height} S6 ${y + height + 3} 2 ${y + height}Z`;
const ruled = [5, 7.33, 9.67, 12, 14.33, 16.67, 19];

const AGENT_MOTIFS = {
  trencadis: {
    label: 'Trencadís mosaic',
    draw: () => shards.map((shard) => <path key={shard.d} d={shard.d} opacity={shard.opacity} />),
    cracks: true
  },
  catenary: {
    label: 'Catenary arches',
    draw: () => (
      <g fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round'>
        <path d='M3 22 C3 10 7 2.5 12 2.5 C17 2.5 21 10 21 22' />
        <path d='M7.5 22 C7.5 13.5 9.5 8.5 12 8.5 C14.5 8.5 16.5 13.5 16.5 22' opacity='.7' />
        <path d='M11 22 C11 17.5 11.4 14.5 12 14.5 C12.6 14.5 13 17.5 13 22' opacity='.45' />
      </g>
    )
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
    cutouts: ['M11.4 9h1.2v2.2h-1.2Z', 'M11.4 13h1.2v2.2h-1.2Z', 'M11.4 17h1.2v2.2h-1.2Z']
  },
  scales: {
    label: 'Roof scales',
    // Rows of overlapping fish scales, lightest at the ridge.
    draw: () => (
      <g fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'>
        {[[3.5, [3, 9, 15, 21], 0.4], [7, [6, 12, 18], 0.55], [10.5, [3, 9, 15, 21], 0.7], [14, [6, 12, 18], 0.85], [17.5, [3, 9, 15, 21], 1]].flatMap(([y, xs, opacity]) =>
          xs.map((x) => <path key={`${x}-${y}`} d={`M${x - 3} ${y} A3 3 0 0 0 ${x + 3} ${y}`} opacity={opacity} />)
        )}
      </g>
    ),
    clip: true
  },
  hyperboloid: {
    label: 'Hyperboloid',
    draw: () => (
      <g fill='none' stroke='currentColor' strokeWidth='1.1' strokeLinecap='round'>
        {ruled.map((x, index) => <line key={`a${x}`} x1={x} y1='3' x2={ruled[(index + 3) % ruled.length]} y2='21' />)}
        {ruled.map((x, index) => <line key={`b${x}`} x1={x} y1='3' x2={ruled[(index + 4) % ruled.length]} y2='21' opacity='.55' />)}
        <ellipse cx='12' cy='3' rx='7' ry='1.2' strokeWidth='1.6' />
        <ellipse cx='12' cy='21' rx='7' ry='1.2' strokeWidth='1.6' />
      </g>
    )
  },
  cross: {
    label: 'Four-armed cross',
    draw: () => (
      <>
        <path d='M9.8 4h4.4v16H9.8Z' />
        <path d='M4 9.8h16v4.4H4Z' opacity='.7' />
        {[[12, 3], [21, 12], [12, 21], [3, 12]].map(([x, y], index) => <circle key={`${x}-${y}`} cx={x} cy={y} r='2.4' opacity={index % 2 ? 0.7 : 1} />)}
        <circle cx='12' cy='12' r='2.9' />
      </>
    )
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
  facade: {
    label: 'Undulating facade',
    draw: () => [[3.5, 0.45], [9.5, 0.7], [15.5, 1]].map(([y, opacity]) => <path key={y} d={wave(y, 3.4)} opacity={opacity} />)
  }
};

// Glazed-tile hues from the palette; each pairs a tinted tile with a deeper glaze in both themes.
const AGENT_HUES = {
  teal: 'bg-teal-50 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
  green: 'bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
  red: 'bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  yellow: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
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
              {cutouts?.map((d) => <path key={d} d={d} fill='black' />)}
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
 * The assistant's mark. By default it draws a Gaudí-inspired motif (trencadís mosaic, catenary arches,
 * spires, roof scales, a hyperboloid, the four-armed cross, ironwork or a rippling facade) in a glazed
 * hue chosen from `seed` (or `name`), so every agent keeps a stable, recognisable mark. Pass `motif` or
 * `hue` to pin either one, or `icon`, `image` or `monogram` to show those on a `tone` tile instead.
 * `state` adds a small ActivityIndicator badge at the corner.
 *
 * The mark is named (`role='img'`) unless `decorative` is set, for example when a visible name sits
 * beside it.
 */
function AgentMark({ name = 'Gaudi', seed, motif = 'auto', hue = 'auto', icon, image, monogram = false, size = 'md', tone = 'accent', state, decorative = false, labels, className, ...props }) {
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
      className={cn(agentMarkVariants({ size, tone }), resolved && ['border-0 [&>svg]:size-[72%]!', AGENT_HUES[resolved.hue]], className)}
      {...props}
    >
      {content}
      {state && state !== 'idle' ? (
        <ActivityIndicator
          state={state}
          variant='badge'
          labels={labels}
          decorative={decorative}
          className='absolute -end-1 -bottom-1'
        />
      ) : null}
    </span>
  );
}

const agentMotifs = Object.fromEntries(Object.entries(AGENT_MOTIFS).map(([key, value]) => [key, value.label]));

export { AgentMark, agentMarkVariants, agentMotifs, hueNames as agentHues, resolveAgentMark };
