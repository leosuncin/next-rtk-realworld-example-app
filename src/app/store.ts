import {
  AnyAction,
  CombinedState,
  PreloadedState,
  ThunkAction,
  configureStore,
} from '@reduxjs/toolkit';
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

export const wrapper = createWrapper(() => makeStore());
