import { createRoot } from 'react-dom/client';
import { expect, waitFor, within } from 'storybook/test';
import { PlaygroundDemo } from '../../../../src/components/core/Slider/stories/fixtures/NativeExamples.jsx';

export async function checkSliderControlUpdates(canvasElement) {
  const host = canvasElement.ownerDocument.createElement('div');
  canvasElement.append(host);
  const root = createRoot(host);
  try {
    for (const value of [50, 65, 50]) {
      root.render(<PlaygroundDemo defaultValue={[value]} />);
      await waitFor(() => {
        const slider = within(host).getByRole('slider', { name: 'Volume', exact: true });
        expect(slider).toHaveAttribute('aria-valuenow', String(value));
        const field = slider.closest('[data-slot="slider"]').parentElement;
        expect(within(field).getByRole('status')).toHaveTextContent(String(value));
      });
    }
  } finally {
    root.unmount();
    host.remove();
  }
}
