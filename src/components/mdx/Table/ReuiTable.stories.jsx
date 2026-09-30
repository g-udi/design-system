// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/table/c-table-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/table/c-table-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/table/c-table-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/table/c-table-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/table/c-table-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/table/c-table-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/table/c-table-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/table/c-table-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/table/c-table-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/table/c-table-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/table/c-table-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/table/c-table-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/table/c-table-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/table/c-table-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/table/c-table-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/table/c-table-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/table/c-table-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/table/c-table-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/table/c-table-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/table/c-table-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/table/c-table-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/table/c-table-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/table/c-table-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/table/c-table-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/table/c-table-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/table/c-table-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/table/c-table-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/table/c-table-14.jsx?raw';
import { Pattern as Pattern15 } from '../../../../.storybook/fixtures/reui/table/c-table-15.jsx';
import source15 from '../../../../.storybook/fixtures/reui/table/c-table-15.jsx?raw';
import { Pattern as Pattern16 } from '../../../../.storybook/fixtures/reui/table/c-table-16.jsx';
import source16 from '../../../../.storybook/fixtures/reui/table/c-table-16.jsx?raw';
import { Pattern as Pattern17 } from '../../../../.storybook/fixtures/reui/table/c-table-17.jsx';
import source17 from '../../../../.storybook/fixtures/reui/table/c-table-17.jsx?raw';

export default {
  title: 'MDX/Table',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='table'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Table compositions owned by Gaudi Table. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiTable1 = {
  name: 'Basic table.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic table.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiTable2 = {
  name: 'Table with footer.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Table with footer.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiTable3 = {
  name: 'Table in card with status badges.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Table in card with status badges.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiTable4 = {
  name: 'Table card with actions column.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Table card with actions column.' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiTable5 = {
  name: 'Table with interactive elements.',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Table with interactive elements.' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiTable6 = {
  name: 'Team members table with avatars, roles, and status',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: {
        story: 'Team members table with avatars, roles, and status'
      },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiTable7 = {
  name: 'Orders table with customer info and payment status',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: {
        story: 'Orders table with customer info and payment status'
      },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiTable8 = {
  name: 'Projects table with team avatars and status',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Projects table with team avatars and status' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiTable9 = {
  name: 'Activity log table with user avatars and timestamps',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: {
        story: 'Activity log table with user avatars and timestamps'
      },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiTable10 = {
  name: 'Subscriptions table with plan badges and billing info',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: {
        story: 'Subscriptions table with plan badges and billing info'
      },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiTable11 = {
  name: 'Product inventory table with stock badges and prices',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: {
        story: 'Product inventory table with stock badges and prices'
      },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiTable12 = {
  name: 'API keys table with permission badges and actions',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: {
        story: 'API keys table with permission badges and actions'
      },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiTable13 = {
  name: 'File manager table with owners and sharing badges',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: {
        story: 'File manager table with owners and sharing badges'
      },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiTable14 = {
  name: 'Issues table with priority, assignee, and labels',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: {
        story: 'Issues table with priority, assignee, and labels'
      },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
export const ReuiTable15 = {
  name: 'Leaderboard table with rank, score, and level badges',
  render: () => <Pattern15 />,
  parameters: {
    docs: {
      description: {
        story: 'Leaderboard table with rank, score, and level badges'
      },
      source: { code: publicSource(source15), language: 'jsx' }
    }
  }
};
export const ReuiTable16 = {
  name: 'Vertical table with employee profile details',
  render: () => <Pattern16 />,
  parameters: {
    docs: {
      description: { story: 'Vertical table with employee profile details' },
      source: { code: publicSource(source16), language: 'jsx' }
    }
  }
};
export const ReuiTable17 = {
  name: 'Vertical table with server configuration details',
  render: () => <Pattern17 />,
  parameters: {
    docs: {
      description: {
        story: 'Vertical table with server configuration details'
      },
      source: { code: publicSource(source17), language: 'jsx' }
    }
  }
};
