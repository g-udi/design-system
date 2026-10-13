import config from './playground.config.json';
import type { ComponentEntry, Prop } from '@/lib/catalogue';

/** Value a control holds; `undefined` means "not set" (the prop is left out of the render and the code). */
export type ControlValue = string | number | boolean | undefined;

export type Control =
  | { kind: 'enum'; name: string; options: (string | number)[]; defaultValue?: string | number; segmented: boolean }
  | { kind: 'boolean'; name: string; defaultValue: boolean }
  | { kind: 'text'; name: string; defaultValue?: string }
  | { kind: 'number'; name: string; defaultValue?: number; range?: [number, number, number] };

export interface PlaygroundSpec {
  id: string;
  tag: string;
  importLine: string;
  controls: Control[];
  initial: Record<string, ControlValue>;
}

interface Override {
  values?: Record<string, string | number | boolean>;
  options?: Record<string, (string | number)[]>;
  types?: Record<string, 'text' | 'number' | 'boolean'>;
  hide?: string[];
  noDefault?: string[];
  range?: Record<string, number[]>;
}

const overrides = (config as { components: Record<string, Override> }).components;
export const hasPlayground = (id: string) => Boolean(overrides[id]);

// Props a playground never controls: plumbing, styling hooks and anything that is not a plain value.
const SKIP_NAMES = new Set(['className', 'classNames', 'id', 'ref', 'style', 'key', 'asChild', 'as']);
const SKIP_TYPE = /=>|\{|\[\]|Array|Ref\b|Ref<|object|function|ElementType|ReactElement|component|Record|HTMLAttributes|CountryCode/i;
const TYPE_WORDS = new Set(['string', 'number', 'boolean', 'ReactNode', 'any', 'undefined', 'null']);

/** "shape / surface" with type "a | b / c | d" → two props. Names that cannot be split cleanly are dropped. */
function expand(prop: Prop): Prop[] {
  const names = prop.name.split(/\s*\/\s*/);
  if (names.length === 1) return [prop];
  const types = prop.type.split(/\s+\/\s+/);
  const defaults = (prop.default || '').split(/\s+\/\s+/);
  if (types.length !== 1 && types.length !== names.length) return [];
  return names.map((name, index) => ({
    ...prop,
    name,
    type: types.length === 1 ? types[0] : types[index],
    default: defaults.length === names.length ? defaults[index] : defaults.length === 1 ? prop.default : null
  }));
}

const literal = (token: string): string | number | null => {
  const clean = token.trim().replace(/^['"]|['"]$/g, '');
  if (!clean || TYPE_WORDS.has(clean) || /[^\w-]/.test(clean)) return null;
  return /^-?\d+(\.\d+)?$/.test(clean) ? Number(clean) : clean;
};

function controlFor(prop: Prop, override: Override): Control | null {
  const { name } = prop;
  const forced = override.types?.[name];
  const noDefault = override.noDefault?.includes(name);
  const rawDefault = noDefault ? null : (prop.default ?? '').trim().replace(/^['"]|['"]$/g, '');
  const options = override.options?.[name];

  if (options) {
    const defaultValue = options.find((option) => String(option) === rawDefault);
    return { kind: 'enum', name, options, defaultValue, segmented: segmentedFits(options) };
  }
  if (!forced && SKIP_TYPE.test(prop.type)) return null;

  const parts = prop.type.split('|').map((part) => part.trim()).filter(Boolean);
  const kind = forced || (parts.length === 1 && parts[0] === 'boolean' ? 'boolean'
    : parts.length && parts.every((part) => part === 'number' || part.startsWith('number ')) ? 'number'
      : parts.some((part) => part === 'string' || part === 'ReactNode') ? 'text'
        : 'enum');

  if (kind === 'boolean') return { kind, name, defaultValue: rawDefault === 'true' };
  if (kind === 'number') {
    const range = override.range?.[name];
    const parsed = Number(rawDefault);
    return {
      kind,
      name,
      defaultValue: rawDefault && Number.isFinite(parsed) ? parsed : undefined,
      range: range ? [range[0] ?? 0, range[1] ?? 100, range[2] ?? 1] : undefined
    };
  }
  if (kind === 'text') return { kind, name, defaultValue: rawDefault && rawDefault !== 'null' ? rawDefault : undefined };

  // In a literal union, words such as `number` or `date` are option names (Input `type`), not types.
  const literals = parts.map((part) => (part === 'number' || part === 'string' ? part : literal(part)));
  if (literals.length < 2 || literals.some((value) => value === null)) return null;
  const values = literals as (string | number)[];
  const defaultValue = values.find((value) => String(value) === rawDefault);
  return { kind: 'enum', name, options: values, defaultValue, segmented: segmentedFits(values) };
}

const segmentedFits = (options: (string | number)[]) => options.length <= 4 && options.every((option) => String(option).length <= 8);

/** Builds the playground controls for one owner from its props metadata plus the override map. */
export function buildPlayground(entry: ComponentEntry, importLine: string): PlaygroundSpec | null {
  const override = overrides[entry.id];
  if (!override) return null;
  const hidden = new Set(override.hide || []);
  const props = entry.props.flatMap(expand);
  const names = new Set(props.map((prop) => prop.name));
  const controls: Control[] = [];
  for (const prop of props) {
    if (prop.subcomponent || prop.passthrough || prop.api || prop.part) continue;
    if (SKIP_NAMES.has(prop.name) || hidden.has(prop.name) || /^on[A-Z]/.test(prop.name)) continue;
    if (!/^[a-z][A-Za-z0-9]*$/.test(prop.name) || prop.name.endsWith('ClassName')) continue; // "Native input props", "AvatarGroup", "Slot.part"
    // A controlled prop next to its uncontrolled twin (checked/defaultChecked): keep the uncontrolled one.
    if (names.has(`default${prop.name[0].toUpperCase()}${prop.name.slice(1)}`)) continue;
    const control = controlFor(prop, override);
    if (control) controls.push(control);
  }
  // Props the metadata omits (for example native attributes) can be added through `types`.
  for (const [name, type] of Object.entries(override.types || {})) {
    if (controls.some((control) => control.name === name) || names.has(name)) continue;
    const control = controlFor({ name, type, default: null, required: false, description: '' }, override);
    if (control) controls.push(control);
  }
  // Children first, then the order the metadata lists.
  controls.sort((a, b) => Number(b.name === 'children') - Number(a.name === 'children'));

  const initial: Record<string, ControlValue> = {};
  for (const control of controls) {
    const value = override.values?.[control.name];
    if (value === undefined) continue;
    if (control.kind === 'enum' && !control.options.some((option) => option === value)) continue;
    initial[control.name] = value;
  }
  const tag = importLine.match(/^import \{?\s*([A-Za-z0-9_$]+)/)?.[1] || entry.name.replace(/[^A-Za-z0-9_$]/g, '');
  return { id: entry.id, tag, importLine, controls, initial };
}
