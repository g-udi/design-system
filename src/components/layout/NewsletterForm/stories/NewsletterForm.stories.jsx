import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';

import { expect, userEvent, waitFor, within } from 'storybook/test';

import NewsletterForm from '..';
import { NewsletterSection } from './fixtures/NewsletterSection';
import sectionSource from './fixtures/NewsletterSection.jsx?raw';
import sectionStyles from './fixtures/NewsletterSection.css?raw';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { checkNewsletterLifecycle } from '../../../../../tests/components/layout/NewsletterForm/checkNewsletterLifecycle.jsx';

const story = description => ({
  docs: {
    description: {
      story: description
    }
  }
});

export const Newsletter = {
  name: 'Form and availability',
  args: {
    title: 'Subscribe to the newsletter'
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Form heading.'
    }
  },
  parameters: { ...story('The subscription form uses a local sample response; no address is subscribed. A second form shows the unavailable state when no endpoint is configured. The email field is required and results are announced below it.'), __id: 'layout-components--newsletter' },
  render: args => <div className='mx-auto grid max-w-2xl gap-10 p-6'>
      <div>
        <NewsletterForm {...args} endpoint='data:application/json,%7B%22error%22%3Afalse%7D' className='mt-0' />
        <p className='mt-3 text-sm text-text-muted'>Demo only. Submitting shows a sample response and does not subscribe your address.</p>
      </div>
      <div className='rounded-card bg-surface-muted p-6 sm:px-14 sm:py-8'>
        <NewsletterForm title={args.title} />
      </div>
    </div>,
  play: async ({
    args,
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('heading', {
      name: args.title
    })).toHaveLength(2);
    for (const email of canvas.getAllByRole('textbox', {
      name: 'Email address'
    })) await expect(email).toBeRequired();
    const buttons = canvas.getAllByRole('button', {
      name: 'Sign up'
    });
    const emails = canvas.getAllByRole('textbox', { name: 'Email address' });
    for (let index = 0; index < emails.length; index += 1) {
      await expect(Math.abs(emails[index].getBoundingClientRect().height - buttons[index].getBoundingClientRect().height)).toBeLessThanOrEqual(1);
    }
    await expect(buttons[0]).toBeEnabled();
    await expect(buttons[1]).toBeDisabled();
    await expect(canvas.getByText('Newsletter sign-up is currently unavailable.')).toBeVisible();
    const newsletter = emails[0].closest('form').parentElement;
    const originalWidth = newsletter.style.width;
    newsletter.style.width = '240px';
    try {
      await waitFor(() => {
        expect(newsletter.scrollWidth).toBeLessThanOrEqual(newsletter.clientWidth + 1);
        expect(buttons[0].getBoundingClientRect().top).toBeGreaterThanOrEqual(emails[0].getBoundingClientRect().bottom);
      });
    } finally {
      newsletter.style.width = originalWidth;
    }
    await userEvent.type(emails[0], 'reader@example.com');
    await userEvent.click(buttons[0]);
    await expect(await canvas.findByRole('status')).toHaveTextContent('You are now subscribed.');
    await expect(emails[0]).toBeDisabled();
    await expect(emails[0]).toHaveValue('');
    await checkNewsletterLifecycle(canvasElement);
  }
};

const docs = getComponentDocs('Blocks/Marketing/Newsletter');

export default {
  title: 'Blocks/Marketing/Newsletter',
  id: 'layout-newsletter-form',
  component: NewsletterForm,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};


const source = sectionSource.replace("import styles from './NewsletterSection.css?raw';", `const styles = ${JSON.stringify(sectionStyles)};`);
const section = {
  render: args => <NewsletterSection {...args} />,
  argTypes: {
    ...docsArgTypes(docs, { title: 'text', description: 'text' }),
    layout: { control: 'select', options: ['centered', 'split', 'image', 'compact'] },
    response: { control: 'select', options: ['success', 'error', 'unavailable'], description: 'Local sample result. Changing it resets the form.' }
  },
  parameters: {
    visualAudit: { wide: 'Newsletter sections fill their containing page.' },
    docs: { source: playgroundSource('NewsletterSection', { imports: source }) }
  },
  play: async (context) => {
    const { canvasElement, args } = context;
    const canvas = within(canvasElement);
    const email = canvas.getByRole('textbox', { name: 'Email address' });
    const submit = canvas.getByRole('button', { name: 'Sign up' });
    await expect(canvas.getByRole('heading', { name: args.title })).toBeVisible();
    await expect(email).toBeRequired();
    if (args.response === 'unavailable') {
      await expect(submit).toBeDisabled();
      return;
    }
    await userEvent.type(email, 'not-an-email');
    await userEvent.click(submit);
    await expect(email.checkValidity()).toBe(false);
    await expect(canvas.queryByRole('status')).toBeNull();
    await userEvent.clear(email);
    await userEvent.type(email, 'reader@example.com');
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ ...context, id: `${context.id}--ready` });
    }
    await userEvent.click(submit);
    if (args.response === 'error') {
      await expect(await canvas.findByRole('alert')).toHaveTextContent('We could not subscribe you. Please try again.');
      await expect(email).toHaveValue('reader@example.com');
      await expect(submit).toBeEnabled();
    } else {
      await expect(await canvas.findByRole('status')).toHaveTextContent('You are now subscribed.');
      await expect(email).toBeDisabled();
      await expect(email).toHaveValue('');
    }
    canvasElement.ownerDocument.activeElement?.blur();
  }
};

export const Playground = {
  ...section,
  name: 'Centered',
  args: { title: 'Good ideas, delivered thoughtfully.', description: 'Notes on design, new components, and things worth making. A little inspiration for whatever comes next.', layout: 'centered', response: 'success' }
};
export const Split = {
  ...section,
  name: 'Split',
  args: { title: 'Keep a little room for inspiration.', description: 'Get the latest writing, experiments, and useful resources from the Gaudi journal.', layout: 'split', response: 'success' }
};
export const ImagePanel = {
  ...section,
  name: 'Image panel',
  args: { title: 'See what takes shape next.', description: 'A closer look at the ideas behind the work. Join the journal for fresh perspectives on building for the web.', layout: 'image', response: 'success' }
};
export const Compact = {
  ...section,
  name: 'Compact',
  args: { title: 'Stay in the loop.', description: 'New writing and useful resources, straight to your inbox.', layout: 'compact', response: 'success' }
};
export const SubmissionError = {
  ...section,
  name: 'Submission error',
  args: { ...Compact.args, response: 'error' }
};
