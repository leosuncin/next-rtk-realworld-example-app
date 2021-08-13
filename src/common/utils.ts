import type { Draft } from '@reduxjs/toolkit';

import { RejectedAction, SliceState, Status } from './types';

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
