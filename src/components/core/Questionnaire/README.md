# Questionnaire

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

## Accessibility

Each question is a fieldset, choices are native radios or checkboxes, and the progress is a labelled progress bar. Hidden questions are inert, so focus and screen readers only reach the active one.
