'use client';
import { cn } from '../../../utilities/cn/index.js';
import { default as Button } from '../Button/index.js';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '../Tooltip/TooltipPrimitives.jsx';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';

// Private navigation controls shared by the EventCalendar and Gantt toolbars.

/** Button props for nav controls from the owner's view configuration. */
export function getNavButtonProps(viewConfig) {
  return {
    variant: viewConfig.navButtonVariant,
    // Ghost and outline nav buttons read as neutral chrome; a filled variant keeps the accent.
    tone: ['default', 'solid'].includes(viewConfig.navButtonVariant) ? undefined : 'neutral',
    size: viewConfig.navButtonSize,
    iconSize: viewConfig.navButtonSize === 'sm' ? 'icon-sm' : 'icon'
  };
}

/** Wraps a nav control in a tooltip; `null`/`undefined` content or `disabled` renders it bare. */
export function NavTooltip({ content, side = 'bottom', className, disabled = false, children }) {
  if (disabled || content === null || content === void 0) return children;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {content}
      </TooltipContent>
    </Tooltip>
  );
}

const STEP_ICONS = { prev: 'ChevronLeftIcon', next: 'ChevronRightIcon' };

/**
 * The Today, previous and next buttons. `step='today'` renders a text button
 * marked active when today is shown; `prev`/`next` render labelled icon buttons.
 * `onStep` runs unless the host `onClick` prevents the default.
 */
export function ScheduleNavButton({
  step,
  nav,
  label,
  active,
  tooltip,
  tooltipConfig,
  onStep,
  className,
  asChild = false,
  children,
  onClick,
  ...props
}) {
  const icon = STEP_ICONS[step];
  return (
    <NavTooltip content={tooltip} {...tooltipConfig}>
      <Button
        variant={nav.variant}
        tone={nav.tone}
        size={icon ? nav.iconSize : nav.size}
        data-active={active || void 0}
        aria-label={icon ? label : void 0}
        className={cn(nav.className, className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) onStep();
        }}
        asChild={asChild}
        {...props}
      >
        {children ??
          (icon ? (
            <RegistryIcon lucide={icon} className='size-4' aria-hidden='true' />
          ) : (
            label
          ))}
      </Button>
    </NavTooltip>
  );
}
