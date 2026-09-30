import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle
} from '../../../../src/components/core/Field/parts/field.jsx';

const people = [
  { name: 'Emma Wilson', handle: '@emmawilson', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', initials: 'EW', checked: true },
  { name: 'David Kim', handle: '@davidkim', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', initials: 'DK', checked: false }
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
