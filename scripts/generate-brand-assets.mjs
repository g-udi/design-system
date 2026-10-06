import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const artwork = `${root}src/icons/brands/artwork`;
const publicDir = `${root}.storybook/public`;
await mkdir(`${publicDir}/brand`, { recursive: true });
await mkdir(`${publicDir}/static/favicons`, { recursive: true });
const assets = {};
for (const name of ['logo', 'text']) {
  for (const tone of ['light', 'dark']) {
    const filename = `gaudi-${name}-${tone}.svg`;
    assets[`${name}-${tone}`] = await readFile(`${artwork}/${filename}`, 'utf8');
    await copyFile(`${artwork}/${filename}`, `${publicDir}/brand/${filename}`);
  }
}
const viewBox = svg => svg.match(/viewBox="([^"]+)"/)[1];
const paths = svg => svg.replace(/^.*?<title>.*?<\/title>/s, '').replace(/<\/svg>\s*$/, '');
const jsx = svg => paths(svg).replaceAll('fill="#000000"', 'fill="currentColor"').replaceAll('fill-rule=', 'fillRule=');
// Keep the supplied G intact, with the same inset in React, downloadable tiles and favicons.
const tileViewBox = '0 0 400 400';
const tileBackground = '<rect x="6" y="6" width="388" height="388" rx="48" fill="#ffffff" stroke="#dedede" stroke-width="12"/>';
const tileScale = 288 / 344;
const tileMark = `<g transform="translate(${56 + 16 * tileScale} ${56 + 22 * tileScale}) scale(${tileScale})">${paths(assets['logo-dark'])}</g>`;
const lightTile = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${tileViewBox}"><title>Gaudi</title>${tileBackground}${tileMark}</svg>`;
const darkTile = lightTile.replace('fill="#ffffff"', 'fill="#171717"').replace('stroke="#dedede"', 'stroke="#404040"').replace('fill="#000000"', 'fill="#ffffff"');
const component = (name, asset, width, height) => `
/** Official Gaudi artwork. Decorative when aria-hidden is supplied by its labelled parent. */
export function ${name}({ className, ...props }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox(asset)}" width="${width}" height="${height}"
    role="img" aria-label="Gaudi" focusable="false" className={cn('inline-block shrink-0 text-black dark:text-white', className)} {...props}>
    ${jsx(asset)}
  </svg>;
}
`;
await writeFile(`${root}src/icons/brands/gaudi.jsx`, `// Generated from the official SVGs in artwork/. Run pnpm brand:build after changing them.
import { cn } from '../../utilities/cn/index.js';

/** Official G tile. The dark background and white mark stay consistent in both themes. */
export function GaudiLogo({ className, tile = true, tone = 'dark', ...props }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox={tile ? '${tileViewBox}' : '${viewBox(assets['logo-dark'])}'} width="1em" height="1em"
    role="img" aria-label="Gaudi" focusable="false" className={cn('inline-block shrink-0 text-black dark:text-white', className)} {...props}>
    {tile ? <>${tileBackground.replace('fill="#ffffff"', "fill={tone === 'light' ? '#ffffff' : '#171717'}").replace('stroke="#dedede"', "stroke={tone === 'light' ? '#dedede' : '#404040'}").replace('stroke-width=', 'strokeWidth=')}${tileMark.replace('fill="#000000"', "fill={tone === 'light' ? '#000000' : '#ffffff'}")}</> : <>${jsx(assets['logo-dark'])}</>}
  </svg>;
}

/** Compact Gaudi branding: the official tile followed by an ordinary text label. */
export function GaudiBrand({ className, logoClassName, ...props }) {
  return <span className={cn('inline-flex shrink-0 items-center gap-2 whitespace-nowrap font-semibold', className)} {...props}>
    <GaudiLogo aria-hidden="true" className={cn('size-6', logoClassName)} />
    <span>Gaudi</span>
  </span>;
}
${component('GaudiWordmark', assets['text-dark'], '3.984em', '1em')}`);

for (const [tone, svg] of [['light', lightTile], ['dark', darkTile]]) {
  await writeFile(`${publicDir}/brand/gaudi-icon-${tone}.svg`, svg);
  await writeFile(`${publicDir}/brand/gaudi-icon-${tone}.png`, await sharp(Buffer.from(svg)).resize(512, 512).png().toBuffer());
}
await writeFile(`${publicDir}/static/favicons/favicon.svg`, darkTile);
await writeFile(`${publicDir}/favicon.svg`, darkTile);
const raster = async (size, background = null) => {
  let source = sharp(Buffer.from(darkTile), { density: 384 }).resize(size, size);
  if (background) source = source.flatten({ background });
  return source.png().toBuffer();
};
const iconPngs = [];
for (const size of [16, 32, 48]) {
  const png = await raster(size);
  await writeFile(`${publicDir}/static/favicons/favicon-${size}x${size}.png`, png);
  iconPngs.push({ size, png });
}
// ICO embeds the same PNGs; no separate hand-drawn small-size mark.
const directory = Buffer.alloc(6 + 16 * iconPngs.length);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(iconPngs.length, 4);
let offset = directory.length;
iconPngs.forEach(({ size, png }, index) => {
  const entry = 6 + index * 16;
  directory[entry] = directory[entry + 1] = size;
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(png.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += png.length;
});
const ico = Buffer.concat([directory, ...iconPngs.map(({ png }) => png)]);
await writeFile(`${publicDir}/static/favicons/favicon.ico`, ico);
await writeFile(`${publicDir}/favicon.ico`, ico);
for (const [filename, size] of [['apple-touch-icon.png', 180], ['android-chrome-192x192.png', 192], ['android-chrome-512x512.png', 512]]) {
  await writeFile(`${publicDir}/static/favicons/${filename}`, await raster(size, '#171717'));
}
await writeFile(`${publicDir}/static/favicons/site.webmanifest`, JSON.stringify({
  name: 'Gaudi Design System', short_name: 'Gaudi', start_url: '../../', display: 'standalone',
  background_color: '#171717', theme_color: '#171717', icons: [192, 512].map(size => ({
    src: `android-chrome-${size}x${size}.png`, sizes: `${size}x${size}`, type: 'image/png', purpose: 'any'
  }))
}, null, 2) + '\n');
console.log('Official Gaudi components, Storybook artwork and favicons generated.');
