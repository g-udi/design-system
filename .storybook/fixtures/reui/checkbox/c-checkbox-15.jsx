// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle
} from '../../../../src/components/core/Field/parts/field.jsx';
export function Pattern() {
  return (
    <FieldGroup className='w-full max-w-xs'>
      <FieldLabel className='relative p-0'>
        <Field orientation='horizontal'>
          <FieldTitle className='flex items-center gap-2'>
            <Avatar>
              <AvatarImage
                src='static/images/art/3.svg'
                alt='Emma Wilson'
              />
              <AvatarFallback>EW</AvatarFallback>
            </Avatar>
            <div className='flex flex-col items-start'>
              <span className='text-sm font-semibold'>Emma Wilson</span>
              <span className='text-ui-muted-foreground text-xs'>
                @emmawilson
              </span>
            </div>
          </FieldTitle>
          <Checkbox defaultChecked />
        </Field>
      </FieldLabel>
    </FieldGroup>
  );
}
