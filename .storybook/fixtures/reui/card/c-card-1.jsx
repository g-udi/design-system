// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
export function Pattern() {
  return (
    <Card className='w-full max-w-xs'>
      <CardHeader>
        <CardTitle>Default Card</CardTitle>
        <CardDescription>
          This card uses the default size variant.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          The card component supports a size prop that defaults to
          &quot;default&quot; for standard spacing and sizing.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant='outline' className='w-full'>
          Action
        </Button>
      </CardFooter>
    </Card>
  );
}
