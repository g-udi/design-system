import { createRoot } from 'react-dom/client';
import { expect, spyOn, userEvent, within } from 'storybook/test';
import { act } from '../../../support/reactAct.js';
import { FlowInspector } from '../../../../src/components/core/Flow/FlowInspector.jsx';

export async function checkFlowInspectorUpdates(canvasElement) {
  const host = document.createElement('div');
  canvasElement.append(host);
  const root = createRoot(host);
  const warnings = spyOn(console, 'warn');
  const first = { value: 'first', label: 'First section', content: 'First panel' };
  const next = { value: 'next', label: 'Next section', content: 'Next panel' };
  const render = tabs => act(() => root.render(<FlowInspector open title='Changing inspector' breakpoint={0} tabs={tabs} />));
  try {
    await render([]);
    await render([first, next]);
    await expect(within(host).getByRole('tab', { name: 'First section' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(within(host).getByRole('tab', { name: 'Next section' }));
    await expect(within(host).getByRole('tabpanel')).toHaveTextContent('Next panel');
    await render([first]);
    await expect(within(host).getByRole('tabpanel')).toHaveTextContent('First panel');
    await expect(warnings.mock.calls.flat().filter(message => /uncontrolled|controlled/.test(String(message)))).toEqual([]);
  } finally {
    warnings.mockRestore();
    await act(() => root.unmount());
    host.remove();
  }
}
