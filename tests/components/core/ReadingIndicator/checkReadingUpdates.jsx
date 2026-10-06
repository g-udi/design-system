import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { expect, waitFor } from 'storybook/test';
import { act } from '../../../support/reactAct.js';
import { ReadingIndicator } from '../../../../src/components/core/ReadingIndicator/index.js';

export async function checkReadingUpdates(canvasElement) {
  const sandbox = document.createElement('div');
  const scroller = document.createElement('div');
  const content = document.createElement('div');
  const mount = document.createElement('div');
  scroller.style.cssText = 'height:100px;width:200px;overflow:auto';
  content.style.height = '500px';
  // A nested ScrollArea must not replace an explicitly supplied ordinary scroll target.
  const nested = document.createElement('div');
  nested.setAttribute('data-slot', 'scroll-area-viewport');
  nested.style.cssText = 'height:20px;overflow:auto';
  content.append(nested);
  scroller.append(content);
  sandbox.append(scroller, mount);
  canvasElement.append(sandbox);
  const targetRef = { current: scroller };
  const root = createRoot(mount);
  const render = async props => act(() => root.render(<StrictMode><ReadingIndicator position='inline' targetRef={targetRef} {...props} /></StrictMode>));
  const expectValue = async value => waitFor(() => expect(Math.abs(Number(mount.querySelector('[role="progressbar"]').getAttribute('aria-valuenow')) - value)).toBeLessThan(0.2));
  const scroll = value => { scroller.scrollTop = value; scroller.dispatchEvent(new Event('scroll')); };
  try {
    await render({});
    scroll(200);
    await expectValue(50);
    content.style.height = '900px';
    await expectValue(25);
    scroller.style.height = '300px';
    await expectValue(100 / 3);
    await render({ value: 73 });
    scroll(0);
    await expectValue(73);
    await render({});
    await expectValue(0);
    content.style.height = '50px';
    await expectValue(100);
    targetRef.current = null;
    await render({});
    await expectValue(0);
    targetRef.current = scroller;
    await render({});
    await expectValue(100);
  } finally {
    await act(() => root.unmount());
    sandbox.remove();
  }
}
