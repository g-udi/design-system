import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';

import { ContainerCard } from './fixtures/use-element-size.jsx';
import exampleCode from './fixtures/use-element-size.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-element-size.jsx', import.meta.url));

export default {
  title: 'Hooks/Layout/useElementSize',
  id: 'hooks-layout-useelementsize',
  tags: ['autodocs'],
  ...hookMeta('useElementSize')
};

export const ContainerLayout = {
  name: 'Layout from the container width',
  parameters: example('The card stacks and shortens its button when its own container is narrow, whatever the window width. Prefer CSS container queries when only styles change.', exampleSource),
  render: () => <ContainerCard />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const measured = canvas.getByTestId('measured-container');
    const originalStyle = measured.getAttribute('style');
    try {
      Object.assign(measured.style, { width: '180px', maxWidth: 'none', boxSizing: 'content-box', borderStyle: 'solid', borderWidth: '0px' });
      await waitFor(() => expect(canvas.getByText(/^180 ×/)).toBeVisible());
      measured.style.transform = 'scale(0.8)';
      measured.style.borderWidth = '8px';
      await waitFor(() => expect(canvas.getByText(/^196 ×/)).toBeVisible());
    } finally {
      if (originalStyle === null) measured.removeAttribute('style');
      else measured.setAttribute('style', originalStyle);
    }
    await userEvent.click(canvas.getByRole('button', { name: /^(Read|Continue reading)$/ }));
    await expect(await screen.findByRole('dialog', { name: 'Designing calm interfaces' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  }
};
