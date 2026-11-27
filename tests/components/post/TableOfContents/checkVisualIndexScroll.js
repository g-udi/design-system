import { expect, spyOn, userEvent, waitFor, within } from 'storybook/test';

const afterPaint = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

export async function checkVisualIndexScroll(canvasElement) {
  const canvas = within(canvasElement);
  const trigger = await canvas.findByRole('button', { name: /Diagrams & tables/u });
  const contents = canvas.getByRole('region', { name: 'Contents links' });
  const article = canvas.getByRole('region', { name: 'Article reading viewport' });
  const links = trigger.closest('[data-slot="collapsible"]').querySelectorAll('a');
  const lastLink = links[links.length - 1];
  const originalMaxHeight = contents.style.getPropertyValue('max-height');
  const originalMaxHeightPriority = contents.style.getPropertyPriority('max-height');
  const originalScrollTop = contents.scrollTop;
  let mediaCommands;
  const scrollTo = spyOn(contents, 'scrollTo');

  const expectRevealed = async () => {
    await waitFor(() => {
      const viewportBounds = contents.getBoundingClientRect();
      const linkBounds = lastLink.getBoundingClientRect();
      expect(contents.scrollHeight).toBeGreaterThan(contents.clientHeight);
      expect(Math.abs(contents.scrollHeight - contents.clientHeight - contents.scrollTop)).toBeLessThanOrEqual(1);
      expect(linkBounds.top).toBeGreaterThanOrEqual(viewportBounds.top - 1);
      expect(linkBounds.bottom).toBeLessThanOrEqual(viewportBounds.bottom + 1);
    });
    await expect(trigger).toHaveFocus();
  };

  try {
    // Force a real overflow case at any story width, using the rendered control's scale.
    contents.style.maxHeight = `${Math.max(trigger.getBoundingClientRect().height * 3, contents.scrollHeight / 2)}px`;
    contents.scrollTop = contents.scrollHeight;
    trigger.focus({ preventScroll: true });
    const readingPosition = article.scrollTop;
    const pagePosition = { x: window.scrollX, y: window.scrollY };

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expectRevealed();
    await expect(article.scrollTop).toBe(readingPosition);
    await expect({ x: window.scrollX, y: window.scrollY }).toEqual(pagePosition);

    scrollTo.mockClear();
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await afterPaint();
    // Removing content may clamp scrollTop naturally; collapsing must not initiate a scroll.
    await expect(scrollTo).not.toHaveBeenCalled();
    await expect(trigger).toHaveFocus();

    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { commands } = await import('vitest/browser');
      mediaCommands = commands;
      await commands.emulateStoryMedia({ reducedMotion: 'reduce' });
      await afterPaint();
      scrollTo.mockClear();
      await userEvent.keyboard('{Enter}');
      await expectRevealed();
      await expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ behavior: 'auto' }));
    } else {
      await userEvent.keyboard('{Enter}');
      await expectRevealed();
    }
    await expect(article.scrollTop).toBe(readingPosition);
    await expect({ x: window.scrollX, y: window.scrollY }).toEqual(pagePosition);
  } finally {
    scrollTo.mockRestore();
    if (mediaCommands) {
      await mediaCommands.emulateStoryMedia({ reducedMotion: null });
      await afterPaint();
    }
    if (originalMaxHeight) contents.style.setProperty('max-height', originalMaxHeight, originalMaxHeightPriority);
    else contents.style.removeProperty('max-height');
    contents.scrollTop = originalScrollTop;
  }
}
