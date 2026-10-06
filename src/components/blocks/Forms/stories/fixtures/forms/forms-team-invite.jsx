'use client';
import { useEffect, useState } from 'react';
import { hotkeysCoreFeature, syncDataLoaderFeature } from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import { Alert, AlertDescription, AlertTitle } from '@gaudi/design-system/core/Banner';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import { CheckboxRoot as Checkbox } from '@gaudi/design-system/core/Checkbox';
import { FieldRoot as Field, FieldContent, FieldDescriptionPrimitive as FieldDescription, FieldErrorPrimitive as FieldError, FieldGroup, FieldLabelPrimitive as FieldLabel } from '@gaudi/design-system/core/Field';
import { default as Input } from '@gaudi/design-system/core/Input';
import { SelectRoot as Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gaudi/design-system/core/Select';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import { Tree, TreeItem, TreeItemLabel } from '@gaudi/design-system/core/Tree';
import { FormErrorSummary, useFormValidation, validators } from '@gaudi/design-system/blocks/Forms';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { cn } from '@gaudi/design-system/utilities/cn';

const permissions = {
  root: { name: 'Permissions', children: ['content', 'people', 'billing', 'developer'] },
  content: { name: 'Content', children: ['content.read', 'content.write', 'content.publish'] },
  'content.read': { name: 'Read posts and drafts' },
  'content.write': { name: 'Create and edit drafts' },
  'content.publish': { name: 'Publish and unpublish' },
  people: { name: 'People', children: ['people.read', 'people.invite', 'people.remove'] },
  'people.read': { name: 'See the member list' },
  'people.invite': { name: 'Invite members' },
  'people.remove': { name: 'Remove members', sensitive: true },
  billing: { name: 'Billing', children: ['billing.read', 'billing.manage'] },
  'billing.read': { name: 'View invoices' },
  'billing.manage': { name: 'Change plan and payment method', sensitive: true },
  developer: { name: 'Developer', children: ['developer.keys', 'developer.hooks'] },
  'developer.keys': { name: 'Create API keys', sensitive: true },
  'developer.hooks': { name: 'Manage webhooks' }
};
const presets = {
  viewer: ['content.read', 'people.read'],
  editor: ['content.read', 'content.write', 'content.publish', 'people.read'],
  admin: Object.keys(permissions).filter((id) => !permissions[id].children)
};
const SEATS_LEFT = 4;
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const rules = {
  emails: [
    validators.required('Add at least one email address.'),
    (emails) => (emails.some((email) => !isEmail(email)) ? 'Fix or remove the addresses marked in red.' : ''),
    (emails) => (emails.length > SEATS_LEFT ? `You have ${SEATS_LEFT} seats left. Remove ${emails.length - SEATS_LEFT} or add seats.` : '')
  ],
  granted: validators.required('Grant at least one permission.')
};

function EmailChips({ form }) {
  const [draft, setDraft] = useState('');
  const emails = form.values.emails;
  const add = (text) => {
    const next = text.split(/[\s,;]+/).map((email) => email.trim().toLowerCase()).filter(Boolean);
    if (next.length) form.setValue('emails', [...new Set([...emails, ...next])]);
    setDraft('');
  };
  const error = form.errors.emails;
  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={form.id('emails')}>Email addresses</FieldLabel>
      <div className={cn('bg-surface flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border px-2 py-1.5 focus-within:ring-2 focus-within:ring-accent/30', error && 'border-danger')}>
        {emails.map((email) => (
          <Badge key={email} variant={isEmail(email) ? 'secondary' : 'destructive-light'} className='gap-1 pe-0.5'>
            {email}
            <Button size='icon-xs' variant='ghost' aria-label={`Remove ${email}`} onClick={() => form.setValue('emails', emails.filter((item) => item !== email))} className='size-4'>
              <RegistryIcon lucide='XIcon' aria-hidden='true' className='size-3' />
            </Button>
          </Badge>
        ))}
        <input
          id={form.id('emails')}
          value={draft}
          placeholder={emails.length ? '' : 'name@company.com, another@company.com'}
          aria-invalid={error ? true : undefined}
          aria-describedby={[form.id('emails-hint'), error ? form.errorId('emails') : null].filter(Boolean).join(' ')}
          onChange={(event) => setDraft(event.target.value)}
          onPaste={(event) => {
            event.preventDefault();
            add(event.clipboardData.getData('text'));
          }}
          onBlur={() => add(draft)}
          onKeyDown={(event) => {
            if (['Enter', ',', ' '].includes(event.key)) {
              event.preventDefault();
              add(draft);
            }
            if (event.key === 'Backspace' && !draft && emails.length) form.setValue('emails', emails.slice(0, -1));
          }}
          className='min-w-40 flex-1 bg-transparent text-sm outline-none'
        />
      </div>
      <FieldDescription id={form.id('emails-hint')}>Press Enter or comma after each address, or paste a list. {SEATS_LEFT} seats left on your plan.</FieldDescription>
      <FieldError id={form.errorId('emails')}>{error}</FieldError>
    </Field>
  );
}

function PermissionTree({ form, query }) {
  const granted = new Set(form.values.granted);
  const leaves = (id) => (permissions[id].children ? permissions[id].children.flatMap(leaves) : [id]);
  const named = (id) => permissions[id].name.toLowerCase().includes(query.toLowerCase());
  // A match keeps its ancestors visible; a matching group keeps all of its permissions.
  const matches = (id) => !query || named(id) || (permissions[id].children || []).some(matches);
  const visibleChildren = (id) => (id !== 'root' && query && named(id) ? permissions[id].children : (permissions[id].children || []).filter(matches));
  const tree = useTree({
    rootItemId: 'root',
    indent: 20,
    initialState: { expandedItems: ['content', 'people', 'billing', 'developer'] },
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => Boolean(item.getItemData()?.children),
    dataLoader: {
      getItem: (id) => permissions[id],
      getChildren: (id) => visibleChildren(id) || []
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature]
  });
  useEffect(() => {
    tree.rebuildTree();
    // Rebuild only when the search changes the visible children.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  const toggle = (id, on) => {
    const next = new Set(granted);
    leaves(id).forEach((leaf) => (on ? next.add(leaf) : next.delete(leaf)));
    form.setValues((current) => ({ ...current, role: 'custom', granted: [...next] }));
  };
  const items = tree.getItems();
  if (!items.length) return <p className='text-text-muted p-3 text-sm'>No permissions match “{query}”.</p>;
  return (
    <Tree indent={20} tree={tree} toggleIconType='chevron' aria-label='Permissions' className='p-1'>
      {items.map((item) => {
        const id = item.getId();
        const ids = leaves(id);
        const count = ids.filter((leaf) => granted.has(leaf)).length;
        const state = count === 0 ? false : count === ids.length ? true : 'indeterminate';
        return (
          <TreeItem key={id} item={item} asChild>
            <div>
              <TreeItemLabel className='not-in-data-[folder=true]:ps-5'>
                <span className='flex min-w-0 items-center gap-2'>
                  <Checkbox aria-label={item.getItemName()} checked={state} onCheckedChange={(on) => toggle(id, on === true)} onClick={(event) => event.stopPropagation()} className='size-3.5 shrink-0' />
                  <span className='truncate'>{item.getItemName()}</span>
                  {permissions[id].sensitive ? <Badge size='xs' variant='warning-light'>Sensitive</Badge> : null}
                </span>
              </TreeItemLabel>
            </div>
          </TreeItem>
        );
      })}
    </Tree>
  );
}

export function Pattern() {
  const form = useFormValidation({
    initialValues: { emails: ['sam@gaudi.dev', 'alex@northwnd'], role: 'editor', granted: presets.editor, workspace: 'publishing', expiry: '7', sso: true, message: '' },
    rules,
    validateOn: 'submit'
  });
  const [query, setQuery] = useState('');
  const [sent, setSent] = useState('');
  const { values } = form;
  const sensitive = values.granted.filter((id) => permissions[id].sensitive).map((id) => permissions[id].name.toLowerCase());

  return (
    <form
      noValidate
      aria-labelledby='invite-title'
      onSubmit={form.handleSubmit((data) => {
        setSent(`Invited ${data.emails.length} ${data.emails.length === 1 ? 'person' : 'people'} to ${data.workspace}.`);
        form.reset({ ...data, emails: [] });
      })}
      className='mx-auto grid w-full max-w-3xl grid-cols-[minmax(0,1fr)] gap-5 rounded-lg border p-5 sm:p-6'
    >
      <div className='grid gap-1'>
        <h2 id='invite-title' className='text-lg font-semibold'>Invite members</h2>
        <p className='text-text-muted text-sm'>They get an email with a link to join. Invites can be revoked until accepted.</p>
      </div>
      <FormErrorSummary form={form} labels={{ emails: 'Emails', granted: 'Permissions' }} />
      {sent ? <p role='status' className='text-success text-sm'>{sent}</p> : null}
      <EmailChips form={form} />
      <div className='grid gap-4 sm:grid-cols-3'>
        <Field>
          <FieldLabel htmlFor={form.id('role')}>Role</FieldLabel>
          <Select value={values.role} onValueChange={(role) => form.setValues((current) => ({ ...current, role, granted: role === 'custom' ? current.granted : presets[role] }))}>
            <SelectTrigger id={form.id('role')} className='w-full'><SelectValue /></SelectTrigger>
            <SelectContent position='popper'>
              <SelectItem value='viewer'>Viewer</SelectItem>
              <SelectItem value='editor'>Editor</SelectItem>
              <SelectItem value='admin'>Admin</SelectItem>
              <SelectItem value='custom'>Custom</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor={form.id('workspace')}>Workspace</FieldLabel>
          <Select value={values.workspace} onValueChange={(workspace) => form.setValue('workspace', workspace)}>
            <SelectTrigger id={form.id('workspace')} className='w-full'><SelectValue /></SelectTrigger>
            <SelectContent position='popper'>
              <SelectItem value='publishing'>Publishing</SelectItem>
              <SelectItem value='research'>Research</SelectItem>
              <SelectItem value='all'>All workspaces</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor={form.id('expiry')}>Invite expires</FieldLabel>
          <Select value={values.expiry} onValueChange={(expiry) => form.setValue('expiry', expiry)}>
            <SelectTrigger id={form.id('expiry')} className='w-full'><SelectValue /></SelectTrigger>
            <SelectContent position='popper'>
              <SelectItem value='1'>In 24 hours</SelectItem>
              <SelectItem value='7'>In 7 days</SelectItem>
              <SelectItem value='30'>In 30 days</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <Field data-invalid={form.errors.granted ? true : undefined}>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <FieldLabel htmlFor={form.id('permission-search')}>Permissions</FieldLabel>
          <span className='text-text-muted text-xs'>{values.granted.length} of {presets.admin.length} granted</span>
        </div>
        <Input id={form.id('permission-search')} type='search' placeholder='Search permissions' value={query} onChange={(event) => setQuery(event.target.value)} prefix={<RegistryIcon lucide='SearchIcon' aria-hidden='true' />} />
        <div id={form.id('granted')} className='max-h-72 overflow-y-auto rounded-md border'>
          <PermissionTree form={form} query={query} />
        </div>
        <FieldError id={form.errorId('granted')}>{form.errors.granted}</FieldError>
      </Field>
      {sensitive.length ? (
        <Alert variant='warning'>
          <RegistryIcon lucide='ShieldAlertIcon' aria-hidden='true' />
          <AlertTitle>Sensitive access</AlertTitle>
          <AlertDescription>These people will be able to {sensitive.join(', ')}. Only invite people you trust with that.</AlertDescription>
        </Alert>
      ) : null}
      <Field orientation='horizontal'>
        <FieldContent>
          <FieldLabel htmlFor={form.id('sso')}>Require single sign-on</FieldLabel>
          <FieldDescription>Invitees must join through the company identity provider.</FieldDescription>
        </FieldContent>
        <Switch id={form.id('sso')} checked={values.sso} onCheckedChange={(sso) => form.setValue('sso', sso)} />
      </Field>
      <FieldGroup>
        <div className='flex justify-end gap-2 border-t pt-4'>
          <Button type='button' variant='ghost' tone='neutral' onClick={() => form.reset()}>Cancel</Button>
          <Button type='submit'>
            <RegistryIcon lucide='SendIcon' aria-hidden='true' />
            Send {values.emails.length > 1 ? `${values.emails.length} invites` : 'invite'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
