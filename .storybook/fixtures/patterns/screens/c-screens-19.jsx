'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import { default as CodeBlock } from '../../../../src/components/core/CodeBlock/index.js';
import { default as Field, FieldError, FieldLabel } from '../../../../src/components/core/Field/index.js';
import { default as Input } from '../../../../src/components/core/Input/index.js';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { default as RadioGroup } from '../../../../src/components/core/RadioGroup/index.js';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { ToggleGroup, ToggleGroupItem } from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { default as Wizard } from '../../../../src/components/blocks/Wizard/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
import { ClaudeAiIcon } from '../../../../src/icons/brands/claudeAiIcon.jsx';
import { CursorLight } from '../../../../src/icons/brands/cursorLight.jsx';
import { Gemini } from '../../../../src/icons/brands/gemini.jsx';
import { Openai } from '../../../../src/icons/brands/openai.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';

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
                <Input type='email' placeholder='dev@example.com' />
              </Field>
            )
          }
        </Wizard>
      </div>
    </div>
  );
}
