import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';

const categories = [
  { value: 'documents', label: 'Documents', icon: 'FileTextIcon' },
  { value: 'images', label: 'Images', icon: 'ImageIcon' },
  { value: 'videos', label: 'Videos', icon: 'VideoIcon' },
  { value: 'archives', label: 'Archives', icon: 'ArchiveIcon' }
];
const statuses = [
  { value: 'all', label: 'All statuses' },
  { value: 'ready', label: 'Ready', dot: 'bg-success' },
  { value: 'building', label: 'Building', dot: 'bg-warning' },
  { value: 'queued', label: 'Queued', dot: 'bg-info' },
  { value: 'failed', label: 'Failed', dot: 'bg-danger' }
];
const members = [
  { value: 'sarah', label: 'Sarah Chen', initials: 'SC', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { value: 'alex', label: 'Alex Kim', initials: 'AK', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { value: 'maria', label: 'Maria Garcia', initials: 'MG', avatar: 'https://randomuser.me/api/portraits/women/90.jpg' },
  { value: 'james', label: 'James Wilson', initials: 'JW', avatar: 'https://randomuser.me/api/portraits/men/54.jpg' }
];
const priorities = [
  { value: 'urgent', label: 'Urgent', variant: 'destructive-light' },
  { value: 'high', label: 'High', variant: 'warning-light' },
  { value: 'medium', label: 'Medium', variant: 'info-light' },
  { value: 'low', label: 'Low', variant: 'outline' }
];
const countries = [
  { value: 'us', label: 'United States', flag: '\u{1F1FA}\u{1F1F8}' },
  { value: 'gb', label: 'United Kingdom', flag: '\u{1F1EC}\u{1F1E7}' },
  { value: 'de', label: 'Germany', flag: '\u{1F1E9}\u{1F1EA}' },
  { value: 'jp', label: 'Japan', flag: '\u{1F1EF}\u{1F1F5}' }
];
const fonts = [
  { value: 'sans', label: 'Sans serif', className: 'font-sans' },
  { value: 'serif', label: 'Serif', className: 'font-serif' },
  { value: 'mono', label: 'Monospace', className: 'font-mono' }
];

function Picker({ id, label, defaultValue, prefix, groupLabel, items, render }) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select defaultValue={defaultValue}>
        <SelectTrigger id={id} className='w-full'>
          {prefix ? (
            <span className='flex items-center gap-2'>
              <span className='text-text-muted'>{prefix}</span>
              <SelectValue />
            </span>
          ) : (
            <SelectValue />
          )}
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectGroup>
            {groupLabel && <SelectLabel>{groupLabel}</SelectLabel>}
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                <span className='flex items-center gap-2'>{render(item)}</span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}

// Option rows carry what identifies them at a glance: an icon, a status dot, an
// avatar, a badge, a flag or a live font preview. The trigger repeats it.
export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-xl gap-x-5 gap-y-6 sm:grid-cols-2'>
      <Picker
        id='select-category'
        label='Category'
        defaultValue='documents'
        items={categories}
        render={(item) => (
          <>
            <RegistryIcon lucide={item.icon} className='size-4 text-text-muted' />
            {item.label}
          </>
        )}
      />
      <Picker
        id='select-status'
        label='Status'
        defaultValue='all'
        items={statuses}
        render={(item) => (
          <>
            {item.dot && <span className={cn('size-2 shrink-0 rounded-full', item.dot)} />}
            {item.label}
          </>
        )}
      />
      <Picker
        id='select-assignee'
        label='Assignee'
        defaultValue='sarah'
        groupLabel='Assign to'
        items={members}
        render={(item) => (
          <>
            <Avatar className='size-5'>
              <AvatarImage src={item.avatar} alt='' />
              <AvatarFallback>{item.initials}</AvatarFallback>
            </Avatar>
            {item.label}
          </>
        )}
      />
      <Picker
        id='select-priority'
        label='Priority'
        defaultValue='high'
        prefix='Priority:'
        items={priorities}
        render={(item) => (
          <Badge variant={item.variant} size='sm'>
            {item.label}
          </Badge>
        )}
      />
      <Picker
        id='select-country'
        label='Country'
        defaultValue='de'
        items={countries}
        render={(item) => (
          <>
            <span aria-hidden='true'>{item.flag}</span>
            {item.label}
          </>
        )}
      />
      <Picker
        id='select-font'
        label='Font'
        defaultValue='serif'
        items={fonts}
        render={(item) => <span className={item.className}>{item.label}</span>}
      />
    </div>
  );
}
