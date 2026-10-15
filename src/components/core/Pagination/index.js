export { default } from './Pagination';
export * from './Pagination';
export { POSTS_PER_PAGE } from './constants.js';

// Composition exports
export { Pagination as PaginationRoot, PaginationContent as PaginationContentPrimitive, PaginationEllipsis as PaginationEllipsisPrimitive, PaginationItem as PaginationItemPrimitive, PaginationLink as PaginationLinkPrimitive, PaginationNext as PaginationNextPrimitive, PaginationPrevious as PaginationPreviousPrimitive } from './PaginationPrimitives.jsx';
