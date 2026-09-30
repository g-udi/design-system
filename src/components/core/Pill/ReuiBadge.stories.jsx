// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/badge/c-badge-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/badge/c-badge-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/badge/c-badge-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/badge/c-badge-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/badge/c-badge-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/badge/c-badge-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/badge/c-badge-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/badge/c-badge-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/badge/c-badge-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/badge/c-badge-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/badge/c-badge-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/badge/c-badge-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/badge/c-badge-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/badge/c-badge-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/badge/c-badge-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/badge/c-badge-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/badge/c-badge-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/badge/c-badge-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/badge/c-badge-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/badge/c-badge-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/badge/c-badge-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/badge/c-badge-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/badge/c-badge-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/badge/c-badge-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/badge/c-badge-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/badge/c-badge-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/badge/c-badge-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/badge/c-badge-14.jsx?raw';
import { Pattern as Pattern15 } from '../../../../.storybook/fixtures/reui/badge/c-badge-15.jsx';
import source15 from '../../../../.storybook/fixtures/reui/badge/c-badge-15.jsx?raw';
import { Pattern as Pattern16 } from '../../../../.storybook/fixtures/reui/badge/c-badge-16.jsx';
import source16 from '../../../../.storybook/fixtures/reui/badge/c-badge-16.jsx?raw';
import { Pattern as Pattern17 } from '../../../../.storybook/fixtures/reui/badge/c-badge-17.jsx';
import source17 from '../../../../.storybook/fixtures/reui/badge/c-badge-17.jsx?raw';
import { Pattern as Pattern18 } from '../../../../.storybook/fixtures/reui/badge/c-badge-18.jsx';
import source18 from '../../../../.storybook/fixtures/reui/badge/c-badge-18.jsx?raw';
import { Pattern as Pattern19 } from '../../../../.storybook/fixtures/reui/badge/c-badge-19.jsx';
import source19 from '../../../../.storybook/fixtures/reui/badge/c-badge-19.jsx?raw';
import { Pattern as Pattern20 } from '../../../../.storybook/fixtures/reui/badge/c-badge-20.jsx';
import source20 from '../../../../.storybook/fixtures/reui/badge/c-badge-20.jsx?raw';
import { Pattern as Pattern21 } from '../../../../.storybook/fixtures/reui/badge/c-badge-21.jsx';
import source21 from '../../../../.storybook/fixtures/reui/badge/c-badge-21.jsx?raw';
import { Pattern as Pattern22 } from '../../../../.storybook/fixtures/reui/badge/c-badge-22.jsx';
import source22 from '../../../../.storybook/fixtures/reui/badge/c-badge-22.jsx?raw';
import { Pattern as Pattern23 } from '../../../../.storybook/fixtures/reui/badge/c-badge-23.jsx';
import source23 from '../../../../.storybook/fixtures/reui/badge/c-badge-23.jsx?raw';
import { Pattern as Pattern24 } from '../../../../.storybook/fixtures/reui/badge/c-badge-24.jsx';
import source24 from '../../../../.storybook/fixtures/reui/badge/c-badge-24.jsx?raw';
import { Pattern as Pattern25 } from '../../../../.storybook/fixtures/reui/badge/c-badge-25.jsx';
import source25 from '../../../../.storybook/fixtures/reui/badge/c-badge-25.jsx?raw';

export default {
  title: 'Core/Pill',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='badge'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Badge compositions owned by Gaudi Pill. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiBadge1 = {
  name: 'Badge: Default badge',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Default badge' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiBadge2 = {
  name: 'Badge: Secondary badge',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Secondary badge' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiBadge3 = {
  name: 'Badge: Destructive badge',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Destructive badge' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiBadge4 = {
  name: 'Badge: Success badge',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Success badge' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiBadge5 = {
  name: 'Badge: Info badge',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Info badge' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiBadge6 = {
  name: 'Badge: Warning badge',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Warning badge' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiBadge7 = {
  name: 'Badge: Outline badge',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Outline badge' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiBadge8 = {
  name: 'Badge: Primary outline badge',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Primary outline badge' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiBadge9 = {
  name: 'Badge: Destructive outline badge',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Destructive outline badge' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiBadge10 = {
  name: 'Badge: Info outline badge',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Info outline badge' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiBadge11 = {
  name: 'Badge: Success outline badge',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Success outline badge' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiBadge12 = {
  name: 'Badge: Warning outline badge',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Warning outline badge' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiBadge13 = {
  name: 'Badge: Primary light badge',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: { story: 'Primary light badge' },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiBadge14 = {
  name: 'Badge: Destructive light badge',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: { story: 'Destructive light badge' },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
export const ReuiBadge15 = {
  name: 'Badge: Success light badge',
  render: () => <Pattern15 />,
  parameters: {
    docs: {
      description: { story: 'Success light badge' },
      source: { code: publicSource(source15), language: 'jsx' }
    }
  }
};
export const ReuiBadge16 = {
  name: 'Badge: Info light badge',
  render: () => <Pattern16 />,
  parameters: {
    docs: {
      description: { story: 'Info light badge' },
      source: { code: publicSource(source16), language: 'jsx' }
    }
  }
};
export const ReuiBadge17 = {
  name: 'Badge: Warning light badge',
  render: () => <Pattern17 />,
  parameters: {
    docs: {
      description: { story: 'Warning light badge' },
      source: { code: publicSource(source17), language: 'jsx' }
    }
  }
};
export const ReuiBadge18 = {
  name: 'Badge: Badge size variations',
  render: () => <Pattern18 />,
  parameters: {
    docs: {
      description: { story: 'Badge size variations' },
      source: { code: publicSource(source18), language: 'jsx' }
    }
  }
};
export const ReuiBadge19 = {
  name: 'Badge: Badge with full radius (radius="full")',
  render: () => <Pattern19 />,
  parameters: {
    docs: {
      description: { story: 'Badge with full radius (radius="full")' },
      source: { code: publicSource(source19), language: 'jsx' }
    }
  }
};
export const ReuiBadge20 = {
  name: 'Badge: Badge with an icon',
  render: () => <Pattern20 />,
  parameters: {
    docs: {
      description: { story: 'Badge with an icon' },
      source: { code: publicSource(source20), language: 'jsx' }
    }
  }
};
export const ReuiBadge21 = {
  name: 'Badge: Badge with a dismiss button',
  render: () => <Pattern21 />,
  parameters: {
    docs: {
      description: { story: 'Badge with a dismiss button' },
      source: { code: publicSource(source21), language: 'jsx' }
    }
  }
};
export const ReuiBadge22 = {
  name: 'Badge: Badge with a status dot',
  render: () => <Pattern22 />,
  parameters: {
    docs: {
      description: { story: 'Badge with a status dot' },
      source: { code: publicSource(source22), language: 'jsx' }
    }
  }
};
export const ReuiBadge23 = {
  name: 'Badge: Badge rendered as a link',
  render: () => <Pattern23 />,
  parameters: {
    docs: {
      description: { story: 'Badge rendered as a link' },
      source: { code: publicSource(source23), language: 'jsx' }
    }
  }
};
export const ReuiBadge24 = {
  name: 'Badge: Badge with avatar',
  render: () => <Pattern24 />,
  parameters: {
    docs: {
      description: { story: 'Badge with avatar' },
      source: { code: publicSource(source24), language: 'jsx' }
    }
  }
};
export const ReuiBadge25 = {
  name: 'Badge: Badge with flag image',
  render: () => <Pattern25 />,
  parameters: {
    docs: {
      description: { story: 'Badge with flag image' },
      source: { code: publicSource(source25), language: 'jsx' }
    }
  }
};
