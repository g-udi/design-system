'use client';
import { useId, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
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
} from '../../../../src/components/mdx/Chart/parts/chart.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
const chartData = [
  { month: 'Jan', desktop: 340, mobile: 180 },
  { month: 'Feb', desktop: 870, mobile: 420 },
  { month: 'Mar', desktop: 510, mobile: 280 },
  { month: 'Apr', desktop: 620, mobile: 350 },
  { month: 'May', desktop: 460, mobile: 390 },
  { month: 'Jun', desktop: 780, mobile: 440 },
  { month: 'Jul', desktop: 390, mobile: 260 },
  { month: 'Aug', desktop: 920, mobile: 510 }
];
const chartConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--chart-2)' }
};
const fills = ['Solid', 'Gradient', 'Stripes', 'Dots', 'Duotone', '3D'];
// Custom shapes draw their own rect so the fill can vary inside one bar.
function GradientBar({ x, y, width, height, gradientId }) {
  return <rect x={x} y={y} width={width} height={height} rx={4} fill={`url(#${gradientId})`} />;
}
function DuotoneBar({ x, y, width, height, duotoneId }) {
  return <rect x={x} y={y} width={width} height={height} rx={4} fill={`url(#${duotoneId})`} />;
}
function Bar3D({ x, y, width, height, ids }) {
  const depth = Math.min(width * 0.3, 12);
  return (
    <g>
      <polygon
        points={`${x + width},${y} ${x + width + depth},${y - depth} ${x + width + depth},${y + height - depth} ${x + width},${y + height}`}
        fill={`url(#${ids.side})`}
      />
      <polygon points={`${x},${y} ${x + width},${y} ${x + width + depth},${y - depth} ${x + depth},${y - depth}`} fill={`url(#${ids.top})`} />
      <rect x={x} y={y} width={width} height={height} fill={`url(#${ids.front})`} />
    </g>
  );
}
export function Pattern() {
  const uid = useId().replace(/:/g, '');
  const ids = {
    stripes: `${uid}-stripes`,
    dots: `${uid}-dots`,
    gradient: `${uid}-gradient`,
    duotone: `${uid}-duotone`,
    front: `${uid}-front`,
    side: `${uid}-side`,
    top: `${uid}-top`
  };
  const [fill, setFill] = useState('Solid');
  const [compare, setCompare] = useState(false);
  const [horizontal, setHorizontal] = useState(false);
  const flat = horizontal && fill !== '3D';
  const desktopProps = {
    Solid: { fill: 'var(--color-desktop)', radius: 4 },
    Gradient: { fill: 'var(--color-desktop)', shape: <GradientBar gradientId={ids.gradient} /> },
    Stripes: { fill: `url(#${ids.stripes})`, stroke: 'var(--color-desktop)', strokeWidth: 1, radius: 4 },
    Dots: { fill: `url(#${ids.dots})`, stroke: 'var(--color-desktop)', strokeWidth: 1, radius: 4 },
    Duotone: { fill: 'var(--color-desktop)', shape: <DuotoneBar duotoneId={ids.duotone} /> },
    '3D': { fill: 'var(--color-desktop)', shape: <Bar3D ids={ids} /> }
  }[fill];
  return (
    <Card className='mx-auto w-full max-w-xl'>
      <CardHeader>
        <CardTitle>Sessions by device</CardTitle>
        <CardDescription>January to August</CardDescription>
      </CardHeader>
      <CardContent className='grid gap-3'>
        <div role='group' aria-label='Chart options' className='flex flex-wrap items-center gap-x-4 gap-y-2'>
          <ToggleGroup aria-label='Bar fill' variant='outline' size='sm' spacing={0} type='single' value={fill} onValueChange={(value) => value && setFill(value)}>
            {fills.map((option) => (
              <ToggleGroupItem key={option} value={option}>{option}</ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Label className='gap-2 text-sm font-normal'>
            <Switch size='sm' checked={compare} onCheckedChange={setCompare} />
            Compare
          </Label>
          <Label className='gap-2 text-sm font-normal'>
            <Switch size='sm' checked={horizontal} disabled={fill === '3D'} onCheckedChange={setHorizontal} />
            Horizontal
          </Label>
        </div>
        <ChartContainer config={chartConfig} className={flat ? 'aspect-[4/3]' : undefined}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout={flat ? 'vertical' : 'horizontal'}
            margin={{ top: fill === '3D' ? 16 : 8, right: 16, left: flat ? -8 : 0, bottom: 0 }}
          >
            <defs>
              <pattern id={ids.stripes} patternUnits='userSpaceOnUse' width='8' height='8'>
                <rect width='8' height='8' fill='var(--color-desktop)' opacity='0.1' />
                <path d='M0,8 L8,0 M4,12 L12,4 M-4,4 L4,-4' stroke='var(--color-desktop)' strokeWidth='1.5' opacity='0.6' />
              </pattern>
              <pattern id={ids.dots} patternUnits='userSpaceOnUse' width='5' height='5'>
                <rect width='5' height='5' fill='var(--color-desktop)' opacity='0.1' />
                <circle cx='2.5' cy='2.5' r='1.2' fill='var(--color-desktop)' opacity='0.7' />
              </pattern>
              <linearGradient id={ids.gradient} x1='0' y1='0' x2={flat ? '1' : '0'} y2={flat ? '0' : '1'}>
                <stop offset='0%' stopColor='var(--color-desktop)' stopOpacity={flat ? 0.2 : 0.8} />
                <stop offset='100%' stopColor='var(--color-desktop)' stopOpacity={flat ? 0.8 : 0.2} />
              </linearGradient>
              <linearGradient id={ids.duotone} x1='0' y1='0' x2='1' y2='0'>
                <stop offset='50%' stopColor='var(--color-desktop)' stopOpacity={0.4} />
                <stop offset='50%' stopColor='var(--color-desktop)' />
              </linearGradient>
              <linearGradient id={ids.front} x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='var(--color-desktop)' stopOpacity={0.9} />
                <stop offset='100%' stopColor='var(--color-desktop)' stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id={ids.side} x1='0' y1='0' x2='1' y2='0'>
                <stop offset='0%' stopColor='var(--color-desktop)' stopOpacity={0.6} />
                <stop offset='100%' stopColor='var(--color-desktop)' stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id={ids.top} x1='0' y1='0' x2='1' y2='1'>
                <stop offset='0%' stopColor='var(--color-desktop)' stopOpacity={0.5} />
                <stop offset='100%' stopColor='var(--color-desktop)' stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={flat} horizontal={!flat} />
            {flat ? (
              <>
                <YAxis type='category' dataKey='month' tickLine={false} axisLine={false} tickMargin={8} />
                <XAxis type='number' hide />
              </>
            ) : (
              <XAxis dataKey='month' tickLine={false} axisLine={false} tickMargin={8} />
            )}
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='dot' />} />
            {compare ? <ChartLegend content={<ChartLegendContent />} /> : null}
            <Bar key={fill} dataKey='desktop' {...desktopProps} />
            {compare ? <Bar dataKey='mobile' fill='var(--color-mobile)' radius={4} /> : null}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
