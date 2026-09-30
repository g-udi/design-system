// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../../../../src/components/core/Accordion/parts/collapsible.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Frame className='w-full' stacked>
      <Collapsible defaultOpen className='group/collapsible'>
        <CollapsibleTrigger className='w-full'>
          <FrameHeader className='flex grow flex-row items-center justify-between gap-2'>
            <FrameTitle>Start</FrameTitle>
            <RegistryIcon
              lucide='ChevronRightIcon'
              className='text-ui-muted-foreground size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90'
            />
          </FrameHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <FramePanel>
            <p className='text-ui-muted-foreground text-sm'>
              Initialize run to answer a user question using uploaded files and
              the knowledge base; cite sources when relevant.
            </p>
          </FramePanel>
        </CollapsibleContent>
      </Collapsible>
    </Frame>
  );
}
