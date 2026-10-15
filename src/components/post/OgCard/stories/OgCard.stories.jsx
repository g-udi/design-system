import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { GaudiLogo } from '../../../../icons/brands/gaudi.jsx';
import OgCard from '..';

const docs = getComponentDocs('Blocks/Blog/OgCard');

export default {
  title: 'Blocks/Blog/OgCard',
  id: 'post-og-card',
  component: OgCard,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { title: 'text', subtitle: 'text', category: 'text', siteName: 'text', theme: ['light', 'dark'] }),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};

// The card is a fixed 1200 × 630 image; the preview scales it to the frame like a link unfurl.
export const Playground = {
  args: { title: 'Contract tests should protect behaviour consumers can observe', subtitle: 'What a design system owes the apps that depend on it.', category: 'Engineering', siteName: 'gaudi.dev', theme: 'light' },
  parameters: {
    docs: {
      description: { story: 'Rendered as ordinary markup and scaled to fit; next/og draws the same element tree into a PNG.' },
      source: playgroundSource('OgCard', {
        imports: "import { ImageResponse } from 'next/og';\nimport { OgCard, ogImageSize } from '@gaudi/design-system/post/OgCard';\nimport { GaudiLogo } from '@gaudi/design-system/icons/brands/gaudi';\n\n// new ImageResponse(<OgCard … />, ogImageSize)",
        attributes: ['logo={ <GaudiLogo width={ 120 } height={ 120 } /> }']
      })
    }
  },
  render: (args) => (
    <div className='w-fit max-w-full overflow-hidden rounded-card border border-border'>
      <div className='[zoom:0.25] sm:[zoom:0.5]'>
        <OgCard {...args} logo={ <GaudiLogo width={ 120 } height={ 120 } /> } />
      </div>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(args.title)).toBeVisible();
    await expect(canvas.getByText(args.category)).toBeVisible();
    const card = canvasElement.querySelector('[data-slot="og-card"]');
    await expect(card.style.width).toBe('1200px');
    await expect(card.style.height).toBe('630px');
  }
};
