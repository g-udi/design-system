import {
  Alert,
  AlertDescription,
  AlertTitle
} from '../../../../src/components/core/Banner/parts/alert-extended.jsx';
export function Pattern() {
  return (
    <Alert>
      <AlertTitle>Alert!</AlertTitle>
      <AlertDescription>
        This is an alert with a title and description.
      </AlertDescription>
    </Alert>
  );
}
