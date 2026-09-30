import { catalogueInteractions } from '../../../../.storybook/stories/ReuiInteractions.js';
// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/tree/c-tree-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/tree/c-tree-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/tree/c-tree-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/tree/c-tree-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/tree/c-tree-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/tree/c-tree-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/tree/c-tree-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/tree/c-tree-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/tree/c-tree-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/tree/c-tree-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/tree/c-tree-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/tree/c-tree-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/tree/c-tree-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/tree/c-tree-7.jsx?raw';

export default {
  title: 'Core/Tree',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='tree'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Tree compositions owned by Gaudi Tree. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiTree1 = {
  play: catalogueInteractions['tree-1'],
  name: 'Basic tree.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic tree.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiTree2 = {
  name: 'Tree with indented lines.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Tree with indented lines.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiTree3 = {
  name: 'Tree with custom indent.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Tree with custom indent.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiTree4 = {
  name: 'Tree with custom indent.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Tree with custom indent.' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiTree5 = {
  name: 'File explorer tree with type icons',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'File explorer tree with type icons' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiTree6 = {
  name: 'Organization chart tree with avatars',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Organization chart tree with avatars' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiTree7 = {
  name: 'Permissions tree with checkboxes',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Permissions tree with checkboxes' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
