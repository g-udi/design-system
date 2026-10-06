import './AppShellPlaceholder.css';
import { cn } from '@gaudi/design-system/utilities/cn';
import { SkeletonRoot as Skeleton } from '@gaudi/design-system/core/Skeleton';

// Fixed shapes keep server and client markup identical (no random widths).
const BARS = [42, 64, 52, 78, 58, 86, 70, 94, 62, 80, 56, 72];
const ROWS = [72, 58, 84, 46, 66, 54];
// A conversation: user bubbles (widths in %) and assistant replies (line widths in %), in thread order.
const TURNS = [
  { user: [30] },
  { reply: [100, 92, 67] },
  { user: [43, 21] },
  { reply: [100, 100, 83, 50] },
  { user: [26] },
  { reply: [100, 83, 60] },
  { user: [38] }
];

/** A skeleton line; static unless `animated`, and never animated under reduced motion. */
function Line({ animated, className, style }) {
  return (
    <Skeleton
      data-slot='app-shell-placeholder-line'
      className={cn('max-w-full', animated ? 'motion-reduce:animate-none' : 'animate-none', className)}
      style={style}
    />
  );
}

/** A chat thread of user bubbles and assistant replies, optionally above a composer. */
function Conversation({ animated, composer = false }) {
  return (
    <>
      <div className='ds-app-shell-placeholder-thread'>
        {TURNS.map((turn, index) =>
          turn.user ? (
            <div key={index} className='flex flex-col items-end gap-2'>
              {turn.user.map((width, line) => (
                <Line key={line} animated={animated} className='h-8' style={{ width: `${width}%` }} />
              ))}
            </div>
          ) : (
            <div key={index} className='flex items-start gap-3'>
              <Line animated={animated} className='size-8 shrink-0 rounded-full' />
              <div className='grid min-w-0 flex-1 gap-3 pt-1.5'>
                {turn.reply.map((width, line) => (
                  <Line key={line} animated={animated} className='h-2.5' style={{ width: `${width}%` }} />
                ))}
              </div>
            </div>
          )
        )}
      </div>
      {composer ? (
        <div className='ds-app-shell-placeholder-composer'>
          <Line animated={animated} className='h-28 w-full rounded-(--ds-radius-card)' />
          <Line animated={animated} className='mx-auto h-2.5 w-1/3' />
        </div>
      ) : null}
    </>
  );
}

const shapes = {
  stat: ({ animated }) => (
    <>
      <Line animated={animated} className='h-3 w-24' />
      <Line animated={animated} className='mt-auto h-7 w-28' />
      <Line animated={animated} className='h-2.5 w-36 max-w-full' />
    </>
  ),
  chart: ({ animated }) => (
    <>
      <div className='flex items-center gap-3'>
        <Line animated={animated} className='h-3.5 w-32' />
        <Line animated={animated} className='ms-auto h-6 w-20' />
      </div>
      <Line animated={animated} className='h-2.5 w-48 max-w-full' />
      <div className='ds-app-shell-placeholder-bars'>
        {BARS.map((height, index) => (
          <Line key={index} animated={animated} className='min-w-0 flex-1' style={{ height: `${height}%` }} />
        ))}
      </div>
    </>
  ),
  // A chart above a short table: the large card of a dashboard.
  report: ({ animated }) => (
    <>
      <div className='flex items-center gap-3'>
        <Line animated={animated} className='h-3.5 w-32' />
        <Line animated={animated} className='ms-auto h-6 w-20' />
      </div>
      <Line animated={animated} className='h-2.5 w-48' />
      <div className='ds-app-shell-placeholder-bars' data-fixed='true'>
        {BARS.map((height, index) => (
          <Line key={index} animated={animated} className='min-w-0 flex-1' style={{ height: `${height}%` }} />
        ))}
      </div>
      <div className='grid gap-3 pt-2'>
        {ROWS.slice(0, 4).map((width, index) => (
          <div key={index} className='flex items-center gap-3'>
            <Line animated={animated} className='size-5 shrink-0' />
            <Line animated={animated} className='h-2.5 min-w-0 shrink' style={{ width: `${width}%` }} />
            <Line animated={animated} className='ms-auto h-2.5 w-10 shrink-0' />
          </div>
        ))}
      </div>
    </>
  ),
  table: ({ animated }) => (
    <>
      <div className='flex items-center gap-3'>
        <Line animated={animated} className='h-3.5 w-28' />
        <Line animated={animated} className='ms-auto h-6 w-16' />
      </div>
      <div className='grid gap-3'>
        {ROWS.map((width, index) => (
          <div key={index} className='flex items-center gap-3'>
            <Line animated={animated} className='size-6 shrink-0' />
            <Line animated={animated} className='h-2.5 min-w-0 shrink' style={{ width: `${width}%` }} />
            <Line animated={animated} className='ms-auto h-2.5 w-10 shrink-0' />
          </div>
        ))}
      </div>
    </>
  ),
  // A chat thread above a composer: the body of a conversation that has not loaded.
  conversation: ({ animated }) => <Conversation animated={animated} composer />,
  // The thread alone, for shells that render a real composer under it.
  thread: ({ animated }) => <Conversation animated={animated} />,
  // Two heading lines above one filled block that takes the rest of the card.
  block: ({ animated }) => (
    <>
      <Line animated={animated} className='h-3.5 w-full' />
      <Line animated={animated} className='h-3.5 w-full' />
      <Line animated={animated} className='mt-3 min-h-8 w-full flex-1' />
    </>
  ),
  // A metric tile: an icon square and a label above a value and a trend.
  tile: ({ animated }) => (
    <>
      <div className='flex items-center gap-2'>
        <Line animated={animated} className='size-7 shrink-0' />
        <Line animated={animated} className='h-2.5 w-24 min-w-0 shrink' />
      </div>
      <div className='mt-auto flex items-end gap-3'>
        <Line animated={animated} className='h-6 w-20 min-w-0 shrink' />
        <Line animated={animated} className='ms-auto h-2.5 w-16 min-w-0 shrink' />
      </div>
    </>
  ),
  // A titled list with two toolbar buttons, a filter bar and tall rows.
  rows: ({ animated }) => (
    <>
      <div className='flex items-center gap-2'>
        <Line animated={animated} className='h-3.5 w-32 min-w-0 shrink' />
        <Line animated={animated} className='ms-auto h-7 w-24 min-w-0 shrink' />
        <Line animated={animated} className='h-7 w-16 min-w-0 shrink' />
      </div>
      <Line animated={animated} className='h-7 w-72 max-w-full' />
      {ROWS.slice(0, 4).map((_, index) => (
        <Line key={index} animated={animated} className='min-h-16 w-full flex-1' />
      ))}
    </>
  ),
  // An empty card face over a muted footer strip.
  blank: () => <span data-slot='app-shell-placeholder-face' className='ds-app-shell-placeholder-face' />,
  text: ({ animated }) => (
    <>
      <Line animated={animated} className='h-3.5 w-40 max-w-full' />
      {ROWS.slice(0, 4).map((width, index) => (
        <Line key={index} animated={animated} className='h-2.5' style={{ width: `${width + 16}%` }} />
      ))}
    </>
  )
};

/**
 * One placeholder card filled with Gaudi Skeleton shapes: `kind` is `stat`, `chart`, `report` (a chart
 * above a short table), `table`, `text`, `conversation` (a chat thread above a composer), `thread` (the thread alone),
 * `tile` (an icon, a value and a trend), `rows` (a titled list of tall rows), `block` (two lines above a filled block) or
 * `blank` (an empty face over a muted strip), `variant` is `dashed` (default), `solid` or `bare` (no card), and `size` is
 * `sm` (stat height) or `lg` (fills the rest
 * of the panel). Skeletons stay static unless `animated`, and reduced motion always stops the pulse.
 */
function AppShellPlaceholder({ kind = 'text', variant = 'dashed', size = 'sm', animated = false, className, ...props }) {
  const Shape = shapes[kind] || shapes.text;
  return (
    <div
      data-slot='app-shell-placeholder'
      data-kind={kind}
      data-variant={variant}
      data-size={size}
      className={cn('ds-app-shell-placeholder', className)}
      {...props}
    >
      <Shape animated={animated} />
    </div>
  );
}

const presets = {
  // The default body: three small cards above one large one.
  dashboard: [
    ['stat', 'sm'], ['stat', 'sm'], ['stat', 'sm'], ['report', 'lg', 'wide']
  ],
  // Six cards in a 3 × 2 grid above one wide block.
  grid: [
    ['stat', 'sm'], ['stat', 'sm'], ['stat', 'sm'], ['text', 'sm'], ['text', 'sm'], ['text', 'sm'], ['table', 'lg', 'wide']
  ],
  // A wide chart beside a narrow list, then a table.
  split: [
    ['chart', 'md', 'two'], ['text', 'md'], ['table', 'lg', 'wide']
  ],
  // One large table card.
  list: [['table', 'lg', 'wide']],
  // A chat thread and its composer, without a card (use with `variant='bare'`).
  chat: [['conversation', 'lg', 'wide']],
  // The same thread without the composer, above a real one.
  thread: [['thread', 'lg', 'wide']],
  // Three metric tiles above one tall list.
  stack: [['tile', 'sm'], ['tile', 'sm'], ['tile', 'sm'], ['rows', 'lg', 'wide']],
  // A 3 × 3 grid of block cards: a short first row above two taller ones.
  tiles: [
    ['block', 'sm'], ['block', 'sm'], ['block', 'sm'],
    ['block', 'md'], ['block', 'md'], ['block', 'md'],
    ['block', 'md'], ['block', 'md'], ['block', 'md']
  ],
  // Like tiles, with a first row of blank cards over a muted strip.
  board: [
    ['blank', 'sm'], ['blank', 'sm'], ['blank', 'sm'],
    ['block', 'md'], ['block', 'md'], ['block', 'md'],
    ['block', 'md'], ['block', 'md'], ['block', 'md']
  ],
  // Four short cards above a 2 × 2 grid of block cards.
  quad: [
    ['block', 'sm'], ['block', 'sm'], ['block', 'sm'], ['block', 'sm'],
    ['block', 'md', 'half'], ['block', 'md', 'half'], ['block', 'md', 'half'], ['block', 'md', 'half']
  ]
};

/**
 * The shared placeholder body of the app-shell examples: preset layouts of skeleton cards
 * (`dashboard`, `grid`, `split`, `list`, `chat`, `thread`, `stack` (three tiles above a tall list), `tiles` (3 × 3 blocks),
 * `board` (tiles under blank cards) or `quad` (four short cards above a 2 × 2 grid)) that stack on narrow panels and spread into three columns
 * once the panel is wide enough. It is decorative, so it is hidden from assistive technology.
 */
function AppShellPlaceholderGrid({ preset = 'dashboard', variant = 'dashed', animated = false, className, ...props }) {
  const cards = presets[preset] || presets.dashboard;
  return (
    <div
      data-slot='app-shell-placeholder-grid'
      data-preset={preset}
      aria-hidden='true'
      className={cn('ds-app-shell-placeholder-grid', className)}
      {...props}
    >
      {cards.map(([kind, size, span], index) => (
        <AppShellPlaceholder
          key={index}
          kind={kind}
          size={size}
          variant={variant}
          animated={animated}
          data-span={span}
        />
      ))}
    </div>
  );
}

export { AppShellPlaceholder, AppShellPlaceholderGrid };
