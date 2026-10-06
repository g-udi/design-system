import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import FileTree from '../FileTree';

const docs = getComponentDocs('MDX/FileTree');
// A real blog repository: nested folders, a collapsed dependency folder, and files whose icons differ by type.
const data = [
  {
    name: 'assaf.website',
    isFolder: true,
    childrenProp: [
      {
        name: 'app',
        isFolder: true,
        childrenProp: [
          { name: 'blog', isFolder: true, childrenProp: [{ name: '[slug]', isFolder: true, childrenProp: [{ name: 'page.tsx' }] }] }
        ]
      },
      { name: 'components', isFolder: true, isOpen: false, childrenProp: [{ name: 'MDXComponents.jsx' }] },
      {
        name: 'content',
        isFolder: true,
        childrenProp: [
          { name: 'posts', isFolder: true, childrenProp: [{ name: 'knowledge-graphs.mdx' }] }
        ]
      },
      { name: 'node_modules', isFolder: true, isOpen: false, childrenProp: [{ name: 'react' }] },
      { name: 'Dockerfile' },
      { name: 'package.json' }
    ]
  }
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
  parameters: {
    visualAudit: { wide: 'The tree panel spans the article column.' },
    docs: {
      description: { story: 'A blog repository four levels deep. Folders open by default; `isOpen: false` collapses `components` and `node_modules`, and each file type gets its own icon.' },
      source: playgroundSource('FileTree', { imports: "import { FileTree } from '@gaudi/design-system/mdx';" })
    }
  },
  render: (args) => <FileTree {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const name of ['assaf.website', '[slug]', 'knowledge-graphs.mdx', 'node_modules', 'Dockerfile', 'package.json'])
      await expect(canvas.getByText(name)).toBeVisible();
    // Nesting indents each level by 20px from the root row.
    await expect(canvas.getByText('[slug]').parentElement).toHaveStyle({ paddingInlineStart: '68px' });
    // `isOpen: false` collapses a folder and skips rendering its children.
    for (const hidden of ['react', 'MDXComponents.jsx']) await expect(canvas.queryByText(hidden)).not.toBeInTheDocument();
  }
};
