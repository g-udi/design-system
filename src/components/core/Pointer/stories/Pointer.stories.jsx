import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { Pointer } from '../index.js';
import { PointerPlayground, TrackingComparison, ContextualLabels, NativeControls } from './fixtures/PointerExamples.jsx';
import examplesRaw from './fixtures/PointerExamples.jsx?raw';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers';
import { checkPointerUpdates } from '../../../../../tests/components/core/Pointer/checkPointerUpdates.jsx';

const docs = getComponentDocs('Core/Pointer');
const imports = publicSource(examplesRaw, new URL('./fixtures/PointerExamples.jsx', import.meta.url));
const source = (name) => playgroundSource(name, { imports });
const canFollow = () => window.matchMedia('(any-hover: hover) and (any-pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const move = async (element, x = 80, y = 80, pointerType = 'mouse') => {
  const bounds = element.getBoundingClientRect();
  await fireEvent.pointerMove(element, { pointerType, clientX: bounds.left + x, clientY: bounds.top + y });
};

export default {
  title: 'Core/Pointer', id: 'core-pointer', component: Pointer, tags: ['autodocs'],
  argTypes: {
    ...docsArgTypes(docs, { variant: ['dot', 'ring', 'frame', 'label'], tracking: ['direct', 'spring', 'lazy'], tone: ['neutral', 'accent'], label: 'text', hideCursor: 'boolean', disabled: 'boolean' }),
    label: { ...docsArgTypes(docs, { label: 'text' }).label, if: { arg: 'variant', eq: 'label' } }
  },
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};

export const Playground = {
  args: { variant: 'frame', tracking: 'lazy', tone: 'neutral', label: 'Explore', hideCursor: true, disabled: false },
  parameters: {
    controlAudit: { interaction: ['variant', 'tracking', 'tone', 'label', 'hideCursor', 'disabled'] },
    docs: { description: { story: 'A classic website cursor: an immediate dot and a lagging corner frame that grows over actions. Try the appearance and tracking controls to change its feel.' }, source: source('PointerPlayground') }
  },
  render: PointerPlayground,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const root = canvasElement.querySelector('[data-slot="pointer-follower"]');
    await checkPointerUpdates(canvasElement);
    await move(root);
    if (args.disabled || !canFollow()) {
      await expect(root).not.toHaveAttribute('data-active');
    } else {
      await expect(root).toHaveAttribute('data-active', 'true');
      await expect(getComputedStyle(root).cursor).toBe(args.hideCursor ? 'none' : 'auto');
      const position = root.querySelector('[data-slot="pointer-follower-position"]');
      await move(root, 180, 120);
      await waitFor(() => {
        const matrix = new DOMMatrix(getComputedStyle(position).transform);
        expect(Math.abs(matrix.m41 - (180 - root.clientLeft))).toBeLessThan(1);
        expect(Math.abs(matrix.m42 - (120 - root.clientTop))).toBeLessThan(1);
      }, { timeout: 3000 });
      await move(canvas.getByRole('button', { name: 'Save to collection' }), 10, 10);
      await expect(root.querySelector('[data-slot="pointer-follower-mark"]')).toHaveAttribute('data-hovering', 'true');
    }
    const save = canvas.getByRole('button', { name: 'Save to collection' });
    save.focus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('status')).toHaveTextContent('One item saved.');
    await expect(root).not.toHaveAttribute('data-active');
    await userEvent.click(canvas.getByRole('button', { name: 'Start again' }));
    await move(root, 100, 80, 'touch');
    await expect(root).not.toHaveAttribute('data-active');
    await fireEvent.pointerOut(root, { pointerType: 'mouse', relatedTarget: null });
  }
};

export const Tracking = {
  name: 'Direct, spring and lazy',
  parameters: { docs: { source: source('TrackingComparison'), description: { story: 'Compare an immediate dot, a spring ring, and the slower lazy corner frame. Each preview owns its pointer independently.' } } },
  render: () => <TrackingComparison />,
  play: async ({ canvasElement }) => {
    const roots = [...canvasElement.querySelectorAll('[data-slot="pointer-follower"]')];
    for (const root of roots) {
      await move(root);
      await expect(root.hasAttribute('data-active')).toBe(canFollow());
      await fireEvent.pointerOut(root, { pointerType: 'mouse', relatedTarget: null });
      await expect(root).not.toHaveAttribute('data-active');
    }
  }
};

export const Labels = {
  name: 'Contextual labels',
  parameters: { docs: { source: source('ContextualLabels'), description: { story: 'A supplementary Read notes or View project label follows the pointer. The cards retain their visible labels and keyboard actions.' } } },
  render: () => <ContextualLabels />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const root = canvasElement.querySelector('[data-slot="pointer-follower"]');
    const notes = canvas.getByRole('button', { name: 'Field notes' });
    await move(notes);
    if (canFollow()) await expect(root.querySelector('.ds-pointer-label')).toHaveTextContent('Read notes');
    await userEvent.click(notes);
    await expect(canvas.getByRole('status')).toHaveTextContent('Field notes selected.');
    await move(canvas.getByRole('button', { name: 'Shape and space' }));
    if (canFollow()) await expect(root.querySelector('.ds-pointer-label')).toHaveTextContent('View project');
    await fireEvent.pointerOut(root, { pointerType: 'mouse', relatedTarget: null });
  }
};

export const NativeFallbacks = {
  name: 'Inputs and native fallbacks',
  parameters: { docs: { source: source('NativeControls') } },
  render: () => <NativeControls />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const root = canvasElement.querySelector('[data-slot="pointer-follower"]');
    await move(root);
    await move(canvas.getByRole('textbox', { name: 'Collection name' }));
    await expect(root).not.toHaveAttribute('data-active');
    await userEvent.type(canvas.getByRole('textbox'), 'Research');
    await expect(canvas.getByRole('textbox')).toHaveValue('Research');
    await userEvent.clear(canvas.getByRole('textbox'));
    await move(root);
    await move(root.querySelector('[data-pointer-native]'));
    await expect(root).not.toHaveAttribute('data-active');
    await expect(canvas.getByRole('button', { name: 'Unavailable action' })).toBeDisabled();
  }
};
