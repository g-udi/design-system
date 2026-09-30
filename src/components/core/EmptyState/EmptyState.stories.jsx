import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Button from '../Button';
import Field, { FieldLabel } from '../Field';
import Icon from '../Icon';
import Input from '../Input';
import EmptyState from './EmptyState';

const docs = getComponentDocs('Core/EmptyState');

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
  args: { title: 'No matching articles', description: 'Try a broader search, or remove a topic filter.', compact: false },
  parameters: {
    docs: { source: playgroundSource('EmptyState', { imports: "import { EmptyState } from '@gaudi/design-system';" }) }
  },
  render: (args) => <EmptyState {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByText(args.title);
    await expect(title.tagName).toBe('P');
    await expect(canvas.getByText(args.description)).toBeVisible();
    await expect(title.parentElement).toHaveClass('ds-empty');
    await expect(canvas.queryByRole('status')).not.toBeInTheDocument();
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
