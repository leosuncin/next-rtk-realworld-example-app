import type { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';

import type { ApiError, ThunkApiConfig } from '@app/common/types';

export interface User {
  email: string;
  username: string;
  bio: string;
  image: string;
}

export interface AuthResponse {
  user: User & {
    token: string;
  };
}

export interface AuthReturned {
  user: User;
  token: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface Register {
  username: string;
  email: string;
  password: string;
}

export const register: AsyncThunkPayloadCreator<
  AuthReturned,
  Register,
  ThunkApiConfig
> = async ({ username, email, password }, thunkApi) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/users`, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user: { username, email, password } }),
    method: 'POST',
    signal: thunkApi.signal,
  });

  if (response.status === 422) {
    const errors = (await response.json()) as ApiError;

    return thunkApi.rejectWithValue(errors);
  }

  const {
    user: { token, ...user },
  } = (await response.json()) as AuthResponse;

  return { token, user };
};

export const login: AsyncThunkPayloadCreator<
  AuthReturned,
  Login,
  ThunkApiConfig
> = async ({ email, password }, thunkApi) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ROOT}/users/login`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: { email, password } }),
      method: 'POST',
      signal: thunkApi.signal,
    },
  );

  if (response.status === 422) {
    const errors = (await response.json()) as ApiError;

    return thunkApi.rejectWithValue(errors);
  }

  const {
    user: { token, ...user },
  } = (await response.json()) as AuthResponse;

  return { token, user };
};
