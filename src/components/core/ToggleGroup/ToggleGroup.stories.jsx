import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import ToggleGroup from './ToggleGroup';

const docs = getComponentDocs('Core/ToggleGroup');
const views = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid' },
  { value: 'board', label: 'Board' }
];
const formatting = [
  { value: 'bold', label: 'Bold' },
  { value: 'italic', label: 'Italic' },
  { value: 'underline', label: 'Underline' }
];
const exportFormats = [
  { value: 'md', label: 'Markdown' },
  { value: 'html', label: 'HTML' },
  { value: 'pdf', label: 'PDF', disabled: true }
];
const option = (canvas, name, role = 'radio') => canvas.getByRole(role, { name });

export default {
  title: 'Core/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { label: 'text', type: ['single', 'multiple'], disabled: 'boolean', loop: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { label: 'Collection view', type: 'single', disabled: false, loop: true, onValueChange: fn() },
  parameters: {
    docs: {
      source: playgroundSource('ToggleGroup', {
        imports: `import { ToggleGroup } from '@gaudi/design-system';\n\nconst options = ${JSON.stringify(views, null, 2)};`
      })
    }
  },
  render: (args) => <ToggleGroup key={args.type} options={views} {...args} />,
  play: async ({ args, canvasElement }) => {
    if (args.disabled) return;
    const canvas = within(canvasElement);
    const multiple = args.type === 'multiple';
    const grid = option(canvas, 'Grid', multiple ? 'button' : 'radio');
    await expect(canvas.getByLabelText(args.label)).toBeInTheDocument();
    await userEvent.click(grid);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(multiple ? ['grid'] : 'grid');
    await expect(grid).toHaveAttribute(multiple ? 'aria-pressed' : 'aria-checked', 'true');
    await userEvent.click(grid);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(multiple ? [] : '');
  }
};

export const Multiple = {
  args: { onValueChange: fn() },
  parameters: { docs: { description: { story: '`type="multiple"` takes an array value, so each option toggles independently.' } } },
  render: ({ onValueChange }) => (
    <ToggleGroup label='Text formatting' type='multiple' defaultValue={['bold']} options={formatting} onValueChange={onValueChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(option(canvas, 'Italic', 'button'));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['bold', 'italic']);
    await userEvent.click(option(canvas, 'Bold', 'button'));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['italic']);
    await expect(option(canvas, 'Italic', 'button')).toHaveAttribute('aria-pressed', 'true');
  }
};

export const DisabledOptions = {
  parameters: { docs: { description: { story: 'A disabled option stays visible but is skipped by arrow-key focus, which wraps while `loop` is on.' } } },
  render: () => <ToggleGroup label='Export format' defaultValue='md' options={exportFormats} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(option(canvas, 'PDF')).toBeDisabled();
    option(canvas, 'HTML').focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(option(canvas, 'Markdown')).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(option(canvas, 'HTML')).toHaveFocus();
  }
};
