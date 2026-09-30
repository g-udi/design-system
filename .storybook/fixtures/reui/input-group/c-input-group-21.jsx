// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
    <Field className='max-w-xs'>
      <InputGroup>
        <InputGroupInput
          aria-label='Component name...'
          placeholder='Component name...'
        />
        <InputGroupAddon align='inline-end'>
          <RegistryIcon
            lucide='StarIcon'
            className='text-ui-muted-foreground size-4'
          />
          <InputGroupButton
            aria-label='Copy'
            size='icon-xs'
            variant='ghost'
            onClick={() => toast.success('Copied to clipboard')}
          >
            <RegistryIcon lucide='CopyIcon' className='size-4' />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
