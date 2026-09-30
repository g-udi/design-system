// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-14.jsx?raw';
import { Pattern as Pattern15 } from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-15.jsx';
import source15 from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-15.jsx?raw';
import { Pattern as Pattern16 } from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-16.jsx';
import source16 from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-16.jsx?raw';
import { Pattern as Pattern17 } from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-17.jsx';
import source17 from '../../../../.storybook/fixtures/reui/icon-tile/c-icon-tile-17.jsx?raw';

export default {
  title: 'Core/Icon',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='icon-tile'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Icon Tile compositions owned by Gaudi Icon. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiIconTile1 = {
  name: 'Icon Tile: Default icon tile',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Default icon tile' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiIconTile2 = {
  name: 'Icon Tile: Elevated icon tile',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Icon tile with elevated surface' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiIconTile3 = {
  name: 'Icon Tile: Framed icon tile',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Icon tile with framed surface' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiIconTile4 = {
  name: 'Icon Tile: All variants',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Every icon tile variant' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiIconTile5 = {
  name: 'Icon Tile: Sizes',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Icon tile size scale' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiIconTile6 = {
  name: 'Icon Tile: Circular tiles',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Icon tiles with circular shape' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiIconTile7 = {
  name: 'Icon Tile: Custom sizing',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Icon tile with custom sizing' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiIconTile8 = {
  name: 'Icon Tile: Color tones',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Semantic icon tile color tones' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiIconTile9 = {
  name: 'Icon Tile: Text content',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Icon tile with text content' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiIconTile10 = {
  name: 'Icon Tile: List row',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Icon tile in a list row' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiIconTile11 = {
  name: 'Icon Tile: Feature card',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Icon tile in a feature card' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiIconTile12 = {
  name: 'Icon Tile: Empty state',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Icon tile in an empty state' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiIconTile13 = {
  name: 'Icon Tile: Interactive tile',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: { story: 'Interactive icon tile' },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiIconTile14 = {
  name: 'Icon Tile: Status overlay',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: { story: 'Icon tile with status overlay' },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
export const ReuiIconTile15 = {
  name: 'Icon Tile: Soft tones',
  render: () => <Pattern15 />,
  parameters: {
    docs: {
      description: { story: 'Tone-adjustable soft variant' },
      source: { code: publicSource(source15), language: 'jsx' }
    }
  }
};
export const ReuiIconTile16 = {
  name: 'Icon Tile: Solid tones',
  render: () => <Pattern16 />,
  parameters: {
    docs: {
      description: { story: 'Tone-adjustable solid variant' },
      source: { code: publicSource(source16), language: 'jsx' }
    }
  }
};
export const ReuiIconTile17 = {
  name: 'Icon Tile: Brand colors',
  render: () => <Pattern17 />,
  parameters: {
    docs: {
      description: { story: 'Elevated tile with a Tailwind color fill' },
      source: { code: publicSource(source17), language: 'jsx' }
    }
  }
};
