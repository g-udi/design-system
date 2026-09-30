// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-14.jsx?raw';
import { Pattern as Pattern15 } from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-15.jsx';
import source15 from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-15.jsx?raw';
import { Pattern as Pattern16 } from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-16.jsx';
import source16 from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-16.jsx?raw';
import { Pattern as Pattern17 } from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-17.jsx';
import source17 from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-17.jsx?raw';
import { Pattern as Pattern18 } from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-18.jsx';
import source18 from '../../../../.storybook/fixtures/reui/dropdown-menu/c-dropdown-menu-18.jsx?raw';

export default {
  title: 'Core/DropdownMenu',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='dropdown-menu'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Dropdown Menu compositions owned by Gaudi DropdownMenu. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiDropdownMenu1 = {
  name: 'Basic dropdown menu',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic dropdown menu' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiDropdownMenu2 = {
  name: 'Dropdown menus opening positions',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Dropdown menus opening positions' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiDropdownMenu3 = {
  name: 'Dropdown menu with icons',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Dropdown menu with icons' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiDropdownMenu4 = {
  name: 'Dropdown menu with keyboard shortcuts',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Dropdown menu with keyboard shortcuts' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiDropdownMenu5 = {
  name: 'Dropdown menu with nested submenus',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Dropdown menu with nested submenus' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiDropdownMenu6 = {
  name: 'Dropdown menu with checkboxes',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Dropdown menu with checkboxes' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiDropdownMenu7 = {
  name: 'Dropdown menu with radio groups',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Dropdown menu with radio groups' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiDropdownMenu8 = {
  name: 'Advance dropdown menu',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Advance dropdown menu' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiDropdownMenu9 = {
  name: 'User profile dropdown menu',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'User profile dropdown menu' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiDropdownMenu10 = {
  name: 'Workspace switcher dropdown menu',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Workspace switcher dropdown menu' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiDropdownMenu11 = {
  name: 'Notifications dropdown menu',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Notifications dropdown menu' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiDropdownMenu12 = {
  name: 'Actions dropdown menu',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Actions dropdown menu' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiDropdownMenu13 = {
  name: 'Share and export dropdown menu',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: { story: 'Share and export dropdown menu' },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiDropdownMenu14 = {
  name: 'User profile dropdown menu with theme toggle and status selector',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: {
        story:
          'User profile dropdown menu with theme toggle and status selector'
      },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
export const ReuiDropdownMenu15 = {
  name: 'User and create menu',
  render: () => <Pattern15 />,
  parameters: {
    docs: {
      description: { story: 'User and create menu' },
      source: { code: publicSource(source15), language: 'jsx' }
    }
  }
};
export const ReuiDropdownMenu16 = {
  name: 'Quick action menu',
  render: () => <Pattern16 />,
  parameters: {
    docs: {
      description: { story: 'Quick action menu' },
      source: { code: publicSource(source16), language: 'jsx' }
    }
  }
};
export const ReuiDropdownMenu17 = {
  name: 'Notifications dropdown with items',
  render: () => <Pattern17 />,
  parameters: {
    docs: {
      description: { story: 'Notifications dropdown with items' },
      source: { code: publicSource(source17), language: 'jsx' }
    }
  }
};
export const ReuiDropdownMenu18 = {
  name: 'AI model selector with provider icons',
  render: () => <Pattern18 />,
  parameters: {
    docs: {
      description: { story: 'AI model selector with provider icons' },
      source: { code: publicSource(source18), language: 'jsx' }
    }
  }
};
