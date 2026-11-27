export const getPageShortcuts = (currentPage, totalPages) => {
  if (totalPages <= 5) return Array.from({ 'length': totalPages }, (_, index) => index + 1);

  const pages = [ 1, currentPage - 1, currentPage, currentPage + 1, totalPages ]
    .filter((page, index, values) => page >= 1 && page <= totalPages && values.indexOf(page) === index)
    .sort((first, second) => first - second);

  return pages.flatMap((page, index) => {
    const previousPage = pages[index - 1];

    return previousPage && page - previousPage > 1 ? [ `ellipsis-${previousPage}-${page}`, page ] : [ page ];
  });
};
