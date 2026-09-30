import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import FileTree from './FileTree';

const docs = getComponentDocs('MDX/FileTree');
const data = [
  {
    name: 'design-system',
    isFolder: true,
    childrenProp: [
      { name: 'src', isFolder: true, childrenProp: [{ name: 'Callout.jsx' }, { name: 'tokens.js' }] },
      { name: 'node_modules', isFolder: true, isOpen: false, childrenProp: [{ name: 'react' }] },
      { name: 'README.md' }
    ]
  },
  { name: 'package.json' }
];

export default {
  title: 'MDX/FileTree',
  id: 'mdx-filetree',
  component: FileTree,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { data: 'object' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { data },
  parameters: { docs: { source: playgroundSource('FileTree', { imports: "import { FileTree } from '@gaudi/design-system/mdx';" }) } },
  render: (args) => <FileTree {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const name of ['design-system', 'Callout.jsx', 'tokens.js', 'node_modules', 'package.json'])
      await expect(canvas.getByText(name)).toBeVisible();
    // `isOpen: false` collapses a folder and skips rendering its children.
    await expect(canvas.queryByText('react')).not.toBeInTheDocument();
  }
};
