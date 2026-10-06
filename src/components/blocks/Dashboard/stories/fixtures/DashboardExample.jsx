import { StatCard } from '@gaudi/design-system/blocks/StatCard';
import { AreaChart } from '@gaudi/design-system/charts/AreaChart';
import { BarChart } from '@gaudi/design-system/charts/BarChart';
import { DashboardGrid, DashboardPanel, DashboardToolbar, dashboardSpan } from '@gaudi/design-system/blocks/Dashboard';

export const today = new Date(2026, 9, 1);

export const readers = ['Sep 4', 'Sep 8', 'Sep 12', 'Sep 16', 'Sep 20', 'Sep 24', 'Sep 28', 'Oct 1'].map((label, index) => ({ label, search: 2100 + index * 120, newsletter: 1500 + index * 80 }));

export const sources = [
  { label: 'Search', value: 46 },
  { label: 'Newsletter', value: 31 },
  { label: 'Social', value: 14 },
  { label: 'Direct', value: 9 }
];

export const layouts = { balanced: [6, 6], focus: [8, 4], stacked: [12, 12] };

export const DashboardExample = ({ period, compare, layout, showDescriptions }) => {
    const [main, side] = layouts[layout];
    return (
      <div className='grid w-full gap-4'>
        <DashboardToolbar key={`${period}-${compare}`} today={today} defaultPeriod={period} defaultCompare={compare} />
        <DashboardGrid label='Reading overview'>
          <StatCard label='Readers' value='48.2k' delta='+12%' deltaDirection='up' deltaTone='success' description={showDescriptions ? 'Unique readers' : undefined} className={dashboardSpan(3)} />
          <StatCard label='Read time' value='4m 38s' delta='+6%' deltaDirection='up' deltaTone='success' description={showDescriptions ? 'Median per article' : undefined} className={dashboardSpan(3)} />
          <StatCard label='Signups' value='1,284' delta='+8%' deltaDirection='up' deltaTone='success' description={showDescriptions ? 'Newsletter' : undefined} className={dashboardSpan(3)} />
          <StatCard label='Bounce' value='38.6%' delta='+4.1 pts' deltaDirection='up' deltaTone='danger' description={showDescriptions ? 'Single-page visits' : undefined} className={dashboardSpan(3)} />
          <DashboardPanel span={main} title='Readers by channel' description={showDescriptions ? 'Search and newsletter, this month' : undefined}>
            <AreaChart framed={false} ariaLabel='Readers by channel' data={readers} stacked showLegend height={220} series={[{ key: 'search', label: 'Search' }, { key: 'newsletter', label: 'Newsletter' }]} />
          </DashboardPanel>
          <DashboardPanel span={side} title='Traffic sources' description={showDescriptions ? 'Share of visits' : undefined}>
            <BarChart framed={false} ariaLabel='Share of visits by source' data={sources} layout='horizontal' height={220} formatValue={(value) => `${value}%`} />
          </DashboardPanel>
        </DashboardGrid>
      </div>
    );
  };
