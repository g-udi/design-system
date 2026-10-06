import {
  p,
  children,
  className,
  definition,
} from '../../../../../docs/components/referenceProps.js';

export default {
  'Core/SignaturePad': {
    ...definition(
      'A composable signature input with pressure-aware SVG ink, undo and redo, native forms, saved previews, and image or JSON export.',
      [
        p(
          'value / defaultValue / onValueChange',
          'SignaturePadStroke[] / function',
          '[]',
          'Controlled or initial strokes. A stroke is { points: [x, y, diameter][], color? }. Changes fire once per completed stroke or history action.',
        ),
        p(
          'disabled / readOnly / invalid',
          'boolean',
          'false',
          'Disabled prevents interaction and form submission; readOnly allows saving existing ink. Invalid marks the drawing area.',
        ),
        p(
          'name / form / required / format',
          'string / string / boolean / svg | png | jpeg | json',
          '— / — / false / svg',
          'Native form field name, external form association, validation, and submission format. Reset restores defaultValue and clears history.',
        ),
        p(
          'color',
          'CSS color',
          'currentColor',
          'Optional ink color recorded per stroke; unset ink follows the theme. Export defaults to black.',
        ),
        p(
          'minWidth / maxWidth',
          'number',
          '0.8 / 3.2',
          'Minimum and maximum ink diameter in CSS pixels. Equal values produce a constant line.',
        ),
        p(
          'smoothing',
          'number',
          '0.5',
          '0–1 smoothing; higher values soften the curve.',
        ),
        p(
          'sizing',
          'auto | pressure | velocity',
          'auto',
          'Auto reads pen pressure and uses speed for mouse or touch.',
        ),
        p(
          'pointerTypes',
          '(mouse | touch | pen)[]',
          'all',
          'Filter input devices, such as ["pen"] to ignore touch.',
        ),
        p(
          'onStrokeStart / onStrokeEnd',
          'function',
          '—',
          'Receive { pointerType } when drawing starts and the completed stroke when it ends. Cancelled strokes are discarded.',
        ),
        p(
          'apiRef / useSignaturePad()',
          'ref / hook',
          '—',
          'Access strokes, isEmpty, isDrawing, canUndo, canRedo, clear, undo, redo, focus, toSVG, toDataURL, toBlob, and serialize.',
        ),
        p(
          'labels',
          'object',
          'English labels',
          'Override drawing instructions, placeholder, state announcements, and default button labels. Area and Preview accept their own ARIA names.',
        ),
        p(
          'SignaturePadArea.variant',
          'default | muted | ghost',
          'default',
          'Drawing surface appearance. Root sizing and state props are shared with every part.',
        ),
        p(
          'SignaturePadControls.position',
          'top-start | top-end | bottom-start | bottom-end',
          'top-end',
          'Pins controls inside the drawing surface; a regular flex row can place them outside.',
        ),
        p(
          'SignaturePadSave.format / options / onSave',
          'format / export options / (value, strokes) => void',
          'png / — / —',
          'Serialize to a data URL or JSON and pass it to the host. Saving performs no download or upload itself.',
        ),
        p(
          'SignaturePadPreview.strokes / padding / color',
          'strokes / number / CSS color',
          '— / 4 / currentColor',
          'A standalone SVG preview cropped to its ink; aria-label names its purpose.',
        ),
        p(
          'export options',
          'object',
          'padding 8; raster scale 2',
          'width and height set a fixed frame. Otherwise crop includes ink thickness and padding. background, color, scale, type, and quality configure output.',
        ),
        children,
        className,
      ],
      'Give the area a visible label and useful instructions. Drawing requires a pointer, so compose a typed-name alternative with Core Tabs and Input when the workflow needs keyboard-only entry. Undo/redo shortcuts apply only within the area, respect editable overlays and IME, and do not capture page shortcuts. Cancel a live stroke with Escape. Clear and exhausted history controls return focus to the area.',
      [
        'Compose SignaturePadArea inside SignaturePad; guide, placeholder, controls, and save actions are optional.',
        'Store the stroke array to reopen and edit a signature. A changed controlled value clears history; an equivalent deep copy preserves it.',
        'Applications own consent, document identity, validation policy, upload, persistence, and any signing audit trail.',
      ],
    ),
    usage:
      "import { SignaturePad, SignaturePadArea, SignaturePadGuide, SignaturePadPlaceholder, SignaturePadUndo, SignaturePadRedo, SignaturePadClear, SignaturePadSave } from '@gaudi/design-system/core/SignaturePad';\n\n<SignaturePad name='signature' required onValueChange={setStrokes}>\n  <SignaturePadArea aria-label='Recipient signature'>\n    <SignaturePadGuide />\n    <SignaturePadPlaceholder />\n  </SignaturePadArea>\n  <div className='flex flex-wrap gap-2'>\n    <SignaturePadUndo />\n    <SignaturePadRedo />\n    <SignaturePadClear />\n    <SignaturePadSave format='svg' onSave={handleSave} />\n  </div>\n</SignaturePad>",
  },
};
