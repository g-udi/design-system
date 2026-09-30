'use client';

import * as Primitive from '@radix-ui/react-tooltip';

/** The child must forward its ref and have an accessible name of its own. */
export default function Tooltip({
  children,
  content,
  side = 'top',
  delayDuration = 300,
  open,
  defaultOpen,
  onOpenChange
}) {
  return (
    <Primitive.Provider delayDuration={delayDuration}>
      <Primitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <Primitive.Trigger asChild>{children}</Primitive.Trigger>
        <Primitive.Portal>
          <Primitive.Content
            side={side}
            sideOffset={6}
            collisionPadding={12}
            className='ds-tooltip'
          >
            {content}
            <Primitive.Arrow className='ds-tooltip-arrow' />
          </Primitive.Content>
        </Primitive.Portal>
      </Primitive.Root>
    </Primitive.Provider>
  );
}
