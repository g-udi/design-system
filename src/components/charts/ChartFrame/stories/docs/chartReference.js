import { p, className } from '../../../../../docs/components/referenceProps.js';

// Props every Charts owner accepts through its ChartFrame.
export const chartFrameProps = [
  p('title / description', 'ReactNode', '—', 'Figure caption above the plot.'),
  p('ariaLabel', 'string', 'title or Chart', 'Accessible name of the plot, the single keyboard stop.'),
  p('height', 'number', 'type-specific', 'Plot height in pixels.'),
  p('state', 'loading | error | empty | invalid', 'from data', 'Force a state; empty and invalid are otherwise detected from the data.'),
  p('labels', 'Partial<DEFAULT_CHART_LABELS>', 'English copy', 'Copy for states, the keyboard hint, the data table and its toggle.'),
  p('locale / formatValue', 'string / Intl.NumberFormatOptions | (value) => string', 'runtime / number', 'Number format for axes, tooltips, the readout and the table.'),
  p('showData', 'hidden | toggle | visible', 'hidden', 'Data table visibility; hidden keeps it available to assistive technology.'),
  p('onActivate / onActiveChange', '(point, index) => void / (index | null) => void', '—', 'Click, Enter or Space on a point; the active point changed.'),
  p('toolbar / framed', 'ReactNode / boolean', '— / true', 'Controls beside the caption; the figure border and padding.'),
  className
];
export const chartA11y = 'The plot is one tab stop named by ariaLabel. The arrow keys walk the points, Home and End jump to the ends, Enter or Space activates and Escape clears; the active point is drawn and read out politely. Every value is mirrored in a data table, and the SVG is hidden from assistive technology.';
export const series = p('series', 'Array<{ key, label?, dashed? }>', 'from yKey', 'Value fields drawn as series, in order; a dashed series reads as a projection or target.');
export const xy = p('xKey / yKey', 'string', 'label / value', 'Category field and the single value field when series is omitted.');
export const refs = p('references / annotations', 'Array<{ x?, y?, label, tone? }>', '—', 'Labelled guide lines and point notes.');
export const colors = p('colors', 'string[]', 'categorical palette', 'Override the series colours with chart tokens.');
