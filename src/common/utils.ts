import type { ParsedUrlQuery } from 'querystring';

import type { Draft } from '@reduxjs/toolkit';

import { RejectedAction, SliceState, Status } from '@app/common/types';

export function loadingReducer<State extends SliceState>(state: Draft<State>) {
  state.status = Status.LOADING;
}

export function failureReducer<State extends SliceState>(
  state: Draft<State>,
  action: RejectedAction,
) {
  state.status = Status.FAILURE;
  state.errors = action.payload?.errors;
}

export function getCurrentPage(query: ParsedUrlQuery): number {
  const page = Array.isArray(query.page) ? query.page[0] : query.page;

  return Number.parseInt(page, 10) ?? 0;
}
