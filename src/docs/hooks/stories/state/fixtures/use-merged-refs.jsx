import { useRef, useState } from 'react';
import Button from '../../../../../components/core/Button';
import Input from '../../../../../components/core/Input';
import { Field, FieldLabel } from '../../../../../components/core/Field/index.js';
import { Readout } from '../../fixtures/HookReadouts.jsx';
import { useMergedRefs } from '../../../../../hooks/state/use-merged-refs.js';

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

export { SearchField, Page };
