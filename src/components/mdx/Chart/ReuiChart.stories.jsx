// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { ChartBar as Pattern1 } from '../../../../.storybook/fixtures/reui/chart/c-chart-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/chart/c-chart-1.jsx?raw';
import { ChartBar as Pattern2 } from '../../../../.storybook/fixtures/reui/chart/c-chart-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/chart/c-chart-2.jsx?raw';
import { ChartBarPattern as Pattern3 } from '../../../../.storybook/fixtures/reui/chart/c-chart-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/chart/c-chart-3.jsx?raw';
import { ChartBarPattern as Pattern4 } from '../../../../.storybook/fixtures/reui/chart/c-chart-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/chart/c-chart-4.jsx?raw';
import { ChartBarPattern as Pattern5 } from '../../../../.storybook/fixtures/reui/chart/c-chart-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/chart/c-chart-5.jsx?raw';
import { Chart3D as Pattern6 } from '../../../../.storybook/fixtures/reui/chart/c-chart-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/chart/c-chart-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/chart/c-chart-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/chart/c-chart-7.jsx?raw';
import { Chart3D as Pattern8 } from '../../../../.storybook/fixtures/reui/chart/c-chart-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/chart/c-chart-8.jsx?raw';
import { ChartBarPattern as Pattern9 } from '../../../../.storybook/fixtures/reui/chart/c-chart-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/chart/c-chart-9.jsx?raw';
import { ChartDuotone as Pattern10 } from '../../../../.storybook/fixtures/reui/chart/c-chart-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/chart/c-chart-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/chart/c-chart-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/chart/c-chart-11.jsx?raw';
import { ChartVerticalBars as Pattern12 } from '../../../../.storybook/fixtures/reui/chart/c-chart-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/chart/c-chart-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/chart/c-chart-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/chart/c-chart-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/chart/c-chart-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/chart/c-chart-14.jsx?raw';
import { Pattern as Pattern15 } from '../../../../.storybook/fixtures/reui/chart/c-chart-15.jsx';
import source15 from '../../../../.storybook/fixtures/reui/chart/c-chart-15.jsx?raw';
import { Pattern as Pattern16 } from '../../../../.storybook/fixtures/reui/chart/c-chart-16.jsx';
import source16 from '../../../../.storybook/fixtures/reui/chart/c-chart-16.jsx?raw';
import { Pattern as Pattern17 } from '../../../../.storybook/fixtures/reui/chart/c-chart-17.jsx';
import source17 from '../../../../.storybook/fixtures/reui/chart/c-chart-17.jsx?raw';
import { Pattern as Pattern18 } from '../../../../.storybook/fixtures/reui/chart/c-chart-18.jsx';
import source18 from '../../../../.storybook/fixtures/reui/chart/c-chart-18.jsx?raw';
import { Pattern as Pattern19 } from '../../../../.storybook/fixtures/reui/chart/c-chart-19.jsx';
import source19 from '../../../../.storybook/fixtures/reui/chart/c-chart-19.jsx?raw';
import { Pattern as Pattern20 } from '../../../../.storybook/fixtures/reui/chart/c-chart-20.jsx';
import source20 from '../../../../.storybook/fixtures/reui/chart/c-chart-20.jsx?raw';
import { Pattern as Pattern21 } from '../../../../.storybook/fixtures/reui/chart/c-chart-21.jsx';
import source21 from '../../../../.storybook/fixtures/reui/chart/c-chart-21.jsx?raw';
import { Pattern as Pattern22 } from '../../../../.storybook/fixtures/reui/chart/c-chart-22.jsx';
import source22 from '../../../../.storybook/fixtures/reui/chart/c-chart-22.jsx?raw';
import { Pattern as Pattern23 } from '../../../../.storybook/fixtures/reui/chart/c-chart-23.jsx';
import source23 from '../../../../.storybook/fixtures/reui/chart/c-chart-23.jsx?raw';
import { Pattern as Pattern24 } from '../../../../.storybook/fixtures/reui/chart/c-chart-24.jsx';
import source24 from '../../../../.storybook/fixtures/reui/chart/c-chart-24.jsx?raw';
import { Pattern as Pattern25 } from '../../../../.storybook/fixtures/reui/chart/c-chart-25.jsx';
import source25 from '../../../../.storybook/fixtures/reui/chart/c-chart-25.jsx?raw';

export default {
  title: 'MDX/Chart',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='chart'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Chart compositions owned by Gaudi Chart. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiChart1 = {
  name: 'Basic bar chart',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic bar chart' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiChart2 = {
  name: 'Multi-dataset bar chart',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Multi-dataset bar chart' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiChart3 = {
  name: 'Diagonal stripe bar chart',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Diagonal stripe bar chart' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiChart4 = {
  name: 'Dotted pattern bar chart',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Dotted pattern bar chart' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiChart5 = {
  name: 'Striped and solid bar chart',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Striped and solid bar chart' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiChart6 = {
  name: '3D gradient bar chart',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: '3D gradient bar chart' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiChart7 = {
  name: 'Gradient bar chart',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Gradient bar chart' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiChart8 = {
  name: '3D isometric bar chart',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: '3D isometric bar chart' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiChart9 = {
  name: 'Dotted and solid bar chart',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Dotted and solid bar chart' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiChart10 = {
  name: 'Duotone gradient bar chart',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Duotone gradient bar chart' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiChart11 = {
  name: 'Animated monochrome bar chart',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Animated monochrome bar chart' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiChart12 = {
  name: 'Vertical bar chart',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Vertical bar chart' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiChart13 = {
  name: 'Gradient area chart with stripe overlay',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: { story: 'Gradient area chart with stripe overlay' },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiChart14 = {
  name: 'Stacked area chart with dashed strokes',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: { story: 'Stacked area chart with dashed strokes' },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
export const ReuiChart15 = {
  name: 'Step area chart with dotted pattern fill',
  render: () => <Pattern15 />,
  parameters: {
    docs: {
      description: { story: 'Step area chart with dotted pattern fill' },
      source: { code: publicSource(source15), language: 'jsx' }
    }
  }
};
export const ReuiChart16 = {
  name: 'Area chart with glowing dot markers',
  render: () => <Pattern16 />,
  parameters: {
    docs: {
      description: { story: 'Area chart with glowing dot markers' },
      source: { code: publicSource(source16), language: 'jsx' }
    }
  }
};
export const ReuiChart17 = {
  name: 'Forecast line chart with stripe pattern zone',
  render: () => <Pattern17 />,
  parameters: {
    docs: {
      description: { story: 'Forecast line chart with stripe pattern zone' },
      source: { code: publicSource(source17), language: 'jsx' }
    }
  }
};
export const ReuiChart18 = {
  name: 'Stacked area chart with crosshatch pattern fill',
  render: () => <Pattern18 />,
  parameters: {
    docs: {
      description: { story: 'Stacked area chart with crosshatch pattern fill' },
      source: { code: publicSource(source18), language: 'jsx' }
    }
  }
};
export const ReuiChart19 = {
  name: 'Donut chart with center total',
  render: () => <Pattern19 />,
  parameters: {
    docs: {
      description: { story: 'Donut chart with center total' },
      source: { code: publicSource(source19), language: 'jsx' }
    }
  }
};
export const ReuiChart20 = {
  name: 'Donut chart with center stats',
  render: () => <Pattern20 />,
  parameters: {
    docs: {
      description: { story: 'Donut chart with center stats' },
      source: { code: publicSource(source20), language: 'jsx' }
    }
  }
};
export const ReuiChart21 = {
  name: 'Bug priority pie with stripe patterns',
  render: () => <Pattern21 />,
  parameters: {
    docs: {
      description: { story: 'Bug priority pie with stripe patterns' },
      source: { code: publicSource(source21), language: 'jsx' }
    }
  }
};
export const ReuiChart22 = {
  name: 'Active segment donut with center label',
  render: () => <Pattern22 />,
  parameters: {
    docs: {
      description: { story: 'Active segment donut with center label' },
      source: { code: publicSource(source22), language: 'jsx' }
    }
  }
};
export const ReuiChart23 = {
  name: 'Radar chart with gradient fill',
  render: () => <Pattern23 />,
  parameters: {
    docs: {
      description: { story: 'Radar chart with gradient fill' },
      source: { code: publicSource(source23), language: 'jsx' }
    }
  }
};
export const ReuiChart24 = {
  name: 'Filled radar with glowing stroke',
  render: () => <Pattern24 />,
  parameters: {
    docs: {
      description: { story: 'Filled radar with glowing stroke' },
      source: { code: publicSource(source24), language: 'jsx' }
    }
  }
};
export const ReuiChart25 = {
  name: 'Lighthouse scores radial with labels',
  render: () => <Pattern25 />,
  parameters: {
    docs: {
      description: { story: 'Lighthouse scores radial with labels' },
      source: { code: publicSource(source25), language: 'jsx' }
    }
  }
};
