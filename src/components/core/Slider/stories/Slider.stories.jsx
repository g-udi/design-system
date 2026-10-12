import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { PlaygroundDemo, priceLabel, priceDefault, formatPrice } from './fixtures/NativeExamples.jsx';
import nativeSource from './fixtures/NativeExamples.jsx?raw';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import { Slider } from '../index';
import { checkSliderControlUpdates } from '../../../../../tests/components/core/Slider/checkSliderControlUpdates.jsx';

const docs = getComponentDocs('Core/Slider');
export default {
  title: 'Core/Slider', id: 'core-slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    min: 'number',
    max: 'number',
    step: 'number',
    orientation: ['horizontal', 'vertical'],
    disabled: 'boolean'
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
    'aria-label': 'Volume',
    defaultValue: [50],
    min: 0,
    max: 100,
    step: 5,
    orientation: 'horizontal',
    disabled: false,
    onValueChange: fn(),
    onValueCommit: fn()
  },
  parameters: {
    docs: {
      description: { story: 'Playback settings with a single-thumb volume and a two-thumb price range, each with a live readout. `min`, `max`, `step`, `orientation`, and `disabled` apply to both, so a vertical orientation lays them out side by side.' },
      source: { code: publicSource(nativeSource, new URL('./fixtures/NativeExamples.jsx', import.meta.url)) }
    }
  },
  render: (args) => <PlaygroundDemo {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole('slider', { name: args['aria-label'] });
    const readout = (element) => within(element.closest('[data-slot="slider"]').parentElement).getByRole('status');
    const [low, high] = priceDefault(args);
    await expect(slider).toHaveAttribute('aria-valuenow', '50');
    await expect(slider).toHaveAttribute('aria-orientation', args.orientation);
    await expect(canvas.getByRole('slider', { name: `${priceLabel} 1` })).toHaveAttribute('aria-valuenow', String(low));
    await expect(canvas.getByRole('slider', { name: `${priceLabel} 2` })).toHaveAttribute('aria-valuenow', String(high));
    await expect(canvas.getByText(formatPrice([low, high]))).toBeVisible();
    // The unfilled track uses the border token, so it stays visible on the page surface.
    const track = slider.closest('[data-slot="slider"]').querySelector('[data-slot="slider-track"]');
    const token = track.appendChild(Object.assign(document.createElement('span'), { style: 'background: var(--ds-color-border)' }));
    await expect(getComputedStyle(track).backgroundColor).toBe(getComputedStyle(token).backgroundColor);
    token.remove();
    if (args.disabled) {
      for (const root of canvasElement.querySelectorAll('[data-slot="slider"]')) await expect(root).toHaveAttribute('data-disabled');
      return;
    }
    slider.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(slider).toHaveAttribute('aria-valuenow', String(50 + args.step));
    await expect(slider).toHaveAttribute('aria-valuetext', String(50 + args.step));
    await expect(slider).toHaveAccessibleDescription(`${args.min}–${args.max} · steps of ${args.step}`);
    await expect(readout(slider)).toHaveTextContent(String(50 + args.step));
    await expect(args.onValueCommit).toHaveBeenLastCalledWith([50 + args.step]);
    await userEvent.keyboard('{Home}');
    await expect(slider).toHaveAttribute('aria-valuenow', String(args.min));
    // Step back to the starting volume so the preview ends where it loaded.
    await userEvent.keyboard(`{ArrowRight>${Math.round((50 - args.min) / args.step)}/}`);
    await expect(slider).toHaveAttribute('aria-valuenow', '50');
    await expect(readout(slider)).toHaveTextContent('50');
    await checkSliderControlUpdates(canvasElement);
  }
};
