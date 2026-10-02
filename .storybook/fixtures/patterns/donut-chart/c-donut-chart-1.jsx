'use client';
import { useId, useState } from 'react';
import { Cell, Label as ChartLabel, Pie, PieChart, Sector } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '../../../../src/components/charts/ChartFrame/parts/chart.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
const chartData = [
  { status: 'completed', count: 186, fill: 'var(--color-completed)' },
  { status: 'inProgress', count: 94, fill: 'var(--color-inProgress)' },
  { status: 'pending', count: 62, fill: 'var(--color-pending)' },
  { status: 'cancelled', count: 28, fill: 'var(--color-cancelled)' }
];
// Legend swatches read the series colour, not the slice fill, so they stay solid under gradients and patterns.
const swatch = (key) => {
  const Swatch = () => <span className='size-2 shrink-0 rounded-sm' style={{ backgroundColor: `var(--color-${key})` }} />;
  return Swatch;
};
const total = chartData.reduce((sum, item) => sum + item.count, 0);
const chartConfig = {
  count: { label: 'Tasks' },
  completed: { label: 'Completed', icon: swatch('completed'), color: 'var(--chart-1)' },
  inProgress: { label: 'In progress', icon: swatch('inProgress'), color: 'var(--chart-2)' },
  pending: { label: 'Pending', icon: swatch('pending'), color: 'var(--chart-3)' },
  cancelled: { label: 'Cancelled', icon: swatch('cancelled'), color: 'var(--chart-5)' }
};
const fills = ['Solid', 'Gradient', 'Patterns'];
// Patterns alternate so neighbouring slices differ by texture as well as colour.
function SliceDefs({ uid }) {
  return chartData.map(({ status }, index) => {
    const color = `var(--color-${status})`;
    return (
      <g key={status}>
        <linearGradient id={`${uid}-Gradient-${status}`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor={color} stopOpacity={1} />
          <stop offset='100%' stopColor={color} stopOpacity={0.7} />
        </linearGradient>
        <pattern id={`${uid}-Patterns-${status}`} patternUnits='userSpaceOnUse' width='6' height='6'>
          <rect width='6' height='6' fill={color} opacity='0.35' />
          {index % 2 ? (
            <circle cx='3' cy='3' r='1.3' fill={color} />
          ) : (
            <path d='M0,6 L6,0 M-1.5,1.5 L1.5,-1.5 M4.5,7.5 L7.5,4.5' stroke={color} strokeWidth='1.5' />
          )}
        </pattern>
      </g>
    );
  });
}
export function Pattern() {
  const uid = useId().replace(/:/g, '');
  const [shape, setShape] = useState('Donut');
  const [fill, setFill] = useState('Solid');
  const [legend, setLegend] = useState(true);
  const donut = shape === 'Donut';
  return (
    <Card className='mx-auto w-full max-w-sm'>
      <CardHeader className='pb-0'>
        <CardTitle>Task status</CardTitle>
        <CardDescription>{Math.round((chartData[0].count / total) * 100)}% of this sprint is done</CardDescription>
      </CardHeader>
      <CardContent className='grid gap-3'>
        <div role='group' aria-label='Chart options' className='flex flex-wrap items-center gap-x-4 gap-y-2'>
          <ToggleGroup aria-label='Shape' variant='outline' size='sm' spacing={0} type='single' value={shape} onValueChange={(value) => value && setShape(value)}>
            {['Donut', 'Pie'].map((option) => (
              <ToggleGroupItem key={option} value={option}>{option}</ToggleGroupItem>
            ))}
          </ToggleGroup>
          <ToggleGroup aria-label='Slice fill' variant='outline' size='sm' spacing={0} type='single' value={fill} onValueChange={(value) => value && setFill(value)}>
            {fills.map((option) => (
              <ToggleGroupItem key={option} value={option}>{option}</ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Label className='gap-2 text-sm font-normal'>
            <Switch size='sm' checked={legend} onCheckedChange={setLegend} />
            Legend
          </Label>
        </div>
        <ChartContainer config={chartConfig} className='mx-auto aspect-square max-h-72 w-full'>
          <PieChart accessibilityLayer>
            <defs>
              <SliceDefs uid={uid} />
              <filter id={`${uid}-lift`} x='-20%' y='-20%' width='140%' height='140%'>
                <feDropShadow dx='0' dy='6' stdDeviation='4' floodOpacity='0.2' />
              </filter>
            </defs>
            <ChartTooltip content={<ChartTooltipContent nameKey='status' hideLabel />} />
            {legend ? <ChartLegend content={<ChartLegendContent nameKey='status' />} /> : null}
            <Pie
                            data={chartData}
              dataKey='count'
              nameKey='status'
              innerRadius={donut ? '58%' : 0}
              outerRadius='80%'
              cornerRadius={donut ? 5 : 0}
              paddingAngle={donut ? 3 : 0}
              stroke='var(--background)'
              strokeWidth={donut ? 3 : 2}
              style={fill === 'Gradient' ? { filter: `url(#${uid}-lift)` } : undefined}
              // The hovered slice grows so it reads as the active segment.
              activeShape={({ outerRadius = 0, ...props }) => <Sector {...props} outerRadius={outerRadius + 8} />}
            >
              {chartData.map(({ status }) => (
                <Cell key={status} fill={fill === 'Solid' ? `var(--color-${status})` : `url(#${uid}-${fill}-${status})`} />
              ))}
              {donut ? (
                <ChartLabel
                  content={({ viewBox }) =>
                    viewBox && 'cx' in viewBox ? (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                        <tspan x={viewBox.cx} y={viewBox.cy} className='fill-text text-2xl font-bold tabular-nums'>
                          {total}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className='fill-text-muted text-xs'>
                          Tasks
                        </tspan>
                      </text>
                    ) : null
                  }
                />
              ) : null}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
