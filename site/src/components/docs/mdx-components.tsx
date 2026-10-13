import Link from 'next/link';
import type { ComponentProps } from 'react';
import type { MDXComponents } from 'mdx/types';
import CodeFence from '@gaudi/design-system/mdx/Code';
import Callout from '@gaudi/design-system/mdx/Callout';
import { ComponentHeader, Example, Install, Playground, PropsTable, Related, SectionIndex, Usage } from './catalogue-blocks';
import { StoryExample } from './StoryExample';
import { Cards, Card, ColorTokens, IconGallery, MotionTokens, PresetGallery, RadiusAndDensity, StorybookCard, TypeScale } from './foundations';

function SmartLink({ href = '', ...props }: ComponentProps<'a'>) {
  if (href.startsWith('/') || href.startsWith('#')) return <Link href={href} {...props} />;
  return <a href={href} target='_blank' rel='noreferrer' {...props} />;
}

export const mdxComponents: MDXComponents = {
  a: SmartLink,
  pre: CodeFence,
  Callout,
  Cards,
  Card,
  ComponentHeader,
  Install,
  Usage,
  Example,
  Playground,
  StoryExample,
  PropsTable,
  Related,
  SectionIndex,
  ColorTokens,
  TypeScale,
  IconGallery,
  MotionTokens,
  RadiusAndDensity,
  PresetGallery,
  StorybookCard
};
