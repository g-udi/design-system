import Link from '../Link';
import { cn } from '../../../utilities/cn';
import { createVariants } from '../../../utilities/variants';
import { buttonToneAliases } from '../Button/Button.tones.js';

// Semantic tones in three treatments; legacy hue names (blue, gray, red…) resolve through the Button aliases.
const toneClasses = {
  accent: { solid: 'bg-accent text-accent-foreground', soft: 'bg-accent-subtle', outline: 'border-accent-muted' },
  attention: { solid: 'bg-attention text-attention-foreground', soft: 'bg-attention-subtle', outline: 'border-attention-border' },
  danger: { solid: 'bg-danger text-danger-foreground', soft: 'bg-danger-subtle', outline: 'border-danger-border' },
  discovery: { solid: 'bg-discovery text-discovery-foreground', soft: 'bg-discovery-subtle', outline: 'border-discovery-border' },
  info: { solid: 'bg-info text-info-foreground', soft: 'bg-info-subtle', outline: 'border-info-border' },
  neutral: { solid: 'bg-text text-surface', soft: 'bg-surface-muted', outline: 'border-border' },
  success: { solid: 'bg-success text-success-foreground', soft: 'bg-success-subtle', outline: 'border-success-border' },
  warning: { solid: 'bg-warning text-warning-foreground', soft: 'bg-warning-subtle', outline: 'border-warning-border' }
};
const toneFor = (tone) => buttonToneAliases[tone] || tone;

export const bannerTones = Object.freeze(Object.keys(toneClasses));

export const bannerVariants = createVariants({
  'base': 'relative isolate flex justify-center gap-x-6 overflow-hidden',
  'compoundVariants': [ ...bannerTones, ...Object.keys(buttonToneAliases) ].flatMap((tone) => (
    Object.entries(toneClasses[toneFor(tone)]).map(([ variant, className ]) => ({ className, tone, variant }))
  )),
  'defaultVariants': {
    'size': 'md',
    'tone': 'neutral',
    'variant': 'soft'
  },
  'variants': {
    'size': {
      'lg': 'px-4 py-3',
      'md': 'px-4 py-2 sm:px-3',
      'sm': 'px-3 py-1.5',
      'xs': 'px-2.5 py-1'
    },
    'tone': Object.fromEntries([ ...bannerTones, ...Object.keys(buttonToneAliases) ].map((tone) => [ tone, '' ])),
    'variant': {
      'outline': 'border text-text',
      'soft': 'text-text',
      'solid': ''
    }
  }
});

const BannerContent = ({ children, showArrow, title }) => (
  <>
    {title ? <strong className='font-semibold'>{title}</strong> : null}
    {title && children ? (
      <svg viewBox='0 0 2 2' aria-hidden='true' className='mx-2 inline size-0.5 fill-current'>
        <circle r={ 1 } cx={ 1 } cy={ 1 } />
      </svg>
    ) : null}
    {children}{showArrow ? <span aria-hidden='true'>&nbsp;&rarr;</span> : null}
  </>
);

/** A full-width announcement strip; with `href` the whole message becomes one link. */
const Banner = ({ ariaLabel, children, className, classNames = {}, href, size, title, tone, variant }) => {
  const accessibleLabel = ariaLabel || [ title, children ].filter((part) => typeof part === 'string').join(': ') || undefined;
  const content = <BannerContent showArrow={ Boolean(href) } title={ title }>{children}</BannerContent>;

  return (
    <div className={ bannerVariants({ 'className': cn(className, classNames.root), size, tone, variant }) } role={ href ? undefined : 'status' }>
      <p className={ cn('text-sm leading-5', classNames.body) }>
        {href ? (
          <Link href={ href } variant='bare' aria-label={ accessibleLabel } className={ cn('hover:underline', classNames.action) }>
            {content}
          </Link>
        ) : (
          <span>{content}</span>
        )}
      </p>
    </div>
  );
};

export default Banner;
