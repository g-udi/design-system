import { hotkeysCoreFeature, selectionFeature, syncDataLoaderFeature } from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { Tree, TreeItem, TreeItemLabel } from './index.js';

const docs = getComponentDocs('Core/Tree');
const files = {
  root: { name: 'Project', children: ['src', 'docs', 'package'] },
  src: { name: 'src', children: ['components', 'index'] },
  components: { name: 'components', children: ['button', 'tree'] },
  button: { name: 'Button.jsx' },
  tree: { name: 'Tree.jsx' },
  index: { name: 'index.js' },
  docs: { name: 'docs', children: ['readme', 'changelog'] },
  readme: { name: 'README.md' },
  changelog: { name: 'CHANGELOG.md' },
  package: { name: 'package.json' }
};

function TreeExample({ indent, toggleIconType }) {
  const tree = useTree({
    rootItemId: 'root',
    initialState: { expandedItems: ['src'] },
    indent,
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => Boolean(item.getItemData().children),
    dataLoader: { getItem: (id) => files[id], getChildren: (id) => files[id].children ?? [] },
    features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature]
  });
  return (
    <Tree tree={tree} indent={indent} toggleIconType={toggleIconType}>
      {tree.getItems().map((item) => (
        <TreeItem key={item.getId()} item={item}>
          <TreeItemLabel />
        </TreeItem>
      ))}
    </Tree>
  );
}

export default {
  title: 'Core/Tree',
  id: 'core-tree',
  component: Tree,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { indent: 'number', toggleIconType: ['chevron', 'plus-minus'] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame className='max-w-xs'><Story /></ExampleFrame>]
};

export const Playground = {
  args: { indent: 20, toggleIconType: 'chevron' },
  parameters: {
    docs: {
      source: playgroundSource('Tree', {
        imports: "import { hotkeysCoreFeature, selectionFeature, syncDataLoaderFeature } from '@headless-tree/core';\nimport { useTree } from '@headless-tree/react';\nimport { Tree, TreeItem, TreeItemLabel } from '@gaudi/design-system';",
        before: 'const tree = useTree({ rootItemId, dataLoader, getItemName, isItemFolder, features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature] });\n\n',
        attributes: ['tree={tree}'],
        children: '  {tree.getItems().map((item) => (\n    <TreeItem key={item.getId()} item={item}>\n      <TreeItemLabel />\n    </TreeItem>\n  ))}'
      })
    }
  },
  render: (args) => <TreeExample {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = (name) => canvas.getByRole('treeitem', { name });
    await expect(canvas.getByRole('tree')).toBeInTheDocument();
    await userEvent.click(item('docs'));
    await expect(item('docs')).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(item('README.md'));
    await expect(item('README.md')).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowUp}{ArrowLeft}');
    await expect(item('docs')).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('treeitem', { name: 'README.md' })).not.toBeInTheDocument();
  }
};
