'use client';
import { useId, useState } from 'react';
import { StackedBarList } from '@gaudi/design-system/charts/StackedBarList';
import { Label } from '@gaudi/design-system/core/Field';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';

// Readers per post this month, split by where they came from.
const posts = [
  { label: 'Notes on local-first software', search: 3120, newsletter: 1460, social: 610, direct: 380 },
  { label: 'Small tools, long lifetimes', search: 1840, newsletter: 920, social: 1320, direct: 240 },
  { label: 'Designing for real data', search: 2260, newsletter: 610, social: 480, direct: 310 },
  { label: 'A practical guide to knowledge graphs', search: 1950, newsletter: 1180, social: 260, direct: 190 },
  { label: 'Writing that survives a reorg', search: 720, newsletter: 1040, social: 890, direct: 120 }
];
const sources = [
  { key: 'search', label: 'Search' },
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'social', label: 'Social' },
  { key: 'direct', label: 'Direct' }
];

export function Pattern() {
  const [mix, setMix] = useState(false);
  const id = useId();
  return (
    <StackedBarList
      ariaLabel='Readers per post by traffic source'
      title='Top posts this month'
      description={mix ? 'Each post as 100%, to compare where its readers came from.' : 'Readers per post, split by source.'}
      toolbar={
        <div className='flex items-center gap-2'>
          <Switch id={id} checked={mix} onCheckedChange={setMix} />
          <Label htmlFor={id}>Compare mix</Label>
        </div>
      }
      data={posts}
      series={sources}
      normalize={mix}
      className='my-0 w-full max-w-2xl'
    />
  );
}
