'use client';
import { useId, useState } from 'react';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts';
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
import { Label } from '@gaudi/design-system/core/Field';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
const chartData = [
  { skill: 'Frontend', team: 92, target: 85 },
  { skill: 'Backend', team: 78, target: 85 },
  { skill: 'DevOps', team: 68, target: 80 },
  { skill: 'Design', team: 74, target: 70 },
  { skill: 'Testing', team: 85, target: 80 },
  { skill: 'Security', team: 62, target: 85 }
];
const chartConfig = {
  team: { label: 'Team', color: 'var(--chart-1)' },
  target: { label: 'Target', color: 'var(--chart-2)' }
};
export function Pattern() {
  const uid = useId().replace(/:/g, '');
  const [compare, setCompare] = useState(false);
  return (
    <Card className='mx-auto w-full max-w-sm'>
      <CardHeader className='pb-0'>
        <CardTitle>Skill assessment</CardTitle>
        <CardDescription>Team proficiency across key areas, out of 100</CardDescription>
      </CardHeader>
      <CardContent className='grid gap-3'>
        <Label className='gap-2 text-sm font-normal'>
          <Switch size='sm' checked={compare} onCheckedChange={setCompare} />
          Compare with target
        </Label>
        <ChartContainer config={chartConfig} className='mx-auto aspect-square max-h-72 w-full'>
          <RadarChart accessibilityLayer data={chartData} margin={{ top: 16, right: 56, bottom: 16, left: 56 }} outerRadius='90%'>
            <defs>
              <linearGradient id={`${uid}-fill`} x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='var(--color-team)' stopOpacity={0.5} />
                <stop offset='100%' stopColor='var(--color-team)' stopOpacity={0.08} />
              </linearGradient>
              <filter id={`${uid}-glow`} x='-20%' y='-20%' width='140%' height='140%'>
                <feGaussianBlur stdDeviation='6' result='blur' />
                <feComposite in='SourceGraphic' in2='blur' operator='over' />
              </filter>
            </defs>
            <ChartTooltip content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey='skill' tick={{ fontSize: 12 }} />
            <PolarGrid strokeDasharray='3 3' />
            {/* A fixed domain keeps the shape honest when scores cluster high. */}
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
            {compare ? (
              <Radar
                dataKey='target'
                fill='none'
                stroke='var(--color-target)'
                strokeWidth={2}
                strokeDasharray='4 3'
                dot={{ r: 3.5, fill: 'var(--background)', strokeWidth: 2, stroke: 'var(--color-target)' }}
              />
            ) : null}
            <Radar
              dataKey='team'
              fill={`url(#${uid}-fill)`}
              stroke='var(--color-team)'
              strokeWidth={2}
              filter={`url(#${uid}-glow)`}
              dot={{ r: 4, fill: 'var(--color-team)', strokeWidth: 0 }}
            />
            {compare ? <ChartLegend content={<ChartLegendContent />} /> : null}
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
