import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Faq from './Faq';

const docs = getComponentDocs('MDX/FAQ');
const questions = [
  { question: 'Why use FAQ blocks?', answer: 'They keep repeated article explanations structured and accessible.' },
  { question: 'Can several answers stay open?', answer: 'Yes. Each question toggles independently.' }
];

export default {
  title: 'MDX/FAQ',
  id: 'mdx-faq',
  component: Faq,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { questions: 'object', heading: 'text', headingLevel: [2, 3, 4, 5, 6] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { questions, heading: 'FAQ', headingLevel: 2 },
  parameters: { docs: { source: playgroundSource('Faq', { imports: "import { Faq } from '@gaudi/design-system/mdx';" }) } },
  render: (args) => <Faq {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const [first, second] = args.questions.map(({ question }) => canvas.getByRole('button', { name: question }));
    await expect(canvas.getByRole('heading', { name: args.heading, level: args.headingLevel })).toBeVisible();
    await userEvent.click(first);
    await userEvent.click(second);
    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText(args.questions[1].answer)).toBeVisible();
    await userEvent.click(first);
    await expect(canvas.queryByText(args.questions[0].answer)).not.toBeInTheDocument();
    await expect(second).toHaveAttribute('aria-expanded', 'true');
  }
};
