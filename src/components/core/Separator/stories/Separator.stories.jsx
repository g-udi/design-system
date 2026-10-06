import { PlaygroundDemo, stats, exampleDefaults } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';

import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';

import { Separator } from '../index.js';

const docs = getComponentDocs('Core/Separator');
// A project card: a semantic rule splits the header from the stats, whose decorative rules follow `orientation`.

const statRules = (canvasElement) => canvasElement.querySelectorAll('[data-slot="separator"][data-stat]');

const exampleSource = publicSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Core/Separator',
  id: 'core-separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { orientation: ['horizontal', 'vertical'] }),
  parameters: {
    docs: {
      source: { code: exampleSource, language: 'jsx' },
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { ...exampleDefaults },
  parameters: {
    docs: {
      description: { story: 'A project card. The rule under the header is semantic (`decorative={false}`); the rules between stats are decorative and follow `orientation`, stacking the stats as rows or laying them out as columns.' },
      source: { code: exampleSource, language: 'jsx' }
    }
  },
  render: PlaygroundDemo,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const rules = [...statRules(canvasElement)];
    await expect(rules).toHaveLength(stats.length - 1);
    for (const rule of rules) {
      await expect(rule).toHaveAttribute('data-orientation', args.orientation);
    }
    const semantic = canvas.getByRole('separator');
    await expect(semantic).toHaveAttribute('data-orientation', 'horizontal');
    await expect(semantic).not.toHaveAttribute('data-stat');
  }
};
