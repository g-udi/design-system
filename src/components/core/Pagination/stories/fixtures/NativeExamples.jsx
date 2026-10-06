import { PaginationBar } from '@gaudi/design-system/core/Pagination';
import { useState } from 'react';

const getHref = (page) => `/blog/page/${page}`;

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

function ControlledExample({ onPageChange }) {
  const [page, setPage] = useState(2);
  const update = (next) => {
    setPage(next);
    onPageChange?.(next);
  };
  return <PaginationBar currentPage={page} totalPages={4} getHref={getHref} onPageChange={update} />;
}

export const exampleDefaults = { currentPage: 3, totalPages: 8, label: 'Archive pages' };

export function PlaygroundDemo(props) {
  const args = { ...exampleDefaults, ...props };
    const page = clampPage(args);
    return (
      <div className='grid grid-cols-1 gap-4'>
        <div className='flex items-baseline justify-between gap-3 text-sm'>
          <span className='font-semibold text-text'>{args.label}</span>
          <span className='text-text-muted'>{rangeLabel(page, args.totalPages)}</span>
        </div>
        <ol className='m-0 grid list-none grid-cols-1 gap-1.5 p-0'>
          {pagePosts(page).map((post) => (
            <li key={post.number} className='flex items-center gap-3 rounded-lg border border-border px-3 py-2.5'>
              <span className='w-6 shrink-0 text-xs font-semibold tabular-nums text-text-muted'>{post.number}</span>
              <span className='min-w-0 flex-1'>
                <span className='block truncate text-sm font-medium text-text'>{post.title}</span>
                <span className='block text-xs text-text-muted'>{post.tag} · {post.minutes} min read</span>
              </span>
            </li>
          ))}
        </ol>
        <PaginationBar getHref={getHref} {...args} currentPage={page} />
      </div>
    );
  }

export const ControlledDemo = (args) => <ControlledExample {...args} />;

export { getHref, clampPage, pagePosts, rangeLabel };
