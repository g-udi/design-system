import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { CheckboxRoot as Checkbox } from '@gaudi/design-system/core/Checkbox';
import {
  FieldRoot as Field,
  FieldContent,
  FieldDescriptionPrimitive as FieldDescription,
  FieldGroup,
  FieldLabelPrimitive as FieldLabel,
  FieldTitle
} from '@gaudi/design-system/core/Field';

const people = [
  { name: 'Ilse Valtonen', handle: '@emmawilson', avatar: '/avatars/person-20.svg', initials: 'IV', checked: true },
  { name: 'Ottilie Nakamura', handle: '@davidkim', avatar: '/avatars/person-41.svg', initials: 'ON', checked: false }
];

export function Pattern() {
  return (
    <FieldGroup className='mx-auto w-full max-w-xs gap-2'>
      {/* Leading checkbox with a title and description. */}
      <FieldLabel>
        <Field orientation='horizontal'>
          <Checkbox defaultChecked />
          <FieldContent>
            <FieldTitle>Enable notifications</FieldTitle>
            <FieldDescription>You can turn notifications off at any time.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
      {/* Trailing checkbox beside a person. */}
      {people.map((person) => (
        <FieldLabel key={person.name}>
          <Field orientation='horizontal'>
            <FieldTitle className='flex flex-1 items-center gap-2'>
              <Avatar size='sm'>
                <AvatarImage src={person.avatar} alt={person.name} />
                <AvatarFallback>{person.initials}</AvatarFallback>
              </Avatar>
              <span className='flex flex-col items-start'>
                <span className='text-sm font-semibold'>{person.name}</span>
                <span className='text-xs font-normal text-text-muted'>{person.handle}</span>
              </span>
            </FieldTitle>
            <Checkbox defaultChecked={person.checked} />
          </Field>
        </FieldLabel>
      ))}
    </FieldGroup>
  );
}
