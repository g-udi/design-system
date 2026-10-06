import WebPreview from '@gaudi/design-system/core/WebPreview';
import { generatedPage, linkPreviewExamples, generatedLogs } from '../../../../../docs/fixtures/site/link-previews';
import { ChatMessage, ChatMessageContent, ChatMessageAvatar, ChatMessageHeader, ChatMessageFooter } from '@gaudi/design-system/chat/ChatMessage';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import { ChatAgentMark } from '@gaudi/design-system/chat/ChatAgentMark';
import Embed from '@gaudi/design-system/core/Embed';
import { useState } from 'react';
import Switch from '@gaudi/design-system/core/Switch';

const home = 'https://preview.gaudi.dev/';

const generatedHtml = `<header>
  <strong>Reading Digest</strong>
  <nav><a href="/issues">Issues</a><a href="/pricing">Pricing</a></nav>
</header>
<main>
  <h1>One calm email of the week’s best writing.</h1>
  <button>Subscribe free</button>
</main>`;

export const exampleDefaults = { defaultDevice: 'desktop', defaultConsoleOpen: true, embeddable: true };

export function PlaygroundDemo(props) {
  const args = { ...exampleDefaults, ...props };
  return <WebPreview
      key={`${args.defaultDevice}-${args.defaultConsoleOpen}-${args.embeddable}`}
      defaultUrl={home}
      srcDoc={args.embeddable ? generatedPage : undefined}
      previewData={linkPreviewExamples.website.previewData}
      logs={generatedLogs}
      title='Reading Digest landing page'
      {...args}
    />;
}

export const AiMessageWithWebPreviewDemo = () => (
    <div className='flex flex-col gap-6'>
      <ChatMessage align='end' className='gap-3'>
        <ChatMessageContent className='items-end'>
          <ChatBubble align='end'><ChatBubbleContent>Build a landing page for my Sunday reading digest, with a pricing page.</ChatBubbleContent></ChatBubble>
        </ChatMessageContent>
      </ChatMessage>
      <ChatMessage className='gap-3'>
        <ChatMessageAvatar><ChatAgentMark icon='Gaudi' tone='neutral' name='Gaudi' size='sm' decorative /></ChatMessageAvatar>
        <ChatMessageContent className='gap-3'>
          <ChatMessageHeader className='gap-2 text-xs text-text-muted'><span className='font-semibold text-text'>Gaudi</span><time dateTime='2026-10-02T09:14'>09:14</time></ChatMessageHeader>
          <ChatBubble variant='ghost'><ChatBubbleContent>Here’s the digest site. The home page leads with the subscribe button; the pricing page lists the free and supporter plans. One request fails because the subscriber API doesn’t exist yet.</ChatBubbleContent></ChatBubble>
          <WebPreview defaultUrl={home} srcDoc={generatedPage} logs={generatedLogs} title='Generated Reading Digest site' className='h-[28rem]' />
          <Embed code={generatedHtml} language='html' filename='index.html' codeProps={{ maxLines: 6 }} />
          <Embed url={linkPreviewExamples.docs.url} previewData={linkPreviewExamples.docs.previewData} variant='compact' />
          <ChatMessageFooter className='text-xs text-text-muted'>Generated in 14s</ChatMessageFooter>
        </ChatMessageContent>
      </ChatMessage>
    </div>
  );

export const BlockedEmbedDemo = () => (
    <WebPreview
      defaultUrl={linkPreviewExamples.repository.url}
      embeddable={false}
      previewData={linkPreviewExamples.repository.previewData}
      devices={false}
      className='h-auto'
    />
  );

export const ControlledNavigationDemo = function Render(args) {
    const [url, setUrl] = useState(home);
    const [allowNavigation, setAllowNavigation] = useState(false);
    return (
      <div className='grid gap-3'>
        <Switch label='Allow navigation' checked={allowNavigation} onCheckedChange={setAllowNavigation} />
        <WebPreview url={url} srcDoc={generatedPage} onUrlChange={(next) => {
          args.onUrlChange?.(next);
          if (allowNavigation) setUrl(next);
        }} />
      </div>
    );
  };

export { home };
