import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';

import { expect, spyOn, userEvent, waitFor, within } from 'storybook/test';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { BlogArticleDemo, FocusedEssayDemo, TechnicalTutorialDemo, PhotoEssayDemo, SeriesArticleDemo, seriesArticles } from './fixtures/BlogArticleDemo.jsx';
import blogArticleSource from './fixtures/BlogArticleDemo.jsx?raw';
import blogArticleStyles from './fixtures/BlogArticleDemo.css?raw';

import ArticleContentLayout from '..';

const articleSource = publicSource(blogArticleSource.replace("import styles from './BlogArticleDemo.css?raw';", `const styles = \`\n${blogArticleStyles}\`;`), new URL('./fixtures/BlogArticleDemo.jsx', import.meta.url));

export const BlogArticle = {
  name: 'Blog article',
  args: { smooth: true, contents: 'visible' },
  argTypes: {
    contents: { control: 'select', options: ['visible', 'none', 'collapsible', 'collapsed'], description: 'Keep the table of contents visible, omit it, or allow readers to expand and collapse it.' },
    smooth: { control: 'boolean', description: 'Smooth mouse-wheel scrolling in the article viewport. Keyboard, touch, and reduced-motion reading remain native.' }
  },
  parameters: { controlAudit: { interaction: ['smooth'] }, docs: {
    description: { story: 'A complete blog reading composition: persistent journal navigation, ScrollArea as the article host, PostHeader, ReadingIndicator, a responsive contents rail powered by Scrollspy, an expandable single image, a gallery, and a captioned video. All section links and progress share the same viewport ref. Use the Blur edges switch below the article title to compare clear reading with soft viewport edges inspired by [Skiper UI Progressive Blur](https://skiper-ui.com/v1/skiper41). The effect clears at the start/end, during keyboard navigation, and for reduced motion. Pass `defaultProgressiveBlur={false}` to start with clear edges. Reuse the scroll boundary when adding your own article content.' },
    source: playgroundSource('BlogArticleDemo', { imports: articleSource })
  } },
  render: args => <BlogArticleDemo {...args} />,
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const viewport = canvas.getByRole('region', { name: 'Blog post content' });
    const progress = canvas.getByRole('progressbar', { name: 'Article reading progress' });
    const header = canvas.getByRole('navigation', { name: 'Journal navigation' });
    await expect(canvas.getByRole('heading', { level: 1, name: 'Giving a page room to breathe' })).toBeVisible();
    if (context.args.contents === 'collapsed') {
      await expect(canvas.queryByRole('navigation', { name: 'Article contents' })).not.toBeInTheDocument();
      await userEvent.click(canvas.getByRole('button', { name: 'Show Table of contents' }));
    } else if (context.args.contents === 'collapsible') {
      await userEvent.click(canvas.getByRole('button', { name: 'Hide Table of contents' }));
      await expect(canvas.queryByRole('navigation', { name: 'Article contents' })).not.toBeInTheDocument();
      await userEvent.click(canvas.getByRole('button', { name: 'Show Table of contents' }));
    }
    const contents = canvas.queryByRole('navigation', { name: 'Article contents' });
    if (context.args.contents === 'none') await expect(contents).toBeNull();
    else await expect(contents).toBeVisible();
    const initialHeaderTop = header.getBoundingClientRect().top;
    const initialPageTop = window.scrollY;
    const blurSwitch = canvas.getByRole('switch', { name: 'Blur edges' });
    const blurEnabled = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (blurEnabled) {
      await expect(blurSwitch).toBeChecked();
      const readingPosition = viewport.scrollTop;
      await userEvent.click(blurSwitch);
      await expect(canvasElement.querySelector('.gaudi-blog-blur')).toBeNull();
      await expect(viewport.scrollTop).toBe(readingPosition);
      await userEvent.click(blurSwitch);
      blurSwitch.blur();
    } else {
      await expect(blurSwitch).toBeDisabled();
      await expect(blurSwitch).not.toBeChecked();
    }
    const topBlur = canvasElement.querySelector('.gaudi-blog-blur[data-edge="top"]');
    const bottomBlur = canvasElement.querySelector('.gaudi-blog-blur[data-edge="bottom"]');
    if (blurEnabled) {
      await waitFor(() => expect(bottomBlur.style.opacity).toBe('1'));
      await expect(topBlur.style.opacity).toBe('0');
      await expect(getComputedStyle(topBlur).pointerEvents).toBe('none');
    } else {
      await expect(topBlur).toBeNull();
      await expect(bottomBlur).toBeNull();
    }

    if (contents) {
      await userEvent.click(within(contents).getByRole('link', { name: 'Looking more closely' }));
      await waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(300));
    }
    await userEvent.click(within(header).getByRole('link', { name: 'Images' }));
    await waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(300));
    if (contents) await waitFor(() => expect(within(contents).getByRole('link', { name: 'Looking more closely' })).toHaveAttribute('aria-current', 'location'));
    await waitFor(() => expect(Number(progress.getAttribute('aria-valuenow'))).toBeGreaterThan(0));
    await expect(header.getBoundingClientRect().top).toBeCloseTo(initialHeaderTop, 0);
    await expect(window.scrollY).toBe(initialPageTop);
    if (blurEnabled) await waitFor(() => expect(topBlur.style.opacity).toBe('1'));

    const gallery = canvas.getByRole('region', { name: 'Color studies' });
    const opener = within(gallery).getByRole('button', { name: 'Open image: Lavender abstract composition' });
    await userEvent.click(opener);
    const dialog = await page.findByRole('dialog');
    const readingPosition = viewport.scrollTop;
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(dialog).toHaveTextContent('Peach bloom'));
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ ...context, id: `${context.id}--lightbox` });
    }
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument());
    if (canvasElement.ownerDocument.hasFocus()) await expect(opener).toHaveFocus();
    // Resizing the article for the optional responsive audit changes its layout.
    if (import.meta.env.VITE_GAUDI_AUDIT !== '1') await expect(viewport.scrollTop).toBeCloseTo(readingPosition, 0);

    await userEvent.click(within(header).getByRole('link', { name: 'Film' }));
    const video = canvasElement.querySelector('video');
    await waitFor(() => expect(video.duration).toBeGreaterThan(0), { timeout: 10000 });
    await userEvent.click(canvas.getByRole('button', { name: 'Play', exact: true }));
    await waitFor(() => expect(video.currentTime).toBeGreaterThan(0));
    await userEvent.click(canvas.getByRole('button', { name: 'Pause', exact: true }));
    await expect(video.paused).toBe(true);
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Captions' }), '0');
    await expect(video.textTracks[0].mode).toBe('showing');
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Captions' }), 'off');

    if (blurEnabled) {
      // Focused controls must stay clear even while they cross an edge.
      await userEvent.keyboard('{Tab}');
      if (canvasElement.ownerDocument.hasFocus()) await expect(getComputedStyle(bottomBlur).opacity).toBe('0');
      viewport.scrollTop = viewport.scrollHeight;
      await waitFor(() => expect(bottomBlur.style.opacity).toBe('0'));
    }

    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      canvasElement.ownerDocument.activeElement?.blur();
      await auditStoryLayout({ ...context, id: `${context.id}--reading`, beforeAuditWidth: async () => {
        viewport.scrollTop = viewport.scrollHeight * 0.5;
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        expect(header.getBoundingClientRect().top).toBeCloseTo(initialHeaderTop, 0);
        expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1);
        const aside = canvasElement.querySelector('.gaudi-blog-aside');
        if (aside && innerWidth >= 1024) expect(aside.getBoundingClientRect().top).toBeGreaterThanOrEqual(viewport.getBoundingClientRect().top);
      } });
    }
    await userEvent.click(within(header).getByRole('link', { name: 'Gaudi journal' }));
    await waitFor(() => expect(viewport.scrollTop).toBeLessThan(80));
    video.currentTime = 0;
    within(header).getByRole('link', { name: 'Gaudi journal' }).blur();
    viewport.scrollTop = 0;
    if (context.args.contents === 'collapsed') await userEvent.click(canvas.getByRole('button', { name: 'Hide Table of contents' }));
  }
};

export const SeriesArticle = {
  name: 'Series article',
  args: { smooth: true, contents: 'visible', currentId: 'reading' },
  argTypes: {
    smooth: BlogArticle.argTypes.smooth,
    contents: BlogArticle.argTypes.contents,
    currentId: { control: 'select', options: seriesArticles.map(article => article.id), description: 'Select the article to update its content, current series entry, and position indicator together.' }
  },
  parameters: { controlAudit: { interaction: ['smooth'] }, docs: {
    description: { story: 'The second article in a three-part series. PostHeader composes the existing PostSeriesBox from prepared seriesPosts and the article id. Expand the box to see the full sequence; change currentId to preview any part with its own content and position. Contents remain section navigation for the current article. Journal link destinations are prepared sample routes owned by the publishing app.' },
    source: playgroundSource('SeriesArticleDemo', { imports: articleSource })
  } },
  render: args => <SeriesArticleDemo {...args} />,
  play: async (context) => {
    const { args, canvasElement } = context;
    const canvas = within(canvasElement);
    const article = seriesArticles.find(entry => entry.id === args.currentId) || seriesArticles[1];
    const position = seriesArticles.indexOf(article) + 1;
    await expect(canvas.getByRole('heading', { level: 1, name: article.title })).toBeVisible();
    const trigger = canvas.getByRole('button', { name: /Publishing with Gaudi/u });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.getByRole('progressbar', { name: 'Series progress' })).toHaveAttribute('aria-valuenow', String(position));
    await expect(canvas.getByRole('progressbar', { name: 'Series progress' })).toHaveAttribute('aria-valuemax', '3');
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ ...context, id: `${context.id}--collapsed` });
    }
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    for (const entry of seriesArticles) {
      if (entry.id === article.id) {
        const current = canvas.getAllByText(entry.title).find(element => element.hasAttribute('aria-current'));
        await expect(current).toHaveAttribute('aria-current', 'step');
        await expect(canvas.queryByRole('link', { name: entry.title })).not.toBeInTheDocument();
      } else await expect(canvas.getByRole('link', { name: entry.title })).toHaveAttribute('href', `/journal/publishing-with-gaudi/${entry.id}`);
    }
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  }
};

export const FocusedEssay = {
  name: 'Focused essay',
  args: { smooth: true },
  argTypes: { smooth: BlogArticle.argTypes.smooth },
  parameters: { controlAudit: { interaction: ['smooth'] }, docs: {
    description: { story: 'A centered, text-first essay with a quiet header and a pull quote. It starts without contents or edge blur; the shorter sequence relies on its headings and reading progress.' },
    source: playgroundSource('FocusedEssayDemo', { imports: articleSource })
  } },
  render: args => <FocusedEssayDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'The value of a quiet page' })).toBeVisible();
    await expect(canvas.queryByRole('navigation', { name: 'Article contents' })).not.toBeInTheDocument();
    await expect(canvas.getByText('A page can do less and still give the reader more.')).toBeVisible();
    await expect(canvasElement.querySelector('.gaudi-blog-blur')).toBeNull();
    await userEvent.click(canvas.getByRole('link', { name: 'Back to the beginning' }));
    await waitFor(() => expect(canvas.getByRole('region', { name: 'Blog post content' }).scrollTop).toBeLessThan(80));
  }
};

export const TechnicalTutorial = {
  name: 'Technical tutorial',
  args: { smooth: true },
  argTypes: { smooth: BlogArticle.argTypes.smooth },
  parameters: { controlAudit: { interaction: ['smooth'] }, docs: {
    description: { story: 'A practical tutorial with nested section navigation, code examples, copy actions, and informational and warning callouts. The collapsible contents rail follows the reader on wide screens and moves above the content on phones.' },
    source: playgroundSource('TechnicalTutorialDemo', { imports: articleSource })
  } },
  render: args => <TechnicalTutorialDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Build an article with Gaudi' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Hide Table of contents' }));
    await expect(canvas.queryByRole('navigation', { name: 'Article contents' })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Show Table of contents' }));
    const contents = canvas.getByRole('navigation', { name: 'Article contents' });
    await userEvent.click(within(contents).getByRole('link', { name: 'Connect section navigation' }));
    await waitFor(() => expect(within(contents).getByRole('link', { name: 'Connect section navigation' })).toHaveAttribute('aria-current', 'location'));
    const code = canvas.getByText('Article.jsx').closest('[data-slot="code-block"]');
    const copy = spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    try {
      await userEvent.click(within(code).getByRole('button', { name: 'Copy code' }));
      await waitFor(() => expect(copy).toHaveBeenCalledWith(expect.stringContaining('export function Article')));
    } finally { copy.mockRestore(); }
    await userEvent.click(canvas.getByRole('link', { name: 'Gaudi journal' }));
    await waitFor(() => expect(canvas.getByRole('region', { name: 'Blog post content' }).scrollTop).toBeLessThan(80));
  }
};

export const PhotoEssay = {
  name: 'Photo essay',
  args: { smooth: true },
  argTypes: { smooth: BlogArticle.argTypes.smooth },
  parameters: { controlAudit: { interaction: ['smooth'] }, docs: {
    description: { story: 'A wider visual essay with a prominent lead image, a two-image gallery, short passages, and captions. Local gradient artwork stands in for publication photography. The layout omits the contents rail and starts with clear viewport edges.' },
    source: playgroundSource('PhotoEssayDemo', { imports: articleSource })
  } },
  render: args => <PhotoEssayDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Three studies in color' })).toBeVisible();
    await expect(canvas.queryByRole('navigation', { name: 'Article contents' })).not.toBeInTheDocument();
    const opener = within(canvas.getByRole('region', { name: 'Paired color studies' })).getByRole('button', { name: 'Open image: Peach and pink color study' });
    await userEvent.click(opener);
    const dialog = await body.findByRole('dialog');
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(dialog).toHaveTextContent('Cool light'));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole('link', { name: 'Gaudi journal' }));
    await waitFor(() => expect(canvas.getByRole('region', { name: 'Blog post content' }).scrollTop).toBeLessThan(80));
  }
};

const docs = getComponentDocs('Blocks/Blog/Article');

export default {
  title: 'Blocks/Blog/Article',
  id: 'layout-article-content-layout',
  component: ArticleContentLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => BlogArticle }) } }
};
