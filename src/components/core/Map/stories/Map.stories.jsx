import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Map } from '../index.js';
import { TrackingMap, LocationMap, MapRecovery } from './fixtures/MapExamples.jsx';
import examplesRaw from './fixtures/MapExamples.jsx?raw';
import routesRaw from './fixtures/routes.js?raw';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { checkMapLifecycle, checkTrackingMapDensity } from '../../../../../tests/components/core/Map/checkMapLifecycle.jsx';

const docs = getComponentDocs('Core/Map');
const imports = publicSource(examplesRaw.replace("import { journeys } from './routes.js';", routesRaw), new URL('./fixtures/MapExamples.jsx', import.meta.url));
const source = name => playgroundSource(name, { imports });
const ready = async canvas => waitFor(() => expect(canvas.querySelector('.ds-map')).toHaveAttribute('data-map-status', 'ready'), { timeout: 20000 });

export default {
  title: 'Core/Map', id: 'core-map', component: Map, tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { label: 'text', controls: 'boolean', interactive: 'boolean', scrollZoom: 'boolean' }),
  parameters: { layoutAudit: { readySelector: '.ds-map[data-map-status="ready"]' }, docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};

export const Playground = {
  args: { label: 'New York fleet map', controls: true, interactive: true, scrollZoom: false },
  render: args => <TrackingMap {...args} />,
  parameters: { docs: { source: source('TrackingMap') }, controlAudit: { interaction: ['scrollZoom', 'interactive'] } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await ready(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Select TRK-104, Sofia Chen' }));
    await expect(canvas.getByRole('button', { name: 'TRK-104: On route, Sofia Chen' })).toHaveAttribute('aria-pressed', 'true');
    const selected = canvas.getByRole('button', { name: 'TRK-104: On route, Sofia Chen' });
    selected.focus();
    await userEvent.keyboard('{Enter}');
    await expect(selected).toHaveFocus();
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search vehicles' }), 'unknown');
    await expect(canvas.getByText('No vehicles match. Try another name or status.')).toBeVisible();
    await userEvent.clear(canvas.getByRole('searchbox', { name: 'Search vehicles' }));
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Filter vehicles by status' }), 'Delayed');
    await expect(canvas.queryByRole('button', { name: 'Select TRK-104, Sofia Chen' })).toBeNull();
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Filter vehicles by status' }), 'All statuses');
    if (args.interactive && args.controls) {
      const before = Number(canvas.getByLabelText('Map zoom').textContent);
      await userEvent.click(canvas.getByRole('button', { name: 'Zoom in' }));
      await waitFor(() => expect(Number(canvas.getByLabelText('Map zoom').textContent)).toBeGreaterThan(before));
      await userEvent.click(canvas.getByRole('button', { name: 'Reset map view' }));
      await waitFor(() => expect(canvas.getByLabelText('Map zoom')).toHaveTextContent('12.3'));
    }
    await userEvent.click(canvas.getByRole('button', { name: 'Select TRK-208, Ethan Brooks' }));
    await expect(canvas.getByRole('button', { name: 'TRK-208: Delayed, Ethan Brooks, 25 minutes delayed' })).toHaveAttribute('aria-pressed', 'true');
    canvasElement.ownerDocument.activeElement?.blur();
    if (import.meta.env.VITE_GAUDI_AUDIT && args.controls && args.interactive) await checkTrackingMapDensity(canvasElement);
  }
};

export const Location = {
  name: 'Single location', render: () => <LocationMap />,
  parameters: { docs: { source: source('LocationMap') } },
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    const canvas = within(canvasElement);
    const marker = await canvas.findByRole('button', { name: 'Bryant Park meeting point' });
    marker.focus();
    await userEvent.keyboard(' ');
    await expect(canvas.getByText('Meet at the Sixth Avenue entrance.')).toBeVisible();
    await expect(marker).toHaveFocus();
    marker.blur();
    await checkMapLifecycle(canvasElement);
  }
};

export const Recovery = {
  name: 'Unavailable map & recovery', render: () => <MapRecovery />,
  parameters: { docs: { source: source('MapRecovery') } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Map unavailable. Try again or use the location list.', {}, { timeout: 20000 });
    await userEvent.click(canvas.getByRole('button', { name: 'Use available map' }));
    await ready(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Zoom in' })).toBeVisible();
  }
};
