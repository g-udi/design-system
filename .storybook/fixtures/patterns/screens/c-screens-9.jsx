'use client';
import { useState } from 'react';
import { Alert, AlertAction, AlertDescription, AlertTitle } from '../../../../src/components/core/Banner/parts/alert-extended.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { CodeBlockGroup } from '../../../../src/components/core/CodeBlock/parts/code-block-group.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { useCopyToClipboard } from '../../../../src/hooks/interaction/use-copy-to-clipboard.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const initialKeys = [
  { id: 'prod', name: 'Production', token: 'gd_live_9f2c41e87ab03d56', created: 'Mar 4, 2026', used: '2 minutes ago', on: true },
  { id: 'staging', name: 'Staging', token: 'gd_test_51b7e09c2fa4d833', created: 'Jun 18, 2026', used: 'Yesterday', on: true },
  { id: 'ci', name: 'CI pipeline', token: 'gd_test_c8d1a6f04e2b7719', created: 'Sep 2, 2026', used: 'Never', on: false }
];
const endpoints = [
  { id: 'orders', url: 'https://api.northwind.dev/hooks/orders', events: 'order.created, order.paid', rate: '99.8%', on: true },
  { id: 'crm', url: 'https://crm.northwind.dev/inbound', events: 'customer.updated', rate: '71.4%', failing: 12, on: true }
];
const mask = (token) => `${token.slice(0, 8)}••••••••${token.slice(-4)}`;
// A rolled key keeps its name and prefix; only the secret changes.
const roll = (token) => token.slice(0, 8) + Math.random().toString(16).slice(2, 18).padEnd(16, '0');
const samples = (token) => [
  { title: 'cURL', language: 'bash', code: `curl https://api.gaudi.dev/v1/projects \\\n  -H "Authorization: Bearer ${token}"` },
  { title: 'JavaScript', language: 'js', code: `import { Gaudi } from '@gaudi/sdk';\n\nconst gaudi = new Gaudi({ apiKey: process.env.GAUDI_API_KEY });\nconst projects = await gaudi.projects.list();` },
  { title: 'Python', language: 'python', code: `from gaudi import Gaudi\n\ngaudi = Gaudi(api_key=os.environ["GAUDI_API_KEY"])\nprojects = gaudi.projects.list()` },
  { title: 'Go', language: 'go', code: `client := gaudi.NewClient(os.Getenv("GAUDI_API_KEY"))\nprojects, err := client.Projects.List(ctx)` },
  { title: 'Ruby', language: 'ruby', code: `gaudi = Gaudi::Client.new(api_key: ENV["GAUDI_API_KEY"])\nprojects = gaudi.projects.list` }
];

export function Pattern() {
  const [keys, setKeys] = useState(initialKeys);
  const [paused, setPaused] = useState(false);
  const [hooks, setHooks] = useState(() => Object.fromEntries(endpoints.map((endpoint) => [endpoint.id, endpoint.on])));
  const [notice, setNotice] = useState('');
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const [copiedId, setCopiedId] = useState('');
  const update = (id, change) => setKeys((current) => current.map((key) => (key.id === id ? { ...key, ...change } : key)));
  return (
    <div className='grid w-full max-w-4xl gap-5'>
      <section aria-labelledby='keys-title' className='grid gap-4 rounded-xl border p-5'>
        <div className='flex flex-wrap items-start justify-between gap-3'>
          <div className='grid gap-1'>
            <h2 id='keys-title' className='text-lg font-semibold'>API keys</h2>
            <p className='text-text-muted text-sm'>Keys act on behalf of the workspace. Roll a key if it may have leaked.</p>
          </div>
          <div className='flex items-center gap-2'>
            <Label htmlFor='pause-keys' className='font-normal'>Pause all keys</Label>
            <Switch id='pause-keys' checked={paused} onCheckedChange={setPaused} />
          </div>
        </div>
        {paused ? (
          <Alert variant='warning'>
            <RegistryIcon lucide='CircleAlertIcon' />
            <AlertTitle>Every key is paused</AlertTitle>
            <AlertDescription>Requests return 403 until you resume them. Webhooks keep sending.</AlertDescription>
          </Alert>
        ) : null}
        <div className='relative overflow-x-auto'>
          <table className='w-full min-w-[40rem] text-sm'>
            <caption className='sr-only'>API keys</caption>
            <thead className='text-text-muted text-xs'>
              <tr>
                <th className='pb-2 text-left font-medium'>Name</th>
                <th className='pb-2 text-left font-medium'>Key</th>
                <th className='pb-2 text-left font-medium'>Last used</th>
                <th className='pb-2 text-left font-medium'>Active</th>
                <th className='pb-2 text-right font-medium'><span className='sr-only'>Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr key={key.id} className='border-t'>
                  <th scope='row' className='py-2.5 pe-3 text-left font-medium'>
                    {key.name}
                    <span className='text-text-muted block text-xs font-normal'>Created {key.created}</span>
                  </th>
                  <td className='py-2.5 pe-3'>
                    <span className='flex items-center gap-1'>
                      <code className='bg-surface-muted rounded px-1.5 py-0.5 font-mono text-xs'>{mask(key.token)}</code>
                      <Button
                        size='icon-xs'
                        variant='ghost'
                        aria-label={copiedId === key.id && isCopied ? `${key.name} key copied` : `Copy ${key.name} key`}
                        onClick={() => {
                          setCopiedId(key.id);
                          copyToClipboard(key.token);
                        }}
                      >
                        <RegistryIcon lucide={copiedId === key.id && isCopied ? 'CheckIcon' : 'CopyIcon'} />
                      </Button>
                    </span>
                  </td>
                  <td className='text-text-muted py-2.5 pe-3'>{key.used}</td>
                  <td className='py-2.5 pe-3'>
                    <Switch size='sm' aria-label={`${key.name} key active`} checked={key.on && !paused} disabled={paused} onCheckedChange={(on) => update(key.id, { on })} />
                  </td>
                  <td className='py-2.5 text-right'>
                    <span className='inline-flex gap-1'>
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => {
                          update(key.id, { token: roll(key.token), used: 'Never' });
                          setNotice(`${key.name} key rolled. The old key stops working in 24 hours.`);
                        }}
                      >
                        <RegistryIcon lucide='RefreshCwIcon' />
                        Roll
                      </Button>
                      <Button
                        size='sm'
                        variant='ghost'
                        tone='danger'
                        onClick={() => {
                          setKeys((current) => current.filter((item) => item.id !== key.id));
                          setNotice(`${key.name} key revoked.`);
                        }}
                      >
                        Revoke
                      </Button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p role='status' className='text-text-muted min-h-5 text-sm'>{notice}</p>
      </section>

      <section aria-labelledby='hooks-title' className='grid gap-4 rounded-xl border p-5'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <h2 id='hooks-title' className='text-lg font-semibold'>Webhook endpoints</h2>
          <Button size='sm' variant='outline'>
            <RegistryIcon lucide='PlusIcon' />
            Add endpoint
          </Button>
        </div>
        <ul className='grid gap-3'>
          {endpoints.map((endpoint) => (
            <li key={endpoint.id} className='grid gap-3 rounded-lg border p-4'>
              <div className='flex flex-wrap items-center gap-3'>
                <RegistryIcon lucide='WebhookIcon' className='text-text-muted size-4' />
                <span className='grid min-w-0 flex-1 basis-48 gap-0.5'>
                  <code className='truncate font-mono text-sm'>{endpoint.url}</code>
                  <span className='text-text-muted truncate text-xs'>{endpoint.events}</span>
                </span>
                <Badge size='sm' variant={endpoint.failing ? 'warning-light' : 'success-light'}>{endpoint.rate} delivered</Badge>
                <Switch size='sm' aria-label={`Send to ${endpoint.url}`} checked={hooks[endpoint.id]} onCheckedChange={(on) => setHooks((current) => ({ ...current, [endpoint.id]: on }))} />
              </div>
              {endpoint.failing && hooks[endpoint.id] ? (
                <Alert variant='warning'>
                  <RegistryIcon lucide='CircleAlertIcon' />
                  <AlertTitle>{endpoint.failing} deliveries failed in the last hour</AlertTitle>
                  <AlertDescription>The endpoint answered 502. We retry for 3 days before disabling it.</AlertDescription>
                  <AlertAction>
                    <Button size='xs' variant='outline'>Retry now</Button>
                  </AlertAction>
                </Alert>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby='sdk-title' className='grid gap-3'>
        <h2 id='sdk-title' className='text-lg font-semibold'>Quick start</h2>
        <CodeBlockGroup label='SDK samples' items={samples(keys[0] ? mask(keys[0].token) : 'YOUR_API_KEY')} />
      </section>
    </div>
  );
}
