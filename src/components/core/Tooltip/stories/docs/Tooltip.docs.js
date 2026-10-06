import { p, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Core/Tooltip": {
    ...definition('Brief contextual help attached to an independently labelled control.', [p('children', 'ReactElement', 'Required', 'Single focusable, ref-forwarding trigger.'), p('content', 'ReactNode', '—', 'Supporting tooltip text.'), p('side', 'top | right | bottom | left', 'top', 'Preferred placement; collision handling may adjust it.'), p('delayDuration', 'number', '300', 'Hover delay in milliseconds.'), p('open / defaultOpen / onOpenChange', 'boolean / function', 'uncontrolled', 'Controlled or initial visibility.')], 'Tooltips open on focus and hover, dismiss with Escape and do not replace the control’s accessible name. Use Popover for interactive content.'),
    usage: "import Tooltip from '@gaudi/design-system/core/Tooltip';\nimport Button from '@gaudi/design-system/core/Button';\n\n<Tooltip content='Copy link'><Button aria-label='Copy link' onClick={copyLink}>Copy</Button></Tooltip>"
  }
};
