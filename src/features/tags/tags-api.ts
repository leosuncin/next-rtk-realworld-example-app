import type { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';

import type { ThunkApiConfig } from '@app/common/types';

export interface TagsResponse {
  tags: string[];
}

export const getAll: AsyncThunkPayloadCreator<
  TagsResponse['tags'],
  void,
  ThunkApiConfig
> = async (_, thunkApi) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/tags`, {
    signal: thunkApi.signal,
  });
  const { tags } = (await response.json()) as TagsResponse;

  return tags;
};
