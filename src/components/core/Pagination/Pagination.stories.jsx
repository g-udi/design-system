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
  args: { currentPage: 3, totalPages: 5 },
  parameters: {
    docs: {
      source: playgroundSource('PaginationBar', {
        imports: "import { PaginationBar } from '@gaudi/design-system';\n\nconst getHref = (page) => `/blog/page/${page}`;"
      })
    }
  },
  render: (args) => <PaginationBar getHref={getHref} {...args} />,
  play: async ({ args, canvasElement }) => {
    const navigation = nav(canvasElement);
    const { currentPage, totalPages } = args;
    await expect(status(navigation)).toHaveTextContent(new RegExp(`${currentPage}\\s*of\\s*${totalPages}`));
    await expect(navigation.getByRole('link', { name: String(currentPage) })).toHaveAttribute('aria-current', 'page');
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
