import { useId } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import Select from '../Select';

const docs = getComponentDocs('Core/Select');
// An article's topic field: two topics already picked, descriptions to scan, and a retired topic.
const topicOptions = [
  { label: 'Design systems', value: 'design-systems', description: 'Tokens, components, and docs.' },
  { label: 'Knowledge graphs', value: 'knowledge-graphs', description: 'Ontologies and linked entities.' },
  { label: 'AI engineering', value: 'ai-engineering', description: 'Retrieval, evals, and agents.' },
  { label: 'Linked data', value: 'linked-data', description: 'Merged into Semantic web.', disabled: true },
  { label: 'Semantic web', value: 'semantic-web', description: 'RDF, SPARQL, and open data.' }
];
const picked = ['design-systems', 'ai-engineering'];
const topicHint = (invalid) => invalid ? 'Design systems needs editor approval before you publish.' : 'Readers follow these topics from the article footer.';
const button = (canvas, name) => canvas.getByRole('button', { name });
const listbox = (canvas, name) => canvas.queryByRole('listbox', { name: `${name} options` });
const option = (canvas, name) => canvas.getByRole('option', { name });
const expectClosed = (canvas, name) => waitFor(() => expect(listbox(canvas, name)).not.toBeInTheDocument());

async function checkLiveSelectProps(canvasElement) {
  const host = canvasElement.ownerDocument.createElement('div');
  canvasElement.append(host);
  const root = createRoot(host);
  const canvas = within(canvasElement.ownerDocument.body);
  const onValueChange = fn();
  const props = { 'aria-label': 'Live topic', options: topicOptions, onValueChange };
  try {
    root.render(<Select {...props} />);
    await waitFor(() => expect(button(canvas, 'Live topic')).toBeVisible());
    root.render(<Select {...props} multiple />);
    await userEvent.click(await canvas.findByRole('button', { name: 'Live topic' }));
    await userEvent.click(await canvas.findByRole('option', { name: /^Design systems/ }));
    await expect(onValueChange).toHaveBeenLastCalledWith(['design-systems'], expect.objectContaining({ value: 'design-systems' }));
    await userEvent.keyboard('{Escape}');
    root.render(<Select {...props} />);
    await waitFor(() => expect(button(canvas, 'Live topic')).toHaveTextContent('Design systems'));
    await userEvent.click(button(canvas, 'Live topic'));
    await waitFor(() => expect(listbox(canvas, 'Live topic')).toBeVisible());
    root.render(<Select {...props} disabled />);
    await waitFor(() => expect(button(canvas, 'Live topic')).toBeDisabled());
    await expectClosed(canvas, 'Live topic');
    await expect(onValueChange).toHaveBeenCalledTimes(1);
    root.render(<Select {...props} value='semantic-web' />);
    await waitFor(() => expect(button(canvas, 'Live topic')).toHaveTextContent('Semantic web'));
    await expect(button(canvas, 'Live topic')).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button(canvas, 'Live topic'));
    await userEvent.click(await canvas.findByRole('option', { name: /^Design systems/ }));
    await expect(onValueChange).toHaveBeenLastCalledWith('design-systems', expect.objectContaining({ value: 'design-systems' }));
    await expect(button(canvas, 'Live topic')).toHaveTextContent('Semantic web');
  } finally {
    root.unmount();
    host.remove();
  }
}

export default {
  title: 'Core/Select',
  id: 'core-select',
  component: Select,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    multiple: 'boolean',
    searchable: 'boolean',
    defaultOpen: 'boolean',
    disabled: 'boolean',
    invalid: 'boolean',
    loading: 'boolean'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  // Reserve room to preview the shared, portalled popup below the trigger.
  decorators: [(Story) => <ExampleFrame className='min-h-80'><Story /></ExampleFrame>]
};

export const Playground = {
  args: {
    multiple: true,
    searchable: true,
    defaultOpen: true,
    disabled: false,
    invalid: false,
    loading: false,
    onValueChange: fn()
  },
  parameters: {
    docs: {
      description: { story: 'An article topic field, open on load with two topics picked, option descriptions, and a retired topic. `multiple` summarises the set with a count, `searchable` adds the filter field, `invalid` pairs the red border with the error text below, and `loading` marks the list busy while remote options arrive.' },
      source: playgroundSource('Select', {
        imports: `import { Select } from '@gaudi/design-system';\n\nconst options = ${JSON.stringify(topicOptions, null, 2)};`,
        attributes: ["aria-labelledby='topics-label'", "aria-describedby='topics-hint'", "placeholder='Choose topics'", 'options={options}', `defaultValue={${JSON.stringify(picked)}}`],
        before: "<>\n  <span id='topics-label'>Topics</span>\n",
        after: `\n  <p id='topics-hint'>${topicHint(false)}</p>\n</>`
      })
    }
  },
  decorators: [(Story) => <div className='min-h-[23rem]'><Story /></div>],
  render: (args) => <TopicField {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const trigger = button(canvas, 'Topics');
    const summary = args.multiple ? 'Design systems, AI engineering' : 'Design systems';
    await expect(trigger).toHaveTextContent(summary);
    await expect(trigger).toHaveAccessibleDescription(topicHint(args.invalid));
    if (args.invalid) await expect(trigger).toHaveAttribute('aria-invalid', 'true');
    else await expect(trigger).not.toHaveAttribute('aria-invalid');
    if (args.disabled) {
      await expect(trigger).toBeDisabled();
      return expect(listbox(canvas, 'Choose topics')).not.toBeInTheDocument();
    }
    if (!args.defaultOpen) await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(Boolean(canvas.queryByRole('combobox'))).toBe(args.searchable);
    if (args.loading) {
      await expect(listbox(canvas, 'Choose topics')).toHaveAttribute('aria-busy', 'true');
      return expect(canvas.getByRole('status')).toHaveTextContent('Loading options…');
    }
    await expect(option(canvas, /^Linked data/)).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(option(canvas, /^Knowledge graphs/));
    await expect(args.onValueChange.mock.lastCall[0]).toEqual(args.multiple ? [...picked, 'knowledge-graphs'] : 'knowledge-graphs');
    await expect(trigger).toHaveTextContent('Knowledge graphs');
    if (!args.multiple) return expectClosed(canvas, 'Choose topics');
    // Multiple mode keeps the popup open and counts the set in the trigger.
    await expect(listbox(canvas, 'Choose topics')).toHaveAttribute('aria-multiselectable', 'true');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    for (const name of [/^Design systems/, /^Knowledge graphs/]) await expect(option(canvas, name)).toHaveAttribute('aria-selected', 'true');
    await expect(trigger).toHaveTextContent(String(picked.length + 1));
  }
};

function TopicField(args) {
  const labelId = useId();
  const hintId = useId();
  // A disabled trigger never opens, so the preview does not show an unreachable popup.
  const open = args.defaultOpen && !args.disabled;
  return (
    <div className='grid gap-1.5'>
      <span id={labelId} className='text-sm font-medium text-text'>Topics</span>
      <Select
        key={`${args.multiple}-${open}-${args.loading}`}
        aria-labelledby={labelId}
        aria-describedby={hintId}
        placeholder='Choose topics'
        options={topicOptions}
        defaultValue={picked}
        {...args}
        defaultOpen={open}
      />
      <p id={hintId} className={args.invalid ? 'm-0 text-sm text-danger' : 'm-0 text-sm text-text-muted'}>{topicHint(args.invalid)}</p>
    </div>
  );
}

export const Searchable = {
  parameters: { docs: { description: { story: '`searchable` moves focus into a filter field that matches labels and descriptions. `emptyText` explains an empty result, and Escape closes without changing the selection.' } } },
  render: () => <Select searchable options={topicOptions} placeholder='Search topics' searchPlaceholder='Search article topics...' />,
  play: async ({ canvasElement }) => {
    await checkLiveSelectProps(canvasElement);
    const canvas = within(canvasElement.ownerDocument.body);
    await userEvent.click(button(canvas, 'Search topics'));
    const search = await canvas.findByRole('combobox', { name: 'Search article topics...' });
    await waitFor(() => expect(search).toHaveFocus());
    await userEvent.type(search, 'SPARQL');
    await expect(option(canvas, /^Semantic web/)).toBeVisible();
    await expect(canvas.queryByRole('option', { name: /^Design systems/ })).not.toBeInTheDocument();
    await userEvent.type(search, 'zzz');
    await expect(option(canvas, 'No options found.')).toBeVisible();
    await userEvent.clear(search);
    await expect(option(canvas, /^Design systems/)).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expectClosed(canvas, 'Search topics');
    await expect(button(canvas, 'Search topics')).toBeInTheDocument();
  }
};

export const NativeOptionsInput = {
  name: 'Option children',
  args: { onValueChange: fn() },
  parameters: { docs: { description: { story: 'Native `<option>` children are normalised when `options` is empty, `disabled` included. The listbox takes focus on open and supports Home, End, the arrow keys, and Enter. Disabled options remain discoverable with the keyboard but cannot be selected.' } } },
  render: (args) => (
    <Select aria-label='Topic' onValueChange={args.onValueChange}>
      {topicOptions.slice(0, 3).map(({ label, value }, index) => <option key={value} value={value} disabled={index === 1}>{label}</option>)}
    </Select>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const trigger = button(canvas, 'Topic');
    await userEvent.click(trigger);
    await waitFor(() => expect(listbox(canvas, 'Topic')).toHaveFocus());
    const first = option(canvas, topicOptions[0].label);
    const disabled = option(canvas, topicOptions[1].label);
    const last = option(canvas, topicOptions[2].label);
    await expect(disabled).toHaveAttribute('aria-disabled', 'true');
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(listbox(canvas, 'Topic')).toHaveAttribute('aria-activedescendant', last.id));
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(listbox(canvas, 'Topic')).toHaveAttribute('aria-activedescendant', first.id));
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(listbox(canvas, 'Topic')).toHaveAttribute('aria-activedescendant', disabled.id));
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(disabled).toHaveAttribute('aria-selected', 'false');
    await expect(args.onValueChange).not.toHaveBeenCalled();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(listbox(canvas, 'Topic')).toHaveAttribute('aria-activedescendant', last.id));
    await userEvent.keyboard('{Enter}');
    await expectClosed(canvas, 'Topic');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveTextContent(topicOptions[2].label);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(topicOptions[2].value, expect.objectContaining({ label: topicOptions[2].label, value: topicOptions[2].value }));
  }
};
