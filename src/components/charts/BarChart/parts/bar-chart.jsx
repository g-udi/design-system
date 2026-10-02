'use client';

import { makeSeriesChart } from '../../ChartFrame/parts/series.jsx';

/** Bars per category. `series` draws grouped bars, `stacked` stacks them, and `layout='horizontal'` lays the bars along the value axis for long category names. */
export const BarChart = makeSeriesChart('bar');
