import { useState } from 'react';
import Input from '@gaudi/design-system/core/Input';
import Textarea from '@gaudi/design-system/core/Textarea';
import Field, {
  FieldLabel,
  FieldError
} from '@gaudi/design-system/core/Field';
import RadioGroup from '@gaudi/design-system/core/RadioGroup';
import ToggleGroup from '@gaudi/design-system/core/ToggleGroup';
import Tabs, {
  TabsList,
  TabsTrigger,
  TabsContent
} from '@gaudi/design-system/core/Tabs';
import Dialog from '@gaudi/design-system/core/Dialog';
import DropdownMenu, {
  DropdownMenuItem
} from '@gaudi/design-system/core/DropdownMenu';
import Tooltip from '@gaudi/design-system/core/Tooltip';
import Button from '@gaudi/design-system/core/Button';
import EmptyState from '@gaudi/design-system/core/EmptyState';
import FileUpload from '@gaudi/design-system/core/FileUpload';
import Select from '@gaudi/design-system/core/Select';
import FilterBar from '@gaudi/design-system/core/FilterBar';
import Progress from '@gaudi/design-system/core/Progress';
import Stepper from '@gaudi/design-system/core/Stepper';
import Timeline from '@gaudi/design-system/core/Timeline';
import ToastProvider, { toast } from '@gaudi/design-system/core/Toast';
import AuthForm from '@gaudi/design-system/blocks/AuthForm';
import Wizard from '@gaudi/design-system/blocks/Wizard';
import { EditorialBoard, articleColumns } from './Workspace';
import StatCard from '@gaudi/design-system/blocks/StatCard';
import DataTable from '@gaudi/design-system/core/DataTable';
import { articles, activity, topics } from './data';
import './examples.css';
const steps = [
  { id: 'details', label: 'Details' },
  { id: 'review', label: 'Review' }
];
function Section({ title, children }) {
  return (
    <section className='ds-stack min-w-0 border-b border-border py-8'>
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
            <Button
              variant='outline'
              onClick={() => toast.success('Example saved')}
            >
              Show notification
            </Button>
          </div>
        </div>
        <div className='grid gap-4 sm:grid-cols-2'>
          <StatCard label='Articles' value='24' description='3 published this month' />
          <StatCard label='In review' value='6' description='Ready for another perspective' />
        </div>
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
