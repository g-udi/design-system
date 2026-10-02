import { expect, userEvent, waitFor, within } from 'storybook/test';
import Button from '../../components/core/Button';
import Switch from '../../components/core/Switch';
import ToggleGroup from '../../components/core/ToggleGroup';
import { example, hookMeta, Readout, Value } from '../story-helpers.jsx';
import { useLocalStorage } from './use-local-storage.js';

export default {
  title: 'Hooks/Data/useLocalStorage',
  id: 'hooks-data-uselocalstorage',
  tags: ['autodocs'],
  ...hookMeta('useLocalStorage')
};

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

export const Preference = {
  name: 'Reading preference',
  parameters: example('A text-size choice persisted under a namespaced key. `removeValue` resets it to the initial value. Reload the page to see it kept.', `
import { Button, ToggleGroup } from '@gaudi/design-system';
import { useLocalStorage } from '@gaudi/design-system/hooks';

export function ReaderPreferences() {
  const [size, setSize, resetSize] = useLocalStorage('reader:size', 'md');
  return (
    <>
      <ToggleGroup label='Text size' value={size} onValueChange={(value) => value && setSize(value)}
        options={[{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' }]} />
      <Button variant='ghost' onClick={resetSize}>Reset</Button>
    </>
  );
}`),
  render: () => <ReaderPreferences />
};

function NoticeA() {
  const [ dismissed, setDismissed ] = useLocalStorage('gaudi-docs:beta-notice', false);
  return <Switch label='Hide the beta notice' checked={dismissed} onCheckedChange={setDismissed} />;
}

function NoticeB() {
  const [ dismissed ] = useLocalStorage('gaudi-docs:beta-notice', false);
  return <Readout label='Another component reads'><Value>{dismissed ? 'hidden' : 'shown'}</Value></Readout>;
}

export const Synced = {
  name: 'Callers stay in sync',
  parameters: example('Two components use the same key: changing one updates the other at once, and other open tabs follow through the storage event.', `
function NoticeToggle() {
  const [dismissed, setDismissed] = useLocalStorage('beta-notice', false);
  return <Switch label='Hide the beta notice' checked={dismissed} onCheckedChange={setDismissed} />;
}

function Notice() {
  const [dismissed] = useLocalStorage('beta-notice', false);
  return dismissed ? null : <Alert title='Beta'>…</Alert>;
}`),
  render: () => (
    <div className='grid gap-3'>
      <NoticeA />
      <NoticeB />
    </div>
  ),
  play: async ({ canvasElement }) => {
    window.localStorage.removeItem('gaudi-docs:beta-notice');
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('switch', { name: 'Hide the beta notice' });
    await userEvent.click(toggle);
    await waitFor(() => expect(canvas.getByText('hidden')).toBeVisible());
    await expect(window.localStorage.getItem('gaudi-docs:beta-notice')).toBe('true');
    await userEvent.click(toggle);
    await waitFor(() => expect(canvas.getByText('shown')).toBeVisible());
  }
};
