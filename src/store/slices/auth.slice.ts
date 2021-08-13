import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type {
  AuthResponse,
  ErrorResponse,
  Login,
  Register,
  User,
} from '@app/interfaces';
import { Status } from '@app/interfaces/status.enum';
import type { AppState } from '@app/store';
import { clearErrors } from '@app/store/shared.actions';

export interface AuthState {
  user?: User;
  token?: string;
  status: Status;
  errors?: {
    email: string[];
    username: string[];
    ['email or password']: string[];
  };
}

export const AUTH_FEATURE_KEY = 'auth' as const;

export const register = createAsyncThunk<
  AuthResponse['user'],
  Register,
  {
    rejectValue: ErrorResponse['errors'];
    state: AppState;
  }
>(
  'auth/register',
  async (payload, thunkApi) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/users`, {
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: payload }),
      method: 'POST',
      mode: 'cors',
      signal: thunkApi.signal,
    });
    const json = await response.json();

    switch (response.status) {
      case 422:
        return thunkApi.rejectWithValue((json as ErrorResponse).errors);

      default:
        return (json as AuthResponse).user;
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState();
      return state.auth.status !== Status.loading;
    },
  },
);

export const login = createAsyncThunk<
  AuthResponse['user'],
  Login,
  {
    rejectValue: ErrorResponse['errors'];
    state: AppState;
  }
>(
  'auth/login',
  async (payload: Login, thunkApi) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_ROOT}/users/login`,
      {
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: payload }),
        method: 'POST',
        mode: 'cors',
      },
    );
    const json = await response.json();

    switch (response.status) {
      case 422:
        return thunkApi.rejectWithValue((json as ErrorResponse).errors);

      default:
        return (json as AuthResponse).user;
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState()!;
      return state.auth.status !== Status.loading;
    },
  },
);

const authSlice = createSlice<AuthState, any, typeof AUTH_FEATURE_KEY>({
  name: AUTH_FEATURE_KEY,
  initialState: {
    status: Status.notLoaded,
  },
  reducers: {},
  extraReducers: (builder) => {
    function buildLoadingState(state: AuthState) {
      state.status = Status.loading;
    }

    function buildSuccessState(
      _: AuthState,
      action: PayloadAction<AuthResponse['user']>,
    ) {
      const { token, ...user } = action.payload;

      return { status: Status.fulfilled, token, user };
    }

    function buildErrorState(
      state: AuthState,
      action: PayloadAction<
        any,
        string,
        {
          arg: Register | Login;
          requestId: string;
          rejectedWithValue: boolean;
          requestStatus: 'rejected';
          aborted: boolean;
          condition: boolean;
        }
      >,
    ) {
      state.status = Status.error;
      delete state.user;

      if (action.meta.rejectedWithValue) {
        state.errors = action.payload;
      }
    }

    builder.addCase(register.pending, buildLoadingState);
    builder.addCase(register.fulfilled, buildSuccessState);
    builder.addCase(register.rejected, buildErrorState);

    builder.addCase(login.pending, buildLoadingState);
    builder.addCase(login.fulfilled, buildSuccessState);
    builder.addCase(login.rejected, buildErrorState);

    builder.addCase(clearErrors, (state) => {
      delete state.errors;
    });
  },
});

export function selectAuthState(rootState: AppState): AuthState {
  return rootState[AUTH_FEATURE_KEY];
}

export function selectUser(rootState: AppState): AuthState['user'] {
  return selectAuthState(rootState).user;
}

export function selectToken(rootState: AppState): AuthState['token'] {
  return selectAuthState(rootState).token;
}

export default authSlice.reducer;
