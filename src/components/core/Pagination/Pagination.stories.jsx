import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';

import { Pagination,
  PaginationBar,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationStatus } from './Pagination';

const componentDocs = getComponentDocs('Core/Pagination');
const getPageHref = (page) => `/blog/page/${page}`;

export default {
  component: PaginationBar,
  parameters: {
    docs: {
      description: { component: componentDocs.description },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  id: 'core-pagination',
  title: 'Core/Pagination'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole('navigation', { name: 'Pagination' });
    const previousButton = within(navigation).getByRole('button', { name: 'Previous' });
    const nextLink = within(navigation).getByRole('link', { name: 'Next' });
    const currentPage = within(navigation).getByRole('link', { name: '1' });

    await expect(previousButton).toBeDisabled();
    await expect(nextLink).toHaveAttribute('href', '/blog/page/2');
    await expect(currentPage).toHaveAttribute('aria-current', 'page');
  },
  render: () => <div className='p-6'><PaginationBar currentPage={ 1 } getHref={ getPageHref } totalPages={ 4 } /></div>
};

export const MiddlePage = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole('navigation', { name: 'Pagination' });

    await expect(within(navigation).getByRole('link', { name: 'Previous' })).toHaveAttribute('href', '/blog/page/2');
    await expect(within(navigation).getByRole('link', { name: 'Next' })).toHaveAttribute('href', '/blog/page/4');
    await expect(within(navigation).getByText('of').parentElement).toHaveTextContent(/3\s*of\s*5/);
    await expect(within(navigation).getByRole('link', { name: '3' })).toHaveAttribute('aria-current', 'page');
  },
  render: () => <div className='p-6'><PaginationBar currentPage={ 3 } getHref={ getPageHref } totalPages={ 5 } /></div>
};

export const Interactive = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole('navigation', { name: 'Interactive pages' });
    const getStatus = () => within(navigation).getByText('of').parentElement;

    await expect(getStatus()).toHaveTextContent(/2\s*of\s*4/);

    await userEvent.click(within(navigation).getByRole('button', { name: 'Next' }));
    await expect(getStatus()).toHaveTextContent(/3\s*of\s*4/);

    // The shortcut layer reveals on hover or focus-within; drive it via focus,
    // which is also the real keyboard path (synthetic hover can't trigger CSS :hover).
    const pageFourButton = within(navigation).getByRole('button', { name: '4' });

    pageFourButton.focus();
    await userEvent.click(pageFourButton);

    await expect(getStatus()).toHaveTextContent(/4\s*of\s*4/);
    await expect(within(navigation).getByRole('button', { name: 'Next' })).toBeDisabled();
    await expect(within(navigation).getByRole('button', { name: 'Previous' })).not.toBeDisabled();
  },
  render: function InteractivePagination() {
    const [ page, setPage ] = useState(2);
    const totalPages = 4;

    return (
      <div className='p-6'>
        <Pagination label='Interactive pages' className='border-t border-gray-200 pt-6 dark:border-gray-800'>
          <div className='grid w-full grid-cols-[1fr_auto_1fr] items-center gap-1'>
            <div className='flex justify-start'>
              <PaginationPrevious disabled={ page <= 1 } onClick={ () => setPage(page - 1) } />
            </div>
            <PaginationStatus currentPage={ page } getHref={ getPageHref } onPageChange={ setPage } totalPages={ totalPages } />
            <div className='flex justify-end'>
              <PaginationNext disabled={ page >= totalPages } onClick={ () => setPage(page + 1) } />
            </div>
          </div>
        </Pagination>
      </div>
    );
  }
};

export const Numbered = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole('navigation', { name: 'Numbered pages' });
    const items = within(navigation).getAllByRole('listitem');
    const activePage = within(navigation).getByText('3');

    await expect(items).toHaveLength(4);
    await expect(activePage).toHaveAttribute('aria-current', 'page');
    await expect(activePage.tagName).toBe('SPAN');
    await expect(within(navigation).getByRole('list')).toBeVisible();
  },
  render: () => (
    <div className='p-6'>
      <Pagination label='Numbered pages'>
        <PaginationContent className='rounded-2xl border border-gray-200 bg-white p-2 shadow-lg shadow-gray-950/10 dark:border-gray-800 dark:bg-gray-950'>
          {[ 1, 2, 3, 4 ].map((page) => (
            <PaginationItem key={ page }>
              <PaginationLink href='' isActive={ page === 3 }>{page}</PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>
      </Pagination>
    </div>
  )
};

export const Composed = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blogPagination = canvas.getByRole('navigation', { name: 'Blog pages' });
    const numberedPagination = canvas.getByRole('navigation', { name: 'Numbered pages' });
    const blogPrevious = within(blogPagination).getByText('Previous');
    const activeNumberedPage = within(numberedPagination).getByText('3');

    await expect(blogPrevious).toBeVisible();
    await expect(blogPrevious.tagName).toBe('SPAN');
    await expect(within(blogPagination).getByText('of').parentElement).toHaveTextContent(/3\s*of\s*5/);
    await expect(activeNumberedPage).toHaveAttribute('aria-current', 'page');
    await expect(within(numberedPagination).getByText('...')).toBeVisible();
  },
  render: () => (
    <div className='p-6'>
      <Pagination label='Blog pages' className='border-t border-gray-200 pt-6 dark:border-gray-800'>
        <div className='grid w-full grid-cols-[1fr_auto_1fr] items-center gap-1'>
          <div className='flex justify-start'>
            <PaginationPrevious href='' />
          </div>
          <PaginationStatus currentPage={ 3 } getHref={ () => '' } totalPages={ 5 } />
          <div className='flex justify-end'>
            <PaginationNext href='' />
          </div>
        </div>
      </Pagination>
      <Pagination label='Numbered pages' className='mt-8'>
        <PaginationContent className='rounded-2xl border border-gray-200 bg-white p-2 shadow-lg shadow-gray-950/10 dark:border-gray-800 dark:bg-gray-950'>
          <PaginationItem><PaginationLink href=''>1</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href=''>2</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href='' isActive>3</PaginationLink></PaginationItem>
          <PaginationItem><PaginationEllipsis /></PaginationItem>
          <PaginationItem><PaginationLink href=''>8</PaginationLink></PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
};
