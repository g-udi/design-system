import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { CitationExample } from './fixtures/CitationExample.jsx';
import exampleSource from './fixtures/CitationExample.jsx?raw';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import styles from '../../MdxContent/MdxContent.module.css';
import CitationPopover from '../CitationPopover';

const docs = getComponentDocs('MDX/Citation');
export default {
  title: 'MDX/Citation',
  id: 'mdx-citation',
  component: CitationPopover,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><article className={styles.root}><Story /></article></ExampleFrame>]
};

export const Playground = {
  parameters: { docs: { source: { code: publicSource(exampleSource, new URL('./fixtures/CitationExample.jsx', import.meta.url)), language: 'jsx' }, description: { story: 'A paragraph with a single citation and a grouped one, above the generated reference list. Hover or focus a marker to read the source; select a source in the group to jump to it and reveal its back-link.' } } },
  render: () => <CitationExample />,
  play: async (context) => {
    const { canvasElement, id } = context;
    const canvas = within(canvasElement);
    const popover = () => within(screen.getByRole('dialog', { name: 'Citation details' }));
    const single = canvas.getByRole('link', { name: 'Reference 1' });
    const group = canvas.getByRole('link', { name: 'References 1, 2, 3' });

    await expect(single).toHaveAttribute('href', '#citation-HusseinYC18');
    single.focus();
    await waitFor(() => expect(popover().getByText(/Representation learning for heterogeneous information networks/)).toBeVisible());
    await userEvent.hover(single);
    await userEvent.unhover(single);
    await new Promise((resolve) => setTimeout(resolve, 350));
    await expect(screen.getByRole('dialog', { name: 'Citation details' })).toBeVisible();
    group.focus();
    await waitFor(() => expect(popover().getByRole('link', { name: /2 Wang et al\. \(2019\)/ })).toBeVisible());
    await userEvent.hover(single);
    await waitFor(() => expect(popover().getByText(/Representation learning for heterogeneous information networks/)).toBeVisible());

    await userEvent.hover(group);
    const wang = await waitFor(() => popover().getByRole('link', { name: /2 Wang et al\. \(2019\)/ }));
    wang.focus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Citation details' })).not.toBeInTheDocument());
    await expect(group).toHaveFocus();
    await userEvent.hover(group);
    await waitFor(() => expect(popover().getByRole('link', { name: /2 Wang et al\. \(2019\)/ })).toBeVisible());
    await userEvent.click(popover().getByRole('link', { name: /2 Wang et al\. \(2019\)/ }));

    const backLink = canvas.getByText(/Wang et al\. \(2019\)/).closest('li').querySelector('.citation-back-link');
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveFocus();
    await expect(backLink).toHaveAttribute('href', '#cite-ref-2');
    await expect(group).toHaveAttribute('data-citation-popover-bound', 'true');
    // Revisiting a source before the return timer fires must keep the back-link visible.
    backLink.addEventListener('click', (event) => event.preventDefault(), { once: true });
    backLink.click();
    group.addEventListener('click', (event) => event.preventDefault(), { once: true });
    group.click();
    await new Promise((resolve) => setTimeout(resolve, 150));
    await expect(backLink).toBeVisible();

    // Simulate a second article handler unmounting before its return timer fires.
    const host = document.createElement('div');
    const markup = document.createElement('div');
    document.body.append(host, markup);
    const root = createRoot(host);
    let mounted = true;
    try {
      flushSync(() => root.render(<CitationPopover />));
      const oldLink = document.createElement('a');
      oldLink.className = 'citation-back-link';
      oldLink.dataset.citationKey = 'navigation-regression';
      oldLink.textContent = 'Old article';
      markup.append(oldLink);
      oldLink.click();
      root.unmount();
      mounted = false;
      const nextLink = oldLink.cloneNode(true);
      nextLink.textContent = 'New article';
      oldLink.replaceWith(nextLink);
      await new Promise((resolve) => setTimeout(resolve, 150));
      await expect(nextLink).toBeVisible();
    } finally {
      if (mounted) root.unmount();
      host.remove();
      markup.remove();
    }
    group.focus();
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Citation details' })).toBeVisible());
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ canvasElement, id: `${id}--open` });
    }
    await userEvent.keyboard('{Escape}');
  }
};
