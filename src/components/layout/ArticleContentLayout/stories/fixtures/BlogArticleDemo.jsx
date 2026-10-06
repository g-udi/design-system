import { useEffect, useId, useRef, useState } from 'react';
import ArticleContentLayout from '@gaudi/design-system/layout/ArticleContentLayout';
import Link from '@gaudi/design-system/core/Link';
import Switch from '@gaudi/design-system/core/Switch';
import { ScrollArea } from '@gaudi/design-system/core/ScrollArea';
import { Scrollspy } from '@gaudi/design-system/core/Scrollspy';
import { ReadingIndicator } from '@gaudi/design-system/core/ReadingIndicator';
import { ImageGallery } from '@gaudi/design-system/core/ImageGallery';
import { VideoPlayer } from '@gaudi/design-system/core/VideoPlayer';
import { useElementSize } from '@gaudi/design-system/hooks/layout/use-element-size';
import { useScrollPosition } from '@gaudi/design-system/hooks/layout/use-scroll-position';
import { usePrefersReducedMotion } from '@gaudi/design-system/hooks/a11y/use-prefers-reduced-motion';
import styles from './BlogArticleDemo.css?raw';

const studies = [
  { id: 'lavender', src: '/static/images/art/0.svg', alt: 'Lavender abstract composition', caption: 'Lavender study', width: 1200, height: 900 },
  { id: 'peach', src: '/static/images/art/1.svg', alt: 'Peach and pink color study', caption: 'Peach bloom', width: 1200, height: 900 },
  { id: 'aqua', src: '/static/images/art/2.svg', alt: 'Aqua and blue color study', caption: 'Cool light', width: 1200, height: 900 }
];

// The small overlays update independently of the article and its media.
// Visual reference: https://skiper-ui.com/v1/skiper41 (Progressive Blur).
function BlogScrollBlur({ targetRef }) {
  const position = useScrollPosition({ targetRef });
  const [measureViewport, viewportSize] = useElementSize();
  const [measureContent, contentSize] = useElementSize();
  useEffect(() => {
    measureViewport(targetRef.current);
    measureContent(targetRef.current?.firstElementChild);
    return () => { measureViewport(null); measureContent(null); };
  }, [targetRef, measureViewport, measureContent]);
  const remaining = Math.max(0, contentSize.height - viewportSize.height - position);
  const strength = distance => distance < 1 ? 0 : Math.min(1, distance / 80);
  return <>
    <div aria-hidden='true' className='gaudi-blog-blur' data-edge='top' style={{ opacity: strength(position) }} />
    <div aria-hidden='true' className='gaudi-blog-blur' data-edge='bottom' style={{ opacity: strength(remaining) }} />
  </>;
}

export function BlogArticleDemo({ smooth = true, defaultProgressiveBlur = true }) {
  const viewport = useRef(null);
  const [progressiveBlur, setProgressiveBlur] = useState(defaultProgressiveBlur);
  const reducedMotion = usePrefersReducedMotion();
  const blurEnabled = progressiveBlur && !reducedMotion;
  const sectionOffset = blurEnabled ? 112 : 24;
  const id = useId();
  const sections = [
    { id: `${id}-rhythm`, title: 'A little breathing room' },
    { id: `${id}-images`, title: 'Looking more closely' },
    { id: `${id}-film`, title: 'A moment of movement' },
    { id: `${id}-return`, title: 'Keep your place' }
  ];
  const sectionLink = (section, label = section.title) => <Link href={`#${section.id}`} data-scrollspy-anchor={section.id}>{label}</Link>;

  return <div className='gaudi-blog-demo'>
    <style>{styles}</style>
    <header className='gaudi-blog-header'>
      <Scrollspy targetRef={viewport} offset={sectionOffset}>
        <nav aria-label='Journal navigation'>
          <Link className='gaudi-blog-brand' href={`#${id}-title`} data-scrollspy-anchor={`${id}-title`}>Gaudi journal</Link>
          <div className='gaudi-blog-header-links'>
            {sectionLink(sections[1], 'Images')}
            {sectionLink(sections[2], 'Film')}
          </div>
        </nav>
      </Scrollspy>
      <ReadingIndicator targetRef={viewport} position='inline' label='Article reading progress' />
    </header>

    {/* During the blog migration, this viewport becomes the main article host.
        Share its ref with progress and every section navigator. */}
    <div className='gaudi-blog-reading' data-progressive-blur={blurEnabled}>
      <ScrollArea smooth={smooth} viewportRef={viewport} type='auto' aria-label='Blog post content' className='gaudi-blog-scroll'>
        <article className='gaudi-blog-article' aria-labelledby={`${id}-title`}>
          <header className='gaudi-blog-title'>
            <h1 id={`${id}-title`} tabIndex={-1}>Giving a page room to breathe</h1>
            <p>A few thoughts on reading, looking, and finding your way through a longer story.</p>
            <div className='gaudi-blog-meta'><span>Sample article</span><time dateTime='2026-10-05'>5 October 2026</time><span>5 min read</span></div>
            <div className='gaudi-blog-reading-options'>
              <Switch label='Blur edges' size='sm' checked={blurEnabled} onCheckedChange={setProgressiveBlur} disabled={reducedMotion} aria-describedby={reducedMotion ? `${id}-motion-note` : undefined} />
              {reducedMotion && <span id={`${id}-motion-note`}>Off with reduced motion</span>}
            </div>
          </header>

          <ArticleContentLayout className='gaudi-blog-layout' contentClassName='gaudi-blog-prose' aside={
            <aside className='gaudi-blog-aside order-1 lg:order-none lg:col-span-3'>
              <p className='gaudi-blog-contents-label'>On this page</p>
              <Scrollspy targetRef={viewport} offset={sectionOffset}>
                <nav aria-label='Article contents'><ol>{sections.map(section => <li key={section.id}>{sectionLink(section)}</li>)}</ol></nav>
              </Scrollspy>
              <p className='gaudi-blog-aside-note'>Read at your own pace. Open an image for a closer look.</p>
            </aside>
          }>
            <section aria-labelledby={sections[0].id}>
              <h2 id={sections[0].id} tabIndex={-1}>{sections[0].title}</h2>
              <p>There is a particular pleasure in arriving at a page that lets you settle in. The words have space around them. The headings tell you where you are. An image appears just when a thought needs something more than another sentence.</p>
              <p>That rhythm starts with small decisions: a comfortable line length, a pause between ideas, and a clear relationship between the text and everything around it. None of these details needs to announce itself. Together, they make the next paragraph feel easy to begin.</p>
              <div className='not-prose gaudi-blog-media'>
                <ImageGallery label='Featured illustration' images={[{ ...studies[0], caption: 'Soft forms, with enough space to see their edges. Select the image to expand it.' }]} />
              </div>
              <p>The margins are part of the reading experience. They leave room to pause, to glance back at a heading, or to follow a detail in a picture before continuing. A good page can hold all of these different speeds.</p>
            </section>

            <section aria-labelledby={sections[1].id}>
              <h2 id={sections[1].id} tabIndex={-1}>{sections[1].title}</h2>
              <p>Some images work together. A change in color can reveal a shape that was almost invisible in the previous study. Seen side by side, the differences become part of the story.</p>
              <p>These three abstract studies are a small invitation to look again. Open any one to browse the collection, then close the viewer to return to the same passage.</p>
              <div className='not-prose gaudi-blog-media'>
                <ImageGallery label='Color studies' images={studies} layout='grid' columns={{ mobile: 1, tablet: 3, desktop: 3 }} />
              </div>
              <p>A caption provides a way back into the text. It can name what matters without trying to describe every visible detail. Here, the short labels leave the images to do most of the work.</p>
            </section>

            <section aria-labelledby={sections[2].id}>
              <h2 id={sections[2].id} tabIndex={-1}>{sections[2].title}</h2>
              <p>Movement asks for a different kind of attention. A film has its own pace, so it should wait until you are ready. Play this short study, turn on captions, or move along the timeline to watch a moment again.</p>
              <div className='not-prose gaudi-blog-media'>
                <VideoPlayer src='/static/media/video-demo.webm' poster='/static/media/video-demo-poster.webp' title='Form in motion' defaultMuted
                  tracks={[{ src: '/static/media/video-demo.en.vtt', srcLang: 'en', label: 'English' }]} />
                <p className='gaudi-blog-caption'>A 12-second motion study. Sound is muted until you choose to unmute.</p>
              </div>
              <p>The rest of the page stays still while the film plays. When you continue reading, the next section is waiting in the same place. The controls belong to the film; the pace of the article belongs to you.</p>
            </section>

            <section aria-labelledby={sections[3].id}>
              <h2 id={sections[3].id} tabIndex={-1}>{sections[3].title}</h2>
              <p>Longer stories are rarely read in one straight line. We skip ahead, return to a passage, or stop halfway through. A contents list makes these movements feel ordinary. The line above the article gives a quiet sense of how much remains.</p>
              <p>On a smaller screen, the contents move above the reading column. Images still open into the same viewer, and the film keeps its controls within reach. The page changes shape while the story stays intact.</p>
              <p>A useful ending leaves the reader with somewhere to land. No interruption, no competing panel, just the final thought and a way back to the beginning.</p>
            </section>
            <footer className='gaudi-blog-footer not-prose'>
              <p>Thanks for reading.</p>
              <Scrollspy targetRef={viewport} offset={sectionOffset}>
                <Link href={`#${id}-title`} data-scrollspy-anchor={`${id}-title`}>Back to the beginning</Link>
              </Scrollspy>
            </footer>
          </ArticleContentLayout>
        </article>
      </ScrollArea>
      {blurEnabled && <BlogScrollBlur targetRef={viewport} />}
    </div>
  </div>;
}
