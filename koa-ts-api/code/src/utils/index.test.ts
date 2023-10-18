import { calculatePaginationLinks, convertToCamelCase, convertToSnakeCase } from './index';

describe('utils function', () => {
  test('should convert from snake case to camel case', () => {
    expect(convertToCamelCase('snake_case')).toBe('snakeCase');
  });
  test('should convert from camel case to snake case', () => {
    expect(convertToSnakeCase('camelCase')).toBe('camel_case');
  });
  test('should return correct pagination links', () => {
    const baseUrl = 'http://localhost';
    const expectedResult =
      '<http://localhost?page=1>; rel="first", <http://localhost?page=1>; rel="previous", <http://localhost?page=3>; rel="next"';
    expect(calculatePaginationLinks(2, baseUrl)).toBe(expectedResult);
  });
});
