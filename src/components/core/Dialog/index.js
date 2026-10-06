export { default, DialogClose } from './Dialog';

// Composition exports
export { Dialog as DialogRoot, DialogClose as DialogClosePrimitive, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from './DialogPrimitives.jsx';
export { Drawer, DrawerPortal, DrawerOverlay, DrawerTrigger, DrawerClose, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription } from './Drawer.jsx';

// Explicit confirmations retain alertdialog semantics and Cancel-first focus.
export { DialogConfirmation as DialogConfirmationRoot, DialogConfirmationAction, DialogConfirmationCancel, DialogConfirmationContent, DialogConfirmationDescription, DialogConfirmationFooter, DialogConfirmationHeader, DialogConfirmationMedia, DialogConfirmationOverlay, DialogConfirmationPortal, DialogConfirmationTitle, DialogConfirmationTrigger } from './DialogConfirmationPrimitives.jsx';
