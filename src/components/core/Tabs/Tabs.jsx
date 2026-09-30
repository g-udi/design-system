'use client';

import * as Primitive from '@radix-ui/react-tabs';
import { cn } from '../../../utilities/cn';

export function Tabs({ className, orientation = 'horizontal', ...props }) {
  return <Primitive.Root data-slot='tabs' data-orientation={orientation} orientation={orientation} className={cn('group/tabs flex gap-2 data-[orientation=horizontal]:flex-col', className)} {...props} />;
}
export function TabsList({ className, variant = 'default', ...props }) {
  return (
    <Primitive.List {...props} data-slot='tabs-list' data-variant={variant} className={cn('ds-tabs-list group/tabs-list group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col', variant === 'line' && 'ds-tabs-list-line', className)} />
  );
}
export function TabsTrigger({ className, ...props }) {
  return (
    <Primitive.Trigger
      {...props}
      data-slot='tabs-trigger'
      className={cn('ds-tabs-trigger', className)}
    />
  );
}
export function TabsContent({ className, ...props }) {
  return (
    <Primitive.Content
      {...props}
      data-slot='tabs-content'
      className={cn('ds-tabs-content', className)}
    />
  );
}
export default Tabs;
