import NewsletterForm from '@gaudi/design-system/layout/NewsletterForm';
import { GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import styles from './NewsletterSection.css?raw';

const responses = {
  success: 'data:application/json,%7B%22error%22%3Afalse%7D',
  error: 'data:application/json,%7B%22error%22%3Atrue%7D',
  unavailable: undefined
};

export function NewsletterSection({ title, description, layout = 'centered', response = 'success' }) {
  return <>
    <style>{styles}</style>
    <section aria-label='Newsletter' className='newsletter-section' data-layout={layout}>
      <div className='newsletter-section-inner'>
        {layout === 'image' && <img className='newsletter-section-image' src='/static/images/art/2.svg' alt='' width='1200' height='900' />}
        <div className='newsletter-section-content'>
          {layout !== 'compact' && <GaudiBrand className='mb-8' />}
          <NewsletterForm
            key={response}
            endpoint={responses[response]}
            title={title}
            description={description}
            headingAs='h2'
            titleVariant={layout === 'compact' ? 'heading-md' : 'heading-xl'}
            className='mt-0'
            classNames={{ root: 'newsletter-section-form', header: 'newsletter-section-header', body: 'newsletter-section-body', title: 'newsletter-section-title', description: 'newsletter-section-description', form: 'newsletter-section-fields' }}
          >
            <p className='mt-4 text-xs leading-relaxed text-text-muted'>A quiet place for new ideas. Unsubscribe whenever you like.</p>
          </NewsletterForm>
        </div>
      </div>
      <p className='newsletter-section-demo-note'>Demo only. Submissions stay in this browser; no address is subscribed.</p>
    </section>
  </>;
}
