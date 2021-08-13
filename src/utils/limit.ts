import type { PaginationParameters } from '@app/interfaces';

export function limit({ count = 10, page = 1 }: PaginationParameters) {
  return `limit=${Math.abs(count)}&offset=${page > 0 ? (page - 1) * count : 0}`;
}
