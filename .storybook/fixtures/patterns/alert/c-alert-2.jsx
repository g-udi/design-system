import {
  Alert,
  AlertDescription,
  AlertTitle
} from '../../../../src/components/core/Banner/parts/alert-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const alerts = [
  { variant: 'default', title: 'Heads up', body: 'An alert with a title and description, no icon.' },
  { variant: 'default', icon: 'CircleCheckIcon', title: 'Draft saved', body: 'The default variant with a leading icon.' },
  { variant: 'info', icon: 'InfoIcon', title: 'Maintenance window', body: 'Search is read-only on Sunday, 02:00 to 04:00 UTC.' },
  { variant: 'success', icon: 'CircleCheckIcon', title: 'Deployment complete', body: 'Version 2.4 is live in production.' },
  { variant: 'warning', icon: 'AlertTriangleIcon', title: 'Storage almost full', body: 'You have used 92% of your plan. Archive old files or upgrade.' },
  { variant: 'destructive', icon: 'CircleAlertIcon', title: 'Sync failed', body: 'We could not reach the server. Try again in a moment.' },
  { variant: 'invert', icon: 'BellIcon', title: 'New sign-in', body: 'Your account was accessed from a new device in Berlin.' }
];

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-lg gap-2'>
      {alerts.map(({ variant, icon, title, body }) => (
        <Alert key={title} variant={variant}>
          {icon ? <RegistryIcon lucide={icon} /> : null}
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{body}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
