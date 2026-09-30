'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '../../../../src/components/core/EmptyState/parts/empty.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
const metrics = [
  ['Revenue', '$12,450'],
  ['Growth', '+18.2%'],
  ['Users', '1,248']
];
export function Pattern() {
  const [loading, setLoading] = useState(true);
  return (
    <div className='mx-auto grid w-full max-w-2xl gap-3 sm:grid-cols-2'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <Switch id='spinner-overlay' checked={loading} onCheckedChange={setLoading} />
          <Label htmlFor='spinner-overlay'>Refreshing</Label>
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
              <Spinner className='size-5 text-text-muted' aria-label='Refreshing data' />
              <span className='text-sm text-text-muted'>Refreshing data…</span>
            </div>
          ) : null}
        </Card>
      </div>
      <Empty className='border border-dashed border-border'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <Spinner />
          </EmptyMedia>
          <EmptyTitle>Setting up your workspace</EmptyTitle>
          <EmptyDescription>Fetching your projects. This takes a few seconds.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant='outline' size='sm'>Cancel</Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
