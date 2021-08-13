import type { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import type { Except, RequireAtLeastOne } from 'type-fest';

import type { ThunkApiConfig } from '@app/common/types';
import type { User } from '@app/features/auth/auth-api';

export interface Author extends Omit<User, 'email'> {
  following: boolean;
}

export interface Article {
  title: string;
  slug: string;
  body: string;
  description: string;
  tagList: string[];
  author: Author;
  favorited: boolean;
  favoritesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArticlesResponse {
  articles: Article[];
  articlesCount: number;
}

export type ArticlesSearchParameters = {
  page: number;
};

export interface ArticleResponse {
  article: Article;
}

export type UpdateArticle = RequireAtLeastOne<
  Except<
    Article,
    'author' | 'favorited' | 'favoritesCount' | 'createdAt' | 'updatedAt'
  >,
  'title' | 'description' | 'body' | 'slug'
>;

export type CreateArticle = Pick<
  Article,
  'title' | 'description' | 'body' | 'tagList'
>;

export const getAll: AsyncThunkPayloadCreator<
  ArticlesResponse,
  RequireAtLeastOne<ArticlesSearchParameters>,
  ThunkApiConfig
> = async ({ page }, thunkApi) => {
  const limit = thunkApi.getState().articles.articlesPerPage;
  page = page ? page : thunkApi.getState().articles.currentPage;

  const searchParameters = new URLSearchParams();

  if (Number.isInteger(page)) {
    const offset = page * limit;
    searchParameters.set('limit', String(limit));
    searchParameters.set('offset', String(offset));
  }

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_ROOT
    }/articles?${searchParameters.toString()}`,
    { signal: thunkApi.signal },
  );
  const json: ArticlesResponse = await response.json();

  return json;
};
