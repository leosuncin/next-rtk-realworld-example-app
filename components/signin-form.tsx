import { RegisterOptions, useForm } from 'react-hook-form';

import type { Login } from '@app/interfaces';

export interface SignInFormProps {
  onLoginUser: (payload: Login) => Promise<unknown>;
}

export const constrains: Record<keyof Login, RegisterOptions> = {
  email: {
    required: "Email can't be blank",
    pattern: {
      message: 'Email is not a valid e-mail address',
      value: /^[\w.!#$%&'*+\\/=?^`{|}~-]+@[a-zA-Z\d](?:[a-zA-Z\d-]{0,61}[a-zA-Z\d])?(?:\.[a-zA-Z\d](?:[a-zA-Z\d-]{0,61}[a-zA-Z\d])?)*$/,
    },
  },
  password: {
    required: "Password can't be blank",
    minLength: {
      message: 'Password is too short (minimum is 5 character)',
      value: 5,
    },
  },
};

function SignInForm({ onLoginUser }: SignInFormProps) {
  const { handleSubmit, register, errors, formState } = useForm<Login>();

  return (
    <form onSubmit={handleSubmit(async (payload) => onLoginUser(payload))}>
      <fieldset>
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
          Sign in
        </button>
      </fieldset>
    </form>
  );
}

export default SignInForm;
