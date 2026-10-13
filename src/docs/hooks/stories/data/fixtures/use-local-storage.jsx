import { useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import Switch from '@gaudi/design-system/core/Switch';
import ToggleGroup from '@gaudi/design-system/core/ToggleGroup';
import { Readout, Value } from '../../fixtures/HookReadouts.jsx';
import { useLocalStorage } from '@gaudi/design-system/hooks/data/use-local-storage';

const sizes = { sm: '0.875rem', md: '1rem', lg: '1.25rem' };

function ReaderPreferences() {
  const [ size, setSize, resetSize ] = useLocalStorage('gaudi-docs:reader-size', 'md');
  return (
    <div className='grid gap-3'>
      <div className='flex flex-wrap items-center gap-3'>
        <span aria-hidden='true' className='text-sm font-medium'>Text size</span>
        <ToggleGroup
          type='single'
          label='Text size'
          value={size}
          onValueChange={(value) => value && setSize(value)}
          options={[ { value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' } ]}
        />
        <Button size='sm' variant='ghost' tone='neutral' onClick={resetSize}>Reset</Button>
      </div>
      <p style={{ fontSize: sizes[size] }} className='leading-7'>The preference survives a reload and follows you into other tabs.</p>
    </div>
  );
}

function NoticeA() {
  const [ dismissed, setDismissed ] = useLocalStorage('gaudi-docs:beta-notice', false);
  return <Switch label='Hide the beta notice' checked={dismissed} onCheckedChange={setDismissed} />;
}

function NoticeB() {
  const [ dismissed ] = useLocalStorage('gaudi-docs:beta-notice', false);
  return <Readout label='Another component reads'><Value>{dismissed ? 'hidden' : 'shown'}</Value></Readout>;
}

function ProjectPreferences() {
  const [ project, setProject ] = useState('articles');
  const [ density, setDensity, resetDensity ] = useLocalStorage(`gaudi-docs:project-density:${project}`, project === 'articles' ? 'comfortable' : 'compact');
  return (
    <div className='grid gap-3'>
      <ToggleGroup label='Project' value={project} onValueChange={(next) => next && setProject(next)} options={[{ value: 'articles', label: 'Articles' }, { value: 'research', label: 'Research' }]} />
      <Readout label='Density' live><Value>{density}</Value></Readout>
      <div className='flex flex-wrap gap-2'>
        <Button onClick={() => setDensity('spacious')}>Use spacious density</Button>
        <Button variant='outline' onClick={resetDensity}>Reset project density</Button>
      </div>
    </div>
  );
}

export { sizes, ReaderPreferences, NoticeA, NoticeB, ProjectPreferences };
