import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { Marker, MarkerContent, MarkerIcon } from './index.js';

const docs = getComponentDocs('Core/Marker');
// An agent run log: fixed separators name each phase; the steps follow the `variant` and `asChild` controls.
const log = [
  { phase: 'Planning' },
  { id: 'read', icon: 'FileSearchIcon', label: 'Read 14 files under src/billing' },
  { id: 'search', icon: 'SearchIcon', label: 'Searched for invoiceTotal', meta: '6 matches' },
  { phase: 'Editing' },
  { id: 'edit', icon: 'SquarePenIcon', label: 'Edited src/billing/invoice.ts', meta: '+42 −8' },
  { id: 'test', icon: 'CircleCheckIcon', label: 'Ran pnpm test', meta: '128 passed', tone: 'text-success' }
];
const steps = log.filter((entry) => entry.id);

function Step({ step, asChild, ...props }) {
  const body = (
    <>
      <MarkerIcon className={step.tone}><RegistryIcon lucide={step.icon} /></MarkerIcon>
      <MarkerContent>{step.label}</MarkerContent>
      {step.meta ? <span className='ms-auto shrink-0 text-xs tabular-nums'>{step.meta}</span> : null}
    </>
  );
  return (
    <Marker asChild={asChild} {...props}>
      {asChild ? <a href={`#step-${step.id}`}>{body}</a> : body}
    </Marker>
  );
}

export default {
  title: 'Core/Marker',
  id: 'core-marker',
  component: Marker,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { variant: ['default', 'separator', 'border'], asChild: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame className='max-w-md'><Story /></ExampleFrame>]
};

export const Playground = {
  args: { variant: 'border', asChild: false },
  parameters: {
    docs: {
      description: { story: 'An agent run log. Separators name each phase; the steps follow the controls, so `variant` restyles every step and `asChild` turns each one into a link to its trace.' },
      source: playgroundSource('Marker', {
        imports: "import { Marker, MarkerContent, MarkerIcon } from '@gaudi/design-system';\nimport { RegistryIcon } from '@gaudi/design-system/icons';",
        attributes: ['key={step.id}'],
        before: "<Marker variant='separator'>\n  <MarkerContent>Planning</MarkerContent>\n</Marker>\n{steps.map((step) => (\n",
        after: '\n))}',
        children: [
          '  <MarkerIcon><RegistryIcon lucide={step.icon} /></MarkerIcon>',
          '  <MarkerContent>{step.label}</MarkerContent>',
          "  <span className='ms-auto text-xs tabular-nums'>{step.meta}</span>"
        ].join('\n')
      })
    }
  },
  render: (args) => (
    <div className='flex flex-col gap-3'>
      {log.map((entry) => entry.phase ? (
        <Marker key={entry.phase} variant='separator'><MarkerContent>{entry.phase}</MarkerContent></Marker>
      ) : (
        <Step key={entry.id} step={entry} {...args} />
      ))}
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    for (const step of steps) {
      const marker = canvas.getByText(step.label).closest('[data-slot="marker"]');
      await expect(marker).toHaveAttribute('data-variant', args.variant);
      await expect(marker.tagName).toBe(args.asChild ? 'A' : 'DIV');
      await expect(marker.querySelector('[data-slot="marker-icon"]')).toHaveAttribute('aria-hidden', 'true');
    }
    await expect(canvas.getByText('Planning').closest('[data-slot="marker"]')).toHaveAttribute('data-variant', 'separator');
  }
};
