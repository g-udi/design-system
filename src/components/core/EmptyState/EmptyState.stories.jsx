import { previewSource } from '../../../../.storybook/stories/previewSource';
import { useState } from 'react';
import Field, { FieldLabel } from '../Field';
import Input from '../Input';
import {
  applicationDocs,
  ExampleFrame
} from '../../../../.storybook/stories/ApplicationStoryHelpers';
import EmptyState from './EmptyState';
import Button from '../Button';
import Icon from '../Icon';

export default {
  tags: ['autodocs'],
  title: 'Core/EmptyState',
  component: EmptyState,
  ...applicationDocs(
    'Empty collection, failed search, permission and recovery presentation. Supply prepared title, description, icon and action slots; compact reduces padding.',
    "import EmptyState from '@gaudi/design-system/core/EmptyState';\n\n<EmptyState title='Make room for your first idea' description='Start a draft and build it into something worth sharing.' icon={<Icon name='FileText' decorative size='lg' />} actions={<Button onClick={() => onCreateDraft()}>Write an article</Button>} />",
    'Uses ordinary prose without forcing a live region. Hosts can pass role=status or role=alert when the state changes dynamically.'
  )
};

export const FirstArticle = {
  parameters: {
    docs: {
      source: {
        code: "<EmptyState title='Make room for your first idea' description='Start a draft and build it into something worth sharing.' icon={<Icon name='FileText' decorative size='lg' />} actions={<Button onClick={() => onCreateDraft()}>Write an article</Button>} />"
      }
    }
  },
  render: () => <FirstArticleExample />
};

export const NoResults = {
  parameters: {
    docs: {
      source: {
        code: "<EmptyState compact title='No matching articles' description='Try a broader search, or remove a topic filter.' icon={<Icon name='Search' decorative size='lg' />} />"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <EmptyState
        compact
        title='No matching articles'
        description='Try a broader search, or remove a topic filter.'
        icon={<Icon name='Search' decorative size='lg' />}
      />
    </ExampleFrame>
  )
};

export const ReadOnly = {
  parameters: {
    docs: {
      source: {
        code: "<EmptyState title='This collection is private' description='Ask the collection owner for access to these notes.' icon={<Icon name='Users' decorative size='lg' />} />"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <EmptyState
        title='This collection is private'
        description='Ask the collection owner for access to these notes.'
        icon={<Icon name='Users' decorative size='lg' />}
      />
    </ExampleFrame>
  )
};

function FirstArticleExample() {
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [saved, setSaved] = useState(false);
  return (
    <ExampleFrame>
      {saved ? (
        <div role='status'>
          <p className='ds-title'>{title}</p>
          <p className='ds-description'>
            Your first draft is ready in this example.
          </p>
        </div>
      ) : creating ? (
        <form
          className='ds-stack'
          onSubmit={(event) => {
            event.preventDefault();
            setSaved(true);
          }}
        >
          <Field>
            <FieldLabel>Draft title</FieldLabel>
            <Input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </Field>
          <div className='ds-actions'>
            <Button type='submit'>Create draft</Button>
            <Button variant='outline' onClick={() => setCreating(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <EmptyState
          title='Make room for your first idea'
          description='Start a draft and build it into something worth sharing.'
          icon={<Icon name='FileText' decorative size='lg' />}
          actions={
            <Button onClick={() => setCreating(true)}>Write an article</Button>
          }
        />
      )}
    </ExampleFrame>
  );
}

export const Playground = {
  args: { title: 'No matching articles', description: 'Try a broader search or remove a filter.', compact: false },
  argTypes: { title: { control: 'text' }, description: { control: 'text' }, compact: { control: 'boolean' } },
  render: (args) => (<ExampleFrame><EmptyState {...args} /></ExampleFrame>),
  parameters: { docs: { description: { story: 'Adjust the controls to explore the component. The examples below cover complete usage patterns.' }, source: { type: 'dynamic', transform: (_, context) => previewSource('EmptyState', context.args, { imports: "import EmptyState from '@gaudi/design-system/core/EmptyState';" }) } } }
};
