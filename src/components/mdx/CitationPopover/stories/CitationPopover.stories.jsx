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
  play: async ({ canvasElement }) => {
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
  }
};
