import {
  AnyAction,
  CombinedState,
  PreloadedState,
  ThunkAction,
  configureStore,
} from '@reduxjs/toolkit';
import {
  SERVE_COOKIES,
  nextReduxCookieMiddleware,
  wrapMakeStore,
} from 'next-redux-cookie-wrapper';
import { createWrapper } from 'next-redux-wrapper';

import articlesSlice, {
  ArticlesState,
} from '@app/features/articles/articles.slice';
import authSlice, { AuthState } from '@app/features/auth/auth.slice';
import tagsSlice, { TagsState } from '@app/features/tags/tags.slice';

export type AppState = {
  articles: ArticlesState;
  tags: TagsState;
  auth: AuthState;
};

export function makeStore(
  preloadedState?: PreloadedState<CombinedState<AppState>>,
) {
  return configureStore({
    devTools: true,
    reducer: {
      articles: articlesSlice,
      tags: tagsSlice,
      auth: authSlice,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [SERVE_COOKIES],
        },
      }),
      nextReduxCookieMiddleware({
        subtrees: [`auth.token`, 'auth.user'],
      }),
    ],
  });
}

export type AppStore = ReturnType<typeof makeStore>;

export type AppDispatch = AppStore['dispatch'];

export type AppThunkAction<ReturnType = Promise<void>> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  AnyAction
>;

export const wrapper = createWrapper(wrapMakeStore(() => makeStore()));
