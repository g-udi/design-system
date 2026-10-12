'use client';
'use no memo';
import { useMemo, useState } from 'react';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  DataGrid,
  DataGridContainer,
  DataGridTableRowExpand,
  dataGridFeatures
} from '@gaudi/design-system/core/DataTable';
import { DataGridColumnHeader } from '@gaudi/design-system/core/DataTable';
import { DataGridPagination } from '@gaudi/design-system/core/DataTable';
import { DataGridScrollArea } from '@gaudi/design-system/core/DataTable';
import { DataGridTable } from '@gaudi/design-system/core/DataTable';
import { useTable } from '@tanstack/react-table';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { CardRoot as Card } from '@gaudi/design-system/core/Card';
const demoData = [
  {
    id: '1',
    orderNumber: 'SO-001',
    customer: 'Anouk Varga',
    customerEmail: 'anouk@example.com',
    customerAvatar:
      '/avatars/person-41.svg',
    total: '$459.97',
    status: {
      label: 'Shipped',
      variant: 'primary-light'
    },
    items: [
      {
        id: '1-1',
        productName: 'Desk Tidy',
        category: 'Electronics',
        price: '$199.99',
        quantity: 1
      },
      {
        id: '1-2',
        productName: 'Hanging Wire',
        category: 'Accessories',
        price: '$99.99',
        quantity: 1
      },
      {
        id: '1-3',
        productName: 'Lino Block',
        category: 'Accessories',
        price: '$29.99',
        quantity: 2
      },
      {
        id: '1-4',
        productName: 'Nib Set',
        category: 'Electronics',
        price: '$19.99',
        quantity: 1
      },
      {
        id: '1-5',
        productName: 'Linen Notebook',
        category: 'Electronics',
        price: '$89.99',
        quantity: 1
      },
      {
        id: '1-6',
        productName: 'Picture Hooks',
        category: 'Accessories',
        price: '$39.99',
        quantity: 1
      },
      {
        id: '1-7',
        productName: 'Wax Seal Kit',
        category: 'Accessories',
        price: '$19.99',
        quantity: 2
      },
      {
        id: '1-8',
        productName: 'Chalk Pens',
        category: 'Electronics',
        price: '$49.99',
        quantity: 1
      },
      {
        id: '1-9',
        productName: 'Desk Calendar',
        category: 'Electronics',
        price: '$79.99',
        quantity: 1
      },
      {
        id: '1-10',
        productName: 'Pocket Diary',
        category: 'Electronics',
        price: '$59.99',
        quantity: 1
      },
      {
        id: '1-11',
        productName: 'Tracing Paper',
        category: 'Accessories',
        price: '$19.99',
        quantity: 1
      },
      {
        id: '1-12',
        productName: 'Sticker Sheet',
        category: 'Home',
        price: '$79.99',
        quantity: 1
      }
    ]
  },
  {
    id: '2',
    orderNumber: 'SO-002',
    customer: 'Sabine Okafor',
    customerEmail: 'sabine@example.com',
    customerAvatar:
      '/avatars/person-20.svg',
    total: '$249.48',
    status: {
      label: 'Processing',
      variant: 'info-light'
    },
    items: [
      {
        id: '2-1',
        productName: 'Rubber Brayer',
        category: 'Sports',
        price: '$89.99',
        quantity: 1
      },
      {
        id: '2-2',
        productName: 'Squeegee Blade',
        category: 'Sports',
        price: '$59.51',
        quantity: 1
      },
      {
        id: '2-3',
        productName: 'Paint Markers',
        category: 'Sports',
        price: '$24.99',
        quantity: 1
      },
      {
        id: '2-4',
        productName: 'Washi Tape',
        category: 'Electronics',
        price: '$74.99',
        quantity: 1
      }
    ]
  },
  {
    id: '3',
    orderNumber: 'SO-003',
    customer: 'Rafe Okonkwo',
    customerEmail: 'rafe@example.com',
    customerAvatar:
      '/avatars/person-31.svg',
    total: '$189.97',
    status: {
      label: 'Delivered',
      variant: 'success-light'
    },
    items: [
      {
        id: '3-1',
        productName: 'Poster Tube',
        category: 'Home',
        price: '$89.99',
        quantity: 1
      },
      {
        id: '3-2',
        productName: 'Book Stand',
        category: 'Food',
        price: '$24.99',
        quantity: 1
      },
      {
        id: '3-3',
        productName: 'Art Print',
        category: 'Home',
        price: '$49.99',
        quantity: 1
      },
      {
        id: '3-4',
        productName: 'Pencil Case',
        category: 'Home',
        price: '$24.99',
        quantity: 1
      },
      {
        id: '3-5',
        productName: 'Cork Board',
        category: 'Home',
        price: '$9.99',
        quantity: 1
      },
      {
        id: '3-6',
        productName: 'Zine Kit',
        category: 'Home',
        price: '$19.99',
        quantity: 1
      },
      {
        id: '3-7',
        productName: 'Stencil Set',
        category: 'Home',
        price: '$39.99',
        quantity: 1
      },
      {
        id: '3-8',
        productName: 'Creamer',
        category: 'Food',
        price: '$14.99',
        quantity: 1
      },
      {
        id: '3-9',
        productName: 'Tote Bag',
        category: 'Furniture',
        price: '$199.99',
        quantity: 1
      },
      {
        id: '3-10',
        productName: 'Placemats',
        category: 'Home',
        price: '$12.99',
        quantity: 1
      },
      {
        id: '3-11',
        productName: 'Napkins',
        category: 'Home',
        price: '$7.99',
        quantity: 1
      },
      {
        id: '3-12',
        productName: 'Candles',
        category: 'Home',
        price: '$16.99',
        quantity: 1
      },
      {
        id: '3-13',
        productName: 'Vase',
        category: 'Home',
        price: '$29.99',
        quantity: 1
      },
      {
        id: '3-14',
        productName: 'Flowers',
        category: 'Home',
        price: '$24.99',
        quantity: 1
      },
      {
        id: '3-15',
        productName: 'Risograph Paper',
        category: 'Home',
        price: '$18.99',
        quantity: 1
      }
    ]
  },
  {
    id: '4',
    orderNumber: 'SO-004',
    customer: 'Ilse Valtonen',
    customerEmail: 'ilse@example.com',
    customerAvatar:
      '/avatars/person-24.svg',
    total: '$299.97',
    status: {
      label: 'Cancelled',
      variant: 'destructive-light'
    },
    items: [
      {
        id: '4-1',
        productName: 'Palette Knife',
        category: 'Electronics',
        price: '$99.99',
        quantity: 1
      },
      {
        id: '4-2',
        productName: 'Letter Tray',
        category: 'Electronics',
        price: '$49.99',
        quantity: 1
      },
      {
        id: '4-3',
        productName: 'Keyboard',
        category: 'Electronics',
        price: '$79.99',
        quantity: 1
      },
      {
        id: '4-4',
        productName: 'Monitor',
        category: 'Electronics',
        price: '$69.99',
        quantity: 1
      },
      {
        id: '4-5',
        productName: 'Webcam',
        category: 'Electronics',
        price: '$89.99',
        quantity: 1
      },
      {
        id: '4-6',
        productName: 'Microphone',
        category: 'Electronics',
        price: '$59.99',
        quantity: 1
      },
      {
        id: '4-7',
        productName: 'Headphones',
        category: 'Electronics',
        price: '$129.99',
        quantity: 1
      },
      {
        id: '4-8',
        productName: 'Lettering Pens',
        category: 'Electronics',
        price: '$29.99',
        quantity: 1
      },
      {
        id: '4-9',
        productName: 'Brass Bookmark',
        category: 'Accessories',
        price: '$19.99',
        quantity: 1
      },
      {
        id: '4-10',
        productName: 'Postcard Pack',
        category: 'Office',
        price: '$24.99',
        quantity: 1
      }
    ]
  },
  {
    id: '5',
    orderNumber: 'SO-005',
    customer: 'Ottilie Nakamura',
    customerEmail: 'ottilie@example.com',
    customerAvatar:
      '/avatars/person-45.svg',
    total: '$179.97',
    status: {
      label: 'Pending',
      variant: 'warning-light'
    },
    items: [
      {
        id: '5-1',
        productName: 'Sticker Sheet',
        category: 'Home',
        price: '$79.99',
        quantity: 1
      },
      {
        id: '5-2',
        productName: 'Gift Wrap',
        category: 'Home',
        price: '$39.99',
        quantity: 1
      },
      {
        id: '5-3',
        productName: 'Light Box',
        category: 'Office',
        price: '$29.99',
        quantity: 1
      },
      {
        id: '5-4',
        productName: 'Mount Board',
        category: 'Office',
        price: '$29.99',
        quantity: 1
      },
      {
        id: '5-5',
        productName: 'Stapler',
        category: 'Office',
        price: '$12.99',
        quantity: 1
      },
      {
        id: '5-6',
        productName: 'Canvas Panel',
        category: 'Office',
        price: '$4.99',
        quantity: 1
      },
      {
        id: '5-7',
        productName: 'Binder',
        category: 'Office',
        price: '$8.99',
        quantity: 1
      },
      {
        id: '5-8',
        productName: 'Highlighter',
        category: 'Office',
        price: '$6.99',
        quantity: 1
      },
      {
        id: '5-9',
        productName: 'Eraser',
        category: 'Office',
        price: '$2.99',
        quantity: 1
      },
      {
        id: '5-10',
        productName: 'Ruler',
        category: 'Office',
        price: '$3.99',
        quantity: 1
      },
      {
        id: '5-11',
        productName: 'Calculator',
        category: 'Office',
        price: '$19.99',
        quantity: 1
      },
      {
        id: '5-12',
        productName: 'Calendar',
        category: 'Office',
        price: '$14.99',
        quantity: 1
      },
      {
        id: '5-13',
        productName: 'Whiteboard',
        category: 'Office',
        price: '$24.99',
        quantity: 1
      },
      {
        id: '5-14',
        productName: 'Markers',
        category: 'Office',
        price: '$9.99',
        quantity: 1
      },
      {
        id: '5-15',
        productName: 'Stamp Set',
        category: 'Office',
        price: '$5.99',
        quantity: 1
      }
    ]
  },
  {
    id: '6',
    orderNumber: 'SO-006',
    customer: 'Aurelio Brandt',
    customerEmail: 'nell@example.com',
    customerAvatar:
      '/avatars/person-50.svg',
    total: '$329.95',
    status: {
      label: 'Shipped',
      variant: 'primary-light'
    },
    items: [
      {
        id: '6-1',
        productName: 'Linen Notebook',
        category: 'Electronics',
        price: '$129.99',
        quantity: 1
      },
      {
        id: '6-2',
        productName: 'Picture Hooks',
        category: 'Accessories',
        price: '$39.99',
        quantity: 1
      },
      {
        id: '6-3',
        productName: 'Wax Seal Kit',
        category: 'Accessories',
        price: '$19.99',
        quantity: 2
      },
      {
        id: '6-4',
        productName: 'Chalk Pens',
        category: 'Electronics',
        price: '$49.99',
        quantity: 1
      },
      {
        id: '6-5',
        productName: 'Printing Ink',
        category: 'Electronics',
        price: '$199.99',
        quantity: 1
      },
      {
        id: '6-6',
        productName: 'Glue Stick',
        category: 'Electronics',
        price: '$79.99',
        quantity: 1
      },
      {
        id: '6-7',
        productName: 'Hanging Wire',
        category: 'Accessories',
        price: '$24.99',
        quantity: 1
      },
      {
        id: '6-8',
        productName: 'Lino Block',
        category: 'Accessories',
        price: '$14.99',
        quantity: 1
      },
      {
        id: '6-9',
        productName: 'Ink Bottle',
        category: 'Accessories',
        price: '$29.99',
        quantity: 1
      },
      {
        id: '6-10',
        productName: 'Awl Tool',
        category: 'Electronics',
        price: '$39.99',
        quantity: 1
      },
      {
        id: '6-11',
        productName: 'Calligraphy Guide',
        category: 'Electronics',
        price: '$9.99',
        quantity: 1
      },
      {
        id: '6-12',
        productName: 'Adapter',
        category: 'Electronics',
        price: '$19.99',
        quantity: 1
      },
      {
        id: '6-13',
        productName: 'Headphones',
        category: 'Electronics',
        price: '$89.99',
        quantity: 1
      },
      {
        id: '6-14',
        productName: 'Earbuds',
        category: 'Electronics',
        price: '$59.99',
        quantity: 1
      },
      {
        id: '6-15',
        productName: 'Microphone',
        category: 'Electronics',
        price: '$49.99',
        quantity: 1
      }
    ]
  },
  {
    id: '7',
    orderNumber: 'SO-007',
    customer: 'Felix Arrowsmith',
    customerEmail: 'felix@example.com',
    customerAvatar:
      '/avatars/person-47.svg',
    total: '$159.96',
    status: {
      label: 'Processing',
      variant: 'info-light'
    },
    items: [
      {
        id: '7-1',
        productName: 'Desk Calendar',
        category: 'Electronics',
        price: '$79.99',
        quantity: 1
      },
      {
        id: '7-2',
        productName: 'Pocket Diary',
        category: 'Electronics',
        price: '$59.99',
        quantity: 1
      },
      {
        id: '7-3',
        productName: 'Tracing Paper',
        category: 'Accessories',
        price: '$19.99',
        quantity: 1
      },
      {
        id: '7-4',
        productName: 'Recipe Cards',
        category: 'Electronics',
        price: '$99.99',
        quantity: 1
      },
      {
        id: '7-5',
        productName: 'Archival Box',
        category: 'Furniture',
        price: '$299.99',
        quantity: 1
      },
      {
        id: '7-6',
        productName: 'Index Cards',
        category: 'Furniture',
        price: '$199.99',
        quantity: 1
      },
      {
        id: '7-7',
        productName: 'Ink Pad',
        category: 'Electronics',
        price: '$29.99',
        quantity: 1
      },
      {
        id: '7-8',
        productName: 'Controller',
        category: 'Electronics',
        price: '$49.99',
        quantity: 1
      },
      {
        id: '7-9',
        productName: 'Wall Planner',
        category: 'Electronics',
        price: '$399.99',
        quantity: 1
      },
      {
        id: '7-10',
        productName: 'Field Notebook',
        category: 'Electronics',
        price: '$599.99',
        quantity: 1
      },
      {
        id: '7-11',
        productName: 'RAM',
        category: 'Electronics',
        price: '$89.99',
        quantity: 1
      },
      {
        id: '7-12',
        productName: 'SSD',
        category: 'Electronics',
        price: '$129.99',
        quantity: 1
      },
      {
        id: '7-13',
        productName: 'CPU',
        category: 'Electronics',
        price: '$299.99',
        quantity: 1
      },
      {
        id: '7-14',
        productName: 'Motherboard',
        category: 'Electronics',
        price: '$199.99',
        quantity: 1
      },
      {
        id: '7-15',
        productName: 'Bookbinding Kit',
        category: 'Electronics',
        price: '$149.99',
        quantity: 1
      }
    ]
  },
  {
    id: '8',
    orderNumber: 'SO-008',
    customer: 'Mireille Gaspard',
    customerEmail: 'mireille@example.com',
    customerAvatar:
      '/avatars/person-25.svg',
    total: '$89.97',
    status: {
      label: 'Delivered',
      variant: 'success-light'
    },
    items: [
      {
        id: '8-1',
        productName: 'Reading Glasses',
        category: 'Sports',
        price: '$29.99',
        quantity: 1
      },
      {
        id: '8-2',
        productName: 'Paint Markers',
        category: 'Sports',
        price: '$19.99',
        quantity: 1
      },
      {
        id: '8-3',
        productName: 'Embossing Folder',
        category: 'Sports',
        price: '$39.99',
        quantity: 1
      },
      {
        id: '8-4',
        productName: 'Dumbbells',
        category: 'Sports',
        price: '$49.99',
        quantity: 1
      },
      {
        id: '8-5',
        productName: 'Kettlebell',
        category: 'Sports',
        price: '$59.99',
        quantity: 1
      },
      {
        id: '8-6',
        productName: 'Brush Set',
        category: 'Sports',
        price: '$14.99',
        quantity: 1
      },
      {
        id: '8-7',
        productName: 'Masking Tape',
        category: 'Sports',
        price: '$24.99',
        quantity: 1
      },
      {
        id: '8-8',
        productName: 'Bone Folder',
        category: 'Sports',
        price: '$34.99',
        quantity: 1
      },
      {
        id: '8-9',
        productName: 'Book Ends',
        category: 'Sports',
        price: '$12.99',
        quantity: 1
      },
      {
        id: '8-10',
        productName: 'Drying Rack',
        category: 'Sports',
        price: '$9.99',
        quantity: 1
      },
      {
        id: '8-11',
        productName: 'Sketchbook A5',
        category: 'Sports',
        price: '$7.99',
        quantity: 1
      },
      {
        id: '8-12',
        productName: 'Screen Frame',
        category: 'Clothing',
        price: '$29.99',
        quantity: 1
      },
      {
        id: '8-13',
        productName: 'Magazine File',
        category: 'Clothing',
        price: '$24.99',
        quantity: 1
      },
      {
        id: '8-14',
        productName: 'Rubber Brayer',
        category: 'Sports',
        price: '$89.99',
        quantity: 1
      },
      {
        id: '8-15',
        productName: 'Paper Press',
        category: 'Sports',
        price: '$12.99',
        quantity: 1
      }
    ]
  },
  {
    id: '9',
    orderNumber: 'SO-009',
    customer: 'Barnaby Okafor',
    customerEmail: 'barnaby@example.com',
    customerAvatar:
      '/avatars/person-07.svg',
    total: '$199.98',
    status: {
      label: 'Cancelled',
      variant: 'destructive-light'
    },
    items: [
      {
        id: '9-1',
        productName: 'Printing Ink',
        category: 'Electronics',
        price: '$199.99',
        quantity: 1
      },
      {
        id: '9-2',
        productName: 'Gel Pens',
        category: 'Accessories',
        price: '$29.99',
        quantity: 1
      },
      {
        id: '9-3',
        productName: 'Blotting Paper',
        category: 'Electronics',
        price: '$39.99',
        quantity: 1
      },
      {
        id: '9-4',
        productName: 'Lino Block',
        category: 'Accessories',
        price: '$14.99',
        quantity: 1
      },
      {
        id: '9-5',
        productName: 'Case',
        category: 'Accessories',
        price: '$19.99',
        quantity: 1
      },
      {
        id: '9-6',
        productName: 'Strap',
        category: 'Accessories',
        price: '$24.99',
        quantity: 1
      },
      {
        id: '9-7',
        productName: 'Cable',
        category: 'Electronics',
        price: '$9.99',
        quantity: 1
      },
      {
        id: '9-8',
        productName: 'Adapter',
        category: 'Electronics',
        price: '$12.99',
        quantity: 1
      },
      {
        id: '9-9',
        productName: 'Mount',
        category: 'Accessories',
        price: '$16.99',
        quantity: 1
      },
      {
        id: '9-10',
        productName: 'Stand',
        category: 'Accessories',
        price: '$22.99',
        quantity: 1
      },
      {
        id: '9-11',
        productName: 'Cover',
        category: 'Accessories',
        price: '$8.99',
        quantity: 1
      },
      {
        id: '9-12',
        productName: 'Grip',
        category: 'Accessories',
        price: '$11.99',
        quantity: 1
      },
      {
        id: '9-13',
        productName: 'Lens',
        category: 'Accessories',
        price: '$6.99',
        quantity: 1
      },
      {
        id: '9-14',
        productName: 'Filter',
        category: 'Accessories',
        price: '$4.99',
        quantity: 1
      },
      {
        id: '9-15',
        productName: 'Reading Light',
        category: 'Accessories',
        price: '$7.99',
        quantity: 1
      }
    ]
  },
  {
    id: '10',
    orderNumber: 'SO-010',
    customer: 'Quentin Hale',
    customerEmail: 'quentin@example.com',
    customerAvatar:
      '/avatars/person-23.svg',
    total: '$149.97',
    status: {
      label: 'Pending',
      variant: 'warning-light'
    },
    items: [
      {
        id: '10-1',
        productName: 'Paint Tin',
        category: 'Home',
        price: '$79.99',
        quantity: 1
      },
      {
        id: '10-2',
        productName: 'Enamel Pin',
        category: 'Home',
        price: '$29.99',
        quantity: 1
      },
      {
        id: '10-3',
        productName: 'Brush Pens',
        category: 'Home',
        price: '$39.99',
        quantity: 1
      },
      {
        id: '10-4',
        productName: 'Ribbon Spool',
        category: 'Home',
        price: '$12.99',
        quantity: 1
      },
      {
        id: '10-5',
        productName: 'Book Cloth',
        category: 'Home',
        price: '$8.99',
        quantity: 1
      },
      {
        id: '10-6',
        productName: 'Trivet',
        category: 'Home',
        price: '$14.99',
        quantity: 1
      },
      {
        id: '10-7',
        productName: 'Pastel Set',
        category: 'Home',
        price: '$16.99',
        quantity: 1
      },
      {
        id: '10-8',
        productName: 'Graphite Pencils',
        category: 'Home',
        price: '$9.99',
        quantity: 1
      },
      {
        id: '10-9',
        productName: 'Pencil Sharpener',
        category: 'Home',
        price: '$24.99',
        quantity: 1
      },
      {
        id: '10-10',
        productName: 'Spatula',
        category: 'Home',
        price: '$6.99',
        quantity: 1
      },
      {
        id: '10-11',
        productName: 'Whisk',
        category: 'Home',
        price: '$4.99',
        quantity: 1
      },
      {
        id: '10-12',
        productName: 'Ladle',
        category: 'Home',
        price: '$7.99',
        quantity: 1
      },
      {
        id: '10-13',
        productName: 'Tongs',
        category: 'Home',
        price: '$11.99',
        quantity: 1
      },
      {
        id: '10-14',
        productName: 'Fountain Pen',
        category: 'Home',
        price: '$13.99',
        quantity: 1
      },
      {
        id: '10-15',
        productName: 'Kraft Envelopes',
        category: 'Home',
        price: '$5.99',
        quantity: 1
      }
    ]
  },
  {
    id: '11',
    orderNumber: 'SO-011',
    customer: 'Anouk Varga',
    customerEmail: 'anouk@example.com',
    customerAvatar:
      '/avatars/person-41.svg',
    total: '$279.96',
    status: {
      label: 'Shipped',
      variant: 'primary-outline'
    },
    items: [
      {
        id: '11-1',
        productName: 'Easel Stand',
        category: 'Furniture',
        price: '$199.99',
        quantity: 1
      },
      {
        id: '11-2',
        productName: 'Postcard Pack',
        category: 'Office',
        price: '$19.99',
        quantity: 1
      },
      {
        id: '11-3',
        productName: 'Drafting Tape',
        category: 'Electronics',
        price: '$59.99',
        quantity: 1
      },
      {
        id: '11-4',
        productName: 'Sticker Sheet',
        category: 'Office',
        price: '$39.99',
        quantity: 1
      },
      {
        id: '11-5',
        productName: 'Frame Kit',
        category: 'Office',
        price: '$12.99',
        quantity: 1
      },
      {
        id: '11-6',
        productName: 'Craft Knife',
        category: 'Office',
        price: '$24.99',
        quantity: 1
      },
      {
        id: '11-7',
        productName: 'Stapler',
        category: 'Office',
        price: '$16.99',
        quantity: 1
      },
      {
        id: '11-8',
        productName: 'Canvas Panel',
        category: 'Office',
        price: '$4.99',
        quantity: 1
      },
      {
        id: '11-9',
        productName: 'Binder',
        category: 'Office',
        price: '$8.99',
        quantity: 1
      },
      {
        id: '11-10',
        productName: 'Highlighter',
        category: 'Office',
        price: '$6.99',
        quantity: 1
      },
      {
        id: '11-11',
        productName: 'Eraser',
        category: 'Office',
        price: '$2.99',
        quantity: 1
      },
      {
        id: '11-12',
        productName: 'Ruler',
        category: 'Office',
        price: '$3.99',
        quantity: 1
      },
      {
        id: '11-13',
        productName: 'Calculator',
        category: 'Office',
        price: '$19.99',
        quantity: 1
      },
      {
        id: '11-14',
        productName: 'Calendar',
        category: 'Office',
        price: '$14.99',
        quantity: 1
      },
      {
        id: '11-15',
        productName: 'Whiteboard',
        category: 'Office',
        price: '$24.99',
        quantity: 1
      }
    ]
  },
  {
    id: '12',
    orderNumber: 'SO-012',
    customer: 'Sabine Okafor',
    customerEmail: 'sabine@example.com',
    customerAvatar:
      '/avatars/person-20.svg',
    total: '$119.97',
    status: {
      label: 'Processing',
      variant: 'info-light'
    },
    items: [
      {
        id: '12-1',
        productName: 'Carving Tools',
        category: 'Beauty',
        price: '$59.99',
        quantity: 1
      },
      {
        id: '12-2',
        productName: 'Steel Rule',
        category: 'Beauty',
        price: '$29.99',
        quantity: 1
      },
      {
        id: '12-3',
        productName: 'Moisturizer',
        category: 'Beauty',
        price: '$29.99',
        quantity: 1
      },
      {
        id: '12-4',
        productName: 'Cleanser',
        category: 'Beauty',
        price: '$19.99',
        quantity: 1
      },
      {
        id: '12-5',
        productName: 'Toner',
        category: 'Beauty',
        price: '$24.99',
        quantity: 1
      },
      {
        id: '12-6',
        productName: 'Serum',
        category: 'Beauty',
        price: '$39.99',
        quantity: 1
      },
      {
        id: '12-7',
        productName: 'Cutting Mat',
        category: 'Beauty',
        price: '$34.99',
        quantity: 1
      },
      {
        id: '12-8',
        productName: 'Sunscreen',
        category: 'Beauty',
        price: '$16.99',
        quantity: 1
      },
      {
        id: '12-9',
        productName: 'Exfoliant',
        category: 'Beauty',
        price: '$22.99',
        quantity: 1
      },
      {
        id: '12-10',
        productName: 'Charcoal Sticks',
        category: 'Beauty',
        price: '$7.99',
        quantity: 1
      },
      {
        id: '12-11',
        productName: 'Watercolour Pad',
        category: 'Beauty',
        price: '$12.99',
        quantity: 1
      },
      {
        id: '12-12',
        productName: 'Letterpress Card Set',
        category: 'Beauty',
        price: '$18.99',
        quantity: 1
      },
      {
        id: '12-13',
        productName: 'Shampoo',
        category: 'Beauty',
        price: '$14.99',
        quantity: 1
      },
      {
        id: '12-14',
        productName: 'Conditioner',
        category: 'Beauty',
        price: '$14.99',
        quantity: 1
      },
      {
        id: '12-15',
        productName: 'Sketchbook A4',
        category: 'Beauty',
        price: '$19.99',
        quantity: 1
      }
    ]
  },
  {
    id: '13',
    orderNumber: 'SO-013',
    customer: 'Rafe Okonkwo',
    customerEmail: 'rafe@example.com',
    customerAvatar:
      '/avatars/person-31.svg',
    total: '$89.98',
    status: {
      label: 'Delivered',
      variant: 'success-light'
    },
    items: [
      {
        id: '13-1',
        productName: 'T-Shirt',
        category: 'Clothing',
        price: '$19.99',
        quantity: 2
      },
      {
        id: '13-2',
        productName: 'Jeans',
        category: 'Clothing',
        price: '$49.99',
        quantity: 1
      },
      {
        id: '13-3',
        productName: 'Hoodie',
        category: 'Clothing',
        price: '$39.99',
        quantity: 1
      },
      {
        id: '13-4',
        productName: 'Sweater',
        category: 'Clothing',
        price: '$34.99',
        quantity: 1
      },
      {
        id: '13-5',
        productName: 'Jacket',
        category: 'Clothing',
        price: '$79.99',
        quantity: 1
      },
      {
        id: '13-6',
        productName: 'Shorts',
        category: 'Clothing',
        price: '$24.99',
        quantity: 1
      },
      {
        id: '13-7',
        productName: 'Pants',
        category: 'Clothing',
        price: '$44.99',
        quantity: 1
      },
      {
        id: '13-8',
        productName: 'Dress',
        category: 'Clothing',
        price: '$59.99',
        quantity: 1
      },
      {
        id: '13-9',
        productName: 'Skirt',
        category: 'Clothing',
        price: '$29.99',
        quantity: 1
      },
      {
        id: '13-10',
        productName: 'Blouse',
        category: 'Clothing',
        price: '$34.99',
        quantity: 1
      },
      {
        id: '13-11',
        productName: 'Socks',
        category: 'Clothing',
        price: '$9.99',
        quantity: 1
      },
      {
        id: '13-12',
        productName: 'Underwear',
        category: 'Clothing',
        price: '$14.99',
        quantity: 1
      },
      {
        id: '13-13',
        productName: 'Hat',
        category: 'Clothing',
        price: '$19.99',
        quantity: 1
      },
      {
        id: '13-14',
        productName: 'Scarf',
        category: 'Clothing',
        price: '$16.99',
        quantity: 1
      },
      {
        id: '13-15',
        productName: 'Gloves',
        category: 'Clothing',
        price: '$12.99',
        quantity: 1
      }
    ]
  },
  {
    id: '14',
    orderNumber: 'SO-014',
    customer: 'Ilse Valtonen',
    customerEmail: 'ilse@example.com',
    customerAvatar:
      '/avatars/person-24.svg',
    total: '$199.97',
    status: {
      label: 'Shipped',
      variant: 'primary-light'
    },
    items: [
      {
        id: '14-1',
        productName: 'Tablet',
        category: 'Electronics',
        price: '$199.99',
        quantity: 1
      },
      {
        id: '14-2',
        productName: 'Cover Stock',
        category: 'Accessories',
        price: '$29.99',
        quantity: 1
      },
      {
        id: '14-3',
        productName: 'Lino Block',
        category: 'Accessories',
        price: '$14.99',
        quantity: 1
      },
      {
        id: '14-4',
        productName: 'Stylus',
        category: 'Accessories',
        price: '$39.99',
        quantity: 1
      },
      {
        id: '14-5',
        productName: 'Keyboard',
        category: 'Electronics',
        price: '$79.99',
        quantity: 1
      },
      {
        id: '14-6',
        productName: 'Mouse',
        category: 'Electronics',
        price: '$49.99',
        quantity: 1
      },
      {
        id: '14-7',
        productName: 'Nib Set',
        category: 'Electronics',
        price: '$19.99',
        quantity: 1
      },
      {
        id: '14-8',
        productName: 'Binding Thread',
        category: 'Electronics',
        price: '$24.99',
        quantity: 1
      },
      {
        id: '14-9',
        productName: 'Stand',
        category: 'Accessories',
        price: '$34.99',
        quantity: 1
      },
      {
        id: '14-10',
        productName: 'Mount',
        category: 'Accessories',
        price: '$19.99',
        quantity: 1
      },
      {
        id: '14-11',
        productName: 'Cover',
        category: 'Accessories',
        price: '$16.99',
        quantity: 1
      },
      {
        id: '14-12',
        productName: 'Grip',
        category: 'Accessories',
        price: '$11.99',
        quantity: 1
      },
      {
        id: '14-13',
        productName: 'Lens',
        category: 'Accessories',
        price: '$6.99',
        quantity: 1
      },
      {
        id: '14-14',
        productName: 'Filter',
        category: 'Accessories',
        price: '$4.99',
        quantity: 1
      },
      {
        id: '14-15',
        productName: 'Reading Light',
        category: 'Accessories',
        price: '$7.99',
        quantity: 1
      }
    ]
  },
  {
    id: '15',
    orderNumber: 'SO-015',
    customer: 'Ottilie Nakamura',
    customerEmail: 'ottilie@example.com',
    customerAvatar:
      '/avatars/person-45.svg',
    total: '$159.96',
    status: {
      label: 'Pending',
      variant: 'warning-light'
    },
    items: [
      {
        id: '15-1',
        productName: 'Recipe Cards',
        category: 'Electronics',
        price: '$99.99',
        quantity: 1
      },
      {
        id: '15-2',
        productName: 'Photo Corners',
        category: 'Electronics',
        price: '$59.99',
        quantity: 1
      },
      {
        id: '15-3',
        productName: 'Desk Calendar',
        category: 'Electronics',
        price: '$79.99',
        quantity: 1
      },
      {
        id: '15-4',
        productName: 'Pocket Diary',
        category: 'Electronics',
        price: '$129.99',
        quantity: 1
      },
      {
        id: '15-5',
        productName: 'Archival Box',
        category: 'Furniture',
        price: '$299.99',
        quantity: 1
      },
      {
        id: '15-6',
        productName: 'Index Cards',
        category: 'Furniture',
        price: '$199.99',
        quantity: 1
      },
      {
        id: '15-7',
        productName: 'Ink Pad',
        category: 'Electronics',
        price: '$29.99',
        quantity: 1
      },
      {
        id: '15-8',
        productName: 'Tracing Paper',
        category: 'Accessories',
        price: '$19.99',
        quantity: 1
      },
      {
        id: '15-9',
        productName: 'Wall Planner',
        category: 'Electronics',
        price: '$399.99',
        quantity: 1
      },
      {
        id: '15-10',
        productName: 'Field Notebook',
        category: 'Electronics',
        price: '$599.99',
        quantity: 1
      },
      {
        id: '15-11',
        productName: 'RAM',
        category: 'Electronics',
        price: '$89.99',
        quantity: 1
      },
      {
        id: '15-12',
        productName: 'SSD',
        category: 'Electronics',
        price: '$129.99',
        quantity: 1
      },
      {
        id: '15-13',
        productName: 'CPU',
        category: 'Electronics',
        price: '$299.99',
        quantity: 1
      },
      {
        id: '15-14',
        productName: 'Motherboard',
        category: 'Electronics',
        price: '$199.99',
        quantity: 1
      },
      {
        id: '15-15',
        productName: 'Bookbinding Kit',
        category: 'Electronics',
        price: '$149.99',
        quantity: 1
      }
    ]
  }
];
function OrderItemsSubTable({ items }) {
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
    // Show 3 items per page for sub-tables
  });
  const columns = useMemo(
    () => [
      {
        accessorKey: 'productName',
        header: ({ column }) => (
          <DataGridColumnHeader title='Product' column={column} />
        ),
        cell: (info) => info.getValue(),
        enableSorting: true,
        size: 200
      },
      {
        accessorKey: 'category',
        header: ({ column }) => (
          <DataGridColumnHeader title='Category' column={column} />
        ),
        cell: (info) => info.getValue(),
        enableSorting: true,
        size: 120
      },
      {
        accessorKey: 'price',
        header: ({ column }) => (
          <DataGridColumnHeader title='Price' column={column} />
        ),
        cell: (info) => info.getValue(),
        enableSorting: true,
        size: 100
      },
      {
        accessorKey: 'quantity',
        header: ({ column }) => (
          <DataGridColumnHeader title='Qty' column={column} />
        ),
        cell: (info) => info.getValue(),
        enableSorting: true,
        size: 80
      }
    ],
    []
  );
  const table = useTable({
    features: dataGridFeatures,
    data: items,
    columns,
    pageCount: Math.ceil(items.length / pagination.pageSize),
    state: {
      sorting,
      pagination
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getRowId: (row) => row.id
  });
  return (
    <div className='bg-ui-background min-w-0'>
      <DataGrid
        table={table}
        recordCount={items.length}
        tableLayout={{
          rowBorder: true
        }}
      >
        <div className='w-full min-w-0 space-y-2.5 p-3 pl-12'>
          <Card className='p-0'>
            <DataGridContainer className='min-w-0'>
              <DataGridScrollArea className='min-w-0'>
                <DataGridTable />
              </DataGridScrollArea>
            </DataGridContainer>
          </Card>
          <DataGridPagination className='pb-1.5' />
        </div>
      </DataGrid>
    </div>
  );
}
export function Pattern() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  });
  const [sorting, setSorting] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [columnOrder, setColumnOrder] = useState([
    'expand',
    'customer',
    'items',
    'total',
    'status'
  ]);
  const columns = useMemo(
    () => [
      {
        id: 'expand',
        header: () => null,
        cell: ({ row }) => <DataGridTableRowExpand row={row} indent={0} />,
        size: 25,
        enableResizing: false,
        meta: {
          expandedContent: (row) => <OrderItemsSubTable items={row.items} />
        }
      },
      {
        accessorKey: 'customer',
        id: 'customer',
        header: ({ column }) => (
          <DataGridColumnHeader
            title='Customer'
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          return (
            <div className='flex items-center gap-3'>
              <Avatar className='size-8'>
                <AvatarImage
                  src={row.original.customerAvatar}
                  alt={row.original.customer}
                />
                <AvatarFallback>
                  {row.original.customer
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className='space-y-px'>
                <div className='text-ui-foreground font-medium'>
                  {row.original.customer}
                </div>
                <div className='text-ui-muted-foreground'>
                  {row.original.customerEmail}
                </div>
              </div>
            </div>
          );
        },
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        size: 200
      },
      {
        accessorKey: 'items',
        id: 'items',
        header: ({ column }) => (
          <DataGridColumnHeader
            title='Items'
            visibility={true}
            column={column}
          />
        ),
        cell: (info) => {
          const items = info.getValue();
          const itemCount = items.length;
          return (
            <div
              className='text-ui-foreground hover:text-ui-primary cursor-pointer text-sm font-medium'
              onClick={() => info.row.getToggleExpandedHandler()()}
            >
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </div>
          );
        },
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        size: 120
      },
      {
        accessorKey: 'total',
        id: 'total',
        header: ({ column }) => (
          <DataGridColumnHeader
            title='Total'
            visibility={true}
            column={column}
          />
        ),
        cell: (info) => info.getValue(),
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        size: 100
      },
      {
        accessorKey: 'status',
        id: 'status',
        header: ({ column }) => (
          <DataGridColumnHeader
            title='Status'
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          const status = row.original.status;
          return <Badge variant={status.variant}>{status.label}</Badge>;
        },
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        size: 120
      }
    ],
    []
  );
  const table = useTable({
    features: dataGridFeatures,
    columns,
    data: demoData,
    pageCount: Math.ceil((demoData?.length || 0) / pagination.pageSize),
    getRowId: (row) => row.id,
    getRowCanExpand: (row) =>
      Boolean(row.original.items && row.original.items.length > 0),
    state: {
      pagination,
      sorting,
      expanded: expandedRows,
      columnOrder
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onExpandedChange: setExpandedRows,
    onColumnOrderChange: setColumnOrder
  });
  return (
    <DataGrid
      table={table}
      recordCount={demoData?.length || 0}
      i18n={{ labels: { expandRow: 'Expand order items', collapseRow: 'Collapse order items' } }}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true
      }}
    >
      <div className='w-full space-y-2.5'>
        <Card className='p-0'>
          <DataGridContainer>
            <DataGridScrollArea>
              <DataGridTable />
            </DataGridScrollArea>
          </DataGridContainer>
        </Card>
        <DataGridPagination />
      </div>
    </DataGrid>
  );
}
