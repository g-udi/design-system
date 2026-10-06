import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ColorPicker } from '../index.js';
import { verifyCanvasPointer, verifyScreenSampling } from '../../../../../tests/components/core/ColorPicker/colorPickerInteractions.jsx';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers';
import { ControlledExample } from './fixtures/ControlledExample.jsx';
import controlledRaw from './fixtures/ControlledExample.jsx?raw';
import { FormExample } from './fixtures/FormExample.jsx';
import formRaw from './fixtures/FormExample.jsx?raw';

const docs = getComponentDocs('Core/ColorPicker');
const swatches = ['#2563eb', '#7c3aed', '#e11d48', '#ea580c', '#f59e0b', '#16a34a', '#0d9488', '#18181b'];

export default {
  title: 'Core/Advanced Inputs/ColorPicker',
  id: 'core-colorpicker',
  component: ColorPicker,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    defaultValue: 'text', defaultFormat: ['hex', 'rgb', 'hsl', 'css'], showAlpha: 'boolean', showEyeDropper: 'boolean', label: 'text', description: 'text', swatches: 'object', disabled: 'boolean', readOnly: 'boolean'
  }),
  decorators: [Story => <div className='mx-auto w-full max-w-sm'><Story /></div>],
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: {
    label: 'Project color', defaultValue: '#2563eb', swatches,
    description: 'Choose a color, adjust its opacity, or enter an exact value.',
    defaultFormat: 'hex', showAlpha: true, showEyeDropper: true,
    disabled: false, readOnly: false, onValueChange: fn()
  },
  render: args => <ColorPicker key={`${args.defaultValue}-${args.defaultFormat}`} {...args} />,
  parameters: { docs: { source: playgroundSource('ColorPicker', { imports: "import { ColorPicker } from '@gaudi/design-system/core/ColorPicker';" }) } },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    if (args.disabled || args.readOnly) return;
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: `${args.label}: format` }), 'hex');
    const input = canvas.getByRole('textbox', { name: `${args.label}: hex value` });
    await userEvent.clear(input);
    await userEvent.type(input, '#AbC');
    await expect(args.onValueChange).not.toHaveBeenCalled();
    await userEvent.keyboard('{Enter}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('#aabbcc');
    await expect(input).toHaveValue('#aabbcc');
    await userEvent.clear(input);
    await userEvent.type(input, 'invalid');
    await userEvent.tab();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getByRole('alert')).toHaveTextContent('valid hex color');
    await expect(args.onValueChange).toHaveBeenCalledTimes(1);
    await userEvent.click(input);
    await userEvent.keyboard('{Escape}');
    await expect(input).toHaveValue('#aabbcc');
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
    await userEvent.clear(input);
    await userEvent.type(input, '123456');
    await userEvent.tab();
    await expect(input).toHaveValue('#123456');
    const hue = canvas.getByRole('slider', { name: `${args.label}: hue` });
    hue.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(input.value).not.toBe('#123456');
    if (args.showAlpha) {
      const opacity = canvas.getByRole('slider', { name: `${args.label}: opacity` });
      opacity.focus();
      await userEvent.keyboard('{Home}');
      await expect(args.onValueChange.mock.lastCall[0]).toMatch(/00$/);
      await userEvent.clear(input);
      await userEvent.type(input, '#123456ff{Enter}');
      await expect(args.onValueChange).toHaveBeenLastCalledWith('#123456');
      await expect(canvas.getByLabelText(`${args.label}: opacity percent`)).toHaveValue('100');
      opacity.focus();
      await userEvent.keyboard('{End}');
      await expect(args.onValueChange.mock.lastCall[0]).toHaveLength(7);
    }
    const format = canvas.getByRole('combobox', { name: `${args.label}: format` });
    await userEvent.selectOptions(format, 'css');
    const css = canvas.getByRole('textbox', { name: `${args.label}: css value` });
    await userEvent.clear(css);
    await userEvent.type(css, 'hsl(120, 100%, 50%){Enter}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('#00ff00');
    await userEvent.selectOptions(format, 'rgb');
    await expect(canvas.getByLabelText(`${args.label}: G`)).toHaveValue('255');
    const red = canvas.getByLabelText(`${args.label}: R`);
    await userEvent.clear(red);
    await userEvent.type(red, '255');
    await userEvent.tab();
    await expect(args.onValueChange).toHaveBeenLastCalledWith('#ffff00');
    await userEvent.selectOptions(format, 'hsl');
    await expect(canvas.getByLabelText(`${args.label}: H`)).toHaveValue('60');
    await userEvent.selectOptions(format, 'hex');
    const hex = canvas.getByRole('textbox', { name: `${args.label}: hex value` });
    await userEvent.clear(hex);
    await userEvent.type(hex, '#ff0000{Enter}');
    const brightness = canvas.getByRole('slider', { name: `${args.label}: brightness` });
    brightness.focus();
    await userEvent.keyboard('{Home}');
    hue.focus();
    await userEvent.keyboard('{Home}{ArrowRight}');
    brightness.focus();
    await userEvent.keyboard('{End}');
    await expect(hex).toHaveValue('#ff0400');
    const saturation = canvas.getByRole('slider', { name: `${args.label}: saturation` });
    saturation.focus();
    await userEvent.keyboard('{Home}');
    await expect(hex).toHaveValue('#ffffff');
    await userEvent.keyboard('{End}');
    await expect(hex).toHaveValue('#ff0400');
    await verifyCanvasPointer(canvasElement, args.label);
    const preset = canvas.queryByRole('button', { name: `${args.label}: #16a34a` });
    if (preset) {
      await userEvent.click(preset);
      await expect(hex).toHaveValue('#16a34a');
      await expect(preset).toHaveAttribute('aria-pressed', 'true');
      await userEvent.keyboard('{Enter}');
      await expect(hex).toHaveValue('#16a34a');
    }
  }
};

export const Controlled = {
  render: () => <ControlledExample />,
  parameters: { docs: { source: { code: publicSource(controlledRaw, new URL('./fixtures/ControlledExample.jsx', import.meta.url)) } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Project color: hex value' });
    await userEvent.click(canvas.getByRole('button', { name: 'Lock host value' }));
    const hue = canvas.getByRole('slider', { name: 'Project color: hue' });
    const previousHue = hue.getAttribute('aria-valuenow');
    hue.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(hue).toHaveAttribute('aria-valuenow', previousHue);
    await expect(input).toHaveValue('#2563eb');
    await userEvent.click(canvas.getByRole('button', { name: 'Project color: #e11d48' }));
    await expect(input).toHaveValue('#2563eb');
    await userEvent.clear(input);
    await userEvent.type(input, 'abc{Enter}');
    await expect(input).toHaveValue('#2563eb');
    await userEvent.clear(input);
    await userEvent.type(input, 'incomplete');
    await userEvent.click(canvas.getByRole('button', { name: 'Set amber externally' }));
    await expect(input).toHaveValue('#f59e0b');
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Set blue externally' }));
    await expect(input).toHaveValue('#2563eb');
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Lock host value' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Project color: #e11d48' }));
    await expect(input).toHaveValue('#e11d48');
    await verifyScreenSampling(canvasElement);
  }
};

export const FormAndStates = {
  name: 'Form and states',
  render: () => <FormExample />,
  parameters: { docs: { source: { code: publicSource(formRaw, new URL('./fixtures/FormExample.jsx', import.meta.url)) } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const form = canvas.getByRole('form', { name: 'Color preferences' });
    const input = canvas.getByRole('textbox', { name: 'Accent: hex value' });
    await expect(canvas.getByRole('textbox', { name: 'Read-only color: hex value' })).toHaveAttribute('readonly');
    await expect(canvas.getByRole('textbox', { name: 'Disabled color: hex value' })).toBeDisabled();
    await expect(canvas.getByRole('slider', { name: 'Read-only color: hue' }).closest('[data-slot="slider"]')).toHaveAttribute('data-disabled');
    await expect(canvas.getByRole('button', { name: 'Read-only color: #2563eb' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Accent: #16a34a' }));
    await expect(Object.fromEntries(new FormData(form))).toEqual({ accent: '#16a34a', locked: '#16a34a' });
    await userEvent.click(canvas.getByRole('button', { name: 'Reset colors' }));
    await waitFor(() => expect(input).toHaveValue('#2563eb'));
    await expect(Object.fromEntries(new FormData(form))).toEqual({ accent: '#2563eb', locked: '#16a34a' });
  }
};
