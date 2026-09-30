'use client';

import * as Primitive from '@radix-ui/react-dropdown-menu';
import { cn } from '../../../utilities/cn';
import Icon from '../Icon';

export const DropdownMenuItem = ({ className, destructive, ...props }) => (
  <Primitive.Item
    {...props}
    className={cn('ds-menu-item', destructive && 'ds-error', className)}
  />
);
export const DropdownMenuCheckboxItem = ({ className, children, ...props }) => (
  <Primitive.CheckboxItem {...props} className={cn('ds-menu-item', className)}>
    <span className='ds-menu-check' aria-hidden='true'>
      {props.checked ? <Icon name='Check' decorative size='xs' /> : null}
    </span>
    {children}
  </Primitive.CheckboxItem>
);
export const DropdownMenuLabel = ({ className, ...props }) => (
  <Primitive.Label {...props} className={cn('ds-menu-label', className)} />
);
export const DropdownMenuSeparator = () => (
  <Primitive.Separator className='ds-separator' />
);
export default function DropdownMenu({
  trigger,
  children,
  align = 'end',
  ...props
}) {
  return (
    <Primitive.Root {...props}>
      <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>
      <Primitive.Portal>
        <Primitive.Content
          align={align}
          sideOffset={6}
          collisionPadding={12}
          className='ds-menu'
        >
          {children}
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
