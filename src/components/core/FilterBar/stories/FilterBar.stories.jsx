import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { previewSource } from '../../../../docs/components/previewSource';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { Collection, matching, initial } from './fixtures/ArticleFilterExample.jsx';
import articleSource from './fixtures/ArticleFilterExample.jsx?raw';
import { LibraryFilters, libraryFacets } from './fixtures/LibraryFiltersExample.jsx';
import librarySource from './fixtures/LibraryFiltersExample.jsx?raw';
import { articles } from '../../../../docs/fixtures/application/data';
import FilterBar from '../FilterBar';

const copyableArticleSource = articleSource.replace(/^import \{ articles \} from .*;$/m, `const articles = ${JSON.stringify(articles, null, 2)};`);
const docs = getComponentDocs('Core/FilterBar');
export default {
  title: 'Core/Data Display/FilterBar', id: 'core-filterbar',
  component: FilterBar,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { query: 'text', placeholder: 'text', filterLabel: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { query: '', placeholder: 'Search articles…', filterLabel: 'Filters', searchLabel: 'Search articles' },
  argTypes: { searchLabel: { table: { disable: true } } },
  parameters: {
    docs: {
      description: {
        story: 'An article register. The search shows a live count; Filters opens status, category and author facets with counts; every selected value becomes a removable chip. The host filters the rows with its own predicate and hands the visible ones to DataTable.'
      },
      source: { type: 'dynamic', language: 'jsx', transform: (_source, { args }) => previewSource('Collection', args, { before: `${publicSource(copyableArticleSource, new URL('./fixtures/ArticleFilterExample.jsx', import.meta.url))}\n\n` }) }
    }
  },
  // Remount when the seeded query changes so the search box and results follow the control.
  render: (args) => <Collection key={args.query} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const status = canvas.getByText(/of \d+ articles$/);
    const search = canvas.getByRole('searchbox', { name: args.searchLabel });
    const trigger = () => canvas.getByRole('button', { name: new RegExp(`^${args.filterLabel}`) });
    const count = (filters) => `${matching({ query: args.query, ...initial, ...filters }).length} of ${articles.length} articles`;
    await expect(search).toHaveValue(args.query);
    if (!args.query) await expect(search).toHaveAttribute('placeholder', args.placeholder);
    await expect(status).toHaveTextContent(count({}));
    await expect(trigger()).toHaveTextContent('2');

    // Pick a category in the facet popover; the chip and the count follow.
    await userEvent.click(trigger());
    await userEvent.click(await page.findByRole('tab', { name: 'Category' }));
    await userEvent.click(page.getByRole('radio', { name: /^Research/ }));
    await userEvent.click(page.getByRole('button', { name: 'Done' }));
    await expect(status).toHaveTextContent(count({ category: 'Research' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Research filter' }));
    await expect(status).toHaveTextContent(count({}));

    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }));
    await expect(status).toHaveTextContent(`${articles.length} of ${articles.length} articles`);
    await userEvent.type(search, 'knowledge');
    await expect(status).toHaveTextContent(`1 of ${articles.length} articles`);
    await userEvent.type(search, ' nothing');
    await expect(canvas.getByText('No matching articles')).toBeVisible();

    // Restore the seeded state so the preview ends rich.
    await userEvent.clear(search);
    if (args.query) await userEvent.type(search, args.query);
    await userEvent.click(trigger());
    await userEvent.click(await page.findByRole('tab', { name: 'Status' }));
    for (const value of initial.status) await userEvent.click(page.getByRole('checkbox', { name: new RegExp(`^${value}`) }));
    await userEvent.click(page.getByRole('button', { name: 'Done' }));
    await expect(status).toHaveTextContent(count({}));
  }
};

export const AppliedFilters = {
  parameters: { docs: { description: { story: 'Without facets, `filters` lists host-applied filters as chips; `onRemoveFilter` and `onClearFilters` remove one or all.' } } },
  render: function Render() {
    const [filters, setFilters] = useState([
      { id: 'published', field: 'Status', label: 'Published' },
      { id: 'research', field: 'Category', label: 'Research' }
    ]);
    return (
      <FilterBar
        filters={filters}
        onRemoveFilter={(id) => setFilters((current) => current.filter((filter) => filter.id !== id))}
        onClearFilters={() => setFilters([])}
      />
    );
  },
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
    await auditStoryLayout({ ...context, id: `${context.id}--populated` });
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Research filter' }));
    await expect(canvas.queryByText('Research')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }));
    await expect(canvas.queryByRole('group', { name: 'Applied filters' })).not.toBeInTheDocument();
  }
};

export const LongOptionsAndPhones = {
  parameters: {
    docs: {
      description: {
        story:
          'A library with six facets and long option labels. The option column keeps the popover width and truncates long labels, with the full label in the tooltip. Below the small breakpoint the facet rail becomes a one-line facet select above a scrollable option list, so phones still show a full page of options.'
      },
      source: { language: 'jsx', code: `${publicSource(librarySource, new URL('./fixtures/LibraryFiltersExample.jsx', import.meta.url))}\n\n<LibraryFilters />` }
    }
  },
  render: () => <LibraryFilters />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: /^Filters/ }));
    // Collection is the first facet, so it is open on every viewport (rail on desktop, facet select on phones).
    const long = await page.findByRole('checkbox', { name: /^Research notes/ });
    const pane = long.closest('.ds-facet-pane');
    const option = long.closest('label');
    // The long label truncates inside the pane rather than widening it, and keeps its full text as a tooltip.
    await expect(option.scrollWidth).toBeLessThanOrEqual(pane.clientWidth);
    await expect(option.querySelector('[title]')).toHaveAttribute('title', libraryFacets[0].options[1].label);
    await userEvent.click(long);
    await expect(long).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(page.getByRole('button', { name: 'Done' }));
    await expect(canvas.getByRole('button', { name: /^Remove Research notes/ })).toBeVisible();
  }
};
