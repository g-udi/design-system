'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger,
  useCascaderSelection
} from '../../../../src/components/core/Cascader/parts/cascader-extended.jsx';
import { CascaderItems } from '../../../../src/components/core/Cascader/parts/cascader-item-extended.jsx';
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue
} from '../../../../src/components/core/Cascader/parts/cascader-nav-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const usersIcon = <RegistryIcon lucide='UsersIcon' className='size-4' />;
const cartIcon = <RegistryIcon lucide='ShoppingCartIcon' className='size-4' />;
const packageIcon = <RegistryIcon lucide='PackageIcon' className='size-4' />;
const receiptIcon = <RegistryIcon lucide='ReceiptIcon' className='size-4' />;
const truckIcon = <RegistryIcon lucide='TruckIcon' className='size-4' />;
const undoIcon = <RegistryIcon lucide='RotateCcwIcon' className='size-4' />;
const repeatIcon = <RegistryIcon lucide='RepeatIcon' className='size-4' />;
const monitorIcon = <RegistryIcon lucide='MonitorIcon' className='size-4' />;
const houseIcon = <RegistryIcon lucide='HouseIcon' className='size-4' />;
const cardIcon = <RegistryIcon lucide='CreditCardIcon' className='size-4' />;
const textIcon = <RegistryIcon lucide='TypeIcon' className='size-4' />;
const mailIcon = <RegistryIcon lucide='MailIcon' className='size-4' />;
const phoneIcon = <RegistryIcon lucide='PhoneIcon' className='size-4' />;
const moneyIcon = <RegistryIcon lucide='BanknoteIcon' className='size-4' />;
const hashIcon = <RegistryIcon lucide='HashIcon' className='size-4' />;
const codeIcon = <RegistryIcon lucide='QrCodeIcon' className='size-4' />;
const routeIcon = <RegistryIcon lucide='RouteIcon' className='size-4' />;
const statusIcon = (
  <RegistryIcon lucide='CircleDashedIcon' className='size-4' />
);
const calendarIcon = <RegistryIcon lucide='CalendarIcon' className='size-4' />;
const calendarDueIcon = (
  <RegistryIcon lucide='CalendarClockIcon' className='size-4' />
);
const calendarDoneIcon = (
  <RegistryIcon lucide='CalendarCheckIcon' className='size-4' />
);
const timerIcon = <RegistryIcon lucide='TimerIcon' className='size-4' />;
const pinIcon = <RegistryIcon lucide='MapPinIcon' className='size-4' />;
const globeIcon = <RegistryIcon lucide='GlobeIcon' className='size-4' />;
const buildingIcon = <RegistryIcon lucide='BuildingIcon' className='size-4' />;
const targetIcon = <RegistryIcon lucide='TargetIcon' className='size-4' />;
const tagIcon = <RegistryIcon lucide='TagIcon' className='size-4' />;
const storeIcon = <RegistryIcon lucide='StoreIcon' className='size-4' />;
const listIcon = <RegistryIcon lucide='ListIcon' className='size-4' />;
const walletIcon = <RegistryIcon lucide='WalletIcon' className='size-4' />;
const archiveIcon = <RegistryIcon lucide='ArchiveIcon' className='size-4' />;
const layersIcon = <RegistryIcon lucide='LayersIcon' className='size-4' />;
const approvedIcon = <RegistryIcon lucide='UserCheckIcon' className='size-4' />;
const browserIcon = <RegistryIcon lucide='AppWindowIcon' className='size-4' />;
const wifiIcon = <RegistryIcon lucide='WifiIcon' className='size-4' />;
const fields = [
  {
    value: 'customers',
    label: 'Customers',
    icon: usersIcon,
    children: [
      { value: 'customers.name', label: 'Name', icon: textIcon },
      { value: 'customers.email', label: 'Email', icon: mailIcon },
      { value: 'customers.phone', label: 'Phone', icon: phoneIcon },
      { value: 'customers.segment', label: 'Segment', icon: tagIcon },
      {
        value: 'customers.lifetime_value',
        label: 'Lifetime value',
        icon: moneyIcon
      },
      { value: 'customers.signed_up', label: 'Signed up', icon: calendarIcon },
      {
        value: 'customers.address',
        label: 'Address',
        icon: houseIcon,
        children: [
          {
            value: 'customers.address.street',
            label: 'Street',
            icon: textIcon
          },
          {
            value: 'customers.address.city',
            label: 'City',
            icon: buildingIcon
          },
          {
            value: 'customers.address.postal_code',
            label: 'Postal code',
            icon: hashIcon
          },
          {
            value: 'customers.address.region',
            label: 'Region',
            icon: pinIcon
          },
          {
            value: 'customers.address.country',
            label: 'Country',
            icon: globeIcon
          },
          {
            value: 'customers.address.coordinates',
            label: 'Coordinates',
            icon: targetIcon
          }
        ]
      }
    ]
  },
  {
    value: 'orders',
    label: 'Orders',
    icon: cartIcon,
    children: [
      { value: 'orders.number', label: 'Order number', icon: hashIcon },
      { value: 'orders.total', label: 'Total', icon: moneyIcon },
      { value: 'orders.status', label: 'Status', icon: statusIcon },
      { value: 'orders.channel', label: 'Channel', icon: storeIcon },
      { value: 'orders.line_items', label: 'Line items', icon: listIcon },
      { value: 'orders.placed_at', label: 'Placed at', icon: calendarIcon },
      {
        value: 'orders.payment',
        label: 'Payment',
        icon: cardIcon,
        children: [
          {
            value: 'orders.payment.method',
            label: 'Method',
            icon: walletIcon
          },
          {
            value: 'orders.payment.card_brand',
            label: 'Card brand',
            icon: cardIcon
          },
          {
            value: 'orders.payment.last_four',
            label: 'Last four',
            icon: hashIcon
          },
          {
            value: 'orders.payment.authorized_at',
            label: 'Authorized at',
            icon: calendarIcon
          },
          {
            value: 'orders.payment.captured_at',
            label: 'Captured at',
            icon: calendarDoneIcon
          },
          {
            value: 'orders.payment.processor_fee',
            label: 'Processor fee',
            icon: moneyIcon
          }
        ]
      }
    ]
  },
  {
    value: 'products',
    label: 'Products',
    icon: packageIcon,
    children: [
      { value: 'products.name', label: 'Name', icon: textIcon },
      { value: 'products.sku', label: 'SKU', icon: codeIcon },
      { value: 'products.price', label: 'Price', icon: moneyIcon },
      { value: 'products.stock', label: 'Stock on hand', icon: archiveIcon },
      { value: 'products.category', label: 'Category', icon: tagIcon },
      { value: 'products.created_at', label: 'Created at', icon: calendarIcon }
    ]
  },
  {
    value: 'invoices',
    label: 'Invoices',
    icon: receiptIcon,
    children: [
      { value: 'invoices.number', label: 'Number', icon: hashIcon },
      { value: 'invoices.amount_due', label: 'Amount due', icon: moneyIcon },
      { value: 'invoices.status', label: 'Status', icon: statusIcon },
      { value: 'invoices.issued_at', label: 'Issued at', icon: calendarIcon },
      { value: 'invoices.due_date', label: 'Due date', icon: calendarDueIcon },
      { value: 'invoices.paid_at', label: 'Paid at', icon: calendarDoneIcon }
    ]
  },
  {
    value: 'shipments',
    label: 'Shipments',
    icon: truckIcon,
    children: [
      { value: 'shipments.carrier', label: 'Carrier', icon: truckIcon },
      {
        value: 'shipments.tracking',
        label: 'Tracking number',
        icon: routeIcon
      },
      { value: 'shipments.destination', label: 'Destination', icon: pinIcon },
      { value: 'shipments.status', label: 'Status', icon: statusIcon },
      {
        value: 'shipments.shipped_at',
        label: 'Shipped at',
        icon: calendarIcon
      },
      {
        value: 'shipments.delivered_at',
        label: 'Delivered at',
        icon: calendarDoneIcon
      }
    ]
  },
  {
    value: 'refunds',
    label: 'Refunds',
    icon: undoIcon,
    children: [
      { value: 'refunds.amount', label: 'Amount', icon: moneyIcon },
      { value: 'refunds.reason', label: 'Reason', icon: textIcon },
      { value: 'refunds.status', label: 'Status', icon: statusIcon },
      {
        value: 'refunds.approved_by',
        label: 'Approved by',
        icon: approvedIcon
      },
      {
        value: 'refunds.requested_at',
        label: 'Requested at',
        icon: calendarIcon
      },
      {
        value: 'refunds.processed_at',
        label: 'Processed at',
        icon: calendarDoneIcon
      }
    ]
  },
  {
    value: 'subscriptions',
    label: 'Subscriptions',
    icon: repeatIcon,
    children: [
      { value: 'subscriptions.plan', label: 'Plan', icon: layersIcon },
      { value: 'subscriptions.seats', label: 'Seats', icon: usersIcon },
      {
        value: 'subscriptions.mrr',
        label: 'Monthly revenue',
        icon: moneyIcon
      },
      { value: 'subscriptions.status', label: 'Status', icon: statusIcon },
      {
        value: 'subscriptions.started_at',
        label: 'Started at',
        icon: calendarIcon
      },
      {
        value: 'subscriptions.renews_at',
        label: 'Renews at',
        icon: calendarDueIcon
      }
    ]
  },
  {
    value: 'sessions',
    label: 'Sessions',
    icon: monitorIcon,
    children: [
      { value: 'sessions.device', label: 'Device', icon: monitorIcon },
      { value: 'sessions.browser', label: 'Browser', icon: browserIcon },
      { value: 'sessions.ip_address', label: 'IP address', icon: wifiIcon },
      { value: 'sessions.location', label: 'Location', icon: pinIcon },
      { value: 'sessions.started_at', label: 'Started at', icon: calendarIcon },
      { value: 'sessions.duration', label: 'Duration', icon: timerIcon }
    ]
  }
];
function ColumnChips() {
  const { paths, isEmpty, remove } = useCascaderSelection();
  if (isEmpty) {
    return (
      <p className='text-ui-muted-foreground text-sm'>
        No columns yet. Pick a table to start.
      </p>
    );
  }
  return (
    <div className='flex flex-wrap items-center gap-1.5'>
      {paths.map((path) => {
        const node = path[path.length - 1];
        if (!node) return null;
        const label = path.map((ancestor) => ancestor.label).join(' / ');
        return (
          <Badge key={node.value} variant='secondary' className='gap-0.5'>
            {label}
            <Button
              variant='ghost'
              size='icon'
              aria-label={`Remove ${label}`}
              onClick={() => remove(node.value)}
              className='size-3 hover:bg-transparent'
            >
              <RegistryIcon lucide='XIcon' />
            </Button>
          </Badge>
        );
      })}
    </div>
  );
}
export function Pattern() {
  const [value, setValue] = useState([]);
  return (
    <div className='flex w-full items-start justify-center self-start px-4 pt-6 pb-4'>
      <div className='flex w-full max-w-md flex-col gap-3'>
        <Cascader
          multiple
          items={fields}
          value={value}
          onValueChange={setValue}
        >
          <CascaderTrigger
            aria-label='Report columns'
            render={
              <Button
                variant='outline'
                className='w-full justify-between gap-2 font-normal'
              />
            }
          >
            <CascaderValue placeholder='Add a column...' display='count' />
          </CascaderTrigger>

          <CascaderContent className='w-80'>
            <CascaderPanel>
              <CascaderNav>
                <CascaderInput />
              </CascaderNav>
              <CascaderBreadcrumb />
              <CascaderEmpty />
              <CascaderList>
                <CascaderItems />
              </CascaderList>
              <CascaderStatus />
            </CascaderPanel>
          </CascaderContent>

          <ColumnChips />
        </Cascader>
      </div>
    </div>
  );
}
