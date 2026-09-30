// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
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
  { month: 'Jan', desktop: 342, mobile: 245 },
  { month: 'Feb', desktop: 876, mobile: 654 },
  { month: 'Mar', desktop: 512, mobile: 389 },
  { month: 'Apr', desktop: 629, mobile: 521 },
  { month: 'May', desktop: 458, mobile: 367 },
  { month: 'Jun', desktop: 781, mobile: 598 }
];
const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)'
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)'
  }
};
export function ChartVerticalBars() {
  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>
          Inventory Levels
          <Badge variant='destructive-light' className='ml-2'>
            <RegistryIcon lucide='TrendingDownIcon' aria-hidden='true' />
            -3.2%
          </Badge>
        </CardTitle>
        <CardDescription>Stock availability across warehouses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout='vertical'
            margin={{
              left: -10,
              right: 20
            }}
            barCategoryGap='30%'
          >
            <YAxis
              type='category'
              dataKey='month'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <XAxis
              type='number'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
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
            <Bar dataKey='desktop' fill='var(--color-desktop)' radius={2} />
            <Bar dataKey='mobile' fill='var(--color-mobile)' radius={2} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
