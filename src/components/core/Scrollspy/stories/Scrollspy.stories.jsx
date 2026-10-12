import { PlaygroundDemo, sections, exampleDefaults } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';

import { expect, fn, spyOn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';

import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';

import { Scrollspy } from '../index.js';
import { checkScrollspyUpdates } from '../../../../../tests/components/core/Scrollspy/checkScrollspyUpdates.jsx';

const docs = getComponentDocs('Core/Scrollspy');
// A guide page: icon links on the left, and a scroll area whose sticky header is exactly `offset` pixels tall.

const titles = sections.map((section) => section.title);

const exampleSource = publicSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Core/Navigation/Scrollspy',
  id: 'core-scrollspy',
  component: Scrollspy,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { offset: 'number', smooth: 'boolean' }),
  parameters: {
    docs: {
      source: { code: exampleSource, language: 'jsx' },
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { ...exampleDefaults, onUpdate: fn() },
  parameters: {
    // Smoothing only shows while a clicked section scrolls into view, not in the resting preview.
    controlAudit: { interaction: ['smooth'] },
    docs: {
      description: { story: 'A guide page. `offset` is the height of the sticky header, so a clicked section lands just below it and the active link switches at that line. `smooth` animates the jump.' },
      source: { code: exampleSource, language: 'jsx' }
    }
  },
  render: PlaygroundDemo,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const anchor = (name) => canvas.getByRole('button', { name });
    const viewport = canvas.getByRole('region', { name: 'Guide' });
    await waitFor(() => expect(anchor(titles[0])).toHaveAttribute('data-active', 'true'));
    const url = window.location.href;
    const scrollTo = spyOn(viewport, 'scrollTo');
    await userEvent.click(anchor('Usage'));
    // One click runs one handler, and `history` is opt-in, so the page URL is untouched.
    await expect(scrollTo).toHaveBeenCalledTimes(1);
    scrollTo.mockRestore();
    await expect(window.location.href).toBe(url);
    // Settle both anchors together: the smooth scroll can pass through the first section.
    await waitFor(() => {
      expect(anchor('Usage')).toHaveAttribute('data-active', 'true');
      expect(anchor(titles[0])).not.toHaveAttribute('data-active');
    });
    // The clicked section lands `offset` pixels below the top, just under the sticky header.
    const usage = document.getElementById(anchor('Usage').dataset.scrollspyAnchor);
    const target = Math.min(usage.offsetTop - args.offset, viewport.scrollHeight - viewport.clientHeight);
    await waitFor(() => expect(Math.abs(viewport.scrollTop - target)).toBeLessThanOrEqual(1));
    await waitFor(() => expect(args.onUpdate).toHaveBeenLastCalledWith(anchor('Usage').dataset.scrollspyAnchor));
    anchor('Usage').blur();
    await checkScrollspyUpdates(canvasElement);
  }
};
