import {
  CombinedState,
  PreloadedState,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as _useDispatch,
  useSelector as _useSelector,
} from 'react-redux';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  PersistConfig,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

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

const persistConfig: PersistConfig<AppState> = {
  storage,
  key: 'realworld',
  whitelist: ['auth'],
};

export function makeStore(
  preloadedState?: PreloadedState<CombinedState<AppState>>,
) {
  const rootReducer = combineReducers({
    articles: articlesSlice,
    tags: tagsSlice,
    auth: authSlice,
  });

  return configureStore({
    devTools: true,
    reducer: persistReducer(persistConfig, rootReducer),
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
}

const store = makeStore();

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;

export function useDispatch() {
  return _useDispatch<AppDispatch>();
}

export const useSelector: TypedUseSelectorHook<AppState> = _useSelector;

export default store;
