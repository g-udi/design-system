import { toast } from 'sonner';
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Field className='w-full max-w-xs'>
      <InputGroup>
        <InputGroupInput
          aria-label='Share link'
          defaultValue='https://example.com/share'
          readOnly
        />
        <InputGroupAddon align='inline-end'>
          <InputGroupButton
            aria-label='Copy'
            variant='ghost'
            size='icon-xs'
            onClick={() => toast.success('Copied to clipboard')}
          >
            <RegistryIcon lucide='CopyIcon' className='size-4' />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
