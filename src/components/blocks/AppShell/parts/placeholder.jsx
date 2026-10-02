import { cn } from '../../../../utilities/cn/index.js';
import { Skeleton } from '../../../core/Skeleton/parts/skeleton.jsx';

// Fixed shapes keep server and client markup identical (no random widths).
const BARS = [42, 64, 52, 78, 58, 86, 70, 94, 62, 80, 56, 72];
const ROWS = [72, 58, 84, 46, 66, 54];

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
            <Line animated={animated} className='h-2.5' style={{ width: `${width}%` }} />
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
            <Line animated={animated} className='h-2.5' style={{ width: `${width}%` }} />
            <Line animated={animated} className='ms-auto h-2.5 w-10 shrink-0' />
          </div>
        ))}
      </div>
    </>
  ),
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
 * above a short table), `table` or `text`,
 * `variant` is `dashed` (default) or `solid`, and `size` is `sm` (stat height) or `lg` (fills the rest
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
  // reui's default body: three small cards above one large one.
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
  list: [['table', 'lg', 'wide']]
};

/**
 * The shared placeholder body of the app-shell examples: preset layouts of skeleton cards
 * (`dashboard`, `grid`, `split` or `list`) that stack on narrow panels and spread into three columns
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
