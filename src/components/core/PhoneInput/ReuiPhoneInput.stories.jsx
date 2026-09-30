// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/phone-input/c-phone-input-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/phone-input/c-phone-input-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/phone-input/c-phone-input-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/phone-input/c-phone-input-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/phone-input/c-phone-input-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/phone-input/c-phone-input-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/phone-input/c-phone-input-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/phone-input/c-phone-input-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/phone-input/c-phone-input-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/phone-input/c-phone-input-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/phone-input/c-phone-input-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/phone-input/c-phone-input-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/phone-input/c-phone-input-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/phone-input/c-phone-input-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/phone-input/c-phone-input-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/phone-input/c-phone-input-8.jsx?raw';

export default {
  title: 'Core/PhoneInput',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='phone-input'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Phone Input compositions owned by Gaudi PhoneInput. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiPhoneInput1 = {
  name: 'Basic phone input',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic phone input' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiPhoneInput2 = {
  name: 'Small phone input',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Small phone input' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiPhoneInput3 = {
  name: 'Large phone input',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Large phone input' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiPhoneInput4 = {
  name: 'Disabled phone input',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Disabled phone input' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiPhoneInput5 = {
  name: 'Phone input with preset value',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Phone input with preset value' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiPhoneInput6 = {
  name: 'Phone input with error state',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Phone input with error state' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiPhoneInput7 = {
  name: 'Phone input with specific default country',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Phone input with specific default country' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiPhoneInput8 = {
  name: 'Read-only phone input',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Read-only phone input' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
