import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import faker from 'faker';

import { loginFactory } from '@app/features/auth/auth-mocks';
import SignInForm, { constrains } from '@app/features/auth/signin-form';

describe('<SignInForm />', () => {
  const emailPlaceholder = 'Email';
  const passwordPlaceholder = 'Password';

  it('should validate the email field', async () => {
    const handleLoginUser = jest.fn();

    render(<SignInForm onLoginUser={handleLoginUser} />);

    user.click(screen.getByRole('button', { name: /sign in/i }));

    await expect(
      screen.findByText(constrains.email.required),
    ).resolves.toBeInTheDocument();

    user.type(
      screen.getByPlaceholderText(emailPlaceholder),
      faker.internet.userName(),
    );

    await expect(
      screen.findByText(constrains.email.pattern.message),
    ).resolves.toBeInTheDocument();

    expect(handleLoginUser).not.toHaveBeenCalled();
  });

  it('should validate the password field', async () => {
    const handleLoginUser = jest.fn();

    render(<SignInForm onLoginUser={handleLoginUser} />);

    user.click(screen.getByRole('button', { name: /sign in/i }));

    await expect(
      screen.findByText(constrains.password.required),
    ).resolves.toBeInTheDocument();

    user.type(
      screen.getByPlaceholderText(passwordPlaceholder),
      faker.internet.password(7),
    );

    await expect(
      screen.findByText(constrains.password.minLength.message),
    ).resolves.toBeInTheDocument();

    user.type(
      screen.getByPlaceholderText(passwordPlaceholder),
      faker.internet.password(73),
    );

    await expect(
      screen.findByText(constrains.password.maxLength.message),
    ).resolves.toBeInTheDocument();

    expect(handleLoginUser).not.toHaveBeenCalled();
  });

  it('should submit the form', async () => {
    const handleLoginUser = jest.fn(
      async (payload) =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(payload);
          }, 300);
        }),
    );
    const data = loginFactory.build();

    render(<SignInForm onLoginUser={handleLoginUser} />);

    user.type(screen.getByPlaceholderText(emailPlaceholder), data.email);
    user.type(screen.getByPlaceholderText(passwordPlaceholder), data.password);
    user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign in/i }),
      ).not.toBeDisabled();
    });

    expect(handleLoginUser).toHaveBeenCalledWith(data);
  });
});
