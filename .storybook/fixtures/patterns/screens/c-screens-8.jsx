'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { Discord } from '../../../../src/icons/brands/discord.jsx';
import { Dropbox } from '../../../../src/icons/brands/dropbox.jsx';
import { GoogleDrive } from '../../../../src/icons/brands/googleDrive.jsx';
import { Loom } from '../../../../src/icons/brands/loom.jsx';
import { Slack } from '../../../../src/icons/brands/slack.jsx';
import { Stripe } from '../../../../src/icons/brands/stripe.jsx';
import { Supabase } from '../../../../src/icons/brands/supabase.jsx';
import { Zoom } from '../../../../src/icons/brands/zoom.jsx';

const apps = [
  { id: 'slack', name: 'Slack', group: 'Communication', description: 'Post updates and approvals to channels.', Logo: Slack, status: 'connected' },
  { id: 'discord', name: 'Discord', group: 'Communication', description: 'Notify your community server.', Logo: Discord, status: 'available' },
  { id: 'zoom', name: 'Zoom', group: 'Communication', description: 'Attach recordings to meeting notes.', Logo: Zoom, status: 'connected' },
  { id: 'drive', name: 'Google Drive', group: 'Files', description: 'Import and link documents.', Logo: GoogleDrive, status: 'error' },
  { id: 'dropbox', name: 'Dropbox', group: 'Files', description: 'Sync shared folders.', Logo: Dropbox, status: 'available' },
  { id: 'loom', name: 'Loom', group: 'Files', description: 'Embed walkthrough videos.', Logo: Loom, status: 'available' },
  { id: 'stripe', name: 'Stripe', group: 'Developer', description: 'Sync customers and invoices.', Logo: Stripe, status: 'connected' },
  { id: 'supabase', name: 'Supabase', group: 'Developer', description: 'Query your database from documents.', Logo: Supabase, status: 'available' }
];
const statusBadge = {
  connected: ['Connected', 'success-light'],
  error: ['Needs attention', 'warning-light'],
  available: null
};

export function Pattern() {
  const [view, setView] = useState('gallery');
  const [enabled, setEnabled] = useState(() => Object.fromEntries(apps.map((app) => [app.id, app.status !== 'available'])));
  const set = (id, on) => setEnabled((current) => ({ ...current, [id]: on }));
  const groups = [...new Set(apps.map((app) => app.group))];
  return (
    <div className='grid w-full max-w-4xl gap-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='grid gap-1'>
          <h2 className='text-lg font-semibold'>Integrations</h2>
          <p className='text-text-muted text-sm'>{Object.values(enabled).filter(Boolean).length} of {apps.length} apps connected</p>
        </div>
        <ToggleGroup aria-label='View' type='single' variant='outline' size='sm' spacing={0} value={view} onValueChange={(next) => setView(next || view)}>
          <ToggleGroupItem value='gallery'>Gallery</ToggleGroupItem>
          <ToggleGroupItem value='list'>List</ToggleGroupItem>
        </ToggleGroup>
      </div>
      {view === 'gallery' ? (
        <ul className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          {apps.map(({ id, name, description, Logo, status }) => (
            <li key={id} className='grid content-between gap-4 rounded-xl border p-4'>
              <div className='grid gap-3'>
                <div className='flex items-center justify-between'>
                  <span className='flex size-9 items-center justify-center rounded-lg border'><Logo className='size-5' aria-hidden='true' /></span>
                  <Switch size='sm' aria-label={`Enable ${name}`} checked={enabled[id]} onCheckedChange={(on) => set(id, on)} />
                </div>
                <span className='grid gap-1'>
                  <span className='font-medium'>{name}</span>
                  <span className='text-text-muted text-xs'>{description}</span>
                </span>
              </div>
              {status === 'error' ? <Badge size='sm' variant='warning-light' className='justify-self-start'>Reconnect required</Badge> : null}
            </li>
          ))}
        </ul>
      ) : (
        <div className='grid gap-4'>
          {groups.map((group) => (
            <section key={group} aria-label={group} className='overflow-hidden rounded-xl border'>
              <h3 className='bg-surface-muted text-text-muted px-4 py-2 text-xs font-medium'>{group}</h3>
              <ul>
                {apps.filter((app) => app.group === group).map(({ id, name, description, Logo, status }) => {
                  const badge = enabled[id] ? statusBadge[status === 'available' ? 'connected' : status] : null;
                  return (
                    <li key={id} className='flex items-center gap-3 border-t px-4 py-3 first:border-t-0'>
                      <Logo className='size-5 shrink-0' aria-hidden='true' />
                      <span className='grid min-w-0 flex-1 text-sm'>
                        <span className='font-medium'>{name}</span>
                        <span className='text-text-muted truncate text-xs'>{description}</span>
                      </span>
                      {badge ? <Badge size='sm' variant={badge[1]}>{badge[0]}</Badge> : null}
                      <Button size='sm' variant={enabled[id] ? 'outline' : 'default'} onClick={() => set(id, !enabled[id])}>
                        {enabled[id] ? 'Disconnect' : 'Connect'}
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
