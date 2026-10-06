'use client';
import { useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import { CheckboxRoot as Checkbox } from '@gaudi/design-system/core/Checkbox';
import { default as CodeBlock } from '@gaudi/design-system/core/CodeBlock';
import { default as Field, FieldError, FieldLabel } from '@gaudi/design-system/core/Field';
import { default as Input } from '@gaudi/design-system/core/Input';
import { Label } from '@gaudi/design-system/core/Field';
import { default as RadioGroup } from '@gaudi/design-system/core/RadioGroup';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import { ToggleGroupRoot as ToggleGroup, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';
import { default as Wizard } from '@gaudi/design-system/blocks/Wizard';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { ClaudeAiIcon } from '@gaudi/design-system/icons/brands/claudeAiIcon';
import { CursorLight } from '@gaudi/design-system/icons/brands/cursorLight';
import { Gemini } from '@gaudi/design-system/icons/brands/gemini';
import { Openai } from '@gaudi/design-system/icons/brands/openai';
import { cn } from '@gaudi/design-system/utilities/cn';
import { EmailInput } from '@gaudi/design-system/core/Input';

const steps = [
  { id: 'you', label: 'You' },
  { id: 'project', label: 'Project' },
  { id: 'stack', label: 'Stack' },
  { id: 'agent', label: 'Agent' },
  { id: 'key', label: 'API key' },
  { id: 'install', label: 'Install' },
  { id: 'verify', label: 'Verify' },
  { id: 'team', label: 'Team' }
];
const agents = [
  { id: 'claude', name: 'Claude Code', Logo: ClaudeAiIcon, config: '.mcp.json' },
  { id: 'cursor', name: 'Cursor', Logo: CursorLight, config: '.cursor/mcp.json' },
  { id: 'codex', name: 'Codex', Logo: Openai, config: '~/.codex/config.toml' },
  { id: 'gemini', name: 'Gemini CLI', Logo: Gemini, config: '~/.gemini/settings.json' }
];
const commands = (agent, key) => [
  ['install', 'Install the CLI', 'npm install -g @gaudi/cli'],
  ['login', 'Sign in with your key', `gaudi login --key ${key}`],
  ['connect', `Connect ${agent.name}`, `gaudi mcp add --client ${agent.id} --config ${agent.config}`]
];

export function Pattern() {
  const [dark, setDark] = useState(true);
  const [name, setName] = useState('');
  const [project, setProject] = useState('docs-site');
  const [stack, setStack] = useState('next');
  const [agent, setAgent] = useState('claude');
  const [key, setKey] = useState('');
  const [done, setDone] = useState([]);
  const [verify, setVerify] = useState('idle');
  const [checked, setChecked] = useState(false);
  const chosen = agents.find((item) => item.id === agent);
  const list = commands(chosen, key ? `${key.slice(0, 12)}…` : 'gd_live_…');
  const valid = [Boolean(name.trim()), Boolean(project.trim()), true, true, Boolean(key), done.length === list.length, verify === 'ok', true];
  const check = () => {
    setVerify('pending');
    setTimeout(() => setVerify('ok'), 700);
  };
  return (
    <div className='grid w-full max-w-3xl gap-3'>
      <div className='flex items-center justify-end gap-2'>
        <Label htmlFor='dev-dark' className='font-normal'>Dark card</Label>
        <Switch id='dev-dark' checked={dark} onCheckedChange={setDark} />
      </div>
      <div className={cn('bg-surface text-text rounded-xl border p-5', dark && 'dark')}>
        <Wizard
          title='Connect your coding agent'
          description='Eight steps from a new account to an agent that can read your project.'
          steps={steps}
          indicator='progress'
          validateStep={(index) => {
            if (!valid[index]) setChecked(true);
            return valid[index];
          }}
          onComplete={() => new Promise((resolve) => setTimeout(resolve, 300))}
          completeLabel='Finish setup'
          completionTitle={`${chosen.name} is connected`}
          completionDescription={`Ask it about ${project}; it reads the project through the Gaudi server.`}
          validationMessage='Finish this step before you continue.'
        >
          {(step) =>
            step === 0 ? (
              <Field>
                <FieldLabel>Your name</FieldLabel>
                <Input value={name} invalid={checked && !name.trim()} onChange={(event) => setName(event.target.value)} />
                <FieldError>{checked && !name.trim() ? 'Add your name.' : null}</FieldError>
              </Field>
            ) : step === 1 ? (
              <Field>
                <FieldLabel>Project slug</FieldLabel>
                <Input value={project} className='font-mono' onChange={(event) => setProject(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} />
              </Field>
            ) : step === 2 ? (
              <div className='grid gap-2'>
                <p id='stack-label' className='text-sm font-medium'>Framework</p>
                <ToggleGroup aria-labelledby='stack-label' type='single' variant='outline' size='sm' spacing={0} value={stack} onValueChange={(next) => setStack(next || stack)}>
                  {[['next', 'Next.js'], ['astro', 'Astro'], ['remix', 'Remix'], ['node', 'Node only']].map(([value, label]) => <ToggleGroupItem key={value} value={value}>{label}</ToggleGroupItem>)}
                </ToggleGroup>
              </div>
            ) : step === 3 ? (
              <RadioGroup
                label='Which agent do you use?'
                variant='cards'
                value={agent}
                onValueChange={setAgent}
                options={agents.map(({ id, name: label, config }) => ({ value: id, label, description: `Writes ${config}` }))}
              />
            ) : step === 4 ? (
              <div className='grid gap-3'>
                <p className='text-sm'>The key is shown once. Store it in your password manager or the project’s secret store.</p>
                {key ? (
                  <CodeBlock language='bash' label='Environment variable' code={`export GAUDI_API_KEY=${key}`} />
                ) : (
                  <Button className='justify-self-start' onClick={() => setKey(`gd_live_${Math.random().toString(16).slice(2, 14)}${Math.random().toString(16).slice(2, 14)}`)}>
                    <RegistryIcon lucide='KeyRoundIcon' />
                    Create API key
                  </Button>
                )}
              </div>
            ) : step === 5 ? (
              <ol className='grid gap-3'>
                {list.map(([id, label, command], index) => (
                  <li key={id} className='grid gap-2'>
                    <div className='flex items-center gap-2'>
                      <Checkbox
                        id={`cli-${id}`}
                        checked={done.includes(id)}
                        onCheckedChange={(on) => setDone((current) => (on ? [...current, id] : current.filter((item) => item !== id)))}
                      />
                      <Label htmlFor={`cli-${id}`} className='font-normal'>{index + 1}. {label}</Label>
                    </div>
                    <CodeBlock language='bash' code={command} />
                  </li>
                ))}
                <p className='text-text-muted text-xs' aria-live='polite'>{done.length} of {list.length} done</p>
              </ol>
            ) : step === 6 ? (
              <div className='grid gap-3'>
                <p className='text-sm'>We ping the server from {chosen.name} to confirm it can read {project}.</p>
                <Button variant='outline' className='justify-self-start' disabled={verify === 'pending'} onClick={check}>
                  <RegistryIcon lucide={verify === 'ok' ? 'CircleCheckIcon' : 'TerminalIcon'} className={verify === 'ok' ? 'text-success' : undefined} />
                  {verify === 'pending' ? 'Checking…' : verify === 'ok' ? 'Connected' : 'Check connection'}
                </Button>
                <p role='status' className='text-text-muted text-xs'>{verify === 'ok' ? `${chosen.name} answered in 182 ms.` : ''}</p>
              </div>
            ) : (
              <Field>
                <FieldLabel>Invite a teammate <span className='text-text-muted font-normal'>· optional</span></FieldLabel>
                <EmailInput  placeholder='dev@example.com' />
              </Field>
            )
          }
        </Wizard>
      </div>
    </div>
  );
}
