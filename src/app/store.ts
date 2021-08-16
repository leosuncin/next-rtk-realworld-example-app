import {
  CombinedState,
  PreloadedState,
  configureStore,
} from '@reduxjs/toolkit';

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

const store = makeStore();

export type AppDispatch = typeof store.dispatch;

export default store;
