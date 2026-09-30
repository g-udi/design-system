// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { IconTile } from '../../../../src/components/core/Icon/parts/icon-tile-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center gap-3'>
      <IconTile
        aria-hidden='true'
        className='border-ui-primary/10 bg-ui-primary/10 text-ui-primary dark:border-ui-primary/25 dark:bg-ui-primary/15'
      >
        <RegistryIcon lucide='StarIcon' />
      </IconTile>
      <IconTile
        aria-hidden='true'
        className='border-success/15 bg-success/10 text-success-foreground dark:border-success/25 dark:bg-success/15 dark:text-success'
      >
        <RegistryIcon lucide='CircleCheckIcon' />
      </IconTile>
      <IconTile
        aria-hidden='true'
        className='border-warning/15 bg-warning/10 text-warning-foreground dark:border-warning/25 dark:bg-warning/15 dark:text-warning'
      >
        <RegistryIcon lucide='ClockIcon' />
      </IconTile>
      <IconTile
        aria-hidden='true'
        className='border-ui-destructive/15 bg-ui-destructive/10 text-ui-destructive-foreground dark:border-ui-destructive/25 dark:bg-ui-destructive/15 dark:text-ui-destructive'
      >
        <RegistryIcon lucide='CircleAlertIcon' />
      </IconTile>
    </div>
  );
}
