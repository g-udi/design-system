import { expect, within } from 'storybook/test';
import { themePresets } from '../../../themes/presets.js';
import { COLOR_TOKENS } from '../../../themes/contract.js';
import { ThemingOverview } from './ThemingOverview';

export default {
  id: 'theming-overview',
  parameters: { layout: 'fullscreen' },
  tags: [ '!autodocs' ],
  title: 'Theming'
};

export const Default = {
  name: 'Theming',
  render: () => <ThemingOverview />,
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Theming' })).toBeInTheDocument();
    for (const name of [ 'What a theme is', /^Contract/, 'Presets', 'Applying a theme', 'Generating', 'Import and export', 'Accessibility' ]) {
      await expect(canvas.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    }
    // Live swatches cover every contract colour for every preset.
    const contract = canvas.getByRole('region', { name: 'Theme contract values for every preset' });
    await expect(within(contract).getAllByRole('img', { name: / in Gaudi: light / })).toHaveLength(COLOR_TOKENS.length);
    await expect(within(contract).getAllByRole('img', { name: /^surface in / })).toHaveLength(themePresets.length);
    await expect(canvas.getByRole('list', { name: 'Theme presets gallery' }).children).toHaveLength(themePresets.length);
    await expect(canvas.getAllByRole('link', { name: /Theme Studio/ }).length).toBeGreaterThan(themePresets.length);
    await expect(canvas.getAllByText(/^Pass · /)).toHaveLength(themePresets.length);
    // The toolbar Theme global is applied to the preview root.
    await expect(document.documentElement).toHaveAttribute('data-theme', globals.gaudiTheme);
  }
};
