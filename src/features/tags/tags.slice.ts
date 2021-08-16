import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { AppState } from '@app/app/store';
import { SliceState, Status } from '@app/common/types';
import { loadingReducer } from '@app/common/utils';
import * as tagsApi from '@app/features/tags/tags-api';

export interface TagsState extends SliceState, tagsApi.TagsResponse {}

const initialState: TagsState = {
  status: Status.IDLE,
  tags: [],
};

export const getAllTags = createAsyncThunk(`tags/getAllTags`, tagsApi.getAll, {
  condition: (_, { getState }) => !selectIsLoading(getState()),
});

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllTags.pending, loadingReducer);

    builder.addCase(getAllTags.fulfilled, (state, action) => {
      state.status = Status.SUCCESS;
      state.tags = action.payload;
    });
  },
});

const selectTagsSlice = (state: AppState): TagsState => state.tags;

export function selectTags(state: AppState): TagsState['tags'] {
  return selectTagsSlice(state).tags;
}

export function selectIsLoading(state: AppState): boolean {
  return state.tags.status === Status.LOADING;
}

export default tagsSlice.reducer;
