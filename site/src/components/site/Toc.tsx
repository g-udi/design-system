'use client';

import { AnchorProvider, TOCItem, type TOCItemType } from 'fumadocs-core/toc';

/** "On this page": active headings come from the Fumadocs anchor observer. */
export function Toc({ items }: { items: TOCItemType[] }) {
  if (!items.length) return null;
  return (
    <AnchorProvider toc={items}>
      <nav aria-label='On this page' className='py-2'>
        <p className='mb-2 text-xs font-semibold tracking-wide text-text uppercase'>On this page</p>
        <ul className='flex flex-col'>
          {items.map((item) => (
            <li key={item.url}>
              <TOCItem href={item.url} className='site-toc-link' style={{ '--depth': Math.max(0, item.depth - 2) } as React.CSSProperties}>
                {item.title}
              </TOCItem>
            </li>
          ))}
        </ul>
      </nav>
    </AnchorProvider>
  );
}
