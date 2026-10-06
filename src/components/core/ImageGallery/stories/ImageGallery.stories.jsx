import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ImageGallery } from '../index.js';
import { GalleryPlayground, SingleImage, ControlledGallery, GalleryRecovery, images } from './fixtures/GalleryExamples.jsx';
import examplesRaw from './fixtures/GalleryExamples.jsx?raw';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { checkGalleryLifecycle } from '../../../../../tests/components/core/ImageGallery/checkGalleryLifecycle.jsx';

const docs = getComponentDocs('Core/ImageGallery');
const imports = publicSource(examplesRaw, new URL('./fixtures/GalleryExamples.jsx', import.meta.url));
const source = name => playgroundSource(name, { imports });

export default {
  title: 'Core/ImageGallery', id: 'core-imagegallery', component: ImageGallery, tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { label: 'text', layout: ['masonry', 'grid'], showCaptions: 'boolean', disabled: 'boolean' }),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};

export const Playground = {
  args: { label: 'Abstract studies', layout: 'masonry', showCaptions: true, disabled: false },
  parameters: { docs: { source: source('GalleryPlayground') }, controlAudit: { interaction: ['disabled'] } },
  render: GalleryPlayground,
  play: async ({ canvasElement, args, id }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: `Open image: ${images[0].alt}` });
    if (args.disabled) { await expect(trigger).toBeDisabled(); return; }
    await userEvent.click(trigger);
    let dialog = await page.findByRole('dialog', { name: images[0].caption });
    await expect(within(dialog).getByRole('button', { name: 'Close image viewer' })).toHaveFocus();
    await expect(within(dialog).getByRole('button', { name: 'Previous image' })).toBeDisabled();
    dialog.focus();
    await userEvent.keyboard('{ArrowRight}');
    dialog = await page.findByRole('dialog', { name: images[1].caption });
    await expect(within(dialog).getByRole('img', { name: images[1].alt })).toBeVisible();
    await userEvent.keyboard('{End}');
    dialog = await page.findByRole('dialog', { name: images.at(-1).caption });
    await expect(within(dialog).getByRole('button', { name: 'Next image' })).toBeDisabled();
    await userEvent.keyboard('{Home}');
    if (import.meta.env.VITE_GAUDI_AUDIT) {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ canvasElement, id: id + '--viewer', beforeAuditWidth: () => {
        for (const element of dialog.querySelectorAll('header, footer, button, [data-slot="carousel-content"]')) {
          const bounds = element.getBoundingClientRect();
          expect(bounds.left).toBeGreaterThanOrEqual(0);
          expect(bounds.right).toBeLessThanOrEqual(innerWidth + 1);
          expect(bounds.bottom).toBeLessThanOrEqual(innerHeight + 1);
        }
      } });
    }
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveFocus();
    trigger.blur();
    await checkGalleryLifecycle(canvasElement);
  }
};

export const Single = {
  name: 'Single expandable image', parameters: { docs: { source: source('SingleImage') } }, render: () => <SingleImage />,
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const trigger = within(canvasElement).getByRole('button', { name: `Open image: ${images[0].alt}` });
    await userEvent.click(trigger);
    const dialog = await page.findByRole('dialog');
    await expect(within(dialog).queryByRole('button', { name: 'Next image' })).toBeNull();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Close image viewer' }));
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveFocus();
    trigger.blur();
  }
};

export const Controlled = {
  name: 'Controlled grid', parameters: { docs: { source: source('ControlledGallery') } }, render: () => <ControlledGallery />,
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const trigger = within(canvasElement).getByRole('button', { name: 'Open cool light' });
    await userEvent.click(trigger);
    const dialog = await page.findByRole('dialog', { name: images[2].caption });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Previous image' }));
    await page.findByRole('dialog', { name: images[1].caption });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveFocus();
    trigger.blur();
  }
};

export const Recovery = {
  name: 'Empty & unavailable images', parameters: { docs: { source: source('GalleryRecovery') } }, render: () => <GalleryRecovery />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('No images to display.')).toBeVisible();
    await waitFor(() => expect(canvas.getByText('Image unavailable')).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: 'Replace image' }));
    await waitFor(() => expect(canvasElement.querySelector('img')?.naturalWidth).toBeGreaterThan(0));
    await expect(canvas.queryByText('Image unavailable')).toBeNull();
  }
};
