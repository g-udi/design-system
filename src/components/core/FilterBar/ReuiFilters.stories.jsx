// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/filters/c-filters-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/filters/c-filters-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/filters/c-filters-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/filters/c-filters-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/filters/c-filters-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/filters/c-filters-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/filters/c-filters-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/filters/c-filters-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/filters/c-filters-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/filters/c-filters-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/filters/c-filters-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/filters/c-filters-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/filters/c-filters-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/filters/c-filters-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/filters/c-filters-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/filters/c-filters-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/filters/c-filters-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/filters/c-filters-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/filters/c-filters-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/filters/c-filters-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/filters/c-filters-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/filters/c-filters-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/filters/c-filters-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/filters/c-filters-12.jsx?raw';

export default {
  title: 'Core/FilterBar',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='filters'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Filters compositions owned by Gaudi FilterBar. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiFilters1 = {
  name: 'Filters: Everything in one filter bar',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: {
        story: 'Multi-select, nested fields, async options and stacked values.'
      },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiFilters2 = {
  name: 'Filters: Nested attributes at workspace scale',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: {
        story: 'Drill-down groups, a filterable branch and deep search.'
      },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiFilters3 = {
  name: 'Filters: Status and priority colour badges',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Colour-coded options and badges in the chip.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiFilters4 = {
  name: 'Filters: Avatars, paging and a restored view',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: {
        story: 'Avatar options, results paged over the wire and a saved view.'
      },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiFilters5 = {
  name: 'Filters: A date and a date range editor',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Consumer-owned date and date range controls.' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiFilters6 = {
  name: 'Filters: Sliders as the value editor',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: {
        story: 'One slider editor for range and single-value operators.'
      },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiFilters7 = {
  name: 'Filters: Filtering a table',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'The query tree compiled to a row predicate.' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiFilters8 = {
  name: 'Filters: Choice controls as editors',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: {
        story: 'Toggle group, radios, checkboxes, select and switch.'
      },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiFilters9 = {
  name: 'Filters: Typed values in shadcn inputs',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: {
        story: 'An input group, a term list, code slots and a validated domain.'
      },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiFilters10 = {
  name: 'Filters: Nested groups in a popover',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: {
        story: 'A data grid paged, sorted and totalled under a popover builder.'
      },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiFilters11 = {
  name: 'Filters: Nested groups inline, walked back out',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: {
        story:
          'The builder inline, beside its own tree read back as an expression.'
      },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiFilters12 = {
  name: 'Filters: Controlled, sized and translated',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: {
        story: 'One controlled query, three locales and every change reported.'
      },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
