import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { previewSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import { generatedPage, linkPreviewExamples as links } from '../../../../docs/fixtures/site/link-previews';
import { sky } from '../../../../docs/fixtures/site/artwork';
import Embed from '../index.js';

const docs = getComponentDocs('Core/Media & Previews/Embed');
const snippet = "import { Embed } from '@gaudi/design-system';\n\n<Embed url='https://github.com/g-udi/design-system' />";

// One piece of content per type, as a message renderer would receive them.
const contents = {
  link: { url: links.repository.url, previewData: links.repository.previewData },
  code: { code: snippet, language: 'jsx', filename: 'reply.jsx' },
  image: { src: `/${sky}`, alt: 'Abstract sky artwork', title: 'sky.svg' },
  video: { url: links.video.url, previewData: links.video.previewData },
  web: { url: 'https://preview.gaudi.dev/', html: generatedPage('https://preview.gaudi.dev/'), title: 'Generated landing page', webPreviewProps: { className: 'h-80', devices: false } }
};

export default {
  title: 'Core/Media & Previews/Embed',
  id: 'core-embed',
  component: Embed,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { type: ['link', 'code', 'image', 'video', 'web'], variant: ['card', 'compact', 'inline'] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { type: 'link', variant: 'card' },
  parameters: {
    docs: {
      description: { story: 'One switch, five owners. Pick a type to see who renders it: links and media go to LinkPreview (an image or thumbnail with its destination), code to CodeBlock, a generated page to WebPreview. `variant` picks the LinkPreview presentation for links and media.' },
      source: { type: 'code', language: 'jsx', transform: (_source, { args }) => previewSource('Embed', { ...contents[args.type], ...args }, { imports: "import { Embed } from '@gaudi/design-system';" }) }
    }
  },
  render: ({ type, ...args }) => <Embed key={type} {...contents[type]} {...args} type={type} />,
  play: async ({ args, canvasElement }) => {
    await expect(canvasElement.querySelector('[data-slot="embed"]')).toHaveAttribute('data-type', args.type);
    if (args.type === 'code') await expect(within(canvasElement).getByText('reply.jsx')).toBeVisible();
    if (args.type === 'image') await expect(within(canvasElement).getByRole('img', { name: 'Abstract sky artwork' })).toBeInTheDocument();
  }
};
