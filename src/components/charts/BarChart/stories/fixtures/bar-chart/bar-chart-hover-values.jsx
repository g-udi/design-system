'use client';
import { useMemo, useState } from 'react';
import { Badge } from '@gaudi/design-system/core/Pill';
import { motion } from 'framer-motion';
import { Bar, BarChart, XAxis } from 'recharts';
import { cn } from '@gaudi/design-system/utilities/cn';
import {
  CardRoot as Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@gaudi/design-system/charts/ChartFrame';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const CustomBar = (props) => {
  const { fill, x, y, width, height, index, activeIndex, value } = props;
  const xPos = Number(x || 0);
  const realWidth = Number(width || 0);
  const isActive = index === activeIndex;
  const collapsedWidth = 6;
  const barX = isActive ? xPos : xPos + (realWidth - collapsedWidth) / 2;
  const textX = xPos + realWidth / 2;
  return (
    <g onMouseEnter={() => props.setActiveIndex(index)}>
      {/* rendering the bar with custom position and animated width */}
      <motion.rect
        style={{
          willChange: 'transform, width'
          // helps with performance
        }}
        y={y}
        initial={{ width: collapsedWidth, x: barX }}
        animate={{ width: isActive ? realWidth : collapsedWidth, x: barX }}
        transition={{
          duration: activeIndex === index ? 0.5 : 1,
          type: 'spring'
        }}
        height={height}
        fill={fill}
        rx='3'
      />
      {/* Render value text on top of bar */}
      {isActive && (
        <motion.text
          style={{
            willChange: 'transform, opacity'
            // helps with performance
          }}
          className='font-mono'
          key={index}
          initial={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
          transition={{ duration: 0.1 }}
          x={textX}
          y={Number(y) - 5}
          textAnchor='middle'
          fill={fill}
        >
          {value}
        </motion.text>
      )}
    </g>
  );
};
const chartData = [
  { month: 'January', desktop: 289 },
  { month: 'February', desktop: 345 },
  { month: 'March', desktop: 412 },
  { month: 'April', desktop: 478 },
  { month: 'May', desktop: 534 },
  { month: 'June', desktop: 456 },
  { month: 'July', desktop: 523 },
  { month: 'August', desktop: 589 },
  { month: 'September', desktop: 467 },
  { month: 'October', desktop: 398 },
  { month: 'November', desktop: 356 },
  { month: 'December', desktop: 423 }
];
const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-4)'
  }
};
export function Pattern() {
  const [activeIndex, setActiveIndex] = useState(void 0);
  const activeData = useMemo(() => {
    if (activeIndex === void 0) return null;
    return chartData[activeIndex];
  }, [activeIndex]);
  return (
    <Card className='mx-auto w-full max-w-md'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          Conversion Rates
          <span className={cn('ml-auto font-mono text-xl tracking-tighter')}>
            ${activeData ? activeData.desktop : '123'}
          </span>
          <Badge variant='success-light'>
            <RegistryIcon lucide='TrendingUpIcon' aria-hidden='true' />
            <span>5.2%</span>
          </Badge>
        </CardTitle>
        <CardDescription>Real-time funnel conversion tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            onMouseLeave={() => setActiveIndex(void 0)}
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
              tickMargin={10}
              axisLine={false}
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
                      <div className='border-border/50 mb-0.5 flex flex-col gap-0.5 border-b pb-2'>
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
                          className='size-2.5 shrink-0 rounded-xs bg-(--color-bg)'
                          style={{
                            '--color-bg': `var(--color-${name})`
                          }}
                        />
                        <span className='text-text-muted'>
                          {chartConfig[name]?.label || name}
                        </span>
                      </div>
                      <span className='text-text font-semibold'>
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
              shape={
                <CustomBar
                  setActiveIndex={setActiveIndex}
                  activeIndex={activeIndex}
                />
              }
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
