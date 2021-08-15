import {
  EntityState,
  Selector,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';

import { clearErrors } from '@app/common/actions';
import { SliceState, Status } from '@app/common/types';
import * as articlesApi from '@app/features/articles/articles-api';
import type { AppState } from '@app/store';

export type Tab = 'feed' | 'all';

export interface ArticlesState
  extends EntityState<articlesApi.Article>,
    SliceState {
  articlesCount: number;
  currentPage: number;
  articlesPerPage: number;
  tab?: Tab;
}

const articlesAdapter = createEntityAdapter<articlesApi.Article>({
  selectId: (article) => article.slug,
});

export const getAllArticles = createAsyncThunk(
  `articles/getAllArticles`,
  articlesApi.getAll,
  {
    condition: (_, { getState }) => !selectIsLoading(getState()),
  },
);

const initialState: ArticlesState = articlesAdapter.getInitialState({
  articlesCount: 0,
  currentPage: 0,
  articlesPerPage: 10,
  status: Status.IDLE,
});

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllArticles.pending, (state, action) => {
      state.status = Status.LOADING;
      state.currentPage = action.meta.arg.page ?? 0;
    });

    builder.addCase(getAllArticles.fulfilled, (state, action) => {
      articlesAdapter.setAll(state, action.payload.articles);
      state.articlesCount = action.payload.articlesCount;
      state.status = Status.SUCCESS;
    });

    builder.addCase(clearErrors, (state) => {
      delete state.errors;
    });
  },
});

function selectArticlesSlice(state: AppState): ArticlesState {
  return state.articles;
}

const articleSelectors = articlesAdapter.getSelectors(selectArticlesSlice);

export const selectAllArticles = articleSelectors.selectAll;

export function selectIsLoading(state: AppState): boolean {
  return selectArticlesSlice(state).status === Status.LOADING;
}

export function selectIsSuccess(state: AppState): boolean {
  return selectArticlesSlice(state).status === Status.SUCCESS;
}

export function selectArticlesCount(state: AppState): number {
  return selectArticlesSlice(state).articlesCount;
}

export function selectCurrentPage(state: AppState): number {
  return selectArticlesSlice(state).currentPage;
}

export function selectArticlesPerPage(state: AppState): number {
  return selectArticlesSlice(state).articlesPerPage;
}

export const selectIsActiveTab =
  (tab: Tab): Selector<AppState, boolean> =>
  (state) =>
    selectArticlesSlice(state).tab === tab;

export default articlesSlice.reducer;
