import Card from '../../components/core/Card';
import { example, hookMeta, Readout, Value } from '../story-helpers.jsx';
import { useMediaQuery } from './use-media-query.js';

export default {
  title: 'Hooks/Environment/useMediaQuery',
  id: 'hooks-environment-usemediaquery',
  tags: ['autodocs'],
  ...hookMeta('useMediaQuery')
};

function Breakpoints() {
  const sm = useMediaQuery('(min-width: 640px)');
  const md = useMediaQuery('(min-width: 768px)');
  const lg = useMediaQuery('(min-width: 1024px)');
  const hover = useMediaQuery('(hover: hover)');
  const contrast = useMediaQuery('(prefers-contrast: more)');
  return (
    <dl className='grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm'>
      {[ [ 'min-width: 640px', sm ], [ 'min-width: 768px', md ], [ 'min-width: 1024px', lg ], [ 'hover: hover', hover ], [ 'prefers-contrast: more', contrast ] ].map(([ query, matches ]) => (
        <div key={query} className='contents'>
          <dt className='font-mono text-xs text-text-muted'>({query})</dt>
          <dd><Value>{matches}</Value></dd>
        </div>
      ))}
    </dl>
  );
}

export const Queries = {
  name: 'Live queries',
  parameters: example('Each value follows its query; resize the window or change a system setting to see it update.', `
import { useMediaQuery } from '@gaudi/design-system/hooks';

const wide = useMediaQuery('(min-width: 1024px)');
const canHover = useMediaQuery('(hover: hover)');
const moreContrast = useMediaQuery('(prefers-contrast: more)');`),
  render: () => <Breakpoints />
};

function SplitOrStack() {
  const wide = useMediaQuery('(min-width: 768px)', true);
  return (
    <div className='grid gap-3'>
      <Readout label='Layout'>{wide ? 'Two panes side by side' : 'One pane at a time'}</Readout>
      {wide ? (
        <div className='grid grid-cols-[10rem_1fr] gap-3'>
          <Card variant='outline' padding='sm' title='Inbox' titleLevel={4}>12 conversations</Card>
          <Card variant='outline' padding='sm' title='Amira Haddad' titleLevel={4}>Thanks for the review notes.</Card>
        </div>
      ) : (
        <Card variant='outline' padding='sm' title='Inbox' titleLevel={4}>12 conversations. Open one to read it.</Card>
      )}
    </div>
  );
}

export const DifferentTree = {
  name: 'Render a different tree',
  parameters: example('When the layout itself changes (two panes or one), branch on the query. The fallback (`true` here) is what the server renders, so pick the layout most readers get.', `
const wide = useMediaQuery('(min-width: 768px)', true);

return wide ? <SplitView list={list} detail={detail} /> : <StackView list={list} />;`),
  render: () => <SplitOrStack />
};
