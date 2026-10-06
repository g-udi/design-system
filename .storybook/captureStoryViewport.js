import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

/** Capture the visible test iframe at each scroll position without changing its viewport. */
export async function captureStoryViewport(context, path) {
  const frame = await context.frame();
  const iframe = await frame.frameElement();
  const previous = await frame.evaluate(() => ({ x: scrollX, y: scrollY }));
  const dimensions = await frame.evaluate(() => ({ width: innerWidth, height: innerHeight, documentHeight: document.documentElement.scrollHeight }));
  const last = Math.max(0, dimensions.documentHeight - dimensions.height);
  const positions = [...new Set(Array.from({ length: Math.ceil(last / dimensions.height) + 1 }, (_, index) => Math.min(index * dimensions.height, last)))];
  const images = [];
  const presentation = await iframe.evaluate(element => ({
    transform: element.style.getPropertyValue('transform'),
    transformPriority: element.style.getPropertyPriority('transform'),
    origin: element.style.getPropertyValue('transform-origin'),
    originPriority: element.style.getPropertyPriority('transform-origin')
  }));
  await mkdir(dirname(path), { recursive: true });
  try {
    await iframe.scrollIntoViewIfNeeded();
    const initialClip = await iframe.boundingBox();
    // Vitest scales its preview to fit the runner. Capture at the tested CSS pixel
    // size instead of quietly shrinking every image (for example 390px to 312px).
    if (initialClip && Math.abs(initialClip.width - dimensions.width) > 0.5) {
      await iframe.evaluate((element, scale) => {
        const transform = getComputedStyle(element).transform;
        element.style.setProperty('transform', `${transform === 'none' ? '' : transform} scale(${scale})`, 'important');
        element.style.setProperty('transform-origin', 'top left', 'important');
      }, dimensions.width / initialClip.width);
    }
    for (const top of positions) {
      await frame.evaluate(async (y) => {
        window.scrollTo({ top: y, left: 0, behavior: 'instant' });
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      }, top);
      const clip = await iframe.boundingBox();
      if (!clip) throw new Error('The Storybook test iframe is not visible.');
      const file = top === 0 ? path : path.replace(/\.png$/, `--scroll-${top}.png`);
      await iframe.screenshot({ path: file });
      images.push({ file, scrollY: top });
    }
  } finally {
    await iframe.evaluate((element, saved) => {
      for (const [property, value, priority] of [['transform', saved.transform, saved.transformPriority], ['transform-origin', saved.origin, saved.originPriority]]) {
        if (value) element.style.setProperty(property, value, priority);
        else element.style.removeProperty(property);
      }
    }, presentation);
    await frame.evaluate(({ x, y }) => window.scrollTo({ left: x, top: y, behavior: 'instant' }), previous);
  }
  await writeFile(path.replace(/\.png$/, '.json'), `${JSON.stringify({ ...dimensions, images }, null, 2)}\n`);
  return images;
}

/** Persist executed checks on the Node side; browser console output can be suppressed. */
export async function recordStoryAudit(_context, result) {
  const directory = process.env.GAUDI_AUDIT_REPORT_DIR;
  if (directory) {
    await mkdir(directory, { recursive: true });
    const name = `${result.id}-${result.theme}`.replace(/[^a-zA-Z0-9_-]/g, '_');
    await writeFile(resolve(directory, `${name}.json`), `${JSON.stringify({ ...result, recordedAt: new Date().toISOString() }, null, 2)}\n`);
  }
  console.info(`GAUDI_STORY_AUDIT ${JSON.stringify(result)}`);
}
