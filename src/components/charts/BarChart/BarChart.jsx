'use client';

import { makeSeriesChart } from '../ChartFrame/ChartSeries.jsx';

/** Bars per category. `series` draws grouped bars, `stacked` stacks them, and `layout='horizontal'` lays the bars along the value axis for long category names. */
export const BarChart = makeSeriesChart('bar');
