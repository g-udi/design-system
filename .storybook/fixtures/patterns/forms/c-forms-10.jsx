'use client';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../../../../src/components/core/Banner/parts/alert-extended.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import { CodeBlockGroup } from '../../../../src/components/core/CodeBlock/parts/code-block-group.jsx';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '../../../../src/components/core/Field/parts/field.jsx';
import { default as Input } from '../../../../src/components/core/Input/index.js';
import { default as RadioGroup } from '../../../../src/components/core/RadioGroup/index.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../src/components/core/Select/parts/select.jsx';
import { default as Textarea } from '../../../../src/components/core/Textarea/index.js';
import { FormErrorSummary, useFormValidation, validators } from '../../../../src/components/blocks/Forms/Forms.jsx';
import { useCopyToClipboard } from '../../../../src/hooks/interaction/use-copy-to-clipboard.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const existing = [
  { id: 'k1', name: 'Website build', env: 'production', prefix: 'gd_live_4f1a', created: 'Jun 2, 2026', expires: 'Never' },
  { id: 'k2', name: 'Preview deploys', env: 'staging', prefix: 'gd_test_92cc', created: 'Aug 19, 2026', expires: 'Nov 17, 2026' }
];
const scopes = [
  { id: 'posts', label: 'Posts' },
  { id: 'media', label: 'Media' },
  { id: 'members', label: 'Members' }
];
const cidr = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}(\/([12]?\d|3[0-2]))?$/;
const lines = (value) => String(value).split(/\n|,/).map((line) => line.trim()).filter(Boolean);
const rules = {
  name: [
    validators.required('Name the key so you recognise it later.'),
    (value, values) => (values.keys.some((key) => key.name.toLowerCase() === String(value).trim().toLowerCase()) ? 'A key with this name already exists.' : '')
  ],
  access: (access) => (Object.values(access).every((level) => level === 'none') ? 'Give the key access to at least one resource.' : ''),
  allow: (value) => {
    const bad = lines(value).filter((line) => !cidr.test(line));
    return bad.length ? `Not an IP or range: ${bad.join(', ')}.` : '';
  }
};
// Demo secrets: a real key comes from the server. `seed` varies the characters per key.
const secretFor = (env, seed = '') => `gd_${env === 'production' ? 'live' : 'test'}_${Array.from({ length: 24 }, (_, index) => '0123456789abcdef'[(index * 7 + env.length + seed.length * 3) % 16]).join('')}`;
const snippets = (name, secret) => [
  { title: 'Next.js', language: 'bash', code: `# .env.local\nGAUDI_API_KEY=${secret}` },
  { title: 'Vite', language: 'bash', code: `# .env — expose only on the server\nGAUDI_API_KEY=${secret}` },
  { title: 'Node', language: 'js', code: `// ${name}\nimport 'dotenv/config';\nconst apiKey = process.env.GAUDI_API_KEY;` },
  { title: 'Docker', language: 'yaml', code: `services:\n  web:\n    environment:\n      GAUDI_API_KEY: ${secret}` }
];

export function Pattern() {
  const form = useFormValidation({
    initialValues: { name: '', env: 'staging', access: { posts: 'read', media: 'none', members: 'none' }, expiry: '90', allow: '', keys: existing, confirmProduction: false },
    rules,
    validateOn: 'submit'
  });
  const [created, setCreated] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const { values, errors } = form;
  const setAccess = (scope, level) => form.setValue('access', { ...values.access, [scope]: level });

  const create = form.handleSubmit((data) => {
    const secret = secretFor(data.env);
    setCreated({ name: data.name.trim(), secret });
    setRevealed(false);
    form.reset({ ...data, name: '', keys: [{ id: `k${data.keys.length + 1}`, name: data.name.trim(), env: data.env, prefix: secret.slice(0, 12), created: 'Just now', expires: data.expiry === 'never' ? 'Never' : `In ${data.expiry} days` }, ...data.keys] });
  });

  return (
    <div className='mx-auto grid w-full max-w-3xl grid-cols-[minmax(0,1fr)] gap-5'>
      {created ? (
        <Alert variant='success'>
          <RegistryIcon lucide='KeyRoundIcon' aria-hidden='true' />
          <AlertTitle>“{created.name}” is ready. Copy the secret now; it will not be shown again.</AlertTitle>
          <AlertDescription className='grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3'>
            <div className='flex w-full flex-wrap items-center gap-2'>
              <code aria-label={revealed ? 'API secret' : 'API secret, hidden'} className='bg-surface min-w-0 flex-1 basis-60 truncate rounded-sm border px-2 py-1 font-mono text-xs'>
                {revealed ? created.secret : `${created.secret.slice(0, 12)}${'•'.repeat(16)}`}
              </code>
              <Button size='sm' variant='outline' tone='neutral' aria-pressed={revealed} onClick={() => setRevealed(!revealed)}>
                <RegistryIcon lucide={revealed ? 'EyeOffIcon' : 'EyeIcon'} aria-hidden='true' />
                {revealed ? 'Hide' : 'Reveal'}
              </Button>
              <Button size='sm' onClick={() => copyToClipboard(created.secret)}>
                <RegistryIcon lucide={isCopied ? 'CheckIcon' : 'CopyIcon'} aria-hidden='true' />
                {isCopied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <CodeBlockGroup className='w-full' label='Add the key to your project' items={snippets(created.name, revealed ? created.secret : 'paste-the-secret-here')} />
          </AlertDescription>
        </Alert>
      ) : null}
      <form noValidate aria-labelledby='api-key-title' onSubmit={create} className='grid grid-cols-[minmax(0,1fr)] gap-5 rounded-lg border p-5 sm:p-6'>
        <div className='grid gap-1'>
          <h2 id='api-key-title' className='text-lg font-semibold'>Create an API key</h2>
          <p className='text-text-muted text-sm'>Give each app its own key so you can revoke one without breaking the others.</p>
        </div>
        <FormErrorSummary form={form} labels={{ name: 'Name', access: 'Access', allow: 'Allowed IPs' }} />
        <FieldGroup className='gap-5'>
          <Field data-invalid={errors.name ? true : undefined}>
            <FieldLabel htmlFor={form.id('name')}>Key name</FieldLabel>
            <Input {...form.field('name')} placeholder='e.g. Newsletter worker' autoComplete='off' />
            <FieldError id={form.errorId('name')}>{errors.name}</FieldError>
          </Field>
          <RadioGroup
            label='Environment'
            variant='cards'
            value={values.env}
            onValueChange={(env) => form.setValue('env', env)}
            options={[
              { value: 'development', label: 'Development', description: 'Local machines' },
              { value: 'staging', label: 'Staging', description: 'Test data only' },
              { value: 'production', label: 'Production', description: 'Live readers and data' }
            ]}
          />
          <FieldSet aria-describedby={errors.access ? form.errorId('access') : undefined}>
            <FieldLegend variant='label'>Access</FieldLegend>
            <div id={form.id('access')} className='divide-y rounded-md border'>
              {scopes.map((scope) => (
                <div key={scope.id} className='flex flex-wrap items-center justify-between gap-2 px-3 py-2'>
                  <span className='text-sm font-medium'>{scope.label}</span>
                  <Select value={values.access[scope.id]} onValueChange={(level) => setAccess(scope.id, level)}>
                    <SelectTrigger aria-label={`${scope.label} access`} size='sm' className='w-36'><SelectValue /></SelectTrigger>
                    <SelectContent position='popper'>
                      <SelectItem value='none'>No access</SelectItem>
                      <SelectItem value='read'>Read</SelectItem>
                      <SelectItem value='write'>Read and write</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            <FieldError id={form.errorId('access')}>{errors.access}</FieldError>
          </FieldSet>
          <div className='grid gap-4 sm:grid-cols-2'>
            <Field>
              <FieldLabel htmlFor={form.id('expiry')}>Expires</FieldLabel>
              <Select value={values.expiry} onValueChange={(expiry) => form.setValue('expiry', expiry)}>
                <SelectTrigger id={form.id('expiry')} className='w-full'><SelectValue /></SelectTrigger>
                <SelectContent position='popper'>
                  <SelectItem value='30'>In 30 days</SelectItem>
                  <SelectItem value='90'>In 90 days</SelectItem>
                  <SelectItem value='365'>In a year</SelectItem>
                  <SelectItem value='never'>Never</SelectItem>
                </SelectContent>
              </Select>
              {values.expiry === 'never' ? <FieldDescription>Keys that never expire are the ones that leak. Rotate it yearly.</FieldDescription> : null}
            </Field>
            <Field data-invalid={errors.allow ? true : undefined}>
              <FieldLabel htmlFor={form.id('allow')}>
                Allowed IPs <span className='text-text-muted font-normal'>(optional)</span>
              </FieldLabel>
              <Textarea {...form.field('allow', { describedBy: form.id('allow-hint') })} rows={2} placeholder={'203.0.113.4\n198.51.100.0/24'} className='font-mono text-xs' />
              <FieldDescription id={form.id('allow-hint')}>One address or CIDR range per line.</FieldDescription>
              <FieldError id={form.errorId('allow')}>{errors.allow}</FieldError>
            </Field>
          </div>
          {values.env === 'production' ? (
            <Field orientation='horizontal'>
              <Checkbox id={form.id('confirm-production')} checked={values.confirmProduction} onCheckedChange={(on) => form.setValue('confirmProduction', on === true)} />
              <FieldLabel htmlFor={form.id('confirm-production')} className='font-normal'>I will store this key in a secret manager, not in the repository</FieldLabel>
            </Field>
          ) : null}
        </FieldGroup>
        <Button type='submit' className='justify-self-end' disabled={values.env === 'production' && !values.confirmProduction}>
          Create key
        </Button>
      </form>
      <section aria-labelledby='api-keys-list-title' className='grid gap-2'>
        <h3 id='api-keys-list-title' className='text-sm font-semibold'>Active keys</h3>
        <ul className='divide-y rounded-lg border'>
          {values.keys.map((key) => (
            <li key={key.id} className='flex flex-wrap items-center gap-3 px-4 py-3'>
              <span className='grid min-w-0 flex-1 basis-48'>
                <span className='flex items-center gap-2 text-sm font-medium'>
                  {key.name}
                  <Badge size='xs' variant={key.env === 'production' ? 'attention-light' : 'info-light'}>{key.env}</Badge>
                </span>
                <span className='text-text-muted text-xs'>
                  <code className='font-mono'>{key.prefix}…</code> · created {key.created} · expires {key.expires}
                </span>
              </span>
              <Button
                size='sm'
                variant='ghost'
                tone='neutral'
                onClick={() => {
                  // A rotated key keeps its name and settings; the old secret stops working in 24 hours.
                  const secret = secretFor(key.env, `${key.id}${key.prefix}`);
                  form.setValue('keys', values.keys.map((item) => (item.id === key.id ? { ...item, prefix: secret.slice(0, 12), created: 'Just now' } : item)));
                  setCreated({ name: key.name, secret });
                  setRevealed(false);
                }}
              >
                <RegistryIcon lucide='RefreshCwIcon' aria-hidden='true' />
                Rotate
              </Button>
              <Button size='sm' variant='ghost' tone='danger' onClick={() => form.setValue('keys', values.keys.filter((item) => item.id !== key.id))}>
                Revoke
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
