import { page } from 'vitest/browser';

export const auditWidths = [320, 375, 390, 639, 640, 641, 767, 768, 769, 1023, 1024, 1025, 1279, 1280, 1281, 1440, 1535, 1536, 1537, 1920];

const describe = (element) => `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''} ${element.getAttribute('data-slot') || element.className || ''}`.slice(0, 180);

export async function auditStoryLayout({ canvasElement, id }) {
  const previous = { width: innerWidth, height: innerHeight };
  const failures = [];
  const checks = [];
  try {
    for (const width of auditWidths) {
      await page.viewport(width, 900);
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const actualWidth = document.documentElement.clientWidth;
      const scrollWidth = document.documentElement.scrollWidth;
      const overflow = scrollWidth > actualWidth + 1;
      checks.push({ width, actualWidth, scrollWidth });
      if (innerWidth !== width) failures.push(`${width}px: viewport did not resize`);
      if (overflow) {
        const offenders = [...document.body.querySelectorAll('*')].filter(element => {
          const rect = element.getBoundingClientRect();
          if (!rect.width || !rect.height || rect.right <= actualWidth + 1 || element.closest('[hidden], [aria-hidden="true"], [inert]')) return false;
          for (let parent = element.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
            if (['hidden', 'clip', 'auto', 'scroll'].includes(getComputedStyle(parent).overflowX)) return false;
          }
          return true;
        }).slice(0, 5).map(describe);
        failures.push(`${width}px: document is ${scrollWidth}px; ${offenders.join('; ')}`);
      }
    }
    const guide = canvasElement.querySelector('.ds-guide-page');
    if (guide) {
      const title = guide.querySelector('h1');
      if (!title || getComputedStyle(title).fontSize !== '28px') failures.push('Guide title does not use the shared 28px scale');
      const intro = guide.querySelector('header p');
      if (intro && getComputedStyle(intro).fontSize !== '13px') failures.push('Guide intro does not use the shared 13px scale');
    }
  } finally {
    await page.viewport(previous.width, previous.height);
  }
  console.info(`GAUDI_STORY_AUDIT ${JSON.stringify({ id, theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light', checks, failures })}`);
  if (failures.length) throw new Error(`${id}\n${failures.join('\n')}`);
}
