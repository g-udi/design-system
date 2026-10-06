import { useId } from 'react';
import Button from '../../../../../components/core/Button';
import Dialog from '../../../../../components/core/Dialog';
import { useDisclosure } from '../../../../../hooks/state/use-disclosure.js';

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

export { ShareDialog, Details };
