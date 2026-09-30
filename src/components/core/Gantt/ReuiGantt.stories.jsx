// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/gantt/c-gantt-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/gantt/c-gantt-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/gantt/c-gantt-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/gantt/c-gantt-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/gantt/c-gantt-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/gantt/c-gantt-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/gantt/c-gantt-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/gantt/c-gantt-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/gantt/c-gantt-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/gantt/c-gantt-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/gantt/c-gantt-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/gantt/c-gantt-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/gantt/c-gantt-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/gantt/c-gantt-7.jsx?raw';

export default {
  title: 'Core/Gantt',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='gantt'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Gantt compositions owned by Gaudi Gantt. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiGantt1 = {
  name: 'Gantt chart with settings menu and schedulable rows',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: {
        story: 'Gantt chart with settings menu and schedulable rows'
      },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiGantt2 = {
  name: 'Gantt chart with drag-to-reorder tree rows',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Gantt chart with drag-to-reorder tree rows' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiGantt3 = {
  name: 'Gantt chart with quarter roadmap and rollups',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Gantt chart with quarter roadmap and rollups' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiGantt4 = {
  name: 'Gantt chart with weekly capacity board',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Gantt chart with weekly capacity board' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiGantt5 = {
  name: 'Gantt chart with task table and progress',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Gantt chart with task table and progress' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiGantt6 = {
  name: 'Gantt chart with as-built baseline tracking',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Gantt chart with as-built baseline tracking' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiGantt7 = {
  name: 'Gantt chart with dependency arrows and milestones',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: {
        story: 'Gantt chart with dependency arrows and milestones'
      },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
