// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { cva } from 'class-variance-authority';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { FieldInput as Input } from '../../Field/index.js';
import { default as Textarea } from '../../Textarea/index.js';
function InputGroup({ className, ...props }) {
  return (
    <div
      data-slot='input-group'
      role='group'
      className={cn(
        'group/input-group ds-part-input-group relative flex w-full min-w-0 items-center outline-none has-[>textarea]:h-auto',
        className
      )}
      {...props}
    />
  );
}
const inputGroupAddonVariants = cva(
  'ds-part-input-group-addon flex shrink-0 cursor-text items-center justify-center select-none',
  {
    variants: {
      align: {
        'inline-start':
          'ds-part-input-group-addon-align-inline-start order-first',
        'inline-end': 'ds-part-input-group-addon-align-inline-end order-last',
        'block-start':
          'ds-part-input-group-addon-align-block-start order-first w-full min-w-0 flex-wrap justify-start',
        'block-end':
          'ds-part-input-group-addon-align-block-end order-last w-full min-w-0 flex-wrap justify-start'
      }
    },
    defaultVariants: {
      align: 'inline-start'
    }
  }
);
function InputGroupAddon({ className, align = 'inline-start', ...props }) {
  return (
    <div
      role='group'
      data-slot='input-group-addon'
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if (e.target.closest('button')) {
          return;
        }
        e.currentTarget.parentElement?.querySelector('input')?.focus();
      }}
      {...props}
    />
  );
}
const inputGroupButtonVariants = cva(
  'ds-part-input-group-button flex items-center shadow-none',
  {
    variants: {
      size: {
        xs: 'ds-part-input-group-button-size-xs',
        sm: 'ds-part-input-group-button-size-sm',
        'icon-xs': 'ds-part-input-group-button-size-icon-xs',
        'icon-sm': 'ds-part-input-group-button-size-icon-sm'
      }
    },
    defaultVariants: {
      size: 'xs'
    }
  }
);
function InputGroupButton({
  className,
  type = 'button',
  variant = 'ghost',
  size = 'xs',
  ...props
}) {
  return (
    <Button
      type={type}
      data-size={size}
      size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}
function InputGroupText({ className, ...props }) {
  return (
    <span
      className={cn(
        'ds-part-input-group-text flex items-center [&_svg]:pointer-events-none',
        className
      )}
      {...props}
    />
  );
}
function InputGroupInput({ className, ...props }) {
  return (
    <Input
      data-slot='input-group-control'
      className={cn(
        'ds-part-input-group-input w-0 min-w-0 min-h-0 flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent',
        className
      )}
      {...props}
    />
  );
}
function InputGroupTextarea({ className, ...props }) {
  return (
    <Textarea
      data-slot='input-group-control'
      className={cn(
        'ds-part-input-group-textarea min-w-0 flex-1 resize-none rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent',
        className
      )}
      {...props}
    />
  );
}
export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea
};
