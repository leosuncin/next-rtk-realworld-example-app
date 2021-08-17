import { screen } from '@testing-library/react';

import { makeStore } from '@app/app/store';
import { Status } from '@app/common/types';
import AuthLayout from '@app/features/auth/auth-layout';
import { userFactory } from '@app/features/auth/auth-mocks';
import { createMockRouter, render } from '@app/test-utils';

describe('<AuthLayout />', () => {
  it('should render the login layout by default', () => {
    render(<AuthLayout />);

    expect(
      screen.getByRole('heading', { name: 'Sign In' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Need an account?' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('should render the register layout', () => {
    render(<AuthLayout isRegister />);

    expect(
      screen.getByRole('heading', { name: 'Sign Up' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Have an account?' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('should show the errors', () => {
    const store = makeStore({
      auth: {
        status: Status.FAILURE,
        errors: {
          'email or password': ['is invalid'],
        },
      },
    });

    render(<AuthLayout />, { store });

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('should redirect when is authenticated', async () => {
    const { token, ...user } = userFactory.build();
    const store = makeStore({
      auth: {
        status: Status.SUCCESS,
        token,
        user,
      },
    });
    const router = createMockRouter('/login');

    jest.spyOn(router, 'push');
    render(<AuthLayout />, { router, store });

    expect(router.push).toHaveBeenCalledWith('/');
  });
});
