'use client';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../../../../src/components/core/Accordion/parts/collapsible.jsx';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  NativeSelect,
  NativeSelectOption
} from '../../../../src/components/core/Select/parts/native-select.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const badgeVariant = { Required: 'warning-light', Pro: 'primary-light', Beta: 'info-light', Business: 'focus-light' };
// One data shape drives every row: a label, an optional badge, and the control it needs.
const sections = [
  {
    title: 'General',
    description: 'Defaults for everyone in the workspace.',
    rows: [
      { id: 'language', label: 'Default language', description: 'New members start in this language.', badge: 'Required', control: 'select', options: ['English (UK)', 'Deutsch', 'Français'] },
      { id: 'week', label: 'Week starts on', control: 'select', options: ['Monday', 'Sunday'] },
      { id: 'compact', label: 'Compact tables', description: 'Show more rows in lists and reports.', control: 'switch', on: true }
    ]
  },
  {
    title: 'Privacy',
    description: 'What leaves your workspace.',
    rows: [
      { id: 'analytics', label: 'Share usage analytics', description: 'Anonymous data that helps us improve.', control: 'switch', on: true },
      { id: 'ai', label: 'AI writing suggestions', description: 'Processed in the EU, never used for training.', badge: 'Beta', control: 'switch' },
      { id: 'export', label: 'Export all workspace data', description: 'A zip of documents and comments, emailed to owners.', control: 'button', action: 'Request export' }
    ]
  },
  {
    title: 'Security',
    description: 'Sign-in and session rules.',
    rows: [
      { id: 'enforce-2fa', label: 'Require two-factor sign-in', badge: 'Pro', control: 'switch', on: true },
      { id: 'sso', label: 'SAML single sign-on', description: 'Sign in through your identity provider.', badge: 'Business', control: 'button', action: 'Configure' },
      { id: 'timeout', label: 'Sign out idle sessions after', control: 'select', options: ['30 minutes', '8 hours', '7 days', 'Never'] }
    ]
  }
];
const admins = ['women/65', 'men/41', 'women/23', 'men/75'];

function Control({ row }) {
  if (row.control === 'switch') return <Switch id={row.id} defaultChecked={row.on} />;
  if (row.control === 'button') return <Button id={row.id} size='sm' variant='outline'>{row.action}</Button>;
  return (
    <NativeSelect id={row.id} size='sm' className='w-40'>
      {row.options.map((option) => (
        <NativeSelectOption key={option}>{option}</NativeSelectOption>
      ))}
    </NativeSelect>
  );
}

export function Pattern() {
  return (
    <div className='grid w-full max-w-2xl gap-3'>
      {sections.map((section, index) => (
        <Collapsible key={section.title} defaultOpen={index < 2} className='rounded-xl border'>
          <CollapsibleTrigger className='group flex w-full cursor-pointer items-center gap-3 p-4 text-left'>
            <span className='grid flex-1 gap-0.5'>
              <span className='font-medium'>{section.title}</span>
              <span className='text-text-muted text-sm'>{section.description}</span>
            </span>
            <RegistryIcon lucide='ChevronDownIcon' aria-hidden='true' className='text-text-muted size-4 transition-transform group-data-[state=closed]:-rotate-90' />
          </CollapsibleTrigger>
          <CollapsibleContent className='grid gap-4 border-t p-4'>
            {section.rows.map((row) => (
              <Field key={row.id} orientation='horizontal' className='flex-wrap'>
                <FieldContent className='min-w-48 flex-1'>
                  <FieldLabel htmlFor={row.id} className='flex items-center gap-2'>
                    {row.label}
                    {row.badge ? <Badge size='sm' variant={badgeVariant[row.badge]}>{row.badge}</Badge> : null}
                  </FieldLabel>
                  {row.description ? <FieldDescription>{row.description}</FieldDescription> : null}
                </FieldContent>
                <Control row={row} />
              </Field>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
      <div className='flex flex-wrap items-center gap-3 rounded-xl border p-4'>
        <span className='grid min-w-48 flex-1 gap-0.5'>
          <span className='font-medium'>Workspace admins</span>
          <span className='text-text-muted text-sm'>Admins can change every setting on this page.</span>
        </span>
        <AvatarGroup>
          {admins.map((portrait) => (
            <Avatar key={portrait} size='sm'>
              <AvatarImage src={`/avatars/${portrait}.jpg`} alt='' />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount>+2</AvatarGroupCount>
        </AvatarGroup>
        <Button size='sm' variant='outline'>Manage</Button>
      </div>
    </div>
  );
}
