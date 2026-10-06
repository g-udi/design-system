import {
  expect,
  fireEvent,
  fn,
  userEvent,
  waitFor,
  within,
} from 'storybook/test';
import { createRoot } from 'react-dom/client';
import { SignaturePad, SignaturePadArea } from '../index.js';
import { sampleSignature } from './fixtures/signatureExamples.js';
import {
  createComponentDocsPage,
  getComponentDocs,
} from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import { SignatureExample } from './fixtures/SignatureExample.jsx';
import { NativeFormExample } from './fixtures/NativeFormExample.jsx';
import { DrawOrTypeExample } from './fixtures/DrawOrTypeExample.jsx';
import { ExportExample } from './fixtures/ExportExample.jsx';
import { ControlledExample } from './fixtures/ControlledExample.jsx';
import playgroundRaw from './fixtures/SignatureExample.jsx?raw';
import formRaw from './fixtures/NativeFormExample.jsx?raw';
import typeRaw from './fixtures/DrawOrTypeExample.jsx?raw';
import exportRaw from './fixtures/ExportExample.jsx?raw';
import controlledRaw from './fixtures/ControlledExample.jsx?raw';
import sampleRaw from './fixtures/signatureExamples.js?raw';

const docs = getComponentDocs('Core/SignaturePad');
const source = (raw, file, component) =>
  playgroundSource(component, {
    imports: publicSource(
      raw.replace(
        "import { sampleSignature } from './signatureExamples.js';",
        sampleRaw,
      ),
      new URL(`./fixtures/${file}.jsx`, import.meta.url),
    ),
  });
const paths = (area) =>
  area.querySelectorAll('[data-slot="signature-pad-stroke"]');
const pointer = (area, overrides = {}) => {
  const box = area.getBoundingClientRect();
  return {
    pointerId: 21,
    pointerType: 'mouse',
    isPrimary: true,
    button: 0,
    buttons: 1,
    pressure: 0.5,
    clientX: box.left + 35,
    clientY: box.top + 70,
    ...overrides,
  };
};
async function draw(area, overrides = {}, cancel = false) {
  const p = pointer(area, overrides);
  await fireEvent.pointerDown(area, p);
  for (let step = 1; step <= 5; step++)
    await fireEvent.pointerMove(area, {
      ...p,
      clientX: p.clientX + step * 15,
      clientY: p.clientY + (step % 2 ? -18 : 8),
    });
  await fireEvent[cancel ? 'pointerCancel' : 'pointerUp'](area, {
    ...p,
    buttons: 0,
    clientX: p.clientX + 85,
    clientY: p.clientY + 5,
  });
}

async function checkPrefilledFormReset(canvasElement) {
  const host = canvasElement.ownerDocument.createElement('div');
  canvasElement.append(host);
  const root = createRoot(host);
  try {
    root.render(
      <form>
        <SignaturePad name="existing-signature" defaultValue={sampleSignature}>
          <SignaturePadArea aria-label="Existing signature" />
        </SignaturePad>
      </form>,
    );
    await within(host).findByRole('application');
    const form = host.querySelector('form');
    const value = () => new FormData(form).get('existing-signature');
    const initial = value();
    await expect(initial).toMatch(/^data:image\/svg\+xml/);
    form.reset();
    await waitFor(() => expect(value()).toBe(initial));
    await expect(paths(host)).toHaveLength(3);
  } finally {
    root.unmount();
    host.remove();
  }
}

export default {
  title: 'Core/Advanced Inputs/SignaturePad',
  id: 'core-signaturepad',
  component: SignaturePad,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    variant: ['default', 'muted', 'ghost'],
    disabled: 'boolean',
    readOnly: 'boolean',
    minWidth: 'number',
    maxWidth: 'number',
    smoothing: 'number',
    sizing: ['auto', 'pressure', 'velocity'],
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground }),
    },
  },
  decorators: [
    (Story) => (
      <ExampleFrame>
        <Story />
      </ExampleFrame>
    ),
  ],
};

export const Playground = {
  args: {
    variant: 'muted',
    disabled: false,
    readOnly: false,
    minWidth: 0.8,
    maxWidth: 3.2,
    smoothing: 0.5,
    sizing: 'auto',
    onValueChange: fn(),
  },
  parameters: {
    docs: {
      source: source(playgroundRaw, 'SignatureExample', 'SignatureExample'),
      description: {
        story:
          'Draw, undo, redo, clear, and save a preview. Ink follows the theme. All controls adjust the live drawing surface.',
      },
    },
  },
  render: (args) => <SignatureExample {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const area = canvas.getByRole('application', { name: 'Your signature' });
    await expect(area).toHaveAttribute('data-variant', args.variant);
    await expect(
      canvas.getByRole('button', { name: 'Save signature' }),
    ).toBeDisabled();
    await draw(area);
    if (args.disabled || args.readOnly)
      return expect(paths(area)).toHaveLength(0);
    await expect(paths(area)).toHaveLength(1);
    await expect(args.onValueChange).toHaveBeenCalledTimes(1);
    await draw(area, { pointerId: 22, pointerType: 'touch' });
    await expect(paths(area)).toHaveLength(2);
    await draw(
      area,
      { pointerId: 23, pointerType: 'pen', pressure: 0.9 },
      true,
    );
    await expect(paths(area)).toHaveLength(2);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Undo', exact: true }),
    );
    await expect(paths(area)).toHaveLength(1);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Redo', exact: true }),
    );
    await expect(paths(area)).toHaveLength(2);
    await fireEvent.keyDown(area, {
      key: 'z',
      ctrlKey: true,
      isComposing: true,
    });
    await expect(paths(area)).toHaveLength(2);
    await fireEvent.keyDown(area, { key: 'z', ctrlKey: true });
    await expect(paths(area)).toHaveLength(1);
    await fireEvent.keyDown(area, { key: 'z', ctrlKey: true, shiftKey: true });
    await expect(paths(area)).toHaveLength(2);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Save signature' }),
    );
    await expect(
      canvas.getByRole('img', { name: 'Saved signature' }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Clear signature' }),
    );
    await expect(paths(area)).toHaveLength(0);
    await expect(area).toHaveFocus();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Undo', exact: true }),
    );
    await expect(paths(area)).toHaveLength(2);
  },
};

export const NativeForm = {
  parameters: {
    docs: {
      source: source(formRaw, 'NativeFormExample', 'NativeFormExample'),
      description: {
        story:
          'A required SVG field in a native form. Empty submission focuses the pad, editing clears the error, and reset restores its default value.',
      },
    },
  },
  render: () => <NativeFormExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const area = canvas.getByRole('application');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Attach signature' }),
    );
    await expect(area).toHaveFocus();
    await expect(area).toHaveAttribute('aria-invalid', 'true');
    await draw(area);
    await expect(area).not.toHaveAttribute('aria-invalid');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Attach signature' }),
    );
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Signature attached',
    );
    await expect(
      new FormData(canvasElement.querySelector('form')).get('signature'),
    ).toMatch(/^data:image\/svg\+xml/);
    await userEvent.click(canvas.getByRole('button', { name: 'Reset form' }));
    await waitFor(() => expect(paths(area)).toHaveLength(0));
    await checkPrefilledFormReset(canvasElement);
    await expect(
      canvas.getByRole('button', { name: 'Undo', exact: true }),
    ).toBeDisabled();
  },
};

export const DrawOrType = {
  parameters: {
    docs: {
      source: source(typeRaw, 'DrawOrTypeExample', 'DrawOrTypeExample'),
      description: {
        story:
          'A keyboard-friendly alternative composed from Core Tabs, Input, and Button. The host stores typed names separately from drawn strokes.',
      },
    },
  },
  render: () => <DrawOrTypeExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: 'Type your name' }));
    const input = canvas.getByRole('textbox', { name: 'Full name' });
    await userEvent.type(input, 'Anouk Brennan');
    await userEvent.tab();
    await expect(
      canvas.getByRole('button', { name: 'Use signature' }),
    ).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Typed signature saved for Anouk Brennan',
    );
    await userEvent.click(
      canvas.getByRole('tab', { name: 'Draw', exact: true }),
    );
    await expect(
      canvas.getByRole('button', { name: 'Use signature' }),
    ).toBeDisabled();
  },
};

export const ExportFormats = {
  parameters: {
    docs: {
      source: source(exportRaw, 'ExportExample', 'ExportExample'),
      description: {
        story:
          'Export illustrative strokes as PNG, JPEG, SVG, or JSON. Downloads stay local; the host decides where to store or upload them.',
      },
    },
  },
  render: () => <ExportExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const format of ['PNG', 'JPEG', 'SVG', 'JSON']) {
      await userEvent.click(
        canvas.getByRole('button', { name: format, exact: true }),
      );
      const link = canvas.getByRole('link', { name: `Download ${format}` });
      await expect(link).toHaveAttribute(
        'download',
        `signature.${format === 'JPEG' ? 'jpg' : format.toLowerCase()}`,
      );
      await expect(link.getAttribute('href')).toMatch(
        new RegExp(
          `^data:${format === 'JSON' ? 'application/json' : `image/${format === 'SVG' ? 'svg\\+xml' : format.toLowerCase()}`}`,
        ),
      );
      if (format === 'PNG' || format === 'JPEG') {
        const image = new Image();
        image.src = link.getAttribute('href');
        await image.decode();
        await expect(image.naturalWidth).toBeGreaterThan(100);
      }
    }
  },
};

export const ControlledAndStylus = {
  args: { onChange: fn(), onStrokeStart: fn() },
  parameters: {
    docs: {
      source: source(controlledRaw, 'ControlledExample', 'ControlledExample'),
      description: {
        story:
          'The host accepts deep copies or refuses changes, can load saved ink, lock editing, and accept only a pen. Undo stays available when a controlled change is refused.',
      },
    },
  },
  render: (args) => <ControlledExample {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const area = canvas.getByRole('application');
    await draw(area);
    await draw(area, { pointerId: 22 });
    await expect(paths(area)).toHaveLength(2);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Refuse changes' }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Undo', exact: true }),
    );
    await expect(paths(area)).toHaveLength(2);
    await expect(
      canvas.getByRole('button', { name: 'Undo', exact: true }),
    ).toBeEnabled();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Refuse changes' }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Undo', exact: true }),
    );
    await expect(paths(area)).toHaveLength(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Read only' }));
    await userEvent.click(
      canvas.getByRole('button', { name: 'Clear through API' }),
    );
    await draw(area);
    await expect(paths(area)).toHaveLength(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Read only' }));
    const pending = pointer(area, { pointerId: 31 });
    await fireEvent.pointerDown(area, pending);
    await expect(area).toHaveAttribute('data-drawing', 'true');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Disabled', exact: true }),
    );
    await fireEvent.pointerUp(area, { ...pending, buttons: 0 });
    await expect(paths(area)).toHaveLength(1);
    await expect(area).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Clear through API' }),
    );
    await expect(paths(area)).toHaveLength(1);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Disabled', exact: true }),
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Pen only' }));
    await draw(area, { pointerType: 'touch' });
    await expect(paths(area)).toHaveLength(1);
    await draw(area, { pointerType: 'pen', pressure: 0.8 });
    await expect(paths(area)).toHaveLength(2);
    await expect(args.onStrokeStart).toHaveBeenLastCalledWith({
      pointerType: 'pen',
    });
    await userEvent.click(
      canvas.getByRole('button', { name: 'Load saved ink' }),
    );
    await expect(paths(area)).toHaveLength(3);
    await expect(
      canvas.getByRole('button', { name: 'Undo', exact: true }),
    ).toBeDisabled();
  },
};
