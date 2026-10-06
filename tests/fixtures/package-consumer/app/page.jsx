import Button from '@gaudi/design-system/core/Button';
import { CardRoot, CardHeader, CardTitle, CardContent } from '@gaudi/design-system/core/Card';
import katex from 'katex';
import ConsumerControls from './ConsumerControls';

export default async function Page({ searchParams }) {
  const query = await searchParams;
  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: 16 }}>
      <h1>Gaudi package consumer</h1>
      <CardRoot>
        <CardHeader><CardTitle as='h2'>Server-rendered card</CardTitle></CardHeader>
        <CardContent>
          <p>Content supplied by a server component.</p>
          <form method='get'>
            <input type='hidden' name='submitted' value='yes' />
            <Button type='submit'>Submit native form</Button>
          </form>
          {query.submitted === 'yes' && <p>Native form received</p>}
          <ConsumerControls
            serverContent={<p>Server-supplied dialog content.</p>}
            mathMarkup={katex.renderToString('\\frac{x^2}{\\sqrt{y}}', { trust: false, throwOnError: false })}
          />
        </CardContent>
      </CardRoot>
    </main>
  );
}
