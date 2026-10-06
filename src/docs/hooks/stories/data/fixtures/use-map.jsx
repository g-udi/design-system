import Button from '../../../../../components/core/Button';
import { Readout, Value } from '../../fixtures/HookReadouts.jsx';
import { useMap } from '../../../../../hooks/data/use-map.js';

const initial = [['Introduction', 'Draft'], ['Conclusion', 'Planned']];
export function DraftMap() {
  const [drafts, { set, remove, clear, reset }] = useMap(initial);
  return <div className='grid gap-3'>
    <ul aria-label='Sections' className='grid gap-2 text-sm'>
      {[...drafts].map(([name, status]) => <li key={name} className='flex flex-wrap justify-between gap-2'><span>{name}</span><Value>{status}</Value></li>)}
    </ul>
    {!drafts.size && <Readout>No sections yet.</Readout>}
    <div className='flex flex-wrap gap-2'>
      <Button onClick={() => set('Introduction', 'Ready')}>Finish introduction</Button>
      <Button variant='outline' onClick={() => remove('Conclusion')}>Remove conclusion</Button>
      <Button variant='outline' onClick={clear}>Clear</Button>
      <Button variant='ghost' onClick={reset}>Reset</Button>
    </div>
  </div>;
}
