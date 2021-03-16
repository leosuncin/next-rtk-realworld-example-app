import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import * as Factory from 'factory.ts';
import * as faker from 'faker';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import type { NextRouter } from 'next/router';
import { Provider } from 'react-redux';

import type { Article, ArticlesResponse, TagsResponse } from '@app/interfaces';
import IndexPage from '@app/pages/index';
import store from '@app/store';

const authorFactory = Factory.Sync.makeFactory<Article['author']>({
  bio: Factory.Sync.each(() => faker.name.jobDescriptor()),
  following: false,
  image: Factory.Sync.each(() => faker.image.avatar()),
  username: Factory.Sync.each(() => faker.internet.userName()),
});
const articleFactory = Factory.Sync.makeFactory<Article>({
  id: Factory.each((i) => i),
  title: Factory.each((i) => `Article title ${i}`),
  slug: '',
  body: Factory.each(() => faker.lorem.paragraph()),
  createdAt: Factory.each(() => new Date().toISOString()),
  updatedAt: Factory.each(() => new Date().toISOString()),
  description: Factory.each(() => faker.lorem.lines()),
  tagList: Factory.each(() => faker.lorem.words().split(/s+/)),
  author: Factory.each(() => authorFactory.build()),
  favorited: false,
  favoritesCount: Factory.each(() => Math.floor(faker.random.number())),
}).withDerivation1(['title'], 'slug', faker.helpers.slugify);
const articles = articleFactory.buildList(10);
const articlesHandler = rest.get<never, ArticlesResponse>(
  `${process.env.NEXT_PUBLIC_API_ROOT}/articles`,
  (_, response, context) =>
    response(
      context.status(200),
      context.json({
        articles,
        articlesCount: articles.length,
      }),
    ),
);
const tagsHandler = rest.get<never, TagsResponse>(
  `${process.env.NEXT_PUBLIC_API_ROOT}/tags`,
  (_, response, context) => {
    const tags = [
      ...new Set(articles.map((article) => article.tagList).flat()),
    ].slice(0, 10);
    return response(
      context.status(200),
      context.json({
        tags,
      }),
    );
  },
);
const server = setupServer(articlesHandler, tagsHandler);

describe('<IndexPage />', () => {
  const routerMocked: jest.Mocked<NextRouter> = {
    pathname: '/',
    route: '/',
    isPreview: false,
    query: {},
    asPath: '/',
    basePath: '',
    isFallback: false,
    isReady: true,
    isLocaleDomain: true,
    events: { emit: jest.fn(), off: jest.fn(), on: jest.fn() },
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    beforePopState: jest.fn(),
  };

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it('should render', () => {
    const { baseElement } = render(
      <RouterContext.Provider value={routerMocked}>
        <Provider store={store}>
          <IndexPage />
        </Provider>
      </RouterContext.Provider>,
    );

    expect(baseElement).toBeInTheDocument();
    expect(
      screen.getByText(/a place to share your knowledge/i),
    ).toBeInTheDocument();
  });

  it('should list the articles', async () => {
    render(
      <RouterContext.Provider value={routerMocked}>
        <Provider store={store}>
          <IndexPage />
        </Provider>
      </RouterContext.Provider>,
    );

    await waitForElementToBeRemoved(() =>
      screen.getByText(/no articles are here/i),
    );
    await waitForElementToBeRemoved(() => screen.getByText(/loading tags/i));

    expect(screen.getAllByRole('article')).toHaveLength(10);
  });
});
