import {
  EntityState,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import type {
  Article,
  ArticlesResponse,
  ErrorResponse,
  PaginationParameters,
} from '@app/interfaces';
import { Status } from '@app/interfaces/status.enum';
import type { AppState } from '@app/store';
import { clearErrors } from '@app/store/shared.actions';
import { limit } from '@app/utils/limit';

export const ARTICLES_FEATURE_KEY = 'articles' as const;

export interface ArticlesState extends EntityState<Article> {
  status: Status;
  articlesCount: number;
  errors?: ErrorResponse['errors'];
}

const articlesAdapter = createEntityAdapter<Article>({
  selectId: (article) => article.slug,
  sortComparer: (a, b) => (a.updatedAt > b.updatedAt ? -1 : 1),
});

const initialState: ArticlesState = articlesAdapter.getInitialState({
  status: Status.notLoaded,
  articlesCount: 0,
});

export const fetchAll = createAsyncThunk<
  ArticlesResponse,
  PaginationParameters | undefined,
  {
    rejectValue: ErrorResponse['errors'];
    state: AppState;
  }
>(
  `${ARTICLES_FEATURE_KEY}/fetchAll`,
  async (pagination, thunkApi) => {
    const { count = 10, page = 1 } = pagination ?? {};
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_ROOT}/articles?${limit({
        count,
        page,
      })}`,
      { signal: thunkApi.signal },
    );
    const json = await response.json();

    if (!response.ok)
      return thunkApi.rejectWithValue((json as ErrorResponse).errors);

    return json as ArticlesResponse;
  },
  {
    condition: (_, { getState }) => {
      const {
        articles: { status, articlesCount },
      } = getState();

      return (
        status !== Status.fulfilled || selectTotal(getState()) < articlesCount
      );
    },
  },
);

const articlesSlice = createSlice({
  name: ARTICLES_FEATURE_KEY,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAll.pending, (state) => {
      state.status = Status.loading;
    });

    builder.addCase(fetchAll.fulfilled, (state, action) => {
      state.articlesCount = action.payload.articlesCount;
      state.status =
        state.ids.length >= action.payload.articlesCount
          ? Status.fulfilled
          : Status.loaded;
      articlesAdapter.addMany(state, action.payload.articles);
    });

    builder.addCase(fetchAll.rejected, (state, action) => {
      state.status = Status.error;
      if (action.meta.rejectedWithValue) {
        state.errors = action.payload;
      }
    });

    builder.addCase(clearErrors, (state) => {
      delete state.errors;
    });
  },
});

const { selectAll, selectById, selectTotal } = articlesAdapter.getSelectors(
  (state: AppState) => state.articles,
);

export const selectArticles = ({
  count = 10,
  page = 1,
}: PaginationParameters = {}) =>
  createSelector(selectAll, (articles) => {
    const start = page > 0 ? (page - 1) * count : 0;
    const end = start + count;

    return articles.slice(start, end);
  });

export const selectArticle = (slug: Article['slug']) => (state: AppState) =>
  selectById(state, slug);

export const selectArticlesCount = (state: AppState) =>
  state.articles.articlesCount;

export default articlesSlice.reducer;
