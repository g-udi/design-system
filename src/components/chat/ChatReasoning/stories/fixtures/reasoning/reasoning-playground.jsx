import { ChatMessageReasoning, ChatMessageReasoningStep } from '@gaudi/design-system/chat/ChatReasoning';

const steps = [
  { text: 'Read the draft and the three reader replies', status: 'done' },
  { text: 'Find where the argument loses the reader', status: 'done' },
  { text: 'Suggest a tighter opening', status: 'running' }
];

export function Pattern({ streaming = false, duration = 6, defaultOpen = true }) {
  return (
    <div className='ds-touch-controls w-full max-w-xl'>
      <ChatMessageReasoning key={`${defaultOpen}`} streaming={streaming} duration={duration} defaultOpen={defaultOpen}>
        {steps.map((step) => (
          <ChatMessageReasoningStep key={step.text} status={streaming ? step.status : 'done'}>{step.text}</ChatMessageReasoningStep>
        ))}
      </ChatMessageReasoning>
    </div>
  );
}
