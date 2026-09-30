// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
export function Pattern() {
  return (
    <div role='status' aria-label='Loading' className='flex items-center justify-center gap-1.5'>
      <span className='bg-ui-primary size-2 animate-pulse rounded-full [animation-delay:-0.8s]' />
      <span className='bg-ui-primary size-2 animate-pulse rounded-full [animation-delay:-0.4s]' />
      <span className='bg-ui-primary size-2 animate-pulse rounded-full' />
    </div>
  );
}
