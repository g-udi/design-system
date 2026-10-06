import { PlaygroundDemo, trigger, exampleDefaults } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';

import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';

import { SheetContent } from '../index.js';

const docs = getComponentDocs('Core/Sheet');

/**
 * The preview keeps the sheet open, non-modally, inside a stage that stands in for the page so the docs stay usable
 * while the controls change it; the stage draws the same backdrop the modal sheet would.
 */

const exampleSource = publicSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Core/Overlays & Menus/Sheet',
  id: 'core-sheet',
  component: SheetContent,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    side: ['right', 'left', 'top', 'bottom'],
    size: ['sm', 'md', 'lg', 'xl'],
    inset: 'boolean',
    overlay: ['dim', 'blur'],
    showCloseButton: 'boolean',
    title: 'text',
    description: 'text'
  }),
  parameters: {
    docs: {
      source: { code: exampleSource, language: 'jsx' },
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { ...exampleDefaults, onOpenChange: fn(), onSave: fn() },
  parameters: {
    docs: {
      description: { story: 'Workspace settings in a sheet over the drafts list, which stays dimmed behind it. `side` picks the edge, `size` the width of side sheets, `inset` floats the panel off the edge with rounded corners and `overlay` dims or blurs the page. In an app the sheet is modal: focus is trapped, Escape and the backdrop close it, and focus returns to the trigger.' },
      source: { code: exampleSource, language: 'jsx' }
    }
  },
  render: PlaygroundDemo,
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const sheet = await body.findByRole('dialog', { name: args.title });
    await expect(sheet).toHaveAttribute('data-side', args.side);
    await userEvent.click(within(sheet).getByRole('button', { name: 'Save changes' }));
    await expect(args.onSave).toHaveBeenCalledOnce();
    await waitFor(() => expect(sheet).not.toBeInTheDocument());
    await userEvent.click(within(canvasElement).getByRole('button', { name: trigger }));
    const reopened = await body.findByRole('dialog', { name: args.title });
    await waitFor(() => expect(reopened).toBeVisible());
  }
};
