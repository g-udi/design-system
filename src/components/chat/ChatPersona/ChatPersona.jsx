'use client';
import { cn } from '../../../utilities/cn/index.js';
import { useLatestRef } from '../../../hooks/shared/use-latest-ref.js';
import { ActivityOrb } from './orbs/activity-orb.jsx';
import { BarsOrb } from './orbs/bars-orb.jsx';
import { CircleOrb } from './orbs/circle-orb.jsx';
import { FieldOrb } from './orbs/field-orb.jsx';
import { IridescentFlow } from './orbs/iridescent-flow.jsx';
import { MercuryOrb } from './orbs/mercury-orb.jsx';
import { WaveformRing } from './orbs/waveform-ring.jsx';
import { personaLabels as DEFAULT_LABELS, personaSizes, personaStates, personaVariants } from './personaModel.js';

const renderers = { iridescent: IridescentFlow, mercury: MercuryOrb, waveform: WaveformRing, activity: ActivityOrb, circle: CircleOrb, bars: BarsOrb, cloud: FieldOrb, radial: FieldOrb };

// ChatPersona states onto the orb renderers' states: asleep is the dimmed, still "disabled" look.
const orbState = (state) => (state === 'asleep' ? 'disabled' : state);

/**
 * The assistant's presence in a voice conversation: an orb that rests, listens, thinks, speaks or
 * sleeps. `variant` picks the renderer (iridescent WebGL film, mercury CSS metal, waveform canvas
 * ring, activity dot sphere, circle disc, bars, cloud WebGL sky or radial WebGL pinwheel); `level` (0..1) or `levelRef` feeds a live audio level, and
 * `waveformRef` feeds time-domain samples to the waveform ring. Without a level, each state has its
 * own resting rhythm. Animation stops off screen, in hidden tabs, when asleep and for readers who
 * reduce motion; the still frame still shows the state.
 */
function ChatPersona({
  state = 'idle',
  variant = 'iridescent',
  size = 'md',
  level,
  levelRef,
  waveformRef,
  speed = 1,
  active,
  name = 'Assistant',
  labels: labelOverrides,
  showLabel = false,
  announce = true,
  decorative = false,
  colorFrom,
  colorTo,
  className,
  ...props
}) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const current = personaStates.includes(state) ? state : 'idle';
  const kind = personaVariants.includes(variant) ? variant : 'iridescent';
  const pixels = typeof size === 'number' ? size : personaSizes[size] ?? personaSizes.md;
  const ownLevel = useLatestRef(typeof level === 'number' ? level : null);
  const feed = levelRef ?? (typeof level === 'number' ? ownLevel : undefined);
  const Renderer = renderers[kind];
  const label = labels[current];
  return (
    <div
      data-slot='persona'
      data-state={current}
      data-variant={kind}
      className={cn('ds-part-persona', className)}
      {...props}
    >
      <div
        className='ds-part-persona-orb'
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : `${name}: ${label}`}
        aria-hidden={decorative || undefined}
      >
        <Renderer
          state={orbState(current)}
          active={active ?? current !== 'asleep'}
          size={pixels}
          speed={speed}
          colorFrom={colorFrom}
          colorTo={colorTo}
          levelRef={feed}
          {...(kind === 'waveform' ? { waveformRef } : {})}
          {...(renderers[kind] === FieldOrb ? { field: kind } : {})}
        />
      </div>
      {showLabel ? <span aria-hidden='true' className='ds-part-persona-label'>{label}</span> : null}
      {announce && !decorative ? <span role='status' aria-live='polite' className='sr-only'>{`${name} ${label.toLowerCase()}`}</span> : null}
    </div>
  );
}

export { ChatPersona };
