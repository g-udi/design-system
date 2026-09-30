// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Card className='w-full max-w-xs gap-2 pt-5'>
      <CardHeader>
        <CardTitle>Need a help in Claim?</CardTitle>
      </CardHeader>
      <CardContent className='mb-2'>
        <p>
          Go to this step by step guideline process on how to certify for your
          weekly benefits:
        </p>
      </CardContent>
      <CardFooter className='py-2'>
        <Button variant='link' className='px-0'>
          See our guideline
          <RegistryIcon lucide='ExternalLinkIcon' aria-hidden='true' />
        </Button>
      </CardFooter>
    </Card>
  );
}
