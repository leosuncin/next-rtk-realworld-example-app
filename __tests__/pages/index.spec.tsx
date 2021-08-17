import { screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { getPage } from 'next-page-tester';

import { getAllHandler as getArticlesHandler } from '@app/features/articles/articles-mocks';
import { getAllHandler as getTagsHandler } from '@app/features/tags/tags-mocks';

const server = setupServer(getArticlesHandler, getTagsHandler);

describe('Home page', () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it('should render', async () => {
    const { render } = await getPage({ route: '/' });

    render();

    expect(
      screen.getByText(/a place to share your knowledge/i),
    ).toBeInTheDocument();
  });
});
