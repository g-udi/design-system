// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/drawer/c-drawer-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/drawer/c-drawer-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/drawer/c-drawer-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/drawer/c-drawer-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/drawer/c-drawer-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/drawer/c-drawer-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/drawer/c-drawer-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/drawer/c-drawer-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/drawer/c-drawer-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/drawer/c-drawer-5.jsx?raw';

export default {
  title: 'Core/Dialog',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='drawer'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Drawer compositions owned by Gaudi Dialog. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiDrawer1 = {
  name: 'Drawer: A basic drawer with scrollable content',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'A basic drawer with scrollable content' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiDrawer2 = {
  name: 'Drawer: A drawer that opens from the right side',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'A drawer that opens from the right side' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiDrawer3 = {
  name: 'Drawer: A drawer that opens from the left side',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'A drawer that opens from the left side' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiDrawer4 = {
  name: 'Drawer: A drawer that opens from the top side',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'A drawer that opens from the top side' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiDrawer5 = {
  name: 'Drawer: Drawers opening from different sides',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Drawers opening from different sides' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
