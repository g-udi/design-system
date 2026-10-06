import { PlaygroundDemo, ControlledDemo, getHref, clampPage, pagePosts, rangeLabel, exampleDefaults } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';

import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';

import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import { PaginationBar } from '../Pagination';

const docs = getComponentDocs('Core/Pagination');

const nav = (canvasElement, name = 'Pagination') => within(within(canvasElement).getByRole('navigation', { name }));
const status = (navigation) => navigation.getByText('of').parentElement;
// The archive page the bar sits under: three posts per page, so the list and range follow the controls.

const exampleSource = publicSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Core/Navigation/Pagination',
  id: 'core-pagination',
  component: PaginationBar,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { currentPage: 'number', totalPages: 'number', label: 'text' }),
  parameters: {
    docs: {
      source: { code: exampleSource, language: 'jsx' },
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { ...exampleDefaults },
  parameters: {
    docs: {
      description: { story: 'A blog archive page: the post list, range, and bar all follow `currentPage` and `totalPages`, and `label` names the navigation landmark (shown here as the list heading). Previous and Next disable at either end, and clicking the status or pressing Enter or Space opens page shortcuts, with ellipses past five pages.' },
      source: { code: exampleSource, language: 'jsx' }
    }
  },
  render: PlaygroundDemo,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = nav(canvasElement, args.label);
    const { totalPages } = args;
    const currentPage = clampPage(args);
    await expect(canvas.getByText(rangeLabel(currentPage, totalPages))).toBeVisible();
    await expect(canvas.getAllByText(pagePosts(currentPage)[0].title)[0]).toBeVisible();
    await expect(status(navigation)).toHaveTextContent(new RegExp(`${currentPage}\\s*of\\s*${totalPages}`));
    const trigger = navigation.getByRole('button', { name: /^Page shortcuts:/ });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    const shortcuts = within(await within(canvasElement.ownerDocument.body).findByRole('dialog', { name: 'Page shortcuts' }));
    await expect(shortcuts.getByRole('link', { name: String(currentPage) })).toHaveAttribute('aria-current', 'page');
    if (totalPages > 5) await expect(shortcuts.getByText('More pages')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    if (currentPage > 1) await expect(navigation.getByRole('link', { name: 'Previous' })).toHaveAttribute('href', getHref(currentPage - 1));
    else await expect(navigation.getByRole('button', { name: 'Previous' })).toBeDisabled();
    if (currentPage < totalPages) await expect(navigation.getByRole('link', { name: 'Next' })).toHaveAttribute('href', getHref(currentPage + 1));
    else await expect(navigation.getByRole('button', { name: 'Next' })).toBeDisabled();
  }
};

export const Controlled = {
  args: { onPageChange: fn() },
  parameters: { docs: { description: { story: '`onPageChange` switches page links to buttons for client-side paging, and the host owns `currentPage`.' } } },
  render: ControlledDemo,
  play: async ({ args, canvasElement }) => {
    const navigation = nav(canvasElement);
    await userEvent.click(navigation.getByRole('button', { name: 'Next' }));
    await expect(args.onPageChange).toHaveBeenLastCalledWith(3);
    await expect(status(navigation)).toHaveTextContent(/3\s*of\s*4/);
    const trigger = navigation.getByRole('button', { name: /^Page shortcuts:/ });
    await userEvent.click(trigger);
    const lastPage = await within(canvasElement.ownerDocument.body).findByRole('button', { name: '4' });
    await userEvent.click(lastPage);
    await expect(args.onPageChange).toHaveBeenLastCalledWith(4);
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(navigation.getByRole('button', { name: 'Next' })).toBeDisabled();
    await expect(navigation.getByRole('button', { name: 'Previous' })).toBeEnabled();
  }
};
