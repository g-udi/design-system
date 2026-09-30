// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/input-otp/c-input-otp-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/input-otp/c-input-otp-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/input-otp/c-input-otp-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/input-otp/c-input-otp-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/input-otp/c-input-otp-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/input-otp/c-input-otp-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/input-otp/c-input-otp-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/input-otp/c-input-otp-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/input-otp/c-input-otp-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/input-otp/c-input-otp-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/input-otp/c-input-otp-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/input-otp/c-input-otp-6.jsx?raw';

export default {
  title: 'Core/InputOtp',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='input-otp'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Input Otp compositions owned by Gaudi InputOtp. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiInputOtp1 = {
  name: 'Basic OTP input.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic OTP input.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiInputOtp2 = {
  name: 'OTP input with numeric digits.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'OTP input with numeric digits.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiInputOtp3 = {
  name: 'OTP input with multiple separators.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'OTP input with multiple separators.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiInputOtp4 = {
  name: 'OTP input with letters and numbers.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'OTP input with letters and numbers.' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiInputOtp5 = {
  name: 'OTP input for PIN codes.',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'OTP input for PIN codes.' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiInputOtp6 = {
  name: 'OTP input verification code.',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'OTP input verification code.' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
