import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import faker from 'faker';
import { setupServer } from 'msw/node';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import type { NextRouter } from 'next/router';
import { Provider } from 'react-redux';

import { Status } from '@app/common/types';
import {
  registerFactory,
  registerHandler,
  userFactory,
} from '@app/features/auth/auth-mocks';
import { constrains } from '@app/features/auth/signup-form';
import RegisterPage from '@app/pages/register';
import { makeStore } from '@app/store';

const server = setupServer(registerHandler);

describe('<RegisterPage />', () => {
  const routerMocked: jest.Mocked<NextRouter> = {
    pathname: '/register',
    route: '/register',
    isPreview: false,
    query: {},
    asPath: '/register',
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
          <RegisterPage />
        </Provider>
      </RouterContext.Provider>,
    );

    expect(baseElement).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it('should redirect if already logged', () => {
    const { token, ...user } = userFactory.build();
    const store = makeStore({ auth: { status: Status.SUCCESS, token, user } });

    render(
      <RouterContext.Provider value={routerMocked}>
        <Provider store={store}>
          <RegisterPage />
        </Provider>
      </RouterContext.Provider>,
    );

    expect(routerMocked.replace).toHaveBeenCalledWith('/');
  });

  it('should submit the form', async () => {
    const data = registerFactory.build();

    render(
      <RouterContext.Provider value={routerMocked}>
        <Provider store={makeStore()}>
          <RegisterPage />
        </Provider>
      </RouterContext.Provider>,
    );

    userEvent.type(screen.getByPlaceholderText(/your name/i), data.username);
    userEvent.type(screen.getByPlaceholderText(/email/i), data.email);
    userEvent.type(screen.getByPlaceholderText(/password/i), data.password);

    userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign up/i }),
      ).not.toBeDisabled();
    });

    expect(screen.queryByTestId('list-error-messages')).not.toBeInTheDocument();
    expect(routerMocked.replace).toHaveBeenCalledTimes(1);
  });

  it('should show the validation error messages', async () => {
    render(
      <RouterContext.Provider value={routerMocked}>
        <Provider store={makeStore()}>
          <RegisterPage />
        </Provider>
      </RouterContext.Provider>,
    );

    userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await expect(
      screen.findByText(constrains.username.required),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(constrains.email.required),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(constrains.password.required),
    ).resolves.toBeInTheDocument();

    userEvent.type(
      screen.getByPlaceholderText(/your name/i),
      faker.lorem.sentence(20),
    );
    userEvent.type(screen.getByPlaceholderText(/email/i), faker.music.genre());
    userEvent.type(
      screen.getByPlaceholderText(/password/i),
      faker.lorem.word(4),
    );
    userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await expect(
      screen.findByText(constrains.username.maxLength.message),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(constrains.email.pattern.message),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(constrains.password.minLength.message),
    ).resolves.toBeInTheDocument();
  });

  it('should list the errors', async () => {
    const data = registerFactory.build({ email: 'john@doe.me' });

    render(
      <RouterContext.Provider value={routerMocked}>
        <Provider store={makeStore()}>
          <RegisterPage />
        </Provider>
      </RouterContext.Provider>,
    );

    userEvent.type(screen.getByPlaceholderText(/your name/i), data.username);
    userEvent.type(screen.getByPlaceholderText(/email/i), data.email);
    userEvent.type(screen.getByPlaceholderText(/password/i), data.password);

    userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign up/i }),
      ).not.toBeDisabled();
    });

    expect(screen.getByTestId('list-error-messages')).toBeInTheDocument();
    expect(routerMocked.replace).not.toHaveBeenCalled();
  });
});
