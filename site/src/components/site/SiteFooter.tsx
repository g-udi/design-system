import Link from 'next/link';
import { siteConfig } from '../../../site.config';

export function SiteFooter() {
  return (
    <footer className='border-t border-border'>
      <div className='mx-auto flex max-w-[90rem] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-8 text-sm text-text-muted sm:px-6'>
        <span>{siteConfig.product} · MIT licence</span>
        <Link className='underline underline-offset-2' href='/docs/credits'>Credits</Link>
        <a className='underline underline-offset-2' href={siteConfig.github} target='_blank' rel='noreferrer'>GitHub</a>
      </div>
    </footer>
  );
}
