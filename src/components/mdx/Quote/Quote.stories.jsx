import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Quote from './Quote';

const docs = getComponentDocs('MDX/Quote');
const before = 'We rebuilt the blog three times before the components settled. The version that stuck treated every article element as part of one system.';
const after = 'That principle shaped the rest of the migration: fewer one-off styles, and components that read well in any post.';

export default {
  title: 'MDX/Quote',
  id: 'mdx-quote',
  component: Quote,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { text: 'text', author: 'text', title: 'text', image: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: {
    text: 'Good component systems make product code calmer. You stop deciding how things look and start deciding what they mean.',
    author: 'Maya Chen',
    title: 'Design systems lead',
    image: '/avatars/women/44.jpg'
  },
  parameters: {
    docs: {
      description: { story: 'A pull quote between two article paragraphs, with the quotation, author, role, and portrait all driven by the controls.' },
      source: playgroundSource('Quote', {
        imports: "import { Quote } from '@gaudi/design-system/mdx';",
        before: `<p>${before}</p>\n\n`,
        after: `\n\n<p>${after}</p>`
      })
    }
  },
  render: (args) => (
    <div className='space-y-8 text-base leading-7 text-text'>
      <p>{before}</p>
      <Quote {...args} />
      <p>{after}</p>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement.querySelector('figure blockquote')).toContainElement(canvas.getByText(args.text));
    await expect(canvas.getByText(args.author).tagName).toBe('CITE');
    await expect(canvas.getByText(args.title)).toBeVisible();
    if (args.image) await expect(canvas.getByRole('img', { name: `${args.author} portrait` })).toBeVisible();
  }
};
