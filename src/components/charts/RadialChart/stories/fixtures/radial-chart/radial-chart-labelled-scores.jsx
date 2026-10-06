'use client';
import { useId } from 'react';
import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';
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
  ChartTooltipContent
} from '@gaudi/design-system/charts/ChartFrame';
const chartData = [
  { name: 'mobile', score: 58 },
  { name: 'desktop', score: 76 },
  { name: 'api', score: 92 }
];
// Bars use gradient fills, so legend swatches read the solid series colour instead.
const swatch = (key) => {
  const Swatch = () => <span className='size-2 shrink-0 rounded-sm' style={{ backgroundColor: `var(--color-${key})` }} />;
  return Swatch;
};
const chartConfig = {
  score: { label: 'Score' },
  mobile: { icon: swatch('mobile'), label: 'Mobile', color: 'var(--chart-4)' },
  desktop: { icon: swatch('desktop'), label: 'Desktop', color: 'var(--chart-2)' },
  api: { icon: swatch('api'), label: 'API', color: 'var(--chart-1)' }
};
export function Pattern() {
  const uid = useId().replace(/:/g, '');
  return (
    <Card className='mx-auto w-full max-w-xs'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Lighthouse scores</CardTitle>
        <CardDescription>Performance audit by platform</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[300px]'
        >
          <RadialBarChart
            data={chartData.map((item) => ({ ...item, fill: `url(#${uid}-${item.name})` }))}
            innerRadius={35}
            outerRadius={110}
            barSize={22}
          >
            <defs>
              {['mobile', 'desktop', 'api'].map((key) => (
                <linearGradient
                  key={key}
                  id={`${uid}-${key}`}
                  x1='0'
                  y1='0'
                  x2='1'
                  y2='0'
                >
                  <stop
                    offset='0%'
                    stopColor={`var(--color-${key})`}
                    stopOpacity={0.5}
                  />
                  <stop
                    offset='100%'
                    stopColor={`var(--color-${key})`}
                    stopOpacity={1}
                  />
                </linearGradient>
              ))}
              <filter
                id={`${uid}-glow`}
                x='-15%'
                y='-15%'
                width='130%'
                height='130%'
              >
                <feGaussianBlur stdDeviation='3' result='blur' />
                <feComposite in='SourceGraphic' in2='blur' operator='over' />
              </filter>
            </defs>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className='min-w-40 gap-2.5'
                  nameKey='name'
                  formatter={(value, name) => (
                    <div className='flex w-full items-center justify-between gap-2'>
                      <div className='flex items-center gap-1.5'>
                        <div
                          className='size-2.5 shrink-0 rounded-xs bg-(--color-bg)'
                          style={{
                            '--color-bg': `var(--color-${name})`
                          }}
                        />
                        <span className='text-text-muted'>
                          {chartConfig[name]?.label || name}
                        </span>
                      </div>
                      <span className='text-text font-semibold tabular-nums'>
                        {Number(value)}/100
                      </span>
                    </div>
                  )}
                />
              }
            />
            <PolarAngleAxis
              type='number'
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              dataKey='score'
              background
              cornerRadius={10}
              filter={`url(#${uid}-glow)`}
              label={{
                position: 'insideStart',
                fill: 'var(--ds-color-text-inverse)',
                fontSize: 11,
                fontWeight: 600
              }}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey='name' />}
              className='-translate-y-2'
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
