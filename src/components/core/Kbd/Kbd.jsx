import { cn } from '../../../utilities/cn';
import { Kbd as KbdRoot, KbdGroup } from './parts/kbd.jsx';

const keyMap = {
  'alt': '⌥',
  'backspace': '⌫',
  'capslock': '⇪',
  'cmd': '⌘',
  'command': '⌘',
  'control': '⌃',
  'ctrl': '⌃',
  'delete': '⌫',
  'down': '↓',
  'end': 'End',
  'enter': '↵',
  'esc': 'Esc',
  'escape': 'Esc',
  'fn': 'fn',
  'help': '?',
  'home': 'Home',
  'left': '←',
  'meta': '⌘',
  'option': '⌥',
  'pagedown': 'PgDn',
  'pageup': 'PgUp',
  'return': '↵',
  'right': '→',
  'shift': '⇧',
  'space': '␣',
  'tab': '⇥',
  'up': '↑',
  'win': '⊞',
  'windows': '⊞'
};

const keyLabelMap = {
  'cmd': 'Command',
  'command': 'Command',
  'ctrl': 'Control',
  'esc': 'Escape',
  'meta': 'Command',
  'option': 'Option',
  'return': 'Enter',
  'win': 'Windows'
};

const kbdVariantConfig = {
  'base': 'inline-flex shrink-0 select-none items-center justify-center rounded-sm border font-sans font-medium leading-none tabular-nums',
  'defaults': {
    'size': 'md',
    'variant': 'raised'
  },
  'size': {
    'xs': 'h-4 min-w-4 px-1 text-xs',
    'sm': 'h-5 min-w-5 px-1 text-xs',
    'md': 'h-6 min-w-6 px-1.5 text-xs',
    'lg': 'h-7 min-w-7 px-2 text-sm'
  },
  'variant': {
    'flat': 'border-transparent bg-surface-muted text-text-muted',
    'outline': 'border-border bg-transparent text-text-muted',
    'raised': 'border-border bg-surface text-text shadow-[inset_0_-1px_0_var(--ds-color-border)]'
  }
};

export const kbdVariants = ({ className, size, variant } = {}) => {
  const resolvedSize = size || kbdVariantConfig.defaults.size;
  const resolvedVariant = variant || kbdVariantConfig.defaults.variant;

  return cn(
    kbdVariantConfig.base,
    kbdVariantConfig.size[resolvedSize],
    kbdVariantConfig.variant[resolvedVariant],
    className
  );
};

kbdVariants.variants = {
  'size': kbdVariantConfig.size,
  'variant': kbdVariantConfig.variant
};
kbdVariants.defaultVariants = kbdVariantConfig.defaults;

/** Keys from `keys` ('command,k') render as symbols with a spoken label; `children` render one literal key. */
const Kbd = ({ children, className, keys, size, variant, ...rest }) => {
  const classes = kbdVariants({ className, size, variant });

  if (!keys) return <KbdRoot className={ classes } { ...rest }>{children}</KbdRoot>;

  const keyList = keys.split(',').map((key) => key.trim().toLowerCase());
  const symbols = keyList.map((key) => keyMap[key] || key.toUpperCase());
  const label = keyList.map((key) => keyLabelMap[key] || key.charAt(0).toUpperCase() + key.slice(1)).join(' plus ');

  if (symbols.length === 1) return <KbdRoot className={ classes } aria-label={ label } { ...rest }>{symbols[0]}</KbdRoot>;

  return (
    <KbdGroup role='img' aria-label={ label } { ...rest }>
      {symbols.map((symbol, index) => (
        <KbdRoot key={ `${symbol}-${index}` } className={ classes } aria-hidden='true'>{symbol}</KbdRoot>
      ))}
    </KbdGroup>
  );
};

export default Kbd;
