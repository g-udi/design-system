import { useId, useState } from 'react';
import { Hero } from '@gaudi/design-system/blocks/Hero';
import Button from '@gaudi/design-system/core/Button';
import Link from '@gaudi/design-system/core/Link';
import Icon from '@gaudi/design-system/core/Icon';
import { Badge } from '@gaudi/design-system/core/Pill';
import { Typography } from '@gaudi/design-system';
import { GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import { CodeBlock } from '@gaudi/design-system/core/CodeBlock';
import Borealis from '@gaudi/design-system/animations/Borealis';
import { DarkVeil } from '@gaudi/design-system/animations/DarkVeil';
import { FloatingLines } from '@gaudi/design-system/animations/FloatingLines';
import { Grainient } from '@gaudi/design-system/animations/Grainient';
import { LiquidEther } from '@gaudi/design-system/animations/LiquidEther';

const fullBleed = { height: 'auto', className: 'rounded-none' };

// Animated Gaudi backgrounds behind the whole hero. Dark effects render the hero in the dark theme scope.
const backdrops = {
  'aurora': { Effect: Borealis, dark: true, mark: true, props: { intensity: 0.45, className: 'min-h-0 items-stretch justify-start' } },
  // Deep theme-token tones keep light copy readable over the gradient.
  'mesh': { Effect: Grainient, dark: true, props: { ...fullBleed, grain: 0.15, colors: [
    'color-mix(in srgb, var(--ds-color-chart-3) 40%, var(--ds-color-surface))',
    'var(--ds-color-surface)',
    'color-mix(in srgb, var(--ds-color-accent) 25%, var(--ds-color-surface))'
  ] } },
  'liquid': { Effect: LiquidEther, dark: true, hint: 'Move the pointer to stir the surface.', props: { ...fullBleed, intensity: 0.65 } },
  'veil': { Effect: DarkVeil, dark: true, props: fullBleed },
  'lines': { Effect: FloatingLines, hint: 'Move the pointer to bend the lines.', props: fullBleed }
};

function HeroHeader({ target }) {
  return (
    <header className='mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 border-b px-6 py-5 sm:px-12'>
      <GaudiBrand />
      <nav aria-label='Hero example navigation' className='flex flex-wrap items-center gap-5 text-sm'>
        <Link href={`#${target}`} target='_self'>Explore</Link>
        <Button href={`#${target}`} target='_self' variant='outline'>Get started <Icon name='ArrowUpRight' /></Button>
      </nav>
    </header>
  );
}

function ProductPreview() {
  return <div className='overflow-hidden rounded-md border bg-surface text-left'>
    <div className='flex flex-wrap items-center justify-between gap-3 border-b bg-surface-muted px-5 py-3'>
      <Typography as='span' variant='metadata'>Your next page</Typography>
      <Typography as='span' variant='metadata'>React + Gaudi</Typography>
    </div>
    <CodeBlock variant='ghost' language='jsx' showLineNumbers={false} code={`import { Hero } from '@gaudi/design-system/blocks/Hero';\nimport Button from '@gaudi/design-system/core/Button';\n\n<Hero\n  title="A good place to start."\n  description="Your content. Shared foundations."\n  actions={<Button href="/start">Get started</Button>}\n/>`} />
  </div>;
}

/** An abstract glowing orb (a dark core and bright point inside a gradient halo) above the product name. */
function GlowingMark({ label }) {
  return <span className='grid justify-items-center gap-4'>
    <span aria-hidden='true' className='rounded-full bg-[conic-gradient(from_200deg,var(--ds-color-chart-2),var(--ds-color-chart-3),var(--ds-color-chart-5),var(--ds-color-chart-2))] p-1 shadow-[0_0_28px_6px_color-mix(in_srgb,var(--ds-color-chart-2)_40%,transparent),0_0_72px_20px_color-mix(in_srgb,var(--ds-color-chart-3)_40%,transparent)]'>
      <span className='grid size-16 place-items-center rounded-full bg-surface'>
        <span className='size-2.5 rounded-full bg-text shadow-[0_0_10px_2px_color-mix(in_srgb,var(--ds-color-text)_60%,transparent)]' />
      </span>
    </span>
    <span className='text-base font-medium text-text'>{label}</span>
  </span>;
}

export function HeroExample({ eyebrow, title, titleAccent, description, note, layout = 'centered', visual = 'none', backdrop = 'none' }) {
  const target = useId();
  const [paused, setPaused] = useState(false);
  const background = backdrops[backdrop];
  const media = visual === 'code' ? <ProductPreview />
    : visual === 'art' ? <img src='/static/images/art/0.svg' alt='' width='1200' height='900' /> : null;
  const hero = <>
    <HeroHeader target={target} />
    <Hero layout={layout} media={media} className={background ? 'bg-transparent' : undefined}
      eyebrow={eyebrow && (background?.mark ? <GlowingMark label={eyebrow} /> : <Badge variant='primary-outline' size='lg'>{eyebrow}</Badge>)}
      title={titleAccent ? <>{title} <span className='block text-text-muted'>{titleAccent}</span></> : title}
      description={description}
      actions={<>
        <Button href={`#${target}`} target='_self' size='lg'>Explore the system <Icon name='ArrowRight' /></Button>
        <Link href={`#${target}`} target='_self' className='inline-flex items-center gap-2 py-2 text-sm'>See how it works <Icon name='ArrowDownIcon' className='size-4' /></Link>
      </>}
    >
      {visual === 'code' ? 'Compose with React. Make it your own.' : null}
      {note && <p className='m-0'>{note}</p>}
      {background && <div className='flex flex-wrap items-center justify-center gap-x-3 gap-y-1'>
        {background.hint && <span>{background.hint}</span>}
        {/* Moving backgrounds need a pause control; reduced motion stops them automatically. */}
        <Button variant='ghost' size='sm' onClick={() => setPaused(value => !value)}>{paused ? 'Play animation' : 'Pause animation'}</Button>
      </div>}
    </Hero>
  </>;
  return <main className='w-full bg-surface text-text'>
    <div className={background?.dark ? 'dark bg-surface text-text' : undefined}>
      {background ? <background.Effect paused={paused} {...background.props}>{hero}</background.Effect> : hero}
    </div>
    <section id={target} tabIndex={-1} aria-label='Explore Gaudi' className='mx-auto grid max-w-7xl gap-4 border-t px-6 py-8 focus-visible:outline-2 focus-visible:outline-accent sm:px-12'>
      <Typography as='h2' variant='heading-md'>Start with the foundations.</Typography>
      <Typography variant='paragraph-md' className='max-w-2xl'>Shared typography, accessible controls, and flexible layouts. Choose the pieces your page needs and bring your own content.</Typography>
      <Link href='/?path=/story/overview-getting-started--default' target='_top' className='w-fit text-sm'>Open the Gaudi introduction <Icon name='ArrowUpRight' className='inline size-4' /></Link>
    </section>
  </main>;
}
