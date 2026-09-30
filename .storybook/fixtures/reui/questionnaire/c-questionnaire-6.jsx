// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useId, useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle
} from '../../../../src/components/core/Questionnaire/parts/questionnaire.jsx';
const REGIONS = [
  { value: 'us', label: 'United States' },
  { value: 'eu', label: 'European Union' },
  { value: 'self-managed', label: 'A region you manage' }
];
const PLANS = [
  { value: 'starter', label: 'Starter' },
  { value: 'growth', label: 'Growth' },
  { value: 'enterprise', label: 'Enterprise' }
];
const SIGNERS = [
  { value: 'me', label: 'I sign it myself' },
  { value: 'legal', label: 'Our legal team' },
  { value: 'admin', label: 'A named administrator' }
];
const ITEMS = [
  { name: 'region', required: true },
  { name: 'plan', required: true },
  { name: 'signer', required: true }
];
const PLAN_CONFLICT =
  'A region you manage is available on Enterprise. Pick another plan, or change the region.';
function labelOf(options, value) {
  return (
    options.find((option) => option.value === value)?.label ?? 'Not answered'
  );
}
export function Pattern() {
  const titleId = useId();
  const [item, setItem] = useState('region');
  const [planError, setPlanError] = useState(null);
  const [summary, setSummary] = useState(null);
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const region = formData.get('region');
    const plan = formData.get('plan');
    if (region === 'self-managed' && plan === 'starter') {
      setPlanError(PLAN_CONFLICT);
      setItem('plan');
      return;
    }
    setSummary({
      region: labelOf(REGIONS, region),
      plan: labelOf(PLANS, plan),
      signer: labelOf(SIGNERS, formData.get('signer'))
    });
  }
  function startOver() {
    setSummary(null);
    setPlanError(null);
    setItem('region');
  }
  if (summary) {
    return (
      <Card className='mx-auto w-full max-w-md'>
        <CardHeader>
          <CardTitle>Agreement on its way</CardTitle>
          <CardDescription>
            The data agreement has been drafted against these three answers and
            sent for signature.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className='grid gap-3'>
            <div className='grid min-w-0 gap-0.5'>
              <dt className='text-ui-muted-foreground text-sm'>
                Data residency
              </dt>
              <dd className='text-sm font-medium'>{summary.region}</dd>
            </div>
            <div className='grid min-w-0 gap-0.5'>
              <dt className='text-ui-muted-foreground text-sm'>Plan</dt>
              <dd className='text-sm font-medium'>{summary.plan}</dd>
            </div>
            <div className='grid min-w-0 gap-0.5'>
              <dt className='text-ui-muted-foreground text-sm'>Signed by</dt>
              <dd className='text-sm font-medium'>{summary.signer}</dd>
            </div>
          </dl>
        </CardContent>
        <CardFooter>
          <Button size='sm' variant='outline' onClick={startOver}>
            Start over
          </Button>
        </CardFooter>
      </Card>
    );
  }
  return (
    <Questionnaire
      className='mx-auto w-full max-w-md'
      item={item}
      items={ITEMS}
      onItemChange={setItem}
      onSubmit={handleSubmit}
    >
      <Card>
        <QuestionnaireItem
          aria-labelledby={`${titleId}-region`}
          name='region'
          required
        >
          <CardHeader>
            <QuestionnaireTitle id={`${titleId}-region`} render={<CardTitle />}>
              Where should your data live?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              Residency is fixed once the workspace is created.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              {REGIONS.map((region) => (
                <QuestionnaireChoice
                  key={region.value}
                  value={region.value}
                  onChange={() => setPlanError(null)}
                >
                  {region.label}
                </QuestionnaireChoice>
              ))}
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>

        <QuestionnaireItem
          aria-labelledby={`${titleId}-plan`}
          name='plan'
          required
          invalid={planError !== null}
        >
          <CardHeader>
            <QuestionnaireTitle id={`${titleId}-plan`} render={<CardTitle />}>
              Which plan are you on?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              Not every region is offered on every plan.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              {PLANS.map((plan) => (
                <QuestionnaireChoice
                  key={plan.value}
                  value={plan.value}
                  onChange={() => setPlanError(null)}
                >
                  {plan.label}
                </QuestionnaireChoice>
              ))}
            </QuestionnaireChoices>
            <QuestionnaireError>{planError}</QuestionnaireError>
          </CardContent>
        </QuestionnaireItem>

        <QuestionnaireItem
          aria-labelledby={`${titleId}-signer`}
          name='signer'
          required
        >
          <CardHeader>
            <QuestionnaireTitle id={`${titleId}-signer`} render={<CardTitle />}>
              Who signs the data agreement?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              We send it for signature as soon as this flow is finished.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              {SIGNERS.map((signer) => (
                <QuestionnaireChoice key={signer.value} value={signer.value}>
                  {signer.label}
                </QuestionnaireChoice>
              ))}
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>

        <CardFooter>
          <QuestionnaireActions className='w-full'>
            <QuestionnairePrevious />
            <QuestionnaireNext>Next</QuestionnaireNext>
            <QuestionnaireSubmit>Request the agreement</QuestionnaireSubmit>
          </QuestionnaireActions>
        </CardFooter>
      </Card>
    </Questionnaire>
  );
}
