import type { AsyncThunk, SerializedError } from '@reduxjs/toolkit';

import type { AppDispatch, AppState } from '@app/app/store';

export interface ApiError {
  errors: Record<string, string[]>;
}

export enum Status {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  FAILURE = 'failure',
}

export interface SliceState extends Partial<ApiError> {
  /**
   * @default Status.IDLE
   */
  status: Status;
}

export type ThunkApiConfig<
  Meta extends {
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
  } = Record<string, unknown>,
> = {
  state: AppState;
  dispatch: AppDispatch;
  extra: unknown;
  rejectValue: ApiError;
  serializedErrorType: SerializedError;
} & Meta;

type MyAsyncThunk<
  Payload,
  Argument = unknown,
  Meta extends {
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
  } = Record<string, unknown>,
> = AsyncThunk<Payload, Argument, ThunkApiConfig<Meta>>;

export type PendingAction<
  Argument = unknown,
  Meta extends {
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
  } = Record<string, unknown>,
> = ReturnType<MyAsyncThunk<undefined, Argument, Meta>['pending']>;

export type FulfilledAction<
  Payload,
  Argument = unknown,
  Meta extends {
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
  } = Record<string, unknown>,
> = ReturnType<MyAsyncThunk<Payload, Argument, Meta>['fulfilled']>;

export type RejectedAction<
  Argument = unknown,
  Meta extends {
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta: ApiError;
  } = { rejectedMeta: ApiError },
> = ReturnType<MyAsyncThunk<undefined, Argument, Meta>['rejected']>;
