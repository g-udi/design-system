import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Hero } from '..';
import { HeroExample } from './fixtures/HeroExamples';
import exampleSource from './fixtures/HeroExamples.jsx?raw';
import { JournalTopicsHero } from './fixtures/JournalTopicsHero';
import journalTopicsSource from './fixtures/JournalTopicsHero.jsx?raw';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';

const docs = getComponentDocs('Blocks/Marketing/Heroes');
export default {
  title: 'Blocks/Marketing/Heroes',
  id: 'blocks-marketing-heroes',
  component: Hero,
  tags: ['autodocs'],
  argTypes: {
    ...docsArgTypes(docs, { eyebrow: 'text', title: 'text', description: 'text', layout: ['centered', 'split', 'editorial', 'background'] }),
    visual: { table: { disable: true }, control: false },
    titleAccent: { control: 'text', description: 'Example only: a muted second line of the title.', table: { category: 'Example' } },
    note: { control: 'text', description: 'Example only: fine print below the actions.', table: { category: 'Example' } },
    backdrop: { control: 'select', options: ['none', 'aurora', 'mesh', 'liquid', 'veil', 'lines'], description: 'Example only: an animated Gaudi background (Aurora, Grainient, Liquid Ether, Dark Veil, Floating Lines) behind the hero.', table: { category: 'Example' } }
  },
  parameters: {
    layout: 'fullscreen',
    visualAudit: { wide: 'Heroes fill the page and adapt to their container.' },
    docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }), source: playgroundSource('HeroExample', { imports: exampleSource }) }
  },
  render: args => <HeroExample {...args} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveTextContent(args.title);
    if (args.eyebrow) await expect(heading).not.toHaveTextContent(args.eyebrow);
    const action = canvas.getByRole('link', { name: 'Explore the system' });
    await userEvent.click(action);
    const target = canvas.getByRole('region', { name: 'Explore Gaudi' });
    await expect(target).toBeVisible();
    canvas.getByRole('link', { name: 'See how it works' }).focus();
    await userEvent.keyboard('{Enter}');
    await expect(decodeURIComponent(window.location.hash.slice(1))).toBe(target.id);
    // Restore position and focus for consistent responsive captures.
    action.blur();
    canvasElement.ownerDocument.activeElement?.blur();
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    window.scrollTo(0, 0);
    if (args.backdrop && args.backdrop !== 'none') {
      const effect = canvasElement.querySelector('.ds-background');
      await userEvent.click(canvas.getByRole('button', { name: 'Pause animation' }));
      await waitFor(() => expect(effect).toHaveAttribute('data-animated', 'false'));
      await userEvent.click(canvas.getByRole('button', { name: 'Play animation' }));
      await expect(canvas.getByRole('button', { name: 'Pause animation' })).toBeVisible();
    }
  }
};

export const Playground = {
  name: 'Aurora',
  args: { eyebrow: 'Gaudi Studio', title: 'One calm system', titleAccent: 'across every page.', description: 'Shared foundations, accessible components, and a little atmosphere. Bring your content and make it yours.', note: 'Open source · No account required', layout: 'centered', visual: 'none', backdrop: 'aurora' },
  parameters: { docs: { description: { story: 'Centered copy over the Aurora background in the dark theme scope. Choose another backdrop in the controls; every animated example includes a pause control and stops under reduced motion.' } } }
};
export const MeshGradient = {
  name: 'Mesh gradient',
  args: { eyebrow: 'New in Gaudi', title: 'Build at the speed', titleAccent: 'of an idea.', description: 'Start from a launch-ready composition over a flowing Grainient gradient, then make every detail your own.', note: 'Free to use · Works with React', layout: 'centered', visual: 'none', backdrop: 'mesh' }
};
export const LiveSurface = {
  name: 'Live surface',
  args: { eyebrow: 'Fluid, in real time', title: 'Motion that feels', titleAccent: 'like water.', description: 'Show the product working the moment the page opens. Liquid Ether fills the whole hero, drifts on its own, and follows the pointer.', layout: 'centered', visual: 'none', backdrop: 'liquid' }
};
export const JournalTopics = {
  name: 'Journal topics',
  argTypes: { eyebrow: { table: { disable: true } }, title: { table: { disable: true } }, titleAccent: { table: { disable: true } }, description: { table: { disable: true } }, note: { table: { disable: true } }, layout: { table: { disable: true } }, backdrop: { table: { disable: true } } },
  parameters: { docs: {
    description: { story: 'A journal introduction over the Particle Sea background. Choosing a topic rewrites the headline and summary and changes the height and pace of the swell. Topics and counts are sample content.' },
    source: playgroundSource('JournalTopicsHero', { imports: journalTopicsSource })
  } },
  render: () => <JournalTopicsHero />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole('heading', { level: 1 });
    await expect(heading).toHaveTextContent('Writing about motion.');
    const accessibility = canvas.getByRole('radio', { name: /Accessibility/u });
    await userEvent.click(accessibility);
    await expect(accessibility).toHaveAttribute('aria-checked', 'true');
    await expect(heading).toHaveTextContent('Writing about accessibility.');
    // Pressing the active topic again keeps one topic selected.
    await userEvent.click(accessibility);
    await expect(accessibility).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{ArrowRight}{Enter}');
    await expect(heading).toHaveTextContent('Writing about motion.');
    const effect = canvasElement.querySelector('.ds-background');
    await userEvent.click(canvas.getByRole('button', { name: 'Pause animation' }));
    await waitFor(() => expect(effect).toHaveAttribute('data-animated', 'false'));
    await userEvent.click(canvas.getByRole('button', { name: 'Play animation' }));
  }
};
export const SplitImage = {
  name: 'Split image',
  args: { title: 'Good design starts with a little space.', description: 'Bring your words, your work, and your point of view. Give them a home that feels like you.', layout: 'split', visual: 'art' }
};
export const ProductPreview = {
  name: 'Product preview',
  argTypes: { layout: { control: 'select', options: ['centered', 'split', 'editorial'] } },
  args: { title: 'Your ideas. Already taking shape.', description: 'Start with a component, compose a page, and keep the details consistent as your product grows.', layout: 'centered', visual: 'code' }
};
export const Editorial = {
  name: 'Editorial',
  args: { title: 'A place for the work in progress.', description: 'Notes, experiments, and ideas worth sharing. Build a journal with room for both the finished piece and the thinking behind it.', layout: 'editorial', visual: 'art' }
};
