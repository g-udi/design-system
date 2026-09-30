import { expect, userEvent, waitFor, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { StoryStage } from '../story-helpers';

import Select from './Select';

const componentDocs = getComponentDocs('Core/Select');

const topicOptions = [
  { label: 'Design systems', value: 'design-systems' },
  { label: 'Knowledge graphs', value: 'knowledge-graphs' },
  { label: 'Semantic web', value: 'semantic-web' },
  { label: 'Linked data', value: 'linked-data' },
  { label: 'AI engineering', value: 'ai-engineering' }
];

export default {
  component: Select,
  parameters: {
    docs: {
      description: { component: componentDocs.description },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  id: 'core-select',
  title: 'Core/Select'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Choose topic' });
    await userEvent.click(trigger);
    const listbox = canvas.getByRole('listbox', { name: 'Choose topic options' });

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => expect(listbox).toHaveFocus());

    await userEvent.keyboard('{ArrowDown}{Enter}');
    await waitFor(() => expect(canvas.queryByRole('listbox', { name: 'Choose topic options' })).not.toBeInTheDocument());
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveTextContent('Knowledge graphs');
  },
  render: () => (
    <StoryStage minHeight='min-h-72'>
      <Select options={ topicOptions.slice(0, 3) } placeholder='Choose topic' />
    </StoryStage>
  )
};

export const Searchable = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Search topics' }));
    const searchInput = canvas.getByRole('combobox', { name: 'Search article topics...' });

    await expect(searchInput).toHaveFocus();
    await userEvent.type(searchInput, 'AI');

    await expect(canvas.getByRole('option', { name: 'AI engineering' })).toBeVisible();
    await expect(canvas.queryByRole('option', { name: 'Design systems' })).not.toBeInTheDocument();

    await userEvent.clear(searchInput);
    await expect(canvas.getByRole('option', { name: 'Design systems' })).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('listbox', { name: 'Search topics options' })).not.toBeInTheDocument());
  },
  render: () => (
    <StoryStage minHeight='min-h-80'>
      <Select
        searchable
        options={ topicOptions }
        placeholder='Search topics'
        searchPlaceholder='Search article topics...'
      />
    </StoryStage>
  )
};

export const MultiSelect = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /Design systems, Semantic web/ });
    await userEvent.click(trigger);
    const listbox = canvas.getByRole('listbox', { name: 'Choose topics options' });
    const selectedTopic = canvas.getByRole('option', { name: 'Design systems' });
    const additionalTopic = canvas.getByRole('option', { name: 'AI engineering' });

    await expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
    await expect(selectedTopic).toHaveAttribute('aria-selected', 'true');
    await expect(trigger).toHaveTextContent('Design systems, Semantic web');
    await expect(trigger).toHaveTextContent('2');

    await userEvent.click(additionalTopic);
    await expect(additionalTopic).toHaveAttribute('aria-selected', 'true');
    await expect(trigger).toHaveTextContent('3');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  },
  render: () => (
    <StoryStage minHeight='min-h-80'>
      <Select
        multiple
        searchable
        defaultValue={ [ 'design-systems', 'semantic-web' ] }
        options={ topicOptions }
        placeholder='Choose topics'
      />
    </StoryStage>
  )
};

export const States = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sortTrigger = canvas.getByRole('button', { name: 'Sort posts' });
    const selectedTrigger = canvas.getByRole('button', { name: 'Design systems' });
    const requiredTrigger = canvas.getByRole('button', { name: 'Required topic' });
    const disabledTrigger = canvas.getByRole('button', { name: 'Select option' });

    await expect(sortTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(selectedTrigger).toHaveTextContent('Design systems');
    await expect(requiredTrigger).toHaveAttribute('aria-invalid', 'true');
    await expect(disabledTrigger).toBeDisabled();

    await userEvent.click(sortTrigger);
    await expect(canvas.getByRole('listbox', { name: 'Sort posts options' })).toBeVisible();
    await expect(canvas.getByRole('option', { name: 'Newest first' })).toBeVisible();
  },
  render: () => (
    <StoryStage className='grid max-w-sm content-start gap-4' minHeight='min-h-96'>
      <Select options={ [{ label: 'Newest first', value: 'newest' }, { label: 'Oldest first', value: 'oldest' }] } placeholder='Sort posts' />
      <Select options={ topicOptions } defaultValue='design-systems' />
      <Select options={ topicOptions } placeholder='Required topic' invalid />
      <Select options={ [{ label: 'Unavailable', value: 'disabled' }] } disabled />
    </StoryStage>
  )
};

export const NativeOptionsInput = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Topic from option children' });
    await userEvent.click(trigger);
    const listbox = canvas.getByRole('listbox', { name: 'Topic from option children options' });

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(listbox).toBeVisible();
    await expect(canvas.getByRole('option', { name: 'AI Engineering' })).toBeVisible();
    await expect(canvas.getByRole('option', { name: 'Knowledge Graphs' })).toBeVisible();

    await userEvent.keyboard('{End}{Enter}');
    await waitFor(() => expect(canvas.queryByRole('listbox', { name: 'Topic from option children options' })).not.toBeInTheDocument());
    await expect(trigger).toHaveTextContent('Design Systems');
  },
  render: () => (
    <StoryStage minHeight='min-h-72'>
      <Select aria-label='Topic from option children'>
        <option value='ai'>AI Engineering</option>
        <option value='kg'>Knowledge Graphs</option>
        <option value='ds'>Design Systems</option>
      </Select>
    </StoryStage>
  )
};

export const RichOptions = { render: () => <StoryStage minHeight='min-h-80'><Select aria-label='Publication topic' searchable options={[{value:'engineering',label:'Engineering',description:'Systems, tools, and practical software.'},{value:'archived',label:'Archived',description:'Not available for new articles.',disabled:true},{value:'research',label:'Research',description:'Methods, evidence, and open questions.'}]} /></StoryStage>, play: async ({canvasElement}) => {const canvas=within(canvasElement);await userEvent.click(canvas.getByRole('button',{name:'Publication topic'}));await userEvent.keyboard('{ArrowDown}{Enter}');await expect(canvas.getByRole('button',{name:'Publication topic'})).toHaveTextContent('Research');} };
export const LoadingOptions = { render: () => <StoryStage minHeight='min-h-64'><Select aria-label='Remote topics' searchable loading options={[]} /></StoryStage> };
