import * as Factory from 'factory.ts';
import faker from 'faker';
import { rest } from 'msw';

import type {
  Article,
  ArticlesResponse,
} from '@app/features/articles/articles-api';

const authorFactory = Factory.Sync.makeFactory<Article['author']>({
  username: Factory.Sync.each(() => faker.internet.userName()),
  bio: Factory.Sync.each(() => faker.name.jobDescriptor()),
  image: Factory.Sync.each(() => faker.image.avatar()),
  following: false,
});

export const articleFactory = Factory.Sync.makeFactory<Article>({
  slug: '',
  title: Factory.each((i) => `Article title ${i}`),
  description: Factory.each(() => faker.lorem.lines()),
  body: Factory.each(() => faker.lorem.paragraph()),
  tagList: Factory.each(() => faker.lorem.words().split(/s+/)),
  author: Factory.each(() => authorFactory.build()),
  favorited: false,
  favoritesCount: 1,
  createdAt: Factory.each(() => faker.date.recent().toISOString()),
  updatedAt: Factory.each(() => new Date().toISOString()),
}).withDerivation1(['title'], 'slug', faker.helpers.slugify);

const articles = articleFactory.buildList(10);

export const getAllHandler = rest.get<never, ArticlesResponse>(
  `${process.env.NEXT_PUBLIC_API_ROOT}/articles`,
  (_, response, context) =>
    response(context.json({ articles, articlesCount: 500 }), context.delay()),
);
