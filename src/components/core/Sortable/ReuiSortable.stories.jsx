import { catalogueInteractions } from '../../../../.storybook/stories/ReuiInteractions.js';
// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/sortable/c-sortable-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/sortable/c-sortable-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/sortable/c-sortable-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/sortable/c-sortable-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/sortable/c-sortable-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/sortable/c-sortable-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/sortable/c-sortable-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/sortable/c-sortable-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/sortable/c-sortable-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/sortable/c-sortable-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/sortable/c-sortable-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/sortable/c-sortable-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/sortable/c-sortable-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/sortable/c-sortable-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/sortable/c-sortable-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/sortable/c-sortable-8.jsx?raw';

export default {
  title: 'Core/Sortable',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='sortable'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Sortable compositions owned by Gaudi Sortable. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiSortable1 = {
  play: catalogueInteractions['sortable-1'],
  name: 'Sortable list of items with drag-and-drop',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Sortable list of items with drag-and-drop' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiSortable2 = {
  name: 'Sortable list of items with grid layout',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Sortable list of items with grid layout' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiSortable3 = {
  name: 'Sortable list of items with nested layout',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Sortable list of items with nested layout' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiSortable4 = {
  name: 'Sortable playlist with frame',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Sortable playlist with frame' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiSortable5 = {
  name: 'Sortable settings priority with frame',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Sortable settings priority with frame' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiSortable6 = {
  name: 'Sortable sidebar navigation with frame',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Sortable sidebar navigation with frame' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiSortable7 = {
  name: 'Sortable image gallery grid with frame',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Sortable image gallery grid with frame' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiSortable8 = {
  name: 'Sortable list persisted to a backend',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: {
        story:
          'Persist the new order with onValueCommit, optimistic updates, and Sonner rollback'
      },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
