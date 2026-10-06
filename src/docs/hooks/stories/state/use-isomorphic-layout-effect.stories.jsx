import { example, hookMeta } from '../../HookDocs.jsx';

import { Excerpt } from './fixtures/use-isomorphic-layout-effect.jsx';
import exampleCode from './fixtures/use-isomorphic-layout-effect.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-isomorphic-layout-effect.jsx', import.meta.url));

export default {
  title: 'Hooks/State/useIsomorphicLayoutEffect',
  id: 'hooks-state-useisomorphiclayouteffect',
  tags: ['autodocs'],
  ...hookMeta('useIsomorphicLayoutEffect')
};

export const MeasureBeforePaint = {
  name: 'Measure before paint',
  parameters: example('The excerpt checks whether it overflows before the browser paints, so "Read more" appears only when needed and without a flash. On the server it falls back to useEffect.', exampleSource),
  render: () => <Excerpt />
};
