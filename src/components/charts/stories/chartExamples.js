import { publicSource } from '../../../docs/components/PatternStoryHelpers.jsx';

/** Playground data for the `state` control: an empty or invalid set, or the chart's own data. */
export const stateData = (state, data) => (state === 'empty' ? [] : state === 'invalid' ? [{ label: 'Jan', value: 'n/a' }] : data);
/** The forced state for the frame: loading, errors and invalid data are explicit; an empty data set remains empty. */
export const forcedState = (state) => (state === 'loading' || state === 'error' || state === 'invalid' ? state : undefined);

/** Copy the actual examples, including their state-control helpers, through public imports. */
export function chartExampleSource(source, origin) {
  const helpers = { stateData, forcedState };
  const selfContained = source.replace(/import\s*\{([^}]+)\}\s*from\s*['"][^'"]*chartExamples\.js['"];?/g, (_, names) =>
    names.split(',').map((name) => name.trim()).map((name) => `const ${name} = ${helpers[name].toString()};`).join('\n')
  );
  return publicSource(selfContained, origin);
}
