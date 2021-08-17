import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { getPage } from 'next-page-tester';
import Router from 'next/router';

import { getAllHandler as getArticlesHandler } from '@app/features/articles/articles-mocks';
import {
  registerFactory,
  registerHandler,
} from '@app/features/auth/auth-mocks';
import { getAllHandler as getTagsHandler } from '@app/features/tags/tags-mocks';

jest.mock('next/router', () => ({
  __esModule: true,
  ...jest.requireActual('next/router'),
  default: {},
}));

const server = setupServer(registerHandler, getArticlesHandler, getTagsHandler);

describe('Register page', () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it('should render', async () => {
    const { render } = await getPage({ route: '/register' });

    render();

    expect(
      screen.getByRole('heading', { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it('should list the errors', async () => {
    const data = registerFactory.build({ email: 'john@doe.me' });
    const { render } = await getPage({
      route: '/register',
      router: (router) => Object.assign(Router, router),
    });

    render();

    userEvent.type(screen.getByPlaceholderText(/username/i), data.username);
    userEvent.type(screen.getByPlaceholderText(/email/i), data.email);
    userEvent.type(screen.getByPlaceholderText(/password/i), data.password);

    userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign up/i }),
      ).not.toBeDisabled();
    });

    expect(
      within(screen.getByRole('main')).getByRole('list'),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('main')).getByRole('listitem'),
    ).toHaveTextContent('email has already been taken');
    expect(Router.pathname).toBe('/register');
  });

  it('should submit the form', async () => {
    const data = registerFactory.build();
    const { render } = await getPage({
      route: '/register',
      router: (router) => Object.assign(Router, router),
    });

    render();

    userEvent.type(screen.getByPlaceholderText(/username/i), data.username);
    userEvent.type(screen.getByPlaceholderText(/email/i), data.email);
    userEvent.type(screen.getByPlaceholderText(/password/i), data.password);

    userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign up/i }),
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
