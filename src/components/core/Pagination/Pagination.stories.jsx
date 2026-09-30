import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import {
  PaginationBar,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
} from './Pagination';

const docs = getComponentDocs('Core/Pagination');
const getHref = (page) => `/blog/page/${page}`;
const nav = (canvasElement, name = 'Pagination') => within(within(canvasElement).getByRole('navigation', { name }));
const status = (navigation) => navigation.getByText('of').parentElement;
// The archive page the bar sits under: three posts per page, so the list and range follow the controls.
const perPage = 3;
const posts = [
  { title: 'Tokens before components', tag: 'Design systems', minutes: 6 },
  { title: 'Linked data for product teams', tag: 'Semantic web', minutes: 9 },
  { title: 'Shipping a docs site in a weekend', tag: 'Engineering', minutes: 4 },
  { title: 'Evaluating retrieval without a benchmark', tag: 'AI engineering', minutes: 11 },
  { title: 'The case for boring migrations', tag: 'Engineering', minutes: 7 }
];
const clampPage = ({ currentPage, totalPages }) => Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
const pagePosts = (page) => Array.from({ length: perPage }, (_, index) => {
  const number = (page - 1) * perPage + index + 1;
  return { number, ...posts[(number - 1) % posts.length] };
});
const rangeLabel = (page, totalPages) => `Posts ${(page - 1) * perPage + 1}–${page * perPage} of ${totalPages * perPage}`;

export default {
  title: 'Core/Pagination',
  id: 'core-pagination',
  component: PaginationBar,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { currentPage: 'number', totalPages: 'number' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { currentPage: 3, totalPages: 8 },
  parameters: {
    docs: {
      description: { story: 'A blog archive page: the post list, range, and bar all follow `currentPage` and `totalPages`. Previous and Next disable at either end, and hovering or focusing the status reveals page shortcuts, with ellipses past five pages.' },
      source: playgroundSource('PaginationBar', {
        imports: "import { PaginationBar } from '@gaudi/design-system';\n\nconst getHref = (page) => `/blog/page/${page}`;",
        attributes: ['getHref={getHref}'],
        before: '<>\n  <ol>{posts.map((post) => <li key={post.slug}>{post.title}</li>)}</ol>\n',
        after: '\n</>'
      })
    }
  },
  render: (args) => {
    const page = clampPage(args);
    return (
      <div className='grid gap-4'>
        <div className='flex items-baseline justify-between gap-3 text-sm'>
          <span className='font-semibold text-foreground'>Archive</span>
          <span className='text-text-muted'>{rangeLabel(page, args.totalPages)}</span>
        </div>
        <ol className='m-0 grid list-none gap-1.5 p-0'>
          {pagePosts(page).map((post) => (
            <li key={post.number} className='flex items-center gap-3 rounded-lg border border-border px-3 py-2.5'>
              <span className='w-6 shrink-0 text-xs font-semibold tabular-nums text-text-muted'>{post.number}</span>
              <span className='min-w-0 flex-1'>
                <span className='block truncate text-sm font-medium text-foreground'>{post.title}</span>
                <span className='block text-xs text-text-muted'>{post.tag} · {post.minutes} min read</span>
              </span>
            </li>
          ))}
        </ol>
        <PaginationBar getHref={getHref} {...args} currentPage={page} />
      </div>
    );
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = nav(canvasElement);
    const { totalPages } = args;
    const currentPage = clampPage(args);
    await expect(canvas.getByText(rangeLabel(currentPage, totalPages))).toBeVisible();
    await expect(canvas.getAllByText(pagePosts(currentPage)[0].title)[0]).toBeVisible();
    await expect(status(navigation)).toHaveTextContent(new RegExp(`${currentPage}\\s*of\\s*${totalPages}`));
    await expect(navigation.getByRole('link', { name: String(currentPage) })).toHaveAttribute('aria-current', 'page');
    if (totalPages > 5) await expect(navigation.getAllByText('...').length).toBeGreaterThan(0);
    if (currentPage > 1) await expect(navigation.getByRole('link', { name: 'Previous' })).toHaveAttribute('href', getHref(currentPage - 1));
    else await expect(navigation.getByRole('button', { name: 'Previous' })).toBeDisabled();
    if (currentPage < totalPages) await expect(navigation.getByRole('link', { name: 'Next' })).toHaveAttribute('href', getHref(currentPage + 1));
    else await expect(navigation.getByRole('button', { name: 'Next' })).toBeDisabled();
  }
};

function ControlledExample({ onPageChange }) {
  const [page, setPage] = useState(2);
  const update = (next) => {
    setPage(next);
    onPageChange(next);
  };
  return <PaginationBar currentPage={page} totalPages={4} getHref={getHref} onPageChange={update} />;
}
export const Controlled = {
  args: { onPageChange: fn() },
  parameters: { docs: { description: { story: '`onPageChange` switches every control to a button for client-side paging, and the host owns `currentPage`.' } } },
  render: (args) => <ControlledExample {...args} />,
  play: async ({ args, canvasElement }) => {
    const navigation = nav(canvasElement);
    await userEvent.click(navigation.getByRole('button', { name: 'Next' }));
    await expect(args.onPageChange).toHaveBeenLastCalledWith(3);
    await expect(status(navigation)).toHaveTextContent(/3\s*of\s*4/);
    // The shortcut layer reveals on focus-within, which is also the keyboard path.
    const lastPage = navigation.getByRole('button', { name: '4' });
    lastPage.focus();
    await userEvent.click(lastPage);
    await expect(args.onPageChange).toHaveBeenLastCalledWith(4);
    await expect(navigation.getByRole('button', { name: 'Next' })).toBeDisabled();
    await expect(navigation.getByRole('button', { name: 'Previous' })).toBeEnabled();
  }
};

const numberedPages = [1, 2, 3, null, 8];
export const Composed = {
  parameters: { docs: { description: { story: 'Compose `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, and `PaginationEllipsis` for numbered layouts.' } } },
  render: () => (
    <Pagination label='Numbered pages'>
      <PaginationContent>
        {numberedPages.map((page) => (
          <PaginationItem key={page ?? 'ellipsis'}>
            {page ? <PaginationLink href={getHref(page)} isActive={page === 3}>{page}</PaginationLink> : <PaginationEllipsis />}
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  ),
  play: async ({ canvasElement }) => {
    const navigation = nav(canvasElement, 'Numbered pages');
    const active = navigation.getByText('3');
    await expect(navigation.getAllByRole('listitem')).toHaveLength(numberedPages.length);
    await expect(active).toHaveAttribute('aria-current', 'page');
    await expect(navigation.getByRole('link', { name: '8' })).toHaveAttribute('href', getHref(8));
    await expect(navigation.getByText('...')).toBeVisible();
  }
};
