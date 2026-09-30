// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../../../../src/components/core/Accordion/parts/collapsible.jsx';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='h-40 w-full max-w-xs'>
      <Card className='py-3'>
        <CardContent className='px-3'>
          <Collapsible>
            <CollapsibleTrigger className='flex w-full cursor-pointer items-center justify-between text-sm'>
              <span>How do I reset my password?</span>
              <RegistryIcon
                lucide='ChevronDownIcon'
                aria-hidden='true'
                className='text-ui-muted-foreground size-4 shrink-0 transition-transform in-data-[state=open]:rotate-180'
              />
            </CollapsibleTrigger>
            <CollapsibleContent className='data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
              <div className='text-ui-muted-foreground pt-3 text-sm'>
                You can reset your password by clicking the &quot;Forgot
                Password&quot; link on the login page. We&apos;ll send you an
                email with instructions to create a new password.
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
}
