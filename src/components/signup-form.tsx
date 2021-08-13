import { RegisterOptions, useForm } from 'react-hook-form';

import type { Register } from '@app/interfaces';

export interface SignUpFormProps {
  onRegisterUser: (payload: Register) => Promise<unknown>;
}

export const constrains: Record<keyof Register, RegisterOptions> = {
  username: {
    required: "Username can't be blank",
    minLength: {
      message: 'Username is too short (minimum is 1 character)',
      value: 1,
    },
    maxLength: {
      message: 'Username is too long (maximum is 20 characters)',
      value: 20,
    },
  },
  password: {
    required: "Password can't be blank",
    minLength: {
      message: 'Password is too short (minimum is 5 character)',
      value: 5,
    },
  },
  email: {
    required: "Email can't be blank",
    pattern: {
      message: 'Email is not a valid e-mail address',
      value: /^[\w.!#$%&'*+\\/=?^`{|}~-]+@[a-zA-Z\d](?:[a-zA-Z\d-]{0,61}[a-zA-Z\d])?(?:\.[a-zA-Z\d](?:[a-zA-Z\d-]{0,61}[a-zA-Z\d])?)*$/,
    },
  },
};

function SignUpForm({ onRegisterUser }: SignUpFormProps) {
  const { handleSubmit, register, errors, formState } = useForm<Register>();

  return (
    <form onSubmit={handleSubmit(async (payload) => onRegisterUser(payload))}>
      <fieldset className="form-group">
        <input
          className="form-control form-control-lg"
          type="text"
          placeholder="Your Name"
          name="username"
          ref={register(constrains.username)}
        />
        {errors.username ? (
          <small className="text-danger">{errors.username.message}</small>
        ) : null}
      </fieldset>

      <fieldset className="form-group">
        <input
          className="form-control form-control-lg"
          type="email"
          placeholder="Email"
          name="email"
          ref={register(constrains.email)}
        />
        {errors.email ? (
          <small className="text-danger">{errors.email.message}</small>
        ) : null}
      </fieldset>

      <fieldset className="form-group">
        <input
          className="form-control form-control-lg"
          type="password"
          placeholder="Password"
          name="password"
          ref={register(constrains.password)}
        />
        {errors.password ? (
          <small className="text-danger">{errors.password.message}</small>
        ) : null}
      </fieldset>

      <button
        className="btn btn-lg btn-primary pull-xs-right"
        type="submit"
        disabled={formState.isSubmitting}
      >
        Sign up
      </button>
    </form>
  );
}

export default SignUpForm;
