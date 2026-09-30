// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
export function Pattern() {
  return (
    <Card className='w-full max-w-xs'>
      <CardHeader className='border-b'>
        <CardTitle>Header with Border</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          The footer has a border-t class applied, creating a visual separation
          between the content and footer sections.
        </p>
      </CardContent>
      <CardFooter className='border-t'>
        <Button variant='outline' className='w-full'>
          Action
        </Button>
      </CardFooter>
    </Card>
  );
}
