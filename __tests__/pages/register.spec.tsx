import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import type { NextRouter } from 'next/router';

import {
  registerFactory,
  registerHandler,
} from '@app/features/auth/auth-mocks';
import RegisterPage from '@app/pages/register';
import { render } from '@app/test-utils';

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
    routerMocked.push.mockReset();
  });

  afterAll(() => {
    server.close();
  });

  it('should render', () => {
    const { baseElement } = render(<RegisterPage />);

    expect(baseElement).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it('should submit the form', async () => {
    const data = registerFactory.build();

    render(<RegisterPage />, { router: routerMocked });

    userEvent.type(screen.getByPlaceholderText(/username/i), data.username);
    userEvent.type(screen.getByPlaceholderText(/email/i), data.email);
    userEvent.type(screen.getByPlaceholderText(/password/i), data.password);

    userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign up/i }),
      ).not.toBeDisabled();
    });

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(routerMocked.push).toHaveBeenCalledTimes(1);
  });

  it('should list the errors', async () => {
    const data = registerFactory.build({ email: 'john@doe.me' });

    render(<RegisterPage />, { router: routerMocked });

    userEvent.type(screen.getByPlaceholderText(/username/i), data.username);
    userEvent.type(screen.getByPlaceholderText(/email/i), data.email);
    userEvent.type(screen.getByPlaceholderText(/password/i), data.password);

    userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign up/i }),
      ).not.toBeDisabled();
    });

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(routerMocked.push).not.toHaveBeenCalled();
  });
});
