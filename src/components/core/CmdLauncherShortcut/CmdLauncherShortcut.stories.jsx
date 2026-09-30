import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import CmdLauncherShortcut from './CmdLauncherShortcut';

const docs = getComponentDocs('Core/CmdLauncherShortcut');

export default {
  title: 'Core/CmdLauncherShortcut',
  id: 'core-cmdlaunchershortcut',
  component: CmdLauncherShortcut,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  parameters: {
    docs: { source: playgroundSource('CmdLauncherShortcut', { imports: "import { CmdLauncherShortcut } from '@gaudi/design-system';" }) }
  },
  render: () => <CmdLauncherShortcut />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const keys = canvasElement.querySelectorAll('kbd');
    await expect(canvas.getByText('Press').parentElement).toHaveTextContent('Press⌘+Kto start');
    await expect(keys).toHaveLength(2);
    await expect(keys[0]).toHaveTextContent('⌘');
    await expect(keys[1]).toHaveTextContent('K');
  }
};
