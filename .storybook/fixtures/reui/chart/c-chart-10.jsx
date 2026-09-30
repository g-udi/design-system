// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useId } from 'react';
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
  { month: 'Jan', desktop: 300 },
  { month: 'Feb', desktop: 600 },
  { month: 'Mar', desktop: 500 },
  { month: 'Apr', desktop: 600 },
  { month: 'May', desktop: 400 },
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
const CustomDuotoneBar = (props) => {
  const patternId = useId();
  const { fill, x, y, width, height, dataKey } = props;
  return (
    <>
      <rect
        rx={4}
        x={x}
        y={y}
        width={width}
        height={height}
        stroke='none'
        fill={`url(#${patternId})`}
      />
      <defs>
        <linearGradient
          key={dataKey}
          id={patternId}
          x1='0'
          y1='0'
          x2='1'
          y2='0'
        >
          <stop offset='50%' stopColor={fill} stopOpacity={0.4} />
          <stop offset='50%' stopColor={fill} />
        </linearGradient>
      </defs>
    </>
  );
};
export function Pattern() {
  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>
          Operational Efficiency
          <Badge variant='success-light' className='ml-2'>
            <RegistryIcon lucide='TrendingUpIcon' aria-hidden='true' />
            +12.5%
          </Badge>
        </CardTitle>
        <CardDescription>Supply chain performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              right: 12,
              bottom: 12,
              left: 12
            }}
          >
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
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
                        <div
                          className='h-2.5 w-2.5 shrink-0 rounded-xs bg-(--color-bg)'
                          style={{
                            '--color-bg': `var(--color-${name})`
                          }}
                        />
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
              fill='var(--color-desktop)'
              shape={<CustomDuotoneBar />}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
