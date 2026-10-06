'use client';
import { createContext, useContext } from 'react';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { Slot } from 'radix-ui';
import { cn } from '../../../utilities/cn/index.js';
const TimelineContext = createContext(void 0);
const useTimeline = () => {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error('useTimeline must be used within a Timeline');
  }
  return context;
};
function Timeline({
  defaultValue = 1,
  value,
  onValueChange,
  orientation = 'vertical',
  asChild = false,
  className,
  children,
  ...props
}) {
  const Comp = asChild ? Slot.Root : 'div';
  const [currentStep, setActiveStep] = useControllableState({ value, defaultValue, onChange: onValueChange });
  return (
    <TimelineContext.Provider
      value={{ activeStep: currentStep, setActiveStep }}
    >
      <Comp
        className={cn(
          'group/timeline flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col',
          className
        )}
        data-orientation={orientation}
        data-slot='timeline'
        {...props}
      >
        {children}
      </Comp>
    </TimelineContext.Provider>
  );
}
function TimelineContent({ className, ...props }) {
  return (
    <div
      className={cn('text-ui-muted-foreground text-sm', className)}
      data-slot='timeline-content'
      {...props}
    />
  );
}
function TimelineDate({ asChild = false, className, ...props }) {
  const Comp = asChild ? Slot.Root : 'time';
  return (
    <Comp
      className={cn(
        'text-ui-muted-foreground mb-1 block text-xs font-medium group-data-[orientation=vertical]/timeline:max-sm:h-4',
        className
      )}
      data-slot='timeline-date'
      {...props}
    />
  );
}
function TimelineHeader({ className, ...props }) {
  return (
    <div className={cn(className)} data-slot='timeline-header' {...props} />
  );
}
function TimelineIndicator({ asChild = false, className, children, ...props }) {
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      aria-hidden='true'
      className={cn(
        'border-ui-primary/20 group-data-completed/timeline-item:border-ui-primary absolute size-4 rounded-full border-2 group-data-[orientation=horizontal]/timeline:-top-6 group-data-[orientation=horizontal]/timeline:start-0 group-data-[orientation=horizontal]/timeline:-translate-y-1/2 group-data-[orientation=vertical]/timeline:top-0 group-data-[orientation=vertical]/timeline:-start-6 group-data-[orientation=vertical]/timeline:-translate-x-1/2 rtl:group-data-[orientation=vertical]/timeline:translate-x-1/2',
        className
      )}
      data-slot='timeline-indicator'
      {...props}
    >
      {children}
    </Comp>
  );
}
function TimelineItem({ step, asChild = false, className, ...props }) {
  const { activeStep } = useTimeline();
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      className={cn(
        'group/timeline-item has-[+[data-completed]]:**:data-[slot=timeline-separator]:bg-ui-primary relative flex flex-1 flex-col gap-0.5 group-data-[orientation=horizontal]/timeline:mt-8 group-data-[orientation=horizontal]/timeline:not-last:pe-8 group-data-[orientation=vertical]/timeline:ms-8 group-data-[orientation=vertical]/timeline:not-last:pb-4',
        className
      )}
      data-completed={step <= activeStep || void 0}
      data-slot='timeline-item'
      {...props}
    />
  );
}
function TimelineSeparator({ className, ...props }) {
  return (
    <div
      aria-hidden='true'
      className={cn(
        'bg-ui-primary/10 absolute self-start group-last/timeline-item:hidden group-data-[orientation=horizontal]/timeline:-top-6 group-data-[orientation=horizontal]/timeline:h-0.5 group-data-[orientation=horizontal]/timeline:w-[calc(100%-1rem-0.25rem)] group-data-[orientation=horizontal]/timeline:translate-x-4.5 rtl:group-data-[orientation=horizontal]/timeline:-translate-x-4.5 group-data-[orientation=horizontal]/timeline:-translate-y-1/2 group-data-[orientation=vertical]/timeline:-start-6 group-data-[orientation=vertical]/timeline:h-[calc(100%-1rem-0.25rem)] group-data-[orientation=vertical]/timeline:w-0.5 group-data-[orientation=vertical]/timeline:-translate-x-1/2 rtl:group-data-[orientation=vertical]/timeline:translate-x-1/2 group-data-[orientation=vertical]/timeline:translate-y-4.5',
        className
      )}
      data-slot='timeline-separator'
      {...props}
    />
  );
}
function TimelineTitle({ asChild = false, className, ...props }) {
  const Comp = asChild ? Slot.Root : 'h3';
  return (
    <Comp
      className={cn('text-sm font-medium', className)}
      data-slot='timeline-title'
      {...props}
    />
  );
}
export {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle
};
