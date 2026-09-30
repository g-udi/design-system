import { page } from 'vitest/browser';

export const catalogueWidths = [
  320, 375, 390, 639, 640, 767, 768, 1023, 1024, 1280, 1440, 1920
];

/** Portalled dialogs need their own containment check while open. */
export async function verifyResponsiveDialog(dialog) {
  const previous = { width: window.innerWidth, height: window.innerHeight };
  const failures = [];
  await Promise.all(dialog.getAnimations().map((animation) => animation.finished));
  try {
    for (const width of [...catalogueWidths, 769]) {
      await page.viewport(width, 900);
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const rect = dialog.getBoundingClientRect();
      const footer = dialog.querySelector('[data-slot="alert-dialog-footer"]');
      const footerRect = footer.getBoundingClientRect();
      if (
        window.innerWidth !== width ||
        rect.left < 15 || rect.right > width - 15 ||
        dialog.scrollWidth > dialog.clientWidth + 1 ||
        footerRect.left < rect.left - 1 || footerRect.right > rect.right + 1
      ) failures.push(`${width}px: dialog or footer overflows its container`);
    }
  } finally {
    await page.viewport(previous.width, previous.height);
  }
  if (failures.length) throw new Error(failures.join('\n'));
}

/** Every catalogue example gets the same breakpoint and overflow contract. */
export async function verifyResponsiveCatalogue({ canvasElement, id }) {
  const previous = { width: window.innerWidth, height: window.innerHeight };
  const failures = [];
  try {
    for (const width of catalogueWidths) {
      await page.viewport(width, 900);
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      );
      if (window.innerWidth !== width)
        throw new Error(`Viewport did not resize to ${width}px`);
      const root = canvasElement.querySelector('.ds-catalogue-frame, .ds-guide-page');
      if (!root) throw new Error(`${id}: catalogue frame did not render`);
      if (document.documentElement.scrollWidth > window.innerWidth + 1) {
        const offenders = [...root.querySelectorAll('*')]
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            if (
              !rect.width ||
              !rect.height ||
              rect.right <= width + 1 ||
              element.closest('[aria-hidden=true], [hidden], [inert]')
            )
              return false;
            for (
              let parent = element.parentElement;
              parent && parent !== root;
              parent = parent.parentElement
            ) {
              if (
                ['auto', 'scroll', 'hidden', 'clip'].includes(
                  getComputedStyle(parent).overflowX
                )
              )
                return false;
            }
            return true;
          })
          .slice(0, 3)
          .map(
            (element) =>
              `${element.tagName.toLowerCase()} ${element.getAttribute('data-slot') || element.className}`
          );
        failures.push(
          `${width}px: ${offenders.join('; ') || 'document overflow'} (${document.documentElement.scrollWidth}px, root x=${root.getBoundingClientRect().x} w=${root.getBoundingClientRect().width}; ${[
            ...root.querySelectorAll('*')
          ]
            .filter((e) => e.getBoundingClientRect().right > width)
            .slice(0, 4)
            .map(
              (e) =>
                `${e.tagName}/${e.getAttribute('data-slot')}: x=${e.getBoundingClientRect().x} w=${e.getBoundingClientRect().width} ${e.getAttribute('style') || ''}`
            )
            .join('; ')})`
        );
      }
    }
  } finally {
    await page.viewport(previous.width, previous.height);
  }
  if (failures.length)
    throw new Error(`${id} responsive overflow\n${failures.join('\n')}`);
}
