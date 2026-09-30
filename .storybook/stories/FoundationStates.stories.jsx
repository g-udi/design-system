import { expect, within } from 'storybook/test';

import Banner from '../../src/components/core/Banner';
import Button from '../../src/components/core/Button';
import { Field, FieldError, FieldInput, FieldLabel } from '../../src/components/core/Field';
import Skeleton from '../../src/components/core/Skeleton';
import Spinner from '../../src/components/core/Spinner';

import { CheckList, Page, QuickLink, Section, Table, Td, Th } from './StoryDocs';

export default {
  id: 'overview-states-recovery',
  parameters: {
    visualAudit: { wide: 'State galleries lay cards on a full-width grid.' },
    layout: 'fullscreen'
  },
  tags: [ '!autodocs' ],
  title: 'States & Recovery'
};

const stateContract = [
  [ 'Loading', 'Name the operation and preserve the destination layout.', 'Content arrives without a layout jump.' ],
  [ 'Empty', 'Explain why the area is empty and expose the next valid action.', 'Users can continue without guessing.' ],
  [ 'Error', 'Keep user input, name the problem, and state the correction.', 'The user can retry from the same context.' ],
  [ 'Success', 'Confirm the completed action without blocking the next task.', 'Feedback is announced and then recedes.' ]
];

export const Default = {
  name: 'States & Recovery',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { name: 'States & Recovery' })).toBeVisible();
    await expect(canvas.getByRole('status', { name: 'Loading articles' })).toBeVisible();
    await expect(canvas.getByRole('status', { name: 'No saved articles' })).toBeVisible();
    await expect(canvas.getByLabelText('Article slug')).toHaveValue('Design Systems');
    await expect(canvas.getByText('Use lowercase letters and hyphens only.')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Publishing unavailable' })).toBeDisabled();
    await expect(canvas.getByRole('link', { name: 'Browse article components' })).toHaveAttribute('href', './?path=/story/post-overview--default');
    await expect(canvas.getByRole('link', { name: /^Field / })).toHaveAttribute('href', './?path=/docs/core-field--docs');
    await expect(canvas.getByRole('link', { name: /^Select / })).toHaveAttribute('href', './?path=/docs/core-select--docs');
    await expect(canvas.getByRole('link', { name: /^Preview / })).toHaveAttribute('href', './?path=/docs/mdx-preview--docs');
    await expect(canvas.getByRole('link', { name: /^Mermaid / })).toHaveAttribute('href', './?path=/docs/mdx-mermaid--docs');
  },
  render: () => (
    <Page
      title='States & Recovery'
      intro='Every Gaudi workflow should explain what is happening, preserve useful context, and give the user a direct path forward when the happy path stops.'
    >
      <Section title='State Contract' description='Use the smallest state that communicates status and preserves the surrounding task.'>
        <Table>
          <thead>
            <tr><Th>State</Th><Th>Required behavior</Th><Th>Exit condition</Th></tr>
          </thead>
          <tbody>
            {stateContract.map(([ state, behavior, exit ]) => (
              <tr key={ state }><Td mono>{state}</Td><Td>{behavior}</Td><Td>{exit}</Td></tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section title='Working Examples' description='These examples preserve labels, user input, status semantics, and a visible next action.'>
        <div data-docs-example className='grid gap-5 lg:grid-cols-2'>
          <div className='rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900'>
            <div className='space-y-4'>
              <div className='flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200'>
                <Spinner label='Loading articles' size='sm' />
                Loading articles
              </div>
              <Skeleton className='h-4 w-4/5 rounded-sm' />
              <Skeleton className='h-4 w-3/5 rounded-sm' />
            </div>
          </div>

          <div role='status' aria-label='No saved articles' className='rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900'>
            <h3 className='text-base font-semibold text-gray-950 dark:text-white'>No saved articles</h3>
            <p className='mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300'>Save an article from its reading view and it will appear here.</p>
            <Button className='mt-4' href='./?path=/story/post-overview--default' size='sm' variant='outline'>Browse article components</Button>
          </div>

          <div className='rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900'>
            <Field>
              <FieldLabel htmlFor='recovery-slug'>Article slug</FieldLabel>
              <FieldInput id='recovery-slug' aria-invalid='true' defaultValue='Design Systems' />
              <FieldError>Use lowercase letters and hyphens only.</FieldError>
            </Field>
          </div>

          <div className='space-y-4 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900'>
            <Banner title='Draft saved' tone='green' variant='soft'>Your changes are available in this browser.</Banner>
            <Button disabled size='sm' variant='outline'>Publishing unavailable</Button>
          </div>
        </div>
      </Section>

      <Section title='Recovery Rules'>
        <CheckList items={ [
          'Keep valid input and selections when one part of a task fails.',
          'Put the message beside the source and move focus only when the user cannot otherwise find it.',
          'Name the problem and the next action; avoid generic messages such as “Something went wrong.”',
          'Keep primary content and destinations available when optional enrichment fails.',
          'Announce asynchronous status without replacing the visible control label.'
        ] } />
      </Section>

      <Section title='Component Guidance' description='Use focused component stories for implementation details and interaction coverage.'>
        <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
          <QuickLink title='Field' description='Persistent values, inline errors, and disabled input.' storyId='core-field--docs' />
          <QuickLink title='Select' description='Empty results, invalid state, and preserved selection.' storyId='core-select--docs' />
          <QuickLink title='Preview' description='Loading metadata and link-first fallback behavior.' storyId='mdx-preview--docs' />
          <QuickLink title='Mermaid' description='Readable diagram rendering failures.' storyId='mdx-mermaid--docs' />
        </div>
      </Section>
    </Page>
  )
};
