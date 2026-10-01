import { useState } from 'react';
import AppShell from '../../../src/components/blocks/AppShell';
import StatGroup from '../../../src/components/blocks/StatGroup';
import SettingsPanel from '../../../src/components/blocks/SettingsPanel';
import KanbanBoard from '../../../src/components/core/KanbanBoard';
import DataTable from '../../../src/components/core/DataTable';
import Field, {
  FieldLabel,
  FieldDescription
} from '../../../src/components/core/Field';
import Input from '../../../src/components/core/Input';
import Textarea from '../../../src/components/core/Textarea';
import Select from '../../../src/components/core/Select';
import Button from '../../../src/components/core/Button';
import RadioGroup from '../../../src/components/core/RadioGroup';
import Timeline from '../../../src/components/core/Timeline';
import Pill from '../../../src/components/core/Pill';
import Dialog, { DialogClose } from '../../../src/components/core/Dialog';
import Icon from '../../../src/components/core/Icon';
import ToastProvider, { toast } from '../../../src/components/core/Toast';
import { articles, activity, topics } from './data';
import './examples.css';

export const articleColumns = [
  {
    key: 'title',
    header: 'Article',
    render: (row) => <span className='font-medium'>{row.title}</span>
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Pill
        tone={
          row.status === 'Published'
            ? 'success'
            : row.status === 'In review'
              ? 'info'
              : 'neutral'
        }
        variant='soft'
      >
        {row.status}
      </Pill>
    )
  },
  { key: 'category', header: 'Category' },
  {
    key: 'words',
    header: 'Words',
    render: (row) => (
      <span className='ds-table-number'>
        {new Intl.NumberFormat('en-GB').format(row.words)}
      </span>
    )
  },
  { key: 'updated', header: 'Updated', sortable: false }
];

export function Preferences() {
  const [name, setName] = useState('Maya Chen');
  const [bio, setBio] = useState(
    'Writing about systems, research, and the craft of useful software.'
  );
  const [digest, setDigest] = useState('weekly');
  const [saved, setSaved] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSaved(true);
      }}
      onChange={() => setSaved(false)}
    >
      <SettingsPanel
        title='Public profile'
        description='Choose how you appear alongside your writing.'
      >
        <Field>
          <FieldLabel>Display name</FieldLabel>
          <Input
            name='displayName'
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel>About you</FieldLabel>
          <Textarea
            name='bio'
            value={bio}
            maxLength={300}
            onChange={(e) => setBio(e.target.value)}
          />
          <FieldDescription>{bio.length} / 300 characters</FieldDescription>
        </Field>
      </SettingsPanel>
      <SettingsPanel
        title='Reading preferences'
        description='Make room for the subjects that matter to you.'
        footer={
          <>
            <span role='status' className='ds-description'>
              {saved ? 'Preferences saved in this example.' : ''}
            </span>
            <Button type='submit' size='sm'>
              Save preferences
            </Button>
          </>
        }
      >
        <Select
          aria-label='Topics'
          multiple
          searchable
          options={topics}
          defaultValue={['engineering', 'design']}
          className='max-w-none'
        />
        <RadioGroup
          label='Email digest'
          name='digest'
          value={digest}
          onValueChange={(value) => {
            setDigest(value);
            setSaved(false);
          }}
          options={[
            {
              value: 'weekly',
              label: 'Weekly',
              description: 'A summary every Friday.'
            },
            {
              value: 'monthly',
              label: 'Monthly',
              description: 'The highlights, once a month.'
            },
            {
              value: 'off',
              label: 'Off',
              description: 'Read at your own pace.'
            }
          ]}
        />
      </SettingsPanel>
    </form>
  );
}

export function EditorialBoard() {
  const [items, setItems] = useState(
    articles
      .slice(0, 5)
      .map((article) => ({ ...article, columnId: article.status }))
  );
  return (
    <KanbanBoard
      label='Editorial workflow'
      columns={['Draft', 'In review', 'Published'].map((id) => ({
        id,
        label: id
      }))}
      items={items}
      onMove={(id, columnId) =>
        setItems((current) =>
          current.map((item) => (item.id === id ? { ...item, columnId } : item))
        )
      }
      renderItem={(item) => (
        <div className='ds-stack'>
          <p className='ds-label'>{item.title}</p>
          <span className='ds-description'>{item.author}</span>
        </div>
      )}
    />
  );
}

export function ContentWorkspace() {
  const [view, setView] = useState('Articles');
  const [records, setRecords] = useState(articles);
  const [selection, setSelection] = useState({});
  const [createOpen, setCreateOpen] = useState(false);
  const navigation = (
    <div className='example-navigation'>
      {['Articles', 'Editorial board', 'Activity', 'Settings'].map(
        (item, index) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replaceAll(' ', '-')}`}
            aria-current={view === item ? 'page' : undefined}
            onClick={(event) => {
              event.preventDefault();
              setView(item);
            }}
          >
            <Icon
              name={['FileText', 'Grid3X3', 'Clock', 'Settings'][index]}
              decorative
              size='sm'
            />
            {item}
          </a>
        )
      )}
    </div>
  );
  return (
    <>
      <ToastProvider />
      <AppShell
        brand={
          <span className='example-brand'>
            <Icon name='BookOpen' decorative size='sm' />
            Gaudi / Workspace
          </span>
        }
        navigation={navigation}
        footer={<p className='ds-description'>Example editorial workspace</p>}
        header={
          <>
            <span className='ds-label'>{view}</span>
            <span className='example-header-spacer' />
            <Pill variant='outline' tone='neutral'>
              Personal space
            </Pill>
          </>
        }
      >
        <div className='ds-stack'>
          <div className='example-page-heading'>
            <div>
              <h1>
                {view === 'Articles' ? 'Your writing, in one place.' : view}
              </h1>
              <p className='ds-description'>
                {view === 'Articles'
                  ? 'Develop ideas, keep reviews moving, and make your next piece ready to share.'
                  : 'A working composition of Gaudi components with local example data.'}
              </p>
            </div>
            {view === 'Articles' && (
              <Dialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                trigger={
                  <Button size='sm'>
                    <Icon name='Plus' decorative size='xs' />
                    New article
                  </Button>
                }
                title='Start an article'
                description='Give your draft a working title. You can change it later.'
                footer={
                  <>
                    <DialogClose asChild>
                      <Button variant='outline' tone='neutral'>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type='submit' form='new-article-form'>
                      Create draft
                    </Button>
                  </>
                }
              >
                <form
                  id='new-article-form'
                  onSubmit={(event) => {
                    event.preventDefault();
                    const title = new FormData(event.currentTarget).get(
                      'title'
                    );
                    setRecords((current) => [
                      {
                        id: `draft-${Date.now()}`,
                        title,
                        status: 'Draft',
                        category: 'Engineering',
                        words: 0,
                        updated: 'Just now'
                      },
                      ...current
                    ]);
                    setCreateOpen(false);
                    toast.success('Draft created');
                  }}
                >
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      name='title'
                      required
                      autoFocus
                      placeholder='An idea worth exploring'
                    />
                  </Field>
                </form>
              </Dialog>
            )}
          </div>
          {view === 'Articles' && (
            <>
              <StatGroup
                items={[
                  {
                    id: 'all',
                    label: 'Articles',
                    value: records.length,
                    detail: 'Across your workspace'
                  },
                  {
                    id: 'drafts',
                    label: 'Drafts',
                    value: records.filter((row) => row.status === 'Draft')
                      .length,
                    detail: 'Ideas taking shape'
                  },
                  {
                    id: 'review',
                    label: 'In review',
                    value: records.filter((row) => row.status === 'In review')
                      .length,
                    detail: 'Ready for another perspective'
                  },
                  {
                    id: 'published',
                    label: 'Published',
                    value: records.filter((row) => row.status === 'Published')
                      .length,
                    detail: 'Available to readers'
                  }
                ]}
              />
              <DataTable
                columns={articleColumns}
                rows={records}
                caption='Article library'
                searchable
                sortable
                selectable
                columnVisibility
                pagination
                pageSize={5}
                selection={selection}
                onSelectionChange={setSelection}
                renderSelectionActions={(selected) => (
                  <Button
                    size='xs'
                    variant='soft'
                    onClick={() => {
                      setRecords((current) =>
                        current.map((row) =>
                          selected.some((item) => item.id === row.id)
                            ? { ...row, status: 'In review' }
                            : row
                        )
                      );
                      setSelection({});
                      toast.success('Selected articles moved to review');
                    }}
                  >
                    Request review
                  </Button>
                )}
              />
            </>
          )}
          {view === 'Editorial board' && <EditorialBoard />}
          {view === 'Activity' && <Timeline items={activity} />}
          {view === 'Settings' && <Preferences />}
        </div>
      </AppShell>
    </>
  );
}
