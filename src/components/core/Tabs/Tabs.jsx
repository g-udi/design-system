'use client';

import * as Primitive from '@radix-ui/react-tabs';
import { cn } from '../../../utilities/cn';

export function Tabs({ className, orientation = 'horizontal', ...props }) {
  return <Primitive.Root data-slot='tabs' data-orientation={orientation} orientation={orientation} className={cn('group/tabs flex min-w-0 gap-2 data-[orientation=horizontal]:flex-col', className)} {...props} />;
}
// `default` and `line` are the earlier names of the underline style.
const variantAliases = { default: 'underline', line: 'underline' };
export const tabsVariants = Object.freeze(['underline', 'outline', 'type']);

/** Transparent tabs: `underline` marks the active tab with a short bar, `outline` with a fine border, `type` with weight alone. */
export function TabsList({ className, variant = 'underline', ...props }) {
  const resolved = variantAliases[variant] || variant;
  return (
    <Primitive.List {...props} data-slot='tabs-list' data-variant={resolved} className={cn('ds-tabs-list group/tabs-list group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col', className)} />
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
