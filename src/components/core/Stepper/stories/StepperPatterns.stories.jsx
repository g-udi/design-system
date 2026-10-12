import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../docs/components/PatternInteractions.js';
import { expect, userEvent, within } from 'storybook/test';
import tokens from '../../../../tokens/tokens.json';

const checkIndicatorGeometry = (diameter, orientation = 'horizontal') => async ({ canvasElement }) => {
  const root = canvasElement.ownerDocument.documentElement;
  const previousScale = root.style.getPropertyValue('--ds-space-scale');
  const previousPriority = root.style.getPropertyPriority('--ds-space-scale');
  const indicators = [...canvasElement.querySelectorAll('[data-slot="stepper-indicator"]')];
  try {
    for (const scale of Object.values(tokens.spaceScales)) {
      root.style.setProperty('--ds-space-scale', scale);
      for (const indicator of indicators) {
        const bounds = indicator.getBoundingClientRect();
        await expect(bounds.width).toBe(diameter);
        await expect(bounds.height).toBe(diameter);
      }
      const circle = indicators[0].getBoundingClientRect();
      const rail = canvasElement.querySelector('[data-slot="stepper-separator"]').getBoundingClientRect();
      const circleCenter = orientation === 'vertical' ? circle.x + circle.width / 2 : circle.y + circle.height / 2;
      const railCenter = orientation === 'vertical' ? rail.x + rail.width / 2 : rail.y + rail.height / 2;
      await expect(Math.abs(circleCenter - railCenter)).toBeLessThan(1);
    }
  } finally {
    if (previousScale) root.style.setProperty('--ds-space-scale', previousScale, previousPriority);
    else root.style.removeProperty('--ds-space-scale');
  }
};

const pattern = patternStories(
  'stepper', import.meta.url,
  import.meta.glob('./fixtures/stepper/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/stepper/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Navigation/Stepper', id: 'core-stepper', tags: ['autodocs'], ...catalogueMeta('stepper') };

export const Basic = { name: 'Simple linear steps', ...pattern('basic'), play: catalogueInteractions['stepper-basic'] };
export const Descriptions = {
  name: 'Titles and descriptions',
  ...pattern('descriptions', 'Labels centred under the indicator, start-aligned without a rail, or inline beside it, with optional descriptions.'),
  play: async (context) => {
    const canvas = within(context.canvasElement);
    await expect(canvas.getByText('Profile content')).toBeVisible();
    for (const layout of ['Start', 'Inline', 'Centered']) {
      await userEvent.click(canvas.getByRole('radio', { name: layout, exact: true }));
      await expect(canvas.getByRole('radio', { name: layout, exact: true })).toHaveAttribute('aria-checked', 'true');
      await expect(canvas.getByText('Profile content')).toBeVisible();
      if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
        const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
        await auditStoryLayout({ ...context, id: `${context.id}--${layout.toLowerCase()}` });
      }
    }
    await userEvent.click(canvas.getByRole('switch', { name: 'Descriptions' }));
    await expect(canvas.queryByText('Set up your profile')).not.toBeInTheDocument();
    await expect(canvas.getByText('Profile content')).toBeVisible();
    await userEvent.click(canvas.getByRole('switch', { name: 'Descriptions' }));
    await expect(canvas.getByText('Set up your profile')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Step 3' }));
    await expect(canvas.getByText('Complete content')).toBeVisible();
  },
};
export const IconsBadges = { name: 'Controlled with icons and badges', ...pattern('icons-badges', 'Previous and Next drive a controlled stepper; icon indicators turn to checks and a badge names each step status.'), play: checkIndicatorGeometry(32) };
export const Loading = { name: 'Loading state', ...pattern('loading'), play: checkIndicatorGeometry(20) };
export const ProgressBar = { name: 'Progress bar', ...pattern('progress-bar', 'A segmented bar with a step counter and Back and Next; switch on titles to label each segment.'), play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const back = canvas.getByRole('button', { name: 'Back' });
  await userEvent.click(back);
  await expect(back).toBeDisabled();
  back.click();
  await expect(canvas.getByText('User details content')).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
  await expect(back).toBeEnabled();
} };
export const Vertical = { name: 'Vertical orientation', ...pattern('vertical', 'Vertical steps with titles and optional descriptions.'), play: checkIndicatorGeometry(24, 'vertical') };
