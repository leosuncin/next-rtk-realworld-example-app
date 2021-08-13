import {
  DeepPartial,
  combineReducers,
  configureStore,
  getDefaultMiddleware,
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

const persistConfig: PersistConfig<{
  [ARTICLES_FEATURE_KEY]: ArticlesState;
  [TAGS_FEATURE_KEY]: TagsState;
  [AUTH_FEATURE_KEY]: AuthState;
}> = {
  storage,
  key: 'realworld',
  whitelist: [AUTH_FEATURE_KEY],
};

export function makeStore(preloadedState?: PreloadedState) {
  const rootReducer = combineReducers({
    [ARTICLES_FEATURE_KEY]: articlesSlice,
    [TAGS_FEATURE_KEY]: tagsSlice,
    [AUTH_FEATURE_KEY]: authSlice,
  });

  return configureStore({
    devTools: true,
    reducer: persistReducer(persistConfig, rootReducer),
    preloadedState,
    middleware: getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  });
}

const store = makeStore();

export const persistor = persistStore(store);

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export function useDispatch() {
  return _useDispatch<AppDispatch>();
}

export const useSelector: TypedUseSelectorHook<AppState> = _useSelector;

export default store;
