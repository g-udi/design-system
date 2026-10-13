import Footer from '@gaudi/design-system/layout/Footer';
import { GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import { Typography } from '@gaudi/design-system';
import siteMetadata from '../../../../../docs/fixtures/site/metadata';

export const footerSections = [
  { title: 'Explore', links: [{ href: '/blog', label: 'All articles' }, { href: '/blog/categories', label: 'Categories' }, { href: '/blog/tags', label: 'Tags' }] },
  { title: 'Topics', links: [{ href: '/blog/categories/engineering', label: 'Engineering' }, { href: '/blog/categories/data', label: 'Data' }, { href: '/blog/categories/productivity', label: 'Productivity' }] },
  { title: 'More', links: [{ href: '/about', label: 'About' }, { href: '/blog/projects', label: 'Projects' }, { href: '/blog/publications', label: 'Publications' }] }
];
const socialLinks = ['github', 'linkedin', 'twitter'].map(kind => ({ kind, href: siteMetadata[kind] }));

export function FooterExample({ variant = 'editorial', showBrand = true, showSocial = true, brandDescription = 'Notes on AI, data, engineering, and the tools that make work easier.', copyrightName = 'Ahmad Assaf', response = 'success' }) {
  const simple = variant === 'centered' || variant === 'compact';
  return <div className='mx-auto max-w-7xl px-6 py-10'>
    <Footer variant={variant} brandTitle={showBrand ? <GaudiBrand className='text-base' /> : undefined}
      brandDescription={variant === 'compact' ? undefined : brandDescription}
      copyrightName={copyrightName} socialLinks={showSocial ? socialLinks : []}
      sections={simple ? [{ title: 'Explore', links: [footerSections[0].links[0], ...footerSections[2].links] }] : footerSections}
      newsletterProps={{
        endpoint: response === 'unavailable' ? undefined : `data:application/json,${encodeURIComponent(JSON.stringify({ error: response === 'error' }))}`,
        title: 'Stay in the loop', description: 'New writing and useful resources, straight to your inbox.',
        children: <Typography variant='metadata' className='mt-3 text-text-muted'>Demo only. No email address is subscribed.</Typography>
      }} />
  </div>;
}
