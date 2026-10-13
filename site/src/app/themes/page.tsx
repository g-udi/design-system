import type { Metadata } from 'next';
import Link from 'next/link';
import { PresetGrid } from '@/components/docs/PresetGrid';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { ThemeLab } from '@/components/site/ThemeLab';
import { storybookStoryUrl } from '../../../site.config';

export const metadata: Metadata = { title: 'Themes', description: 'Eight WCAG AA theme presets, live previews, and StyleGlide/tweakcn/shadcn import and export.' };

export default function ThemesPage() {
  return (
    <>
      <SiteHeader />
      <main id='main' className='mx-auto flex max-w-[90rem] flex-col gap-12 px-4 py-12 sm:px-6'>
        <header className='flex max-w-3xl flex-col gap-3'>
          <h1 className='text-4xl font-extrabold tracking-tight'>Themes</h1>
          <p className='text-lg text-text-muted'>
            A theme overrides the semantic <code>--ds-*</code> contract for light and dark; every component follows it. Pick a preset for the whole site from the header, try one below, or bring your own.
          </p>
          <p className='text-sm'>
            <Link className='text-accent underline underline-offset-2' href='/docs/theming/guide'>Read the theming guide</Link>
            {' · '}
            <a className='text-accent underline underline-offset-2' href={storybookStoryUrl('theming-theme-studio--studio')} target='_blank' rel='noreferrer'>Open Theme Studio in Storybook</a>
          </p>
        </header>
        <section aria-labelledby='gallery-title'>
          <h2 id='gallery-title' className='text-2xl font-bold'>Preset gallery</h2>
          <p className='mt-1 text-sm text-text-muted'>Each card renders real Gaudi components inside its own <code>data-theme</code> scope, in the current colour mode.</p>
          <PresetGrid />
        </section>
        <ThemeLab />
        <section aria-labelledby='credits-title' className='flex max-w-3xl flex-col gap-2 text-sm text-text-muted'>
          <h2 id='credits-title' className='text-base font-semibold text-text'>Credits</h2>
          <p>
            The contract follows the <a className='text-accent underline' href='https://ui.shadcn.com/themes' target='_blank' rel='noreferrer'>shadcn/ui</a> CSS-variable convention, so themes from{' '}
            <a className='text-accent underline' href='https://www.styleglide.ai/themes' target='_blank' rel='noreferrer'>StyleGlide</a>,{' '}
            <a className='text-accent underline' href='https://tweakcn.com' target='_blank' rel='noreferrer'>tweakcn</a> and the{' '}
            <a className='text-accent underline' href='https://ui.shadcn.com/themes' target='_blank' rel='noreferrer'>shadcn/ui theme editor</a> import as-is. Theme Studio is inspired by all three; design your themes there.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
