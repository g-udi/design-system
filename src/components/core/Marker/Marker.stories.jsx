import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { Marker, MarkerContent, MarkerIcon } from './index.js';

const docs = getComponentDocs('Core/Marker');
const label = 'Read 14 files under src/billing';

export default {
  title: 'Core/Marker',
  id: 'core-marker',
  component: Marker,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { variant: ['default', 'separator', 'border'] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { variant: 'default' },
  parameters: {
    docs: {
      source: playgroundSource('Marker', {
        imports: "import { Marker, MarkerContent, MarkerIcon } from '@gaudi/design-system';\nimport { RegistryIcon } from '@gaudi/design-system/icons';",
        children: `  <MarkerIcon><RegistryIcon lucide='FileTextIcon' /></MarkerIcon>\n  <MarkerContent>${label}</MarkerContent>`
      })
    }
  },
  render: (args) => (
    <Marker {...args}>
      <MarkerIcon><RegistryIcon lucide='FileTextIcon' /></MarkerIcon>
      <MarkerContent>{label}</MarkerContent>
    </Marker>
  ),
  play: async ({ args, canvasElement }) => {
    const marker = within(canvasElement).getByText(label).closest('[data-slot="marker"]');
    await expect(marker).toHaveAttribute('data-variant', args.variant);
    await expect(marker.querySelector('[data-slot="marker-icon"]')).toHaveAttribute('aria-hidden', 'true');
  }
};
