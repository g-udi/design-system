import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ThemeStudio } from './ThemeStudio';
import { checkThemeProvider } from '../../../../tests/themes/checkThemeProvider.jsx';

export default {
  id: 'theming-theme-studio',
  parameters: {
    docs: { description: { component: 'Browse the theme presets, edit the themeable token contract in OKLCH, generate a palette from a brand colour or a random seed, check WCAG AA contrast, and import or export Gaudi, shadcn, tweakcn and StyleGlide themes. Inspired by StyleGlide (https://www.styleglide.ai/themes), tweakcn (https://tweakcn.com) and shadcn/ui themes (https://ui.shadcn.com/themes); themes made there import as-is. See src/tokens/THEMING.md.' } },
    layout: 'padded'
  },
  title: 'Theme Studio'
};

export const Studio = {
  name: 'Theme Studio',
  render: () => <ThemeStudio />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('list', { name: 'Theme presets' }).children.length).toBeGreaterThanOrEqual(8);
    await userEvent.click(canvas.getByRole('button', { name: 'Customise Folio' }));
    const preview = await canvas.findByRole('region', { name: 'Folio preview (light)' });
    await waitFor(() => expect(getComputedStyle(preview).getPropertyValue('--ds-radius').trim()).toBe('2px'));
    await expect(canvas.getByText('All pass')).toBeInTheDocument();

    // Generate from a brand colour; the palette stays contrast-safe.
    const brand = canvas.getByRole('textbox', { name: 'Brand colour' });
    await userEvent.clear(brand);
    await userEvent.type(brand, '#0e7490');
    await userEvent.click(canvas.getByRole('button', { name: 'Generate from brand' }));
    await expect(await canvas.findByRole('region', { name: 'Brand #0e7490 preview (light)' })).toBeInTheDocument();
    await expect(canvas.getByText('All pass')).toBeInTheDocument();

    // Edit one token by keyboard and see the preview update.
    await userEvent.click(canvas.getByRole('button', { name: /^surface:/ }));
    const lightness = canvas.getAllByRole('slider', { name: 'Lightness' })[0];
    lightness.focus();
    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('textbox', { name: 'surface (light)' })).toHaveValue('#ffffff');

    // Dark mode and import.
    await userEvent.click(canvas.getByRole('radio', { name: 'Dark' }));
    await expect(await canvas.findByRole('region', { name: /preview \(dark\)/ })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('tab', { name: 'Import & export' }));
    await userEvent.type(canvas.getByRole('textbox', { name: 'Theme to import' }), ':root {{ --background: #fdfcfb; --foreground: #1c1917; --primary: #0e7490; }');
    await userEvent.click(canvas.getByRole('button', { name: 'Import theme' }));
    await expect(await canvas.findByText('Imported')).toBeInTheDocument();
    await expect(canvas.getByRole('textbox', { name: 'Exported theme' }).value).toContain('--ds-color-accent: #0e7490;');
    await checkThemeProvider(canvasElement);
  }
};
