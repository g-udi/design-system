import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import {
  Field,
  FieldLabel,
  FieldTitle
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  RadioGroup,
  RadioGroupItem
} from '../../../../src/components/core/RadioGroup/parts/radio-group.jsx';
export function Pattern() {
  return (
    <RadioGroup defaultValue='emma' className='w-full max-w-xs'>
      <FieldLabel htmlFor='emma-wilson' className='p-0!'>
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
          <RadioGroupItem value='emma' id='emma-wilson' />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor='john-doe' className='p-0!'>
        <Field orientation='horizontal'>
          <FieldTitle className='flex items-center gap-2'>
            <Avatar>
              <AvatarImage
                src='static/images/art/4.svg'
                alt='John Doe'
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className='flex flex-col items-start'>
              <span className='text-sm font-semibold'>John Doe</span>
              <span className='text-ui-muted-foreground text-xs'>@johndoe</span>
            </div>
          </FieldTitle>
          <RadioGroupItem value='john' id='john-doe' />
        </Field>
      </FieldLabel>
    </RadioGroup>
  );
}
