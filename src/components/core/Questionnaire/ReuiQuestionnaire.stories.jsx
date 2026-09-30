import { catalogueInteractions } from '../../../../.storybook/stories/ReuiInteractions.js';
// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/questionnaire/c-questionnaire-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/questionnaire/c-questionnaire-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/questionnaire/c-questionnaire-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/questionnaire/c-questionnaire-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/questionnaire/c-questionnaire-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/questionnaire/c-questionnaire-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/questionnaire/c-questionnaire-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/questionnaire/c-questionnaire-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/questionnaire/c-questionnaire-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/questionnaire/c-questionnaire-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/questionnaire/c-questionnaire-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/questionnaire/c-questionnaire-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/questionnaire/c-questionnaire-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/questionnaire/c-questionnaire-7.jsx?raw';

export default {
  title: 'Core/Questionnaire',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='questionnaire'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Questionnaire compositions owned by Gaudi Questionnaire. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiQuestionnaire1 = {
  play: catalogueInteractions['questionnaire-1'],
  name: 'Guided workspace setup',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: {
        story:
          'Three required questions in a card, with progress, navigation and a summary on submit.'
      },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiQuestionnaire2 = {
  name: 'Multi-select answers',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: {
        story:
          'A checkbox question that accepts several answers, with a live count and a chip summary.'
      },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiQuestionnaire3 = {
  name: 'A written answer beside the choices',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: {
        story:
          'A text input sitting with the fixed choices, so an answer can be typed instead of picked.'
      },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiQuestionnaire4 = {
  name: 'Segmented progress with step labels',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: {
        story:
          'A custom progress bar built from the progress render state, over a four question flow.'
      },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiQuestionnaire5 = {
  name: 'An optional question with skip',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: {
        story:
          'A question the visitor may skip on purpose, with the skipped state carried into the summary.'
      },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiQuestionnaire6 = {
  name: 'A rule that sends you back',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: {
        story:
          'A cross-question rule checked on submit, returning the flow to the question that broke it.'
      },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiQuestionnaire7 = {
  name: 'A branch that appears when it applies',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: {
        story:
          'A question that only joins the flow after an earlier answer, with avatars, reset and a summary.'
      },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
