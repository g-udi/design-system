import Button from '../../src/components/core/Button';
import Field, { FieldInput } from '../../src/components/core/Field';
import Link from '../../src/components/core/Link';
import Pill from '../../src/components/core/Pill';
import Footer from '../../src/components/layout/Footer';

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

const CurrentFooter = () => (
  <div className='rounded-lg border border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-950'>
    <Footer copyrightName='Ahmad Assaf' />
  </div>
);

const EditorialFooter = () => (
  <div className='rounded-lg border border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-950'>
    <Footer copyrightName='Ahmad Assaf' sections={ editorialSections } socialLinks={ editorialSocialLinks } variant='editorial' />
  </div>
);

const NewsletterFooter = () => (
  <footer className='overflow-hidden rounded-lg bg-gray-950 text-white'>
    <div className='grid gap-8 p-8 lg:grid-cols-[1.2fr_1fr]'>
      <div>
        <Pill tone='blue' variant='soft'>newsletter</Pill>
        <h3 className='mt-4 text-3xl font-extrabold'>Notes on AI, data, and engineering systems.</h3>
        <p className='mt-3 text-sm leading-6 text-white/75'>A footer treatment for pages where subscription is the primary secondary action.</p>
      </div>
      <form className='flex flex-col gap-3 self-end sm:flex-row'>
        <Field className='flex-1'>
          <label className='sr-only' htmlFor='footer-email'>Email address</label>
          <FieldInput id='footer-email' type='email' placeholder='you@example.com' className='min-h-11 border-white/10 bg-white/10 text-white placeholder:text-white/50 focus:ring-blue-500' />
        </Field>
        <Button type='submit' tone='accent' variant='solid'>Subscribe</Button>
      </form>
    </div>
    <div className='border-t border-white/10 px-8 py-5 text-sm text-white/60'>No spam. No fake urgency. Just useful notes.</div>
  </footer>
);

const CompactFooter = () => (
  <footer className='flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950 sm:flex-row sm:items-center sm:justify-between'>
    <p className='text-sm text-gray-500 dark:text-gray-400'>&copy; 2026 Ahmad Assaf</p>
    <nav className='flex flex-wrap gap-4' aria-label='Compact footer navigation'>
      <Link href='' tone='gray' variant='muted' className='font-normal'>Blog</Link>
      <Link href='' tone='gray' variant='muted' className='font-normal'>Projects</Link>
      <Link href='' tone='gray' variant='muted' className='font-normal'>About</Link>
    </nav>
  </footer>
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
  'compact': `<footer className='flex flex-col gap-4 rounded-lg border p-5 sm:flex-row sm:items-center sm:justify-between'>
  <p>&copy; 2026 Ahmad Assaf</p>
  <nav aria-label='Compact footer navigation'>
    <Link href='/blog'>Blog</Link>
    <Link href='/blog/projects'>Projects</Link>
    <Link href='/about'>About</Link>
  </nav>
</footer>`,
  'current': `<Footer copyrightName='Ahmad Assaf' />`,
  'editorial': `<Footer
  copyrightName='Ahmad Assaf'
  sections={editorialSections}
  socialLinks={editorialSocialLinks}
  variant='editorial'
/>`,
  'newsletter': `<footer className='rounded-lg bg-gray-950 text-white'>
  <Pill tone='blue' variant='soft'>newsletter</Pill>
  <h3>Notes on AI, data, and engineering systems.</h3>
  <form>
    <Field>
      <FieldInput type='email' placeholder='you@example.com' />
    </Field>
    <Button type='submit'>Subscribe</Button>
  </form>
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
  title: 'Blocks/Footers'
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
        <ul className='grid gap-2 text-sm leading-7 text-gray-600 dark:text-gray-300'>
          <li>Use <InlineCode>Footer</InlineCode> for production blog layouts.</li>
          <li>Pass links as data; do not bake app routes into the component package.</li>
          <li>Newsletter controls should use <InlineCode>Field</InlineCode>, <InlineCode>FieldInput</InlineCode>, and <InlineCode>Button</InlineCode>.</li>
        </ul>
      </Section>
    </Page>
  )
};
