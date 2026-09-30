// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/item/c-item-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/item/c-item-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/item/c-item-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/item/c-item-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/item/c-item-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/item/c-item-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/item/c-item-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/item/c-item-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/item/c-item-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/item/c-item-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/item/c-item-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/item/c-item-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/item/c-item-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/item/c-item-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/item/c-item-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/item/c-item-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/item/c-item-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/item/c-item-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/item/c-item-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/item/c-item-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/item/c-item-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/item/c-item-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/item/c-item-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/item/c-item-12.jsx?raw';

export default {
  title: 'Blocks/ResourceList',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='item'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Item compositions owned by Gaudi ResourceList. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiItem1 = {
  name: 'Item: Basic item with title and description',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic item with title and description' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiItem2 = {
  name: 'Item: Items with icon media and action buttons',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Items with icon media and action buttons' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiItem3 = {
  name: 'Item: User item with avatar, info, and follow button',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'User item with avatar, info, and follow button' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiItem4 = {
  name: 'Item: Clickable navigation items with icons and chevron',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: {
        story: 'Clickable navigation items with icons and chevron'
      },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiItem5 = {
  name: 'Item: Item group with status badges',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Item group with status badges' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiItem6 = {
  name: 'Item: File items with icon media, size, and actions',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'File items with icon media, size, and actions' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiItem7 = {
  name: 'Item: Items with keyboard shortcuts',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Items with keyboard shortcuts' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiItem8 = {
  name: 'Item: Small-size items with badges',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Small-size items with badges' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiItem9 = {
  name: 'Item: Team members with roles and multiple actions',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Team members with roles and multiple actions' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiItem10 = {
  name: 'Item: Item with header and footer sections',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Item with header and footer sections' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiItem11 = {
  name: 'Item: Integration items with connect actions',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Integration items with connect actions' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiItem12 = {
  name: 'Item: Activity feed items with avatars and actions',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Activity feed items with avatars and actions' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
