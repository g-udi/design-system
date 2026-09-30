import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
const Row = ({ label, children }) => (
  <div className='contents'>
    <span className='text-xs text-text-muted'>{label}</span>
    <div className='flex flex-wrap items-center gap-2'>{children}</div>
  </div>
);
export function Pattern() {
  return (
    <div className='mx-auto grid w-fit grid-cols-[auto_1fr] items-center gap-x-3 gap-y-3'>
      <Row label='Buttons'>
        <Button disabled>
          <Spinner data-icon='inline-start' /> Saving…
        </Button>
        <Button variant='secondary' disabled>
          <Spinner data-icon='inline-start' /> Processing
        </Button>
        <Button variant='outline' disabled>
          <Spinner data-icon='inline-start' /> Loading
        </Button>
        <Button variant='outline' size='icon' disabled aria-label='Loading'>
          <Spinner />
        </Button>
      </Row>
      <Row label='Badges'>
        <Badge>
          <Spinner data-icon='inline-start' /> Updating
        </Badge>
        <Badge variant='secondary'>
          <Spinner data-icon='inline-start' /> Syncing
        </Badge>
        <Badge variant='outline'>
          <Spinner data-icon='inline-start' /> Loading
        </Badge>
        <Badge variant='success-light'>
          <Spinner data-icon='inline-start' /> Deploying
        </Badge>
        <Badge variant='destructive-light'>
          <Spinner data-icon='inline-start' /> Rolling back
        </Badge>
      </Row>
      <Row label='Input'>
        <InputGroup className='w-64'>
          <InputGroupInput aria-label='Search records' placeholder='Search records…' defaultValue='invoices' />
          <InputGroupAddon align='inline-end'>
            <Spinner aria-label='Searching' />
          </InputGroupAddon>
        </InputGroup>
      </Row>
    </div>
  );
}
