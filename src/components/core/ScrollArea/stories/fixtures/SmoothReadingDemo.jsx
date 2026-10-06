import { useId, useRef } from 'react';
import { ScrollArea } from '@gaudi/design-system/core/ScrollArea';
import { ReadingIndicator } from '@gaudi/design-system/core/ReadingIndicator';

export function SmoothReadingDemo({ smooth = true, type = 'always' }) {
  const viewport = useRef(null);
  const id = useId();
  const sections = [
    { id: `${id}-rhythm`, title: 'A steady reading rhythm', paragraphs: [
      'A long article asks for a different kind of attention than a dashboard. The reader needs a comfortable line length, clear paragraphs, and a reliable way to find their place. The interface can help by making each movement feel connected to the one before it.',
      'A wheel turn carries the page a little further, then settles. Headings and illustrations move with the words because the browser still owns the scroll position. A sticky note can stay in place, and selecting a sentence works just as it does on any other page.',
      'The motion is a preference, not a condition for reading. Touch keeps its familiar momentum. The keyboard moves through the article directly. When the reader asks for less motion, the page follows that request.'
    ] },
    { id: `${id}-details`, title: 'Room for the details', paragraphs: [
      'An article often contains more than paragraphs. A wide table, a code sample, or a set of references may need its own space. These small scroll regions should remain usable without pulling the entire article along with them.',
      'Try scrolling the reading list below. Its scrollbar belongs to that list. Once you return to the surrounding text, the main reading area continues from the same place. The distinction should be easy to understand without a tutorial.'
    ] },
    { id: `${id}-finish`, title: 'Finding your way back', paragraphs: [
      'A heading link gives the reader a stable destination. It remains a real link, so its fragment can be copied, opened again, or reached through the keyboard. The page should preserve these familiar browser behaviors when it adds a smoother wheel response.',
      'The line at the top describes position in this article. It follows the same scroll container as the text, including when images load or the reading area changes size. It does not count time spent or measure whether a paragraph was understood.',
      'At the end, leave a clear stopping point. The reader can return to a heading, select a passage, or simply move on. The words should remain the most memorable part of the experience.'
    ] }
  ];
  const readingList = ['Typography and long-form reading', 'How readers scan a page', 'The role of a paragraph', 'Writing useful headings', 'Designing for keyboard navigation', 'Respecting motion preferences', 'Footnotes without interruption', 'Making room for wide tables'];
  return <div className='mx-auto grid w-full max-w-4xl gap-3'>
    <p className='text-sm text-text-muted'>Scroll with a mouse wheel, swipe, or focus the reading area and use Page Down. Try the section links and the nested reading list.</p>
    <div className='relative min-w-0 overflow-hidden rounded-lg border border-border bg-surface'>
      <ScrollArea smooth={smooth} type={type} viewportRef={viewport} aria-label='Blog post content' className='h-[32rem] w-full' scrollbarClassName={{ thumb: 'bg-accent/60' }}>
        <article className='mx-auto grid w-full max-w-prose gap-6 px-5 py-8 text-sm leading-relaxed text-text sm:px-8'>
          <header className='grid gap-3'>
            <h2 className='text-2xl font-semibold leading-tight'>A page worth staying with</h2>
            <p className='text-base text-text-muted'>Reading at your own pace, with a little less friction.</p>
          </header>
          <nav aria-label='Article sections' className='flex flex-wrap gap-x-4 gap-y-2 border-y border-border py-3'>
            {sections.map(section => <a key={section.id} href={`#${section.id}`} className='text-accent underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4'>{section.title}</a>)}
          </nav>
          {sections.map((section, index) => <section key={section.id} className='grid gap-4'>
            <h3 id={section.id} tabIndex={-1} className='scroll-mt-6 text-lg font-semibold leading-snug focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent'>{section.title}</h3>
            {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            {index === 1 && <aside className='grid min-w-0 gap-2'>
              <h4 className='font-medium'>Further reading</h4>
              <ScrollArea type='always' aria-label='Further reading list' className='h-28 rounded-lg border border-border bg-surface-muted'>
                <ul className='grid list-inside list-disc gap-2 px-4 py-3 text-text-muted'>
                  {readingList.map(title => <li key={title}>{title}</li>)}
                </ul>
              </ScrollArea>
            </aside>}
          </section>)}
          <a href={`#${sections[0].id}`} className='justify-self-start text-accent underline underline-offset-4'>Back to the first section</a>
        </article>
      </ScrollArea>
      <ReadingIndicator targetRef={viewport} position='absolute' label='Article reading progress' />
    </div>
  </div>;
}
