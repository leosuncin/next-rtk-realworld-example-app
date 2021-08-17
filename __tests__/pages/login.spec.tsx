import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { getPage } from 'next-page-tester';
import Router from 'next/router';

import { getAllHandler as getArticlesHandler } from '@app/features/articles/articles-mocks';
import { loginFactory, loginHandler } from '@app/features/auth/auth-mocks';
import { getAllHandler as getTagsHandler } from '@app/features/tags/tags-mocks';

jest.mock('next/router', () => ({
  __esModule: true,
  ...jest.requireActual('next/router'),
  default: {},
}));

const server = setupServer(loginHandler, getArticlesHandler, getTagsHandler);

describe('Login page', () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it('should render', async () => {
    const { render } = await getPage({ route: '/login' });

    render();

    expect(
      screen.getByRole('heading', { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it('should list the errors', async () => {
    const data = loginFactory.build();
    const { render } = await getPage({
      route: '/login',
      router: (router) => Object.assign(Router, router),
    });

    render();

    userEvent.type(screen.getByPlaceholderText(/email/i), data.email);
    userEvent.type(screen.getByPlaceholderText(/password/i), data.password);

    userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign in/i }),
      ).not.toBeDisabled();
    });

    expect(
      within(screen.getByRole('main')).getByRole('list'),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('main')).getByRole('listitem'),
    ).toHaveTextContent('email or password is invalid');
    expect(Router.pathname).toBe('/login');
  });

  it('should login and redirect', async () => {
    const data = { email: 'john@doe.me', password: 'Pa$$w0rd!' };
    const { render } = await getPage({
      route: '/login',
      router: (router) => Object.assign(Router, router),
    });

    render();

    userEvent.type(screen.getByPlaceholderText(/email/i), data.email);
    userEvent.type(screen.getByPlaceholderText(/password/i), data.password);
    userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign in/i }),
      ).not.toBeDisabled();
    });

    expect(
      screen.queryByRole('heading', {
        name: 'conduit',
      }),
    ).not.toBeInTheDocument();
    expect(Router.pathname).toBe('/index');
  });
});
