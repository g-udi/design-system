# ChatInput

> Chat/ChatInput · chat · `@gaudi/design-system/chat/ChatInput`

The composer: ChatPromptComposer with mentions, commands, attachments and send or stop; ChatPromptQueue; ChatModelSelect.

## Import

```js
import ChatInput from '@gaudi/design-system/chat/ChatInput';
// also: import { … } from '@gaudi/design-system/chat';
```

Exports: `ChatContextMeter`, `ChatModelSelect`, `ChatPromptAttachMenu`, `ChatPromptComposer`, `ChatPromptQueue`, `ChatPromptSettings`, `ChatPromptToggle`, `default`, `findPromptTrigger`, `formatTokenCount`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `status` | `ready \| streaming` | `ready` | no | Streaming shows Stop and queues new messages. |
| `placeholder` | `string` | `Message` | no | Prompt placeholder, through labels. |
| `models` | `boolean` | `true` | no | Example only: a ChatModelSelect with an effort slider in the toolbar. |
| `ChatPromptComposer.onSubmit` | `(text, { queued, mentions, command, attachments }) => void` | — | no | Send or queue. |
| `ChatPromptComposer.attachments / onRemoveAttachment` | `Array<{ id, name, type?, size?, kind?, previewUrl? }> / (id) => void` | `[] / —` | no | Compact shared Attachment pills; supplied image/poster thumbnails or file-type icons. The host owns removal and preview URL lifecycle. |
| `ChatPromptComposer.mentions / commands` | `Array<{ id, name, description?, icon? }>` | `[]` | no | @ anywhere and / at the start open them. |
| `ChatPromptComposer.leftControls / rightControls` | `ReactNode / ReactNode` | `toolbar / actions` | no | Independent left/right control slots; children set order and both groups wrap. Explicit values, including null, override legacy toolbar/actions. Send/stop/voice stay after the right controls. |
| `ChatPromptComposer.toolbar / actions / footer / labels` | `ReactNode / ReactNode / ReactNode / object` | — | no | Compatible left/right aliases, footer text and copy. |
| `ChatPromptQueue.items / onEdit / onRemove / onSendNow / onMove` | `Array<{ id, text }> / functions` | — | no | Waiting messages. |
| `ChatModelSelect.models / value / onValueChange` | `Array<{ value, label, description?, badge? }> / string / function` | — | no | The model a prompt runs on. |
| `ChatModelSelect.children` | `ReactNode` | — | no | Footer content switches to a popover with a model list and separate controls; Tab reaches the footer, and Escape returns focus to the trigger. |
| `ChatModelSelect.searchable / providers` | `boolean / Record<provider, { label, icon }>` | `false / {}` | no | A searchable command list grouped by provider, with context, speed, cost and capability badges. |
| `ChatPromptComposer.variant / voice` | `'default' \| 'card' / ReactNode \| ({ value, setValue, insert, disabled }) => ReactNode` | `'default' / —` | no | The card composer has a muted writing area and inset toolbar; voice takes the send slot while the prompt is empty. |
| `ChatPromptToggle.icon / label / pressed / defaultPressed / onPressedChange / disabled` | `string / string / boolean / boolean / (pressed) => void / boolean` | `— / — / — / false / — / false` | no | A compact tool toggle with an animated registry icon. Hover animates the icon and shows a tooltip; keyboard focus and selection expand its label. Selected tools retain their label and accent. Supports controlled state, reduced motion and touch. Hosts disable supplied controls explicitly. |
| `ChatPromptAttachMenu.items / onAttach / onSelect` | `Array<{ value, label, icon?, accept?, capture? }> / (files, item) => void / (item) => void` | `Upload files, Add photos` | no | The + menu: items with accept open the file picker. |
| `ChatPromptSettings.options / values / onValuesChange / effort / onEffortChange` | `Array<{ value, label, description?, icon? }> / Record<string, boolean> / function / string / function` | — | no | Options popover with an effort slider and switches. |
| `ChatContextMeter.usedTokens / maxTokens / breakdown` | `number / number / Array<{ id, label, value, detail? }>` | `0 / 0 / []` | no | Prepared totals and breakdown values; only the percentage is derived. |
| `ChatContextMeter.cost / costLabel / tone / message` | `ReactNode / ReactNode / accent \| warning \| danger / ReactNode` | `— / Cost / accent / —` | no | Host-supplied cost text, meaning and status copy; no billing or workflow policy. |
| `ChatContextMeter.formatTokens / formatPercentage` | `(number) => string / (number) => string` | `compact token count / percentage` | no | Format the supplied counts and derived percentage. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `status`: `ready`, `streaming`

## Usage

```jsx
import { ChatEffortSlider, ChatModelSelect, ChatPromptComposer, ChatPromptQueue } from '@gaudi/design-system/chat';

<>
<ChatPromptQueue items={queue} onEdit={edit} onRemove={remove} onSendNow={sendNow} onMove={move} />
<ChatPromptComposer
  status={streaming ? 'streaming' : 'ready'}
  mentions={people}
  commands={commands}
  onSubmit={(text, { queued }) => (queued ? enqueue(text) : send(text))}
  onStop={stop}
  toolbar={<ChatModelSelect searchable providers={providers} models={models} value={model} onValueChange={setModel}><ChatEffortSlider value={effort} onValueChange={setEffort} compact /></ChatModelSelect>}
/>
</>
```

## Accessibility

The prompt is a labelled combobox; icon buttons and queue actions are named. The model trigger names the current model; the searchable list is a labelled combobox with grouped options and the current one checked. The context meter names the share used and opens its breakdown on press. The options switches are named and the trigger lists the options that are on.

## Examples

- Mixed attachments: compact media pills (Storybook `chat-chatinput--mixed-attachments`)
- Queue lifecycle and focus (Storybook `chat-chatinput--queue-lifecycle`)
- Playground (Storybook `chat-chatinput--playground`)
- Expanding tools (Storybook `chat-chatinput--expanding-tools`)
- Assistant composer: models, options and context (Storybook `chat-chatinput--assistant-composer`)
- Split controls: model left, settings and context right (Storybook `chat-chatinput--split-controls`)
- All controls on the right (Storybook `chat-chatinput--right-controls`)
- Host keyboard and input handlers (Storybook `chat-chatinput--host-events`)
- Disabling open composer settings (Storybook `chat-chatinput--disabled-settings`)
- Context with host-prepared values (Storybook `chat-chatinput--prepared-context`)

Curated patterns:

- Chat composer: Mentions, commands and attachments — registry item `@gaudi/prompt-composer-mentions-attachments` (uses `Badge`, `ChatPromptComposer`)
- Chat composer: Model and effort — registry item `@gaudi/prompt-composer-model-effort` (uses `ChatModelSelect`, `ChatPromptComposer`, `RegistryIcon`, `Toggle`, `ToggleGroupItem`, `ToggleGroupRoot`)
- Chat composer: Queue follow-ups while a reply streams — registry item `@gaudi/prompt-composer-queued-follow-ups` (uses `ChatPromptComposer`, `ChatPromptQueue`, `LoaderRoot`, `RegistryIcon`)

## Related

`core-attachment`, `layout-footer`

## README

The composer for a chat: `ChatPromptComposer` (a multi-line prompt on the core InputGroup with mentions, commands, attachments and send or stop), `ChatPromptQueue` for messages waiting while a reply streams, and `ChatModelSelect` for the model and effort. The assistant toolbar adds `ChatPromptAttachMenu` (the `+` menu), `ChatPromptSettings` (effort and option switches), `ChatContextMeter` (prepared context usage, breakdown and cost). Applications supply model/provider catalogues and usage policy; richer sample data lives only in story fixtures.

### Usage

```jsx
import { ChatEffortSlider, ChatModelSelect, ChatPromptComposer, ChatPromptQueue } from '@gaudi/design-system/chat';

<ChatPromptQueue items={queue} onEdit={edit} onRemove={remove} onSendNow={sendNow} onMove={move} />
<ChatPromptComposer
  status={streaming ? 'streaming' : 'ready'}
  mentions={people}
  commands={commands}
  onSubmit={(text, { queued }) => (queued ? enqueue(text) : send(text))}
  onStop={stop}
  leftControls={<ChatModelSelect searchable providers={providers} models={models} value={model} onValueChange={setModel}><ChatEffortSlider value={effort} onValueChange={setEffort} compact /></ChatModelSelect>}
/>
```

#### Assistant composer

```jsx
import { ChatContextMeter, ChatModelSelect, ChatPromptAttachMenu, ChatPromptComposer, ChatPromptSettings } from '@gaudi/design-system/chat';

<ChatPromptComposer
  variant='card'
  labels={{ placeholder: 'Ask anything...' }}
  onSubmit={send}
  leftControls={
    <>
      <ChatPromptAttachMenu onAttach={addFiles} />
      <ChatModelSelect searchable models={models} providers={providers} value={model} onValueChange={setModel} />
    </>
  }
  rightControls={
    <>
      <ChatPromptSettings options={[{ value: 'web', label: 'Web search', icon: 'Globe' }]} values={options} onValuesChange={setOptions} effort={effort} onEffortChange={setEffort} />
      <ChatContextMeter usedTokens={usedTokens} maxTokens={contextLimit} breakdown={breakdown} cost={formattedCost} tone={contextTone} message={contextMessage} />
    </>
  }
  voice={({ insert }) => <MicButton onTranscript={insert} />}
/>
```

#### Expanding tool icons

`ChatPromptToggle` composes the shared Toggle, Tooltip and AnimatedIcon for tools such as Search or Think. Hover animates the icon and shows a tooltip without moving adjacent controls. Keyboard focus or selection expands the label; selected tools retain their label and accent. Its accessible name stays constant and `aria-pressed` reports the selection. Prefer short labels; longer labels truncate within the available width and remain available through the tooltip and accessible name. The icon respects reduced motion, and touch targets are at least 44px. Tool selection belongs to the host and does not start a search or request.

```jsx
import { ChatPromptComposer, ChatPromptToggle } from '@gaudi/design-system/chat/ChatInput';

<ChatPromptComposer
  variant='card'
  onSubmit={send}
  leftControls={
    <ChatPromptToggle icon='Globe' label='Search' pressed={search} onPressedChange={setSearch} />
  }
/>
```

The `card` variant uses a muted writing area, an inset toolbar and matched control heights; it follows Gaudi's radius and spacing tokens in both themes. The attachment `+` rotates while its menu is open. The **Expanding tools** story demonstrates these interactions, inspired by [Skiper AI Input 001](https://skiper-ui.com/v1/skiper81), with an independent implementation using Gaudi primitives.

#### Control placement

`leftControls` and `rightControls` accept any composition of the existing controls. Their child order sets the visual and keyboard order. Put `ChatPromptAttachMenu`, `ChatModelSelect`, `ChatPromptSettings`, `ChatContextMeter`, or custom buttons in either slot; both groups wrap to fit narrow containers. Left/right follow the reading direction, so they mirror in RTL.

The built-in `onAttach` button remains in the left group. For configurable attachment placement, use `ChatPromptAttachMenu` in either slot. Send, stop and the empty-prompt voice action stay together after the right controls.

Existing `toolbar` and `actions` remain aliases for the left and right slots. An explicit new slot takes precedence; `null` clears that slot without rendering its legacy alias. These slots work in both `default` and `card` variants.

Storybook’s **Assistant composer** example provides independent left/right controls for attachments, model, settings and context, with matching copyable source. **Split controls** and **All controls on the right** show common arrangements.

#### Mixed attachments

`attachments` accepts `{ id, name, type?, mediaType?, fileType?, size?, kind?, previewUrl? }`. The composer reuses Core `AttachmentMedia`: audio and video get distinct icons, images use a supplied `previewUrl`, and `kind='link'` uses a globe. Without a thumbnail, or if it cannot load, the file-type icon remains. Supply image thumbnails or video posters explicitly; the component does not fetch the original media or create object URLs. The host owns those URLs and their cleanup.

The **Mixed attachments: compact media pills** story shows image, PDF, audio, video and link attachments, removal, reset and submission. `onSubmit` receives the same attachment objects in its second argument; `onRemoveAttachment(id)` keeps the tray controlled by the host.

### API

| Prop / part | Contract |
| --- | --- |
| `ChatPromptComposer` | `@` anywhere or `/` at the start opens `mentions` or `commands`; Enter sends and Shift+Enter adds a line; `status` streaming shows Stop and reports `{ queued: true }`; `leftControls`, `rightControls`, `footer`, `attachments` and `onAttach` fill the frame. |
| `ChatPromptComposer` `leftControls` / `rightControls` | ReactNode slots for independently arranged control groups; both wrap. New props override legacy `toolbar` / `actions`; `null` clears a slot. Built-in send/stop/voice remain after the right slot. |
| `ChatPromptQueue` | Waiting messages `{ id, text }`: edit in place, send now, remove, or move with Alt+Arrow. |
| `ChatPromptToggle` | `icon` is an icon registry name; `label` supplies the visible and accessible name. `pressed` / `defaultPressed` / `onPressedChange` follow the shared Toggle's controlled/uncontrolled contract; `disabled` prevents changes. Use it in either control slot. Hosts must pass their disabled/read-only policy to supplied slot controls. |
| `ChatModelSelect` | `models` `{ value, label, description?, details?, badge?, badgeTone?, icon? }` with `value` / `onValueChange`; `icon` is a brand mark, `details` short facts under the name; `variant` / `size` style the trigger (outline in a page header), `icon={false}` drops the default sparkle; `disabled` disables the trigger; `children` add a footer such as a ChatEffortSlider; a footer uses a popover containing a model list and separate controls. |
| `ChatModelSelect` (catalogue) | Models with a `provider` group under its name and mark (host-supplied `providers`, or the provider ID when absent); `contextWindow`, `speed` (`fast`, `balanced`, `slow`), `cost` (1 to 4) and `capabilities` (`vision`, `reasoning`, `tools`, `web`, `files`, `audio`, `code`, `image`) show under the name. `searchable` opens a command list with a search field instead of a menu. |
| `ChatPromptComposer` `variant` / `voice` | `card` is the roomier composer with a one-line prompt that grows; `voice` (element or `({ value, setValue, insert, disabled }) => element`) holds the send slot while the prompt is empty. |
| `ChatPromptAttachMenu` | `items` `{ value, label, icon?, description?, shortcut?, accept?, capture?, multiple?, separator? }`; items with `accept` open the file picker and call `onAttach(files, item)`, others call `onSelect(item)`. |
| `ChatPromptSettings` | `effort` / `onEffortChange` (a ChatEffortSlider, `effortLevels` for your own steps) and switches for `options` with `values` / `defaultValues` / `onValuesChange(values, changed)`; `children` add controls. |
| `ChatContextMeter` | `usedTokens`, `maxTokens`, optional `modelLabel`; prepared `breakdown` rows `{ id, label, value, detail? }`; prepared `cost` and `costLabel`; explicit `tone` (`accent`, `warning`, `danger`) and `message`. `formatTokens` defaults to exported `formatTokenCount`; `formatPercentage` formats the derived percentage. |
| `findPromptTrigger(text, caret)` | The mention or command being typed at the caret, or null. |

#### Context data ownership

The meter only derives its percentage from `usedTokens` and `maxTokens`. It does not combine protocol token categories, calculate prices, choose warning thresholds or predict how a host handles a full context window. Supply formatted breakdown values and cost text unchanged, including zero. The host sets tone and any explanatory message.

The previous `usage`, `model`, `pricing`, `currency`, `warnAt` and `dangerAt` props and exported `estimateChatCost`, `chatModels` and `chatModelProviders` are removed. Move model/provider metadata and any billing calculation into the application. The Assistant composer story retains an illustrative catalogue and billing calculation in `stories/fixtures`.

### Accessibility

The prompt is a labelled combobox; suggestions are a listbox with the active option announced. Icon buttons (attach, send, stop, add to queue) have names, and every queue action names the message it acts on.

The model trigger names the current model. Searchable pickers and pickers with footer content use a dialog; searchable ones include a labelled search combobox. Without search, focus starts in the model list: arrow keys move and Enter selects, while Tab reaches the footer controls. Escape closes and returns focus to the trigger. Simple pickers without search or a footer retain menu keyboard behavior; options are grouped under provider headings, the current model is `aria-checked`, and capability icons and the cost scale have text alternatives. The options trigger lists the options that are on, and each switch is named. The context meter is a button named with the share used and the token counts; it opens the breakdown on press (not hover), so it works with touch and the keyboard, and the warning text appears in the breakdown as well as in colour. The `voice` slot only swaps while the prompt is empty, so focus stays in the prompt while typing.
