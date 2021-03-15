import { configureStore } from '@reduxjs/toolkit';

import articlesSlice, {
  ARTICLES_FEATURE_KEY,
} from '@app/store/slices/articles.slice';

const store = configureStore({
  devTools: true,
  reducer: {
    [ARTICLES_FEATURE_KEY]: articlesSlice,
  },
});

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
