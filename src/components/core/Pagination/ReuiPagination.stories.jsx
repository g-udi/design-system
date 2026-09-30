// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/pagination/c-pagination-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/pagination/c-pagination-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/pagination/c-pagination-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/pagination/c-pagination-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/pagination/c-pagination-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/pagination/c-pagination-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/pagination/c-pagination-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/pagination/c-pagination-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/pagination/c-pagination-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/pagination/c-pagination-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/pagination/c-pagination-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/pagination/c-pagination-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/pagination/c-pagination-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/pagination/c-pagination-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/pagination/c-pagination-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/pagination/c-pagination-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/pagination/c-pagination-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/pagination/c-pagination-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/pagination/c-pagination-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/pagination/c-pagination-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/pagination/c-pagination-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/pagination/c-pagination-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/pagination/c-pagination-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/pagination/c-pagination-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/pagination/c-pagination-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/pagination/c-pagination-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/pagination/c-pagination-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/pagination/c-pagination-14.jsx?raw';
import { Pattern as Pattern15 } from '../../../../.storybook/fixtures/reui/pagination/c-pagination-15.jsx';
import source15 from '../../../../.storybook/fixtures/reui/pagination/c-pagination-15.jsx?raw';

export default {
  title: 'Blocks/Navigation/Pagination',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='pagination'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Pagination compositions owned by Gaudi Pagination. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiPagination1 = {
  name: 'Basic pagination.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic pagination.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiPagination2 = {
  name: 'Pagination without labels.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Pagination without labels.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiPagination3 = {
  name: 'Pagination with hover effect.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Pagination with hover effect.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiPagination4 = {
  name: 'Pagination with circle buttons.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Pagination with circle buttons.' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiPagination5 = {
  name: 'Pagination with go-to-page input',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Pagination with go-to-page input' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiPagination6 = {
  name: 'Numbered pagination in card',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Numbered pagination in card' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiPagination7 = {
  name: 'Pagination with arrows buttons',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Pagination with arrows buttons' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiPagination8 = {
  name: 'Pagination with page info on center',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Pagination with page info on center' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiPagination9 = {
  name: 'Pagination with page info on left',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Pagination with page info on left' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiPagination10 = {
  name: 'Pagination with ellipsis indicator',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Pagination with ellipsis indicator' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiPagination11 = {
  name: 'Pagination with outline style buttons',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Pagination with outline style buttons' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiPagination12 = {
  name: 'Rows per page select with range info and first/prev/next/last icons',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: {
        story:
          'Rows per page select with range info and first/prev/next/last icons'
      },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiPagination13 = {
  name: 'Pagination with page select dropdown and first/last navigation',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: {
        story: 'Pagination with page select dropdown and first/last navigation'
      },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiPagination14 = {
  name: 'Numbered pagination with go-to-page input',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: { story: 'Numbered pagination with go-to-page input' },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
export const ReuiPagination15 = {
  name: 'Pagination with page info, numbered pages, ellipsis, and per-page select',
  render: () => <Pattern15 />,
  parameters: {
    docs: {
      description: {
        story:
          'Pagination with page info, numbered pages, ellipsis, and per-page select'
      },
      source: { code: publicSource(source15), language: 'jsx' }
    }
  }
};
