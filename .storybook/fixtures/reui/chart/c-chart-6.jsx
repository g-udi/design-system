// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { Bar, BarChart, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '../../../../src/components/mdx/Chart/parts/chart.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const chartData = [
  { month: 'Jan', desktop: 340 },
  { month: 'Feb', desktop: 600 },
  { month: 'Mar', desktop: 510 },
  { month: 'Apr', desktop: 620 },
  { month: 'May', desktop: 450 },
  { month: 'Jun', desktop: 780 },
  { month: 'Jul', desktop: 390 },
  { month: 'Aug', desktop: 920 },
  { month: 'Sep', desktop: 640 },
  { month: 'Oct', desktop: 530 },
  { month: 'Nov', desktop: 800 },
  { month: 'Dec', desktop: 270 }
];
const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)'
  }
};
const True3DBar = (props) => {
  const { fill: _fill, x, y, width, height } = props;
  const barX = x;
  const barY = y;
  const barWidth = width;
  const barHeight = height;
  const depth = Math.min(barWidth * 0.3, 15);
  const _angle = 30;
  return (
    <g>
      {/* Back face */}
      <rect
        x={barX + depth}
        y={barY - depth}
        width={barWidth}
        height={barHeight}
        fill='url(#bar-gradient-back)'
        rx='3'
      />

      {/* Right side face */}
      <polygon
        points={`${barX + barWidth + 3},${barY - 3} ${barX + barWidth + depth - 3},${barY - depth + 3} ${barX + barWidth + depth - 3},${barY + barHeight - depth - 3} ${barX + barWidth + 3},${barY + barHeight - 3}`}
        fill='url(#bar-gradient-side)'
      />

      {/* Top face */}
      <polygon
        points={`${barX + 3},${barY - 3} ${barX + barWidth - 3},${barY - 3} ${barX + barWidth + depth - 3},${barY - depth + 3} ${barX + depth + 3},${barY - depth + 3}`}
        fill='url(#bar-gradient-top)'
      />

      {/* Front face */}
      <rect
        x={barX}
        y={barY}
        width={barWidth}
        height={barHeight}
        fill='url(#bar-gradient-front)'
        rx='3'
      />
    </g>
  );
};
export function Chart3D() {
  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>
          Regional Performance
          <Badge variant='success-light' className='ml-2'>
            <RegistryIcon lucide='TrendingUpIcon' aria-hidden='true' />
            +15.7%
          </Badge>
        </CardTitle>
        <CardDescription>Global sales distribution by region</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 40,
              right: 40,
              bottom: 20,
              left: 20
            }}
            barCategoryGap='20%'
          >
            <defs>
              <linearGradient
                id='bar-gradient-front'
                x1='0'
                y1='0'
                x2='0'
                y2='1'
              >
                <stop
                  offset='0%'
                  stopColor='var(--chart-1)'
                  stopOpacity='0.9'
                />
                <stop
                  offset='100%'
                  stopColor='var(--chart-1)'
                  stopOpacity='0.7'
                />
              </linearGradient>
              <linearGradient
                id='bar-gradient-back'
                x1='0'
                y1='0'
                x2='0'
                y2='1'
              >
                <stop
                  offset='0%'
                  stopColor='var(--chart-1)'
                  stopOpacity='0.5'
                />
                <stop
                  offset='100%'
                  stopColor='var(--chart-1)'
                  stopOpacity='0.3'
                />
              </linearGradient>
              <linearGradient
                id='bar-gradient-side'
                x1='0'
                y1='0'
                x2='1'
                y2='0'
              >
                <stop
                  offset='0%'
                  stopColor='var(--chart-1)'
                  stopOpacity='0.6'
                />
                <stop
                  offset='100%'
                  stopColor='var(--chart-1)'
                  stopOpacity='0.4'
                />
              </linearGradient>
              <linearGradient id='bar-gradient-top' x1='0' y1='0' x2='1' y2='1'>
                <stop
                  offset='0%'
                  stopColor='var(--chart-1)'
                  stopOpacity='0.7'
                />
                <stop
                  offset='100%'
                  stopColor='var(--chart-1)'
                  stopOpacity='0.5'
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={12}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator='dot'
                  className='min-w-40 gap-2.5'
                  labelFormatter={(value) => {
                    return (
                      <div className='border-ui-border/50 mb-0.5 flex flex-col gap-0.5 border-b pb-2'>
                        <span className='text-xs font-medium'>
                          {value} 2024
                        </span>
                      </div>
                    );
                  }}
                  formatter={(value, name) => (
                    <div className='flex w-full items-center justify-between gap-2'>
                      <div className='flex items-center gap-1.5'>
                        <div className='bg-ui-chart-1 h-2.5 w-2.5 shrink-0 rounded-xs' />
                        <span className='text-ui-muted-foreground'>
                          {chartConfig[name]?.label || name}
                        </span>
                      </div>
                      <span className='text-ui-foreground font-semibold'>
                        {Number(value).toLocaleString()}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Bar
              dataKey='desktop'
              fill='url(#bar-gradient-front)'
              shape={<True3DBar />}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
