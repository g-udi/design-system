import Card from '../../src/components/core/Card';
import Link from '../../src/components/core/Link';
import Pill from '../../src/components/core/Pill';
import Footer from '../../src/components/layout/Footer';
import NewsletterForm from '../../src/components/layout/NewsletterForm';
import Typography from '../../src/foundations/Typography';

import { CodeBlock, InlineCode, Page, pageParameters, Section, Table, Td, Th } from './StoryDocs';

const editorialSections = [
  {
    'links': [
      { 'href': '/about', 'label': 'Summary' },
      { 'href': '/blog/publications', 'label': 'Publications' },
      { 'href': '/blog/projects', 'label': 'Projects' }
    ],
    'title': 'About'
  },
  {
    'links': [
      { 'href': '/blog/categories/engineering', 'label': 'Engineering' },
      { 'href': '/blog/categories/data', 'label': 'Data' },
      { 'href': '/blog/categories/productivity', 'label': 'Productivity' }
    ],
    'title': 'Blog'
  },
  {
    'links': [
      { 'href': '/blog/projects/gaudi', 'label': 'Gaudi' }
    ],
    'title': 'Projects'
  }
];

const editorialSocialLinks = [
  { 'href': 'https://github.com/ahmadassaf', 'kind': 'github' },
  { 'href': 'https://www.linkedin.com/in/ahmadassaf', 'kind': 'linkedin' },
  { 'href': 'https://twitter.com/ahmadaassaf', 'kind': 'twitter' }
];

const FooterSurface = ({ children }) => <Card variant='outline' padding='none' className='px-6'>{children}</Card>;

const CurrentFooter = () => (
  <FooterSurface>
    <Footer copyrightName='Ahmad Assaf' newsletterProps={{ 'endpoint': '#newsletter' }} />
  </FooterSurface>
);

const EditorialFooter = () => (
  <FooterSurface>
    <Footer brandTitle='Field notes' copyrightName='Ahmad Assaf' sections={ editorialSections } socialLinks={ editorialSocialLinks } variant='editorial' />
  </FooterSurface>
);

const NewsletterFooter = () => (
  <footer>
    <Card variant='soft' padding='none'>
      <div className='grid gap-8 p-8 lg:grid-cols-[1.2fr_1fr]'>
        <div>
          <Pill tone='blue' variant='soft' className='m-0'>Newsletter</Pill>
          <Typography as='h3' variant='heading-md' className='mt-4'>Notes on AI, data, and engineering systems.</Typography>
          <p className='mt-3 text-sm leading-6 text-text-muted'>A footer treatment for pages where subscription is the primary secondary action.</p>
        </div>
        <NewsletterForm
          endpoint='#newsletter'
          title='Get the monthly issue'
          className='mt-0 self-end'
          classNames={{ 'form': 'mt-4 flex flex-col gap-3 sm:flex-row', 'input': 'min-h-11', 'title': 'text-sm font-semibold' }}
        />
      </div>
      <p className='border-t border-border px-8 py-5 text-sm text-text-muted'>No spam. No fake urgency. Just useful notes.</p>
    </Card>
  </footer>
);

const compactLinks = [
  { 'href': '/blog', 'label': 'Blog' },
  { 'href': '/blog/projects', 'label': 'Projects' },
  { 'href': '/about', 'label': 'About' }
];

const CompactFooter = () => (
  <Card variant='outline' padding='lg' classNames={{ 'body': 'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between' }}>
    <p className='text-sm text-text-muted'>&copy; 2026 Ahmad Assaf</p>
    <nav className='flex flex-wrap gap-4' aria-label='Compact footer navigation'>
      {compactLinks.map((link) => <Link key={ link.href } href={ link.href } variant='muted' className='font-normal'>{link.label}</Link>)}
    </nav>
  </Card>
);

const usageCode = `import { Footer } from '@gaudi/design-system';

<Footer
  copyrightName='Ahmad Assaf'
  sections={sections}
  socialLinks={socialLinks}
  variant='editorial'
/>`;

const variantRows = [
  [ 'Current Blog Footer', 'Main blog layout.', 'Newsletter, sitemap links, copyright, and social links.' ],
  [ 'Editorial Footer', 'Content-heavy pages.', 'Author context plus sitemap navigation.' ],
  [ 'Newsletter Footer', 'Campaign or subscription-led pages.', 'Subscription action is the primary footer task.' ],
  [ 'Compact Footer', 'Focused utility pages.', 'Minimal navigation and copyright only.' ]
];

const variantCode = {
  'compact': `<Card variant='outline' padding='lg' classNames={{ body: 'flex items-center justify-between gap-4' }}>
  <p className='text-sm text-text-muted'>&copy; 2026 Ahmad Assaf</p>
  <nav aria-label='Compact footer navigation'>
    {links.map((link) => <Link key={link.href} href={link.href} variant='muted'>{link.label}</Link>)}
  </nav>
</Card>`,
  'current': `<Footer copyrightName='Ahmad Assaf' newsletterProps={{ endpoint: '/api/buttondown' }} />`,
  'editorial': `<Footer
  brandTitle='Field notes'
  copyrightName='Ahmad Assaf'
  sections={editorialSections}
  socialLinks={editorialSocialLinks}
  variant='editorial'
/>`,
  'newsletter': `<footer>
  <Card variant='soft' padding='none'>
    <div className='grid gap-8 p-8 lg:grid-cols-[1.2fr_1fr]'>
      <div>
        <Pill tone='blue' variant='soft'>Newsletter</Pill>
        <Typography as='h3' variant='heading-md'>Notes on AI, data, and engineering systems.</Typography>
      </div>
      <NewsletterForm title='Get the monthly issue' />
    </div>
  </Card>
</footer>`
};

const VariantTable = () => (
  <Table>
    <thead>
      <tr><Th>Variant</Th><Th>Use</Th><Th>Contents</Th></tr>
    </thead>
    <tbody>
      {variantRows.map(([ variant, use, contents ]) => (
        <tr key={ variant }><Td>{variant}</Td><Td>{use}</Td><Td>{contents}</Td></tr>
      ))}
    </tbody>
  </Table>
);

export default {
  parameters: pageParameters,
  title: 'Blocks/To Sort/Footers', id: 'blocks-footers'
};

export const Default = {
  'name': 'Overview',
  'render': () => (
    <Page
      title='Footer Recipes'
      intro='Reference compositions built from the exported Footer component for editorial sitemaps, newsletter-first pages, and compact utility pages.'
    >
      <Section title='Usage' description='Use the exported Footer component for production footers. The other examples are reference recipes for page-specific composition.'>
        <CodeBlock code={ usageCode } />
      </Section>
      <Section title='Variant Rules' description='Choose a footer by navigation density and primary action.'>
        <VariantTable />
      </Section>
      <Section title='Current Blog Footer' description='Uses the actual Footer component used by the blog layout.'>
        <div data-docs-example><CurrentFooter /></div>
        <CodeBlock code={ variantCode.current } />
      </Section>
      <Section title='Editorial Footer' description='Use for content-heavy pages with sitemap navigation.'>
        <div data-docs-example><EditorialFooter /></div>
        <CodeBlock code={ variantCode.editorial } />
      </Section>
      <Section title='Newsletter Footer' description='Use where the subscription action is the main footer goal.'>
        <div data-docs-example><NewsletterFooter /></div>
        <CodeBlock code={ variantCode.newsletter } />
      </Section>
      <Section title='Compact Footer' description='Use for focused pages with minimal navigation needs.'>
        <div data-docs-example><CompactFooter /></div>
        <CodeBlock code={ variantCode.compact } />
      </Section>
      <Section title='Implementation Notes' description='Footer examples must not drift into app-only styling.'>
        <ul className='grid gap-2 text-sm leading-7 text-text-muted'>
          <li>Use <InlineCode>Footer</InlineCode> for production blog layouts.</li>
          <li>Pass links as data; do not bake app routes into the component package.</li>
          <li>Reuse <InlineCode>NewsletterForm</InlineCode> for subscription; it already handles validation, pending, and result messages.</li>
        </ul>
      </Section>
    </Page>
  )
};
