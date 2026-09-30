import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Button from '../Button';
import Field, { FieldLabel } from '../Field';
import Icon from '../Icon';
import Input from '../Input';
import Pill from '../Pill';
import EmptyState from './EmptyState';

const docs = getComponentDocs('Core/EmptyState');
// A search that filtered everything out: the query and active filters stay visible above the empty state.
const search = { query: 'quantum annealing', filters: ['Topic: Physics', 'Year: 2024'] };

export default {
  title: 'Core/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { title: 'text', description: 'text', compact: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: {
    title: 'No matching articles',
    description: 'Nothing matches “quantum annealing” with these filters. Try a broader search, or remove a filter.',
    compact: false,
    onClearFilters: fn(),
    onBrowse: fn()
  },
  parameters: {
    docs: {
      description: { story: 'A search panel whose query and filters matched nothing. The empty state keeps the query in view, explains why, and offers a reset and a way out. `compact` tightens it for small panels.' },
      source: playgroundSource('EmptyState', {
        imports: "import { Button, EmptyState, Icon } from '@gaudi/design-system';",
        attributes: [
          "icon={<Icon name='Search' decorative size='lg' />}",
          'actions={<><Button onClick={clearFilters}>Clear filters</Button><Button variant=\'outline\' tone=\'neutral\' onClick={browse}>Browse all articles</Button></>}'
        ]
      })
    }
  },
  render: ({ onClearFilters, onBrowse, ...args }) => (
    <section aria-label='Article search' className='overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800'>
      <div className='grid gap-2 border-b border-gray-200 p-3 dark:border-gray-800'>
        <Input type='search' aria-label='Search articles' defaultValue={search.query} />
        <div className='flex flex-wrap items-center gap-1'>
          {search.filters.map((filter) => <Pill key={filter} tone='gray' variant='soft' size='sm' radius='full'>{filter}</Pill>)}
          <span className='ml-auto text-xs text-gray-500 dark:text-gray-400'>0 results</span>
        </div>
      </div>
      <EmptyState
        {...args}
        icon={<Icon name='Search' decorative size='lg' />}
        actions={(
          <>
            <Button onClick={onClearFilters}>Clear filters</Button>
            <Button variant='outline' tone='neutral' onClick={onBrowse}>Browse all articles</Button>
          </>
        )}
      />
    </section>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByText(args.title);
    const empty = title.closest('.ds-empty');
    await expect(title.tagName).toBe('P');
    await expect(canvas.getByText(args.description)).toBeVisible();
    await expect(empty.classList.contains('ds-empty-compact')).toBe(args.compact);
    await expect(empty.querySelector('.ds-empty-icon')).toHaveAttribute('aria-hidden', 'true');
    await expect(canvas.getByRole('searchbox', { name: 'Search articles' })).toHaveValue(search.query);
    await expect(canvas.queryByRole('status')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }));
    await expect(args.onClearFilters).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole('button', { name: 'Browse all articles' }));
    await expect(args.onBrowse).toHaveBeenCalledOnce();
  }
};

function FirstArticleExample() {
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [saved, setSaved] = useState(false);
  if (saved)
    return (
      <div role='status'>
        <p className='ds-title'>{title}</p>
        <p className='ds-description'>Your first draft is ready in this example.</p>
      </div>
    );
  if (creating)
    return (
      <form
        className='ds-stack'
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(true);
        }}
      >
        <Field>
          <FieldLabel>Draft title</FieldLabel>
          <Input required value={title} onChange={(event) => setTitle(event.target.value)} />
        </Field>
        <div className='ds-actions'>
          <Button type='submit'>Create draft</Button>
          <Button variant='outline' onClick={() => setCreating(false)}>Cancel</Button>
        </div>
      </form>
    );
  return (
    <EmptyState
      title='Make room for your first idea'
      description='Start a draft and build it into something worth sharing.'
      icon={<Icon name='FileText' decorative size='lg' />}
      actions={<Button onClick={() => setCreating(true)}>Write an article</Button>}
    />
  );
}
export const FirstArticle = {
  parameters: {
    docs: {
      description: {
        story: 'The decorative `icon` is hidden from assistive technology, and `actions` hands the next step to the host, which replaces the empty state when content exists.'
      }
    }
  },
  render: () => <FirstArticleExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement.querySelector('.ds-empty-icon')).toHaveAttribute('aria-hidden', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Write an article' }));
    await userEvent.type(canvas.getByRole('textbox', { name: 'Draft title' }), 'Knowledge graphs');
    await userEvent.click(canvas.getByRole('button', { name: 'Create draft' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Knowledge graphs');
  }
};
