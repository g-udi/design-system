import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '@gaudi/design-system/core/Input';
import { LoaderRoot as Loader } from '@gaudi/design-system/core/Loader';
const Row = ({ label, children }) => (
  <div className='contents'>
    <span className='text-xs text-text-muted'>{label}</span>
    <div className='flex flex-wrap items-center gap-2'>{children}</div>
  </div>
);
export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-2xl grid-cols-1 sm:grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-3'>
      <Row label='Buttons'>
        <Button disabled>
          <Loader data-icon='inline-start' /> Saving…
        </Button>
        <Button variant='secondary' disabled>
          <Loader data-icon='inline-start' /> Processing
        </Button>
        <Button variant='outline' disabled>
          <Loader data-icon='inline-start' /> Loading
        </Button>
        <Button variant='outline' size='icon' disabled aria-label='Loading'>
          <Loader />
        </Button>
      </Row>
      <Row label='Badges'>
        <Badge>
          <Loader data-icon='inline-start' /> Updating
        </Badge>
        <Badge variant='secondary'>
          <Loader data-icon='inline-start' /> Syncing
        </Badge>
        <Badge variant='outline'>
          <Loader data-icon='inline-start' /> Loading
        </Badge>
        <Badge variant='success-light'>
          <Loader data-icon='inline-start' /> Deploying
        </Badge>
        <Badge variant='destructive-light'>
          <Loader data-icon='inline-start' /> Rolling back
        </Badge>
      </Row>
      <Row label='Input'>
        <InputGroup className='w-full max-w-64'>
          <InputGroupInput aria-label='Search records' placeholder='Search records…' defaultValue='invoices' />
          <InputGroupAddon align='inline-end'>
            <Loader aria-label='Searching' />
          </InputGroupAddon>
        </InputGroup>
      </Row>
    </div>
  );
}
