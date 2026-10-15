import { binValues, extent, isChartNumber, niceTicks } from '../ChartFrame/chartScale.js';

/**
 * Bins on round edges: the domain snaps to nice ticks, so bins read as 0–50, 50–100…
 *
 * @param {number[]} values
 * @param {{ bins?: number, domain?: [number, number] }} [options]
 */
export function histogramBins(values, { bins, domain } = {}) {
  const range = domain || extent(values);
  if (!range) return [];
  const ticks = niceTicks(range[0], range[1], bins || Math.ceil(Math.log2(values.filter(isChartNumber).length) + 1));

  return binValues(values, { 'bins': ticks.length - 1, 'domain': [ ticks[0], ticks.at(-1) ] });
}
