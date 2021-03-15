import type { ParsedUrlQuery } from 'querystring';

export function getCurrentPage(query: ParsedUrlQuery): number {
  const page = Array.isArray(query.page) ? query.page[0] : query.page;

  return Number.parseInt(page, 10) || 1;
}
