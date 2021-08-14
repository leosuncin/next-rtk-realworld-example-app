import { useForm } from 'react-hook-form';

import type { Register } from '@app/features/auth/auth-api';

export interface SignUpFormProps {
  onRegisterUser: (payload: Register) => Promise<unknown>;
}

export const constrains = {
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
      message: 'Password is too short (minimum is 8 character)',
      value: 8,
    },
    maxLength: {
      message: 'Password is too long (maximum is 72 character)',
      value: 72,
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
      <fieldset disabled={formState.isSubmitting}>
        <div className="form-group">
          <input
            className="form-control form-control-lg"
            type="text"
            placeholder="Username"
            name="username"
            ref={register(constrains.username)}
          />
          {errors.username ? (
            <small className="text-danger">{errors.username.message}</small>
          ) : null}
        </div>

        <div className="form-group">
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
        </div>

        <div className="form-group">
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
        </div>

        <button className="btn btn-lg btn-primary pull-xs-right" type="submit">
          Sign up
        </button>
      </fieldset>
    </form>
  );
}

export default SignUpForm;
