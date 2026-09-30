'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const services = ['Resend API', 'Stripe API', 'GitHub API'];
const environments = ['Production', 'Staging', 'Development'];
const versions = ['v2', 'v1', 'beta'];
export function Pattern() {
  const [service, setService] = useState(services[0]);
  const [environment, setEnvironment] = useState(environments[0]);
  const [version, setVersion] = useState(versions[0]);
  return (
    <ButtonGroup>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='h-7 gap-1.5 text-xs font-normal'
            aria-label='Select API service'
          >
            <RegistryIcon
              lucide='Code2Icon'
              className='size-3.5 opacity-60'
              aria-hidden='true'
            />
            {service}
            <RegistryIcon
              lucide='ChevronDownIcon'
              className='size-3 opacity-60'
              aria-hidden='true'
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-40'>
          <DropdownMenuGroup>
            {services.map((item) => (
              <DropdownMenuItem key={item} onClick={() => setService(item)}>
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='text-ui-muted-foreground h-7 gap-1 text-xs font-normal'
            aria-label='Select environment'
          >
            {environment}
            <RegistryIcon
              lucide='ChevronDownIcon'
              className='size-3 opacity-60'
              aria-hidden='true'
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-36'>
          <DropdownMenuGroup>
            {environments.map((item) => (
              <DropdownMenuItem key={item} onClick={() => setEnvironment(item)}>
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='text-ui-muted-foreground h-7 gap-1 font-mono text-xs'
            aria-label='Select API version'
          >
            {version}
            <RegistryIcon
              lucide='ChevronDownIcon'
              className='size-3 opacity-60'
              aria-hidden='true'
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-24'>
          <DropdownMenuGroup>
            {versions.map((item) => (
              <DropdownMenuItem key={item} onClick={() => setVersion(item)}>
                <span className='font-mono'>{item}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
