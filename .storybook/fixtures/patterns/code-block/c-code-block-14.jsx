'use client';
import {
  CodeBlock,
  CodeBlockCopyButton
} from '../../../../src/components/mdx/CodeGroupTabs/parts/code-block-extended.jsx';
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../../../../src/components/core/Tabs/index.js';
const samples = [
  {
    file: 'greeting.tsx',
    language: 'tsx',
    code: `export function Greeting({ name }: { name: string }) {
  return <p>Hello {name}</p>
}`
  },
  {
    file: 'greeting.py',
    language: 'python',
    code: `def greeting(name: str) -> str:
    return f"Hello {name}"`
  },
  {
    file: 'greeting.sql',
    language: 'sql',
    code: `select id, email
from users
where created_at > now() - interval '7 days';`
  },
  {
    file: 'greeting.sh',
    language: 'bash',
    code: `curl -s https://api.example.com/v1/users \\
  -H "Authorization: Bearer $TOKEN"`
  }
];
export function Pattern() {
  return (
    <Tabs defaultValue={samples[0].file} className='w-full max-w-2xl'>
      <Frame dense spacing='sm'>
        <FrameHeader className='flex-row items-center gap-2'>
          <FrameTitle>Examples</FrameTitle>
          <TabsList className='ml-auto bg-transparent'>
            {samples.map((sample) => (
              <TabsTrigger key={sample.file} value={sample.file}>
                {sample.file}
              </TabsTrigger>
            ))}
          </TabsList>
        </FrameHeader>

        <FramePanel className='p-0!'>
          {samples.map((sample) => (
            <TabsContent key={sample.file} value={sample.file}>
              <CodeBlock
                code={sample.code}
                language={sample.language}
                variant='ghost'
                showLineNumbers
              >
                <CodeBlockCopyButton
                  variant='outline'
                  size='icon-xs'
                  className='bg-ui-card hover:bg-ui-muted'
                />
              </CodeBlock>
            </TabsContent>
          ))}
        </FramePanel>
      </Frame>
    </Tabs>
  );
}
