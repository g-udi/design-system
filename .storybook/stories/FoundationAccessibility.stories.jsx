import { Badge, CheckList, CodeBlock, InlineCode, Page, Section, Stat, Table, Td, Th } from './StoryDocs';

const Key = ({ children }) => (
  <kbd className='inline-flex rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-xs font-medium text-gray-800 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'>
    {children}
  </kbd>
);

const InfoCard = ({ children, title }) => (
  <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900'>
    <h3 className='mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100'>{title}</h3>
    <div className='text-xs leading-6 text-gray-600 dark:text-gray-300'>{children}</div>
  </div>
);

const RuleRow = ({ description, note = '', rule, status = 'enforced' }) => (
  <tr>
    <Td mono>{rule}</Td>
    <Td>{description}</Td>
    <Td><Badge tone={ status === 'enforced' ? 'green' : 'gray' }>{status}</Badge></Td>
    <Td>{note}</Td>
  </tr>
);

export default {
  id: 'overview-accessibility',
  parameters: {
    a11y: {
      options: {
        runOnly: {
          type: 'tag',
          values: [ 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa' ]
        }
      },
      test: 'error'
    },
    layout: 'fullscreen',
    options: { 'showToolbar': false }
  },
  tags: [ '!autodocs' ],
  title: 'Accessibility'
};

export const Default = {
  name: 'Accessibility',
  'render': () => (
    <Page
      title='Accessibility'
      intro='The design system targets WCAG 2.1 Level AA. Components are expected to be keyboard reachable, screen-reader understandable, visually clear, and tested through the headless Storybook accessibility gate.'
    >
      <section className='grid gap-4 md:grid-cols-3'>
        <Stat value='WCAG 2.1' label='Level AA target' />
        <Stat value='axe-core' label='Headless accessibility checks' />
        <Stat value='Every story' label='A11y gate in test-storybook' />
      </section>

      <Section
        title='Keyboard Navigation'
        description={ <>
            Interactive components use semantic <InlineCode>button</InlineCode> or <InlineCode>a</InlineCode> elements. Composite widgets document their own keyboard contract and must test Escape, focus order, and arrow-key behavior when they implement managed focus.
        </> }
      >
        <Table>
          <thead><tr><Th>Key</Th><Th>Behavior</Th><Th>Components</Th></tr></thead>
          <tbody>
            <tr><Td><Key>Tab / Shift+Tab</Key></Td><Td>Move focus between interactive elements.</Td><Td>All components.</Td></tr>
            <tr><Td><Key>Enter / Space</Key></Td><Td>Activate buttons, toggles, and links.</Td><Td>Button, Link, Search, ImageModal.</Td></tr>
            <tr><Td><Key>Arrow Keys</Key></Td><Td>Navigate within composite widgets that implement managed focus.</Td><Td>Command palette, carousel, select, code tabs.</Td></tr>
            <tr><Td><Key>Escape</Key></Td><Td>Close temporary overlays and return focus when the surface owns focus.</Td><Td>Command palette, ImageModal, Video, the site header phone sheet, dropdowns.</Td></tr>
            <tr><Td><Key>Home / End</Key></Td><Td>Jump to first or last option where the widget owns a listbox, menu, or tablist pattern.</Td><Td>Command palette, select, code tabs.</Td></tr>
          </tbody>
        </Table>
      </Section>

      <Section title='Screen Readers' description='Components use semantic HTML and proper ARIA attributes for a meaningful screen reader experience.'>
        <div className='grid gap-4 md:grid-cols-3'>
          <InfoCard title='Semantic HTML'>
            Gaudi mandates semantic elements: <InlineCode>button</InlineCode> for actions, <InlineCode>a</InlineCode> for navigation, <InlineCode>nav</InlineCode> for navigation groups, <InlineCode>main</InlineCode> for primary content, and <InlineCode>table</InlineCode> for tabular data.
          </InfoCard>
          <InfoCard title='ARIA Labels'>
            Dialogs, image modals, command triggers, icon-only links, and compact controls require accessible names. Avoid redundant ARIA when semantic HTML already provides the correct role.
          </InfoCard>
          <InfoCard title='Live Regions & Screen Reader Text'>
            Announcement banners use <InlineCode>role=&quot;status&quot;</InlineCode>. The <InlineCode>sr-only</InlineCode> utility provides screen-reader-only content for icon-only labels, hidden headings, and table headers without visible text.
          </InfoCard>
        </div>
      </Section>

      <Section title='Color & Contrast' description='All readable text color tokens must meet WCAG AA contrast on their intended backgrounds. Status, errors, and emphasis must never be conveyed through color alone.'>
        <Table>
          <thead><tr><Th>Element</Th><Th>Required Ratio</Th><Th>Token Guidance</Th></tr></thead>
          <tbody>
            <tr><Td>Normal text</Td><Td mono>4.5:1</Td><Td>Use 500 or darker shades for body copy.</Td></tr>
            <tr><Td>Large text, 18px+ or 14px+ bold</Td><Td mono>3:1</Td><Td>400 can be acceptable for headings only after contrast is checked.</Td></tr>
            <tr><Td>UI components, borders, icons</Td><Td mono>3:1</Td><Td>Meet WCAG 1.4.11 non-text contrast for interactive boundaries.</Td></tr>
            <tr><Td>Disabled elements</Td><Td mono>Exempt</Td><Td>400 shades are allowed only for disabled or inactive UI.</Td></tr>
            <tr><Td>Pill text on tinted backgrounds</Td><Td mono>4.5:1</Td><Td>Use 700 text on 100 backgrounds.</Td></tr>
          </tbody>
        </Table>

        <div className='grid gap-4 md:grid-cols-2'>
          <InfoCard title='Dark Mode'>
            Dark mode uses the <InlineCode>.dark</InlineCode> class. Semantic tokens remap to darker surfaces and lighter foregrounds. Status colors shift to lighter variants when needed to maintain contrast.
          </InfoCard>
          <InfoCard title='Never Use 400 Shades For Readable Text'>
            The 400 level is reserved for disabled or inactive elements and decorative icons. For text a user needs to read, use 500 or darker unless a contrast check proves the pairing passes.
          </InfoCard>
        </div>
      </Section>

      <Section title='Focus Management' description='Proper focus management ensures keyboard users never lose their place in the page.'>
        <div className='grid gap-4 md:grid-cols-3'>
          <InfoCard title='Focus Traps'>
            Modal overlays such as command palette, mobile navigation, video, and image previews trap or contain focus when open. Non-modal dropdowns close on Escape and outside interaction without pretending to be dialogs.
          </InfoCard>
          <InfoCard title='No Focus Rings'>
            Gaudi draws no outlines, focus rings or coloured active borders in any state. Focus still moves in a logical order, the text caret marks focused fields, and selected states use fills. Products that need a keyboard focus indicator can add one on <InlineCode>:focus-visible</InlineCode>.
          </InfoCard>
          <InfoCard title='Return Focus'>
            When overlays close, focus returns to the trigger element whenever possible. Do not leave focus on removed DOM nodes.
          </InfoCard>
        </div>
      </Section>

      <Section title='Motion Preferences' description='Gaudi respects prefers-reduced-motion. Motion should support comprehension, never be required for understanding.'>
        <div className='grid gap-4 md:grid-cols-2'>
          <InfoCard title='Reduced Motion Contract'>
            Gaudi motion primitives, Tailwind animation and transition utilities, overlays, tooltips, media reveals, and command palette states honor <InlineCode>prefers-reduced-motion</InlineCode>. Framer Motion components should disable or simplify animations when reduced motion is preferred.
          </InfoCard>
          <CodeBlock code={ `/* Gaudi disables its motion primitives and utility motion. */
@media (prefers-reduced-motion: reduce) {
  .ds-motion-disclosure,
  .ds-motion-popover,
  .animate-ping,
  .animate-pulse,
  .animate-spin {
    animation: none !important;
  }

  .ds-motion-press,
  .ds-motion-state,
  .ds-motion-toggle-track,
  .ds-motion-toggle-thumb,
  .transition,
  .transition-all,
  .transition-colors,
  .transition-transform {
    transition-duration: 0ms !important;
  }
}` } />
        </div>
      </Section>

      <Section title='Structural Patterns' description='Patterns enforced across all components for structural accessibility compliance.'>
        <Table>
          <thead><tr><Th>Pattern</Th><Th>Requirement</Th><Th>Implementation Guidance</Th></tr></thead>
          <tbody>
            <tr><Td>Icon-only controls</Td><Td>Every control without visible text must have an accessible name.</Td><Td>Use <InlineCode>aria-label</InlineCode> or visually hidden text.</Td></tr>
            <tr><Td>No nested interactive elements</Td><Td>Do not place buttons or links inside another clickable element.</Td><Td>Use styled <InlineCode>span</InlineCode> elements with <InlineCode>aria-hidden</InlineCode> for decorative inner content.</Td></tr>
            <tr><Td>Scrollable regions</Td><Td>Keyboard users must be able to reach scrollable containers.</Td><Td>Add <InlineCode>tabIndex=&#123;0&#125;</InlineCode>, <InlineCode>role=&quot;region&quot;</InlineCode>, and <InlineCode>aria-label</InlineCode>.</Td></tr>
            <tr><Td>Empty table headers</Td><Td>Columns without visible header text still need a programmatic label.</Td><Td>Add <InlineCode>sr-only</InlineCode> text for select, expand, and actions columns.</Td></tr>
          </tbody>
        </Table>
      </Section>

      <Section title='Axe-core Rules' description='All axe-core WCAG A/AA rules are enabled globally in Storybook. Violations are treated as errors.'>
        <Table>
          <thead><tr><Th>Rule</Th><Th>Description</Th><Th>Status</Th><Th>Note</Th></tr></thead>
          <tbody>
            <RuleRow rule='color-contrast' description='Text meets 4.5:1 AA contrast.' note='Readable token pairings only.' />
            <RuleRow rule='button-name' description='Buttons have accessible names.' note='Icon-only controls require labels.' />
            <RuleRow rule='link-name' description='Links have accessible names.' note='Icon links need aria-label or sr-only text.' />
            <RuleRow rule='image-alt' description='Images expose useful alt text or are hidden when decorative.' note='Required for avatars and post media.' />
            <RuleRow rule='label' description='Form inputs have associated labels.' note='Visible label or sr-only label required.' />
            <RuleRow rule='aria-dialog-name' description='Dialogs and overlays have accessible names.' note='Image modal and custom overlays require labels.' />
            <RuleRow rule='nested-interactive' description='No interactive elements nested inside others.' note='Use non-interactive decorative children.' />
            <RuleRow rule='aria-required-children' description='ARIA roles include required child roles.' note='Required for menus, lists, and composite widgets.' />
            <RuleRow rule='aria-allowed-attr' description='ARIA attributes are valid for the element role.' note='Prefer semantic attributes where possible.' />
            <RuleRow rule='scrollable-region-focusable' description='Scrollable regions are keyboard accessible.' note='tabIndex, role, and label required.' />
            <RuleRow rule='empty-table-header' description='Table headers have text content.' note='Use sr-only labels for action columns.' />
          </tbody>
        </Table>
      </Section>

      <Section title='Deferred Exceptions' description='Known limitations must be explicitly marked, documented, and tracked. Gaudi currently has no approved deferred accessibility exceptions.'>
        <div className='grid gap-4 md:grid-cols-2'>
          <InfoCard title='Allowed Only For Real Limitations'>
            Temporary exceptions are reserved for third-party rendering constraints or inherently visual demos. They must include the failing rule, reason, owner, and removal path.
          </InfoCard>
          <CodeBlock code={ `// Defer a known limitation with context
export const MyStory = {
  parameters: { a11y: { test: 'todo' } },
};

// Disable a specific axe rule for one story only
export const MyStory = {
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
};` } />
        </div>
      </Section>

      <Section title='A11y Testing' description='Gaudi uses a layered testing strategy to catch accessibility regressions before components reach consuming products.'>
        <div className='grid gap-4 md:grid-cols-2'>
          <InfoCard title='Automated axe-core'>
            <CodeBlock code='pnpm test-storybook -- --run' />
            <p className='mt-3'>The Vitest-powered Storybook suite runs WCAG A/AA axe checks for every story and fails on semantic, label, role, or contrast violations.</p>
          </InfoCard>
          <InfoCard title='Static Analysis'>
            <CodeBlock code='pnpm lint' />
            <p className='mt-3'>ESLint runs against the app, layouts, scripts, and Gaudi package. Accessibility-specific lint rules should be part of the package quality gate.</p>
          </InfoCard>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <InfoCard title='Manual Testing Checklist'>
            <CheckList items={ [
              'Navigate the entire component using only keyboard: Tab, Enter, Escape, and Arrow keys.',
              'Test with a screen reader: VoiceOver on macOS or NVDA on Windows.',
              'Verify focus order matches the visual layout.',
              'Check focus is never lost when interacting with dynamic content.',
              'Zoom to 200% and verify the layout remains usable.',
              'Test with high contrast mode enabled.',
              'Verify all images and icons have appropriate alt text or accessible names.'
            ] } />
          </InfoCard>
          <InfoCard title='Component Author Checklist'>
            <CheckList items={ [
              'Use Button for actions, never div onClick.',
              'Use anchor or Link for navigation with a real href.',
              'Use table, th, and td for tabular data.',
              'Keep heading hierarchy aligned with visual hierarchy.',
              'Use nav, main, and aside landmarks where appropriate.',
              'Make every interactive element reachable by Tab.',
              'Support Arrow keys for custom composite widgets.',
              'Ensure Escape closes overlays and returns focus.',
              'Keep a logical focus order; Gaudi draws no focus rings, so state changes use fills, not outlines.',
              'Give icon-only controls aria-label or sr-only text.',
              'Connect inputs to labels with id and htmlFor.',
              'Use aria-live for dynamic status content.',
              'Avoid redundant ARIA on semantic elements.',
              'Use 500+ text tokens for readable copy.',
              'Never convey status by color alone.',
              'Verify light and dark themes.'
            ] } />
          </InfoCard>
        </div>
      </Section>
    </Page>
  )
};
