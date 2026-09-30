// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/empty/c-empty-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/empty/c-empty-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/empty/c-empty-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/empty/c-empty-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/empty/c-empty-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/empty/c-empty-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/empty/c-empty-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/empty/c-empty-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/empty/c-empty-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/empty/c-empty-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/empty/c-empty-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/empty/c-empty-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/empty/c-empty-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/empty/c-empty-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/empty/c-empty-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/empty/c-empty-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/empty/c-empty-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/empty/c-empty-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/empty/c-empty-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/empty/c-empty-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/empty/c-empty-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/empty/c-empty-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/empty/c-empty-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/empty/c-empty-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/empty/c-empty-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/empty/c-empty-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/empty/c-empty-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/empty/c-empty-14.jsx?raw';
import { Pattern as Pattern15 } from '../../../../.storybook/fixtures/reui/empty/c-empty-15.jsx';
import source15 from '../../../../.storybook/fixtures/reui/empty/c-empty-15.jsx?raw';
import { Pattern as Pattern16 } from '../../../../.storybook/fixtures/reui/empty/c-empty-16.jsx';
import source16 from '../../../../.storybook/fixtures/reui/empty/c-empty-16.jsx?raw';
import { Pattern as Pattern17 } from '../../../../.storybook/fixtures/reui/empty/c-empty-17.jsx';
import source17 from '../../../../.storybook/fixtures/reui/empty/c-empty-17.jsx?raw';
import { Pattern as Pattern18 } from '../../../../.storybook/fixtures/reui/empty/c-empty-18.jsx';
import source18 from '../../../../.storybook/fixtures/reui/empty/c-empty-18.jsx?raw';
import { Pattern as Pattern19 } from '../../../../.storybook/fixtures/reui/empty/c-empty-19.jsx';
import source19 from '../../../../.storybook/fixtures/reui/empty/c-empty-19.jsx?raw';
import { Pattern as Pattern20 } from '../../../../.storybook/fixtures/reui/empty/c-empty-20.jsx';
import source20 from '../../../../.storybook/fixtures/reui/empty/c-empty-20.jsx?raw';

export default {
  title: 'Core/EmptyState',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='empty'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Empty compositions owned by Gaudi EmptyState. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiEmpty1 = {
  name: 'Empty: Basic empty state',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic empty state' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiEmpty2 = {
  name: 'Empty: Search empty state',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Search empty state' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiEmpty3 = {
  name: 'Empty: Empty state with search input',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Empty state with search input' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiEmpty4 = {
  name: 'Empty: Empty state with add button',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Empty state with add button' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiEmpty5 = {
  name: 'Empty: Document empty state',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Document empty state' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiEmpty6 = {
  name: 'Empty: Dashed upload empty state',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Dashed upload empty state' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiEmpty7 = {
  name: 'Empty: Inbox empty state',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Inbox empty state' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiEmpty8 = {
  name: 'Empty: Team members empty state',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Team members empty state' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiEmpty9 = {
  name: 'Empty: No notifications empty state',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'No notifications empty state' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiEmpty10 = {
  name: 'Empty: No data analytics empty state',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'No data analytics empty state' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiEmpty11 = {
  name: 'Empty: Bookmarks empty state',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Bookmarks empty state' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiEmpty12 = {
  name: 'Empty: Tasks empty state',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Tasks empty state' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiEmpty13 = {
  name: 'Empty: No automations empty state with toggle illustration',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: {
        story: 'No automations empty state with toggle illustration'
      },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiEmpty14 = {
  name: 'Empty: Comments empty state with isometric board illustration',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: {
        story: 'Comments empty state with isometric board illustration'
      },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
export const ReuiEmpty15 = {
  name: 'Empty: No products empty state with stacked cards and blur effect',
  render: () => <Pattern15 />,
  parameters: {
    docs: {
      description: {
        story: 'No products empty state with stacked cards and blur effect'
      },
      source: { code: publicSource(source15), language: 'jsx' }
    }
  }
};
export const ReuiEmpty16 = {
  name: 'Empty: Search empty state with stacked file cards illustration',
  render: () => <Pattern16 />,
  parameters: {
    docs: {
      description: {
        story: 'Search empty state with stacked file cards illustration'
      },
      source: { code: publicSource(source16), language: 'jsx' }
    }
  }
};
export const ReuiEmpty17 = {
  name: 'Empty: No messages empty state with chat bubbles illustration',
  render: () => <Pattern17 />,
  parameters: {
    docs: {
      description: {
        story: 'No messages empty state with chat bubbles illustration'
      },
      source: { code: publicSource(source17), language: 'jsx' }
    }
  }
};
export const ReuiEmpty18 = {
  name: 'Empty: No payments empty state with credit card illustration',
  render: () => <Pattern18 />,
  parameters: {
    docs: {
      description: {
        story: 'No payments empty state with credit card illustration'
      },
      source: { code: publicSource(source18), language: 'jsx' }
    }
  }
};
export const ReuiEmpty19 = {
  name: 'Empty: No integrations empty state with connected nodes illustration',
  render: () => <Pattern19 />,
  parameters: {
    docs: {
      description: {
        story: 'No integrations empty state with connected nodes illustration'
      },
      source: { code: publicSource(source19), language: 'jsx' }
    }
  }
};
export const ReuiEmpty20 = {
  name: 'Empty: No events empty state with calendar illustration',
  render: () => <Pattern20 />,
  parameters: {
    docs: {
      description: {
        story: 'No events empty state with calendar illustration'
      },
      source: { code: publicSource(source20), language: 'jsx' }
    }
  }
};
