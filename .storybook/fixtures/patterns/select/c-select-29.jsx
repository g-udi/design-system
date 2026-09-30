import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
const members = [
  {
    value: 'sarah',
    label: 'Sarah Chen',
    initials: 'SC',
    avatar:
      'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    value: 'alex',
    label: 'Alex Kim',
    initials: 'AK',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    value: 'maria',
    label: 'Maria Garcia',
    initials: 'MG',
    avatar:
      'https://randomuser.me/api/portraits/women/90.jpg'
  },
  {
    value: 'james',
    label: 'James Wilson',
    initials: 'JW',
    avatar:
      'https://randomuser.me/api/portraits/men/54.jpg'
  }
];
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <Select defaultValue={members[0].value}>
        <SelectTrigger aria-label='Select member'>
          <SelectValue placeholder='Select member' />
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectGroup>
            <SelectLabel>Assign to</SelectLabel>
            {members.map((member) => (
              <SelectItem key={member.value} value={member.value}>
                <span className='flex items-center gap-2'>
                  <Avatar className='size-6'>
                    <AvatarImage src={member.avatar} alt={member.label} />
                    <AvatarFallback className='text-xs'>
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span>{member.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
