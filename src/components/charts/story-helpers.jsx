import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../.storybook/stories/docsContract';
import { ExampleFrame } from '../../../.storybook/stories/ApplicationStoryHelpers';

/** Controls every chart shares: the frame copy, its height, the data table, the state and the locale. */
export const frameControls = {
  title: 'text',
  description: 'text',
  height: 'number',
  showData: [ 'hidden', 'toggle', 'visible' ],
  state: [ 'ready', 'loading', 'empty', 'invalid', 'error' ],
  locale: [ 'en-US', 'de-DE', 'fr-FR', 'ja-JP' ]
};

/**
 * Shared meta for a Charts owner page; spread it after the literal title, id and tags so the
 * Storybook indexer still reads them. `primary` returns the Playground story.
 */
export function chartsMeta(owner, { component, controls = {}, primary, wide = false }) {
  const docs = getComponentDocs(`Charts/${owner}`);
  return {
    component,
    argTypes: docsArgTypes(docs, { ...frameControls, ...controls }),
    parameters: {
      docs: {
        description: { component: docs.description },
        page: createComponentDocsPage(docs, { primaryStory: primary })
      }
    },
    decorators: [(Story) => <ExampleFrame wide={wide}><Story /></ExampleFrame>]
  };
}

/** Playground data for the `state` control: an empty or invalid set, or the chart's own data. */
export const stateData = (state, data) => (state === 'empty' ? [] : state === 'invalid' ? [{ label: 'Jan', value: 'n/a' }] : data);
/** The forced state for the frame: only loading and error are forced; empty and invalid come from the data. */
export const forcedState = (state) => (state === 'loading' || state === 'error' ? state : undefined);

// MARK: Play helpers

export const bars = (canvasElement) => canvasElement.querySelectorAll('.recharts-bar-rectangle');
export const pick = (canvasElement, name) => userEvent.click(within(canvasElement).getByRole('radio', { name }));
export const readout = (canvasElement) => canvasElement.querySelector('[data-slot="chart-readout"]');

/** Focus a chart's plot and jump to its first point. */
export const focusPlot = async (canvasElement, name) => {
  const plot = await within(canvasElement).findByRole('group', { name });
  plot.focus();
  await userEvent.keyboard('{Home}');

  return plot;
};

/** The named chart has mounted and is ready (not loading, empty or on the renderer fallback). */
export const ready = (canvasElement, name) => waitFor(() => expect(within(canvasElement).getByRole('group', { name }).closest('[data-slot="chart"]')).toHaveAttribute('data-state', 'ready'));

/** Walk a plot with the keyboard and check the readout names the expected points. */
export const readPoints = async (canvasElement, name, expected) => {
  const plot = await focusPlot(canvasElement, name);
  for (const [ index, text ] of expected.entries()) {
    if (index) await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(text));
  }
  plot.blur();
};
