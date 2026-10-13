import { expect, within } from 'storybook/test';
import Link from '../../../components/core/Link';
import { CheckList, CodeBlock, InlineCode, Page, Section, Table, Td, Th } from '../../components/StoryDocs';
import { hookCatalogue, hookDocsId, hookGroupDescriptions, hookGroups } from '../catalogue.js';

export default {
  title: 'Hooks/Overview',
  id: 'hooks-overview',
  tags: [ '!autodocs' ],
  parameters: { layout: 'fullscreen' }
};

const rules = [
  'Every hook is SSR-safe: browser globals are read only in effects, subscriptions or guarded snapshots, and each hook documents what it returns on the server.',
  'Hooks carry behaviour, not markup. The component using one still owns roles, accessible names, focus order and announcements.',
  'Reach for a Gaudi component first: Dialog, Sheet, Popover, Tabs and menus already trap focus, lock scroll, dismiss and handle arrow keys.',
  'Callbacks passed to hooks may change on every render; hooks always call the latest one without re-subscribing.',
  'Keep product rules (validation, persistence policy, analytics) in the application; hooks only manage generic state and browser wiring.'
];

const docsHref = (hook) => `./?path=/docs/${hookDocsId(hook)}`;

export const Default = {
  name: 'Overview',
  render: () => (
    <Page
      title='Hooks'
      intro={`${hookCatalogue.length} curated React hooks for blogs and applications: keyboard and screen reader support, persisted data, browser environment, interaction, layout measurement and state. Every hook is SSR-safe and exported from @gaudi/design-system/hooks and the package root.`}
    >
      <Section title='Import' description='Import from the hooks entry, or from the package root alongside components.'>
        <CodeBlock code={`import { useHotkey, useLocalStorage, useMediaQuery } from '@gaudi/design-system/hooks';\n// or\nimport { Button, useDisclosure } from '@gaudi/design-system';`} />
      </Section>

      {hookGroups.map((group) => (
        <Section key={group} id={`group-${group.toLowerCase()}`} title={group} description={hookGroupDescriptions[group]}>
          <Table label={`${group} hooks`}>
            <thead><tr><Th>Hook</Th><Th>What it does</Th></tr></thead>
            <tbody>
              {hookCatalogue.filter((hook) => hook.group === group).map((hook) => (
                <tr key={hook.name}>
                  <Td mono>
                    <Link href={docsHref(hook)} target='_top' tone='accent' className='font-semibold underline-offset-4 hover:underline'>{hook.name}</Link>
                  </Td>
                  <Td>{hook.summary}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>
      ))}

      <Section title='Rules' description='The contract every hook in this collection follows.'>
        <CheckList items={ rules } />
        <p className='text-xs leading-6 text-text-muted'>
          Deep imports such as <InlineCode>@gaudi/design-system/hooks/state/use-step</InlineCode> also resolve, but prefer the entry so files can move.
        </p>
      </Section>

      <Section title='Coming from shadcn.io' description='Several familiar names already have an owner in Gaudi. Use these contracts when moving an example into the DS.'>
        <Table label='Hook equivalents'>
          <thead><tr><Th>Reference hook</Th><Th>Gaudi API</Th></tr></thead>
          <tbody>
            <tr><Td>useToggle</Td><Td><InlineCode>useBoolean</InlineCode> — value, toggle and setValue</Td></tr>
            <tr><Td>useClickAnywhere</Td><Td><InlineCode>useEventListener('click', callback, 'document')</InlineCode></Td></tr>
            <tr><Td>useIntersectionObserver</Td><Td><InlineCode>useInView</InlineCode> — ref, visibility and observer entry</Td></tr>
            <tr><Td>useResizeObserver</Td><Td><InlineCode>useElementSize</InlineCode> — ref and border-box dimensions</Td></tr>
            <tr><Td>useDarkMode / useTernaryDarkMode</Td><Td><InlineCode>useTheme</InlineCode> from the themes entry — mode, resolvedMode and setMode</Td></tr>
          </tbody>
        </Table>
        <p className='text-sm text-text-muted'>The APIs follow Gaudi conventions. ThemeProvider owns the persisted light, dark and system setting.</p>
      </Section>
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const hook of hookCatalogue) {
      await expect(canvas.getByRole('link', { name: hook.name })).toHaveAttribute('href', docsHref(hook));
    }
  }
};
