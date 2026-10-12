import { createRoot } from 'react-dom/client';
import { expect, waitFor } from 'storybook/test';
import { act } from '../../../support/reactAct.js';
import { Cascader, CascaderContent, CascaderPanel, CascaderTrigger } from '../../../../src/components/core/Cascader/index.js';

export async function checkCascaderRefs(canvasElement) {
  const host = document.createElement('div');
  canvasElement.append(host);
  const root = createRoot(host);
  const calls = { trigger: [], content: [] };
  const refs = Object.fromEntries(Object.keys(calls).map(key => [key, node => {
    calls[key].push(node ? 'attach' : 'null');
    return () => calls[key].push('cleanup');
  }]));
  const render = label => act(() => root.render(
    <Cascader items={[]} open>
      <CascaderTrigger aria-label='Ref lifecycle' ref={refs.trigger}>{label}</CascaderTrigger>
      <CascaderContent ref={refs.content}><CascaderPanel>Empty choices</CascaderPanel></CascaderContent>
    </Cascader>
  ));
  try {
    await render('First render');
    await waitFor(() => expect(calls.content).toEqual(['attach']));
    await render('Updated render');
    expect(calls.trigger).toEqual(['attach']);
    expect(calls.content).toEqual(['attach']);
    await act(() => root.render(null));
    expect(calls.trigger).toEqual(['attach', 'cleanup']);
    expect(calls.content).toEqual(['attach', 'cleanup']);
  } finally {
    await act(() => root.unmount());
    host.remove();
  }
}
