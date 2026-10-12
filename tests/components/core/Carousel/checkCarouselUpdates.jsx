import { createRoot } from 'react-dom/client';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { act } from '../../../support/reactAct.js';
import Carousel from '../../../../src/components/core/Carousel/Carousel.jsx';

export async function checkCarouselUpdates(canvasElement) {
  const host = document.createElement('div');
  canvasElement.append(host);
  const root = createRoot(host);
  const first = { id: 'first', title: 'First card', content: 'Original content' };
  const second = { id: 'second', title: 'Second card', content: 'Second content' };
  const render = items => act(() => root.render(<Carousel ariaLabel='Changing collection' variant='rail' size='sm' items={items} />));
  try {
    await render([first, second]);
    await userEvent.click(within(host).getByRole('button', { name: 'Open First card' }));
    await screen.findByRole('dialog', { name: 'First card' });
    await render([{ ...first, title: 'Updated card', content: 'Updated content' }, second]);
    const dialog = await screen.findByRole('dialog', { name: 'Updated card' });
    await expect(within(dialog).getByText('Updated content')).toBeVisible();
    await expect(within(dialog).queryByText('Original content')).not.toBeInTheDocument();

    await render([second]);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(within(host).getByRole('region', { name: 'Changing collection' })).toHaveFocus());
    await render([first, second]);
    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  } finally {
    await act(() => root.unmount());
    host.remove();
  }
}
