import { useId } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Select from './Select';

const docs = getComponentDocs('Core/Select');
const topics = [
  { label: 'Design systems', value: 'design-systems' },
  { label: 'Knowledge graphs', value: 'knowledge-graphs' },
  { label: 'Semantic web', value: 'semantic-web' },
  { label: 'Linked data', value: 'linked-data' },
  { label: 'AI engineering', value: 'ai-engineering' }
];
const button = (canvas, name) => canvas.getByRole('button', { name });
const listbox = (canvas, name) => canvas.queryByRole('listbox', { name: `${name} options` });
const option = (canvas, name) => canvas.getByRole('option', { name });
const expectClosed = (canvas, name) => waitFor(() => expect(listbox(canvas, name)).not.toBeInTheDocument());

export default {
  title: 'Core/Select',
  id: 'core-select',
  component: Select,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    placeholder: 'text',
    searchable: 'boolean',
    multiple: 'boolean',
    disabled: 'boolean',
    invalid: 'boolean'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  // The popup is absolutely positioned, so reserve room for it below the trigger.
  decorators: [(Story) => <ExampleFrame className='min-h-80'><Story /></ExampleFrame>]
};

export const Playground = {
  args: {
    placeholder: 'Choose topic',
    searchable: false,
    multiple: false,
    disabled: false,
    invalid: false,
    onValueChange: fn()
  },
  parameters: {
    docs: {
      source: playgroundSource('Select', {
        imports: `import { Select } from '@gaudi/design-system';\n\nconst options = ${JSON.stringify(topics, null, 2)};`
      })
    }
  },
  render: (args) => <Select key={String(args.multiple)} options={topics} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = button(canvas, args.placeholder);
    if (args.disabled) return expect(trigger).toBeDisabled();
    if (args.invalid) await expect(trigger).toHaveAttribute('aria-invalid', 'true');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(option(canvas, topics[1].label));
    await expect(args.onValueChange.mock.lastCall[0]).toEqual(args.multiple ? [topics[1].value] : topics[1].value);
    await expect(trigger).toHaveTextContent(topics[1].label);
    if (!args.multiple) await expectClosed(canvas, args.placeholder);
  }
};

export const Searchable = {
  parameters: { docs: { description: { story: '`searchable` moves focus into a filter field. `emptyText` explains an empty result, and Escape closes without changing the selection.' } } },
  render: () => <Select searchable options={topics} placeholder='Search topics' searchPlaceholder='Search article topics...' />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(button(canvas, 'Search topics'));
    const search = canvas.getByRole('combobox', { name: 'Search article topics...' });
    await expect(search).toHaveFocus();
    await userEvent.type(search, 'AI');
    await expect(option(canvas, 'AI engineering')).toBeVisible();
    await expect(canvas.queryByRole('option', { name: 'Design systems' })).not.toBeInTheDocument();
    await userEvent.type(search, 'zzz');
    await expect(option(canvas, 'No options found.')).toBeVisible();
    await userEvent.clear(search);
    await expect(option(canvas, 'Design systems')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expectClosed(canvas, 'Search topics');
    await expect(button(canvas, 'Search topics')).toBeInTheDocument();
  }
};

export const MultiSelect = {
  parameters: { docs: { description: { story: '`multiple` takes an array value, keeps the popup open while toggling, and summarises the selection in the trigger.' } } },
  render: () => <Select multiple searchable defaultValue={[topics[0].value, topics[2].value]} options={topics} placeholder='Choose topics' />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = button(canvas, /Design systems, Semantic web/);
    await expect(trigger).toHaveTextContent('2');
    await userEvent.click(trigger);
    await expect(listbox(canvas, 'Choose topics')).toHaveAttribute('aria-multiselectable', 'true');
    await expect(option(canvas, 'Design systems')).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(option(canvas, 'AI engineering'));
    await expect(option(canvas, 'AI engineering')).toHaveAttribute('aria-selected', 'true');
    await expect(trigger).toHaveTextContent('3');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  }
};

function InvalidExample() {
  const errorId = useId();
  return (
    <div className='grid gap-1.5'>
      <Select options={topics} placeholder='Required topic' invalid aria-describedby={errorId} />
      <p id={errorId} className='text-sm text-danger'>Choose a topic before publishing.</p>
    </div>
  );
}
export const Invalid = {
  parameters: { docs: { description: { story: 'Pair `invalid` with nearby text linked through `aria-describedby`, because colour and `aria-invalid` alone do not explain the fix.' } } },
  render: () => <InvalidExample />,
  play: async ({ canvasElement }) => {
    const trigger = button(within(canvasElement), 'Required topic');
    await expect(trigger).toHaveAttribute('aria-invalid', 'true');
    await expect(trigger).toHaveAccessibleDescription('Choose a topic before publishing.');
  }
};

export const NativeOptionsInput = {
  name: 'Option children',
  parameters: { docs: { description: { story: 'Native `<option>` children are normalised when `options` is empty. The listbox takes focus on open and supports Home, End, and Enter.' } } },
  render: () => (
    <Select aria-label='Topic'>
      {topics.slice(0, 3).map(({ label, value }) => <option key={value} value={value}>{label}</option>)}
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = button(canvas, 'Topic');
    await userEvent.click(trigger);
    await waitFor(() => expect(listbox(canvas, 'Topic')).toHaveFocus());
    await userEvent.keyboard('{End}{Enter}');
    await expectClosed(canvas, 'Topic');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveTextContent(topics[2].label);
  }
};

const sections = [
  { value: 'engineering', label: 'Engineering', description: 'Systems, tools, and practical software.' },
  { value: 'archived', label: 'Archived', description: 'Not available for new articles.', disabled: true },
  { value: 'research', label: 'Research', description: 'Methods, evidence, and open questions.' }
];
export const RichOptions = {
  parameters: { docs: { description: { story: 'Options accept a `description`, which search also matches, and `disabled` options are skipped by the arrow keys.' } } },
  render: () => <Select aria-label='Publication section' searchable options={sections} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(button(canvas, 'Publication section'));
    await expect(option(canvas, /Archived/)).toHaveAttribute('aria-disabled', 'true');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(button(canvas, 'Publication section')).toHaveTextContent('Research');
  }
};

export const LoadingOptions = {
  parameters: { docs: { description: { story: '`loading` marks the listbox busy and announces `loadingText` while remote options arrive.' } } },
  render: () => <Select aria-label='Remote topics' searchable loading options={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(button(canvas, 'Remote topics'));
    await expect(listbox(canvas, 'Remote topics')).toHaveAttribute('aria-busy', 'true');
    await expect(canvas.getByRole('status')).toHaveTextContent('Loading options…');
  }
};
