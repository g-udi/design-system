# Questionnaire

> Core/Questionnaire · core · `@gaudi/design-system/core/Questionnaire`

A sequence of form questions with selection, validation and progress.

## Import

```js
import { Questionnaire } from '@gaudi/design-system/core/Questionnaire';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Questionnaire`, `QuestionnaireActions`, `QuestionnaireChoice`, `QuestionnaireChoiceDescription`, `QuestionnaireChoices`, `QuestionnaireDescription`, `QuestionnaireError`, `QuestionnaireInput`, `QuestionnaireItem`, `QuestionnaireNext`, `QuestionnairePrevious`, `QuestionnaireProgress`, `QuestionnaireSkip`, `QuestionnaireSubmit`, `QuestionnaireTitle`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `QuestionnaireItemDefinition[]` | — | no | Question identities and constraints. |
| `item / defaultItem / onItemChange` | `string / function` | — | no | Controlled or initial active question. |
| `onSubmit / onReset` | `FormEventHandler` | — | no | Native form submission and reset. |
| `shortcuts` | `QuestionnaireShortcutMode` | — | no | Keyboard shortcut mode. |
| `QuestionnaireItem.name` | `string` | `Required` | no | Question field name. |
| `QuestionnaireItem.multiple / required / invalid` | `boolean` | — | no | Selection and validation constraints. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Usage

```jsx
import { Questionnaire, QuestionnaireItem, QuestionnaireTitle, QuestionnaireInput, QuestionnaireActions, QuestionnaireSubmit } from '@gaudi/design-system/core/Questionnaire';

<Questionnaire onSubmit={submitAnswers}>
  <QuestionnaireItem name='goal'>
    <QuestionnaireTitle>What would you like to achieve?</QuestionnaireTitle>
    <QuestionnaireInput placeholder='Your goal' />
  </QuestionnaireItem>
  <QuestionnaireActions><QuestionnaireSubmit>Submit</QuestionnaireSubmit></QuestionnaireActions>
</Questionnaire>
```

## Accessibility

Question titles render as legends. Keep validation beside the question and ensure Previous, Next and Submit have clear names.

## Examples

- Playground (Storybook `core-questionnaire--playground`)

Curated patterns:

- Answer types — registry item `@gaudi/questionnaire-answer-types` (uses `Badge`, `Button`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardRoot`, `CardTitle`, `Label`, `Questionnaire`, `QuestionnaireActions`, `QuestionnaireChoice`, `QuestionnaireChoiceDescription`, `QuestionnaireChoices`, `QuestionnaireError`, `QuestionnaireInput`, `QuestionnaireItem`, `QuestionnaireNext`, `QuestionnairePrevious`, `QuestionnaireProgress`, `QuestionnaireSkip`, `QuestionnaireSubmit`, `QuestionnaireTitle`)
- Conditional branch — registry item `@gaudi/questionnaire-conditional-branch` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Button`, `CardAction`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardRoot`, `CardTitle`, `Questionnaire`, `QuestionnaireActions`, `QuestionnaireChoice`, `QuestionnaireChoiceDescription`, `QuestionnaireChoices`, `QuestionnaireDescription`, `QuestionnaireError`, `QuestionnaireItem`, `QuestionnaireNext`, `QuestionnairePrevious`, `QuestionnaireProgress`, `QuestionnaireSubmit`, `QuestionnaireTitle`, `RegistryIcon`, `cn`)
- Cross-question validation — registry item `@gaudi/questionnaire-cross-validation` (uses `Button`, `CardAction`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardRoot`, `CardTitle`, `Questionnaire`, `QuestionnaireActions`, `QuestionnaireChoice`, `QuestionnaireChoices`, `QuestionnaireDescription`, `QuestionnaireError`, `QuestionnaireItem`, `QuestionnaireNext`, `QuestionnairePrevious`, `QuestionnaireProgress`, `QuestionnaireSubmit`, `QuestionnaireTitle`)
- Guided setup — registry item `@gaudi/questionnaire-guided-setup` (uses `Button`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardRoot`, `CardTitle`, `Questionnaire`, `QuestionnaireActions`, `QuestionnaireChoice`, `QuestionnaireChoiceDescription`, `QuestionnaireChoices`, `QuestionnaireDescription`, `QuestionnaireError`, `QuestionnaireItem`, `QuestionnaireNext`, `QuestionnairePrevious`, `QuestionnaireProgress`, `QuestionnaireSubmit`, `QuestionnaireTitle`, `cn`)

## README

A form that shows one question at a time, with progress, keyboard shortcuts for choices, validation and Previous, Skip, Next and Submit actions. Use it for onboarding, surveys and guided setup; use a plain form when people need to see every field at once.

```jsx
import { Questionnaire, QuestionnaireProgress, QuestionnaireItem, QuestionnaireTitle, QuestionnaireChoices, QuestionnaireChoice, QuestionnaireError, QuestionnaireActions, QuestionnairePrevious, QuestionnaireNext, QuestionnaireSubmit } from '@gaudi/design-system';

<Questionnaire items={items} onSubmit={handleSubmit}>
  <QuestionnaireProgress />
  <QuestionnaireItem name='goal' required>
    <QuestionnaireTitle>What brings you here?</QuestionnaireTitle>
    <QuestionnaireChoices>
      <QuestionnaireChoice value='system'>Build a design system</QuestionnaireChoice>
    </QuestionnaireChoices>
    <QuestionnaireError />
  </QuestionnaireItem>
  <QuestionnaireActions>
    <QuestionnairePrevious />
    <QuestionnaireNext />
    <QuestionnaireSubmit />
  </QuestionnaireActions>
</Questionnaire>
```

- `QuestionnaireItem multiple` turns choices into checkboxes; `QuestionnaireInput` takes a written answer; `QuestionnaireSkip` appears on optional questions.
- `shortcuts` labels choices with `letters` or `numbers`; `defaultItem` / `onItemChange` control the active question.
- The actions are Button-styled: Previous and Skip are neutral outlines, Next and Submit are filled. Pass `variant` or `size` to change them.

### Accessibility

Each question is a fieldset, choices are native radios or checkboxes, and the progress is a labelled progress bar. Hidden questions are inert, so focus and screen readers only reach the active one.
