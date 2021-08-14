import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import faker from 'faker';

import { registerFactory } from '@app/features/auth/auth-mocks';
import SignUpForm, { constrains } from '@app/features/auth/signup-form';

describe('<SignUpForm />', () => {
  const usernamePlaceholder = 'Username';
  const emailPlaceholder = 'Email';
  const passwordPlaceholder = 'Password';

  it('should validate the username field', async () => {
    const handleRegisterUser = jest.fn();

    render(<SignUpForm onRegisterUser={handleRegisterUser} />);

    user.click(screen.getByRole('button', { name: /sign up/i }));

    await expect(
      screen.findByText(constrains.username.required),
    ).resolves.toBeInTheDocument();

    user.type(
      screen.getByPlaceholderText(usernamePlaceholder),
      faker.lorem.paragraph(),
    );

    await expect(
      screen.findByText(constrains.username.maxLength.message),
    ).resolves.toBeInTheDocument();

    expect(handleRegisterUser).not.toHaveBeenCalled();
  });

  it('should validate the email field', async () => {
    const handleRegisterUser = jest.fn();

    render(<SignUpForm onRegisterUser={handleRegisterUser} />);

    user.click(screen.getByRole('button', { name: /sign up/i }));

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

    expect(handleRegisterUser).not.toHaveBeenCalled();
  });

  it('should validate the password field', async () => {
    const handleRegisterUser = jest.fn();

    render(<SignUpForm onRegisterUser={handleRegisterUser} />);

    user.click(screen.getByRole('button', { name: /sign up/i }));

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

    expect(handleRegisterUser).not.toHaveBeenCalled();
  });

  it('should submit the form', async () => {
    const handleRegisterUser = jest.fn(
      async (payload) =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(payload);
          }, 300);
        }),
    );
    const data = registerFactory.build();

    render(<SignUpForm onRegisterUser={handleRegisterUser} />);

    user.type(screen.getByPlaceholderText(usernamePlaceholder), data.username);
    user.type(screen.getByPlaceholderText(emailPlaceholder), data.email);
    user.type(screen.getByPlaceholderText(passwordPlaceholder), data.password);
    user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign up/i }),
      ).not.toBeDisabled();
    });

    expect(handleRegisterUser).toHaveBeenCalledWith(data);
  });
});
