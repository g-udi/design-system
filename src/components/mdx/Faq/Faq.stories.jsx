import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Faq from './Faq';

const docs = getComponentDocs('MDX/FAQ');
// The questions readers actually ask at the end of a migration post.
const questions = [
  { question: 'Do I need to rewrite my existing posts?', answer: 'No. Markdown links, footnotes, and citations keep working; only custom imports in layouts change.' },
  { question: 'Can I upgrade one site at a time?', answer: 'Yes. Each site pins its own package version, so you can migrate the blog before the portfolio.' },
  { question: 'Which imports change?', answer: 'Only layouts that mount the article runtime. They now import it from @gaudi/design-system/mdx/runtime.' },
  { question: 'Where do I report a rendering bug?', answer: 'Open an issue with the post slug and a screenshot; the MDX components are covered by visual tests.' }
];

export default {
  title: 'MDX/FAQ',
  id: 'mdx-faq',
  component: Faq,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { questions: 'object', heading: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { heading: 'Upgrading Gaudi', questions },
  parameters: {
    docs: {
      description: { story: 'The FAQ that closes a migration post. Each question opens on its own, so readers can compare several answers.' },
      source: playgroundSource('Faq', { imports: "import { Faq } from '@gaudi/design-system/mdx';" })
    }
  },
  render: (args) => <Faq {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const [first, second] = args.questions.map(({ question }) => canvas.getByRole('button', { name: question }));
    await expect(canvas.getByRole('heading', { name: args.heading, level: 2 })).toBeVisible();
    await userEvent.click(first);
    await userEvent.click(second);
    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText(args.questions[1].answer)).toBeVisible();
    await userEvent.click(first);
    await expect(canvas.queryByText(args.questions[0].answer)).not.toBeInTheDocument();
    await expect(second).toHaveAttribute('aria-expanded', 'true');
  }
};
