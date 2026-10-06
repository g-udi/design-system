export const p = (name, type, value, description) => [name, type, value, description];
export const children = p('children', 'ReactNode', '—', 'Content composed from the exported parts.');
export const className = p('className', 'string', '—', 'Additional classes on the outer element.');
export const nativeInput = p('Native input props / ref', 'InputHTMLAttributes<HTMLInputElement>', '—', 'Forwards value, defaultValue, onChange, disabled, required, name, autocomplete and ARIA attributes to the input.');
export const open = [p('open / defaultOpen', 'boolean', '—', 'Controlled or initial open state. Use one state model for the lifetime of the component.'), p('onOpenChange', '(open: boolean) => void', '—', 'Responds to open and close requests.')];
export const definition = (description, props, accessibility, notes = []) => ({description, props, accessibility, notes});
