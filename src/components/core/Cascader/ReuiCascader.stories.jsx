// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/cascader/c-cascader-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/cascader/c-cascader-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/cascader/c-cascader-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/cascader/c-cascader-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/cascader/c-cascader-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/cascader/c-cascader-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/cascader/c-cascader-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/cascader/c-cascader-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/cascader/c-cascader-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/cascader/c-cascader-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/cascader/c-cascader-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/cascader/c-cascader-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/cascader/c-cascader-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/cascader/c-cascader-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/cascader/c-cascader-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/cascader/c-cascader-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/cascader/c-cascader-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/cascader/c-cascader-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/cascader/c-cascader-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/cascader/c-cascader-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/cascader/c-cascader-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/cascader/c-cascader-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/cascader/c-cascader-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/cascader/c-cascader-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/cascader/c-cascader-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/cascader/c-cascader-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/cascader/c-cascader-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/cascader/c-cascader-14.jsx?raw';
import { Pattern as Pattern15 } from '../../../../.storybook/fixtures/reui/cascader/c-cascader-15.jsx';
import source15 from '../../../../.storybook/fixtures/reui/cascader/c-cascader-15.jsx?raw';
import { Pattern as Pattern16 } from '../../../../.storybook/fixtures/reui/cascader/c-cascader-16.jsx';
import source16 from '../../../../.storybook/fixtures/reui/cascader/c-cascader-16.jsx?raw';
import { Pattern as Pattern17 } from '../../../../.storybook/fixtures/reui/cascader/c-cascader-17.jsx';
import source17 from '../../../../.storybook/fixtures/reui/cascader/c-cascader-17.jsx?raw';
import { Pattern as Pattern18 } from '../../../../.storybook/fixtures/reui/cascader/c-cascader-18.jsx';
import source18 from '../../../../.storybook/fixtures/reui/cascader/c-cascader-18.jsx?raw';
import { Pattern as Pattern19 } from '../../../../.storybook/fixtures/reui/cascader/c-cascader-19.jsx';
import source19 from '../../../../.storybook/fixtures/reui/cascader/c-cascader-19.jsx?raw';
import { Pattern as Pattern20 } from '../../../../.storybook/fixtures/reui/cascader/c-cascader-20.jsx';
import source20 from '../../../../.storybook/fixtures/reui/cascader/c-cascader-20.jsx?raw';

export default {
  title: 'Core/Cascader',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='cascader'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Cascader compositions owned by Gaudi Cascader. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiCascader1 = {
  name: 'Nested attribute picker with drill-down navigation.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: {
        story: 'Nested attribute picker with drill-down navigation.'
      },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiCascader2 = {
  name: 'Multi-select permissions with checkboxes and a selection cap.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: {
        story: 'Multi-select permissions with checkboxes and a selection cap.'
      },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiCascader3 = {
  name: 'Deep search across every level with path-annotated results.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: {
        story: 'Deep search across every level with path-annotated results.'
      },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiCascader4 = {
  name: 'Pinned footer with a side-anchored import flyout.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: {
        story: 'Pinned footer with a side-anchored import flyout.'
      },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiCascader5 = {
  name: 'Custom rows with avatars and role badges.',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: {
        story:
          'Custom rows pairing avatars with outline role badges that color-code seniority.'
      },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiCascader6 = {
  name: 'Trigger path formatting and collapsing.',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Trigger path formatting and collapsing.' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiCascader7 = {
  name: 'Embedded panel without a popover.',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Embedded panel without a popover.' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiCascader8 = {
  name: 'Flat adjacency data with a parent pointer.',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Flat adjacency data with a parent pointer.' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiCascader9 = {
  name: 'Controlled path, value, query and open state.',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: {
        story:
          'External buttons jump the panel to a level, reset it to the root and clear the selection, with all four controlled props printed under the control.'
      },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiCascader10 = {
  name: 'Translated labels across a country picker.',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: {
        story:
          'A German country picker where every string the primitive renders comes from labels, including the live-region announcements, with each flag in an IconTile.'
      },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiCascader11 = {
  name: 'Two-line rows with descriptions and a disabled option.',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: {
        story: 'Two-line rows with descriptions and a disabled option.'
      },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiCascader12 = {
  name: 'Form field that submits like a native input.',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Form field that submits like a native input.' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiCascader13 = {
  name: 'Columns mode with independently scrolling panels.',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: {
        story:
          'A media library in Miller columns where all three panes overflow and each scrolls on its own.'
      },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiCascader14 = {
  name: 'Tree mode with inline expand and multi-select scopes.',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: {
        story: 'Tree mode with inline expand and multi-select scopes.'
      },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
export const ReuiCascader15 = {
  name: 'Async drill-down that loads before it navigates.',
  render: () => <Pattern15 />,
  parameters: {
    docs: {
      description: {
        story: 'Async drill-down that loads before it navigates.'
      },
      source: { code: publicSource(source15), language: 'jsx' }
    }
  }
};
export const ReuiCascader16 = {
  name: 'Virtualized level with thousands of rows.',
  render: () => <Pattern16 />,
  parameters: {
    docs: {
      description: {
        story:
          'Six unevenly sized regions of country markets, windowed so only the visible rows ever mount.'
      },
      source: { code: publicSource(source16), language: 'jsx' }
    }
  }
};
export const ReuiCascader17 = {
  name: 'Consumer-rendered removable chips with path-aware labels.',
  render: () => <Pattern17 />,
  parameters: {
    docs: {
      description: {
        story:
          'Chips rendered outside the primitive from useCascaderSelection, each carrying its full path so repeated column names stay distinct.'
      },
      source: { code: publicSource(source17), language: 'jsx' }
    }
  }
};
export const ReuiCascader18 = {
  name: 'Cascading tree multi-select inside a popover.',
  render: () => <Pattern18 />,
  parameters: {
    docs: {
      description: {
        story:
          "A cascading tree with indeterminate branches in a popover, bounded by the positioner's available height."
      },
      source: { code: publicSource(source18), language: 'jsx' }
    }
  }
};
export const ReuiCascader19 = {
  name: 'Status and priority colour dots via renderLabel.',
  render: () => <Pattern19 />,
  parameters: {
    docs: {
      description: {
        story: 'Status and priority colour dots via renderLabel.'
      },
      source: { code: publicSource(source19), language: 'jsx' }
    }
  }
};
export const ReuiCascader20 = {
  name: 'Expense accounts with a colour inherited down each branch.',
  render: () => <Pattern20 />,
  parameters: {
    docs: {
      description: {
        story: 'Expense accounts with a colour inherited down each branch.'
      },
      source: { code: publicSource(source20), language: 'jsx' }
    }
  }
};
