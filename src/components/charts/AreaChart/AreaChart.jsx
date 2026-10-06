'use client';

import { makeSeriesChart } from '../ChartFrame/ChartSeries.jsx';

/** Filled areas per series over categories. `stacked` stacks them into a total; each area fades from its series colour. */
export const AreaChart = makeSeriesChart('area');
