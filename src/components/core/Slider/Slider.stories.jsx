import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { Slider } from './index';

const docs = getComponentDocs('Core/Slider');
const priceLabel = 'Price range';
const clampTo = ({ min, max }, value) => Math.min(max, Math.max(min, value));
const priceDefault = (args) => [clampTo(args, 20), clampTo(args, 80)];
const formatPrice = ([low, high]) => `$${low} – $${high}`;

// One labelled slider with a live readout; the story owns the readout, the slider stays uncontrolled.
function SliderField({ label, icon, format, defaultValue, orientation, onValueChange, ...props }) {
  const [values, setValues] = useState(defaultValue);
  const vertical = orientation === 'vertical';
  return (
    <div className={vertical ? 'grid h-52 grid-rows-[auto_1fr] justify-items-center gap-3' : 'grid gap-3'}>
      <div className={vertical ? 'grid justify-items-center gap-0.5 text-sm' : 'flex items-center justify-between gap-3 text-sm'}>
        <span className='flex items-center gap-1.5 font-medium text-foreground'>
          <RegistryIcon lucide={icon} className='size-4 text-text-muted' />
          {label}
        </span>
        <output className='tabular-nums text-text-muted'>{format(values)}</output>
      </div>
      <Slider
        aria-label={label}
        defaultValue={defaultValue}
        orientation={orientation}
        onValueChange={(next) => {
          setValues(next);
          onValueChange?.(next);
        }}
        {...props}
      />
    </div>
  );
}

export default {
  title: 'Core/Slider',
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
      source: playgroundSource('Slider', { imports: "import { Slider } from '@gaudi/design-system/core/Slider';" })
    }
  },
  render: ({ 'aria-label': label, defaultValue, ...args }) => (
    <div className={args.orientation === 'vertical' ? 'flex justify-center gap-16' : 'grid gap-6'}>
      <SliderField {...args} label={label} icon='Volume2Icon' defaultValue={defaultValue} format={([value]) => value} key={`volume-${args.min}-${args.max}`} />
      <SliderField {...args} label={priceLabel} icon='DollarSignIcon' defaultValue={priceDefault(args)} format={formatPrice} minStepsBetweenThumbs={1} key={`price-${args.min}-${args.max}`} />
    </div>
  ),
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
    await expect(readout(slider)).toHaveTextContent(String(50 + args.step));
    await expect(args.onValueCommit).toHaveBeenLastCalledWith([50 + args.step]);
    await userEvent.keyboard('{Home}');
    await expect(slider).toHaveAttribute('aria-valuenow', String(args.min));
    // Step back to the starting volume so the preview ends where it loaded.
    await userEvent.keyboard(`{ArrowRight>${Math.round((50 - args.min) / args.step)}/}`);
    await expect(slider).toHaveAttribute('aria-valuenow', '50');
    await expect(readout(slider)).toHaveTextContent('50');
  }
};
