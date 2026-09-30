import { catalogueInteractions } from '../../../../.storybook/stories/ReuiInteractions.js';
// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/file-upload/c-file-upload-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/file-upload/c-file-upload-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/file-upload/c-file-upload-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/file-upload/c-file-upload-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/file-upload/c-file-upload-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/file-upload/c-file-upload-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/file-upload/c-file-upload-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/file-upload/c-file-upload-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/file-upload/c-file-upload-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/file-upload/c-file-upload-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/file-upload/c-file-upload-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/file-upload/c-file-upload-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/file-upload/c-file-upload-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/file-upload/c-file-upload-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/file-upload/c-file-upload-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/file-upload/c-file-upload-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/file-upload/c-file-upload-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/file-upload/c-file-upload-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/file-upload/c-file-upload-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/file-upload/c-file-upload-10.jsx?raw';

export default {
  title: 'Core/FileUpload',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='file-upload'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'File Upload compositions owned by Gaudi FileUpload. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiFileUpload1 = {
  name: 'Basic file upload',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic file upload' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiFileUpload2 = {
  name: 'Avatar upload',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Avatar upload' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiFileUpload3 = {
  play: catalogueInteractions['file-upload-3'],
  name: 'Basic drag and drop file upload',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Basic drag and drop file upload' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiFileUpload4 = {
  name: 'Gallery file upload',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Gallery file upload' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiFileUpload5 = {
  name: 'Progress file upload',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Progress file upload' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiFileUpload6 = {
  name: 'Table file upload',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Table file upload' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiFileUpload7 = {
  name: 'Image upload',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Image upload' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiFileUpload8 = {
  name: 'Image upload with sorting.',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Image upload with sorting.' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiFileUpload9 = {
  name: 'Card file upload.',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Card file upload.' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiFileUpload10 = {
  name: 'Cover image upload.',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Cover image upload.' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
