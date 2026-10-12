import { createRoot } from 'react-dom/client';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { act } from '../../../support/reactAct.js';
import { Flow, FlowControls } from '@gaudi/design-system/core/Flow';

export async function checkFlowLayoutLifecycle(canvasElement) {
  const host = document.createElement('div');
  canvasElement.append(host);
  const root = createRoot(host);
  try {
    await act(() => root.render(<Flow nodes={[]} edges={[]} controls={false} style={{ height: 180 }}><FlowControls onAutoLayout={() => []} /></Flow>));
    const button = await within(host).findByRole('button', { name: 'Auto layout' });
    const canvas = button.closest('.ds-flow');
    await userEvent.click(button);
    expect(canvas).toHaveAttribute('data-layout-animating');
    await new Promise(resolve => setTimeout(resolve, 220));
    await userEvent.click(button);
    await new Promise(resolve => setTimeout(resolve, 180));
    // An earlier click must not clear the latest transition prematurely.
    expect(canvas).toHaveAttribute('data-layout-animating');
    await waitFor(() => expect(canvas).not.toHaveAttribute('data-layout-animating'));
    await userEvent.click(button);
    expect(canvas).toHaveAttribute('data-layout-animating');
    await act(() => root.render(null));
    expect(canvas).not.toHaveAttribute('data-layout-animating');
    await act(() => root.render(<>
      <Flow label='First flow' nodes={[]} edges={[]} controls={false} style={{ height: 180 }} />
      <Flow label='Second flow' nodes={[]} edges={[]} controls={false} style={{ height: 180 }} />
      <Flow id='consumer-flow' label='Named flow' nodes={[]} edges={[]} controls={false} style={{ height: 180 }} />
    </>));
    await waitFor(() => expect(host.querySelectorAll('.react-flow__background pattern')).toHaveLength(3));
    const patterns = [...host.querySelectorAll('.react-flow__background pattern')];
    expect(new Set(patterns.map(pattern => pattern.id)).size).toBe(3);
    const liveRegions = [...host.querySelectorAll('[id^="react-flow__aria-live-"]')];
    expect(liveRegions).toHaveLength(3);
    expect(new Set(liveRegions.map(region => region.id)).size).toBe(3);
    for (const pattern of patterns) {
      expect(pattern.closest('svg').querySelector('rect')).toHaveAttribute('fill', `url(#${pattern.id})`);
    }
    expect(host.querySelector('#consumer-flow')).toBeInTheDocument();
    expect(patterns.some(pattern => pattern.id.endsWith('consumer-flow'))).toBe(true);
  } finally {
    await act(() => root.unmount());
    host.remove();
  }
}
