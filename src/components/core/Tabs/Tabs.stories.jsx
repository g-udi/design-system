import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Tabs, { TabsContent, TabsList, TabsTrigger } from './Tabs';

const docs = getComponentDocs('Core/Tabs');
const listLabel = 'Article details';
const panels = [
  { value: 'overview', label: 'Overview', content: 'A practical guide to knowledge graphs.' },
  { value: 'references', label: 'References', content: 'Three references support this article.' },
  { value: 'history', label: 'History', content: 'The latest revision was saved yesterday.' },
  { value: 'analytics', label: 'Analytics', disabled: true }
];
const tab = (canvas, index) => canvas.getByRole('tab', { name: panels[index].label });
const children = [
  `  <TabsList aria-label='${listLabel}'>`,
  ...panels.map(({ value, label, disabled }) => `    <TabsTrigger value='${value}'${disabled ? ' disabled' : ''}>${label}</TabsTrigger>`),
  '  </TabsList>',
  ...panels.filter((panel) => panel.content).map(({ value, content }) => `  <TabsContent value='${value}'>${content}</TabsContent>`)
].join('\n');

function ArticleTabs(props) {
  return (
    <Tabs defaultValue='overview' {...props}>
      <TabsList aria-label={listLabel}>
        {panels.map(({ value, label, disabled }) => (
          <TabsTrigger key={value} value={value} disabled={disabled}>{label}</TabsTrigger>
        ))}
      </TabsList>
      {panels.filter((panel) => panel.content).map(({ value, content }) => (
        <TabsContent key={value} value={value}>{content}</TabsContent>
      ))}
    </Tabs>
  );
}

export default {
  title: 'Core/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { orientation: ['horizontal', 'vertical'], activationMode: ['automatic', 'manual'] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { defaultValue: 'overview', orientation: 'horizontal', activationMode: 'automatic', onValueChange: fn() },
  parameters: {
    docs: {
      source: playgroundSource('Tabs', {
        imports: "import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gaudi/design-system';",
        children
      })
    }
  },
  render: (args) => <ArticleTabs key={`${args.orientation}-${args.activationMode}`} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const next = args.orientation === 'vertical' ? '{ArrowDown}' : '{ArrowRight}';
    await userEvent.click(tab(canvas, 0));
    await userEvent.keyboard(next);
    await expect(tab(canvas, 1)).toHaveFocus();
    if (args.activationMode === 'manual') await userEvent.keyboard('{Enter}');
    await expect(tab(canvas, 1)).toHaveAttribute('aria-selected', 'true');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('references');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent(panels[1].content);
    await userEvent.keyboard(`${next}${next}`);
    await expect(tab(canvas, 0)).toHaveFocus();
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
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent(panels[1].content);
  }
};
