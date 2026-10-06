/**
 * Footer Component
 *
 * @description Main website footer with navigation links, social media icons,
 * newsletter signup, and copyright information. Features responsive grid layout
 * with categories, projects, and about sections.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { useId } from 'react';

import Icon from '../../core/Icon';
import Link from '../../core/Link';
import NewsletterForm from '../NewsletterForm';
import { cn } from '../../../utilities/cn';

const FooterSection = ({ links = [], title }) => (
  <div>
    <h3 className='text-sm font-semibold leading-5 text-text'>{title}</h3>
    <ul role='list' className='mt-3 space-y-2'>
      {links.map((link) => (
        <li key={ `${title}-${link.href}-${link.label}` }>
          <Link href={ link.href } variant='muted' className='text-sm font-normal leading-5'>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const resolveCopyrightName = (value) => {
  if (typeof value === 'string') return value;
  if (value?.name) return value.name;
  if (value?.author) return resolveCopyrightName(value.author);

  return '';
};

const SocialLinks = ({ className, iconProps, links = [] }) => (
  <div className={ cn('flex flex-wrap gap-4', className) }>
    {links.filter((link) => link.href).map((link) => (
      <Icon key={ link.kind } kind={ link.kind } href={ link.href } { ...iconProps } />
    ))}
  </div>
);

const FooterNavigation = ({ sections }) => (
  <nav aria-label='Footer navigation' className='grid grid-cols-1 gap-6 @[36rem]/footer:grid-cols-3'>
    {sections.filter((section) => section.links?.length).map((section) => (
      <FooterSection key={ section.title } links={ section.links } title={ section.title } />
    ))}
  </nav>
);

const Copyright = ({ className, name }) => resolveCopyrightName(name) ? (
  <p className={ cn('text-xs leading-5 text-text-muted', className) }>
    &copy; {new Date().getFullYear()} {resolveCopyrightName(name)}. All rights reserved.
  </p>
) : null;

const FooterFrame = ({ children }) => {
  const headingId = useId();

  return (
  <footer aria-labelledby={ headingId } className='@container/footer border-t border-border'>
    <h2 id={ headingId } className='sr-only'>Footer</h2>
    <div className='mx-auto py-6 @[56rem]/footer:py-8'>{children}</div>
  </footer>
  );
};

const StandardFooter = ({ copyrightName, newsletterProps, sections, socialLinks }) => (
  <FooterFrame>
    <div className='grid grid-cols-1 gap-8 @[56rem]/footer:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)] @[56rem]/footer:items-start'>
      <FooterNavigation sections={ sections } />
      <NewsletterForm
        { ...newsletterProps }
        className='mt-0'
        classNames={{
          ...newsletterProps.classNames,
          'form': 'mt-5',
          'input': 'min-h-11',
          'title': 'text-sm font-semibold text-text'
        }}
      />
    </div>
    <div className='mt-6 border-t border-border pt-6 @[40rem]/footer:flex @[40rem]/footer:items-center @[40rem]/footer:justify-between'>
      <SocialLinks links={ socialLinks } className='@[36rem]/footer:justify-center @[40rem]/footer:order-2' />
      <Copyright name={ copyrightName } className='mt-6 @[36rem]/footer:text-center @[40rem]/footer:order-1 @[40rem]/footer:mt-0' />
    </div>
  </FooterFrame>
);

const EditorialFooter = ({
  brandDescription,
  brandTitle,
  copyrightName,
  sections,
  socialLinks
}) => (
  <FooterFrame>
    <div className='grid grid-cols-1 gap-8 @[56rem]/footer:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]'>
      <div>
        {brandTitle ? <h3 className='text-xl font-semibold leading-7 text-text'>{brandTitle}</h3> : null}
        {brandDescription ? <p className={ cn('max-w-md text-xs leading-5 text-text-muted', brandTitle && 'mt-3') }>{brandDescription}</p> : null}
        <SocialLinks
          links={ socialLinks }
          className='mt-4'
          iconProps={{ 'className': 'size-[1.125rem]', 'linkClassName': 'text-text hover:text-accent', 'size': 'md' }}
        />
      </div>
      <FooterNavigation sections={ sections } />
    </div>
    <Copyright name={ copyrightName } className='mt-8 border-t border-border pt-5' />
  </FooterFrame>
);

/**
 * Site footer with navigation sections, social links, and copyright.
 *
 * @param {Object} props - Component props
 * @param {'standard'|'editorial'} [props.variant='standard'] - `standard` adds the newsletter form; `editorial` leads with the brand
 * @param {Array<{ title: string, links: Array<{ href: string, label: string }> }>} [props.sections] - Link columns
 * @param {Array<{ kind: string, href: string }>} [props.socialLinks] - Social icon links; entries without `href` are skipped
 * @param {string|Object} [props.copyrightName] - Name, or an object with `name` or `author`
 * @param {string} [props.brandTitle] - Editorial brand heading
 * @param {string} [props.brandDescription] - Editorial brand summary
 * @param {Object} [props.newsletterProps] - Props for the standard footer's NewsletterForm
 * @returns {JSX.Element} Footer landmark
 *
 * @example
 * <Footer variant='editorial' brandTitle='Field notes' sections={sections} />
 */
const Footer = ({
  brandDescription,
  brandTitle,
  copyrightName,
  newsletterProps = {},
  sections = [],
  socialLinks = [],
  variant = 'standard'
}) => {
  const footerProps = { brandDescription, brandTitle, copyrightName, newsletterProps, sections, socialLinks };

  if (variant === 'editorial') return <EditorialFooter { ...footerProps } />;

  return <StandardFooter { ...footerProps } />;
};

export default Footer;
