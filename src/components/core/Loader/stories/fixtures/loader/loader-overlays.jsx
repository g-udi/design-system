'use client';
import { useId, useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@gaudi/design-system/core/EmptyState';
import { Label } from '@gaudi/design-system/core/Field';
import { LoaderRoot as Loader } from '@gaudi/design-system/core/Loader';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
const metrics = [
  ['Revenue', '$12,450'],
  ['Growth', '+18.2%'],
  ['Users', '1,248']
];
export function Pattern() {
  const [loading, setLoading] = useState(true);
  const [settingUp, setSettingUp] = useState(true);
  const refreshId = useId();
  return (
    <div className='mx-auto grid w-full max-w-2xl gap-3 sm:grid-cols-2'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <Switch id={refreshId} checked={loading} onCheckedChange={setLoading} />
          <Label htmlFor={refreshId}>Refreshing</Label>
        </div>
        <Card className='relative overflow-hidden' aria-busy={loading}>
          <CardHeader>
            <CardTitle>Monthly report</CardTitle>
            <CardDescription>Revenue and growth metrics.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-2'>
            {metrics.map(([label, value]) => (
              <div key={label} className='flex items-center justify-between text-sm'>
                <span className='text-text-muted'>{label}</span>
                <span className='font-medium'>{value}</span>
              </div>
            ))}
          </CardContent>
          {loading ? (
            <div className='absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-surface/80 backdrop-blur-xs'>
              <Loader className='size-5 text-text-muted' aria-label='Refreshing data' />
              <span className='text-sm text-text-muted'>Refreshing data…</span>
            </div>
          ) : null}
        </Card>
      </div>
      <Empty className='border border-dashed border-border'>
        <EmptyHeader>
          {settingUp ? <EmptyMedia variant='icon'><Loader aria-label='Setting up workspace' /></EmptyMedia> : null}
          <EmptyTitle>{settingUp ? 'Setting up your workspace' : 'Setup cancelled'}</EmptyTitle>
          <EmptyDescription>{settingUp ? 'Fetching your projects. This takes a few seconds.' : 'Your workspace has not been changed. Restart setup when you are ready.'}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant='outline' size='sm' onClick={() => setSettingUp((current) => !current)}>{settingUp ? 'Cancel' : 'Restart setup'}</Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
