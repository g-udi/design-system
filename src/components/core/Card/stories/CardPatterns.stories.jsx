import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'card', import.meta.url,
  import.meta.glob('./fixtures/card/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/card/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Card', id: 'core-card', tags: ['autodocs'], ...catalogueMeta('card') };

export const Sections = {
  name: 'Sections and dividers', ...pattern('sections', 'Header, description, header menu, content link and footer actions; switches toggle the header and footer dividers and a stacked depth effect. Claim actions update local demo state.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'See the guideline' })).toHaveAttribute('href', '/claims/guide');
    await userEvent.click(canvas.getByRole('button', { name: 'Certify' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Claim certified in this demo. No claim was submitted.');
    await expect(canvas.getByRole('button', { name: 'Certify' })).toBeDisabled();
  }
};
export const Media = {
  name: 'Media cards', ...pattern('media', 'An image card with inset or full-bleed media beside an overlay card with an author header, gradient fades and hover zoom.'),
  play: async (context) => {
    const canvas = within(context.canvasElement);
    const toggle = canvas.getByRole('switch', { name: 'Full-bleed image' });
    const card = canvas.getByRole('link', { name: 'Get started' }).closest('[data-slot="card"]');
    const image = card.querySelector('img');
    const inset = () => image.getBoundingClientRect().left - card.getBoundingClientRect().left;
    await expect(toggle).not.toBeChecked();
    await expect(inset()).toBeGreaterThan(8);
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    await waitFor(() => expect(inset()).toBeLessThanOrEqual(1));
    await expect(canvas.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '/projects/new');
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ ...context, id: `${context.id}--full-bleed` });
    }
    await userEvent.click(toggle);
    await waitFor(() => expect(inset()).toBeGreaterThan(8));
  }
};
export const LinkCards = { name: 'Link cards', ...pattern('link-cards', 'Navigation cards led by an icon tile or a bordered header label.') };
export const StatTrend = {
  name: 'Stat with trend and menu', ...pattern('stat-trend', 'A metric card with local pin, alert and remove actions; Share copies its explicit report route.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'More options' }));
    await userEvent.click(await body.findByRole('menuitem', { name: 'Pin to Dashboard' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Card pinned in this demo.');
    await userEvent.click(canvas.getByRole('button', { name: 'More options' }));
    await userEvent.click(await body.findByRole('menuitem', { name: 'Remove' }));
    await expect(canvas.queryByText('Revenue')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Restore revenue card' }));
    await expect(canvas.getByText('Revenue')).toBeVisible();
  }
};
export const HeaderActions = {
  name: 'Header badge and actions', ...pattern('header-actions'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigator = canvasElement.ownerDocument.defaultView.navigator;
    const descriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    const writeText = fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    try {
      await userEvent.click(canvas.getByRole('button', { name: 'More options' }));
      await userEvent.click(await within(canvasElement.ownerDocument.body).findByRole('menuitem', { name: 'Copy link' }));
      await expect(writeText).toHaveBeenCalledWith('/integrations/github');
      await expect(canvas.getByRole('status')).toHaveTextContent('Integration link copied.');
      await expect(canvas.getByRole('link', { name: 'Open' })).toHaveAttribute('href', '/integrations/github');
    } finally {
      if (descriptor) Object.defineProperty(navigator, 'clipboard', descriptor);
      else delete navigator.clipboard;
    }
  }
};
export const DeploymentStatus = { name: 'Deployment status', ...pattern('deployment-status') };
export const BillingUsage = {
  name: 'Usage meters that expand', ...pattern('billing-usage', 'A usage summary with the existing Collapsible controlling its detailed breakdown.'),
  play: async (context) => {
    const canvas = within(context.canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Toggle card' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByText('Bandwidth')).not.toBeInTheDocument();
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('Bandwidth')).toBeVisible();
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ ...context, id: `${context.id}--expanded` });
    }
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  }
};
export const LoginForm = {
  name: 'Login form', ...pattern('login-form', 'A local form validation demo with password visibility. No authentication requests are sent.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Email address' }), 'reader@example.com');
    await userEvent.type(canvas.getByLabelText('Password', { exact: true }), 'demo-password');
    await userEvent.click(canvas.getByRole('button', { name: 'Show password' }));
    await expect(canvas.getByRole('textbox', { name: 'Password' })).toHaveAttribute('type', 'text');
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Sign-in details validated in this demo.');
  }
};
