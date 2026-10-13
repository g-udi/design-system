import { useState } from 'react';
import { Hero } from '@gaudi/design-system/blocks/Hero';
import Button from '@gaudi/design-system/core/Button';
import Link from '@gaudi/design-system/core/Link';
import Icon from '@gaudi/design-system/core/Icon';
import { ToggleGroupRoot, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';
import { GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import { ParticleSea } from '@gaudi/design-system/animations/ParticleSea';

// Sample journal topics; a real blog supplies its own categories, counts and destinations.
const topics = [
  { id: 'systems', label: 'Design systems', count: 24, summary: 'Tokens, contracts, and the quiet work of keeping a library consistent as it grows.', sea: { waveHeight: 0.8, speed: 0.5 } },
  { id: 'accessibility', label: 'Accessibility', count: 18, summary: 'Focus, contrast, and plain language: interfaces that work for everyone from the first draft.', sea: { waveHeight: 0.45, speed: 0.35 } },
  { id: 'motion', label: 'Motion', count: 9, summary: 'Easing, choreography, and knowing when to keep still.', sea: { waveHeight: 1.6, speed: 0.9 } },
  { id: 'engineering', label: 'Engineering', count: 31, summary: 'Rendering, performance, and the small details that keep a page fast.', sea: { waveHeight: 1.1, speed: 0.65 } }
];

/** A journal hero: choosing a topic rewrites the introduction and changes the swell of the particle sea. */
export function JournalTopicsHero() {
  const [topicId, setTopicId] = useState('motion');
  const [paused, setPaused] = useState(false);
  const topic = topics.find(entry => entry.id === topicId);
  return <main className='dark w-full bg-surface text-text'>
    <ParticleSea paused={paused} height='auto' className='rounded-none' horizon={0.62} {...topic.sea}
      colors={['var(--ds-color-warning)', 'color-mix(in srgb, var(--ds-color-warning) 45%, var(--ds-color-text))', 'var(--ds-color-text)']}>
      <header className='mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5 sm:px-12'>
        <GaudiBrand />
        <Link href='#journal-topics' target='_self' className='text-sm'>All writing</Link>
      </header>
      <Hero layout='split' className='bg-transparent' eyebrow={`${topic.count} essays`}
        title={<>Writing about <span className='text-warning'>{topic.label.toLowerCase()}.</span></>}
        description={topic.summary}
        actions={<>
          <Button href='#journal-topics' target='_self' size='lg'>Read the latest</Button>
          <Link href='#journal-topics' target='_self' className='inline-flex items-center gap-2 py-2 text-sm'>Follow {topic.label} <Icon name='ArrowRight' className='size-4' /></Link>
        </>}
      >
        <Button variant='ghost' size='sm' className='-ms-3' onClick={() => setPaused(value => !value)}>{paused ? 'Play animation' : 'Pause animation'}</Button>
      </Hero>
      <div className='mx-auto max-w-7xl px-6 pt-16 pb-10 sm:px-12 sm:pt-28'>
        {/* One topic is always selected: ignore the empty value when the active item is pressed again. */}
        <ToggleGroupRoot id='journal-topics' type='single' spacing={0} value={topicId} onValueChange={value => value && setTopicId(value)}
          aria-label='Journal topics' className='grid w-full grid-cols-2 gap-2 sm:grid-cols-4'>
          {topics.map(entry => <ToggleGroupItem key={entry.id} value={entry.id} variant='default'
            className='h-auto flex-col items-start gap-1 px-3 py-3 text-left text-text-muted data-[state=on]:bg-transparent data-[state=on]:text-text'>
            <span className={`text-3xl font-medium tabular-nums ${entry.id === topicId ? 'text-warning' : ''}`}>{entry.count}</span>
            <span className='text-sm'>{entry.label}</span>
          </ToggleGroupItem>)}
        </ToggleGroupRoot>
      </div>
    </ParticleSea>
  </main>;
}
