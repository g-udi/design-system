import { useRef, useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import Button from '../../components/core/Button';
import Input from '../../components/core/Input';
import { Field, FieldLabel } from '../../components/core/Field/index.js';
import { example, hookMeta, Readout } from '../story-helpers.jsx';
import { useMergedRefs } from './use-merged-refs.js';

export default {
  title: 'Hooks/State/useMergedRefs',
  id: 'hooks-state-usemergedrefs',
  tags: ['autodocs'],
  ...hookMeta('useMergedRefs')
};

/** Keeps its own ref (to clear and refocus) while forwarding the caller's ref. */
function SearchField({ ref, label, ...props }) {
  const inputRef = useRef(null);
  const merged = useMergedRefs(ref, inputRef);
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <div className='flex gap-2'>
        <Input ref={merged} type='search' className='min-w-0 flex-1' {...props} />
        <Button variant='ghost' tone='neutral' onClick={() => {
          inputRef.current.value = '';
          inputRef.current.focus();
        }}>Clear</Button>
      </div>
    </Field>
  );
}

function Page() {
  const outer = useRef(null);
  const [ length, setLength ] = useState(null);
  return (
    <div className='grid gap-3'>
      <SearchField ref={outer} label='Search posts' defaultValue='design tokens' />
      <div className='flex flex-wrap items-center gap-3'>
        <Button size='sm' variant='outline' tone='neutral' onClick={() => setLength(outer.current?.value.length ?? 0)}>Read from the page ref</Button>
        <Readout label='Characters'>{length ?? '—'}</Readout>
      </div>
    </div>
  );
}

export const ForwardedAndOwnRef = {
  name: 'Forward a ref and keep your own',
  parameters: example('The field uses its own ref for Clear, and the page reads the same input through the ref it passed in.', `
import { Button, Input } from '@gaudi/design-system';
import { useMergedRefs } from '@gaudi/design-system/hooks';

export function SearchField({ ref, ...props }) {
  const inputRef = useRef(null);
  return (
    <>
      <Input ref={useMergedRefs(ref, inputRef)} type='search' {...props} />
      <Button onClick={() => { inputRef.current.value = ''; inputRef.current.focus(); }}>Clear</Button>
    </>
  );
}`),
  render: () => <Page />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Read from the page ref' }));
    await expect(canvas.getByText('13')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Clear' }));
    await expect(canvas.getByRole('searchbox', { name: 'Search posts' })).toHaveFocus();
  }
};
