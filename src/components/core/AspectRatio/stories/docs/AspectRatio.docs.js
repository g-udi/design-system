import { p, children, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Core/AspectRatio": {
    ...definition('Keep media at a stable aspect ratio as its container resizes.', [p('ratio', 'number', '1', 'Width divided by height; use 16 / 9 for landscape media.'), children, className], 'Supply alternative text for images and accessible names for embedded media.'),
    usage: "import { AspectRatio } from '@gaudi/design-system/core/AspectRatio';\n\n<AspectRatio ratio={16 / 9}>\n  <img src={cover.src} alt={cover.alt} className='h-full w-full object-cover' />\n</AspectRatio>"
  }
};
