export default {
  "Core/Popover": {
    'accessibility': 'The trigger is a DS button with aria-expanded; the panel is portalled, dismisses on Escape or an outside click, and returns focus to the trigger. Keep popover content short and non-modal.',
    'description': 'Popover renders compact positioned supporting content next to its trigger.',
    'props': [['trigger', 'ReactNode', '-', 'Label or content of the outline trigger button.'], ['children', 'ReactNode', '-', 'Panel content.'], ['side / align', 'top | right | bottom | left / start | center | end', 'bottom / center', 'Placement of the panel relative to the trigger.'], ['open / defaultOpen / onOpenChange / modal', 'boolean / boolean / function / boolean', '-', 'Controlled or initial open state, and whether outside content is inert while open.'], ['contentClassName', 'string', '-', 'Panel class override.'], ['className', 'string', '-', 'Trigger button class override.']],
    usage: "import { Popover } from '@gaudi/design-system';\n\n<Popover trigger='Open popover'>Compact supporting content.</Popover>"
  }
};
