// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
const users = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    initials: 'AJ'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar:
      'https://randomuser.me/api/portraits/women/44.jpg',
    initials: 'SC'
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    email: 'michael@example.com',
    avatar:
      'https://randomuser.me/api/portraits/men/11.jpg',
    initials: 'MR'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    avatar:
      'https://randomuser.me/api/portraits/women/68.jpg',
    initials: 'EW'
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david@example.com',
    avatar:
      'https://randomuser.me/api/portraits/men/49.jpg',
    initials: 'DK'
  },
  {
    id: '6',
    name: 'Aron Thompson',
    email: 'lisa@example.com',
    avatar:
      'https://randomuser.me/api/portraits/men/75.jpg',
    initials: 'LT'
  },
  {
    id: '7',
    name: 'James Brown',
    email: 'james@example.com',
    avatar:
      'https://randomuser.me/api/portraits/men/54.jpg',
    initials: 'JB'
  },
  {
    id: '8',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    avatar:
      'https://randomuser.me/api/portraits/women/90.jpg',
    initials: 'MG'
  },
  {
    id: '9',
    name: 'Nick Johnson',
    email: 'nick@example.com',
    avatar:
      'https://randomuser.me/api/portraits/women/12.jpg',
    initials: 'NJ'
  },
  {
    id: '10',
    name: 'Liam Thompson',
    email: 'liam@example.com',
    avatar:
      'https://randomuser.me/api/portraits/women/65.jpg',
    initials: 'LT'
  }
];
export function Pattern() {
  const mappedUsers = users.map((user) => ({
    value: user.id,
    label: user.name,
    avatar: user.avatar,
    initials: user.initials
  }));
  return (
    <Field className='max-w-xs'>
      <Select defaultValue={mappedUsers[2].value}>
        <SelectTrigger aria-label='Select a user'>
          <SelectValue placeholder='Select a user' />
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectGroup>
            <SelectLabel>Select a user</SelectLabel>
            {mappedUsers.map((user) => (
              <SelectItem key={user.value} value={user.value}>
                <span className='flex items-center gap-2'>
                  <Avatar className='size-6'>
                    <AvatarImage src={user.avatar} alt={user.label} />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <span>{user.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
