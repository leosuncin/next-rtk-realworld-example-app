import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TagsResponse } from '@app/interfaces';
import { Status } from '@app/interfaces/status.enum';
import type { AppState } from '@app/store';

export const TAGS_FEATURE_KEY = 'tags' as const;

export interface TagsState {
  tags: string[];
  status: Exclude<Status, 'fulfilled'>;
}

const initialState: TagsState = {
  status: Status.notLoaded,
  tags: [],
};

export const fetchAll = createAsyncThunk<
  TagsResponse['tags'],
  undefined,
  {
    state: AppState;
  }
>(
  `${TAGS_FEATURE_KEY}/fetchAll`,
  async (_: any, thunkApi) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/tags`, {
      signal: thunkApi.signal,
    });
    const json = await response.json();

    return (json as TagsResponse).tags;
  },
  {
    condition: (_, { getState }) => getState().tags.status !== 'loaded',
  },
);

const tagsSlice = createSlice({
  name: TAGS_FEATURE_KEY,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAll.pending, (state) => {
      state.status = Status.loading;
    });

    builder.addCase(fetchAll.fulfilled, (state, action) => {
      state.status = Status.loaded;
      state.tags = action.payload;
    });

    builder.addCase(fetchAll.rejected, (state) => {
      state.status = Status.error;
    });
  },
});

export const selectTagsState = (state: AppState): TagsState => state.tags;

export const selectTags = (state: AppState): TagsState['tags'] =>
  selectTagsState(state).tags;

export default tagsSlice.reducer;
