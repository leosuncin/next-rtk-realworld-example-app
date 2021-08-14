import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import faker from 'faker';
import { setupServer } from 'msw/node';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import type { NextRouter } from 'next/router';
import { Provider } from 'react-redux';

import {
  loginFactory,
  loginHandler,
  userFactory,
} from '@app/features/auth/auth-mocks';
import { constrains } from '@app/features/auth/signin-form';
import LoginPage from '@app/pages/login';
import { makeStore } from '@app/store';

const server = setupServer(loginHandler);

describe('<LoginPage />', () => {
  const routerMocked: jest.Mocked<NextRouter> = {
    pathname: '/login',
    route: '/login',
    isPreview: false,
    query: {},
    asPath: '/login',
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

  afterEach(() => {
    routerMocked.replace.mockReset();
  });

  afterAll(() => {
    server.close();
  });

  it('should render', () => {
    const { baseElement } = render(
      <RouterContext.Provider value={routerMocked}>
        <Provider store={makeStore()}>
          <LoginPage />
        </Provider>
      </RouterContext.Provider>,
    );

    expect(baseElement).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it('should redirect if already logged', () => {
    const { token, ...user } = userFactory.build();

    render(
      <RouterContext.Provider value={routerMocked}>
        <Provider store={makeStore({ auth: { token, user } })}>
          <LoginPage />
        </Provider>
      </RouterContext.Provider>,
    );

    expect(routerMocked.replace).toHaveBeenCalledWith('/');
  });

  it('should submit the form', async () => {
    const data = loginFactory.build();

    render(
      <RouterContext.Provider value={routerMocked}>
        <Provider store={makeStore()}>
          <LoginPage />
        </Provider>
      </RouterContext.Provider>,
    );

    userEvent.type(screen.getByPlaceholderText(/email/i), data.email);
    userEvent.type(screen.getByPlaceholderText(/password/i), data.password);

    userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign in/i }),
      ).not.toBeDisabled();
    });

    expect(screen.queryByTestId('list-error-messages')).not.toBeInTheDocument();
    expect(routerMocked.replace).toHaveBeenCalledTimes(1);
  });

  it('should show the validation error messages', async () => {
    render(
      <RouterContext.Provider value={routerMocked}>
        <Provider store={makeStore()}>
          <LoginPage />
        </Provider>
      </RouterContext.Provider>,
    );

    userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await expect(
      screen.findByText(constrains.email.required),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(constrains.password.required),
    ).resolves.toBeInTheDocument();

    userEvent.type(screen.getByPlaceholderText(/email/i), faker.music.genre());
    userEvent.type(
      screen.getByPlaceholderText(/password/i),
      faker.lorem.word(4),
    );
    userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await expect(
      screen.findByText((constrains.email.pattern as any).message),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText((constrains.password.minLength as any).message),
    ).resolves.toBeInTheDocument();
  });

  it('should list the errors', async () => {
    const data = loginFactory.build({ password: 'password' });

    render(
      <RouterContext.Provider value={routerMocked}>
        <Provider store={makeStore()}>
          <LoginPage />
        </Provider>
      </RouterContext.Provider>,
    );

    userEvent.type(screen.getByPlaceholderText(/email/i), data.email);
    userEvent.type(screen.getByPlaceholderText(/password/i), data.password);

    userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign in/i }),
      ).not.toBeDisabled();
    });

    expect(screen.getByTestId('list-error-messages')).toBeInTheDocument();
    expect(routerMocked.replace).not.toHaveBeenCalled();
  });
});
