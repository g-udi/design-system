import { chartScales } from '../ChartFrame/chartPalette.js';
import { isChartNumber } from '../ChartFrame/chartScale.js';

/**
 * The ramp step and ink for a value: sequential maps min…max onto steps 1–5 (0 is "no data");
 * diverging centres on `midpoint`, with the outer steps for the extremes.
 */
export function heatmapStep(value, { domain, midpoint = 0, scale }) {
  if (!isChartNumber(value)) return { 'fill': chartScales.heatmap[0], 'ink': chartScales.heatmapInk[0] };
  const [ min, max ] = domain;
  if (scale === 'diverging') {
    const reach = Math.max(Math.abs(min - midpoint), Math.abs(max - midpoint)) || 1;
    const ratio = (value - midpoint) / reach;
    const step = ratio <= -0.6 ? 0 : ratio <= -0.2 ? 1 : ratio < 0.2 ? 2 : ratio < 0.6 ? 3 : 4;

    return { 'fill': chartScales.diverging[step], 'ink': step === 0 || step === 4 ? 'var(--ds-color-chart-div-ink)' : 'var(--ds-color-text)' };
  }
  const step = max === min ? 3 : 1 + Math.min(4, Math.floor(((value - min) / (max - min)) * 5));

  return { 'fill': chartScales.heatmap[step], 'ink': chartScales.heatmapInk[step] };
}
