/**
 * Prop plumbing shared by the chart types: which props belong to the frame, and the status a
 * chart's data puts it in.
 */
import { dataStatus } from './scale.js';
import { isChartRuntimeReady } from './runtime.js';

const FRAME_KEYS = [
  'ariaLabel', 'className', 'columns', 'description', 'formatValue', 'framed', 'height', 'labels',
  'locale', 'onActivate', 'onActiveChange', 'plotClassName', 'showData', 'title', 'toolbar'
];

/**
 * Split chart props into the frame's and the chart's own.
 *
 * @param {object} props
 * @returns {[object, object]} `[frameProps, chartProps]`
 */
export function splitFrameProps(props) {
  const frame = {};
  const rest = {};
  for (const [ key, value ] of Object.entries(props)) (FRAME_KEYS.includes(key) ? frame : rest)[key] = value;

  return [ frame, rest ];
}

/**
 * The frame status for a chart.
 *
 * @param {{ state?: 'loading'|'error', data: unknown, keys: string[], usesRecharts?: boolean, status?: string }} options
 *   `state` forces loading or error; otherwise the data decides empty, invalid or ready.
 */
export function chartStatus({ data, keys, state, status, usesRecharts = true }) {
  if (state === 'loading' || state === 'error' || state === 'empty' || state === 'invalid') return state;
  if (usesRecharts && !isChartRuntimeReady) return 'unavailable';

  return status || dataStatus(data, keys);
}

/** Records from plain numbers: `[3, 5]` becomes `[{ label: '1', value: 3 }, …]`. */
export const normalizeRecords = (data, labelKey, valueKey, numericLabel = false) => (Array.isArray(data) ? data : []).map((item, index) => (
  typeof item === 'number' ? { [labelKey]: numericLabel ? index + 1 : String(index + 1), [valueKey]: item } : item
));
