import { DeepPartial, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as _useDispatch,
  useSelector as _useSelector,
} from 'react-redux';

import articlesSlice, {
  ARTICLES_FEATURE_KEY,
  ArticlesState,
} from '@app/store/slices/articles.slice';
import authSlice, {
  AUTH_FEATURE_KEY,
  AuthState,
} from '@app/store/slices/auth.slice';
import tagsSlice, {
  TAGS_FEATURE_KEY,
  TagsState,
} from '@app/store/slices/tags.slice';

type PreloadedState = DeepPartial<{
  [ARTICLES_FEATURE_KEY]: ArticlesState;
  [TAGS_FEATURE_KEY]: TagsState;
  [AUTH_FEATURE_KEY]: AuthState;
}>;

export function makeStore(preloadedState?: PreloadedState) {
  return configureStore({
    devTools: true,
    reducer: {
      [ARTICLES_FEATURE_KEY]: articlesSlice,
      [TAGS_FEATURE_KEY]: tagsSlice,
      [AUTH_FEATURE_KEY]: authSlice,
    },
    preloadedState,
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export function useDispatch() {
  return _useDispatch<AppDispatch>();
}

export const useSelector: TypedUseSelectorHook<AppState> = _useSelector;

export default store;
