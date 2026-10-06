import { PlaygroundDemo, exampleDefaults } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';

import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';

import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';

import { Tree } from '../index.js';

const docs = getComponentDocs('Core/Tree');
// A source explorer: typed file icons, git status letters, indent guides, and a selected file.

const byName = (canvas, name) => canvas.getByRole('treeitem', { name });

const exampleSource = publicSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Core/Navigation/Tree',
  id: 'core-tree',
  component: Tree,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { indent: 'number', toggleIconType: ['chevron', 'plus-minus'] }),
  parameters: {
    docs: {
      source: { code: exampleSource, language: 'jsx' },
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame className='max-w-xs'><Story /></ExampleFrame>]
};

export const Playground = {
  args: { ...exampleDefaults },
  parameters: {
    docs: {
      description: { story: 'A source explorer with typed file icons, git status letters, and a selected file. `indent` spaces each level and its guide lines; `toggleIconType` swaps the folder chevron for plus and minus.' },
      source: { code: exampleSource, language: 'jsx' }
    }
  },
  render: PlaygroundDemo,
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
