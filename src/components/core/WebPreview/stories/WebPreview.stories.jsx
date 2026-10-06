import { PlaygroundDemo, AiMessageWithWebPreviewDemo, BlockedEmbedDemo, ControlledNavigationDemo, home, exampleDefaults } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import previewCode from '../../../../docs/fixtures/site/link-previews.js?raw';
import artworkCode from '../../../../docs/fixtures/site/artwork.js?raw';
import { webPreviewExampleSource } from './exampleSource.js';

import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';

import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import { linkPreviewExamples } from '../../../../docs/fixtures/site/link-previews';

import WebPreview from '../index.js';

const docs = getComponentDocs('Core/Media & Previews/WebPreview');

const frame = (canvasElement) => canvasElement.querySelector('iframe');

const exampleSource = webPreviewExampleSource(exampleCode, previewCode, artworkCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Core/Media & Previews/WebPreview',
  id: 'core-webpreview',
  component: WebPreview,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { defaultDevice: ['desktop', 'tablet', 'phone'], defaultConsoleOpen: 'boolean', embeddable: 'boolean' }),
  parameters: {
    docs: {
      source: { code: exampleSource, language: 'jsx' },
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame wide><Story /></ExampleFrame>]
};

export const Playground = {
  args: { ...exampleDefaults },
  parameters: {
    docs: {
      description: { story: 'A generated two-page site in the framed browser. Type `preview.gaudi.dev/pricing` in the address bar, step back and forward, switch the width, and read the console. Turn `embeddable` off to see the link preview card a site that refuses framing gets instead.' },
      source: { code: exampleSource, language: 'jsx' }
    },
    visualAudit: { wide: 'A browser frame fills the example width.' }
  },
  render: PlaygroundDemo,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const address = canvas.getByRole('textbox', { name: 'Address' });
    if (!args.embeddable) {
      await expect(frame(canvasElement)).toBeNull();
      return;
    }
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="web-preview-loading"]')).toBeNull());
    // Submitting the current URL must not leave a loader waiting for a nonexistent frame load.
    address.focus();
    await userEvent.keyboard('{Enter}');
    await expect(canvasElement.querySelector('[data-slot="web-preview-loading"]')).toBeNull();
    // Typing a bare host visits it over https and enables Back.
    await userEvent.clear(address);
    await userEvent.type(address, 'preview.gaudi.dev/pricing{Enter}');
    await waitFor(() => expect(frame(canvasElement).getAttribute('srcdoc')).toContain('<h1>Pricing</h1>'));
    await expect(address).toHaveValue('https://preview.gaudi.dev/pricing');
    const back = canvas.getByRole('button', { name: 'Go back' });
    await expect(back).toBeEnabled();
    await userEvent.click(back);
    await waitFor(() => expect(address).toHaveValue('https://preview.gaudi.dev'));
    await expect(canvas.getByRole('button', { name: 'Go forward' })).toBeEnabled();
    // Unsafe schemes are refused with a message instead of being visited.
    await userEvent.clear(address);
    await userEvent.type(address, 'javascript:alert(1){Enter}');
    await expect(canvas.getByRole('alert')).toHaveTextContent('Enter a web address');
    await userEvent.keyboard('{Escape}');
    await expect(address).toHaveValue('https://preview.gaudi.dev');
  }
};

export const AiMessageWithWebPreview = {
  name: 'AI message with web preview',
  parameters: {
    docs: { description: { story: 'An assistant reply that built a page: the chat Message parts hold the summary, the generated page in a WebPreview with device widths and its console, the source as a code Embed, and the reference it used as a link Embed.' } },
    visualAudit: { wide: 'A chat thread fills the example width.' }
  },
  render: AiMessageWithWebPreviewDemo,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Device toggle: the frame narrows to a phone and widens back.
    await userEvent.click(canvas.getByRole('radio', { name: 'Phone (390px)' }));
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="web-preview-frame"]').style.width).toBe('390px'));
    await expect(canvas.getByRole('radio', { name: 'Phone (390px)' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(canvas.getByRole('radio', { name: 'Desktop' }));
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="web-preview-frame"]').style.width).toBe(''));
    // The console names its errors and opens to the log.
    const toggle = canvas.getByRole('button', { name: /Console/ });
    await expect(toggle).toHaveTextContent('1 error');
    await userEvent.click(toggle);
    await expect(await canvas.findByRole('log', { name: 'Console output' })).toHaveTextContent('Failed to load /api/subscribers');
    // The page is named for assistive technology and sandboxed away from the host.
    await expect(frame(canvasElement)).toHaveAttribute('title', 'Generated Reading Digest site');
    await expect(frame(canvasElement).getAttribute('sandbox')).not.toContain('allow-same-origin');
  }
};

export const BlockedEmbed = {
  name: 'Blocked embed',
  parameters: { docs: { description: { story: 'Sites that send X-Frame-Options or a frame-ancestors policy can’t be framed, and the browser won’t say so. The app knows (its preview endpoint can read the headers) and passes `embeddable={false}`; the preview shows the link preview card instead, and Open in new tab still works.' } } },
  render: BlockedEmbedDemo,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(frame(canvasElement)).toBeNull();
    await expect(canvas.getByText('This page can’t be shown here')).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'ahmadassaf/design-system' })).toHaveAttribute('href', linkPreviewExamples.repository.url);
    await expect(canvas.getByRole('link', { name: 'Open in new tab' })).toHaveAttribute('target', '_blank');
  }
};

export const ControlledNavigation = {
  name: 'Controlled navigation',
  args: { onUrlChange: fn() },
  parameters: {
    docs: {
      description: { story: 'A host can accept or refuse a requested address. History and loading follow the accepted URL, including Back and Forward requests.' },
      source: { code: exampleSource, language: 'jsx' }
    }
  },
  render: ControlledNavigationDemo,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const address = canvas.getByRole('textbox', { name: 'Address' });
    const allow = canvas.getByRole('switch', { name: 'Allow navigation' });
    const back = canvas.getByRole('button', { name: 'Go back' });
    const forward = canvas.getByRole('button', { name: 'Go forward' });
    const idle = () => waitFor(() => expect(canvasElement.querySelector('[data-slot="web-preview-loading"]')).toBeNull());
    await idle();
    await userEvent.clear(address);
    await userEvent.type(address, 'preview.gaudi.dev/pricing{Enter}');
    await expect(args.onUrlChange).toHaveBeenLastCalledWith('https://preview.gaudi.dev/pricing');
    await expect(back).toBeDisabled();
    await idle();
    await userEvent.click(allow);
    address.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(back).toBeEnabled());
    await idle();
    await userEvent.click(allow);
    await userEvent.click(back);
    await expect(args.onUrlChange).toHaveBeenLastCalledWith(home);
    await expect(address).toHaveValue('https://preview.gaudi.dev/pricing');
    await expect(forward).toBeDisabled();
    await idle();
    await userEvent.click(allow);
    await userEvent.click(back);
    await waitFor(() => expect(address).toHaveValue('https://preview.gaudi.dev'));
    await expect(forward).toBeEnabled();
    await idle();
  }
};
