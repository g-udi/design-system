import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { ArticleTabs, panels } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import Tabs, { TabsContent, TabsList, TabsTrigger, tabsVariants } from '../Tabs';

const docs = getComponentDocs('Core/Tabs');
const tab = (canvas, index) => canvas.getByRole('tab', { name: new RegExp(`^${panels[index].label}`) });
const exampleSource = publicSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Core/Tabs', id: 'core-tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { defaultValue: panels.filter((panel) => !panel.disabled).map((panel) => panel.value), orientation: ['horizontal', 'vertical'], variant: ['underline', 'outline', 'type'], tone: ['neutral', 'accent', 'info', 'success', 'warning', 'danger', 'discovery', 'attention'] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { defaultValue: 'overview', orientation: 'horizontal', variant: 'underline', tone: 'neutral', onValueChange: fn() },
  parameters: {
    docs: {
      description: { story: 'An article dashboard with icon triggers, counts, a locked Analytics tab, and panels holding stats, references and revisions. `defaultValue` picks the open panel, `orientation` moves the list to the side, and `variant` (on `TabsList`) chooses how the active tab is marked: a short underline, a fine outline, or weight alone; `tone` colours that underline or outline.' },
      source: { code: exampleSource, language: 'jsx' }
    }
  },
  render: (args) => <ArticleTabs key={`${args.orientation}-${args.defaultValue}`} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const start = panels.findIndex((panel) => panel.value === args.defaultValue);
    const nextIndex = (start + 1) % 3;
    const next = args.orientation === 'vertical' ? '{ArrowDown}' : '{ArrowRight}';
    await expect(tab(canvas, start)).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent(panels[start].summary);
    await userEvent.click(tab(canvas, start));
    await userEvent.keyboard(next);
    await expect(tab(canvas, nextIndex)).toHaveFocus();
    await expect(tab(canvas, nextIndex)).toHaveAttribute('aria-selected', 'true');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(panels[nextIndex].value);
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent(panels[nextIndex].summary);
    await expect(tab(canvas, 3)).toBeDisabled();
  }
};

export const ManualActivation = {
  parameters: { docs: { description: { story: '`activationMode="manual"` moves focus with the arrow keys and waits for Enter or Space to switch panels.' } } },
  render: () => <ArticleTabs activationMode='manual' />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(tab(canvas, 0));
    await userEvent.keyboard('{ArrowRight}');
    await expect(tab(canvas, 1)).toHaveFocus();
    await expect(tab(canvas, 0)).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard(' ');
    await expect(tab(canvas, 1)).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent(panels[1].summary);
  }
};

const sections = [
  ['articles', 'Articles', 'FileText', '42 published, 3 drafts'],
  ['series', 'Series', 'BookOpen', '4 series in progress'],
  ['tags', 'Tags', 'Tag', '28 tags, 6 unused'],
  ['media', 'Media', 'Image', '312 images and diagrams'],
  ['sources', 'Sources', 'Database', '87 cited references']
];
const variantNotes = {
  underline: 'A short bar under the active label. Familiar, clear and light; the default.',
  outline: 'A fine border gives the selected tab a clear boundary.',
  type: 'Selection lives in text weight and icon contrast. The quietest option.'
};

export const Variants = {
  parameters: { docs: { description: { story: 'The three ways to mark the active tab, on the same transparent triggers with no rule under the list.' } } },
  render: () => (
    <div className='grid gap-6'>
      {tabsVariants.map((variant) => (
        <div key={variant} className='grid min-w-0 gap-2'>
          <div>
            <p className='text-sm font-medium text-text'>{variant[0].toUpperCase() + variant.slice(1)}</p>
            <p className='text-xs text-text-muted'>{variantNotes[variant]}</p>
          </div>
          <Tabs defaultValue='articles'>
            <TabsList variant={variant} aria-label={`${variant} sections`}>
              {sections.map(([value, label, icon]) => (
                <TabsTrigger key={value} value={value}>
                  <RegistryIcon lucide={icon} aria-hidden='true' />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            {sections.map(([value, , , summary]) => (
              <TabsContent key={value} value={value} className='text-xs text-text-muted'>{summary}</TabsContent>
            ))}
          </Tabs>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const variant of tabsVariants) {
      const list = canvas.getByRole('tablist', { name: `${variant} sections` });
      await expect(list).toHaveAttribute('data-variant', variant);
      await userEvent.click(within(list).getByRole('tab', { name: 'Tags' }));
      await expect(within(list).getByRole('tab', { name: 'Tags' })).toHaveAttribute('aria-selected', 'true');
    }
  }
};
