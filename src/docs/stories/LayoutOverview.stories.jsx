import { expect } from 'storybook/test';

import { CheckList, CodeBlock, InlineCode, Page, Section, Table, Td, Th } from '../components/StoryDocs';

const layoutApis = [
  [ 'ArticleContentLayout', 'Article body with an optional, controlled or uncontrolled aside.', 'aside, children, collapsibleAside, asideOpen, defaultAsideOpen, padding', 'Keep the aside toggle named and expose aria-expanded.' ],
  [ 'Borealis', 'Theme-aware decorative page background.', 'children, className, fadeEdges', 'Decoration is aria-hidden and motion reduces with the user preference.' ],
  [ 'Footer', 'Responsive footer navigation, newsletter, social links, and copyright.', 'sections, socialLinks, newsletterProps, variant, brandTitle, brandDescription, copyrightName', 'Retain the footer landmark, named navigation, and visible subscription feedback.' ],
  [ 'NewsletterForm', 'Subscription form with an explicit host endpoint, validation, pending, success, and failure feedback.', 'endpoint, title, className, classNames', 'Preserve the entered address on failure and announce the result beside the field.' ],
  [ 'LayoutContainer', 'Async server root shell with theme, navigation, JSON-LD, analytics, and skip link.', 'children, footerProps, jsonLd, menuProps, metadata, navigation', 'Import directly from its server entry and preserve the skip link and main landmark.' ]
];

const compositionRules = [
  'Choose LayoutContainer for the Next.js server root; it owns the theme, navigation, main landmark, and footer.',
  'Keep exactly one main landmark. LayoutContainer already provides it.',
  'Use ArticleContentLayout for prose and a table-of-contents rail; do not rebuild responsive aside behavior per article.',
  'Pass navigation, footer, and newsletter data through documented props instead of importing application fixtures into package components.',
  'Treat Borealis as decoration. Content must remain readable and complete when gradients or motion are unavailable.'
];

const stateRows = [
  [ 'ArticleContentLayout', 'Aside open / closed', 'Controlled and uncontrolled modes keep the toggle label and aria-expanded synchronized.' ],
  [ 'NewsletterForm', 'Idle / submitting / success / error', 'Disable duplicate submission, preserve correction context, and return a specific retryable message.' ],
  [ 'Footer', 'Sparse configuration', 'Empty sections are omitted without leaving blank navigation columns.' ],
  [ 'LayoutContainer', 'Missing theme or invalid JSON-LD', 'Use the host-supplied metadata.theme or system theme, and omit unsafe or unserializable structured data.' ]
];


export default {
  id: 'layout-overview',
  parameters: {
    layout: 'fullscreen'
  },
  tags: [ '!autodocs' ],
  title: 'Layout'
};

export const Default = {
  name: 'Overview',
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toHaveTextContent('@gaudi/design-system/layout/LayoutContainer');
  },
  render: () => (
    <Page
      title='Layout'
      intro='Layout composes page-level structure, responsive content rails, navigation boundaries, decorative surfaces, subscription feedback, and the application shell. Start here before assembling a full page.'
    >
      <Section title='Public API' description='Use these components at page and application boundaries. Smaller reusable jobs belong in Core; editorial assemblies belong in Blocks or Post.'>
        <Table label='Layout public API'>
          <thead><tr><Th>Export</Th><Th>Purpose</Th><Th>Primary props</Th><Th>Accessibility contract</Th></tr></thead>
          <tbody>
            {layoutApis.map(([ name, purpose, props, contract ]) => (
              <tr key={ name }><Td mono>{name}</Td><Td>{purpose}</Td><Td mono>{props}</Td><Td>{contract}</Td></tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section title='Composition Rules' description='These boundaries prevent duplicate landmarks, client/server import leaks, and one-off responsive shells.'>
        <CheckList items={ compositionRules } />
      </Section>

      <Section title='States & Recovery' description='Layout owns the context around stateful children, so failure and empty states must preserve page position and a clear next action.'>
        <Table label='Layout state contracts'>
          <thead><tr><Th>Component</Th><Th>State</Th><Th>Required behavior</Th></tr></thead>
          <tbody>
            {stateRows.map(([ component, state, behavior ]) => (
              <tr key={ `${component}-${state}` }><Td mono>{component}</Td><Td>{state}</Td><Td>{behavior}</Td></tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section title='Canonical Imports' description='Client-safe exports are available from the package root. LayoutContainer stays on its direct server-only path.'>
        <CodeBlock language='jsx' code={ `import {
  ArticleContentLayout,
  Borealis,
  Footer,
  NewsletterForm
} from '@gaudi/design-system';

import LayoutContainer from '@gaudi/design-system/layout/LayoutContainer';` } />
        <p className='max-w-5xl text-sm leading-7 text-text-muted'>
          <InlineCode>LayoutContainer</InlineCode> stays on its direct entry because it is an async server component that can await JSON-LD. Resolve request cookies in the host and pass <InlineCode>metadata.theme</InlineCode>; Gaudi does not read request cookies.
        </p>
      </Section>

    </Page>
  )
};
