import { hotkeysCoreFeature, selectionFeature, syncDataLoaderFeature } from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import { useId } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { Tree, TreeItem, TreeItemLabel } from './index.js';

const docs = getComponentDocs('Core/Tree');
// A source explorer: typed file icons, git status letters, indent guides, and a selected file.
const files = {
  root: { name: 'Project', children: ['src', 'docs', 'package'] },
  src: { name: 'src', children: ['components', 'hooks', 'index'] },
  components: { name: 'components', children: ['button', 'tree', 'styles'] },
  button: { name: 'Button.jsx', status: 'M' },
  tree: { name: 'Tree.jsx', status: 'A' },
  styles: { name: 'Tree.css', status: 'M' },
  hooks: { name: 'hooks', children: ['useTree'] },
  useTree: { name: 'useTree.js' },
  index: { name: 'index.js' },
  docs: { name: 'docs', children: ['readme', 'changelog'] },
  readme: { name: 'README.md' },
  changelog: { name: 'CHANGELOG.md', status: 'M' },
  package: { name: 'package.json', status: 'M' }
};
const fileIcons = {
  jsx: ['FileCodeIcon', 'text-info'],
  js: ['FileCodeIcon', 'text-warning'],
  css: ['PaletteIcon', 'text-ui-primary'],
  md: ['FileTextIcon', 'text-ui-muted-foreground'],
  json: ['FileJsonIcon', 'text-success']
};
const statuses = {
  M: { label: 'modified', className: 'text-warning' },
  A: { label: 'added', className: 'text-success' }
};
const byName = (canvas, name) => canvas.getByRole('treeitem', { name });

function ItemIcon({ item }) {
  if (item.isFolder()) {
    return <RegistryIcon lucide={item.isExpanded() ? 'FolderOpenIcon' : 'FolderIcon'} aria-hidden='true' className='size-4 text-ui-muted-foreground' />;
  }
  const [icon, tone] = fileIcons[item.getItemName().split('.').pop()];
  return <RegistryIcon lucide={icon} aria-hidden='true' className={`size-4 ${tone}`} />;
}

function TreeExample({ indent, toggleIconType }) {
  const prefix = useId();
  const tree = useTree({
    rootItemId: 'root',
    initialState: { expandedItems: ['src', 'components', 'hooks'], selectedItems: ['tree'] },
    indent,
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => Boolean(item.getItemData().children),
    dataLoader: { getItem: (id) => files[id], getChildren: (id) => files[id].children ?? [] },
    features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature]
  });
  return (
    <Tree
      tree={tree}
      indent={indent}
      toggleIconType={toggleIconType}
      className='relative before:absolute before:inset-0 before:-ms-1.25 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]'
    >
      {tree.getItems().map((item) => {
        const status = statuses[item.getItemData().status];
        // headless-tree names each item after its file, so the git status is exposed as the description.
        const statusId = status ? `${prefix}-${item.getId()}` : undefined;
        return (
          <TreeItem key={item.getId()} item={item} aria-describedby={statusId}>
            <TreeItemLabel className='before:bg-ui-background relative before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10'>
              <span className='ms-1 flex min-w-0 flex-1 items-center gap-2'>
                <ItemIcon item={item} />
                <span className='truncate'>{item.getItemName()}</span>
                {status && (
                  <span className={`ms-auto font-mono text-xs font-semibold ${status.className}`}>
                    <span aria-hidden='true'>{item.getItemData().status}</span>
                    <span id={statusId} className='sr-only'>{status.label}</span>
                  </span>
                )}
              </span>
            </TreeItemLabel>
          </TreeItem>
        );
      })}
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
      description: { story: 'A source explorer with typed file icons, git status letters, and a selected file. `indent` spaces each level and its guide lines; `toggleIconType` swaps the folder chevron for plus and minus.' },
      source: playgroundSource('Tree', {
        imports: "import { hotkeysCoreFeature, selectionFeature, syncDataLoaderFeature } from '@headless-tree/core';\nimport { useTree } from '@headless-tree/react';\nimport { Tree, TreeItem, TreeItemLabel } from '@gaudi/design-system';\nimport { RegistryIcon } from '@gaudi/design-system/icons';",
        before: 'const tree = useTree({ rootItemId, dataLoader, getItemName, isItemFolder, features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature] });\n\n',
        attributes: ['tree={tree}'],
        children: [
          '  {tree.getItems().map((item) => (',
          '    <TreeItem key={item.getId()} item={item}>',
          '      <TreeItemLabel>',
          "        <RegistryIcon lucide={item.isFolder() ? 'FolderIcon' : 'FileCodeIcon'} aria-hidden='true' />",
          '        {item.getItemName()}',
          '      </TreeItemLabel>',
          '    </TreeItem>',
          '  ))}'
        ].join('\n')
      })
    }
  },
  render: (args) => <TreeExample {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const item = (name) => byName(canvas, name);
    await expect(canvas.getByRole('tree')).toHaveStyle({ '--tree-indent': `${args.indent}px` });
    await expect(item('Tree.jsx')).toHaveAttribute('aria-selected', 'true');
    await expect(item('Button.jsx')).toHaveAccessibleDescription('modified');
    await userEvent.click(item('docs'));
    await expect(item('docs')).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(item('README.md'));
    await expect(item('README.md')).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowUp}{ArrowLeft}');
    await expect(item('docs')).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('treeitem', { name: 'README.md' })).not.toBeInTheDocument();
    // Leave the preview on the selected component file.
    await userEvent.click(item('Tree.jsx'));
    await expect(item('Tree.jsx')).toHaveAttribute('aria-selected', 'true');
    item('Tree.jsx').blur();
  }
};
