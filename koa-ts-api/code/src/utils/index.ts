/**
 * input string must be in snake case
 * @param snakeCaseString string in snake case
 * @returns string in camel case
 */
export const convertToCamelCase = (snakeCaseString: string) =>
  snakeCaseString
    .toLowerCase()
    .split('_')
    .reduce((acc, curr) => acc + (curr.charAt(0).toUpperCase() + curr.slice(1)));

const isUpperCase = (str: string) => str === str.toUpperCase();
/**
 * input string must be in camel case
 * @param camelCaseString string in camer case
 * @returns string in snake case
 */
export const convertToSnakeCase = (camelCaseString: string) =>
  camelCaseString
    .split('')
    .reduce((acc, curr) => acc + (isUpperCase(curr) ? '_' : '') + curr.toLowerCase(), '');

export const calculatePaginationLinks = (currentPage: number, baseUrl: string) => {
  const paginationLinks = [];

  if (currentPage > 1) {
    paginationLinks.push(`<${baseUrl}?page=1>; rel="first"`);
    paginationLinks.push(`<${baseUrl}?page=${currentPage - 1}>; rel="previous"`);
  }

  paginationLinks.push(`<${baseUrl}?page=${currentPage + 1}>; rel="next"`);
  return paginationLinks.join(', ');
};
