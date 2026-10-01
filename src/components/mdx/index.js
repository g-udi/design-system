/**
 * MDX Components Index
 *
 * @description Central export file for all MDX components and utilities.
 * Provides component mapping for MDX rendering and utility functions for dynamic component compilation.
 * Used by the MDX processing system to make components available within markdown content.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import CustomLink from '../core/Link';
import { BlogNewsletterForm } from '../layout/NewsletterForm';
import Aside from './Aside';
import Callout from './Callout';
import Chart, {
  AreaChart,
  BarChart,
  BoxPlotChart,
  BubbleChart,
  ComposedChart,
  DonutChart,
  FunnelChart,
  GaugeChart,
  HeatmapChart,
  HistogramChart,
  LineChart,
  PieChart,
  RadialBarChart,
  RangeChart,
  SankeyChart,
  ScatterChart,
  Sparkline,
  StackedBarList,
  TreemapChart,
  WaterfallChart
} from './Chart';
import CitationPopover from './CitationPopover';
import CitationTracker from './CitationTracker';
import { CodeFence, CodeGroup } from './Code';
import Details from './Details';
import Faq from './Faq';
import FileTree from './FileTree';
import Footnote from './Footnote';
import Highlight from './Highlight';
import Image from './Image';
import ImageModal from './ImageModal';
import Mermaid from './Mermaid';
import Preview from './Preview';
import Quote from './Quote';
import Table, { TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from './Table';
import Tooltip from './Tooltip';
import Video, { videoAnimationStyles } from './Video';

/**
 * Collection of all available MDX components
 * Maps component names to their implementations for use in MDX content
 */
export const MDXComponents = {
  AreaChart,
  Aside,
  BarChart,
  BlogNewsletterForm,
  BoxPlotChart,
  BubbleChart,
  Callout,
  Chart,
  CitationPopover,
  CitationTracker,
  CodeFence,
  CodeGroup,
  ComposedChart,
  Details,
  DonutChart,
  Faq,
  FileTree,
  Footnote,
  FunnelChart,
  GaugeChart,
  HeatmapChart,
  Highlight,
  HistogramChart,
  Image,
  ImageModal,
  LineChart,
  Mermaid,
  PieChart,
  Preview,
  Quote,
  RadialBarChart,
  RangeChart,
  SankeyChart,
  ScatterChart,
  Sparkline,
  StackedBarList,
  Table,
  Tooltip,
  TreemapChart,
  Video,
  WaterfallChart,
  'a': CustomLink,
  'pre': CodeFence,
  'table': Table,
  'tbody': TableBody,
  'td': TableCell,
  'th': TableHeaderCell,
  'thead': TableHead,
  'tr': TableRow};

export {
  AreaChart,
  Aside,
  BarChart,
  BoxPlotChart,
  BubbleChart,
  Callout,
  Chart,
  CitationPopover,
  CitationTracker,
  CodeFence,
  CodeGroup,
  ComposedChart,
  Details,
  DonutChart,
  Faq,
  FileTree,
  Footnote,
  FunnelChart,
  GaugeChart,
  HeatmapChart,
  Highlight,
  HistogramChart,
  Image,
  ImageModal,
  LineChart,
  Mermaid,
  PieChart,
  Preview,
  Quote,
  RadialBarChart,
  RangeChart,
  SankeyChart,
  ScatterChart,
  Sparkline,
  StackedBarList,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Tooltip,
  TreemapChart,
  Video,
  videoAnimationStyles,
  WaterfallChart
};

// Composition exports
export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle } from './Chart/index.js';
export { TableRoot, TableHeader, TableBodyPrimitive, TableFooter, TableHeadPrimitive, TableRowPrimitive, TableCellPrimitive, TableCaption } from './Table/index.js';
