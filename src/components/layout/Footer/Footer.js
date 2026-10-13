import { useId } from 'react';
import Icon from '../../core/Icon';
import Link from '../../core/Link';
import NewsletterForm from '../NewsletterForm';
import Typography from '../../../foundations/Typography';
import { cn } from '../../../utilities/cn';

const FooterSection = ({ links = [], title }) => (
  <div className='min-w-0'>
    <Typography as='h3' variant='paragraph-sm' className='font-semibold text-text'>{title}</Typography>
    <ul className='mt-3 flex flex-col gap-2'>
      {links.map(link => <li key={`${link.href}-${link.label}`}>
        <Link href={link.href} variant='muted' className='text-sm font-normal leading-5'>{link.label}</Link>
      </li>)}
    </ul>
  </div>
);

const resolveCopyrightName = value => {
  if (typeof value === 'string') return value;
  if (value?.name) return value.name;
  if (value?.author) return resolveCopyrightName(value.author);
  return '';
};

const SocialLinks = ({ className, links = [] }) => links.some(link => link.href) ? (
  <div className={cn('flex flex-wrap items-center gap-4', className)}>
    {links.filter(link => link.href).map(link => <Icon key={`${link.kind}-${link.href}`} kind={link.kind} href={link.href} />)}
  </div>
) : null;

const FooterNavigation = ({ sections, inline = false }) => {
  const groups = sections.filter(section => section.links?.length);
  if (!groups.length) return null;
  return <nav aria-label='Footer navigation' className={inline ? undefined : 'grid grid-cols-1 gap-6 @[36rem]/footer:grid-cols-3'}>
    {inline ? <ul className='flex flex-wrap justify-center gap-x-6 gap-y-3'>
      {groups.flatMap(section => section.links).map(link => <li key={`${link.href}-${link.label}`}>
        <Link href={link.href} variant='muted' className='text-sm'>{link.label}</Link>
      </li>)}
    </ul> : groups.map(section => <FooterSection key={section.title} {...section} />)}
  </nav>;
};

const Copyright = ({ className, name }) => resolveCopyrightName(name) ? (
  <Typography variant='metadata' className={cn('font-normal leading-5 text-text-muted', className)}>
    &copy; {new Date().getFullYear()} {resolveCopyrightName(name)}. All rights reserved.
  </Typography>
) : null;

const FooterBrand = ({ brandTitle, brandDescription }) => brandTitle || brandDescription ? (
  <div className='min-w-0'>
    {brandTitle && <Typography as='h3' variant='heading-sm'>{brandTitle}</Typography>}
    {brandDescription && <Typography variant='paragraph-sm' className={cn('max-w-md text-text-muted', brandTitle && 'mt-3')}>{brandDescription}</Typography>}
  </div>
) : null;

/** Host-owned navigation and branding, with an optional shared newsletter form. */
const Footer = ({
  brandDescription, brandTitle, copyrightName, newsletterProps = {},
  sections = [], socialLinks = [], variant = 'standard', className, ...props
}) => {
  const headingId = useId();
  const brand = <FooterBrand brandTitle={brandTitle} brandDescription={brandDescription} />;
  const social = <SocialLinks links={socialLinks} />;
  const copyright = <Copyright name={copyrightName} />;
  const simple = variant === 'centered' || variant === 'compact';

  return <footer aria-labelledby={headingId} {...props} data-variant={variant} className={cn('@container/footer border-t border-border', className)}>
    <h2 id={headingId} className='sr-only'>Footer</h2>
    <div className='mx-auto py-6 @[56rem]/footer:py-8'>
      {simple ? <>
        <div className={cn('flex flex-col items-center gap-6 text-center', variant === 'compact' && '@[56rem]/footer:flex-row @[56rem]/footer:justify-between @[56rem]/footer:text-left')}>
          {brand}
          <FooterNavigation sections={sections} inline />
          {social}
        </div>
        <div className={cn('mt-6 text-center', variant === 'compact' && '@[56rem]/footer:text-left')}>{copyright}</div>
      </> : <>
        <div className={cn('grid grid-cols-1 gap-8 @[56rem]/footer:items-start', variant === 'editorial' ? '@[56rem]/footer:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]' : '@[56rem]/footer:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)]')}>
          {variant === 'editorial' ? <>
            <div>{brand}<SocialLinks links={socialLinks} className={brandTitle || brandDescription ? 'mt-5' : undefined} /></div>
            <FooterNavigation sections={sections} />
          </> : <>
            <div className='flex min-w-0 flex-col gap-6'>{brand}<FooterNavigation sections={sections} /></div>
            <NewsletterForm {...newsletterProps} className={cn('mt-0', newsletterProps.className)} classNames={{ ...newsletterProps.classNames, title: cn('text-sm font-semibold text-text', newsletterProps.classNames?.title) }} />
          </>}
        </div>
        <div className='mt-8 flex flex-col gap-5 border-t border-border pt-5 @[40rem]/footer:flex-row @[40rem]/footer:items-center @[40rem]/footer:justify-between'>
          {copyright}
          {variant !== 'editorial' && social}
        </div>
      </>}
    </div>
  </footer>;
};

export default Footer;
