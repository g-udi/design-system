'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { default as Field, FieldDescription, FieldError, FieldLabel } from '../../../../src/components/core/Field/index.js';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { NativeSelect, NativeSelectOption } from '../../../../src/components/core/Select/parts/native-select.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { default as Textarea } from '../../../../src/components/core/Textarea/index.js';
import { default as Wizard } from '../../../../src/components/blocks/Wizard/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const steps = [
  { id: 'people', label: 'People' },
  { id: 'roles', label: 'Roles' },
  { id: 'review', label: 'Review' }
];
const roles = { admin: ['Admin', 'Manage billing, members and every setting.'], editor: ['Editor', 'Create and publish content.'], viewer: ['Viewer', 'Read and comment.'] };
const roleBadge = { admin: 'warning-light', editor: 'info-light', viewer: 'secondary' };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const parse = (text) => [...new Set(text.split(/[\s,;]+/).map((item) => item.trim().toLowerCase()).filter(Boolean))];

export function Pattern() {
  const [text, setText] = useState('ana@gaudi.dev, li.wei@gaudi.dev\nsam@fabrikam');
  const [people, setPeople] = useState([]);
  const [checked, setChecked] = useState(false);
  const [note, setNote] = useState(true);
  const addresses = parse(text);
  const invalid = addresses.filter((address) => !emailPattern.test(address));
  const syncPeople = () =>
    setPeople((current) => addresses.map((email) => current.find((person) => person.email === email) || { email, role: email.endsWith('northwind.dev') ? 'editor' : 'viewer' }));
  return (
    <div className='w-full max-w-2xl rounded-xl border p-5'>
      <Wizard
        title='Invite your team'
        description='People get an email with a link that expires in 7 days.'
        steps={steps}
        validateStep={(index) => {
          if (index !== 0) return people.length > 0;
          const ok = addresses.length > 0 && invalid.length === 0;
          setChecked(true);
          if (ok) syncPeople();
          return ok;
        }}
        onComplete={() => new Promise((resolve) => setTimeout(resolve, 400))}
        completeLabel={people.length === 1 ? 'Send 1 invite' : `Send ${people.length} invites`}
        completionTitle='Invites sent'
        completionDescription={`${people.length} people can join once they accept.`}
      >
        {(step) =>
          step === 0 ? (
            <Field>
              <FieldLabel>Email addresses</FieldLabel>
              <Textarea rows={4} value={text} invalid={checked && (invalid.length > 0 || !addresses.length)} onChange={(event) => setText(event.target.value)} />
              <FieldDescription>Separate addresses with commas, spaces or new lines. {addresses.length} found.</FieldDescription>
              <FieldError>{checked && invalid.length ? `Fix ${invalid.join(', ')} before continuing.` : checked && !addresses.length ? 'Add at least one address.' : null}</FieldError>
            </Field>
          ) : step === 1 ? (
            <ul className='grid gap-2'>
              {people.map((person) => (
                <li key={person.email} className='flex flex-wrap items-center gap-3 rounded-lg border p-2.5'>
                  <Avatar size='sm'>
                    <AvatarFallback>{person.email[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className='min-w-0 flex-1 truncate text-sm'>{person.email}</span>
                  <NativeSelect
                    size='sm'
                    aria-label={`Role for ${person.email}`}
                    value={person.role}
                    onChange={(event) => setPeople((current) => current.map((item) => (item.email === person.email ? { ...item, role: event.target.value } : item)))}
                    className='w-28'
                  >
                    {Object.entries(roles).map(([value, [label]]) => <NativeSelectOption key={value} value={value}>{label}</NativeSelectOption>)}
                  </NativeSelect>
                  <Button size='icon-xs' variant='ghost' aria-label={`Remove ${person.email}`} disabled={people.length === 1} onClick={() => setPeople((current) => current.filter((item) => item.email !== person.email))}>
                    <RegistryIcon lucide='XIcon' />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <div className='grid gap-4 text-sm'>
              <ul className='grid gap-2'>
                {Object.entries(roles).map(([value, [label, description]]) => {
                  const count = people.filter((person) => person.role === value).length;
                  return count ? (
                    <li key={value} className='flex items-start justify-between gap-3 border-b pb-2'>
                      <span className='grid gap-0.5'>
                        <span className='flex items-center gap-2 font-medium'>
                          {count} × <Badge size='sm' variant={roleBadge[value]}>{label}</Badge>
                        </span>
                        <span className='text-text-muted text-xs'>{description}</span>
                      </span>
                      <span className='text-text-muted truncate text-xs'>{people.filter((person) => person.role === value).map((person) => person.email.split('@')[0]).join(', ')}</span>
                    </li>
                  ) : null;
                })}
              </ul>
              <div className='flex items-center justify-between gap-3'>
                <Label htmlFor='invite-note' className='font-normal'>Add a welcome note from you</Label>
                <Switch id='invite-note' checked={note} onCheckedChange={setNote} />
              </div>
            </div>
          )
        }
      </Wizard>
    </div>
  );
}
