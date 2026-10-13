import { cn } from '../utilities/cn';
import { buttonToneAliases } from '../components/core/Button/buttonTones.js';

export const iconSizes = {
  '2xl': 'size-10',
  'lg': 'size-6',
  'md': 'size-5',
  'sm': 'size-4',
  'xl': 'size-8',
  'xs': 'size-3'
};

const semanticIconColors = {
  'accent': 'text-accent',
  'attention': 'text-attention',
  'danger': 'text-danger',
  'dim': 'text-text-subtle',
  'discovery': 'text-discovery',
  'info': 'text-info',
  'muted': 'text-text-muted',
  'neutral': 'text-text',
  'primary': 'text-accent',
  'success': 'text-success',
  'warning': 'text-warning'
};

// Legacy hue names (blue, red, teal…) resolve through the shared Button tone aliases.
export const iconColors = {
  ...semanticIconColors,
  ...Object.fromEntries(Object.entries(buttonToneAliases).map(([ alias, tone ]) => [ alias, semanticIconColors[tone] ]))
};

/** Size and colour props shared by static and animated icons. */
export function resolveIconStyle({ className, color, size = 'md' }, baseClassName = 'shrink-0') {
  const numericSize = typeof size === 'number';
  return {
    className: cn(baseClassName, !numericSize && (iconSizes[size] || iconSizes.md), color && iconColors[color], className),
    ...(numericSize ? { width: size, height: size } : {})
  };
}
