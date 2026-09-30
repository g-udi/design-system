// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
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
  { month: 'Feb', desktop: 550 },
  { month: 'Mar', desktop: 400 },
  { month: 'Apr', desktop: 630 },
  { month: 'May', desktop: 460 },
  { month: 'Jun', desktop: 780 },
  { month: 'Jul', desktop: 390 },
  { month: 'Aug', desktop: 925 },
  { month: 'Sep', desktop: 645 },
  { month: 'Oct', desktop: 530 },
  { month: 'Nov', desktop: 700 },
  { month: 'Dec', desktop: 270 }
];
const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)'
  }
};
export function ChartBar() {
  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>
          Revenue Growth
          <Badge variant='success-light' className='ml-2'>
            <RegistryIcon lucide='TrendingUpIcon' aria-hidden='true' />
            +5.2%
          </Badge>
        </CardTitle>
        <CardDescription>Monthly revenue performance tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
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
                        ${Number(value).toLocaleString()}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Bar dataKey='desktop' fill='var(--color-desktop)' radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
