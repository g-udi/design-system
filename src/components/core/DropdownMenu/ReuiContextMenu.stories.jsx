// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/context-menu/c-context-menu-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/context-menu/c-context-menu-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/context-menu/c-context-menu-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/context-menu/c-context-menu-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/context-menu/c-context-menu-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/context-menu/c-context-menu-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/context-menu/c-context-menu-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/context-menu/c-context-menu-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/context-menu/c-context-menu-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/context-menu/c-context-menu-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/context-menu/c-context-menu-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/context-menu/c-context-menu-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/context-menu/c-context-menu-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/context-menu/c-context-menu-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/context-menu/c-context-menu-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/context-menu/c-context-menu-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/context-menu/c-context-menu-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/context-menu/c-context-menu-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/context-menu/c-context-menu-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/context-menu/c-context-menu-10.jsx?raw';

export default {
  title: 'Core/DropdownMenu',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='context-menu'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Context Menu compositions owned by Gaudi DropdownMenu. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiContextMenu1 = {
  name: 'Context Menu: Basic context menu.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic context menu.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiContextMenu2 = {
  name: 'Context Menu: Context menu with icons for common actions.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Context menu with icons for common actions.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiContextMenu3 = {
  name: 'Context Menu: Context menu with keyboard shortcuts.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Context menu with keyboard shortcuts.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiContextMenu4 = {
  name: 'Context Menu: Context menu with nested submenus.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Context menu with nested submenus.' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiContextMenu5 = {
  name: 'Context Menu: Context menu labels and separators.',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Context menu labels and separators.' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiContextMenu6 = {
  name: 'Context Menu: Context menu with checkbox items.',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Context menu with checkbox items.' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiContextMenu7 = {
  name: 'Context Menu: Context menu with radio items.',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Context menu with radio items.' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiContextMenu8 = {
  name: 'Context Menu: Context menu with destructive actions.',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Context menu with destructive actions.' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiContextMenu9 = {
  name: 'Context Menu: Context menu with different alignment sides.',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Context menu with different alignment sides.' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiContextMenu10 = {
  name: 'Context Menu: Context menu used inside a dialog component.',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Context menu used inside a dialog component.' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
