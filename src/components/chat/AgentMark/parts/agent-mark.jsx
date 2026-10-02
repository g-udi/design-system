import { cn } from '../../../../utilities/cn/index.js';
import { createVariants } from '../../../../utilities/variants/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { ActivityIndicator } from '../../ActivityIndicator/parts/activity-indicator.jsx';

const agentMarkVariants = createVariants({
  base: 'ds-part-agent-mark relative inline-grid shrink-0 place-items-center rounded-(--ds-radius-card) font-semibold select-none',
  variants: {
    size: {
      xs: 'size-5 text-xs [&_svg]:size-3',
      sm: 'size-6 text-xs [&_svg]:size-3.5',
      md: 'size-8 text-sm [&_svg]:size-4',
      lg: 'size-10 text-base [&_svg]:size-5'
    },
    tone: {
      accent: 'bg-accent-subtle text-accent',
      discovery: 'bg-discovery-subtle text-discovery',
      neutral: 'bg-surface-muted text-text border',
      solid: 'bg-accent text-accent-foreground'
    }
  },
  defaultVariants: { size: 'md', tone: 'accent' }
});

const initials = (name = '') => name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase();

/**
 * The assistant's mark: an icon, an image or the agent's initials on a token-coloured tile. `state`
 * adds a small ActivityIndicator badge (thinking, streaming, tool, done, error) at the corner.
 *
 * The mark is named (`role='img'`) unless `decorative` is set, for example when a visible name sits
 * beside it.
 */
function AgentMark({ name = 'Gaudi', icon = 'Sparkles', image, monogram = false, size = 'md', tone = 'accent', state, decorative = false, labels, className, ...props }) {
  const content = image
    ? <img src={image} alt='' className='size-full rounded-[inherit] object-cover' />
    : monogram
      ? <span aria-hidden='true'>{initials(name)}</span>
      : <RegistryIcon lucide={icon} />;
  return (
    <span
      data-slot='agent-mark'
      data-state={state || undefined}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative ? true : undefined}
      className={cn(agentMarkVariants({ size, tone }), className)}
      {...props}
    >
      {content}
      {state && state !== 'idle' ? (
        <ActivityIndicator
          state={state}
          variant='badge'
          labels={labels}
          decorative={decorative}
          className='absolute -end-1 -bottom-1'
        />
      ) : null}
    </span>
  );
}

export { AgentMark, agentMarkVariants };
