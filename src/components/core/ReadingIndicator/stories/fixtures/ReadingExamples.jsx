import { useRef } from 'react';
import { ReadingIndicator } from '@gaudi/design-system/core/ReadingIndicator';
import { ScrollArea } from '@gaudi/design-system/core/ScrollArea';
import Button from '@gaudi/design-system/core/Button';

export function ReadingArticle({ contentRef }) {
  return <article ref={contentRef} className='mx-auto grid max-w-prose gap-6 text-sm leading-relaxed text-text'>
    <header className='grid gap-3'>
      <h2 className='text-2xl font-semibold leading-tight'>A little room to read</h2>
      <p className='text-text-muted'>On attention, rhythm, and knowing where you are in a long piece of writing.</p>
    </header>
    <p>A good reading experience gives the words enough room. The line is comfortable, the type is clear, and the next paragraph is easy to find. Nothing has to compete for attention. Small details do their work quietly, so the reader can stay with the idea.</p>
    <h3 className='mt-4 text-lg font-semibold'>Finding your place</h3>
    <p>On paper, the weight of the pages tells us how far we have travelled. A folded corner or a finger between chapters holds our place. A screen needs a lighter cue: something that stays in the margin and answers a simple question without interrupting the sentence.</p>
    <p>A thin line at the top can be enough. As the page moves, the line moves with it. The relationship should be immediate and predictable. Reaching the end means reaching the end of the writing, even when a footer or a list of related articles follows.</p>
    <h3 className='mt-4 text-lg font-semibold'>Keeping a steady rhythm</h3>
    <p>Headings create pauses. Paragraphs make room for a thought to settle before another begins. Generous margins help distinguish the words from the controls around them. The structure should remain comfortable when the window narrows or the reader makes the text larger.</p>
    <p>Progress is a location, not a score. Skipping forward, returning to a passage, or reading slowly are all ordinary ways of spending time with an article. An indicator can show where the viewport sits; it cannot know how much someone has understood.</p>
    <h3 className='mt-4 text-lg font-semibold'>Details that stay out of the way</h3>
    <p>A ruler gives that location a little more texture. Its marks fill as the reader moves down the page, while a small number follows the current position. A compact circular meter can sit in a corner, or move to another spot when it covers something important.</p>
    <p>These details should still work without animation. They should leave scrolling, text selection, and keyboard navigation alone. The best version belongs to the page without becoming the reason the page exists.</p>
    <h3 className='mt-4 text-lg font-semibold'>A natural stopping point</h3>
    <p>The last paragraph is a place to finish a thought. When it comes into view, the indicator reaches its end too. There is no celebration to dismiss and no new task to complete. Just the words, and enough room to leave them.</p>
  </article>;
}

export function ReadingPlayground(args) {
  const scroller = useRef(null);
  const frame = useRef(null);
  return <div className='grid w-full gap-3'>
    <p className='text-sm text-text-muted'>Scroll the article. The indicator follows your reading position.</p>
    <div ref={frame} className={`relative min-w-0 rounded-lg border border-border bg-surface ${args.variant === 'ring' ? 'pb-16' : ''}`}>
      <ScrollArea ref={scroller} type='always' aria-label='Reading preview' className='h-[28rem] w-full'>
        <div className={`p-4 pb-12 sm:p-6 sm:pb-12 ${args.variant === 'ruler' ? 'pr-24 sm:pr-28' : ''}`}><ReadingArticle /></div>
      </ScrollArea>
      <ReadingIndicator {...args} position='absolute' targetRef={scroller} dragBoundsRef={frame} />
    </div>
  </div>;
}

export function ReadingStyles() {
  const scroller = useRef(null);
  const frame = useRef(null);
  return <div className='grid w-full gap-3'>
    <p className='text-sm text-text-muted'>One article, three ways to keep your place. Drag the ring by its handle, or focus the handle and use the arrow keys.</p>
    <div ref={frame} className='relative min-w-0 rounded-lg border border-border bg-surface pb-16'>
      <ScrollArea ref={scroller} type='always' aria-label='Three reading styles' className='h-[30rem] w-full'>
        <div className='p-4 pr-24 pb-12 sm:p-6 sm:pr-28 sm:pb-12'><ReadingArticle /></div>
      </ScrollArea>
      <ReadingIndicator targetRef={scroller} position='absolute' label='Top bar reading progress' />
      <ReadingIndicator targetRef={scroller} position='absolute' variant='ruler' tone='neutral' label='Ruler reading progress' />
      <ReadingIndicator targetRef={scroller} position='absolute' variant='ring' draggable dragBoundsRef={frame} label='Ring reading progress' />
    </div>
  </div>;
}

export function ArticleRange() {
  const scroller = useRef(null);
  const article = useRef(null);
  const viewport = () => scroller.current.querySelector('[data-slot="scroll-area-viewport"]');
  return <div className='grid w-full gap-3'>
    <div className='flex flex-wrap items-center gap-2'>
      <Button variant='outline' size='sm' onClick={() => viewport().scrollTo({ top: 0 })}>Start again</Button>
      <Button variant='outline' size='sm' onClick={() => viewport().scrollTo({ top: viewport().scrollHeight })}>Skip to related notes</Button>
    </div>
    <div className='relative min-w-0 rounded-lg border border-border bg-surface'>
      <ScrollArea ref={scroller} type='always' aria-label='Article with related notes' className='h-[28rem] w-full'>
        <div className='grid gap-8 p-6'>
          <p className='border-b border-border pb-8 text-sm text-text-muted'>The reading range starts at the article and ends before the related notes.</p>
          <ReadingArticle contentRef={article} />
          <aside className='grid min-h-80 content-start gap-4 border-t border-border pt-8'>
            <h3 className='text-lg font-semibold'>Related notes</h3>
            <p className='text-sm text-text-muted'>This area sits outside the measured article. Reading progress stays at 100% here.</p>
          </aside>
        </div>
      </ScrollArea>
      <ReadingIndicator targetRef={scroller} contentRef={article} position='absolute' showValue />
    </div>
  </div>;
}

export function PageReading() {
  return <>
    <ReadingIndicator />
    <main className='mx-auto min-w-0 max-w-3xl px-6 py-12'><ReadingArticle /></main>
  </>;
}
