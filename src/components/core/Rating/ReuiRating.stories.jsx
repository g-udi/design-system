// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/rating/c-rating-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/rating/c-rating-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/rating/c-rating-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/rating/c-rating-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/rating/c-rating-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/rating/c-rating-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/rating/c-rating-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/rating/c-rating-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/rating/c-rating-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/rating/c-rating-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/rating/c-rating-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/rating/c-rating-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/rating/c-rating-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/rating/c-rating-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/rating/c-rating-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/rating/c-rating-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/rating/c-rating-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/rating/c-rating-9.jsx?raw';

export default {
  title: 'Core/Rating',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='rating'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Rating compositions owned by Gaudi Rating. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiRating1 = {
  name: 'Basic rating.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic rating.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiRating2 = {
  name: 'Rating with decimal value.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Rating with decimal value.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiRating3 = {
  name: 'Rating with show value.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Rating with show value.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiRating4 = {
  name: 'Rating with editable.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Rating with editable.' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiRating5 = {
  name: 'Rating with size.',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Rating with size.' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiRating6 = {
  name: 'Rating with review summary',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Rating with review summary' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiRating7 = {
  name: 'Interactive half-star rating',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Interactive half-star rating' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiRating8 = {
  name: 'Emoji reaction rating',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Emoji reaction rating' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiRating9 = {
  name: 'Rating with review text input',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Rating with review text input' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
