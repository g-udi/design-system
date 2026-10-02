import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import Button from '../../components/core/Button';
import { CheckboxRoot } from '../../components/core/Checkbox/index.js';
import { useLiveAnnouncer } from '../a11y/use-live-announcer.js';
import { example, hookMeta, Readout } from '../story-helpers.jsx';
import { useSelection } from './use-selection.js';

export default {
  title: 'Hooks/Data/useSelection',
  id: 'hooks-data-useselection',
  tags: ['autodocs'],
  ...hookMeta('useSelection')
};

const initialPosts = [
  { id: 'p1', title: 'Designing calm interfaces' },
  { id: 'p2', title: 'Design tokens in practice' },
  { id: 'p3', title: 'Knowledge graphs for blogs' },
  { id: 'p4', title: 'Writing accessible charts' }
];

function BulkArchive() {
  const [ posts, setPosts ] = useState(initialPosts);
  const ids = posts.map((post) => post.id);
  const { isSelected, toggleSelection, getSelectAllState, toggleAll, clearSelection, selectedIds, count } = useSelection();
  const { announce } = useLiveAnnouncer();
  const allState = getSelectAllState(ids);
  const archive = () => {
    setPosts((current) => current.filter((post) => !selectedIds.has(post.id)));
    announce(`${count} ${count === 1 ? 'post' : 'posts'} archived`);
    clearSelection();
  };
  return (
    <div className='grid gap-3'>
      <div className='flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2'>
        <label className='flex items-center gap-2 text-sm font-medium'>
          <CheckboxRoot checked={allState === true} indeterminate={allState === 'indeterminate'} onCheckedChange={() => toggleAll(ids)} disabled={!ids.length} />
          Select all posts
        </label>
        <div className='flex items-center gap-2'>
          <Readout>{count} selected</Readout>
          <Button size='sm' tone='danger' variant='soft' disabled={!count} onClick={archive}>Archive</Button>
        </div>
      </div>
      <ul className='grid gap-2'>
        {posts.map((post) => (
          <li key={post.id}>
            <label className='flex items-center gap-2 text-sm'>
              <CheckboxRoot checked={isSelected(post.id)} onCheckedChange={() => toggleSelection(post.id)} />
              {post.title}
            </label>
          </li>
        ))}
      </ul>
      {!posts.length ? <Button size='sm' variant='outline' tone='neutral' className='w-fit' onClick={() => setPosts(initialPosts)}>Restore posts</Button> : null}
    </div>
  );
}

export const BulkActions = {
  name: 'Bulk actions with select all',
  parameters: example('Row checkboxes, a select-all checkbox that turns indeterminate for a partial selection, and a bulk action announced through `useLiveAnnouncer`.', `
import { Button, CheckboxRoot } from '@gaudi/design-system';
import { useLiveAnnouncer, useSelection } from '@gaudi/design-system/hooks';

export function PostList({ posts, onArchive }) {
  const ids = posts.map((post) => post.id);
  const { isSelected, toggleSelection, getSelectAllState, toggleAll, clearSelection, selectedIds, count } = useSelection();
  const { announce } = useLiveAnnouncer();
  const all = getSelectAllState(ids);
  return (
    <>
      <label><CheckboxRoot checked={all === true} indeterminate={all === 'indeterminate'} onCheckedChange={() => toggleAll(ids)} /> Select all posts</label>
      <Button disabled={!count} onClick={() => { onArchive([...selectedIds]); announce(\`\${count} posts archived\`); clearSelection(); }}>Archive</Button>
      {posts.map((post) => (
        <label key={post.id}><CheckboxRoot checked={isSelected(post.id)} onCheckedChange={() => toggleSelection(post.id)} /> {post.title}</label>
      ))}
    </>
  );
}`),
  render: () => <BulkArchive />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Design tokens in practice' }));
    await expect(canvas.getByText('1 selected')).toBeVisible();
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select all posts' }));
    await expect(canvas.getByText('4 selected')).toBeVisible();
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select all posts' }));
    await expect(canvas.getByText('0 selected')).toBeVisible();
  }
};

function ControlledTags() {
  const [ selected, setSelected ] = useState(() => new Set([ 'design' ]));
  const tags = [ 'design', 'engineering', 'data', 'writing' ];
  const { isSelected, toggleSelection } = useSelection({
    selectedIds: selected,
    // The host caps the selection at two tags by refusing the change.
    onSelectionChange: (next) => next.size <= 2 && setSelected(next)
  });
  return (
    <div className='grid gap-3'>
      <div role='group' aria-label='Topics' className='flex flex-wrap gap-2'>
        {tags.map((tag) => (
          <Button key={tag} size='sm' variant={isSelected(tag) ? 'solid' : 'outline'} tone={isSelected(tag) ? 'accent' : 'neutral'} aria-pressed={isSelected(tag)} onClick={() => toggleSelection(tag)}>{tag}</Button>
        ))}
      </div>
      <Readout>Pick up to two topics. Selected: {[ ...selected ].join(', ') || 'none'}</Readout>
    </div>
  );
}

export const Controlled = {
  name: 'Controlled with a limit',
  parameters: example('With `selectedIds` and `onSelectionChange` the host owns the Set and may refuse a change; here it keeps at most two topics.', `
const [selected, setSelected] = useState(() => new Set(['design']));
const { isSelected, toggleSelection } = useSelection({
  selectedIds: selected,
  onSelectionChange: (next) => next.size <= 2 && setSelected(next)
});`),
  render: () => <ControlledTags />
};
