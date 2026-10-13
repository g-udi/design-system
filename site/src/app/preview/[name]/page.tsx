import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { catalogue, getPattern } from '@/lib/catalogue';
import { PatternPreview } from './PatternPreview';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(catalogue.patterns).map((name) => ({ name }));
}

export async function generateMetadata(props: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await props.params;
  return { title: `${getPattern(name)?.title || name} preview`, robots: { index: false } };
}

export default async function PreviewPage(props: { params: Promise<{ name: string }> }) {
  const { name } = await props.params;
  const pattern = getPattern(name);
  if (!pattern) notFound();
  return <PatternPreview name={name} block={pattern.block} title={pattern.title} />;
}
