import Icon from '../../src/components/core/Icon';
import Pill from '../../src/components/core/Pill';
import Typography from '../../src/foundations/Typography';
import { CodeBlock, InlineCode, Page, Section } from './StoryDocs';

export default {
  id: 'overview-essentials',
  title: 'Essentials',
  tags: [ 'dev', '!autodocs' ],
  parameters: { layout: 'fullscreen' }
};

const reference = (id, label) => <a className='gaudi-guide-reference' href={`./?path=/story/${id}`} target='_top'>{label}</a>;

export const Essentials = {
  name: 'Essentials',
  render: () => (
    <Page compact title='Essentials' intro='The shared foundations for a consistent interface. Start here, then use each component’s documented variants and states.'>
      <nav aria-label='On this page' className='gaudi-guide-anchors'>
        <a href='#colors-and-theme'>Colors & theme</a><a href='#typography'>Typography</a><a href='#icons'>Icons</a><a href='#states'>States</a><a href='#accessibility'>Accessibility</a>
      </nav>
      <Section id='colors-and-theme' title='Colors & theme' description='Use semantic tokens for surfaces, text, borders, and actions. Keep light and dark themes aligned with the same roles.'>
        <div className='gaudi-essential-swatches'>
          {[['Surface','--ds-color-surface'],['Text','--ds-color-text'],['Border','--ds-color-border'],['Action','--ds-color-accent']].map(([label,token]) => <div key={token}><span aria-hidden='true' style={{background:`var(${token})`}} /><strong>{label}</strong><code>{token}</code></div>)}
        </div>
        <CodeBlock language='css' code={ `.workspace {
  background: var(--ds-color-surface);
  color: var(--ds-color-text);
  border: 1px solid var(--ds-color-border);
}` } />
        {reference('overview-colors-tokens--default','Search the token reference')}
      </Section>
      <Section id='typography' title='Typography' description='Use shared variants for headings, body text, and metadata. Keep long prose readable and labels concise.'>
        <div className='gaudi-essential-type'>
          <Typography as='p' variant='heading-md'>A clear heading</Typography>
          <Typography variant='paragraph-md'>Body text supports reading and completing a task.</Typography>
          <Typography variant='metadata'>Supporting information</Typography>
        </div>
        {reference('overview-typography--default','View typography variants')}
      </Section>
      <Section id='icons' title='Icons' description='Use the icon registry. Label icon-only controls and keep decorative icons hidden from assistive technology.'>
        <div className='gaudi-essential-icons'>{['Search','Plus','CheckIcon','ArrowRight','CopyIcon','Calendar'].map(name=><span key={name}><Icon name={name} size='md' decorative /><code>{name}</code></span>)}</div>
        {reference('overview-icons--default','Browse the icon reference')}
      </Section>
      <Section id='states' title='States' description='Plan loading, empty, error, success, and disabled states. Pair status colors with useful text, preserve user input, and make recovery clear.'>
        <div className='gaudi-essential-statuses'><Pill color='green'>Saved</Pill><Pill color='amber'>Needs review</Pill><Pill color='red'>Upload failed</Pill></div>
        <p className='gaudi-guide-note'>An error should explain the next step: “Upload failed. Check your connection and try again.” Use <InlineCode>aria-live</InlineCode> for status updates that need announcing.</p>
        {reference('overview-states-recovery--default','View state and recovery examples')}
      </Section>
      <Section id='accessibility' title='Accessibility'>
        <ul className='gaudi-guide-list'>
          <li>Use semantic headings, links, buttons, and persistent field labels.</li>
          <li>Support keyboard navigation, Escape, and focus return.</li>
          <li>Check contrast, reduced motion, both themes, and narrow screens.</li>
          <li>Verify realistic content and error states alongside the happy path.</li>
        </ul>
        {reference('overview-accessibility--default','Read accessibility guidance')}
      </Section>
    </Page>
  )
};
