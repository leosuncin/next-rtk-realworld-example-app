import {
  CaseReducer,
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import type { AppState } from '@app/app/store';
import { clearErrors } from '@app/common/actions';
import {
  FulfilledAction,
  PendingAction,
  RejectedAction,
  SliceState,
  Status,
} from '@app/common/types';
import { failureReducer, loadingReducer } from '@app/common/utils';
import * as authApi from '@app/features/auth/auth-api';

export interface AuthState extends SliceState {
  user?: authApi.User;
  token?: string;
  status: Status;
}

export const register = createAsyncThunk('auth/register', authApi.register, {
  condition: (_, { getState }) => !selectIsLoading(getState()),
});

export const login = createAsyncThunk('auth/login', authApi.login, {
  condition: (_, { getState }) => !selectIsLoading(getState()),
});

const initialState: AuthState = {
  status: Status.IDLE,
};

const successAuthReducer: CaseReducer<
  AuthState,
  FulfilledAction<authApi.AuthReturned>
> = (state, action) => {
  state.status = Status.SUCCESS;
  state.token = action.payload.token;
  state.user = action.payload.user;
  delete state.errors;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(clearErrors, (state) => {
        delete state.errors;
      })
      .addMatcher(
        (action): action is PendingAction =>
          /auth\/.*\/pending/.test(action.type),
        loadingReducer,
      )
      .addMatcher(
        (action): action is FulfilledAction<authApi.AuthReturned> =>
          /auth\/.*\/fulfilled/.test(action.type),
        successAuthReducer,
      )
      .addMatcher(
        (action): action is RejectedAction =>
          /auth\/.*\/rejected/.test(action.type),
        failureReducer,
      )
      .addMatcher(
        (action) => action.type === HYDRATE,
        (state, action: PayloadAction<AppState>) => ({
          ...state,
          ...action.payload.auth,
        }),
      );
  },
});

function selectAuthSlice(state: AppState): AuthState {
  return state.auth;
}

export function selectUser(state: AppState): AuthState['user'] {
  return selectAuthSlice(state).user;
}

export function selectErrors(state: AppState): AuthState['errors'] {
  return selectAuthSlice(state).errors;
}

export function selectIsLoading(state: AppState): boolean {
  return selectAuthSlice(state).status === Status.LOADING;
}

export const selectIsAuthenticated = createSelector<
  AppState,
  string | undefined,
  authApi.User | undefined,
  boolean
>(
  (state) => selectAuthSlice(state).token,
  selectUser,
  (token, user) => Boolean(token && user),
);

export default authSlice.reducer;
