import { useId } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import Button from '../../components/core/Button';
import Dialog from '../../components/core/Dialog';
import { example, hookMeta } from '../story-helpers.jsx';
import { useDisclosure } from './use-disclosure.js';

export default {
  title: 'Hooks/State/useDisclosure',
  id: 'hooks-state-usedisclosure',
  tags: ['autodocs'],
  ...hookMeta('useDisclosure')
};

function ShareDialog() {
  const { open, setOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button className='w-fit' onClick={onOpen}>Share post</Button>
      <Dialog open={open} onOpenChange={setOpen} title='Share post' description='Send this post to a colleague.'>
        <div className='flex justify-end gap-2'>
          <Button variant='ghost' tone='neutral' onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Send</Button>
        </div>
      </Dialog>
    </>
  );
}

export const WithDialog = {
  name: 'Drive a Gaudi Dialog',
  parameters: example('Gaudi overlays take `open` and `onOpenChange`, so pass the state straight through; `onOpen` and `onClose` read well in handlers.', `
import { Button, Dialog } from '@gaudi/design-system';
import { useDisclosure } from '@gaudi/design-system/hooks';

export function ShareDialog() {
  const { open, setOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Share post</Button>
      <Dialog open={open} onOpenChange={setOpen} title='Share post'>
        <Button onClick={onClose}>Send</Button>
      </Dialog>
    </>
  );
}`),
  render: () => <ShareDialog />
};

function Details() {
  const id = useId();
  const { open, getTriggerProps } = useDisclosure({ id });
  return (
    <div className='grid gap-2'>
      <Button variant='outline' tone='neutral' className='w-fit' {...getTriggerProps()}>{open ? 'Hide' : 'Show'} the citation</Button>
      <p id={id} hidden={!open} className='text-sm text-text-muted'>Hussein, Y. et al. (2018). Calm technology in practice.</p>
    </div>
  );
}

export const CustomTrigger = {
  name: 'Custom disclosure',
  parameters: example('`getTriggerProps()` adds `aria-expanded`, `aria-controls` and the toggle to your own button.', `
const id = useId();
const { open, getTriggerProps } = useDisclosure({ id });

<Button {...getTriggerProps()}>{open ? 'Hide' : 'Show'} the citation</Button>
<p id={id} hidden={!open}>…</p>`),
  render: () => <Details />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Show the citation' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(canvas.getByRole('button', { name: 'Hide the citation' })).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText(/Calm technology/)).toBeVisible();
  }
};
