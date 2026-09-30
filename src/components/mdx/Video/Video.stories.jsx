import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Video, { videoAnimationStyles } from './Video';
import { aurora } from '../../../../.storybook/fixtures/site/artwork';

const docs = getComponentDocs('MDX/Video');
const videoSrc = 'https://www.youtube.com/embed/qh3NGpYRG3I';
const thumbnailAlt = 'Video preview';
// The second card has no thumbnail, so it shows the labelled fallback, and starts partway into the recording.
const followUp = { videoSrc: 'https://www.youtube.com/embed/qh3NGpYRG3I?start=90', title: 'Chapter 2', thumbnailAlt: 'Chapter 2 preview', meta: 'Starts at 1:30' };

export default {
  title: 'MDX/Video',
  id: 'mdx-video',
  component: Video,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    title: 'text',
    thumbnailSrc: 'text',
    animationStyle: Object.keys(videoAnimationStyles)
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

function VideoCard({ meta, ...props }) {
  return (
    <figure className='min-w-0'>
      <Video {...props} />
      <figcaption className='mt-2 text-sm leading-5'>
        <span className='block font-medium text-gray-900 dark:text-white'>{props.title}</span>
        <span className='text-gray-600 dark:text-gray-400'>{meta}</span>
      </figcaption>
    </figure>
  );
}

export const Playground = {
  args: {
    title: 'Video walkthrough',
    thumbnailSrc: aurora,
    animationStyle: 'from-center'
  },
  parameters: {
    docs: {
      description: { story: 'A pair of article videos: a walkthrough with a photo thumbnail and a second chapter without one, which shows the labelled fallback. Select either to play it in a modal; the first follows the controls.' },
      source: playgroundSource('Video', {
        imports: "import { Video } from '@gaudi/design-system/mdx';",
        attributes: [`videoSrc='${videoSrc}'`, `thumbnailAlt='${thumbnailAlt}'`]
      })
    }
  },
  render: (args) => (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
      <VideoCard videoSrc={videoSrc} thumbnailAlt={thumbnailAlt} meta='Walkthrough · 3 min' {...args} />
      <VideoCard {...followUp} ariaLabel={`Play ${followUp.title}`} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Play video' });
    if (args.thumbnailSrc) await expect(within(trigger).getByAltText(thumbnailAlt)).toHaveAttribute('src', args.thumbnailSrc);
    await expect(canvas.getByText(args.title)).toBeVisible();
    // Without a thumbnail, the fallback label sits clear of the play button.
    const fallback = within(canvas.getByRole('button', { name: `Play ${followUp.title}` })).getByText(followUp.thumbnailAlt);
    const text = document.createRange();
    text.selectNodeContents(fallback);
    const label = text.getBoundingClientRect();
    const play = fallback.closest('button').querySelector('[data-slot=video-play-icon]').getBoundingClientRect();
    await expect(label.top >= play.bottom || label.bottom <= play.top).toBe(true);
    await userEvent.click(trigger);

    const dialog = await screen.findByRole('dialog', { name: args.title });
    const panel = within(dialog).getByRole('heading', { name: args.title }).closest('[data-open]');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(panel).toHaveClass(...videoAnimationStyles[args.animationStyle].split(' '));
    await waitFor(() => expect(within(dialog).getAllByRole('button', { name: 'Close video dialog' }).at(-1)).toHaveFocus());
    await expect(document.body).toHaveStyle({ overflow: 'hidden' });
    await expect(within(dialog).getByTitle(args.title)).toHaveAttribute('src', `${videoSrc}?autoplay=1`);

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  }
};
