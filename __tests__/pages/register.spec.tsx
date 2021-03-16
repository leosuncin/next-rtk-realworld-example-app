import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Factory from 'factory.ts';
import * as faker from 'faker';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import type { NextRouter } from 'next/router';
import { Provider } from 'react-redux';

import { constrains } from '@app/components/signup-form';
import type { AuthResponse, ErrorResponse, Register } from '@app/interfaces';
import RegisterPage from '@app/pages/register';
import store from '@app/store';

const register = Factory.Sync.makeFactory<Register>({
  username: Factory.each(() => faker.internet.userName()),
  email: Factory.each(() => faker.internet.exampleEmail()),
  password: Factory.each(() => faker.internet.password()),
});
const user = Factory.Sync.makeFactory<AuthResponse['user']>({
  bio: null,
  image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
  token: Factory.each(() => faker.random.uuid()),
  username: Factory.each(() => faker.internet.userName()),
  email: Factory.each(() => faker.internet.exampleEmail()),
});
const registerHandler = rest.post<{ user: Register }>(
  `${process.env.NEXT_PUBLIC_API_ROOT}/users`,
  (request, response, context) => {
    if (request.body.user.email === 'john@doe.me')
      return response(
        context.status(422),
        context.json({
          errors: {
            email: ['has already been taken'],
          },
        } as ErrorResponse),
      );

    return response(
      context.status(200),
      context.json({
        user: user.build(request.body.user),
      } as AuthResponse),
    );
  },
);
const server = setupServer(registerHandler);

describe('<RegisterPage />', () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it('should render', () => {
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
    const { baseElement } = render(
      <RouterContext.Provider value={routerMocked}>
        <Provider store={store}>
          <RegisterPage />
        </Provider>
      </RouterContext.Provider>,
    );

    expect(baseElement).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it('should submit the form', async () => {
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
    const data = register.build();

    render(
      <RouterContext.Provider value={routerMocked}>
        <Provider store={store}>
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

    render(
      <RouterContext.Provider value={routerMocked}>
        <Provider store={store}>
          <RegisterPage />
        </Provider>
      </RouterContext.Provider>,
    );

    userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await expect(
      screen.findByText(constrains.username.required as string),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(constrains.email.required as string),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(constrains.password.required as string),
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
      screen.findByText((constrains.username.maxLength as any).message),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText((constrains.email.pattern as any).message),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText((constrains.password.minLength as any).message),
    ).resolves.toBeInTheDocument();
  });

  it('should list the errors', async () => {
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
    const data = register.build({ email: 'john@doe.me' });

    render(
      <RouterContext.Provider value={routerMocked}>
        <Provider store={store}>
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
  });
});
