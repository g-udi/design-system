import { checkPausedGlyphInspector } from '../../../../../tests/components/animations/GlyphInspector/checkPausedGlyphInspector.jsx';
import { checkGlyphInspector } from '../../../../../tests/components/animations/GlyphInspector/checkGlyphInspector.jsx';
import { checkAnimationBehavior } from '../../../../../tests/components/animations/animationBehavior.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { GlyphInspector } from '../index.js';
import { GlyphInspectorPlayground } from './fixtures/GlyphInspectorExamples.jsx';
import examplesRaw from './fixtures/GlyphInspectorExamples.jsx?raw';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers';
import { playgroundSource } from '../../../../docs/components/previewSource';
const docs = getComponentDocs('Animations/Text/GlyphInspector');
const imports = publicSource(examplesRaw, new URL('./fixtures/GlyphInspectorExamples.jsx', import.meta.url));
export default {
  title: 'Animations/Text/GlyphInspector', id: 'animations-text-glyphinspector', component: GlyphInspector, tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {"text": "text", "autoplay": "boolean", "draggable": "boolean", "readout": "boolean", "guides": "boolean", "interval": "number", "outline": ["dashed", "dotted", "solid"], "particles": "number", "tempo": "number", "reveal": ["letter", "area", "none"], "radius": "number", "accent": "color", "paused": "boolean", "activeIndex": "number"}),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};
export const Playground = {
  args: {"text": "Gaudi Type", "autoplay": true, "draggable": true, "readout": true, "guides": true, "interval": 900, "outline": "dashed", "particles": 12, "tempo": 1, "reveal": "letter", "radius": 120, "paused": false, "activeIndex": 0},
  render: GlyphInspectorPlayground,
  parameters: { docs: { source: playgroundSource('GlyphInspectorPlayground', { imports }) } },
  play: async ({ canvasElement, args }) => {
    if (!args.paused && args.autoplay && args.reveal === "letter") {
      await checkAnimationBehavior(canvasElement);
      await checkGlyphInspector(canvasElement);
    }
    const canvas = within(canvasElement);
    const effect = canvasElement.querySelector('[data-slot="glyph-inspector"]');
    await expect(effect).toBeVisible();
    if (args.paused) return;
    await userEvent.click(canvas.getByRole('button', { name: 'Pause animation' }));
    await waitFor(() => expect(effect).toHaveAttribute('data-animated', 'false'));
    await expect(effect.querySelector('[data-slot="glyph-inspector-frame"]')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Resume animation' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(canvasElement.querySelector('[data-slot="glyph-inspector"]')).toBeVisible();
    if (!args.autoplay) await userEvent.hover(canvasElement.querySelector('.gaudi-glyph-inspector__letter'));
  }
};
export const Variant = {
  ...Playground, name: "Pointer exploration", args: { ...Playground.args, ...{"text": "Make it yours", "autoplay": false} }
};

export const AreaReveal = {
  ...Playground, name: "Area reveal", args: { ...Playground.args, text: "Type & Motion", reveal: "area", radius: 180, outline: "dotted" }
};

export const Paused = {
  ...Playground,
  name: 'Paused at an index',
  args: { ...Playground.args, paused: true, activeIndex: 3 },
  parameters: { docs: { description: { story: 'Keep the inspector visible at a zero-based character index without animation. Change activeIndex in the controls; invalid indices fall back to the first character.' }, source: playgroundSource('GlyphInspectorPlayground', { imports }) } },
  play: async ({ canvasElement, args }) => {
    if (!args.paused) return;
    await checkPausedGlyphInspector(canvasElement);
    const effect = canvasElement.querySelector('[data-slot="glyph-inspector"]');
    const letters = Array.from(String(args.text ?? ''));
    const index = Number.isInteger(args.activeIndex) && args.activeIndex >= 0 && args.activeIndex < letters.length ? args.activeIndex : 0;
    await expect(effect).toHaveAttribute('data-animated', 'false');
    if (!letters.length) {
      await expect(effect.querySelector('[data-slot="glyph-inspector-frame"]')).not.toBeInTheDocument();
      return;
    }
    await waitFor(() => expect(effect.querySelector('[data-focused="true"] .gaudi-glyph-inspector__fill')).toHaveTextContent(letters[index]));
    await expect(effect.querySelector('[data-slot="glyph-inspector-frame"]')).toBeVisible();
  }
};
