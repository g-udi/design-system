import { useEffect, useId, useRef, useState } from 'react';
import ArticleContentLayout from '@gaudi/design-system/layout/ArticleContentLayout';
import Link from '@gaudi/design-system/core/Link';
import Switch from '@gaudi/design-system/core/Switch';
import { ScrollArea } from '@gaudi/design-system/core/ScrollArea';
import { Scrollspy } from '@gaudi/design-system/core/Scrollspy';
import { ReadingIndicator } from '@gaudi/design-system/core/ReadingIndicator';
import { ImageGallery } from '@gaudi/design-system/core/ImageGallery';
import { VideoPlayer } from '@gaudi/design-system/core/VideoPlayer';
import PostHeader, { PostReadingTime } from '@gaudi/design-system/post/PostHeader';
import TableOfContents from '@gaudi/design-system/post/TableOfContents';
import Quote from '@gaudi/design-system/mdx/Quote';
import Callout from '@gaudi/design-system/mdx/Callout';
import { CodeBlock, CodeBlockHeader, CodeBlockTitle, CodeBlockCopyButton } from '@gaudi/design-system/core/CodeBlock';
import { GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
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

function ArticleReadingFrame({ frontMatter, sections: sectionTitles, children, variant = 'standard', smooth = true, contents = 'visible', defaultProgressiveBlur = true }) {
  const viewport = useRef(null);
  const articleRef = useRef(null);
  const [progressiveBlur, setProgressiveBlur] = useState(defaultProgressiveBlur);
  const reducedMotion = usePrefersReducedMotion();
  const blurEnabled = progressiveBlur && !reducedMotion;
  const sectionOffset = blurEnabled ? 112 : 24;
  const id = useId();
  const sections = sectionTitles.map(section => ({ ...section, id: `${id}-${section.key}` }));
  const contentsSections = [];
  for (const section of sections) {
    const parent = contentsSections.at(-1);
    if (section.depth === 3 && parent) parent.children.push(section);
    else contentsSections.push({ ...section, children: [] });
  }
  const tocEntry = section => ({ id: section.id, value: section.title, url: `#${section.id}`, depth: section.depth || 2, children: (section.children || []).map(tocEntry) });
  const toc = contentsSections.map(tocEntry);
  const sectionLink = (section, label = section.title) => <Link href={`#${section.id}`} data-scrollspy-anchor={section.id}>{label}</Link>;
  const { title } = frontMatter;

  return <div className='gaudi-blog-demo' data-article-variant={variant}>
    <style>{styles}</style>
    <header className='gaudi-blog-header'>
      <Scrollspy targetRef={viewport} offset={sectionOffset}>
        <nav aria-label='Journal navigation'>
          <Link className='gaudi-blog-brand' aria-label='Gaudi journal' href={`#${id}-title`} data-scrollspy-anchor={`${id}-title`}><GaudiBrand logoClassName='size-5' /><span>journal</span></Link>
          <div className='gaudi-blog-header-links'>
            {sections.filter(section => section.navLabel).map(section => <span key={section.id}>{sectionLink(section, section.navLabel)}</span>)}
          </div>
        </nav>
      </Scrollspy>
      <ReadingIndicator targetRef={viewport} position='inline' label='Article reading progress' />
    </header>

    {/* Every navigator and reading indicator shares the same article viewport. */}
    <div className='gaudi-blog-reading' data-progressive-blur={blurEnabled}>
      <ScrollArea smooth={smooth} viewportRef={viewport} type='auto' aria-label='Blog post content' className='gaudi-blog-scroll'>
        <article ref={articleRef} className='gaudi-blog-article' aria-label={title}>
          <header className='gaudi-blog-title' id={`${id}-title`} tabIndex={-1}>
            <PostHeader frontMatter={frontMatter} titleVariant='title-md' subtitleVariant='paragraph-md' classNames={{ series: 'mt-6' }} siteMetadata={{ locale: 'en-GB' }} />
            <div className='gaudi-blog-reading-options'>
              <PostReadingTime readingTime={frontMatter.readingTime.text} />
              <Switch label='Blur edges' size='sm' checked={blurEnabled} onCheckedChange={setProgressiveBlur} disabled={reducedMotion} aria-describedby={reducedMotion ? `${id}-motion-note` : undefined} />
              {reducedMotion && <span id={`${id}-motion-note`}>Off with reduced motion</span>}
            </div>
          </header>

          <ArticleContentLayout key={contents} className='gaudi-blog-layout' contentClassName='gaudi-blog-prose'
            collapsibleAside={contents === 'collapsible' || contents === 'collapsed'} defaultAsideOpen={contents !== 'collapsed'} aside={contents !== 'none' && (
            <aside className='gaudi-blog-aside order-1 lg:order-none lg:col-span-3'>
              <TableOfContents toc={toc} contentRef={articleRef} targetRef={viewport} offset={sectionOffset} smooth={smooth} aria-label='Article contents' />
              <p className='gaudi-blog-aside-note'>Read at your own pace. Use the contents to return to a section.</p>
            </aside>
          )}>
            {children(sections)}
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

export function BlogArticleDemo(args) {
  return <ArticleReadingFrame {...args} frontMatter={{ title: 'Giving a page room to breathe', subtitle: 'A few thoughts on reading, looking, and finding your way through a longer story.', date: '2026-10-05', readingTime: { text: '5 min read' } }} sections={[
    { key: 'rhythm', title: 'A little breathing room' },
    { key: 'images', title: 'Looking more closely', navLabel: 'Images' },
    { key: 'film', title: 'A moment of movement', navLabel: 'Film' },
    { key: 'return', title: 'Keep your place' }
  ]}>{sections => <>
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
  </>}</ArticleReadingFrame>;
}

export function FocusedEssayDemo(args) {
  return <ArticleReadingFrame contents='none' defaultProgressiveBlur={false} {...args} variant='essay'
    frontMatter={{ title: 'The value of a quiet page', subtitle: 'An essay on attention, restraint, and leaving enough room for an idea.', date: '2026-10-05', readingTime: { text: '3 min read' } }}
    sections={[{ key: 'attention', title: 'Attention takes time', navLabel: 'Essay' }, { key: 'restraint', title: 'Choosing what to leave out' }, { key: 'ending', title: 'A place to finish' }]}>
    {sections => <>
      <section aria-labelledby={sections[0].id}>
        <h2 id={sections[0].id} tabIndex={-1}>{sections[0].title}</h2>
        <p>Reading asks us to stay with something for a while. A quiet page makes that choice easier: a clear title, a useful introduction, and a column that does not ask the eye to travel too far.</p>
        <p>There is no image to hurry past here, and no rail to compete with the text. The page has one job. Each paragraph gives the next one a little room.</p>
        <div className='not-prose gaudi-blog-media'><Quote text='A page can do less and still give the reader more.' author='Gaudi journal' title='Sample editorial note' /></div>
        <p>A quotation can interrupt the rhythm gently. It gives one thought a different weight without introducing another panel or another destination.</p>
      </section>
      <section aria-labelledby={sections[1].id}>
        <h2 id={sections[1].id} tabIndex={-1}>{sections[1].title}</h2>
        <p>Restraint is a decision about what helps. Not every article needs a table of contents, a gallery, or a video. Short essays can trust the sequence of their headings.</p>
        <p>The useful parts remain: a publication date, a sense of reading time, visible links, and a quiet line of progress. Everything else makes way for the subject.</p>
        <p>It is tempting to fill an empty margin. Yet the margin is doing something already. It separates the story from the surrounding interface and gives the reading column a stable place to sit.</p>
      </section>
      <section aria-labelledby={sections[2].id}>
        <h2 id={sections[2].id} tabIndex={-1}>{sections[2].title}</h2>
        <p>A short essay does not need a busy conclusion. It needs enough space for the last idea to settle, and an obvious way to return to the beginning.</p>
        <p>On a phone, the column narrows and the title wraps. On a larger display, the words stay centered at the same comfortable measure. The available space changes; the pace does not.</p>
      </section>
    </>}
  </ArticleReadingFrame>;
}

export const seriesArticles = [
  {
    id: 'foundations', title: 'Start with shared foundations',
    subtitle: 'Part one of Publishing with Gaudi: establish the visual language before composing the page.',
    sections: [
      { key: 'tokens', title: 'Use one set of tokens', navLabel: 'Tokens', paragraphs: ['Start with the shared colors, spacing, and typography. An article should feel at home beside the rest of the site, whether the reader arrives from the archive or a search result.', 'Keep the main title distinct from section headings. Use the same text styles throughout the journal so readers can recognize the structure before reading every word.'] },
      { key: 'components', title: 'Choose the existing components', paragraphs: ['Gaudi already owns the article header, reading time, links, and series navigation. Compose these parts rather than introducing another version of each one.', 'Prepare the article metadata and destinations in the publishing application. The components can then concentrate on presentation and accessibility.'] },
      { key: 'next', title: 'Continue with the reading experience', paragraphs: ['The next part connects the article layout, section navigation, and reading progress. Open the series box above to see where this article sits in the sequence.'] }
    ]
  },
  {
    id: 'reading', title: 'Build the reading experience',
    subtitle: 'Part two of Publishing with Gaudi: connect the article, its contents, and the rest of the series.',
    sections: [
      { key: 'sequence', title: 'Keep the series within reach', navLabel: 'Series', paragraphs: ['A series gives a longer subject a useful sequence. The box above lists all three parts, marks this article as current, and keeps the other destinations visible when expanded.', 'The position indicator describes where this article sits in the supplied sequence. It does not imply that the reader has completed the earlier parts.'] },
      { key: 'reading', title: 'Share the reading boundary', navLabel: 'Reading', paragraphs: ['The article body, section links, and reading indicator refer to the same scroll viewport. Readers can jump to a section and still see their place in the article.', 'Series navigation shows your place in the sequence; the contents show your place within this article. Give both a clear purpose and enough room to remain distinct on a phone.'] },
      { key: 'next', title: 'Prepare the publication', paragraphs: ['The final part covers publication checks: useful destinations, descriptive headings, and a comfortable layout in both themes. Keep those checks alongside the content before publishing.'] }
    ]
  },
  {
    id: 'publishing', title: 'Prepare the article for publication',
    subtitle: 'Part three of Publishing with Gaudi: check the content, navigation, and responsive layout.',
    sections: [
      { key: 'destinations', title: 'Prepare useful destinations', navLabel: 'Links', paragraphs: ['Every other article in a series needs a destination supplied by the publishing application. Keep the current entry marked as the current step rather than turning it into a redundant link.', 'These examples use prepared journal paths. Replace them with the routes used by your own application when publishing.'] },
      { key: 'verify', title: 'Check the whole reading path', navLabel: 'Checks', paragraphs: ['Expand and collapse the series with the keyboard. Check that the current article stays identifiable and the remaining titles wrap inside the box.', 'Repeat the check on phones and larger displays in both themes. The series belongs with the article, while the section contents remain part of its reading navigation.'] },
      { key: 'finish', title: 'Leave a clear ending', paragraphs: ['The last part can still point back to the earlier articles. A complete sequence gives readers room to revisit a topic without filling the article with another set of controls.'] }
    ]
  }
];

const seriesPosts = seriesArticles.map((article, index) => ({
  id: article.id, title: article.title, href: `/journal/publishing-with-gaudi/${article.id}`,
  series: 'Publishing with Gaudi', order: index + 1
}));

export function SeriesArticleDemo({ currentId = 'reading', ...args }) {
  const article = seriesArticles.find(entry => entry.id === currentId) || seriesArticles[1];
  return <ArticleReadingFrame defaultProgressiveBlur={false} {...args}
    frontMatter={{ id: article.id, title: article.title, subtitle: article.subtitle, date: '2026-10-13', readingTime: { text: '3 min read' }, seriesPosts }}
    sections={article.sections}>
    {sections => sections.map(section => <section key={section.id} aria-labelledby={section.id}>
      <h2 id={section.id} tabIndex={-1}>{section.title}</h2>
      {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
    </section>)}
  </ArticleReadingFrame>;
}

const articleCode = `import ArticleContentLayout from '@gaudi/design-system/layout/ArticleContentLayout';
import TableOfContents from '@gaudi/design-system/post/TableOfContents';
import Callout from '@gaudi/design-system/mdx/Callout';

export function Article({ toc, articleRef, readingViewportRef, children }) {
  return (
    <ArticleContentLayout collapsibleAside aside={
      <TableOfContents toc={toc} contentRef={articleRef} targetRef={readingViewportRef} />
    }>
      <Callout type="info">Use the same scroll boundary for navigation and progress.</Callout>
      {children}
    </ArticleContentLayout>
  );
}`;

export function TechnicalTutorialDemo(args) {
  return <ArticleReadingFrame contents='collapsible' defaultProgressiveBlur={false} {...args} variant='tutorial'
    frontMatter={{ title: 'Build an article with Gaudi', subtitle: 'Compose a reading page from shared components, one step at a time.', date: '2026-10-05', readingTime: { text: '6 min read' } }}
    sections={[{ key: 'setup', title: 'Set up the page', navLabel: 'Setup' }, { key: 'imports', title: 'Import the foundations', depth: 3 }, { key: 'compose', title: 'Compose the article', navLabel: 'Example' }, { key: 'navigation', title: 'Connect section navigation', depth: 3 }, { key: 'verify', title: 'Check the reading experience' }]}>
    {sections => <>
      <section aria-labelledby={sections[0].id}>
        <h2 id={sections[0].id} tabIndex={-1}>{sections[0].title}</h2>
        <p>Start with the components that already own the reading experience. The page supplies its content and destinations; the design system supplies its typography, navigation, media controls, and accessibility behavior.</p>
        <h3 id={sections[1].id} tabIndex={-1}>{sections[1].title}</h3>
        <p>Import the global stylesheet once at the application root. Use the supported component entrypoints for the article itself.</p>
        <div className='not-prose gaudi-blog-media'><CodeBlock code="import '@gaudi/design-system/global.css';" language='jsx' label='Global stylesheet import' /></div>
        <div className='not-prose'><Callout type='info'>The application owns article data and routes. Keep those values outside the reusable layout component.</Callout></div>
      </section>
      <section aria-labelledby={sections[2].id}>
        <h2 id={sections[2].id} tabIndex={-1}>{sections[2].title}</h2>
        <p>ArticleContentLayout pairs a readable prose column with optional supporting navigation. The contents toggle is supplied by the layout, so every article gets the same keyboard and visibility behavior.</p>
        <div className='not-prose gaudi-blog-media'>
          <CodeBlock code={articleCode} language='jsx' showLineNumbers wrap label='Article composition'>
            <CodeBlockHeader><CodeBlockTitle>Article.jsx</CodeBlockTitle><CodeBlockCopyButton /></CodeBlockHeader>
          </CodeBlock>
        </div>
        <h3 id={sections[3].id} tabIndex={-1}>{sections[3].title}</h3>
        <p>Give each heading a stable identifier. Share one ScrollArea viewport reference with TableOfContents and ReadingIndicator. TableOfContents uses the shared Scrollspy, so section links and reading progress describe the same reading position.</p>
        <div className='not-prose'><Callout type='warning'>Avoid nesting the article in a second scrolling region. Two independent scroll boundaries can make section links and reading progress disagree.</Callout></div>
      </section>
      <section aria-labelledby={sections[4].id}>
        <h2 id={sections[4].id} tabIndex={-1}>{sections[4].title}</h2>
        <p>Navigate between headings, hide and reveal the contents, copy the example, and return to the title. Check those actions with the keyboard as well as the pointer.</p>
        <p>Repeat the check on a narrow phone and a wide desktop. Code should wrap or scroll within its own container, while the article itself remains aligned with the page.</p>
      </section>
    </>}
  </ArticleReadingFrame>;
}

export function PhotoEssayDemo(args) {
  return <ArticleReadingFrame contents='none' defaultProgressiveBlur={false} {...args} variant='visual'
    frontMatter={{ title: 'Three studies in color', subtitle: 'A visual essay about soft edges, shifting light, and the spaces between.', date: '2026-10-05', readingTime: { text: '2 min read' } }}
    sections={[{ key: 'lavender', title: 'Soft forms', navLabel: 'Lead image' }, { key: 'collection', title: 'A change in light', navLabel: 'Gallery' }, { key: 'caption', title: 'The detail that stays' }]}>
    {sections => <>
      <section aria-labelledby={sections[0].id}>
        <h2 id={sections[0].id} tabIndex={-1}>{sections[0].title}</h2>
        <p>Begin with the image. A broad field of lavender leaves room for the eye to find its own path before the text offers an interpretation.</p>
        <div className='not-prose gaudi-blog-media'><ImageGallery label='Lead color study' images={[studies[0]]} /></div>
      </section>
      <section aria-labelledby={sections[1].id}>
        <h2 id={sections[1].id} tabIndex={-1}>{sections[1].title}</h2>
        <p>Peach and aqua change the mood without changing the underlying gesture. Select a study to view its full composition and move between the two images.</p>
        <div className='not-prose gaudi-blog-media'><ImageGallery label='Paired color studies' images={studies.slice(1)} layout='grid' columns={{ mobile: 1, tablet: 2, desktop: 2 }} /></div>
      </section>
      <section aria-labelledby={sections[2].id}>
        <h2 id={sections[2].id} tabIndex={-1}>{sections[2].title}</h2>
        <p>A visual essay can give an image more space and the text less. Short captions identify each study, while the full viewer keeps a closer look within reach.</p>
        <p>These are local gradient artworks used to demonstrate the layout. Replace them with your own photographs and descriptive alternative text when publishing.</p>
      </section>
    </>}
  </ArticleReadingFrame>;
}
