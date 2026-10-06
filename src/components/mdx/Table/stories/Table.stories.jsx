import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import Table from '../Table';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { columns, rows, TableExample } from './fixtures/TableExample.jsx';
import tableExampleSource from './fixtures/TableExample.jsx?raw';
import headerConsistencySource from './fixtures/HeaderConsistency.jsx?raw';
import { HeaderConsistencyExample } from './fixtures/HeaderConsistency.jsx';

const docs = getComponentDocs('MDX/Table');

export default {
  title: 'MDX/Table',
  id: 'mdx-table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  parameters: { docs: { source: { code: publicSource(tableExampleSource, new URL('./fixtures/TableExample.jsx', import.meta.url)), language: 'jsx' }, description: { story: 'Core Web Vitals per page template from a performance post: a caption, the row and cell parts, numeric metrics, and a status that uses words as well as colour. On narrow screens the table scrolls inside its frame.' } } },
  render: () => <TableExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('region', { name: 'Scrollable table' })).toHaveAttribute('tabindex', '0');
    const table = canvas.getByRole('table', { name: /75th-percentile field data/ });
    await expect(table).toHaveClass('w-full', 'table-auto');
    await expect(canvas.getAllByRole('row')).toHaveLength(rows.length + 1);
    for (const name of columns) await expect(canvas.getByRole('columnheader', { name })).toBeVisible();
    await expect(canvas.getByRole('cell', { name: 'Search' })).toBeVisible();
    await expect(canvas.getByRole('cell', { name: 'Needs work' })).toBeVisible();
    const region = canvas.getByRole('region', { name: 'Scrollable table' });
    const initialDirection = region.getAttribute('dir');
    const initialWidth = region.style.maxWidth;
    const initialTableWidth = table.style.minWidth;
    try {
      region.dir = 'rtl';
      region.style.maxWidth = '240px';
      table.style.minWidth = '800px';
      region.scrollLeft = -500;
      await waitFor(() => {
        const bounds = region.getBoundingClientRect();
        for (const cell of [canvas.getByRole('cell', { name: 'Home' }), canvas.getByRole('columnheader', { name: 'Template' })]) {
          expect(Math.abs(cell.getBoundingClientRect().right - bounds.right)).toBeLessThanOrEqual(2);
        }
      });
    } finally {
      region.style.maxWidth = initialWidth;
      table.style.minWidth = initialTableWidth;
      region.scrollLeft = 0;
      if (initialDirection === null) region.removeAttribute('dir');
      else region.setAttribute('dir', initialDirection);
    }
  }
};

export const HeaderConsistency = {
  parameters: { docs: { source: { code: publicSource(headerConsistencySource, new URL('./fixtures/HeaderConsistency.jsx', import.meta.url)), language: 'jsx' }, description: { story: 'The primitive, DataTable, DataGrid and article table share header type, colour, casing and density. Switch both density and fill to compare them.' } } },
  render: () => <HeaderConsistencyExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const typography = ['fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'textTransform', 'color'];
    const properties = [...typography, 'textAlign', 'backgroundColor', 'paddingInlineStart', 'paddingInlineEnd', 'paddingBlockStart', 'paddingBlockEnd'];
    const styles = (element, keys) => Object.fromEntries(keys.map(key => [key, getComputedStyle(element)[key]]));
    const assertHeaders = async () => {
      await waitFor(() => {
        const headers = canvas.getAllByRole('columnheader', { name: /^eTag/ });
        expect(headers).toHaveLength(4);
        const expected = styles(headers[0], properties);
        expect(expected.textTransform).toBe('none');
        expect(expected.fontWeight).toBe('500');
        for (const header of headers.slice(1)) {
          expect(styles(header, properties)).toEqual(expected);
          expect(Math.abs(header.getBoundingClientRect().height - headers[0].getBoundingClientRect().height)).toBeLessThanOrEqual(1);
          const button = header.querySelector('button');
          if (button) {
            expect(styles(button, typography)).toEqual(styles(headers[0], typography));
            expect(button.getBoundingClientRect().height).toBeGreaterThanOrEqual(parseFloat(getComputedStyle(button).lineHeight));
          }
        }
      });
    };
    const initialScale = canvasElement.style.getPropertyValue('--ds-space-scale');
    const initialDirection = canvasElement.getAttribute('dir');
    try {
      for (const direction of ['ltr', 'rtl']) {
        canvasElement.dir = direction;
        for (const scale of [0.75, 0.875, 1, 1.25, 1.5]) {
          canvasElement.style.setProperty('--ds-space-scale', scale);
          await assertHeaders();
          await userEvent.click(canvas.getByRole('switch', { name: 'Compact density' }));
          await assertHeaders();
          await userEvent.click(canvas.getByRole('switch', { name: 'Plain headers' }));
          await assertHeaders();
          await userEvent.click(canvas.getByRole('switch', { name: 'Compact density' }));
          await assertHeaders();
          await userEvent.click(canvas.getByRole('switch', { name: 'Plain headers' }));
        }
      }
      // Force a narrow RTL scroll region even when the story runs on a wide canvas.
      const region = canvas.getByRole('region', { name: 'Convenience table scrollable table' });
      const initialWidth = region.style.maxWidth;
      const table = within(region).getByRole('table');
      const initialTableWidth = table.style.minWidth;
      try {
        region.style.maxWidth = '240px';
        table.style.minWidth = '480px';
        region.scrollLeft = 0;
        const left = region.parentElement.querySelector('.ds-table-edge.left-2');
        const right = region.parentElement.querySelector('.ds-table-edge.right-2');
        await waitFor(() => {
          expect(left).toHaveAttribute('data-visible');
          expect(right).not.toHaveAttribute('data-visible');
        });
        region.focus();
        await userEvent.keyboard('{ArrowLeft}');
        await waitFor(() => {
          expect(region.scrollLeft).toBeLessThan(0);
          expect(right).toHaveAttribute('data-visible');
        });
      } finally {
        region.style.maxWidth = initialWidth;
        table.style.minWidth = initialTableWidth;
        region.scrollLeft = 0;
      }
    } finally {
      if (initialScale) canvasElement.style.setProperty('--ds-space-scale', initialScale);
      else canvasElement.style.removeProperty('--ds-space-scale');
      if (initialDirection === null) canvasElement.removeAttribute('dir');
      else canvasElement.setAttribute('dir', initialDirection);
    }
    for (const name of ['Convenience table', 'Compound grid']) {
      const region = canvasElement.querySelector(`section[aria-label="${name}"]`);
      const header = within(region).getByRole('columnheader', { name: /^eTag/ });
      const sortButton = within(header).getByRole('button');
      await userEvent.click(sortButton);
      await waitFor(() => expect(header).toHaveAttribute('aria-sort', 'ascending'));
      await expect(within(region).getAllByRole('row')[1]).toHaveTextContent('alpha');
      await userEvent.unhover(sortButton);
    }
  }
};
