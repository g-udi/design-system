import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { playgroundSource } from '../../../../docs/components/previewSource';
import Footer from '..';
import { FooterExample } from './fixtures/FooterExample';
import exampleSource from './fixtures/FooterExample.jsx?raw';
import metadataSource from '../../../../docs/fixtures/site/metadata.js?raw';

const docs = getComponentDocs('Blocks/Marketing/Footers');
const source = exampleSource.replace(/import siteMetadata from [^;]+;/, metadataSource.replace('export default siteMetadata;', ''));
export default {
  title: 'Blocks/Marketing/Footers', id: 'layout-footer', component: Footer, tags: ['autodocs'],
  parameters: { layout: 'fullscreen', visualAudit: { wide: 'Footers fill the width of their page container.' }, docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Blog }) } }
};

const example = {
  render: args => <FooterExample {...args} />,
  args: { variant: 'editorial', showBrand: true, showSocial: true, brandDescription: 'Notes on AI, data, engineering, and the tools that make work easier.', copyrightName: 'Ahmad Assaf', response: 'success' },
  argTypes: {
    variant: { control: 'select', options: ['editorial', 'standard', 'centered', 'compact'] },
    showBrand: { control: 'boolean' }, showSocial: { control: 'boolean' },
    brandDescription: { control: 'text', if: { arg: 'variant', neq: 'compact' } },
    copyrightName: { control: 'text' },
    response: { control: 'select', options: ['success', 'error', 'unavailable'], if: { arg: 'variant', eq: 'standard' } }
  },
  parameters: { docs: { source: playgroundSource('FooterExample', { imports: source }) }, layoutAudit: { widths: [623, 624, 625, 687, 688, 689, 943, 944, 945] } },
  play: async context => {
    const { args, canvasElement } = context;
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('contentinfo', { name: 'Footer' })).toBeVisible();
    await expect(canvas.getByRole('navigation', { name: 'Footer navigation' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'All articles', exact: true })).toHaveAttribute('href', '/blog');
    if (args.copyrightName) await expect(canvas.getByText(new RegExp(`${args.copyrightName}.*All rights reserved`))).toBeVisible();
    if (args.variant !== 'standard') {
      await expect(canvas.queryByRole('textbox', { name: 'Email address' })).toBeNull();
      return;
    }
    const submit = canvas.getByRole('button', { name: 'Sign up' });
    if (args.response === 'unavailable') {
      await expect(submit).toBeDisabled();
      return;
    }
    const email = canvas.getByRole('textbox', { name: 'Email address' });
    await userEvent.type(email, 'reader@example.com');
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ ...context, id: `${context.id}--ready` });
    }
    await userEvent.click(submit);
    if (args.response === 'error') {
      await expect(await canvas.findByRole('alert')).toHaveTextContent('We could not subscribe you. Please try again.');
      await expect(email).toHaveValue('reader@example.com');
    } else {
      await expect(await canvas.findByRole('status')).toHaveTextContent('You are now subscribed.');
      await expect(email).toBeDisabled();
    }
    canvasElement.ownerDocument.activeElement?.blur();
  }
};
export const Blog = { ...example, name: 'Blog with link columns' };
export const Newsletter = { ...example, name: 'With newsletter', args: { ...example.args, variant: 'standard' } };
export const Centered = { ...example, name: 'Centered', args: { ...example.args, variant: 'centered' } };
export const Compact = { ...example, name: 'Compact inline', args: { ...example.args, variant: 'compact' } };
export const FooterLayout = { ...example, name: 'Newsletter unavailable', args: { ...example.args, variant: 'standard', response: 'unavailable' }, parameters: { ...example.parameters, __id: 'layout-components--footer-layout' } };
export const SubmissionError = { ...example, name: 'Newsletter error', args: { ...example.args, variant: 'standard', response: 'error' } };
