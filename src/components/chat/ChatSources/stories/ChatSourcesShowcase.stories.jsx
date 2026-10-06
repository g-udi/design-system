import { CitedAnswerExample } from './fixtures/CitedAnswerExample.jsx';
import CitedAnswerExampleSource from './fixtures/CitedAnswerExample.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';

/* A combined example: an answer with grouped inline citations beside a SchemaDisplay tool result. */

export default {
  title: 'Chat/ChatSources',
  id: 'chat-chatsources',
  tags: ['autodocs'],
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const CitedAnswer = {
  name: 'Cited answer',
  parameters: {
    docs: {
      description: {
        story:
          'An answer that shows where it came from. Inline ChatMessageCitation pills open a card with the source’s favicon, title, site and quote: on hover for a mouse, and on click, tap or Enter. Pill 2 groups two sources, so its card pages through them in a carousel (arrow keys, buttons or swipe). The tool result is a SchemaDisplay (Core) for the endpoint the assistant read. In ChatMessageMarkdown, `[1]` and `[1, 3]` become the same pills. Accessibility: each pill is a button named “Source n: title”; hover never takes focus, a press moves focus into the card and Escape returns it; the carousel announces “2 of 2”.'
      },
      source: { language: 'jsx', code: publicSource(CitedAnswerExampleSource, new URL('./fixtures/CitedAnswerExample.jsx', import.meta.url)) + '\n<CitedAnswerExample />' }
    }
  },
  render: () => <CitedAnswerExample />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);

    await step('a grouped citation pages through its sources', async () => {
      const grouped = canvas.getByRole('button', { name: 'Source 2: Designing REST APIs for content, and 1 more' });
      await userEvent.click(grouped);
      const card = await page.findByRole('dialog');
      await waitFor(() => expect(within(card).getByText('1 of 2')).toBeVisible());
      await userEvent.click(within(card).getByRole('button', { name: 'Next source' }));
      await waitFor(() => expect(within(card).getByText('2 of 2')).toBeVisible());
      await expect(within(card).getByRole('button', { name: 'Next source' })).toBeDisabled();
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(page.queryByRole('dialog')).toBeNull());
      await expect(grouped).toHaveFocus();
    });

    await step('hovering a citation opens its card without taking focus', async () => {
      const single = canvas.getAllByRole('button', { name: 'Source 1: Comment moderation that scales' })[0];
      await userEvent.hover(single);
      const card = await page.findByRole('dialog');
      await waitFor(() => expect(within(card).getByText(/Holding a first comment for review/)).toBeVisible());
      await expect(card).not.toContainElement(canvasElement.ownerDocument.activeElement);
      await userEvent.unhover(single);
      await waitFor(() => expect(page.queryByRole('dialog')).toBeNull());
    });

    await step('the schema opens nested objects', async () => {
      const schema = canvasElement.querySelector('[data-slot="schema-display"]');
      await expect(within(schema).getByRole('heading', { name: 'Response' })).toBeVisible();
      const thread = within(schema).getByRole('button', { name: /thread/ });
      await userEvent.click(thread);
      await waitFor(() => expect(thread).toHaveAttribute('aria-expanded', 'false'));
    });
  }
};
