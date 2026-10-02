'use client';

import { makeSeriesChart } from '../../ChartFrame/parts/series.jsx';

/** Lines per series over categories. A series with `dashed: true` reads as a projection; `curve` picks the interpolation and `showDots` the point markers. */
export const LineChart = makeSeriesChart('line');
