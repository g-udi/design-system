import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';

import { expect, userEvent, waitFor, within } from 'storybook/test';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { BlogArticleDemo } from './fixtures/BlogArticleDemo.jsx';
import blogArticleSource from './fixtures/BlogArticleDemo.jsx?raw';
import blogArticleStyles from './fixtures/BlogArticleDemo.css?raw';

import ArticleContentLayout from '..';

import Link from '../../../core/Link';

const story = description => ({
  docs: {
    description: {
      story: description
    }
  }
});

const aside = <nav className='space-y-2 px-1 py-4' aria-label='Article contents'>
    <p className='text-sm font-semibold text-text'>On this page</p>
    <Link href='#layout-boundaries' tone='accent' className='block text-sm'>Layout boundaries</Link>
    <Link href='#reading-column' tone='accent' className='block text-sm'>The reading column</Link>
  </nav>;

export const ArticleContent = {
  name: 'ArticleContentLayout',
  args: {
    collapsibleAside: true,
    padding: 'md'
  },
  argTypes: {
    collapsibleAside: {
      control: 'boolean',
      description: 'Add a show/hide toggle above the aside.'
    },
    padding: {
      control: 'inline-radio',
      options: ['md', 'lg'],
      description: 'Vertical prose padding.'
    }
  },
  parameters: { ...story('The reading column beside a contents aside. `collapsibleAside` adds the show/hide toggle; `padding` sets the prose spacing.'), __id: 'layout-components--article-content' },
  render: args => <div className='mx-auto max-w-6xl px-6'>
      <ArticleContentLayout aside={aside} {...args}>
        <h1 id='layout-boundaries'>Layout boundaries</h1>
        <p>ArticleContentLayout keeps long-form content and its supporting navigation readable across breakpoints.</p>
        <h2 id='reading-column'>The reading column</h2>
        <p>Prose keeps its measure while the aside takes three of nine columns on wide screens and moves above the article on small ones.</p>
      </ArticleContentLayout>
    </div>,
  play: async ({
    args,
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    if (!args.collapsibleAside) return;
    await userEvent.click(canvas.getByRole('button', {
      name: 'Hide Table of contents'
    }));
    await expect(canvas.queryByRole('navigation', {
      name: 'Article contents'
    })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Show Table of contents'
    }));
    await expect(canvas.getByRole('navigation', {
      name: 'Article contents'
    })).toBeVisible();
  }
};

export const BlogArticle = {
  name: 'Blog article',
  args: { smooth: true },
  argTypes: {
    smooth: { control: 'boolean', description: 'Smooth mouse-wheel scrolling in the article viewport. Keyboard, touch, and reduced-motion reading remain native.' }
  },
  parameters: { docs: {
    description: { story: 'A complete blog reading composition: persistent journal navigation, SmoothScrollArea as the article host, ReadingIndicator, a responsive contents rail powered by Scrollspy, an expandable single image, a gallery, and a captioned video. All section links and progress share the same viewport ref. Use the Blur edges switch below the article title to compare clear reading with soft viewport edges inspired by [Skiper UI Progressive Blur](https://skiper-ui.com/v1/skiper41). The effect clears at the start/end, during keyboard navigation, and for reduced motion. Pass `defaultProgressiveBlur={false}` to start with clear edges. During migration, replace the sample article and local media with blog content while retaining this scroll boundary.' },
    source: playgroundSource('BlogArticleDemo', { imports: publicSource(blogArticleSource.replace("import styles from './BlogArticleDemo.css?raw';", `const styles = \`\n${blogArticleStyles}\`;`), new URL('./fixtures/BlogArticleDemo.jsx', import.meta.url)) })
  } },
  render: args => <BlogArticleDemo {...args} />,
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const viewport = canvas.getByRole('region', { name: 'Blog post content' });
    const progress = canvas.getByRole('progressbar', { name: 'Article reading progress' });
    const header = canvas.getByRole('navigation', { name: 'Journal navigation' });
    const contents = canvas.getByRole('navigation', { name: 'Article contents' });
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

    await userEvent.click(within(header).getByRole('link', { name: 'Images' }));
    await waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(300));
    await waitFor(() => expect(within(contents).getByRole('link', { name: 'Looking more closely' })).toHaveAttribute('aria-current', 'location'));
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
        if (innerWidth >= 1024) expect(canvasElement.querySelector('.gaudi-blog-aside').getBoundingClientRect().top).toBeGreaterThanOrEqual(viewport.getBoundingClientRect().top);
      } });
    }
    await userEvent.click(within(header).getByRole('link', { name: 'Gaudi journal' }));
    await waitFor(() => expect(viewport.scrollTop).toBeLessThan(80));
    video.currentTime = 0;
    within(header).getByRole('link', { name: 'Gaudi journal' }).blur();
    viewport.scrollTop = 0;
  }
};

const docs = getComponentDocs('Layout/ArticleContentLayout');

export default {
  title: 'Layout/ArticleContentLayout',
  id: 'layout-article-content-layout',
  component: ArticleContentLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => ArticleContent }) } }
};
