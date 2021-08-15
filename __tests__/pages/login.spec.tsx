import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { NextRouter } from 'next/router';

import { loginFactory, loginHandler } from '@app/features/auth/auth-mocks';
import LoginPage from '@app/pages/login';
import { render } from '@app/test-utils';

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
    routerMocked.push.mockReset();
  });

  afterAll(() => {
    server.close();
  });

  it('should render', () => {
    const { baseElement } = render(<LoginPage />);

    expect(baseElement).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it('should submit the form', async () => {
    const data = { email: 'john@doe.me', password: 'Pa$$w0rd!' };

    render(<LoginPage />, { router: routerMocked });

    userEvent.type(screen.getByPlaceholderText(/email/i), data.email);
    userEvent.type(screen.getByPlaceholderText(/password/i), data.password);
    userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign in/i }),
      ).not.toBeDisabled();
    });

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(routerMocked.push).toHaveBeenCalledTimes(1);
  });

  it('should list the errors', async () => {
    const data = loginFactory.build();

    render(<LoginPage />);

    userEvent.type(screen.getByPlaceholderText(/email/i), data.email);
    userEvent.type(screen.getByPlaceholderText(/password/i), data.password);

    userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign in/i }),
      ).not.toBeDisabled();
    });

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(routerMocked.push).not.toHaveBeenCalled();
  });
});
