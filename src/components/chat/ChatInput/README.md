# ChatInput

The composer for a chat: `PromptComposer` (a multi-line prompt on the core InputGroup with mentions, commands, attachments and send or stop), `PromptQueue` for messages waiting while a reply streams, and `ChatModelSelect` for the model and effort. The assistant toolbar adds `PromptAttachMenu` (the `+` menu), `PromptSettings` (effort and option switches), `ChatContextMeter` (context used and estimated cost) and a `chatModels` catalogue of Claude, OpenAI and Gemini models.

## Usage

```jsx
import { ChatEffortSlider, ChatModelSelect, PromptComposer, PromptQueue } from '@gaudi/design-system/chat';

<PromptQueue items={queue} onEdit={edit} onRemove={remove} onSendNow={sendNow} onMove={move} />
<PromptComposer
  status={streaming ? 'streaming' : 'ready'}
  mentions={people}
  commands={commands}
  onSubmit={(text, { queued }) => (queued ? enqueue(text) : send(text))}
  onStop={stop}
  toolbar={<ChatModelSelect models={models} value={model} onValueChange={setModel}><ChatEffortSlider value={effort} onValueChange={setEffort} compact /></ChatModelSelect>}
/>
```

### Assistant composer

```jsx
import { ChatContextMeter, ChatModelSelect, PromptAttachMenu, PromptComposer, PromptSettings, chatModels } from '@gaudi/design-system/chat';

<PromptComposer
  variant='card'
  labels={{ placeholder: 'Ask anything...' }}
  onSubmit={send}
  toolbar={
    <>
      <PromptAttachMenu onAttach={addFiles} />
      <ChatModelSelect searchable models={chatModels} value={model} onValueChange={setModel} />
      <PromptSettings options={[{ value: 'web', label: 'Web search', icon: 'Globe' }]} values={options} onValuesChange={setOptions} effort={effort} onEffortChange={setEffort} />
      <ChatContextMeter usage={usage} model={chatModels.find((item) => item.value === model)} />
    </>
  }
  voice={({ insert }) => <MicButton onTranscript={insert} />}
/>
```

## API

| Prop / part | Contract |
| --- | --- |
| `PromptComposer` | `@` anywhere or `/` at the start opens `mentions` or `commands`; Enter sends and Shift+Enter adds a line; `status` streaming shows Stop and reports `{ queued: true }`; `toolbar`, `actions` (beside send, such as voice input), `footer`, `attachments` and `onAttach` fill the frame. |
| `PromptQueue` | Waiting messages `{ id, text }`: edit in place, send now, remove, or move with Alt+Arrow. |
| `ChatModelSelect` | `models` `{ value, label, description?, details?, badge?, badgeTone?, icon? }` with `value` / `onValueChange`; `icon` is a brand mark, `details` short facts under the name; `variant` / `size` style the trigger (outline in a page header), `icon={false}` drops the default sparkle; `children` add a footer such as a ChatEffortSlider. |
| `ChatModelSelect` (catalogue) | Models with a `provider` group under its name and mark (`providers`, `chatModelProviders` by default); `contextWindow`, `speed` (`fast`, `balanced`, `slow`), `cost` (1 to 4) and `capabilities` (`vision`, `reasoning`, `tools`, `web`, `files`, `audio`, `code`, `image`) show under the name. `searchable` opens a command list with a search field instead of a menu. |
| `chatModels` / `chatModelProviders` | Plain data: Claude Opus 5, Opus 4.8, Sonnet 5, Sonnet 4.6, Haiku 4.5; GPT-4o, GPT-4.1, GPT-4.1 mini, o3, o4-mini; Gemini 2.5 Pro and Flash. Each has `contextWindow` and `pricing` (dollars per million tokens: `input`, `output`, `cachedInput`). Prices drift, so apps should override them. |
| `PromptComposer` `variant` / `voice` | `card` is the roomier composer with a one-line prompt that grows; `voice` (element or `({ value, setValue, insert, disabled }) => element`) holds the send slot while the prompt is empty. |
| `PromptAttachMenu` | `items` `{ value, label, icon?, description?, shortcut?, accept?, capture?, multiple?, separator? }`; items with `accept` open the file picker and call `onAttach(files, item)`, others call `onSelect(item)`. |
| `PromptSettings` | `effort` / `onEffortChange` (a ChatEffortSlider, `effortLevels` for your own steps) and switches for `options` with `values` / `defaultValues` / `onValuesChange(values, changed)`; `children` add controls. |
| `ChatContextMeter` | `usage` `{ inputTokens, outputTokens, reasoningTokens, cachedInputTokens }`, `model` (for `contextWindow` and `pricing`) or `maxTokens` / `pricing`, `usedTokens` and `cost` overrides, `warnAt` (0.75) and `dangerAt` (0.9). `estimateChatCost(usage, pricing)` and `formatTokenCount(n)` are exported. |
| `findPromptTrigger(text, caret)` | The mention or command being typed at the caret, or null. |

## Accessibility

The prompt is a labelled combobox; suggestions are a listbox with the active option announced. Icon buttons (attach, send, stop, add to queue) have names, and every queue action names the message it acts on.

The model trigger names the current model. The searchable list is a dialog with a labelled search combobox; options are grouped under provider headings, the current model is `aria-checked`, and capability icons and the cost scale have text alternatives. The options trigger lists the options that are on, and each switch is named. The context meter is a button named with the share used and the token counts; it opens the breakdown on press (not hover), so it works with touch and the keyboard, and the warning text appears in the breakdown as well as in colour. The `voice` slot only swaps while the prompt is empty, so focus stays in the prompt while typing.
