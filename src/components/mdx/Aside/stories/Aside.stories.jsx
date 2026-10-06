import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import Aside from '../Aside';

const docs = getComponentDocs('MDX/Aside');
// The aside sits between two paragraphs of a real article so its contrast with the reading flow shows.
const before = 'Mermaid renders every flowchart on the client, so the first paint shows a placeholder while the library loads.';
const after = 'Once the SVG is ready it replaces the placeholder in place, and the surrounding text never shifts.';

export default {
  title: 'MDX/Aside',
  id: 'mdx-aside',
  component: Aside,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { children: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { children: 'Why not render on the server? Mermaid measures text with the DOM, which Node does not have, so a server render would need a headless browser in the build.' },
  parameters: {
    docs: {
      description: { story: 'An aside between two article paragraphs: the supporting note reads as quieter, muted context next to the main argument.' },
      source: playgroundSource('Aside', {
        imports: "import { Aside } from '@gaudi/design-system/mdx';",
        before: `<div className='text-base leading-7 text-text'>\n<p>${before}</p>\n\n`,
        after: `\n\n<p>${after}</p>\n</div>`
      })
    }
  },
  render: (args) => (
    <div className='text-base leading-7 text-text'>
      <p>{before}</p>
      <Aside {...args} />
      <p>{after}</p>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const aside = canvas.getByText(args.children);
    await expect(aside.tagName).toBe('ASIDE');
    await expect(aside).toHaveClass('bg-surface-muted', 'text-text-muted');
    // The aside stays in document order, between the paragraphs it supports.
    await expect(aside.previousElementSibling).toHaveTextContent(before);
    await expect(aside.nextElementSibling).toHaveTextContent(after);
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { page } = await import('vitest/browser');
      const original = { width: innerWidth, height: innerHeight };
      try {
        for (const width of [320, 1535, 1536, 1920]) {
          await page.viewport(width, original.height);
          const bounds = aside.getBoundingClientRect();
          await expect(bounds.left).toBeGreaterThanOrEqual(0);
          await expect(bounds.right).toBeLessThanOrEqual(width);
          await expect(getComputedStyle(aside).position).toBe('static');
        }
      } finally {
        await page.viewport(original.width, original.height);
      }
    }
  }
};
