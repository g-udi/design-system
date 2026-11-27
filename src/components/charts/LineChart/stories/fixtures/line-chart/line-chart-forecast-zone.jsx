'use client';
import { useId } from 'react';
import { Area, ComposedChart, Line } from 'recharts';
import {
  CardRoot as Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartGrid,
  ChartXAxis,
  createRowsTooltip
} from '@gaudi/design-system/charts/ChartFrame';
const chartData = [
  { month: 'January', forecast: 2600, forecastArea: 2600 },
  { month: 'February', forecast: 4200, forecastArea: 4200 },
  { month: 'March', forecast: 2400, forecastArea: 2400 },
  { month: 'April', forecast: 5e3, forecastArea: 5e3 },
  { month: 'May', forecast: 2800, forecastArea: 2800 },
  { month: 'June', forecast: 5800, forecastArea: 5800 },
  { month: 'July', forecast: 3200, forecastArea: 3200 },
  { month: 'August', forecast: 6200, forecastArea: 6200 },
  { month: 'September', forecast: 3800, forecastArea: 3800 }
];
const chartConfig = {
  forecast: { label: 'Forecast', color: 'var(--chart-4)' },
  forecastArea: { label: 'Forecast', color: 'var(--chart-4)' }
};
const ForecastTooltip = createRowsTooltip(
  ({ payload }) => payload.filter((item) => item.dataKey === 'forecast').map(({ dataKey, value }) => ({
    label: chartConfig[dataKey].label,
    value: value == null ? '—' : `$${Number(value).toLocaleString()}`,
    color: `var(--color-${dataKey})`
  })),
  { title: (month) => `${month} 2024` }
);

export function Pattern() {
  const uid = useId().replace(/:/g, '');
  return (
    <Card className='mx-auto w-full max-w-md'>
      <CardHeader>
        <CardTitle>Sales Forecast</CardTitle>
        <CardDescription>
          Projected sales performance with trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ComposedChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <pattern
                id={`${uid}-forecast-stripe`}
                patternUnits='userSpaceOnUse'
                width='6'
                height='6'
              >
                <rect
                  width='6'
                  height='6'
                  fill='var(--color-forecast)'
                  opacity='0.04'
                />
                <path
                  d='M0,6 L6,0'
                  stroke='var(--color-forecast)'
                  strokeWidth='0.8'
                  opacity='0.15'
                />
              </pattern>
            </defs>
            <ChartGrid />
            <ChartXAxis dataKey='month' tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
            <ChartTooltip content={<ForecastTooltip />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey='forecastArea'
              type='natural'
              fill={`url(#${uid}-forecast-stripe)`}
              stroke='none'
              connectNulls
              legendType='none'
              tooltipType='none'
            />
            <Line
              dataKey='forecast'
              type='natural'
              stroke='var(--color-forecast)'
              strokeWidth={2.5}
              dot={false}
              connectNulls
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
