import packageJson from '../../package.json';

import { CodeBlock, InlineCode, Page, QuickLink, Section, Table, Td, Th } from './StoryDocs';

export default {
  id: 'overview-getting-started',
  parameters: {
    layout: 'fullscreen'
  },
  tags: [ '!autodocs' ],
  title: 'Getting Started'
};

export const Default = {
  name: 'Getting Started',
  'render': () => (
    <Page
      title='Gaudi Design System'
      intro='Gaudi is a curated design system for blogs and applications. Shared foundations, rich components, and practical interface patterns are available through @gaudi/design-system.'
    >
      <Section title='Start Here' description='Install once, reuse documented components, and keep application policy outside the package.'>
        <ol aria-label='Gaudi setup workflow' className='grid border-y border-gray-200 md:grid-cols-3 md:divide-x md:divide-gray-200 dark:border-gray-800 dark:md:divide-gray-800'>
          {[
            [ '1', 'Install once', 'Add Gaudi and import its global stylesheet at the application root.' ],
            [ '2', 'Reuse and extend', 'Find an existing component or pattern, then extend it with the variants and use cases you need.' ],
            [ '3', 'Verify the boundary', 'Keep product data and policy in the application, then run the documented checks.' ]
          ].map(([ number, title, description ]) => (
            <li key={ number } className='flex gap-3 px-1 py-4 md:px-5 md:first:pl-0'>
              <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-control bg-blue-50 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300'>{number}</span>
              <span>
                <strong className='block text-sm text-gray-950 dark:text-white'>{title}</strong>
                <span className='mt-1 block text-xs leading-5 text-gray-600 dark:text-gray-300'>{description}</span>
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title='Install And Import' description='The repository distribution targets React 19 and Next.js 15. Import the stylesheet once at the application root.'>
        <p className='text-sm leading-7 text-gray-600 dark:text-gray-300'>
          Package v{packageJson.version} installs from the default GitHub branch and exposes the stable <InlineCode>@gaudi/design-system</InlineCode> import name.
        </p>
        <CodeBlock
          language='jsx'
          code={ `pnpm add github:ahmadassaf/design-system

// app/layout.js
import '@gaudi/design-system/global.css';

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}` }
        />
        <Table label='Package imports'>
          <thead>
            <tr><Th>Path</Th><Th>Use</Th></tr>
          </thead>
          <tbody>
            <tr><Td mono>@gaudi/design-system</Td><Td>Core components, domain components, and shared tokens exposed from the root API.</Td></tr>
            <tr><Td mono>@gaudi/design-system/global.css</Td><Td>Tailwind, CSS variables, base compatibility, reduced motion, and global primitives.</Td></tr>
            <tr><Td mono>@gaudi/design-system/tokens</Td><Td>Structured color, typography, motion, radius, and shadow tokens.</Td></tr>
            <tr><Td mono>@gaudi/design-system/chat</Td><Td>Chat and agent building blocks: messages, the composer, reply parts and chat panels. Also exported from the root.</Td></tr>
            <tr><Td mono>@gaudi/design-system/mdx</Td><Td>MDX components for article content.</Td></tr>
          </tbody>
        </Table>
      </Section>

      <Section title='Package Boundary' description='Gaudi owns reusable presentation and interaction contracts. The consuming application owns product data and policy.'>
        <Table label='Package ownership boundary'>
          <thead><tr><Th>Concern</Th><Th>Gaudi owns</Th><Th>Application owns</Th></tr></thead>
          <tbody>
            <tr><Td>UI</Td><Td>Components, variants, tokens, icons, focus behavior, and responsive composition.</Td><Td>Route assembly, permissions, analytics, and product-specific decisions.</Td></tr>
            <tr><Td>Data</Td><Td>Documented prop shapes and local display states.</Td><Td>Fetching, persistence, content records, metadata, and API routes.</Td></tr>
            <tr><Td>Styles</Td><Td>Component styles and one intentional global stylesheet.</Td><Td>Page layout around Gaudi components, without copied components or broad overrides.</Td></tr>
          </tbody>
        </Table>
        <p className='text-sm leading-7 text-gray-600 dark:text-gray-300'>
          Contributors and agents should read <InlineCode>AGENTS.md</InlineCode>, search Storybook before adding UI, and run the documented checks before committing.
        </p>
      </Section>

      <Section title='Troubleshooting' description='Start with the visible symptom, confirm the likely boundary failure, then recover without replacing package components or adding global overrides.'>
        <Table label='Getting started troubleshooting'>
          <thead>
            <tr><Th>Symptom</Th><Th>Likely cause</Th><Th>Recovery</Th></tr>
          </thead>
          <tbody>
            <tr><Td>Components render without Gaudi styles</Td><Td mono>global.css is missing or imported below app styles</Td><Td>Import it once in the root layout, restart the bundler, and remove duplicate package CSS imports.</Td></tr>
            <tr><Td>A package import cannot resolve</Td><Td>The path is not a documented package export</Td><Td>Use the Imports table or the component docs canonical import; keep LayoutContainer on its direct layout path.</Td></tr>
            <tr><Td>A component loses theme or configuration context</Td><Td>The consuming shell omitted the documented provider or boundary props</Td><Td>Compare the canonical story, restore the shared shell, and pass application data through documented props.</Td></tr>
            <tr><Td>An upgrade fails during build</Td><Td>React, Next.js, or the lockfile no longer matches the supported versions</Td><Td>Align the supported versions, reinstall dependencies, then run lint, contract tests, Storybook interactions, and the production build.</Td></tr>
            <tr><Td>Keyboard or focus behavior regresses</Td><Td>A custom composition bypassed the documented interaction primitive</Td><Td>Reproduce the canonical story, restore its focus and Escape contract, and keep product-specific policy outside the primitive.</Td></tr>
          </tbody>
        </Table>
      </Section>

      <Section title='Next'>
        <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
          <QuickLink title='Accessibility' description='Keyboard, screen-reader, contrast, focus, and testing rules.' storyId='overview-accessibility--default' />
          <QuickLink title='States & Recovery' description='Loading, empty, error, success, disabled, and recovery contracts.' storyId='overview-states-recovery--default' />
          <QuickLink title='Colors & Tokens' description='Palette, semantic tokens, CSS variables, motion, radius, and shadows.' storyId='overview-colors-tokens--default' />
          <QuickLink title='Component Catalogue' description='Browse components, application patterns, and their practical examples.' storyId='overview-component-catalogue--browse' />
        </div>
      </Section>
    </Page>
  )
};
