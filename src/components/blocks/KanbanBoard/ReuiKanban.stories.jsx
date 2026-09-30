// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/kanban/c-kanban-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/kanban/c-kanban-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/kanban/c-kanban-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/kanban/c-kanban-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/kanban/c-kanban-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/kanban/c-kanban-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/kanban/c-kanban-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/kanban/c-kanban-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/kanban/c-kanban-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/kanban/c-kanban-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/kanban/c-kanban-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/kanban/c-kanban-6.jsx?raw';

export default {
  title: 'Blocks/KanbanBoard',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='kanban'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Kanban compositions owned by Gaudi KanbanBoard. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiKanban1 = {
  name: 'Kanban: Kanban board with placeholder overlay',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Kanban board with placeholder overlay' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiKanban2 = {
  name: 'Kanban: Kanban board with dynamic overlay',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Kanban board with dynamic overlay' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiKanban3 = {
  name: 'Kanban: Kanban board with frame columns',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Kanban board with frame columns' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiKanban4 = {
  name: 'Kanban: Minimal kanban with stacked frame',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Minimal kanban with stacked frame' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiKanban5 = {
  name: 'Kanban: Feature roadmap kanban with progress',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Feature roadmap kanban with progress' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiKanban6 = {
  name: 'Kanban: Kanban board persisted to a backend',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: {
        story:
          'Persist moves with onValueCommit, optimistic updates, and Sonner rollback'
      },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
