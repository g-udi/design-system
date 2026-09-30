import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import Avatar from '../Avatar';
import Pill from '../Pill';
import ToggleGroup from './ToggleGroup';

const docs = getComponentDocs('Core/ToggleGroup');
const exportFormats = [
  { value: 'md', label: 'Markdown' },
  { value: 'html', label: 'HTML' },
  { value: 'pdf', label: 'PDF', disabled: true }
];
const option = (canvas, name, role = 'radio') => canvas.getByRole(role, { name });
// A content library: the status filter follows the controls and filters the list; the view switch is icon-only.
const articles = [
  { title: 'Interfaces and real data', status: 'review', author: 'Sam Rivera', updated: '12 min ago' },
  { title: 'Designing for empty states', status: 'draft', author: 'Lee Chen', updated: '1 hour ago' },
  { title: 'Knowledge graphs in practice', status: 'published', author: 'Ahmad Assaf', updated: '2 days ago' },
  { title: 'Motion that respects users', status: 'draft', author: 'Sam Rivera', updated: '3 days ago' },
  { title: 'Token pipelines at scale', status: 'published', author: 'Lee Chen', updated: 'Last week' }
];
const statuses = [
  { value: 'draft', label: 'Drafts', badge: 'Draft', tone: 'gray' },
  { value: 'review', label: 'In review', badge: 'In review', tone: 'amber' },
  { value: 'published', label: 'Published', badge: 'Published', tone: 'green' },
  { value: 'archived', label: 'Archived', badge: 'Archived', tone: 'gray', disabled: true }
];
const statusOf = Object.fromEntries(statuses.map((status) => [status.value, status]));
const statusOptions = statuses.map(({ value, label, disabled }) => ({
  value,
  disabled,
  label: <>{label} <span className='ms-1 text-xs font-normal opacity-70'>{articles.filter((article) => article.status === value).length}</span></>
}));
const layouts = [
  { value: 'list', ariaLabel: 'List view', label: <RegistryIcon lucide='List' className='size-4' /> },
  { value: 'grid', ariaLabel: 'Grid view', label: <RegistryIcon lucide='LayoutGrid' className='size-4' /> }
];
const initialStatus = (type) => (type === 'multiple' ? ['draft', 'review'] : 'review');
const statusName = (value) => new RegExp(`^${statusOf[value].label}`);

function ContentLibrary({ type, disabled, onValueChange }) {
  const [status, setStatus] = useState(() => initialStatus(type));
  const [layout, setLayout] = useState('list');
  const selected = [].concat(status).filter(Boolean);
  const visible = selected.length ? articles.filter((article) => selected.includes(article.status)) : articles;
  const change = (next) => {
    setStatus(next);
    onValueChange(next);
  };
  return (
    <div className='grid gap-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <ToggleGroup label='Status' type={type} disabled={disabled} options={statusOptions} value={status} onValueChange={change} />
        <ToggleGroup label='Layout' options={layouts} value={layout} onValueChange={(next) => next && setLayout(next)} />
      </div>
      <ul data-testid='library' data-layout={layout} className={layout === 'grid' ? 'grid grid-cols-2 gap-2' : 'grid divide-y divide-border rounded-lg border border-border'}>
        {visible.map(({ title, status: value, author, updated }) => (
          <li key={title} className={layout === 'grid' ? 'grid justify-items-start gap-2 rounded-lg border border-border p-3' : 'flex items-center gap-3 px-3 py-2.5'}>
            <Avatar name={author} size='xs' />
            <div className='min-w-0 flex-1 justify-self-stretch'>
              <p className={`text-sm font-medium ${layout === 'grid' ? 'line-clamp-2' : 'truncate'}`}>{title}</p>
              <p className='text-xs text-text-muted'>{author} · {updated}</p>
            </div>
            <Pill size='xs' variant='soft' tone={statusOf[value].tone}>{statusOf[value].badge}</Pill>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default {
  title: 'Core/Actions/ToggleGroup', id: 'core-togglegroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { type: ['single', 'multiple'], disabled: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { type: 'multiple', disabled: false, onValueChange: fn() },
  parameters: {
    docs: {
      description: { story: 'A content library. The status filter follows the controls and filters the list below: `type="multiple"` combines statuses, `single` keeps one, and `disabled` locks the filter. The icon-only layout switch beside it toggles list and grid.' },
      source: playgroundSource('ToggleGroup', {
        imports: `import { ToggleGroup } from '@gaudi/design-system';\n\nconst options = ${JSON.stringify(statuses.map(({ value, label, disabled }) => ({ value, label, ...(disabled ? { disabled } : {}) })), null, 2)};`,
        attributes: ["label='Status'", 'options={options}', 'value={status}', 'onValueChange={setStatus}']
      })
    }
  },
  render: (args) => <ContentLibrary key={args.type} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const multiple = args.type === 'multiple';
    const role = multiple ? 'button' : 'radio';
    const pressed = multiple ? 'aria-pressed' : 'aria-checked';
    const library = canvas.getByTestId('library');
    for (const value of [].concat(initialStatus(args.type))) await expect(option(canvas, statusName(value), role)).toHaveAttribute(pressed, 'true');
    await expect(option(canvas, statusName('archived'), role)).toBeDisabled();
    if (args.disabled) {
      await expect(option(canvas, statusName('published'), role)).toBeDisabled();
      return;
    }
    await userEvent.click(option(canvas, statusName('published'), role));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(multiple ? ['draft', 'review', 'published'] : 'published');
    await expect(within(library).getByText('Knowledge graphs in practice')).toBeVisible();
    if (!multiple) await expect(within(library).queryByText('Interfaces and real data')).not.toBeInTheDocument();
    await userEvent.click(option(canvas, 'Grid view'));
    await expect(library).toHaveAttribute('data-layout', 'grid');
  }
};

export const DisabledOptions = {
  parameters: { docs: { description: { story: 'A disabled option stays visible but is skipped by arrow-key focus, which wraps while `loop` is on.' } } },
  render: () => <ToggleGroup label='Export format' defaultValue='md' options={exportFormats} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(option(canvas, 'PDF')).toBeDisabled();
    option(canvas, 'HTML').focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(option(canvas, 'Markdown')).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(option(canvas, 'HTML')).toHaveFocus();
  }
};
