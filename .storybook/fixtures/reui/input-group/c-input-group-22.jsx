// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
} from '../../../../src/components/core/Popover/parts/popover.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <InputGroup className='gap-0'>
        <InputGroupAddon>
          <Popover>
            <PopoverTrigger asChild>
              <InputGroupButton
                aria-label='Security information'
                variant='ghost'
                size='icon-xs'
                className='cursor-help'
              >
                <RegistryIcon
                  lucide='ShieldCheckIcon'
                  className='text-emerald-500'
                />
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent align='start' className='w-72'>
              <PopoverHeader>
                <PopoverTitle>Secure Connection</PopoverTitle>
                <PopoverDescription>
                  Your data is encrypted end-to-end using industry-standard
                  protocols.
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
        <InputGroupInput
          aria-label='Website address'
          defaultValue='https://example.com'
          className='pl-0.5!'
          readOnly
        />
      </InputGroup>
    </Field>
  );
}
