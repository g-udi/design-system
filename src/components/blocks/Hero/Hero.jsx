import { useId } from 'react';
import Typography from '../../../foundations/Typography';
import { cn } from '../../../utilities/cn';

/** Responsive marketing introduction. Applications supply media, actions and copy. */
export default function Hero({ eyebrow, title, description, actions, media, children, layout = 'centered', headingAs = 'h1', className, ...props }) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} {...props} data-slot='hero' data-layout={layout} data-has-media={Boolean(media)} className={cn('gaudi-hero', className)}>
      <div className='gaudi-hero-inner'>
        <div className='gaudi-hero-copy'>
          <div className='gaudi-hero-heading'>
            {eyebrow && <div data-slot='hero-eyebrow' className='gaudi-hero-eyebrow'>{eyebrow}</div>}
            <Typography as={headingAs} variant='heading-xl' id={titleId} className='gaudi-hero-title'>{title}</Typography>
          </div>
          <div className='gaudi-hero-intro'>
            {description && <Typography variant='index-hero-summary' className='gaudi-hero-description'>{description}</Typography>}
            {actions && <div data-slot='hero-actions' className='gaudi-hero-actions'>{actions}</div>}
            {children && <div className='gaudi-hero-support'>{children}</div>}
          </div>
        </div>
        {media && <div data-slot='hero-media' className='gaudi-hero-media'>{media}</div>}
      </div>
    </section>
  );
}
export { Hero };
