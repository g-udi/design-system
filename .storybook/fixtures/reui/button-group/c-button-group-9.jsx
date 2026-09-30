// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button aria-label='Send' variant='outline' size='icon'>
          <RegistryIcon lucide='SendIcon' aria-hidden='true' />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <InputGroup>
          <InputGroupInput
            aria-label='Send a message...'
            placeholder='Send a message...'
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupAddon align='inline-end'>
                  <RegistryIcon lucide='AudioLinesIcon' aria-hidden='true' />
                </InputGroupAddon>
              </TooltipTrigger>
              <TooltipContent>Voice Mode</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  );
}
