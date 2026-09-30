import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import MenuSearch from './MenuSearch';

const docs = getComponentDocs('Navigation/MenuSearch');

export default {
  title: 'Navigation/MenuSearch',
  id: 'navigation-menusearch',
  component: MenuSearch,
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
  args: { setOpen: fn() },
  parameters: {
    docs: { source: playgroundSource('MenuSearch', { imports: "import { MenuSearch } from '@gaudi/design-system';" }) }
  },
  render: (args) => <MenuSearch {...args} />,
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Open search' });
    await expect(button).toHaveTextContent('Search');
    await userEvent.click(button);
    await expect(args.setOpen).toHaveBeenCalledWith(true);
    button.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.setOpen).toHaveBeenCalledTimes(2);
  }
};
