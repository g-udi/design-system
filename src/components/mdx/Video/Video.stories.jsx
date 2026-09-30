import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Video, { videoAnimationStyles } from './Video';

const docs = getComponentDocs('MDX/Video');

export default {
  title: 'MDX/Video',
  id: 'mdx-video',
  component: Video,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    videoSrc: 'text',
    thumbnailSrc: 'text',
    thumbnailAlt: 'text',
    title: 'text',
    animationStyle: Object.keys(videoAnimationStyles),
    autoplay: 'boolean'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: {
    videoSrc: 'https://www.youtube.com/embed/qh3NGpYRG3I',
    thumbnailSrc: '/static/images/og-card.jpg',
    thumbnailAlt: 'Knowledge graph article video preview',
    title: 'Knowledge graph walkthrough',
    animationStyle: 'from-center',
    autoplay: true
  },
  parameters: { docs: { source: playgroundSource('Video', { imports: "import { Video } from '@gaudi/design-system/mdx';" }) } },
  render: (args) => <Video {...args} />,
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Play video' });
    await expect(within(trigger).getByAltText(args.thumbnailAlt)).toBeVisible();
    await userEvent.click(trigger);

    const dialog = await screen.findByRole('dialog', { name: args.title });
    const panel = within(dialog).getByRole('heading', { name: args.title }).closest('[data-open]');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(panel).toHaveClass(...videoAnimationStyles[args.animationStyle].split(' '));
    await waitFor(() => expect(within(dialog).getAllByRole('button', { name: 'Close video dialog' }).at(-1)).toHaveFocus());
    await expect(document.body).toHaveStyle({ overflow: 'hidden' });
    await expect(within(dialog).getByTitle(args.title)).toHaveAttribute('src', `${args.videoSrc}${args.autoplay ? '?autoplay=1' : ''}`);

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  }
};
