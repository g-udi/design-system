import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import PageChrome from '..';

const docs = getComponentDocs('Blocks/Page Chrome');

export default {
  title: 'Blocks/Page Chrome',
  id: 'layout-page-chrome',
  component: PageChrome,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { background: 'boolean', scrollEdges: 'boolean' }),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};

// A miniature of LayoutContainer's structure: the background slot sits beside the page column.
export const Playground = {
  args: { background: false, scrollEdges: true },
  parameters: {
    docs: {
      description: { story: 'A miniature layout: switch `background` to show or hide its banded background. The marker itself is invisible.' },
      source: playgroundSource('PageChrome', { imports: "import PageChrome from '@gaudi/design-system/layout/PageChrome';" })
    }
  },
  render: (args) => (
    <div data-slot='layout-container' className='relative isolate overflow-hidden rounded-card border border-border bg-background'>
      <div aria-hidden='true' data-slot='layout-background' className='absolute inset-x-0 top-0 h-32 bg-linear-to-b from-accent-subtle to-transparent' />
      <main className='relative p-6'>
        <PageChrome {...args} />
        <h2 className='text-xl font-semibold text-text'>About</h2>
        <p className='mt-2 text-sm text-text-muted'>This page draws its own header, so it switches the site background off.</p>
      </main>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'About' })).toBeVisible();
    const layer = canvasElement.querySelector('[data-slot="layout-background"]');
    await expect(getComputedStyle(layer).display).toBe(args.background ? 'block' : 'none');
    const marker = canvasElement.querySelector('[data-slot="page-chrome"]');
    if (args.background && args.scrollEdges) await expect(marker).toBeNull();
    else await expect(marker).not.toBeVisible();
  }
};
