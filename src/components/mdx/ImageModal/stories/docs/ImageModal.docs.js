import { p, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "MDX/ImageModal": {
    ...definition('A focused view of an article image with a caption and dismiss action.', [p('isOpen', 'boolean', '—', 'Controlled modal visibility.'), p('onClose', '() => void', '—', 'Close request from the modal.'), p('src / alt', 'string', '—', 'Image source and descriptive alternative text.'), p('caption', 'ReactNode', '—', 'Supporting image context.')], 'Provide alternative text, preserve focus containment and return focus to the image trigger on dismissal.'),
    usage: "<ImageModal src='/static/images/art/0.svg' alt='Lavender gradient artwork' />"
  }
};
