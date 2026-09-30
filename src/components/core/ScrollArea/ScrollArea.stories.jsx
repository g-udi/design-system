import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ScrollArea } from './index.js';

const docs = getComponentDocs('Core/ScrollArea');
const releases = Array.from({ length: 24 }, (_, index) => `v2.${24 - index}.0`);

export default {
  title: 'Core/ScrollArea',
  id: 'core-scrollarea',
  component: ScrollArea,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { type: ['hover', 'auto', 'always', 'scroll'] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { type: 'hover', 'aria-label': 'Releases', className: 'mx-auto h-60 w-48 rounded-2xl border' },
  parameters: {
    docs: {
      source: playgroundSource('ScrollArea', {
        imports: `import { ScrollArea } from '@gaudi/design-system';\n\nconst releases = ${JSON.stringify(releases)};`,
        children: "  <ul className='divide-y px-4 text-sm'>\n    {releases.map((release) => <li key={release} className='py-2'>{release}</li>)}\n  </ul>"
      })
    }
  },
  render: (args) => (
    <ScrollArea {...args}>
      <ul className='divide-y px-4 text-sm'>
        {releases.map((release) => (
          <li key={release} className='py-2'>{release}</li>
        ))}
      </ul>
    </ScrollArea>
  ),
  play: async ({ canvasElement }) => {
    const viewport = within(canvasElement).getByRole('region', { name: 'Releases' });
    await expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
    await userEvent.tab();
    await expect(viewport).toHaveFocus();
    viewport.scrollTo({ top: viewport.scrollHeight });
    await waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0));
  }
};
