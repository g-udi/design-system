import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';

import { expect, waitFor, within } from 'storybook/test';

import NewsletterForm from '..';

const story = description => ({
  docs: {
    description: {
      story: description
    }
  }
});

export const Newsletter = {
  name: 'NewsletterForm',
  args: {
    title: 'Subscribe to the newsletter'
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Form heading.'
    }
  },
  parameters: { ...story('The subscription form with an explicit host endpoint, followed by its unavailable state when no endpoint is configured. The email field is required and results are announced below it.'), __id: 'layout-components--newsletter' },
  render: args => <div className='mx-auto grid max-w-2xl gap-10 p-6'>
      <NewsletterForm {...args} endpoint='#newsletter' className='mt-0' />
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
  }
};

const docs = getComponentDocs('Layout/NewsletterForm');

export default {
  title: 'Layout/NewsletterForm',
  id: 'layout-newsletter-form',
  component: NewsletterForm,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Newsletter }) } }
};
