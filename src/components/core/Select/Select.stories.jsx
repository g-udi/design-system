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

export default {
  title: 'Core/Inputs/Select',
  id: 'core-select',
  component: Select,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    multiple: 'boolean',
    searchable: 'boolean',
    defaultOpen: 'boolean',
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
    multiple: true,
    searchable: true,
    defaultOpen: true,
    disabled: false,
    invalid: false,
    onValueChange: fn()
  },
  parameters: {
    docs: {
      description: { story: 'An article topic field, open on load with two topics picked, option descriptions, and a retired topic. `multiple` summarises the set with a count, `searchable` adds the filter field, and `invalid` pairs the red border with the error text below.' },
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
    const canvas = within(canvasElement);
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
      <span id={labelId} className='text-sm font-medium text-foreground'>Topics</span>
      <Select
        key={`${args.multiple}-${open}`}
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
    const canvas = within(canvasElement);
    await userEvent.click(button(canvas, 'Search topics'));
    const search = canvas.getByRole('combobox', { name: 'Search article topics...' });
    await expect(search).toHaveFocus();
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
  parameters: { docs: { description: { story: 'Native `<option>` children are normalised when `options` is empty, `disabled` included. The listbox takes focus on open and supports Home, End, the arrow keys (which skip disabled options), and Enter.' } } },
  render: () => (
    <Select aria-label='Topic'>
      {topics.slice(0, 3).map(({ label, value }, index) => <option key={value} value={value} disabled={index === 1}>{label}</option>)}
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = button(canvas, 'Topic');
    await userEvent.click(trigger);
    await waitFor(() => expect(listbox(canvas, 'Topic')).toHaveFocus());
    await expect(option(canvas, topics[1].label)).toHaveAttribute('aria-disabled', 'true');
    await userEvent.keyboard('{End}{Home}{ArrowDown}{Enter}');
    await expectClosed(canvas, 'Topic');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveTextContent(topics[2].label);
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
