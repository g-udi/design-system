'use client';
import { useId, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
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
  { month: 'Jan', organic: 1200, paid: 580, referral: 320 },
  { month: 'Feb', organic: 1450, paid: 620, referral: 380 },
  { month: 'Mar', organic: 1380, paid: 540, referral: 420 },
  { month: 'Apr', organic: 1650, paid: 710, referral: 460 },
  { month: 'May', organic: 1520, paid: 680, referral: 390 },
  { month: 'Jun', organic: 1800, paid: 750, referral: 510 },
  { month: 'Jul', organic: 1720, paid: 800, referral: 540 },
  { month: 'Aug', organic: 1960, paid: 830, referral: 600 }
];
const chartConfig = {
  organic: { label: 'Organic', color: 'var(--chart-1)' },
  paid: { label: 'Paid', color: 'var(--chart-2)' },
  referral: { label: 'Referral', color: 'var(--chart-3)' }
};
const fills = ['Gradient', 'Stripes', 'Dots', 'Crosshatch'];
const curves = { Smooth: 'natural', Step: 'stepAfter' };
// One fill definition per series, so stacked areas keep their own colour.
function FillDefs({ uid, keys }) {
  return keys.map((key) => {
    const color = `var(--color-${key})`;
    return (
      <g key={key}>
        <linearGradient id={`${uid}-Gradient-${key}`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='5%' stopColor={color} stopOpacity={0.45} />
          <stop offset='95%' stopColor={color} stopOpacity={0.05} />
        </linearGradient>
        <pattern id={`${uid}-Stripes-${key}`} patternUnits='userSpaceOnUse' width='6' height='6'>
          <rect width='6' height='6' fill={color} opacity='0.08' />
          <path d='M0,6 L6,0' stroke={color} strokeWidth='1' opacity='0.5' />
        </pattern>
        <pattern id={`${uid}-Dots-${key}`} patternUnits='userSpaceOnUse' width='5' height='5'>
          <rect width='5' height='5' fill={color} opacity='0.08' />
          <circle cx='2.5' cy='2.5' r='1' fill={color} opacity='0.6' />
        </pattern>
        <pattern id={`${uid}-Crosshatch-${key}`} patternUnits='userSpaceOnUse' width='8' height='8'>
          <path d='M0,8 L8,0' stroke={color} strokeWidth='0.8' opacity='0.5' />
          <path d='M0,0 L8,8' stroke={color} strokeWidth='0.8' opacity='0.3' />
        </pattern>
      </g>
    );
  });
}
export function Pattern() {
  const uid = useId().replace(/:/g, '');
  const [fill, setFill] = useState('Gradient');
  const [curve, setCurve] = useState('Smooth');
  const [stacked, setStacked] = useState(false);
  const [markers, setMarkers] = useState(false);
  const keys = stacked ? ['referral', 'paid', 'organic'] : ['organic'];
  return (
    <Card className='mx-auto w-full max-w-xl'>
      <CardHeader>
        <CardTitle>Traffic sources</CardTitle>
        <CardDescription>Monthly visitors, January to August</CardDescription>
      </CardHeader>
      <CardContent className='grid gap-3'>
        <div role='group' aria-label='Chart options' className='flex flex-wrap items-center gap-x-4 gap-y-2'>
          <ToggleGroup aria-label='Area fill' variant='outline' size='sm' spacing={0} type='single' value={fill} onValueChange={(value) => value && setFill(value)}>
            {fills.map((option) => (
              <ToggleGroupItem key={option} value={option}>{option}</ToggleGroupItem>
            ))}
          </ToggleGroup>
          <ToggleGroup aria-label='Curve' variant='outline' size='sm' spacing={0} type='single' value={curve} onValueChange={(value) => value && setCurve(value)}>
            {Object.keys(curves).map((option) => (
              <ToggleGroupItem key={option} value={option}>{option}</ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Label className='gap-2 text-sm font-normal'>
            <Switch size='sm' checked={stacked} onCheckedChange={setStacked} />
            Stacked
          </Label>
          <Label className='gap-2 text-sm font-normal'>
            <Switch size='sm' checked={markers} onCheckedChange={setMarkers} />
            Markers
          </Label>
        </div>
        <ChartContainer config={chartConfig}>
          <AreaChart accessibilityLayer data={chartData} margin={{ top: 12, right: 8, bottom: 0, left: 8 }}>
            <defs>
              <FillDefs uid={uid} keys={Object.keys(chartConfig)} />
              <filter id={`${uid}-glow`} x='-50%' y='-50%' width='200%' height='200%'>
                <feGaussianBlur stdDeviation='3' result='blur' />
                <feComposite in='SourceGraphic' in2='blur' operator='over' />
              </filter>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray='3 3' />
            <XAxis dataKey='month' tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='dot' />} />
            {stacked ? <ChartLegend content={<ChartLegendContent />} /> : null}
            {keys.map((key) => (
              <Area
                key={key}
                dataKey={key}
                type={curves[curve]}
                stackId={stacked ? 'traffic' : undefined}
                fill={`url(#${uid}-${fill}-${key})`}
                stroke={`var(--color-${key})`}
                strokeWidth={stacked ? 1.5 : 2}
                // Dashed strokes keep stacked edges readable where the fills meet.
                strokeDasharray={stacked ? '4 3' : undefined}
                dot={markers ? { r: 3.5, fill: `var(--color-${key})`, strokeWidth: 2, stroke: 'var(--background)', filter: `url(#${uid}-glow)` } : false}
                activeDot={{ r: 5, strokeWidth: 2, stroke: 'var(--background)' }}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
