// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../../../../src/components/core/Tabs/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [period, setPeriod] = useState('monthly');
  return (
    <div className='mx-auto flex w-full max-w-xs flex-col items-center gap-6'>
      <Tabs value={period} onValueChange={setPeriod} className='w-full'>
        <TabsList className='w-full'>
          <TabsTrigger value='daily' className='gap-1.5'>
            <RegistryIcon lucide='CalendarIcon' className='size-3.5 max-sm:hidden' />
            Daily
          </TabsTrigger>
          <TabsTrigger value='weekly' className='gap-1.5'>
            <RegistryIcon lucide='SquareCheckIcon' className='size-4 max-sm:hidden' />
            Weekly
          </TabsTrigger>
          <TabsTrigger value='monthly' className='gap-1.5'>
            <RegistryIcon lucide='UsersIcon' className='size-4 max-sm:hidden' />
            Monthly
          </TabsTrigger>
          <TabsTrigger value='yearly' className='gap-1.5'>
            <RegistryIcon lucide='CalendarClockIcon' className='size-3.5 max-sm:hidden' />
            Yearly
          </TabsTrigger>
        </TabsList>
        <TabsContent value='daily'>
          <Card>
            <CardContent className='text-center'>
              <p className='text-3xl font-bold'>1,284</p>
              <p className='text-ui-muted-foreground mt-1 text-sm'>
                Visitors today
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='weekly'>
          <Card>
            <CardContent className='text-center'>
              <p className='text-3xl font-bold'>8,942</p>
              <p className='text-ui-muted-foreground mt-1 text-sm'>
                Visitors this week
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='monthly'>
          <Card>
            <CardContent className='text-center'>
              <p className='text-3xl font-bold'>32,156</p>
              <p className='text-ui-muted-foreground mt-1 text-sm'>
                Visitors this month
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='yearly'>
          <Card>
            <CardContent className='text-center'>
              <p className='text-3xl font-bold'>384,721</p>
              <p className='text-ui-muted-foreground mt-1 text-sm'>
                Visitors this year
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
