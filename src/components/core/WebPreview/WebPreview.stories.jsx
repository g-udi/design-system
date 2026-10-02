import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { generatedLogs, generatedPage, linkPreviewExamples } from '../../../../.storybook/fixtures/site/link-previews';
import { AgentMark } from '../../chat/AgentMark/parts/agent-mark.jsx';
import { Bubble, BubbleContent } from '../../chat/Bubble/parts/bubble.jsx';
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageHeader } from '../../chat/Message/parts/message.jsx';
import Embed from '../Embed';
import WebPreview from './index.js';

const docs = getComponentDocs('Core/Media & Previews/WebPreview');
const home = 'https://preview.gaudi.dev/';
const imports = "import { WebPreview } from '@gaudi/design-system';";
const frame = (canvasElement) => canvasElement.querySelector('iframe');
const generatedHtml = `<header>
  <strong>Reading Digest</strong>
  <nav><a href="/issues">Issues</a><a href="/pricing">Pricing</a></nav>
</header>
<main>
  <h1>One calm email of the week’s best writing.</h1>
  <button>Subscribe free</button>
</main>`;

export default {
  title: 'Core/Media & Previews/WebPreview',
  id: 'core-webpreview',
  component: WebPreview,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { defaultDevice: ['desktop', 'tablet', 'phone'], defaultConsoleOpen: 'boolean', embeddable: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame wide><Story /></ExampleFrame>]
};

export const Playground = {
  args: { defaultDevice: 'desktop', defaultConsoleOpen: true, embeddable: true },
  parameters: {
    docs: {
      description: { story: 'A generated two-page site in the framed browser. Type `preview.gaudi.dev/pricing` in the address bar, step back and forward, switch the width, and read the console. Turn `embeddable` off to see the link preview card a site that refuses framing gets instead.' },
      source: playgroundSource('WebPreview', { imports, attributes: [`defaultUrl='${home}'`, 'srcDoc={(url) => pages[url]}', 'logs={logs}'] })
    },
    visualAudit: { wide: 'A browser frame fills the example width.' }
  },
  render: (args) => (
    <WebPreview
      key={`${args.defaultDevice}-${args.defaultConsoleOpen}-${args.embeddable}`}
      defaultUrl={home}
      srcDoc={args.embeddable ? generatedPage : undefined}
      previewData={linkPreviewExamples.website.previewData}
      logs={generatedLogs}
      title='Reading Digest landing page'
      {...args}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const address = canvas.getByRole('textbox', { name: 'Address' });
    if (!args.embeddable) {
      await expect(frame(canvasElement)).toBeNull();
      return;
    }
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
  render: () => (
    <div className='flex flex-col gap-6'>
      <Message align='end' className='gap-3'>
        <MessageContent className='items-end'>
          <Bubble align='end'><BubbleContent>Build a landing page for my Sunday reading digest, with a pricing page.</BubbleContent></Bubble>
        </MessageContent>
      </Message>
      <Message className='gap-3'>
        <MessageAvatar><AgentMark name='Gaudi' size='sm' decorative /></MessageAvatar>
        <MessageContent className='gap-3'>
          <MessageHeader className='gap-2 text-xs text-text-muted'><span className='font-semibold text-text'>Gaudi</span><time dateTime='2026-10-02T09:14'>09:14</time></MessageHeader>
          <Bubble variant='ghost'><BubbleContent>Here’s the digest site. The home page leads with the subscribe button; the pricing page lists the free and supporter plans. One request fails because the subscriber API doesn’t exist yet.</BubbleContent></Bubble>
          <WebPreview defaultUrl={home} srcDoc={generatedPage} logs={generatedLogs} title='Generated Reading Digest site' className='h-[28rem]' />
          <Embed code={generatedHtml} language='html' filename='index.html' codeProps={{ maxLines: 6 }} />
          <Embed url={linkPreviewExamples.docs.url} previewData={linkPreviewExamples.docs.previewData} variant='compact' />
          <MessageFooter className='text-xs text-text-muted'>Generated in 14s</MessageFooter>
        </MessageContent>
      </Message>
    </div>
  ),
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
  render: () => (
    <WebPreview
      defaultUrl={linkPreviewExamples.repository.url}
      embeddable={false}
      previewData={linkPreviewExamples.repository.previewData}
      devices={false}
      className='h-auto'
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(frame(canvasElement)).toBeNull();
    await expect(canvas.getByText('This page can’t be shown here')).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'ahmadassaf/design-system' })).toHaveAttribute('href', linkPreviewExamples.repository.url);
    await expect(canvas.getByRole('link', { name: 'Open in new tab' })).toHaveAttribute('target', '_blank');
  }
};
