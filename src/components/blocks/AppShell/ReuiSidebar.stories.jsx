// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/sidebar/c-sidebar-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/sidebar/c-sidebar-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/sidebar/c-sidebar-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/sidebar/c-sidebar-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/sidebar/c-sidebar-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/sidebar/c-sidebar-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/sidebar/c-sidebar-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/sidebar/c-sidebar-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/sidebar/c-sidebar-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/sidebar/c-sidebar-5.jsx?raw';

export default {
  title: 'Blocks/Navigation/Sidebar',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='sidebar'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Sidebar compositions owned by Gaudi AppShell. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiSidebar1 = {
  name: 'Sidebar: Application shell with a workspace switcher',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: {
        story:
          'Grouped navigation with count badges, row menus and a footer account menu.'
      },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiSidebar2 = {
  name: 'Sidebar: Icon rail that collapses',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: {
        story:
          'Labels give way to tooltips at 3rem, with a rail and a trigger to drive it.'
      },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiSidebar3 = {
  name: 'Sidebar: Documentation nav with sub-menus',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: {
        story:
          'A search field, sections that collapse and a sub-tree under the current page.'
      },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiSidebar4 = {
  name: 'Sidebar: Right-hand inspector panel',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: {
        story:
          'A floating off-canvas panel with row actions, linked counts and a status badge.'
      },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiSidebar5 = {
  name: 'Sidebar: Filtering, loading and empty states',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: {
        story:
          'A filter field, skeleton rows while a refresh runs, and a real empty state.'
      },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
