import { expect } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import MenuLogo from './MenuLogo';

const docs = getComponentDocs('Navigation/MenuLogo');

export default {
  title: 'Navigation/MenuLogo',
  id: 'navigation-menulogo',
  component: MenuLogo,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { className: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { className: 'text-blue-600 dark:text-blue-400' },
  parameters: {
    docs: { source: playgroundSource('MenuLogo', { imports: "import { MenuLogo } from '@gaudi/design-system';" }) }
  },
  render: (args) => <MenuLogo {...args} />,
  play: async ({ args, canvasElement }) => {
    const svg = canvasElement.querySelector('svg');
    await expect(svg).toHaveAttribute('aria-hidden', 'true');
    await expect(svg).toHaveAttribute('focusable', 'false');
    await expect(svg.querySelector('g')).toHaveAttribute('fill', 'currentColor');
    for (const name of args.className.split(' ')) await expect(svg).toHaveClass(name);
  }
};
