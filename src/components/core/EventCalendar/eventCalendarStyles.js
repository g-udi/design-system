/*
 * Event colours, drag-ghost and draft classes, and time-grid geometry shared by the
 * EventCalendar views (and Gantt's palette). A plain module, so server components read
 * the values rather than client references.
 */

export const EVENT_CALENDAR_COLORS = [
  { name: 'Blue', value: 'var(--color-blue-500)' },
  { name: 'Emerald', value: 'var(--color-emerald-500)' },
  { name: 'Violet', value: 'var(--color-violet-500)' },
  { name: 'Rose', value: 'var(--color-rose-500)' },
  { name: 'Amber', value: 'var(--color-amber-500)' },
  { name: 'Cyan', value: 'var(--color-cyan-500)' },
  { name: 'Orange', value: 'var(--color-orange-500)' },
  { name: 'Pink', value: 'var(--color-pink-500)' },
  { name: 'Teal', value: 'var(--color-teal-500)' },
  { name: 'Indigo', value: 'var(--color-indigo-500)' }
];
export const EVENT_CALENDAR_GHOST = {
  move: 'rounded-sm border border-dashed border-(--ec-event-color)/50 bg-(--ec-event-color)/8',
  resize:
    'rounded-sm border border-dashed border-(--ec-event-color)/70 overflow-hidden',
  invalid: 'border-ui-destructive/70 bg-ui-destructive/10',
  invalidResize: 'border-ui-destructive/70',
  /** Applied to the clone inside an invalid resize ghost. */
  invalidContent: 'opacity-60'
};
export const EVENT_CALENDAR_FADE_TRUNCATE =
  'w-full truncate @max-[10rem]:text-clip @max-[10rem]:[mask-image:linear-gradient(to_right,#000_calc(100%-0.75rem),transparent)] @max-[10rem]:rtl:[mask-image:linear-gradient(to_left,#000_calc(100%-0.75rem),transparent)]';
export const EVENT_CALENDAR_SLOT_DRAFT = {
  box: 'rounded-sm border border-dashed border-ui-primary/40 bg-ui-primary/5',
  segment: 'border-y border-dashed border-ui-primary/40',
  segmentStart: 'rounded-s-sm border-s',
  segmentEnd: 'rounded-e-sm border-e',
  /**
   * The wash for segmented views, on the CELL not the dashed overlay: the
   * overlay stacks above the chips, so tinting it would wash them instead.
   */
  surface: 'bg-ui-primary/5',
  /**
   * The range readout. `leading-none` is load-bearing: the shortest timed
   * draft is one snap interval tall (16px at the default 15-minute snap and
   * 4rem hour height), and looser leading renders ~18px, clipped by the
   * draft's own overflow-hidden.
   */
  label:
    'text-ui-primary truncate px-1 py-0.5 text-xs leading-none font-medium'
};

export const EVENT_TRACK_WIDTH = '(100% - var(--ec-event-gutter, 0.75rem))';
export function minuteBlockStyle(startMin, endMin, boundsStartMin) {
  const top = (startMin - boundsStartMin) / 60;
  const height = Math.max((endMin - startMin) / 60, 0.25);
  return {
    top: `calc(var(--ec-hour-height) * ${top})`,
    height: `calc(var(--ec-hour-height) * ${height})`
  };
}
