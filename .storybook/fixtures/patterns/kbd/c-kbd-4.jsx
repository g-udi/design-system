import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { Kbd } from '../../../../src/components/core/Kbd/parts/kbd.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <InputGroup className='max-w-xs'>
        <InputGroupInput aria-label='Search…' placeholder='Search…' />
        <InputGroupAddon>
          <Kbd>Space</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
