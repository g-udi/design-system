import { createComponentDocsPage, getComponentDocs } from '../../.storybook/stories/ComponentDocs';
import { ExampleFrame } from '../../.storybook/stories/ApplicationStoryHelpers';
import { getHook, hookTitle } from './catalogue.js';

/**
 * Shared meta for a Hooks/<Group>/<hook> page; spread it after the literal title, id and tags so the
 * Storybook indexer still reads them. The docs page shows the first story as the live preview,
 * then usage, accessibility, API notes, the API table (parameters, then returns) and every example.
 */
export function hookMeta(name) {
  const hook = getHook(name);
  const docs = getComponentDocs(hookTitle(hook));
  return {
    parameters: {
      controls: { disable: true },
      docs: {
        description: { component: docs.description },
        page: createComponentDocsPage(docs)
      }
    },
    decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
  };
}

/** Story parameters: a description and the copyable source shown under the example. */
export const example = (description, code) => ({
  docs: {
    description: { story: description },
    source: { language: 'jsx', code: code.trim() }
  }
});

/** A muted line that reads a value out, with a polite status for changes that matter. */
export function Readout({ label, children, live = false }) {
  return (
    <p className='text-sm text-text-muted' {...(live ? { role: 'status', 'aria-live': 'polite' } : {})}>
      {label ? <span className='font-medium text-text'>{label}: </span> : null}
      {children}
    </p>
  );
}

/** A visible "code value" chip for readouts. */
export const Value = ({ children }) => <code className='rounded-(--ds-radius-control) bg-surface-muted px-1.5 py-0.5 font-mono text-xs text-text'>{String(children)}</code>;
