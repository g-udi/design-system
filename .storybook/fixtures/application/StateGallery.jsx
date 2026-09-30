import { useState } from 'react';
import Input from '../../../src/components/core/Input';
import Textarea from '../../../src/components/core/Textarea';
import Field, {
  FieldLabel,
  FieldError
} from '../../../src/components/core/Field';
import RadioGroup from '../../../src/components/core/RadioGroup';
import ToggleGroup from '../../../src/components/core/ToggleGroup';
import Tabs, {
  TabsList,
  TabsTrigger,
  TabsContent
} from '../../../src/components/core/Tabs';
import Dialog from '../../../src/components/core/Dialog';
import DropdownMenu, {
  DropdownMenuItem
} from '../../../src/components/core/DropdownMenu';
import Tooltip from '../../../src/components/core/Tooltip';
import Button from '../../../src/components/core/Button';
import EmptyState from '../../../src/components/core/EmptyState';
import FileUpload from '../../../src/components/core/FileUpload';
import Select from '../../../src/components/core/Select';
import FilterBar from '../../../src/components/core/FilterBar';
import Progress from '../../../src/components/core/Progress';
import Stepper from '../../../src/components/core/Stepper';
import Timeline from '../../../src/components/core/Timeline';
import ToastProvider, { toast } from '../../../src/components/core/Toast';
import ResourceList from '../../../src/components/blocks/ResourceList';
import AuthForm from '../../../src/components/blocks/AuthForm';
import Wizard from '../../../src/components/blocks/Wizard';
import { Preferences, EditorialBoard, articleColumns } from './Workspace';
import StatGroup from '../../../src/components/blocks/StatGroup';
import DataTable from '../../../src/components/core/DataTable';
import { articles, activity, topics } from './data';
import './examples.css';
const steps = [
  { id: 'details', label: 'Details' },
  { id: 'review', label: 'Review' }
];
function Section({ title, children }) {
  return (
    <section className='ds-stack min-w-0 border-b border-gray-200 py-8 dark:border-gray-800'>
      <h2 className='ds-title'>{title}</h2>
      {children}
    </section>
  );
}
export default function StateGallery() {
  const [files, setFiles] = useState([]);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState('');
  return (
    <div className='mx-auto w-full min-w-0 max-w-7xl px-4 sm:px-6'>
      <ToastProvider />
      <header className='py-8'>
        <h1 className='text-3xl font-semibold'>Components in use</h1>
        <p className='ds-description mt-3'>
          A responsive state gallery. Every action here uses local example
          state.
        </p>
      </header>
      <Section title='Inputs and choices'>
        <div className='example-columns'>
          <div className='ds-stack'>
            <Field>
              <FieldLabel>Website</FieldLabel>
              <Input prefix='https://' placeholder='example.com' />
            </Field>
            <Field>
              <FieldLabel>Review notes</FieldLabel>
              <Textarea invalid placeholder='Explain what needs attention.' />
              <FieldError>
                Add a clear reason before returning a draft.
              </FieldError>
            </Field>
            <Select
              aria-label='Gallery topics'
              options={topics}
              multiple
              searchable
              defaultValue={['engineering']}
            />
            <Input
              aria-label='Publication date'
              type='date'
              defaultValue='2026-10-01'
            />
          </div>
          <div className='ds-stack'>
            <RadioGroup
              label='Gallery visibility'
              variant='cards'
              defaultValue='private'
              options={[
                {
                  value: 'private',
                  label: 'Private',
                  description: 'Visible only to you.'
                },
                {
                  value: 'public',
                  label: 'Public',
                  description: 'Available to readers.'
                }
              ]}
            />
            <ToggleGroup
              label='Gallery view'
              defaultValue='list'
              options={[
                { value: 'list', label: 'List' },
                { value: 'grid', label: 'Grid' },
                { value: 'board', label: 'Board' }
              ]}
            />
            <FileUpload
              files={files}
              onFilesChange={setFiles}
              multiple
              accept='.pdf,.md'
              maxFiles={3}
            />
          </div>
        </div>
      </Section>
      <Section title='Navigation and overlays'>
        <Tabs defaultValue='overview'>
          <TabsList aria-label='Gallery tabs'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='references'>References</TabsTrigger>
            <TabsTrigger value='history'>Revision history</TabsTrigger>
          </TabsList>
          <TabsContent value='overview'>
            Keep related views together without leaving the page.
          </TabsContent>
          <TabsContent value='references'>
            References stay with the writing.
          </TabsContent>
          <TabsContent value='history'>
            Earlier revisions remain available.
          </TabsContent>
        </Tabs>
        <div className='ds-actions'>
          <Dialog
            title='Edit article details'
            description='A focused form with a clear return path.'
            trigger={<Button>Edit details</Button>}
          >
            <Field>
              <FieldLabel>Article title</FieldLabel>
              <Input defaultValue='A useful idea' />
            </Field>
          </Dialog>
          <Dialog
            title='Reference details'
            variant='sheet'
            trigger={<Button variant='outline'>Open detail sheet</Button>}
          >
            <Timeline items={activity} />
          </Dialog>
          <Dialog
            variant='confirmation'
            trigger={
              <Button variant='outline' tone='danger'>
                Archive example
              </Button>
            }
            title='Archive this example?'
            description='This only changes the local example.'
            onConfirm={() => toast('Example archived')}
          />
          <DropdownMenu
            trigger={<Button variant='outline'>More actions</Button>}
          >
            <DropdownMenuItem onSelect={() => toast('Example duplicated')}>
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Publish</DropdownMenuItem>
          </DropdownMenu>
          <Tooltip content='A supplementary hint available on keyboard focus.'>
            <Button variant='ghost'>Help with this page</Button>
          </Tooltip>
        </div>
      </Section>
      <Section title='Collections and filters'>
        <FilterBar query={query} onQueryChange={setQuery} />
        <DataTable
          caption='Gallery articles'
          rows={articles.filter((row) =>
            row.title.toLowerCase().includes(query.toLowerCase())
          )}
          columns={articleColumns}
          sortable
          selectable
          pagination
          columnVisibility
          pageSize={3}
        />
        <EditorialBoard />
      </Section>
      <Section title='Feedback and activity'>
        <div className='example-columns'>
          <div className='ds-stack'>
            <Progress label='Preparing references' value={62} valueText='62%' />
            <Progress label='Checking sources' />
            <Stepper steps={steps} activeStep={1} />
            <Timeline items={activity} />
          </div>
          <div>
            <EmptyState
              title='No saved references'
              description='Add a source when you find something worth keeping.'
            />
            <ResourceList label='Loading articles' loading />
            <Button
              variant='outline'
              onClick={() => toast.success('Example saved')}
            >
              Show notification
            </Button>
          </div>
        </div>
        <StatGroup
          items={[
            {
              id: 'articles',
              label: 'Articles',
              value: '24',
              detail: '3 published this month'
            },
            {
              id: 'review',
              label: 'In review',
              value: '6',
              detail: 'Ready for another perspective'
            }
          ]}
        />
      </Section>
      <Section title='Profile and settings'>
        <Preferences />
      </Section>
      <Section title='Sign-in and guided setup'>
        <div className='example-columns'>
          <AuthForm
            mode='email'
            title='Email sign-in example'
            submitLabel='Send example link'
            onSubmit={async () => {}}
          />
          <Wizard
            title='New collection'
            steps={steps}
            validateStep={() => Boolean(draft.trim())}
            onComplete={async () => {}}
          >
            {(step) =>
              step === 0 ? (
                <Field>
                  <FieldLabel>New collection name</FieldLabel>
                  <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                  />
                </Field>
              ) : (
                <p className='ds-label'>{draft}</p>
              )
            }
          </Wizard>
        </div>
      </Section>
    </div>
  );
}
